import physics from './topics/physics';
import chemistry from './topics/chemistry';
import mathematics from './topics/mathematics';
import biology from './topics/biology';
import { buildStory } from './story-builder';
import { createModel } from './models';
import { LABS } from './labs';
import { CHAPTERS, DISCIPLINES, chapterSlug, chaptersFor } from './taxonomy';

const subjects = {
  physics: { ...DISCIPLINES.physics, topics: physics },
  chemistry: { ...DISCIPLINES.chemistry, topics: chemistry },
  mathematics: { ...DISCIPLINES.mathematics, topics: mathematics },
  biology: { ...DISCIPLINES.biology, topics: biology },
};

/**
 * Every mission, flattened.
 *
 * `difficulty`, `gradeGroup`, `gradeLevel`, and `chapterId` are read straight off
 * the topic. They used to be derived from a topic's index inside its subject
 * array, which meant inserting one topic silently re-graded every topic after it
 * — and `difficulty` picks the story shape in `lib/story-builder.js`, so the
 * re-grade rewrote their narratives too.
 *
 * `id` and `number` stay position-derived because they are the legacy URL and the
 * legacy plate number; `lib/redirects.js` maps them onto the nested paths.
 */
export const curriculum = Object.entries(subjects).flatMap(([subject, config], subjectIndex) => (
  config.topics.map((topic, topicIndex) => ({
    ...topic,
    id: `${subject}-${String(topicIndex + 1).padStart(2, '0')}`,
    number: subjectIndex * 25 + topicIndex + 1,
    subject,
    subjectLabel: config.label,
    icon: config.glyph,
    chapterSlug: chapterSlug(topic.chapterId),
    chapterLabel: CHAPTERS[topic.chapterId]?.label,
    path: `/learn/${subject}/${chapterSlug(topic.chapterId)}/${topic.slug}`,
  }))
));

export const subjectCatalog = Object.entries(subjects).map(([id, subject]) => ({
  id,
  label: subject.label,
  icon: subject.glyph,
  blurb: subject.blurb,
  count: subject.topics.length,
}));

/** Legacy lookup, by the flat `physics-01` id. Kept for the redirect layer. */
export const findMission = (missionId) => curriculum.find((mission) => mission.id === missionId);

/** Canonical lookup, by the three segments of the nested route. */
export const findByPath = (discipline, chapter, slug) => curriculum.find((mission) => (
  mission.subject === discipline && mission.chapterSlug === chapter && mission.slug === slug
));

export const missionsInChapter = (discipline, chapter) => curriculum.filter((mission) => (
  mission.subject === discipline && mission.chapterSlug === chapter
));

/** Chapters of a discipline, each carrying its own mission list. */
export const chapterCatalog = (discipline) => chaptersFor(discipline).map((chapter) => ({
  ...chapter,
  missions: missionsInChapter(discipline, chapter.slug),
}));

export function createMissionStory(mission) {
  return buildStory(mission);
}

/**
 * Development guard.
 *
 * Every mission is checked at import time: the story graph must validate and the
 * equation's answer must be reachable on the slider. A bad edit fails loudly in
 * dev rather than shipping a mission nobody can finish.
 */
if (process.env.NODE_ENV !== 'production') {
  const difficulties = new Set(['Foundation', 'Explorer', 'Challenge']);
  const gradeGroups = new Set(['early', 'middle', 'high']);

  for (const mission of curriculum) {
    const kind = mission.interactionKind ?? 'balance';

    // Only a balance mission has a model and a story graph. Running these
    // unconditionally meant one construct record threw at module scope and took
    // down every page that imports the curriculum — all 100 balance simulators
    // included, because this file is evaluated once for the whole catalogue.
    if (kind === 'balance') {
      buildStory(mission);
      const model = createModel(mission.model);
      if (!model.isReachable) {
        throw new Error(`Mission ${mission.id}: solved value ${model.solvedValue} sits outside the slider range.`);
      }
      if (model.evaluate(mission.model.start).balanced) {
        throw new Error(`Mission ${mission.id}: starts already balanced, so there is no puzzle.`);
      }
    }

    if (kind === 'construct') {
      const slots = mission.engine?.initial?.slots;
      if (!Array.isArray(slots) || !slots.length) {
        throw new Error(`Mission ${mission.id}: construct simulator has no slots to build into.`);
      }
      if (!mission.engine?.validation?.predicate) {
        throw new Error(`Mission ${mission.id}: construct simulator has no predicate.`);
      }
    }

    if (kind === 'explore') {
      // A string, never a function: a function cannot be serialised from a
      // server component into the runtime, and that failure only shows up as a
      // runtime error on the page.
      if (typeof mission.engine?.projection !== 'string' || !mission.engine.projection.trim()) {
        throw new Error(`Mission ${mission.id}: explore simulator needs a projection expression string.`);
      }
      if (!Array.isArray(mission.engine?.controls) || !mission.engine.controls.length) {
        throw new Error(`Mission ${mission.id}: explore simulator has no controls.`);
      }
    }

    if (!LABS[mission.lab]) {
      throw new Error(`Mission ${mission.id}: unknown lab "${mission.lab}".`);
    }

    // These four used to be derived, so a missing one was impossible. Now that
    // they are authored, a topic added without them would fall back to
    // `undefined` and pick the wrong story shape rather than failing.
    if (!CHAPTERS[mission.chapterId]) {
      throw new Error(`Mission ${mission.id}: unknown chapter "${mission.chapterId}".`);
    }
    if (CHAPTERS[mission.chapterId].discipline !== mission.subject) {
      throw new Error(`Mission ${mission.id}: chapter "${mission.chapterId}" belongs to another discipline.`);
    }
    if (!difficulties.has(mission.difficulty)) {
      throw new Error(`Mission ${mission.id}: difficulty must be one of ${[...difficulties].join(', ')}.`);
    }
    if (!gradeGroups.has(mission.gradeGroup)) {
      throw new Error(`Mission ${mission.id}: gradeGroup must be one of ${[...gradeGroups].join(', ')}.`);
    }
    if (!Number.isInteger(mission.gradeLevel)) {
      throw new Error(`Mission ${mission.id}: gradeLevel must be an integer class number.`);
    }
  }

  // A chapter that leans on one apparatus stops feeling like a chapter. An
  // earlier build put eight physics topics on `lever`, so every Foundation
  // physics mission opened on a torque rig whatever its equation was.
  //
  // The cap is per-chapter rather than per-subject: at 80 physics simulators a
  // subject-wide cap of 4 would demand 20 distinct physics apparatus.
  const perChapter = new Map();
  for (const mission of curriculum) {
    const counts = perChapter.get(mission.chapterId) ?? new Map();
    counts.set(mission.lab, (counts.get(mission.lab) ?? 0) + 1);
    perChapter.set(mission.chapterId, counts);
  }
  for (const [chapterId, counts] of perChapter) {
    for (const [lab, count] of counts) {
      if (count > 4) {
        throw new Error(`${chapterId}: ${count} missions share the "${lab}" lab (limit 4).`);
      }
    }
  }
}
