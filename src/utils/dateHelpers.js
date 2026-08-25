// Pure date/time utility functions — no React dependency, fully unit-testable.

export const calculateTimeDiff = (targetDateString, now = new Date()) => {
  const targetDate = new Date(targetDateString);
  const diffMs = targetDate.getTime() - now.getTime();
  const isPast = diffMs < 0;
  const absMs = Math.abs(diffMs);

  const minutes = Math.floor(absMs / (1000 * 60));
  const hours = Math.floor(absMs / (1000 * 60 * 60));
  const days = Math.floor(absMs / (1000 * 60 * 60 * 24));

  if (days > 0) {
    return { value: days, unit: days === 1 ? 'day' : 'days', suffix: isPast ? 'ago' : 'left' };
  }
  if (hours > 0) {
    return { value: hours, unit: hours === 1 ? 'hour' : 'hours', suffix: isPast ? 'ago' : 'left' };
  }
  return { value: minutes, unit: minutes === 1 ? 'min' : 'mins', suffix: isPast ? 'ago' : 'left' };
};

export const formatDateLabel = (dateString) => {
  const date = new Date(dateString);
  const datePart = date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  const timePart =
    hours !== '00' || minutes !== '00'
      ? ` ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
      : '';
  return `${datePart}${timePart}`;
};

// Helper to format ISO date to what <input type="datetime-local"> expects
export const formatForInput = (dateString) => {
  const d = new Date(dateString);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

/**
 * Computes elapsed time between two dates as months + remaining days,
 * handling month-end overflow correctly (e.g. Jan 31 -> Feb 28, not Mar 3).
 */
export const getDateDiffBreakdown = (dateA, dateB) => {
  let d1 = new Date(dateA);
  let d2 = new Date(dateB);

  if (d1 > d2) {
    [d1, d2] = [d2, d1];
  }

  const diffMs = Math.abs(d2 - d1);
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let months = (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());

  // Guard against month-end overflow: clamp the day-of-month before adding
  // months so e.g. Jan 31 + 1 month doesn't silently roll into March.
  const addMonthsClamped = (base, monthsToAdd) => {
    const result = new Date(base);
    const targetMonth = result.getMonth() + monthsToAdd;
    result.setDate(1); // avoid overflow while shifting month
    result.setMonth(targetMonth);
    const daysInTargetMonth = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
    result.setDate(Math.min(base.getDate(), daysInTargetMonth));
    return result;
  };

  let tempDate = addMonthsClamped(d1, months);
  if (tempDate > d2) {
    months--;
    tempDate = addMonthsClamped(d1, months);
  }

  const remainingDays = Math.floor((d2 - tempDate) / (1000 * 60 * 60 * 24));

  return { totalDays, months, remainingDays };
};

export const getComparisonResult = (ev1, ev2) => {
  if (!ev1 || !ev2) return null;

  const d1 = new Date(ev1.date);
  const d2 = new Date(ev2.date);
  const firstEv = d1 <= d2 ? ev1 : ev2;
  const secondEv = d1 <= d2 ? ev2 : ev1;

  const { totalDays, months, remainingDays } = getDateDiffBreakdown(ev1.date, ev2.date);

  return { firstEv, secondEv, totalDays, months, remainingDays };
};