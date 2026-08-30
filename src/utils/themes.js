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
 * Keyword -> emoji groups, checked in order. Each group has a list of
 * keywords (lowercase, matched as substrings) and the emoji to use if
 * any keyword is found in the event name.
 *
 * Order matters: outcome-state groups (rejected/approved/pending) are
 * checked FIRST, so a name like "EOI Submitted" or "Background Check
 * Pending" matches the status (⏳) rather than the stage type, since
 * the current status is usually the more meaningful signal.
 */
export const keywordEmojiGroups = [
  // --- Outcome states (highest priority) ---
  {
    id: 'rejected',
    emoji: '❌',
    keywords: ['rejected', 'denied', 'refused', 'declined', 'failed'],
  },
  {
    id: 'approved',
    emoji: '✅',
    keywords: ['approved', 'accepted', 'confirmed', 'granted', 'ita', 'invitation', 'copr', 'pr card', 'passed'],
  },
  {
    id: 'pending',
    emoji: '⏳',
    keywords: ['pending', 'waiting', 'processing', 'in review', 'under review', 'submitted'],
  },

  // --- IRCC / immigration specific ---
  {
    id: 'eoi',
    emoji: '📝',
    keywords: ['eoi', 'expression of interest', 'profile', 'express entry'],
  },
  {
    id: 'medical',
    emoji: '🩺',
    keywords: ['medical', 'medical exam', 'panel physician', 'health check'],
  },
  {
    id: 'biometrics',
    emoji: '🖐️',
    keywords: ['biometric', 'fingerprint'],
  },
  {
    id: 'background',
    emoji: '🕵️',
    keywords: ['background check', 'police clearance', 'security check', 'pcc'],
  },
  {
    id: 'documents',
    emoji: '📄',
    keywords: ['document', 'upload', 'proof of funds', 'reference letter', 'transcript'],
  },
  {
    id: 'visa',
    emoji: '🛂',
    keywords: ['visa', 'work permit', 'study permit', 'immigration', 'landing', 'port of entry'],
  },

  // --- General life/process events ---
  {
    id: 'application',
    emoji: '📝',
    keywords: ['apply', 'application', 'submit'],
  },
  {
    id: 'assessment',
    emoji: '🔍',
    keywords: ['assessment', 'review', 'exam', 'evaluation', 'test'],
  },
  {
    id: 'interview',
    emoji: '🎤',
    keywords: ['interview'],
  },
  {
    id: 'appointment',
    emoji: '📅',
    keywords: ['appointment', 'meeting', 'schedule'],
  },
  {
    id: 'travel',
    emoji: '✈️',
    keywords: ['flight', 'trip', 'departure', 'travel', 'vacation'],
  },
  {
    id: 'work',
    emoji: '💼',
    keywords: ['job', 'offer', 'work', 'career', 'employment', 'contract'],
  },
  {
    id: 'education',
    emoji: '🎓',
    keywords: ['graduation', 'degree', 'diploma', 'school', 'university', 'course'],
  },
  {
    id: 'celebration',
    emoji: '🎉',
    keywords: ['birthday', 'anniversary', 'party', 'celebration', 'wedding'],
  },
  {
    id: 'finance',
    emoji: '💰',
    keywords: ['payment', 'fee', 'invoice', 'tax', 'salary', 'funds'],
  },
  {
    id: 'health',
    emoji: '❤️‍🩹',
    keywords: ['surgery', 'hospital', 'checkup', 'therapy'],
  },
];

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

/**
 * Picks an icon for an event name. Checks keyword groups first (in
 * priority order defined above) for a meaningful match; falls back to
 * the deterministic hash-based emoji if nothing matches.
 */
export function pickIconFor(name) {
  const lowerName = name.toLowerCase();

  for (const group of keywordEmojiGroups) {
    if (group.keywords.some(keyword => lowerName.includes(keyword))) {
      return group.emoji;
    }
  }

  return fallbackEmojis[hashString(name) % fallbackEmojis.length];
}