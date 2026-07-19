'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import InteractiveGraphFrame from './InteractiveGraphFrame';
import { createModel } from '../lib/models';

/**
 * The home page hero: a real mission, not a picture of one.
 *
 * The page this replaces drew a static SVG of a balance beam with two hardcoded
 * "21.6 kN·m" readouts. It was a photograph of the product's one genuinely
 * unusual property — that the answer falls out of an equation rather than a
 * lookup table — and a photograph cannot demonstrate that. This mounts the same
 * `InteractiveGraphFrame` the mission routes use, on the same model, with the
 * same clock running. A visitor can solve it before they have read a word.
 *
 * Nothing about the mission is special-cased. It is looked up from the
 * curriculum and handed in, so it stays correct if the topic is ever re-authored
 * and it cannot drift from what the mission page itself would show.
 */
export default function HeroLab({ mission }) {
  const model = useMemo(() => createModel(mission.model), [mission]);
  const [percent, setPercent] = useState(mission.model.start ?? 50);

  /**
   * Derived at render rather than stored.
   *
   * `reading` is a pure function of `percent`, so keeping it in state would give
   * the component two sources of truth for the same number and one render where
   * they disagree.
   */
  const reading = model.evaluate(percent);

  return (
    <figure className="console" data-world={mission.subject} data-state={reading.balanced ? 'success' : undefined}>
      <div className="console-rail">
        <span className="console-lamp" aria-hidden="true" />
        <span className="console-name">{mission.title}</span>
        <span className="console-live">Running</span>
      </div>

      <div className="console-screen">
        <InteractiveGraphFrame
          percent={percent}
          model={model}
          reading={reading}
          status="neutral"
          onChange={setPercent}
          labKind={mission.lab}
          world={mission.subject}
        />
      </div>

      {/* Says what to do and what will happen, in that order. The old hero
        * captioned itself "Live relationship", which names the mechanism rather
        * than the action and tells a twelve-year-old nothing. */}
      <figcaption className="console-caption">
        {reading.balanced ? (
          <>
            {/* Says the two sides agree rather than quoting one of them. A
              * balanced reading is inside tolerance, not identical — printing
              * `reading.left` next to "both" claimed 21.6 twice while the right
              * side actually read 21.67. */}
            <b>That is the answer.</b> Both moments now agree, so the jib holds.{' '}
            <Link href={mission.path}>Take the full mission →</Link>
          </>
        ) : (
          <>
            <b>Drag the control.</b> The crane stops creeping when both moments match — no guessing,
            the numbers have to agree.
          </>
        )}
      </figcaption>
    </figure>
  );
}
