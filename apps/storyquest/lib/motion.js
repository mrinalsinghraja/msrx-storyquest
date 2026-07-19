/**
 * Motion primitives for the mission simulators.
 *
 * Every one of these is a pure function of elapsed simulation time, which is
 * what makes the whole animation layer testable: feed a `t` sequence in Node and
 * assert the trajectory, with no display and no `requestAnimationFrame`.
 *
 * THE RULE THAT GOVERNS EVERY CALLER
 *
 * A balance simulator's geometry is derived from `value` — the slider position —
 * and `value` is the answer the learner is being asked for. `reading.left`,
 * `reading.right` and the balanced check all read off the same number. So motion
 * may never write to a `value`-derived quantity. It may only:
 *
 *   - rotate something radially symmetric (an orbit, an electron shell),
 *   - advance the phase of something periodic (a wave, a helix),
 *   - flow particles along a fixed path (current, solutes, blood),
 *   - pulse or vibrate an indicator (an arrow, a bond, a highlight).
 *
 * Each of those leaves the measured quantity exactly where the slider put it. A
 * wave that travels still has the amplitude `value` gave it; an atom whose
 * electrons orbit still shows the count `value` gave it. Oscillating the split
 * in an energy bar would look impressive and would be a bug — the learner could
 * no longer read the answer they are being graded on.
 */

export const TAU = Math.PI * 2;

/** Sine oscillation in [-1, 1]. `period` is seconds per full cycle. */
export function osc(t, period, phase = 0) {
  if (!(period > 0)) return 0;
  return Math.sin((t / period) * TAU + phase);
}

/** Sine oscillation remapped to [0, 1]. */
export function wave(t, period, phase = 0) {
  return (osc(t, period, phase) + 1) / 2;
}

/** Sawtooth in [0, 1): position through the current cycle. */
export function cycle(t, period, phase = 0) {
  if (!(period > 0)) return 0;
  const raw = t / period + phase;
  return raw - Math.floor(raw);
}

/** Continuously advancing angle in radians. */
export function spin(t, period, phase = 0) {
  return cycle(t, period) * TAU + phase;
}

/**
 * A multiplier that breathes around 1 — for scaling something in place.
 *
 * `depth` is the fractional swing, so 0.04 gives 0.96…1.04. Callers multiply
 * this into a `value`-derived scale rather than replacing it, which keeps the
 * measured size intact while letting the apparatus move.
 */
export function breathe(t, period, depth = 0.04, phase = 0) {
  return 1 + osc(t, period, phase) * depth;
}

/**
 * Positions `count` markers evenly along a cycle, each in [0, 1).
 *
 * The workhorse for flow: current down a wire, solutes across a membrane, drops
 * through a water cycle. Evenly spaced and continuously advancing, so the group
 * reads as a stream rather than a blinking set.
 */
export function stream(t, period, count, phase = 0) {
  if (count <= 0) return [];
  const head = cycle(t, period, phase);
  return Array.from({ length: count }, (_, index) => {
    const p = head + index / count;
    return p - Math.floor(p);
  });
}

/**
 * Damped oscillation settling to zero — a beam finding its equilibrium.
 *
 * Used on levers and balances, which really do swing before they settle. The
 * amplitude decays with `t`, so the apparatus is visibly alive when the learner
 * moves the slider and visibly at rest a few seconds later. Note the caller adds
 * this *to* the `value`-derived tilt: the resting position is still the answer.
 */
export function settle(t, period, amplitude, decay = 0.55) {
  return osc(t, period) * amplitude * Math.exp(-t * decay);
}

/**
 * A point travelling a quadratic Bézier, as `{ x, y }`.
 *
 * Projectile arcs and activation-energy curves are both drawn as `Q` paths, so
 * a marker riding the same curve needs the same arithmetic the path uses rather
 * than an approximation that drifts off the stroke.
 */
export function bezier(p, x0, y0, cx, cy, x1, y1) {
  const inv = 1 - p;
  return {
    x: inv * inv * x0 + 2 * inv * p * cx + p * p * x1,
    y: inv * inv * y0 + 2 * inv * p * cy + p * p * y1,
  };
}

/**
 * A point travelling a cubic Bézier, as `{ x, y }`.
 *
 * SVG `C` segments are cubic, and approximating one with a quadratic puts the
 * marker visibly off the stroke at the shoulders — exactly where an activation
 * curve is steepest and a learner is looking. Worth the extra two terms.
 */
export function cubic(p, x0, y0, c1x, c1y, c2x, c2y, x1, y1) {
  const inv = 1 - p;
  const a = inv * inv * inv;
  const b = 3 * inv * inv * p;
  const c = 3 * inv * p * p;
  const d = p * p * p;
  return {
    x: a * x0 + b * c1x + c * c2x + d * x1,
    y: a * y0 + b * c1y + c * c2y + d * y1,
  };
}

/**
 * Deterministic pseudo-random jitter in [-1, 1] for element `index`.
 *
 * Thermal noise on gas particles and vibrating bonds needs to look uncorrelated
 * without a random number generator: `Math.random()` would produce a different
 * value every frame and every render, so nothing would hold still and the SSR
 * markup would never match the client's. This is a function of time and index
 * only, so it is smooth, reproducible, and identical on both sides.
 */
export function jitter(t, index, rate = 1.7) {
  return Math.sin(t * rate + index * 2.399) * Math.cos(t * rate * 0.61 + index * 1.113);
}
