import { validateStory } from './story-schema';

/**
 * Turns a topic into a playable story graph.
 *
 * Three shapes exist rather than one, chosen by difficulty tier. They differ in
 * length, in where the branches sit, and in how many gated commits the learner
 * has to clear — so a Foundation mission and a Challenge mission are structurally
 * different experiences, not the same five screens with different nouns.
 */

const lab = (topic, start) => ({ lab: topic.lab, start });

const hint = (topic, phrasing) => `${phrasing} ${topic.model.control.label.toLowerCase()} until ${topic.model.params.leftName.toLowerCase()} matches ${topic.model.params.rightName.toLowerCase()}.`;

/** Foundation — 5 steps, one branch, one gated commit. Short and legible. */
function probeShape(topic) {
  const start = topic.model.start;
  return {
    startStepId: 'briefing',
    steps: {
      briefing: {
        id: 'briefing',
        title: 'The call comes in',
        paragraphs: [`You arrive at ${topic.scenario}.`, topic.crisis],
        visual: lab(topic, start),
        choices: [
          { id: 'read', label: 'Read the instruments', next: 'readout', requiresBalance: false },
          { id: 'reason', label: 'Reason it out first', next: 'principle', requiresBalance: false },
        ],
        ending: null,
      },
      readout: {
        id: 'readout',
        title: 'Reading the instruments',
        paragraphs: [
          `The panel gives you two numbers and no answer: ${topic.model.params.leftName.toLowerCase()} on one side, ${topic.model.params.rightName.toLowerCase()} on the other.`,
          'They disagree. The display will tell you when they stop disagreeing, and nothing more than that.',
        ],
        visual: lab(topic, start),
        choices: [
          { id: 'commit-from-readout', label: 'Tune it until they match', next: 'resolved', requiresBalance: true, blockedHint: hint(topic, 'Not there yet. Keep adjusting') },
          { id: 'to-principle', label: 'Check the principle first', next: 'principle', requiresBalance: false },
        ],
        ending: null,
      },
      principle: {
        id: 'principle',
        title: 'Why it works',
        paragraphs: [topic.insight, 'Now you know what you are looking for, the panel becomes readable.'],
        visual: lab(topic, start),
        choices: [
          { id: 'commit-from-principle', label: 'Apply it to the system', next: 'resolved', requiresBalance: true, blockedHint: hint(topic, 'The principle is right but the setting is not. Move') },
        ],
        ending: null,
      },
      resolved: {
        id: 'resolved',
        title: 'Holding steady',
        paragraphs: [
          'The fix is understood. Now it has to survive a handover: the rig was reset for the sign-off check, and the reading has drifted again.',
          'Set it one more time. This is the version that gets recorded.',
        ],
        visual: lab(topic, start),
        choices: [
          { id: 'secure', label: 'Sign off the fix', next: null, requiresBalance: true, blockedHint: hint(topic, 'It drifted. Bring it back by adjusting') },
          { id: 'stress', label: 'Push it and see what breaks', next: 'stress', requiresBalance: false },
        ],
        ending: { kind: 'success', summary: `${topic.resolution} You solved it from the relationship, not by guessing.` },
      },
      stress: {
        id: 'stress',
        title: 'Testing the edges',
        paragraphs: [
          'You deliberately push the system out of balance and watch what happens. It fails in exactly the direction the equation predicts.',
          'That is the real check: not that it works, but that you knew in advance how it would break.',
        ],
        visual: lab(topic, start),
        choices: [
          { id: 'restore', label: 'Restore and sign off', next: null, requiresBalance: true, blockedHint: hint(topic, 'Bring it back into the safe window by adjusting') },
        ],
        ending: { kind: 'insight', summary: `${topic.resolution} You also proved you could predict the failure, not just the fix.` },
      },
    },
  };
}

/** Explorer — 6 steps, two branches that meet, one gated commit. */
function diagnoseShape(topic) {
  const start = topic.model.start;
  const mirrored = 100 - start;
  return {
    startStepId: 'briefing',
    steps: {
      briefing: {
        id: 'briefing',
        title: 'Something is wrong here',
        paragraphs: [`You are called to ${topic.scenario}.`, topic.crisis],
        visual: lab(topic, start),
        choices: [
          { id: 'survey', label: 'Survey the whole system', next: 'survey', requiresBalance: false },
          { id: 'isolate', label: 'Isolate the failing part', next: 'isolate', requiresBalance: false },
        ],
        ending: null,
      },
      survey: {
        id: 'survey',
        title: 'The wider view',
        paragraphs: [
          `Stepping back, the fault is not in any single component. It is in the relationship between ${topic.model.params.leftName.toLowerCase()} and ${topic.model.params.rightName.toLowerCase()}.`,
          'Nothing here is broken. Something here is mismatched.',
        ],
        visual: lab(topic, mirrored),
        choices: [
          { id: 'to-hypothesis', label: 'Form a hypothesis', next: 'hypothesis', requiresBalance: false },
        ],
        ending: null,
      },
      isolate: {
        id: 'isolate',
        title: 'Down to one variable',
        paragraphs: [
          `You strip the problem back until only one thing can move: ${topic.model.control.label.toLowerCase()}.`,
          'Everything else is fixed by the situation. That makes this the variable the equation has to be solved for.',
        ],
        visual: lab(topic, start),
        choices: [
          { id: 'isolate-to-hypothesis', label: 'Work out what it should be', next: 'hypothesis', requiresBalance: false },
        ],
        ending: null,
      },
      hypothesis: {
        id: 'hypothesis',
        title: 'The relationship',
        paragraphs: [topic.insight, 'That gives you a prediction. A prediction is testable — a guess is not.'],
        visual: lab(topic, start),
        choices: [
          { id: 'test', label: 'Test the prediction', next: 'verify', requiresBalance: true, blockedHint: hint(topic, 'The prediction has not landed yet. Adjust') },
          { id: 'recheck', label: 'Re-read the system first', next: 'survey', requiresBalance: false },
        ],
        ending: null,
      },
      verify: {
        id: 'verify',
        title: 'It holds',
        paragraphs: [
          'Your prediction held. The rig has since been reset for the formal check, so the reading is off again.',
          'Reproduce it. A result you can only get once is not a result.',
        ],
        visual: lab(topic, start),
        choices: [
          { id: 'sign-off', label: 'Sign off the repair', next: null, requiresBalance: true, blockedHint: hint(topic, 'It has drifted out of the safe window. Correct') },
        ],
        ending: { kind: 'success', summary: `${topic.resolution} You found the variable that mattered and solved for it directly.` },
      },
    },
  };
}

