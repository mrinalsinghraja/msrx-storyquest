'use client';

import { BOARDS } from '../lib/registry';
import { useBoard } from './BoardProvider';

/**
 * The syllabus lens.
 *
 * Reads as a line of type rather than a row of pills: the underline is the only
 * state change, which is the same treatment the catalogue filters use. A control
 * that changes what every heading on the page says should not itself shout.
 */
export default function BoardSelector() {
  const { board, setBoard } = useBoard();

  return (
    <div className="board-lens">
      <span className="data filter-label" id="board-label">Syllabus</span>
      <div className="filter-set" role="group" aria-labelledby="board-label">
        {BOARDS.map((entry) => (
          <button
            key={entry.id}
            type="button"
            className="chip focus"
            aria-pressed={board === entry.id}
            title={entry.blurb}
            onClick={() => setBoard(entry.id)}
          >
            {entry.short}
          </button>
        ))}
      </div>
    </div>
  );
}
