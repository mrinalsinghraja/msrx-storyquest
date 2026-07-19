import physics from './topics/physics';
import chemistry from './topics/chemistry';
import mathematics from './topics/mathematics';
import biology from './topics/biology';
import { buildStory } from './story-builder';
import { createModel } from './models';
import { LABS } from './labs';

const subjects = {
  physics: { label: 'Physics', icon: '⚛', color: 'cyan', blurb: 'Forces, circuits, waves, and optics.', topics: physics },
  chemistry: { label: 'Chemistry', icon: '🧪', color: 'violet', blurb: 'Particles, reactions, atoms, and pH.', topics: chemistry },
  mathematics: { label: 'Mathematics', icon: '⌗', color: 'amber', blurb: 'Ratios, geometry, coordinates, and data.', topics: mathematics },
  biology: { label: 'Biology', icon: '🧬', color: 'emerald', blurb: 'Cells, systems, ecosystems, and health.', topics: biology },
};

/** Difficulty rises through each subject's own sequence. */
const difficultyFor = (index) => (index < 8 ? 'Foundation' : index < 17 ? 'Explorer' : 'Challenge');

export const curriculum = Object.entries(subjects).flatMap(([subject, config], subjectIndex) => (
  config.topics.map((topic, topicIndex) => ({
    ...topic,
    id: `${subject}-${String(topicIndex + 1).padStart(2, '0')}`,
    number: subjectIndex * 25 + topicIndex + 1,
    subject,
    subjectLabel: config.label,
    icon: config.icon,
    color: config.color,
    difficulty: difficultyFor(topicIndex),
  }))
));

export const subjectCatalog = Object.entries(subjects).map(([id, subject]) => ({
  id,
  label: subject.label,
  icon: subject.icon,
  color: subject.color,
  blurb: subject.blurb,
  count: subject.topics.length,
}));

export const findMission = (missionId) => curriculum.find((mission) => mission.id === missionId);

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
  for (const mission of curriculum) {
    buildStory(mission);
    const model = createModel(mission.model);
    if (!model.isReachable) {
      throw new Error(`Mission ${mission.id}: solved value ${model.solvedValue} sits outside the slider range.`);
    }
    if (model.evaluate(mission.model.start).balanced) {
      throw new Error(`Mission ${mission.id}: starts already balanced, so there is no puzzle.`);
    }
    if (!LABS[mission.lab]) {
      throw new Error(`Mission ${mission.id}: unknown lab "${mission.lab}".`);
    }
  }

  // A subject that leans on one apparatus stops feeling like 25 missions. An
  // earlier build put eight physics topics on `lever`, so every Foundation
  // physics mission opened on a torque rig whatever its equation was.
  const perSubject = new Map();
  for (const mission of curriculum) {
    const counts = perSubject.get(mission.subject) ?? new Map();
    counts.set(mission.lab, (counts.get(mission.lab) ?? 0) + 1);
    perSubject.set(mission.subject, counts);
  }
  for (const [subject, counts] of perSubject) {
    for (const [lab, count] of counts) {
      if (count > 4) {
        throw new Error(`${subject}: ${count} missions share the "${lab}" lab (limit 4).`);
      }
    }
  }
}
