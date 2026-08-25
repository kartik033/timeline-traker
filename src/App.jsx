import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useEvents } from './hooks/useEvents';
import { useGuestTimeout } from './hooks/useGuestTimeout';
import { colorThemes, pickIconFor, pickThemeFor } from './utils/themes';
import { formatForInput } from './utils/dateHelpers';

import Header from './components/Header';
import AuthBanner from './components/AuthBanner';
import CompareTool from './components/CompareTool';
import EventForm from './components/EventForm';
import EventList from './components/EventList';
import DeleteModal from './components/DeleteModal';
import Toast from './components/Toast';

export default function App() {
  const { userId, isGuest, loading: authLoading, authError, signUpFromGuest, signInWithPassword, signInWithGoogle, signOut, session } = useAuth();
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

  useGuestTimeout(isGuest, clearEvents);

  const [currentTime, setCurrentTime] = useState(new Date());

  const [newEventName, setNewEventName] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [compareId1, setCompareId1] = useState('');
  const [compareId2, setCompareId2] = useState('');

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
  };

  const undoDelete = async () => {
    if (!pendingDelete) return;
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

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(events, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timeline-tracker-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (file) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (!Array.isArray(imported)) throw new Error('Invalid format');
        await bulkReplace(imported);
      } catch (err) {
        alert('Could not import file: invalid JSON format.');
      }
    };
    reader.readAsText(file);
  };

  const handleSignUp = async (email, password) => {
    const result = await signUpFromGuest(email, password);
    if (result.success) {
      const newUserId = result.data?.user?.id ?? userId;
      await migrateGuestEventsToAccount(newUserId);
    }
    return result;
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
            onToggleCompare={toggleCompare}
            onToggleAdd={toggleAdd}
            onExport={handleExport}
            onImport={handleImport}
          />
        </div>

        <AuthBanner
          isGuest={isGuest}
          authError={authError}
          onSignUp={handleSignUp}
          onSignIn={signInWithPassword}
          onGoogleSignIn={signInWithGoogle}
          onSignOut={signOut}
          userEmail={session?.user?.email}
        />

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
          <EventList
            events={sortedEvents}
            currentTime={currentTime}
            onEdit={handleEdit}
            onDeleteRequest={requestDelete}
          />
        )}
      </div>

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