'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';

/**
 * The simulation clock.
 *
 * A `balance` simulator is static: the learner moves a slider, a number changes,
 * nothing happens in between. `explore` simulators are not — a pendulum swings,
 * a population oscillates, a reaction proceeds — so they need a loop that runs
 * whether or not the learner is touching anything.
 *
 * Three things this has to get right, and each one is a bug we would otherwise
 * ship:
 *
 *   1. Frame-rate independence. A 120 Hz laptop must not run the simulation at
 *      twice the speed of a 60 Hz one, so every consumer integrates against the
 *      elapsed `dt` and nothing counts frames as if they were time.
 *   2. Sampling that is not the frame rate. `stepRegime` counts samples, and
 *      `sustainFor` is authored in samples. Stepping it once per frame would
 *      turn "hold this for 3 samples" into 50 ms on a fast display and 100 ms on
 *      a slow one — both meaningless, and different per machine. Samples are
 *      emitted on a fixed cadence derived from `dt`.
 *   3. Not re-rendering React 60 times a second. The authoritative clock lives
 *      in a ref that the loop mutates in place; React state is updated only on
 *      the sample tick. A component that renders sliders at 60 fps stutters the
 *      very loop it is trying to draw.
 */

/** Largest `dt` a single frame may report, in seconds. */
const MAX_DT = 0.1;

export const CLOCK_ZERO = Object.freeze({ t: 0, frame: 0, dt: 0, isPlaying: false });

/**
 * One frame of clock arithmetic, as a pure function.
 *
 * Extracted from the hook so the frame-rate-independence claim is testable
 * without a browser: feed it a 60 Hz `dt` sequence and a 144 Hz one and the
 * elapsed time and the sample count must agree. Inside a `useEffect` that
 * property is only assertable by watching a real display.
 *
 * `carry` is the leftover time since the last sample. Returns the advanced
 * clock, the new carry, and whether this frame emits a sample.
 */
export function advanceClock(clock, rawDt, interval, carry) {
  const dt = Math.min(rawDt, MAX_DT);
  const next = { t: clock.t + dt, frame: clock.frame + 1, dt, isPlaying: clock.isPlaying };

  if (!(interval > 0)) return { clock: next, carry, sample: false };

  let carried = carry + dt;
  if (carried < interval) return { clock: next, carry: carried, sample: false };

  // One sample per frame at most, deliberately. Draining the whole accumulator
  // after a stall would emit a burst of samples that all read the same input
  // value, which `stepRegime` would count as a sustained hold the learner never
  // performed. Dropping the surplus under-credits instead, and under-crediting
  // is the safe direction.
  carried -= interval;
  if (carried > interval) carried = 0;

  return { clock: next, carry: carried, sample: true };
}

/**
 * Runs a `requestAnimationFrame` loop and reports elapsed simulation time.
 *
 * `onFrame(clock, dt)` fires every frame and must not call `setState` — it is
 * for mutating refs and drawing to a canvas. `onSample(clock)` fires on the
 * fixed cadence and is where React state belongs.
 *
 * Returns `{ clockRef, clock, isPlaying, play, pause, toggle, reset }`. Read
 * `clockRef.current` inside a frame callback; read `clock` when rendering.
 */
