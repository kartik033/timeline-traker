import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useAuth() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const initSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        if (isMounted) {
          setSession(data.session);
          setLoading(false);
        }
        return;
      }

      const { data: anonData, error } = await supabase.auth.signInAnonymously();
      if (isMounted) {
        if (error) setAuthError(error.message);
        else setSession(anonData.session);
        setLoading(false);
      }
    };

    initSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (isMounted) setSession(newSession);
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const isGuest = session?.user?.is_anonymous ?? false;

  const signUpFromGuest = useCallback(async (email, password) => {
    setAuthError(null);
    const { data, error } = await supabase.auth.updateUser({ email, password });
    if (error) {
      setAuthError(error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  }, []);

  const signInWithPassword = useCallback(async (email, password) => {
    setAuthError(null);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  }, []);

  // Redirects to Google's consent screen. On return, onAuthStateChange
  // picks up the new session automatically -- no manual handling needed
  // as long as Supabase's Site URL / Redirect URLs are configured correctly.
  const signInWithGoogle = useCallback(async () => {
    setAuthError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) setAuthError(error.message);
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    const { data } = await supabase.auth.signInAnonymously();
    setSession(data.session);
  }, []);

  return {
    session,
    userId: session?.user?.id ?? null,
    isGuest,
    loading,
    authError,
    signUpFromGuest,
    signInWithPassword,
    signInWithGoogle,
    signOut,
  };
}