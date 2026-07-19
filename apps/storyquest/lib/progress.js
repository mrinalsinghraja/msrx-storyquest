/**
 * Completion registry — device-local, no backend.
 *
 * StoryQuest has no accounts and stores nothing server-side ("No sign-in,
 * nothing stored" is on the masthead). Completion is therefore a fact about
 * this browser, not about a person, and it lives in localStorage where the
 * reader can clear it themselves.
 *
 * Every function is a no-op that returns a safe default when storage is
 * unavailable. Private browsing throws on access, and a reader who cannot
 * persist progress should still get a working simulator.
 */

const STORAGE_KEY = 'storyquest_progress';

/** Keeps the record bounded on a device that works through the catalogue. */
const MAX_ENTRIES = 500;

function read() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    // Blocked storage, or a corrupted blob from an older shape. Either way the
    // right answer is an empty record rather than a thrown error on mount.
    return {};
  }
}

function write(record) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    return true;
  } catch {
    return false;
  }
}

/**
 * Registers a completion.
 *
 * The payload is deliberately compact: the simulator id, which interaction
 * archetype was completed, and when. No narrative, no answers, no reading of
 * the reader — this exists so the catalogue can mark a plate as done, and
 * anything more would be data collection the product does not do.
 *
 * Idempotent: re-completing keeps the first `completedAt` and bumps a count,
 * so replaying a simulator does not look like a new achievement.
 */
export function recordCompletion(id, { kind = 'balance' } = {}) {
  if (typeof window === 'undefined' || typeof id !== 'string' || !id) return null;

  const record = read();
  const existing = record[id];

  const entry = {
    kind,
    completedAt: existing?.completedAt ?? new Date().toISOString(),
    plays: (existing?.plays ?? 0) + 1,
  };

  const next = { ...record, [id]: entry };

  // Oldest-first eviction once the cap is hit.
  const ids = Object.keys(next);
  if (ids.length > MAX_ENTRIES) {
    ids
      .sort((a, b) => (next[a].completedAt ?? '').localeCompare(next[b].completedAt ?? ''))
      .slice(0, ids.length - MAX_ENTRIES)
      .forEach((stale) => { delete next[stale]; });
  }

  write(next);
  return entry;
}

export function hasCompleted(id) {
  if (typeof window === 'undefined') return false;
  return Boolean(read()[id]);
}

export function completions() {
  if (typeof window === 'undefined') return {};
  return read();
}

export function clearProgress() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}
