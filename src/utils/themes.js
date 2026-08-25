// Pre-defined exact color themes based on the image
export const colorThemes = [
  { id: 'blue', main: 'bg-[#386b95]', dark: 'bg-[#2f5c81]' },
  { id: 'teal', main: 'bg-[#477e85]', dark: 'bg-[#3b6b71]' },
  { id: 'orange', main: 'bg-[#eda43a]', dark: 'bg-[#d89332]' },
  { id: 'green', main: 'bg-[#499d3e]', dark: 'bg-[#3f8835]' },
  { id: 'purple', main: 'bg-[#8e44ad]', dark: 'bg-[#732d91]' },
  { id: 'red', main: 'bg-[#e74c3c]', dark: 'bg-[#c0392b]' },
];

export const fallbackEmojis = ['🗓️', '⭐', '🚀', '🎉', '✈️', '💼', '🎂', '🎓', '🏆', '⚓'];

/**
 * Deterministically hash a string to a positive integer.
 * Used so a given event name always maps to the same theme/icon,
 * avoiding random collisions and re-shuffling on edit/re-render.
 */
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // force 32-bit int
  }
  return Math.abs(hash);
}

/**
 * Picks a theme, preferring one not already in use by existing events.
 * Falls back to a deterministic hash-based pick if all themes are taken.
 */
export function pickThemeFor(name, existingEvents) {
  const usedThemeIds = new Set(existingEvents.map(ev => ev.theme.id));
  const unused = colorThemes.filter(t => !usedThemeIds.has(t.id));
  if (unused.length > 0) {
    const idx = hashString(name) % unused.length;
    return unused[idx];
  }
  return colorThemes[hashString(name) % colorThemes.length];
}

export function pickIconFor(name) {
  return fallbackEmojis[hashString(name) % fallbackEmojis.length];
}