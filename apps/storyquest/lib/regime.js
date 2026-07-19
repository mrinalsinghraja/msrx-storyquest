/**
 * Regime tracking for `explore` simulators.
 *
 * An explore simulator has no single answer. The learner moves inputs and
 * watches behaviour, and what counts as success is reaching — and holding — a
 * described regime: the predator population oscillating, the solution staying
 * saturated, the pendulum settling.
 *
 * Holding matters. A slider dragged from one end to the other passes through
 * every window on the way, so a single in-bounds sample proves nothing. The
 * tracker only reports success once the value has stayed inside the window for
 * `sustainFor` consecutive samples.
 *
 * Pure reducer, no React and no timers, so the whole thing is testable by
 * feeding it a list of numbers.
 */

export const INITIAL_REGIME = Object.freeze({
  samples: 0,
  streak: 0,
  best: 0,
  inWindow: false,
  satisfied: false,
  enteredAtSample: null,
  exhausted: false,
});

/**
 * Coerces whatever the canvas reports into a number.
 *
 * Inputs arrive as slider strings, as `"x,y"` coordinate pairs from a pointer
 * surface, or already as numbers. A coordinate pair is reduced by the axis the
 * regime names, defaulting to x — a regime that tracks one variable should not
 * silently start tracking distance from the origin.
 */
export function readValue(raw, axis = 'x') {
  if (typeof raw === 'number') return Number.isFinite(raw) ? raw : null;

  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (trimmed.includes(',')) {
      const parts = trimmed.split(',').map((part) => Number.parseFloat(part));
      const index = axis === 'y' ? 1 : 0;
      return Number.isFinite(parts[index]) ? parts[index] : null;
    }
    const parsed = Number.parseFloat(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  }

  if (raw && typeof raw === 'object') {
    const value = raw[axis];
    return typeof value === 'number' && Number.isFinite(value) ? value : null;
  }

  return null;
}

/** `{ min, max }`, or a `{ target, tolerance }` pair expressed as a window. */
export function windowFor(regime) {
  if (!regime) return null;

  const { bounds, target, tolerance } = regime;

  if (bounds && Number.isFinite(bounds.min) && Number.isFinite(bounds.max)) {
    return bounds.min <= bounds.max ? { min: bounds.min, max: bounds.max } : null;
  }

  if (Number.isFinite(target) && Number.isFinite(tolerance) && tolerance >= 0) {
    return { min: target - tolerance, max: target + tolerance };
  }

  return null;
}

/**
 * Advances the tracker by one sample.
 *
 * Once satisfied, the state is returned untouched. Success in an explore
 * simulator is a thing the learner achieved, not a live readout that flickers
 * off when they keep playing with the controls afterwards.
 */
export function stepRegime(state, raw, regime) {
  if (state.satisfied) return state;

  const bounds = windowFor(regime);
  if (!bounds) return state;

  const sustainFor = Number.isInteger(regime.sustainFor) && regime.sustainFor > 0 ? regime.sustainFor : 1;
  const withinSteps = Number.isInteger(regime.withinSteps) && regime.withinSteps > 0 ? regime.withinSteps : Infinity;

  const value = readValue(raw, regime.axis);
  const samples = state.samples + 1;

  // An unreadable sample breaks the streak rather than carrying it.
  //
  // "We could not measure it" is not evidence the learner was still holding the
  // window, and treating it as such credits a hold that never happened. Values
  // come from range inputs, so in practice this only fires on a real fault.
  if (value === null) return { ...state, samples, streak: 0, inWindow: false };

  const inWindow = value >= bounds.min && value <= bounds.max;
  const streak = inWindow ? state.streak + 1 : 0;
  const satisfied = streak >= sustainFor;

  return {
    ...state,
    samples,
    streak,
    best: Math.max(state.best, streak),
    inWindow,
    satisfied,
    // The moment the learner first landed in the window, kept even if they
    // leave again — it is the interesting event, not the streak that follows.
    enteredAtSample: state.enteredAtSample ?? (inWindow ? samples : null),
    exhausted: !satisfied && samples >= withinSteps,
  };
}

/** Convenience for tests and for replaying a recorded session. */
export function runRegime(values, regime) {
  return values.reduce((state, value) => stepRegime(state, value, regime), INITIAL_REGIME);
}
