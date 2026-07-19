'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import StoryQuestShell from './StoryQuestShell';
import CompletionCard from './CompletionCard';
import { evaluatePredicate } from '../lib/predicate';
import { CLOCK_ZERO, useReducedMotion, useSimClock } from '../lib/clock';
import { INITIAL_REGIME, stepRegime, windowFor } from '../lib/regime';
import { recordCompletion } from '../lib/progress';

/**
 * `explore` runtime — reach a regime, then say what you saw.
 *
 * Two stages, because reaching a regime by accident is not the same as
 * understanding it. The learner first holds the system inside the described
 * window long enough for it to be deliberate, and only then answers a
 * checkpoint about what actually happened.
 *
 * Success is only registered after the checkpoint. Sustaining the regime is
 * necessary but not sufficient, which is the whole reason the checkpoint exists.
 *
 * The system runs continuously rather than only on input: the projection may
 * read `clock.t`, so the observed value can evolve while the learner sits still
 * and watches. See `lib/clock.js` for why sampling is decoupled from frames.
 */
export default function ExploreRuntime({ mission }) {
  const router = useRouter();
  const spec = mission.engine;
  const regime = spec.validation.regime;
  const checkpoint = spec.validation.checkpoint;

  const initialInputs = useMemo(
    () => Object.fromEntries(spec.controls.map((control) => [control.id, control.start ?? control.min])),
    [spec.controls],
  );

  const [inputs, setInputs] = useState(initialInputs);
  const [tracker, setTracker] = useState(INITIAL_REGIME);
  const [answer, setAnswer] = useState(null);
  const [observed, setObserved] = useState(null);

  const reducedMotion = useReducedMotion();
  const bounds = useMemo(() => windowFor(regime), [regime]);

  /**
   * The live control values, mirrored out of React state.
   *
   * The frame loop reads this rather than the state variable so a slider drag
   * takes effect on the very next frame without the loop being torn down and
   * restarted — the loop's dependencies never mention the inputs at all. The
   * state copy exists only because the range inputs are controlled.
   */
  const inputsRef = useRef(initialInputs);

  /**
   * The observed variable.
   *
   * Derived from the inputs and the clock by the authored projection, so what
   * the tracker watches is the same number the learner sees on the readout. A
   * tracker reading a different quantity from the display is the kind of bug
   * that makes a simulator feel broken without ever throwing.
   *
   * The projection is a compiled tree walked by the predicate interpreter, not
   * a function: a function cannot be serialised from a server component into
   * this one, and the tree also keeps the simulator free of `eval` under the
   * production CSP.
   */
  const project = useCallback(
    (values, clock) => {
      try {
        return evaluatePredicate(spec.projection, {
          state: values,
          count: {},
          built: [],
          target: {},
          clock: clock ?? CLOCK_ZERO,
        });
      } catch {
        // A malformed projection reads as "no measurement", which the regime
        // tracker already treats as breaking the hold.
        return null;
      }
    },
    [spec.projection],
  );

  /**
   * One sample: measure, advance the tracker, update the readout.
   *
   * Everything React needs to re-render happens here and only here, at
   * `sampleHz` rather than at the refresh rate. `sustainFor` is authored in
   * samples, so this cadence — not the frame rate — is what "hold it for three
   * samples" means, and it is the same on every display.
   */
  const sample = useCallback((clock) => {
    const value = project(inputsRef.current, clock);
    setObserved(value);
    setTracker((state) => stepRegime(state, value, regime));
  }, [project, regime]);

  const { clock, isPlaying, isRunning, play, pause, toggle, reset: resetClock } = useSimClock({
    sampleHz: Number.isFinite(regime?.sampleHz) && regime.sampleHz > 0 ? regime.sampleHz : 8,
    onSample: sample,
  });

  /**
   * The tracker stops once satisfied, so the loop has no more work to do.
   * Leaving it running would burn a frame callback behind the checkpoint panel
   * for as long as the learner takes to answer.
   */
  useEffect(() => {
    if (tracker.satisfied) pause();
  }, [pause, tracker.satisfied]);

  const setInput = useCallback((id, raw) => {
    const parsed = Number.parseFloat(raw);
    const next = { ...inputsRef.current, [id]: parsed };
    inputsRef.current = next;
    setInputs(next);

    // While the clock is suspended there is no sample tick, so a control change
    // is the only event that can advance anything. Without this the simulator
    // looks dead whenever the learner pauses it.
    if (!isRunning) {
      const value = project(next, CLOCK_ZERO);
      setObserved(value);
      setTracker((state) => stepRegime(state, value, regime));
    }
  }, [isRunning, project, regime]);

  const answered = answer !== null;
  const correct = answered && answer === checkpoint.answerIndex;
  const complete = tracker.satisfied && correct;

  /**
   * Registers the completion, once, on the transition into the complete state.
   *
   * Effect rather than render-phase, for the same reason as the construct
   * runtime: `reactStrictMode` double-invokes render, so writing to localStorage
   * there logged a first completion twice as `plays: 2`.
   *
   * Note the gate is `complete`, not `tracker.satisfied` — holding the regime is
   * necessary but not sufficient, and nothing is recorded until the checkpoint
   * is answered correctly.
   */
  useEffect(() => {
    if (complete) recordCompletion(mission.id, { kind: 'explore' });
  }, [complete, mission.id]);

  const replay = useCallback(() => {
    inputsRef.current = initialInputs;
    setInputs(initialInputs);
    setTracker(INITIAL_REGIME);
    setAnswer(null);
    setObserved(null);
    resetClock();
    play();
  }, [initialInputs, play, resetClock]);

  const sustainFor = regime.sustainFor ?? 1;

  const visual = (
    <div
      className="apparatus explore"
      data-world={mission.subject}
      data-in-window={tracker.inWindow || undefined}
      data-running={isRunning || undefined}
      data-reduced-motion={reducedMotion || undefined}
    >
      <p className="apparatus-brief">{spec.brief}</p>

      <div className="explore-readout">
        <span className="data explore-label">{regime.variable}</span>
        <output className="explore-value">{Number.isFinite(observed) ? observed.toFixed(2) : '—'}</output>
        {bounds && (
          <span className="data explore-window">
            target {bounds.min} – {bounds.max}
          </span>
        )}
      </div>

      {/* The clock is stated, not hidden. A learner watching a value drift needs
        * to know whether it is drifting because of them or because of time, and
        * a paused simulation that looks identical to a running one is the most
        * common way an explore simulator reads as broken. */}
      <div className="explore-clock">
        <button
          type="button"
          className="explore-transport data focus"
          onClick={toggle}
          aria-pressed={isPlaying}
          disabled={tracker.satisfied}
        >
          {isPlaying ? '❙❙ pause' : '▶ run'}
        </button>
        <span className="data explore-elapsed" aria-live="off">
          t = {clock.t.toFixed(1)} s
        </span>
      </div>

      {/* Progress toward the hold, not toward the window. The learner needs to
        * see that staying put is the task once they have arrived. */}
      <div className="explore-hold">
        <span className="data">
          {tracker.satisfied
            ? `${regime.reaches} — held`
            : tracker.inWindow
              ? `holding ${tracker.streak}/${sustainFor}`
              : isRunning
                ? 'outside the window'
                : 'paused'}
        </span>
        <div className="explore-meter" role="presentation">
          <span style={{ width: `${Math.min(100, (tracker.streak / sustainFor) * 100)}%` }} />
        </div>
      </div>

      <div className="explore-controls">
        {spec.controls.map((control) => (
          <label key={control.id} className="explore-control">
            <span className="data">{control.label}{control.unit ? ` (${control.unit})` : ''}</span>
            <input
              type="range"
              min={control.min}
              max={control.max}
              step={control.step ?? 0.01}
              value={inputs[control.id]}
              onChange={(event) => setInput(control.id, event.target.value)}
              className="focus"
            />
            <output className="data">{Number(inputs[control.id]).toFixed(2)}</output>
          </label>
        ))}
      </div>

      {tracker.satisfied && (
        <section className="explore-checkpoint">
          <h4>{checkpoint.prompt}</h4>
          <ul>
            {checkpoint.options.map((option, index) => (
              <li key={option}>
                <button
                  type="button"
                  className="explore-option focus"
                  aria-pressed={answer === index}
                  onClick={() => setAnswer(index)}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
          {answered && !correct && (
            // Names what to do next rather than just marking it wrong.
            <p className="caption">
              Not what the readout showed. Move the controls back through the window and watch the value again.
            </p>
          )}
        </section>
      )}
    </div>
  );

  return (
    <StoryQuestShell
      visual={visual}
      paragraphs={spec.narrative ?? []}
      choices={[]}
      progress={complete ? 1 : tracker.satisfied ? 0.6 : 0}
      conceptLabel={`${mission.subjectLabel} · ${mission.difficulty}`}
      missionNumber={String(mission.number).padStart(3, '0')}
      formula={null}
      onExit={() => router.push('/learn')}
    >
      {complete ? (
        <CompletionCard
          ending={{ title: spec.validation.successTitle ?? 'Regime reached.', body: spec.validation.successBody ?? '' }}
          concept={mission.title}
          pathTitles={[]}
          solved={`${regime.variable} held ${regime.reaches}`}
          controlLabel="Observation"
          onReplay={replay}
          onTryAnother={() => router.push('/learn')}
        />
      ) : null}
    </StoryQuestShell>
  );
}
