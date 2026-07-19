import { curriculum } from './curriculum';
import { CHAPTERS, DISCIPLINES, chapterSlug } from './taxonomy';

/**
 * The slim, serialisable catalogue the palette searches.
 *
 * SERVER ONLY. It reaches into `lib/curriculum`, which pulls in all four topic
 * modules — every mission's full story graph, model, tolerances and prose. That
 * is a large object and none of it belongs in a browser bundle, so this is
 * called from a route handler and shipped as JSON rather than imported by the
 * client component that consumes it.
 *
 * Three record kinds, all in one flat list: a learner typing "waves" may be
 * after the chapter or a specific simulator inside it, and making them pick a
 * scope before typing is the kind of friction that stops people searching.
 */
export function buildSearchIndex() {
  const disciplines = Object.entries(DISCIPLINES).map(([id, discipline]) => ({
    kind: 'discipline',
    id: `discipline:${id}`,
    title: discipline.label,
    path: `/learn/${id}`,
    subject: discipline.label,
    chapter: '',
    formula: '',
    blurb: discipline.blurb,
    glyph: discipline.glyph,
  }));

  const chapters = Object.entries(CHAPTERS).map(([id, chapter]) => ({
    kind: 'chapter',
    id: `chapter:${id}`,
    title: chapter.label,
    path: `/learn/${chapter.discipline}/${chapterSlug(id)}`,
    subject: DISCIPLINES[chapter.discipline].label,
    chapter: chapter.label,
    formula: '',
    blurb: chapter.blurb,
    glyph: DISCIPLINES[chapter.discipline].glyph,
  }));

  const missions = curriculum.map((mission) => ({
    kind: 'mission',
    id: `mission:${mission.id}`,
    title: mission.title,
    path: mission.path,
    subject: mission.subjectLabel,
    chapter: mission.chapterLabel ?? '',
    // The raw TeX, so "\tau" and "F_1 d_1" are both reachable. Learners do search
    // for the symbol they are staring at rather than the concept's name.
    formula: mission.formula ?? '',
    blurb: mission.scenario ?? '',
    difficulty: mission.difficulty,
    number: String(mission.number).padStart(3, '0'),
    glyph: mission.icon,
  }));

  return [...missions, ...chapters, ...disciplines];
}
