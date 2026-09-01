import React, { useState, useEffect, useRef } from 'react';
import { X, Lock, Mail, ArrowRight } from 'lucide-react';

export default function AuthBanner({ isOpen, onClose, authError, onSignUp, onSignIn, onSignInWithGoogle, eventCount, onLogActivity }) {
  const [mode, setMode] = useState('choose'); // 'choose' | 'signup' | 'signin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const hasLoggedView = useRef(false);

  // Log exactly once per time the banner transitions from closed -> open,
  // not on every re-render while it stays open.
  useEffect(() => {
    if (isOpen && !hasLoggedView.current) {
      hasLoggedView.current = true;
      onLogActivity?.('viewed_signup_banner');
    }
    if (!isOpen) {
      hasLoggedView.current = false;
    }
  }, [isOpen, onLogActivity]);

  if (!isOpen) return null;

  const handleClose = () => {
    setMode('choose');
    setEmail('');
    setPassword('');
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const action = mode === 'signup' ? onSignUp : onSignIn;
    const result = await action(email, password);
    setSubmitting(false);
    if (result.success) handleClose();
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden mb-5 panel-animate">
      {mode === 'choose' ? (
        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                <Lock size={15} className="text-blue-700" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 leading-tight">Save your progress</h3>
                <p className="text-xs text-gray-500 mt-0.5 leading-snug">
                  {eventCount > 0
                    ? `Keep ${eventCount} event${eventCount !== 1 ? 's' : ''} safe across devices`
                    : "You're browsing as a guest"}
                </p>
              </div>
            </div>
            <button onClick={handleClose} className="p-1 text-gray-400 hover:text-gray-600 flex-shrink-0" aria-label="Close">
              <X size={16} />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={onSignInWithGoogle}
              className="w-full flex items-center justify-center gap-2.5 bg-white border border-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
            >
              <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#FFC107" d="M43.6 20.5H42V20.5H24v7h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.1 5.1 29.3 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.2-.1-2.4-.4-3.5z"/>
                <path fill="#FF3D00" d="M6.3 14.1l6.5 4.8C14.6 15.1 18.9 12 24 12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.1 5.1 29.3 3 24 3 15.6 3 8.4 7.9 6.3 14.1z"/>
                <path fill="#4CAF50" d="M24 45c5.2 0 9.9-1.7 13.5-4.6l-6.2-5.3c-2 1.5-4.6 2.4-7.3 2.4-5.3 0-9.8-3.6-11.3-8.5l-6.5 5C8.4 40.1 15.6 45 24 45z"/>
                <path fill="#1976D2" d="M43.6 20.5H42V20.5H24v7h11.3c-.8 2.3-2.2 4.2-4 5.5l6.2 5.3C40.8 35.5 44 30.5 44 24c0-1.2-.1-2.4-.4-3.5z"/>
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center gap-2 my-1">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <button
              onClick={() => setMode('signup')}
              className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-800 transition-colors shadow-sm"
            >
              <Mail size={14} aria-hidden="true" />
              Continue with Email
              <ArrowRight size={13} aria-hidden="true" className="opacity-60" />
            </button>
          </div>

          <p className="text-[10px] text-gray-400 text-center mt-3 leading-snug">
            Free forever. No credit card. Takes under a minute.
          </p>

          <button
            onClick={() => setMode('signin')}
            className="w-full text-center text-xs text-gray-500 hover:text-gray-700 mt-3 underline"
          >
            Already have an account? Log in
          </button>
        </div>
      ) : (
        <div className="p-4 sm:p-5">
          <button
            onClick={() => setMode('choose')}
            className="text-xs text-gray-400 hover:text-gray-600 mb-3 flex items-center gap-1"
          >
            ← Back
          </button>
          <h3 className="text-sm font-bold text-gray-900 mb-3">
            {mode === 'signup' ? 'Create your account' : 'Welcome back'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} aria-hidden="true" />
              <input
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} aria-hidden="true" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
              />
            </div>
            {authError && (
              <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{authError}</p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-blue-700 disabled:opacity-60 transition-colors shadow-sm"
            >
              {submitting ? 'Please wait...' : mode === 'signup' ? 'Create Account' : 'Log In'}
            </button>
          </form>
          <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1 mt-3">
            <Lock size={10} aria-hidden="true" /> Your data is encrypted and never shared.
          </p>
        </div>
      )}
    </div>
  );
}