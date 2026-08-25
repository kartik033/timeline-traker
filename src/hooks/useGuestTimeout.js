import { useEffect, useRef } from 'react';

const THIRTY_MINUTES_MS = 30 * 60 * 1000;

/**
 * For guests only: wipes in-memory events after 30 minutes of inactivity.
 * "Activity" resets the timer on mouse move, keydown, click, or scroll.
 */
export function useGuestTimeout(isGuest, onTimeout) {
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isGuest) return;

    const resetTimer = () => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onTimeout();
      }, THIRTY_MINUTES_MS);
    };

    const activityEvents = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    activityEvents.forEach((evt) => window.addEventListener(evt, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timerRef.current);
      activityEvents.forEach((evt) => window.removeEventListener(evt, resetTimer));
    };
  }, [isGuest, onTimeout]);
}