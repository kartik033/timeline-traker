import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const rowToEvent = (row, themes) => ({
  id: row.client_id,
  dbId: row.id,
  name: row.name,
  date: row.event_date,
  theme: themes.find((theme) => theme.id === row.theme_id) || themes[0],
  icon: row.icon,
  hasO: row.has_o,
});

/**
 * Guests (isGuest === true): events live ONLY in React state, in memory,
 * and are wiped after 30 minutes of inactivity via clearEvents().
 * Nothing is written to Supabase for guests.
 *
 * Registered users (isGuest === false): events are read/written to the
 * `events` table in Supabase and persist across refreshes/devices.
 */
export function useEvents(userId, isGuest, themes) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async () => {
    if (!userId || isGuest) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', userId)
      .order('event_date', { ascending: false });

    if (fetchError) setError(fetchError.message);
    else setEvents((data || []).map((row) => rowToEvent(row, themes)));
    setLoading(false);
  }, [userId, isGuest, themes]);

  useEffect(() => {
    if (isGuest) {
      setLoading(false);
      return;
    }
    fetchEvents();
  }, [fetchEvents, isGuest]);

  const addEvent = useCallback(async (event) => {
    if (isGuest) {
      setEvents((prev) => [...prev, event]);
      return;
    }
    const { error: insertError } = await supabase.from('events').insert({
      user_id: userId,
      client_id: event.id,
      name: event.name,
      event_date: event.date,
      theme_id: event.theme.id,
      icon: event.icon,
      has_o: event.hasO,
    });
    if (insertError) setError(insertError.message);
    else await fetchEvents();
  }, [userId, isGuest, fetchEvents]);

  const updateEvent = useCallback(async (clientId, updates) => {
    if (isGuest) {
      setEvents((prev) => prev.map((ev) => (ev.id === clientId ? { ...ev, ...updates } : ev)));
      return;
    }
    const { error: updateError } = await supabase
      .from('events')
      .update({ name: updates.name, event_date: updates.date })
      .eq('user_id', userId)
      .eq('client_id', clientId);
    if (updateError) setError(updateError.message);
    else await fetchEvents();
  }, [userId, isGuest, fetchEvents]);

  const deleteEvent = useCallback(async (clientId) => {
    if (isGuest) {
      setEvents((prev) => prev.filter((ev) => ev.id !== clientId));
      return;
    }
    const { error: deleteError } = await supabase
      .from('events')
      .delete()
      .eq('user_id', userId)
      .eq('client_id', clientId);
    if (deleteError) setError(deleteError.message);
    else await fetchEvents();
  }, [userId, isGuest, fetchEvents]);

  const restoreEvent = useCallback((event) => addEvent(event), [addEvent]);

  const bulkReplace = useCallback(async (newEvents) => {
    if (isGuest) {
      setEvents(newEvents);
      return;
    }
    const { error: deleteError } = await supabase.from('events').delete().eq('user_id', userId);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    const rows = newEvents.map((event) => ({
      user_id: userId,
      client_id: event.id,
      name: event.name,
      event_date: event.date,
      theme_id: event.theme.id,
      icon: event.icon,
      has_o: event.hasO,
    }));
    const { error: bulkError } = rows.length
      ? await supabase.from('events').insert(rows)
      : { error: null };
    if (bulkError) setError(bulkError.message);
    else await fetchEvents();
  }, [userId, isGuest, fetchEvents]);

  const migrateGuestEventsToAccount = useCallback(async (newUserId) => {
    if (events.length === 0) return;
    const rows = events.map((event) => ({
      user_id: newUserId,
      client_id: event.id,
      name: event.name,
      event_date: event.date,
      theme_id: event.theme.id,
      icon: event.icon,
      has_o: event.hasO,
    }));
    const { error: migrateError } = await supabase.from('events').insert(rows);
    if (migrateError) setError(migrateError.message);
  }, [events]);

  // Wipes in-memory events. Used for the 30-min guest inactivity timeout.
  // No-op for registered users (their data lives in the DB, not memory).
  const clearEvents = useCallback(() => {
    if (isGuest) setEvents([]);
  }, [isGuest]);

  return {
    events,
    loading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
    restoreEvent,
    bulkReplace,
    refetch: fetchEvents,
    migrateGuestEventsToAccount,
    clearEvents,
  };
}