export function useSimClock({ autoStart = true, sampleHz = 8, renderHz = 0, speed = 1, onFrame, onSample } = {}) {
  const [isPlaying, setIsPlaying] = useState(autoStart);
  const [clock, setClock] = useState(() => ({ ...CLOCK_ZERO, isPlaying: autoStart }));

  /**
   * Speed lives in a ref, not the effect's dependency list.
   *
   * Changing it mid-run must not tear down the loop: a restart re-establishes
   * the frame baseline, which drops a frame and shows up as a visible hitch at
   * the exact moment the learner clicked 2×. Reading it per frame instead means
   * the rate changes on the very next frame with no discontinuity in `t`.
   */
  const speedRef = useRef(speed);
  useEffect(() => { speedRef.current = speed > 0 ? speed : 0; }, [speed]);

  /**
   * Two separate ideas, deliberately not collapsed into one flag.
   *
   * `isPlaying` is what the learner asked for. `isVisible` is what the browser
   * is doing to us. The loop runs on the conjunction, so a tab switch suspends
   * the simulation without overwriting the learner's choice, and coming back
   * restores exactly the state they left.
   *
   * An earlier version toggled `isPlaying` from the visibility handler instead.
   * That handler only fires on a *change*, so a page opened in an already-hidden
   * tab kept `isPlaying` true while no frame ever ran — the transport read
   * "running" over a clock frozen at zero.
   */
  const isVisible = useDocumentVisible();
  const isRunning = isPlaying && isVisible;

  const clockRef = useRef({ t: 0, frame: 0, dt: 0, isPlaying: autoStart });

  /**
   * Callbacks live in refs so that a consumer re-rendering — which happens on
   * every slider drag — does not tear down and restart the loop. Restarting
   * resets the frame baseline, which is exactly the visible stutter that
   * "the animation must not break when an input changes" is asking us to avoid.
   */
  const frameRef = useRef(onFrame);
  const sampleRef = useRef(onSample);
  useEffect(() => { frameRef.current = onFrame; }, [onFrame]);
  useEffect(() => { sampleRef.current = onSample; }, [onSample]);

  useEffect(() => { clockRef.current.isPlaying = isRunning; }, [isRunning]);

  useEffect(() => {
    if (!isRunning) return undefined;

    const interval = sampleHz > 0 ? 1 / sampleHz : 0;
    const renderInterval = renderHz > 0 ? 1 / renderHz : 0;
    let raf = 0;
    let last = null;
    let accumulated = 0;
    let rendered = 0;

    const step = (now) => {
      raf = requestAnimationFrame(step);

      // The first frame after a start or a resume only establishes the
      // baseline. Without this, `dt` on that frame is the whole time the tab
      // spent in the background.
      if (last === null) {
        last = now;
        return;
      }

      // Speed scales elapsed time before the clamp, so 2× still cannot leap the
      // simulation forward after a stall — it just reaches the ceiling sooner.
      const elapsed = ((now - last) / 1000) * speedRef.current;
      const advanced = advanceClock(clockRef.current, elapsed, interval, accumulated);
      last = now;
      accumulated = advanced.carry;

      // Mutated in place rather than replaced: `clockRef.current` is the object
      // handed to every frame callback, and swapping it each frame would hand
      // out 60 short-lived objects a second for no benefit.
      const current = clockRef.current;
      current.t = advanced.clock.t;
      current.frame = advanced.clock.frame;
      current.dt = advanced.clock.dt;

      frameRef.current?.(current, current.dt);

      if (advanced.sample) {
        sampleRef.current?.(current);
        setClock({ t: current.t, frame: current.frame, dt: current.dt, isPlaying: true });
        rendered = 0;
        return;
      }

      /**
       * The render tick, for consumers that draw the clock through React.
       *
       * The blanket "never re-render at 60 fps" rule in the header is about a
       * page holding many live simulators. A mission route holds exactly one,
       * and one small SVG re-rendering at `renderHz` is cheap — cheaper than the
       * alternative of reaching into the DOM behind React's back for 49 separate
       * scenes. Opt-in, and off by default so the sampling consumers are
       * unaffected.
       */
      if (renderInterval > 0) {
        rendered += current.dt;
        if (rendered >= renderInterval) {
          rendered = 0;
          setClock({ t: current.t, frame: current.frame, dt: current.dt, isPlaying: true });
        }
      }
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isRunning, sampleHz, renderHz]);

  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);
  const toggle = useCallback(() => setIsPlaying((value) => !value), []);

  const reset = useCallback(() => {
    clockRef.current = { t: 0, frame: 0, dt: 0, isPlaying: clockRef.current.isPlaying };
    setClock({ ...CLOCK_ZERO, isPlaying: clockRef.current.isPlaying });
  }, []);

  return { clockRef, clock, isPlaying, isRunning, isVisible, play, pause, toggle, reset };
}

function subscribeToVisibility(notify) {
  document.addEventListener('visibilitychange', notify);
  return () => document.removeEventListener('visibilitychange', notify);
}

/**
 * Whether the document is currently visible.
 *
 * Read as an external store rather than seeded into state from an effect, both
 * because the lint rule forbids the latter and because the snapshot is correct
 * on the very first render — which is the whole point here. Browsers throttle
 * `requestAnimationFrame` in hidden tabs rather than stopping it, and throttled
 * frames still carry real elapsed time, so a regime hold would keep accruing
 * while nobody is watching. Suspending the loop fixes that and returns the CPU.
 *
 * The server snapshot is `true`: markup is rendered for a page that is about to
 * be looked at.
 */
export function useDocumentVisible() {
  return useSyncExternalStore(
    subscribeToVisibility,
    () => document.visibilityState !== 'hidden',
    () => true,
  );
}

/**
 * `prefers-reduced-motion`, as a boolean that tracks changes.
 *
 * Note what this does *not* gate: the clock itself. In an explore simulator the
 * motion is the content — pausing it would remove the thing being taught, not
 * an embellishment. Consumers use this to drop decorative easing and trails
 * while the simulation keeps running.
 */
const MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function subscribeToMotion(notify) {
  const query = window.matchMedia(MOTION_QUERY);
  query.addEventListener('change', notify);
  return () => query.removeEventListener('change', notify);
}

/**
 * `useSyncExternalStore` rather than an effect that seeds state.
 *
 * Reading the query into state from an effect body is a cascading render, and
 * the lint rule that caught it here is right: the media query is an external
 * store with a subscribe and a snapshot, so it should be read as one. The server
 * snapshot is `false` so the markup matches the first client render.
 */
export function useReducedMotion() {
  return useSyncExternalStore(
    subscribeToMotion,
    () => window.matchMedia(MOTION_QUERY).matches,
    () => false,
  );
}
