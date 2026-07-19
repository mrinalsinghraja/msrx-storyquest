'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import StoryQuestShell from './StoryQuestShell';
import CompletionCard from './CompletionCard';
import { CLOCK_ZERO } from '../lib/clock';
import { runPredicate } from '../lib/predicate';
import { recordCompletion } from '../lib/progress';

/**
 * `construct` runtime — build an artifact until it matches a stated spec.
 *
 * There is no equation and no single control. The learner moves items between
 * slots (electrons into shells, tiles onto a grid) and the success condition is
 * a structural predicate over the resulting arrays.
 *
 * The predicate arrives pre-compiled from the server as a tree, never as a
 * source string: `lib/predicate.js` explains why nothing here may call `eval`.
 */
export default function ConstructRuntime({ mission }) {
  const router = useRouter();
  const spec = mission.engine;

  const [slots, setSlots] = useState(() => spec.initial.slots.map((slot) => ({ ...slot, items: [...(slot.items ?? [])] })));
  const [pool, setPool] = useState(() => [...(spec.initial.pool ?? [])]);

  /**
   * The scope a predicate is written against.
   *
   * Every root in `ALLOWED_ROOTS`. `count` is derived rather than authored so a
   * predicate can ask "how many are in the outer shell" without the simulator
   * having to maintain a parallel tally that could drift.
   *
   * `clock` is supplied as a stopped clock. A construct simulator has no loop —
   * the artifact is built, not evolving — but the root is in the shared grammar,
   * so passing it keeps `clock.t` a readable zero instead of a throw from a
   * predicate that mentions it by mistake.
   */
  const scope = useMemo(() => {
    const byId = Object.fromEntries(slots.map((slot) => [slot.id, slot.items]));
    return {
      state: { slots: byId, pool },
      count: Object.fromEntries(slots.map((slot) => [slot.id, slot.items.length])),
      built: slots.map((slot) => slot.items.length),
      target: spec.target ?? {},
      clock: CLOCK_ZERO,
    };
  }, [pool, slots, spec.target]);

  const { isSatisfied, error } = useMemo(
    () => runPredicate(spec.validation.predicate, scope),
    [scope, spec.validation.predicate],
  );

  /**
   * Registers the completion, once, on the transition into the satisfied state.
   *
   * This has to be an effect. Writing to localStorage during render is a side
   * effect in the render phase, and `reactStrictMode` is on — React
   * double-invokes the render, so a first completion was logged twice and came
   * back as `plays: 2`. A discarded concurrent render would have done the same.
   *
   * The dependency is the boolean, not the mission, so re-renders while still
   * satisfied do not re-fire and no separate `recorded` flag is needed.
   */
  useEffect(() => {
    if (isSatisfied) recordCompletion(mission.id, { kind: 'construct' });
  }, [isSatisfied, mission.id]);

  const place = useCallback((itemId, slotId) => {
    if (isSatisfied) return;
    setPool((current) => current.filter((item) => item.id !== itemId));
    setSlots((current) => current.map((slot) => {
      if (slot.id !== slotId) return { ...slot, items: slot.items.filter((item) => item.id !== itemId) };
      if (slot.items.some((item) => item.id === itemId)) return slot;
      // A slot that is already full silently refuses rather than growing past
      // its capacity, which is usually the thing the predicate is testing.
      if (Number.isInteger(slot.capacity) && slot.items.length >= slot.capacity) return slot;
      const source = current.flatMap((s) => s.items).find((item) => item.id === itemId);
      const item = source ?? pool.find((entry) => entry.id === itemId);
      return item ? { ...slot, items: [...slot.items, item] } : slot;
    }));
  }, [isSatisfied, pool]);

  const returnToPool = useCallback((itemId) => {
    if (isSatisfied) return;
    let removed = null;
    setSlots((current) => current.map((slot) => {
      const found = slot.items.find((item) => item.id === itemId);
      if (found) removed = found;
      return found ? { ...slot, items: slot.items.filter((item) => item.id !== itemId) } : slot;
    }));
    setPool((current) => (removed && !current.some((i) => i.id === removed.id) ? [...current, removed] : current));
  }, [isSatisfied]);

  const reset = useCallback(() => {
    setSlots(spec.initial.slots.map((slot) => ({ ...slot, items: [...(slot.items ?? [])] })));
    setPool([...(spec.initial.pool ?? [])]);
  }, [spec.initial]);

  const visual = (
    <div
      className="apparatus construct"
      data-world={mission.subject}
      data-satisfied={isSatisfied || undefined}
    >
      <p className="apparatus-brief">{spec.brief}</p>

      <div className="construct-slots">
        {slots.map((slot) => (
          <section key={slot.id} className="construct-slot">
            <h4 className="data">
              {slot.label}
              {Number.isInteger(slot.capacity) && (
                <span className="construct-capacity"> {slot.items.length}/{slot.capacity}</span>
              )}
            </h4>
            <ul className="construct-tray">
              {slot.items.map((item) => (
                <li key={item.id}>
                  <button type="button" className="construct-item focus" onClick={() => returnToPool(item.id)}>
                    {item.label}
                  </button>
                </li>
              ))}
              {!slot.items.length && <li className="construct-empty caption">empty</li>}
            </ul>
          </section>
        ))}
      </div>

      <section className="construct-pool">
        <h4 className="data">Available</h4>
        <ul className="construct-tray">
          {pool.map((item) => (
            <li key={item.id}>
              {/* One button per destination keeps this reachable by keyboard.
                * Drag and drop as the only interaction would put the whole
                * simulator out of reach of anyone not using a mouse. */}
              <span className="construct-item construct-item-source">{item.label}</span>
              {slots.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  className="construct-send data focus"
                  onClick={() => place(item.id, slot.id)}
                >
                  → {slot.short ?? slot.label}
                </button>
              ))}
            </li>
          ))}
          {!pool.length && <li className="construct-empty caption">everything is placed</li>}
        </ul>
      </section>

      {/* A broken predicate degrades to "not satisfied yet" with the reason
        * visible in dev, rather than unmounting the simulator. */}
      {error && process.env.NODE_ENV !== 'production' && (
        <p className="construct-error data">predicate error: {error}</p>
      )}
    </div>
  );

  return (
    <StoryQuestShell
      visual={visual}
      paragraphs={spec.narrative ?? []}
      choices={[]}
      progress={isSatisfied ? 1 : 0}
      conceptLabel={`${mission.subjectLabel} · ${mission.difficulty}`}
      missionNumber={String(mission.number).padStart(3, '0')}
      mission={mission}
      formula={null}
      onExit={() => router.push('/learn')}
    >
      {isSatisfied ? (
        <CompletionCard
          ending={{ title: spec.validation.successTitle ?? 'Built to spec.', body: spec.validation.successBody ?? '' }}
          concept={mission.title}
          pathTitles={[]}
          solved={spec.validation.summary ?? 'Structure matches the specification.'}
          controlLabel="Structure"
          onReplay={reset}
          onTryAnother={() => router.push('/learn')}
        />
      ) : null}
    </StoryQuestShell>
  );
}
