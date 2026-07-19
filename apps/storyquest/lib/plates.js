import katex from 'katex';
import { labTitle } from './labs';

/**
 * Plate size is difficulty, expressed as layout weight rather than a badge.
 * Challenge simulators take a full plate, Explorer a half, Foundation a quarter.
 */
const PLATE_SIZE = { Challenge: 'full', Explorer: 'half', Foundation: 'quarter' };

/**
 * Builds the catalogue view model for a set of missions.
 *
 * Every formula is typeset here, on the server, at build time. A chapter page
 * renders up to 14 plates and the full catalogue renders 100; doing this in the
 * client component would mean that many KaTeX passes during hydration, and the
 * LaTeX strings are authored in `lib/topics/*` so there is nothing dynamic to
 * wait for. KaTeX never enters the client bundle.
 */
export function toPlates(missions) {
  return missions.map((mission) => {
    // Only a balance simulator has an equation and a single named control. A
    // construct plate shows its brief instead, and neither has a formula to
    // typeset — reading `model.control` unconditionally threw on both.
    const kind = mission.interactionKind ?? 'balance';
    const formula = kind === 'balance' ? mission.formula : null;

    return {
      id: mission.id,
      number: mission.number,
      title: mission.title,
      subject: mission.subject,
      subjectLabel: mission.subjectLabel,
      chapterSlug: mission.chapterSlug,
      chapterLabel: mission.chapterLabel,
      difficulty: mission.difficulty,
      gradeGroup: mission.gradeGroup,
      gradeLevel: mission.gradeLevel,
      size: PLATE_SIZE[mission.difficulty] ?? 'quarter',
      interactionKind: kind,
      scenario: mission.scenario ?? mission.engine?.brief ?? '',
      lab: labTitle(mission.lab),
      control: mission.model?.control?.label ?? null,
      formula,
      formulaHtml: formula ? katex.renderToString(formula, { throwOnError: false }) : null,
      path: mission.path,
    };
  });
}