/** Challenge — 7 steps, a gated stabilise before the real work, then a second gate. */
function containShape(topic) {
  const start = topic.model.start;
  const mirrored = 100 - start;
  return {
    startStepId: 'briefing',
    steps: {
      briefing: {
        id: 'briefing',
        title: 'No time to read the manual',
        paragraphs: [`You take control of ${topic.scenario}.`, topic.crisis],
        visual: lab(topic, start),
        choices: [
          { id: 'stabilise', label: 'Stabilise it now', next: 'stabilised', requiresBalance: true, blockedHint: hint(topic, 'It is still running away. Get control by adjusting') },
          { id: 'understand', label: 'Understand it before touching it', next: 'theory', requiresBalance: false },
        ],
        ending: null,
      },
      theory: {
        id: 'theory',
        title: 'What is actually happening',
        paragraphs: [topic.insight, 'Knowing this costs you time. It also stops you making the problem worse.'],
        visual: lab(topic, start),
        choices: [
          { id: 'now-stabilise', label: 'Now stabilise it', next: 'stabilised', requiresBalance: true, blockedHint: hint(topic, 'Theory is right, setting is wrong. Adjust') },
        ],
        ending: null,
      },
      stabilised: {
        id: 'stabilised',
        title: 'Bought some time',
        paragraphs: [
          'The readings stop moving. You have not fixed anything yet — you have stopped it getting worse.',
          `The underlying relationship is still there: ${topic.model.params.leftName.toLowerCase()} against ${topic.model.params.rightName.toLowerCase()}.`,
        ],
        visual: lab(topic, mirrored),
        choices: [
          { id: 'constraint', label: 'Find what constrains the system', next: 'constraint', requiresBalance: false },
          { id: 'straight-to-fix', label: 'Go straight for the permanent fix', next: 'commit', requiresBalance: false },
        ],
        ending: null,
      },
      constraint: {
        id: 'constraint',
        title: 'The thing you cannot change',
        paragraphs: [
          `Most of this system is fixed by circumstance. Only ${topic.model.control.label.toLowerCase()} is yours to set.`,
          'A constraint is not an obstacle. It is what makes the answer knowable instead of arbitrary.',
        ],
        visual: lab(topic, start),
        choices: [
          { id: 'constraint-to-commit', label: 'Solve for the free variable', next: 'commit', requiresBalance: false },
        ],
        ending: null,
      },
      commit: {
        id: 'commit',
        title: 'The permanent fix',
        paragraphs: [
          'No more holding actions. Set it where the relationship says it belongs and it will stay there without you.',
          topic.insight,
        ],
        visual: lab(topic, start),
        choices: [
          { id: 'lock', label: 'Lock in the solved value', next: 'resolved', requiresBalance: true, blockedHint: hint(topic, 'Close, but the two sides still disagree. Keep moving') },
          { id: 'back-to-constraint', label: 'Re-check the constraints', next: 'constraint', requiresBalance: false },
        ],
        ending: null,
      },
      resolved: {
        id: 'resolved',
        title: 'It holds without you',
        paragraphs: [
          'The permanent fix is in. Before the incident can be closed, the system is re-tested from a cold start — and it comes up unbalanced, as it always does.',
          'Set it once more. Then it holds without you, and that is the difference between a fix and a hold.',
        ],
        visual: lab(topic, start),
        choices: [
          { id: 'close', label: 'Close the incident', next: null, requiresBalance: true, blockedHint: hint(topic, 'Do not close it out of balance. Correct') },
        ],
        ending: { kind: 'success', summary: `${topic.resolution} You stabilised it, understood it, then solved it — in that order.` },
      },
    },
  };
}

const SHAPES = { Foundation: probeShape, Explorer: diagnoseShape, Challenge: containShape };

export function buildStory(topic) {
  const shape = (SHAPES[topic.difficulty] ?? probeShape)(topic);

  const story = {
    id: topic.id,
    title: `${topic.title}: Mission ${String(topic.number).padStart(3, '0')}`,
    concept: topic.title,
    subject: topic.subject,
    formula: topic.formula,
    model: topic.model,
    ...shape,
  };

  const result = validateStory(story);
  if (!result.ok) throw new Error(`Invalid story for ${topic.id}: ${result.errors.join(' ')}`);
  return story;
}
