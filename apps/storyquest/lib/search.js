/**
 * Scoring for the mission palette.
 *
 * Pure functions over a plain array, deliberately kept free of React and of the
 * fetch that supplies the index: the ranking is the part that decides whether
 * the feature feels sharp or stupid, so it is the part that has to be assertable
 * in Node without a browser.
 *
 * The corpus is ~130 records, all resident. That is small enough that a linear
 * scan per keystroke is imperceptible and an inverted index would be ceremony —
 * but it is also why the scorer can afford to be picky rather than fast.
 */

/**
 * Folds case and strips diacritics so "Réaumur" is reachable by typing "reaumur".
 *
 * NFD splits a letter from its accent, and the range erases the combining marks
 * that fall out. Without this the only way to find an accented title is to
 * reproduce the accent, which no learner is going to do.
 */
export function normalise(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/** Splits a query into terms; every term must match for the record to rank. */
export const terms = (query) => normalise(query).split(/\s+/).filter(Boolean);

/**
 * Does `needle` appear in `haystack` as an in-order subsequence?
 *
 * The forgiving last resort: it lets "trqbal" reach "Torque balance" when no
 * substring match exists. Scored far below a real substring hit because at short
 * lengths a subsequence matches almost anything — "ae" is a subsequence of half
 * the catalogue — which is exactly why it never outranks a literal match.
 */
export function subsequence(haystack, needle) {
  if (!needle) return true;
  let index = 0;
  for (const char of haystack) {
    if (char === needle[index]) index += 1;
    if (index === needle.length) return true;
  }
  return false;
}

/**
 * Scores one term against one record. `0` means no match.
 *
 * The tiers encode what a learner means by typing. Someone typing "torq" wants
 * the mission called Torque balance, not the twelve missions whose body text
 * mentions torque, so a title hit outranks a context hit by an order of
 * magnitude rather than by a nudge — otherwise a term appearing in many blurbs
 * drowns the one record actually named for it.
 */
function scoreTerm(record, term) {
  const title = record._title;

  if (title === term) return 1000;
  if (title.startsWith(term)) return 700;
  // A term landing at the start of any word: "balance" inside "Torque balance".
  if (record._words.some((word) => word.startsWith(term))) return 500;
  if (title.includes(term)) return 300;

  if (record._chapter.includes(term)) return 160;
  if (record._subject.includes(term)) return 140;
  if (record._formula.includes(term)) return 120;
  if (record._context.includes(term)) return 60;

  // Subsequence only earns its keep on a term long enough to be discriminating.
  if (term.length >= 3 && subsequence(title, term)) return 30;

  return 0;
}

/**
 * Prepares a record once, so the per-keystroke pass does no string work.
 *
 * Normalising inside the scorer would redo the same NFD walk over the whole
 * catalogue on every keypress.
 */
export function prepare(entry) {
  const title = normalise(entry.title);
  return {
    ...entry,
    _title: title,
    _words: title.split(/[^a-z0-9]+/).filter(Boolean),
    _chapter: normalise(entry.chapter),
    _subject: normalise(entry.subject),
    _formula: normalise(entry.formula),
    _context: normalise(`${entry.blurb ?? ''} ${entry.difficulty ?? ''} ${(entry.keywords ?? []).join(' ')}`),
  };
}

export const prepareAll = (entries) => entries.map(prepare);

/**
 * Ranks prepared records against a query.
 *
 * Every term must score, so terms narrow rather than widen: "physics torque"
 * means both, which is what a space between two words reads as. An OR here would
 * make each extra word return *more* results, which is the opposite of what
 * someone refining a search is trying to do.
 */
export function search(records, query, { limit = 8 } = {}) {
  const parts = terms(query);
  if (!parts.length) return [];

  const hits = [];
  for (const record of records) {
    let total = 0;
    let matchedAll = true;

    for (const term of parts) {
      const score = scoreTerm(record, term);
      if (!score) { matchedAll = false; break; }
      total += score;
    }
    if (!matchedAll) continue;

    // Shorter titles win ties: "Torque balance" over "Torque balance on a
    // loaded gantry" when both match everything typed.
    hits.push({ record, score: total - record._title.length * 0.1 });
  }

  return hits
    .sort((a, b) => b.score - a.score || a.record._title.localeCompare(b.record._title))
    .slice(0, limit)
    .map((hit) => hit.record);
}
