import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from './hooks/useAuth';
import { useEvents } from './hooks/useEvents';
import { useProfile } from './hooks/useProfile';
import { useGuestTimeout } from './hooks/useGuestTimeout';
import { colorThemes, pickThemeFor, pickIconFor } from './utils/themes';
import { formatForInput } from './utils/dateHelpers';
import { shareOrGetImage } from './utils/exportImage';

import Header from './components/Header';
import AuthBanner from './components/AuthBanner';
import ProfileModal from './components/ProfileModal';
import SharePreviewModal from './components/SharePreviewModal';
import CompareTool from './components/CompareTool';
import EventForm from './components/EventForm';
import EventList from './components/EventList';
import DeleteModal from './components/DeleteModal';
import Toast from './components/Toast';
import Footer from './components/Footer';
import DeleteAccountModal from './components/DeleteAccountModal';

export default function App() {
 const {
  userId, isGuest, loading: authLoading, authError,
  signUpFromGuest, signInWithPassword, signInWithGoogle, signOut,
  deleteAccount, logGuestActivity, session,
} = useAuth();

  const {
    events,
    loading: eventsLoading,
    addEvent,
    updateEvent,
    deleteEvent,
    restoreEvent,
    bulkReplace,
    migrateGuestEventsToAccount,
    clearEvents,
  } = useEvents(userId, isGuest, colorThemes);

  const { profile, updateProfile, uploadAvatar } = useProfile(userId, isGuest);

  useGuestTimeout(isGuest, clearEvents);

  const eventListRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [newEventName, setNewEventName] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [compareId1, setCompareId1] = useState('');
  const [compareId2, setCompareId2] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [shareDataUrl, setShareDataUrl] = useState(null);
  const [sharing, setSharing] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);

  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const undoTimeoutRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const msUntilNextMinute = 60000 - (Date.now() % 60000);
    const alignTimer = setTimeout(() => {
      setCurrentTime(new Date());
      intervalRef.current = setInterval(() => setCurrentTime(new Date()), 60000);
    }, msUntilNextMinute);
    return () => {
      clearTimeout(alignTimer);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => () => clearTimeout(undoTimeoutRef.current), []);

  const handleDeleteAccount = async () => {
    const result = await deleteAccount();
    if (result.success) {
      setIsDeleteAccountOpen(false);
      setIsProfileOpen(false);
      clearEvents();
    }
    return result;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newEventName || !newEventDate) return;

    if (editingId) {
      await updateEvent(editingId, {
        name: newEventName,
        date: new Date(newEventDate).toISOString(),
      });
    } else {
      const theme = pickThemeFor(newEventName, events);
      const icon = pickIconFor(newEventName);
      await addEvent({
        id: Date.now(),
        name: newEventName,
        date: new Date(newEventDate).toISOString(),
        theme,
        icon,
        hasO: false,
      });
    }
    resetForm();
  };

  const requestDelete = (id) => setDeleteConfirmId(id);

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    const index = events.findIndex((ev) => ev.id === deleteConfirmId);
    const eventToDelete = events[index];

    await deleteEvent(deleteConfirmId);
    if (editingId === deleteConfirmId) resetForm();
    if (compareId1 === deleteConfirmId.toString() || compareId2 === deleteConfirmId.toString()) {
      setCompareId1('');
      setCompareId2('');
    }
    setDeleteConfirmId(null);

    clearTimeout(undoTimeoutRef.current);
    setPendingDelete({ event: eventToDelete, index });
    undoTimeoutRef.current = setTimeout(() => {
      setPendingDelete(null);
    }, 5000); // toast disappears after 5s if not undone
  };

  const undoDelete = async () => {
    if (!pendingDelete) return;
    clearTimeout(undoTimeoutRef.current);
    await restoreEvent(pendingDelete.event);
    setPendingDelete(null);
  };

  const dismissToast = () => setPendingDelete(null);

  const handleEdit = (event) => {
    setNewEventName(event.name);
    setNewEventDate(formatForInput(event.date));
    setEditingId(event.id);
    setIsFormOpen(true);
    setIsCompareOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setNewEventName('');
    setNewEventDate('');
    setEditingId(null);
    setIsFormOpen(false);
  };

  const toggleCompare = () => {
    setIsCompareOpen(!isCompareOpen);
    if (!isCompareOpen) resetForm();
  };

  const toggleAdd = () => {
    if (isFormOpen) resetForm();
    else {
      setIsFormOpen(true);
      setIsCompareOpen(false);
    }
  };

  const handleShareImage = async () => {
    if (!eventListRef.current || sharing) return;
    setSharing(true);
    try {
      const result = await shareOrGetImage(eventListRef.current, 'my-timeline.png');
      if (!result.shared && !result.cancelled) {
        setShareDataUrl(result.dataUrl);
      }
    } catch (err) {
      console.error('Share failed:', err);
    } finally {
      setSharing(false);
    }
  };

  const handleSignUp = async (email, password) => {
    const result = await signUpFromGuest(email, password);
    if (result.success) {
      const newUserId = result.data?.user?.id ?? userId;
      await migrateGuestEventsToAccount(newUserId);
    }
    return result;
  };

  const handleSignOut = async () => {
    await signOut();
    clearEvents();
  };

  const sortedEvents = [...events].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (authLoading) {
    return (
      <div className="aurora-bg min-h-screen flex items-center justify-center">
        <p className="text-white/70 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="aurora-bg p-3 sm:p-6 font-sans flex flex-col items-center relative">
      <div className="w-full max-w-md">
        <div className="panel-animate">
          <Header
            isCompareOpen={isCompareOpen}
            isFormOpen={isFormOpen}
            isGuest={isGuest}
            avatarUrl={profile?.avatar_url}
            onToggleCompare={toggleCompare}
            onToggleAdd={toggleAdd}
            onShareImage={handleShareImage}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenProfile={() => setIsProfileOpen(true)}
          />
        </div>

       <AuthBanner
  isOpen={isAuthOpen}
  onClose={() => setIsAuthOpen(false)}
  authError={authError}
  onSignUp={handleSignUp}
  onSignIn={signInWithPassword}
  onSignInWithGoogle={signInWithGoogle}
  eventCount={events.length}
  onLogActivity={logGuestActivity}
/>

        {!isGuest && (
          <div className="panel-animate flex justify-end mb-3 -mt-2">
            <button
              onClick={handleSignOut}
              className="text-[11px] text-white/50 hover:text-white/80 underline transition-colors"
            >
              Sign out
            </button>
          </div>
        )}

        {isCompareOpen && (
          <div className="glass-panel rounded-2xl panel-animate">
            <CompareTool
              events={sortedEvents}
              compareId1={compareId1}
              compareId2={compareId2}
              setCompareId1={setCompareId1}
              setCompareId2={setCompareId2}
            />
          </div>
        )}

        {isFormOpen && (
          <div className="glass-panel rounded-2xl panel-animate">
            <EventForm
              editingId={editingId}
              newEventName={newEventName}
              newEventDate={newEventDate}
              setNewEventName={setNewEventName}
              setNewEventDate={setNewEventDate}
              onSubmit={handleSubmit}
              onCancel={resetForm}
            />
          </div>
        )}

        {eventsLoading ? (
          <p className="text-white/70 text-sm text-center py-6">Loading events...</p>
        ) : (
          <div ref={eventListRef}>
            <EventList
              events={sortedEvents}
              currentTime={currentTime}
              onEdit={handleEdit}
              onDeleteRequest={requestDelete}
            />
          </div>
        )}
      </div>

      <Footer />

      {isProfileOpen && (
        <ProfileModal
          profile={profile}
          userEmail={session?.user?.email}
          onClose={() => setIsProfileOpen(false)}
          onUpdateProfile={updateProfile}
          onUploadAvatar={uploadAvatar}
          onRequestDeleteAccount={() => setIsDeleteAccountOpen(true)}
        />
      )}

      {isDeleteAccountOpen && (
        <DeleteAccountModal
          onCancel={() => setIsDeleteAccountOpen(false)}
          onConfirm={handleDeleteAccount}
        />
      )}

      {shareDataUrl && (
        <SharePreviewModal dataUrl={shareDataUrl} onClose={() => setShareDataUrl(null)} />
      )}

      {deleteConfirmId && (
        <DeleteModal onCancel={() => setDeleteConfirmId(null)} onConfirm={confirmDelete} />
      )}

      {pendingDelete && (
        <Toast
          message={`"${pendingDelete.event.name}" deleted.`}
          onUndo={undoDelete}
          onDismiss={dismissToast}
        />
      )}
    </div>
  );
}