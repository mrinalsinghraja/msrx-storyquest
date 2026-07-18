export default function CompletionCard({ ending, concept, pathTitles, solved, controlLabel, retelling, onRetell, onReplay, onTryAnother }) {
  return (
    <section className="premium-ring relative overflow-hidden rounded-3xl border border-[var(--border-strong)] bg-white p-6">
      <span
        aria-hidden="true"
        className="absolute -right-16 -top-20 h-48 w-48 rounded-full"
        style={{ background: 'radial-gradient(ellipse, rgba(0,196,223,0.16) 0%, transparent 70%)', filter: 'blur(30px)' }}
      />
      <div className="relative">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent-cyan)]">Mission secured</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-[var(--text-primary)]">{concept}</h2>
        <p className="mt-3 leading-7 text-[var(--text-secondary)]">{ending.summary}</p>

        {solved ? (
          <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-tertiary)]">{controlLabel}</p>
            <p className="mt-1 text-xl font-bold tabular-nums msrx-gradient-text">{solved}</p>
            <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)]">
              This value was not a guess. It is the only setting that satisfies the relationship.
            </p>
          </div>
        ) : null}

        <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-tertiary)]">Your route</p>
        <ol className="mt-2 space-y-2 border-l border-[#00c4df]/30 pl-4 text-sm text-[var(--text-secondary)]">
          {pathTitles.map((title, index) => <li key={`${index}-${title}`}>{title}</li>)}
        </ol>

        <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={onReplay}
            className="focus-ring msrx-gradient min-h-[52px] rounded-xl px-4 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Replay this story
          </button>
          <button
            type="button"
            onClick={onTryAnother}
            className="focus-ring min-h-[52px] rounded-xl border border-[var(--border-strong)] bg-white px-4 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[var(--surface)]"
          >
            Try another concept
          </button>
        </div>

        {onRetell ? (
          <button
            type="button"
            onClick={onRetell}
            disabled={retelling}
            className="focus-ring mt-2 min-h-[48px] w-full rounded-xl border border-[var(--border)] px-4 text-sm font-medium text-[var(--text-secondary)] transition hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] disabled:opacity-60"
          >
            {retelling ? 'Writing a new telling…' : 'Same problem, new story'}
          </button>
        ) : null}
      </div>
    </section>
  );
}
