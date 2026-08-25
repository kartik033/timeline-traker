import React, { useState } from 'react';
import { UserPlus, LogIn, X, ShieldCheck } from 'lucide-react';

export default function AuthBanner({ isGuest, authError, onSignUp, onSignIn, onGoogleSignIn, onSignOut, userEmail }) {
  const [mode, setMode] = useState(null); // null | 'signup' | 'signin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dismissed, setDismissed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const closeForm = () => {
    setMode(null);
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const action = mode === 'signup' ? onSignUp : onSignIn;
    const result = await action(email, password);
    setSubmitting(false);
    if (result.success) closeForm();
  };

  const handleGoogleSignIn = async () => {
    await onGoogleSignIn();
  };

  if (!isGuest && !userEmail && authError) {
    return (
      <div className="glass-panel rounded-2xl p-4 mb-5 panel-animate">
        <p className="text-sm font-semibold text-red-700">Authentication failed</p>
        <p className="mt-1 text-xs text-red-600">{authError}</p>
      </div>
    );
  }

  // Registered user: show a small account chip instead of the banner.
  if (!isGuest) {
    return (
      <div className="panel-animate flex items-center justify-between text-xs text-white/80 mb-3 px-1">
        <span className="flex items-center gap-1.5">
          <ShieldCheck size={13} aria-hidden="true" />
          Signed in{userEmail ? ` as ${userEmail}` : ''} — your data syncs across devices.
        </span>
        <button onClick={onSignOut} className="underline hover:text-white transition-colors">
          Sign out
        </button>
      </div>
    );
  }

  if (dismissed && !mode) {
    return (
      <div className="flex justify-end mb-5 panel-animate">
        <button
          onClick={() => setDismissed(false)}
          className="flex items-center gap-1.5 rounded-xl bg-white/90 px-3 py-2 text-sm font-semibold text-blue-700 shadow-sm hover:bg-white"
        >
          <UserPlus size={15} aria-hidden="true" />
          Sign up or log in
        </button>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl p-4 mb-5 panel-animate">
      {!mode ? (
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-gray-700 leading-snug">
            You're using <strong>guest mode</strong>. Data stays only on this browser — sign up to
            save it permanently and access it anywhere.
          </p>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-gray-400 hover:text-gray-600 flex-shrink-0"
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <h3 className="text-sm font-bold text-gray-800">
            {mode === 'signup' ? 'Create an account' : 'Log in'}
          </h3>
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {authError && <p className="text-xs text-red-600">{authError}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={closeForm}
              className="flex-1 bg-gray-100 text-gray-700 font-semibold py-2 rounded-xl text-sm hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-[2] bg-blue-600 text-white font-semibold py-2 rounded-xl text-sm hover:bg-blue-700 disabled:opacity-60"
            >
              {submitting ? 'Please wait...' : mode === 'signup' ? 'Sign Up' : 'Log In'}
            </button>
          </div>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full rounded-xl border border-gray-200 bg-white py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Continue with Google
          </button>
        </form>
      )}

      {!mode && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setMode('signup')}
            className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 text-white font-semibold py-2 rounded-xl text-sm hover:bg-blue-700"
          >
            <UserPlus size={14} aria-hidden="true" /> Sign Up
          </button>
          <button
            onClick={() => setMode('signin')}
            className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 text-gray-700 font-semibold py-2 rounded-xl text-sm hover:bg-gray-200"
          >
            <LogIn size={14} aria-hidden="true" /> Log In
          </button>
          <button
            onClick={handleGoogleSignIn}
            className="flex-1 rounded-xl border border-gray-200 bg-white py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Google
          </button>
        </div>
      )}
    </div>
  );
}