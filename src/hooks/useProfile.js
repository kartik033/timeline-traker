import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const MAX_RETRIES = 4;
const RETRY_DELAY_MS = 600;

export function useProfile(userId, isGuest) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (retriesLeft = MAX_RETRIES) => {
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
      .maybeSingle();

    if (!error && data) {
      setProfile(data);
      setLoading(false);
      return;
    }

    if (retriesLeft > 0) {
      setTimeout(() => fetchProfile(retriesLeft - 1), RETRY_DELAY_MS);
    } else {
      setLoading(false);
    }
  }, [userId, isGuest]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Upsert instead of update: if the row is somehow missing (trigger
  // failure, race condition, pre-existing account), this creates it
  // instead of throwing "cannot coerce to a single JSON object".
  const updateProfile = useCallback(async (updates) => {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: userId, ...updates }, { onConflict: 'id' })
      .select()
      .maybeSingle();
    if (!error && data) setProfile(data);
    return { success: !error, error: error?.message };
  }, [userId]);

  const uploadAvatar = useCallback(async (file) => {
    const ext = file.name.split('.').pop();
    const path = `${userId}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true, contentType: file.type });

    if (uploadError) return { success: false, error: uploadError.message };

    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path);
    const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`;

    return updateProfile({ avatar_url: avatarUrl });
  }, [userId, updateProfile]);

  return { profile, loading, updateProfile, uploadAvatar, refetch: fetchProfile };
}