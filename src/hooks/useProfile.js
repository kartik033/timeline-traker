import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useProfile(userId, isGuest) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!userId || isGuest) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (!error) setProfile(data);
    setLoading(false);
  }, [userId, isGuest]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = useCallback(async (updates) => {
    const { error } = await supabase.from('profiles').update(updates).eq('id', userId);
    if (!error) await fetchProfile();
    return { success: !error, error: error?.message };
  }, [userId, fetchProfile]);

  const uploadAvatar = useCallback(async (file) => {
    const ext = file.name.split('.').pop();
    const path = `${userId}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true });

    if (uploadError) return { success: false, error: uploadError.message };

    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path);
    // Cache-bust so the new image shows immediately instead of a stale cached one.
    const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`;

    return updateProfile({ avatar_url: avatarUrl });
  }, [userId, updateProfile]);

  return { profile, loading, updateProfile, uploadAvatar, refetch: fetchProfile };
}