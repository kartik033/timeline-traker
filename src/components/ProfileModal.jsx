import React, { useEffect, useRef, useState } from 'react';
import { X, Camera, Loader2, Check } from 'lucide-react';

export default function ProfileModal({ profile, onClose, onUpdateProfile, onUploadAvatar, userEmail }) {
  const fileInputRef = useRef(null);
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url || null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Keep local state in sync if `profile` updates from outside (e.g. after
  // the retry-fetch in useProfile resolves).
  useEffect(() => {
    setDisplayName(profile?.display_name || '');
    setBio(profile?.bio || '');
    setAvatarPreview(profile?.avatar_url || null);
  }, [profile]);

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show an instant local preview while the upload happens in the
    // background, so the UI never looks like nothing happened.
    const localPreviewUrl = URL.createObjectURL(file);
    setAvatarPreview(localPreviewUrl);
    setUploading(true);
    setErrorMsg('');

    const result = await onUploadAvatar(file);
    setUploading(false);

    if (!result.success) {
      setErrorMsg(result.error || 'Upload failed. Try a smaller image.');
      setAvatarPreview(profile?.avatar_url || null);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    const result = await onUpdateProfile({ display_name: displayName, bio });
    setSaving(false);
    if (result.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } else {
      setErrorMsg(result.error || 'Could not save profile.');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="glass-panel rounded-2xl p-6 max-w-sm w-full animate-in zoom-in-95">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-900">Your Profile</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col items-center mb-5">
          <button
            onClick={handleAvatarClick}
            className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-200 border-2 border-white shadow-md group"
            aria-label="Change profile picture"
          >
            {avatarPreview ? (
              <img src={avatarPreview} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl font-bold">
                {displayName?.[0]?.toUpperCase() || '?'}
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              {uploading ? (
                <Loader2 size={18} className="text-white animate-spin" />
              ) : (
                <Camera size={18} className="text-white" />
              )}
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
          <p className="text-xs text-gray-500 mt-2">{userEmail}</p>
        </div>

        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">
              Bio (optional)
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. Tracking my Express Entry journey"
              rows={2}
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {errorMsg && (
            <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={saving}
            className={`w-full font-semibold py-2 rounded-xl text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-1.5 ${
              saved ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {saving ? 'Saving...' : saved ? (<><Check size={14} /> Saved</>) : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}