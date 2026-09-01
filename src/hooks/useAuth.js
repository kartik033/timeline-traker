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
        if (window.location.hash.includes('access_token')) {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
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
      if (window.location.hash.includes('access_token')) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
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

  const deleteAccount = useCallback(async () => {
    setAuthError(null);

    if (isGuest) {
      return { success: false, error: 'Guest sessions have nothing to delete.' };
    }

    const accessToken = session?.access_token;
    if (!accessToken) {
      return { success: false, error: 'No active session.' };
    }

    try {
      const { data, error } = await supabase.functions.invoke('delete-account', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (error) {
        setAuthError(error.message);
        return { success: false, error: error.message };
      }
      if (data?.error) {
        setAuthError(data.error);
        return { success: false, error: data.error };
      }

      await supabase.auth.signOut();
      const { data: anonData } = await supabase.auth.signInAnonymously();
      setSession(anonData.session);

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete account.';
      setAuthError(message);
      return { success: false, error: message };
    }
  }, [isGuest, session]);

  // Fire-and-forget activity logger for guest_activity_log. Never throws or
  // blocks the UI — analytics failures should be invisible to the user.
  const logGuestActivity = useCallback(async (action) => {
    const currentUserId = session?.user?.id;
    if (!currentUserId || !action) return;

    const { error } = await supabase
      .from('guest_activity_log')
      .insert({ user_id: currentUserId, action });

    if (error) {
      console.error('logGuestActivity failed:', error.message);
    }
  }, [session]);

  return {
    session,
    userId: session?.user?.id ?? null,
    userEmail: session?.user?.email ?? null,
    isGuest,
    loading,
    authError,
    signUpFromGuest,
    signInWithPassword,
    signInWithGoogle,
    signOut,
    deleteAccount,
    logGuestActivity,
  };
}