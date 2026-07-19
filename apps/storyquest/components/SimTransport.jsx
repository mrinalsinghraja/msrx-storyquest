'use client';

/**
 * Transport controls for a live simulator: play/pause, reset, and rate.
 *
 * Deliberately not auto-hiding and not hover-revealed. The pause button is the
 * accessibility escape hatch for a page that now moves on its own — someone who
 * needs the motion to stop has to be able to see how to stop it without first
 * discovering that hovering does something.
 */

const RATES = [0.5, 1, 2];

export default function SimTransport({ isPlaying, elapsed, speed, onToggle, onReset, onSpeed }) {
  return (
    <div className="flex items-center gap-2 border-t border-[var(--border)] bg-[var(--surface)] px-4 py-2">
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={isPlaying}
        aria-label={isPlaying ? 'Pause simulation' : 'Play simulation'}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#00c4df] text-white transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c4df] focus-visible:ring-offset-2"
      >
        <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true" fill="currentColor">
          {isPlaying ? <path d="M4 2h3.2v12H4zM8.8 2H12v12H8.8z" /> : <path d="M4 2.4v11.2l9.6-5.6z" />}
        </svg>
      </button>

      <button
        type="button"
        onClick={onReset}
        aria-label="Restart simulation from zero"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border-strong)] bg-white text-[var(--text-secondary)] transition-colors hover:text-[#00c4df] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c4df]"
      >
        <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M13 8a5 5 0 1 1-1.6-3.7" />
          <path d="M13 2v3.2h-3.2" />
        </svg>
      </button>

      <output
        aria-label="Elapsed simulation time"
        className="shrink-0 tabular-nums text-xs font-bold text-[var(--text-tertiary)]"
      >
        t = {elapsed.toFixed(1)}s
      </output>

      <div className="ml-auto flex shrink-0 items-center gap-1 rounded-full bg-[#f5f5f7] p-0.5" role="group" aria-label="Playback rate">
        {RATES.map((rate) => (
          <button
            key={rate}
            type="button"
            onClick={() => onSpeed(rate)}
            aria-pressed={speed === rate}
            className={`rounded-full px-2.5 py-1 text-[11px] font-bold tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c4df] ${
              speed === rate ? 'bg-white text-[#00c4df] shadow-sm' : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
            }`}
          >
            {rate}×
          </button>
        ))}
      </div>
    </div>
  );
}
