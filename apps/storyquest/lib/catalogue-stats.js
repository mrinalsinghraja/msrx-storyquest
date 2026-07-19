import { curriculum } from './curriculum';
import { CHAPTERS, DISCIPLINES } from './taxonomy';

/**
 * The catalogue's own count of itself.
 *
 * Every figure the marketing copy quotes — mission count, chapter count, how
 * many distinct labs, the class range — is derived here rather than typed into
 * a sentence. Those numbers were hardcoded as "100" in eight places across the
 * homepage, the layout metadata, the OG image, the FAQ and the learn page. The
 * catalogue grew to 202 and every one of them silently became a lie, because a
 * string in a paragraph has nothing that fails when the data moves.
 *
 * SERVER ONLY: this reaches through `lib/curriculum`, which pulls in all four
 * topic modules. Anything client-side that wants a count should be handed one
 * or should avoid quoting a number at all.
 */
const grades = curriculum.map((mission) => mission.gradeLevel).filter(Number.isInteger);

export const CATALOGUE = {
  missions: curriculum.length,
  chapters: Object.keys(CHAPTERS).length,
  disciplines: Object.keys(DISCIPLINES).length,
  labs: new Set(curriculum.map((mission) => mission.lab)).size,
  minGrade: Math.min(...grades),
  maxGrade: Math.max(...grades),
};

/** `{ Physics: 58, Chemistry: 46, … }` — used where the split is quoted. */
export const perSubject = Object.fromEntries(
  Object.entries(DISCIPLINES).map(([id, discipline]) => [
    discipline.label,
    curriculum.filter((mission) => mission.subject === id).length,
  ]),
);

/**
 * "58 physics, 46 chemistry, 53 maths and 45 biology" — for the FAQ, which used
 * to claim an even "25 missions in each" that stopped being true the moment the
 * subjects grew at different rates.
 */
export const subjectBreakdown = () => {
  const parts = Object.entries(perSubject).map(([label, count]) => `${count} ${label.toLowerCase()}`);
  return `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`;
};

/** "classes 1-10", the span the catalogue actually covers. */
export const gradeRange = `classes ${CATALOGUE.minGrade}-${CATALOGUE.maxGrade}`;
