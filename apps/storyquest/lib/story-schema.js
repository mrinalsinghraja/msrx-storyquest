const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const isText = (value) => typeof value === 'string' && value.trim().length > 0;
const isPercentage = (value) => Number.isFinite(value) && value >= 0 && value <= 100;

/**
 * Validates a story graph.
 *
 * A story owns one relationship model (the equation the mission teaches). Steps
 * do not carry their own targets — they only choose which lab renders the model
 * and where the slider starts. That keeps the physics in one place and stops a
 * step from quietly disagreeing with the equation.
 */
export function validateStory(story) {
  const errors = [];

  if (!isObject(story)) {
    return { ok: false, errors: ['Story must be an object.'] };
  }

  if (!isText(story.id)) errors.push('Story id must be a non-empty string.');
  if (!isText(story.title)) errors.push('Story title must be a non-empty string.');
  if (!isText(story.concept)) errors.push('Story concept must be a non-empty string.');
  if (!isText(story.startStepId)) errors.push('Story startStepId must be a non-empty string.');

  if (!isObject(story.model)) {
    errors.push('Story must carry a relationship model.');
  } else {
    if (!isText(story.model.kind)) errors.push('Story model.kind must be a non-empty string.');
    if (!isObject(story.model.params)) errors.push('Story model.params must be an object.');
    if (!isObject(story.model.control)) {
      errors.push('Story model.control must be an object.');
    } else {
      const { min, max } = story.model.control;
      if (!Number.isFinite(min) || !Number.isFinite(max)) errors.push('Story model.control needs numeric min and max.');
      else if (max <= min) errors.push('Story model.control max must exceed min.');
      if (!isText(story.model.control.label)) errors.push('Story model.control needs a label.');
    }
    if (!Number.isFinite(story.model.tolerance) || story.model.tolerance <= 0) {
      errors.push('Story model.tolerance must be a positive number.');
    }
  }

  if (!isObject(story.steps) || Object.keys(story.steps).length === 0) {
    errors.push('Story steps must be a non-empty object.');
    return { ok: false, errors };
  }

  const stepIds = Object.keys(story.steps);
  if (!Object.hasOwn(story.steps, story.startStepId)) {
    errors.push('Story startStepId must resolve to an existing step.');
  }

  for (const stepId of stepIds) {
    const step = story.steps[stepId];
    const label = `Step "${stepId}"`;

    if (!isObject(step)) {
      errors.push(`${label} must be an object.`);
      continue;
    }
    if (step.id !== stepId) errors.push(`${label} id must match its object key.`);
    if (!isText(step.title)) errors.push(`${label} needs a title.`);
    if (!Array.isArray(step.paragraphs) || step.paragraphs.length < 1 || step.paragraphs.length > 3 || !step.paragraphs.every(isText)) {
      errors.push(`${label} paragraphs must contain 1-3 non-empty strings.`);
    }

    if (step.visual !== null) {
      if (!isObject(step.visual) || !isText(step.visual.lab)) {
        errors.push(`${label} visual must be null or carry a lab name.`);
      } else if (!isPercentage(step.visual.start)) {
        errors.push(`${label} visual.start must be a slider position from 0 to 100.`);
      }
    }

    if (!Array.isArray(step.choices) || step.choices.length < 1 || step.choices.length > 4) {
      errors.push(`${label} choices must contain 1-4 choices.`);
      continue;
    }

    for (const choice of step.choices) {
      if (!isObject(choice) || !isText(choice.id) || !isText(choice.label)) {
        errors.push(`${label} has an invalid choice.`);
        continue;
      }
      if (choice.next !== null && (!isText(choice.next) || !Object.hasOwn(story.steps, choice.next))) {
        errors.push(`${label} choice "${choice.id}" has a dangling next pointer.`);
      }
      if (typeof choice.requiresBalance !== 'boolean') {
        errors.push(`${label} choice "${choice.id}" requiresBalance must be boolean.`);
      }
      if (choice.requiresBalance && !isText(choice.blockedHint)) {
        errors.push(`${label} choice "${choice.id}" needs a blockedHint.`);
      }
      // A gated choice on a step with no visual can never be satisfied.
      if (choice.requiresBalance && step.visual === null) {
        errors.push(`${label} choice "${choice.id}" is gated but the step has no lab to balance.`);
      }
    }
  }

  if (errors.length === 0) {
    const reachable = new Set();
    const visit = (stepId) => {
      if (reachable.has(stepId)) return;
      reachable.add(stepId);
      for (const choice of story.steps[stepId].choices) {
        if (choice.next !== null) visit(choice.next);
      }
    };
    visit(story.startStepId);

    const unreachable = stepIds.filter((stepId) => !reachable.has(stepId));
    if (unreachable.length) errors.push(`Unreachable steps: ${unreachable.join(', ')}.`);

    // Every story needs a finishable route, and the step that ends it must
    // actually carry an ending to show.
    const enders = [...reachable].filter((stepId) => story.steps[stepId].choices.some((choice) => choice.next === null));
    if (enders.length === 0) errors.push('Story has no reachable ending.');
    for (const stepId of enders) {
      if (!isObject(story.steps[stepId].ending) || !isText(story.steps[stepId].ending.summary)) {
        errors.push(`Step "${stepId}" ends the story but has no ending summary.`);
      }
    }
  }

  return errors.length ? { ok: false, errors } : { ok: true, story };
}
