import ChoiceBar from './ChoiceBar';
import MathFormula from './MathFormula';
import MSRXLogo from './MSRXLogo';
import ProgressBadge from './ProgressBadge';

export default function StoryQuestShell({
  visual,
  paragraphs,
  choices,
  onChoose,
  progress,
  conceptLabel,
  missionNumber,
  formula,
  onExit,
  children,
}) {
  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-white text-[var(--text-primary)]">
      <header className="nav-blur flex shrink-0 items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-2.5 sm:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <button
            type="button"
            aria-label="Return to mission library"
            onClick={onExit}
            className="focus-ring grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[var(--border-strong)] bg-white text-[var(--text-secondary)] transition hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
          >
            <span aria-hidden="true" className="text-base leading-none">‹</span>
          </button>
          <MSRXLogo size={22} />
          <div className="min-w-0">
            <p className="truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
              StoryQuest · Mission {missionNumber ?? 'LIVE'}
            </p>
            <p className="mt-0.5 truncate text-[13px] font-semibold text-[var(--text-primary)]">{conceptLabel}</p>
          </div>
        </div>
        <ProgressBadge current={progress.current} total={progress.total} />
      </header>

      <main
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6 sm:py-7"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="mx-auto max-w-3xl">
          {formula ? (
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
                Live relationship
              </span>
              <span className="text-[var(--text-primary)]"><MathFormula expression={formula} /></span>
            </div>
          ) : null}

          {visual ? <div className="premium-ring rounded-2xl">{visual}</div> : null}

          {/* The heading only earns its place when there is a feed under it.
            * Construct and explore state their brief on the apparatus itself and
            * pass no paragraphs, which left the label stranded over blank space. */}
          {paragraphs?.length ? (
            <article className="space-y-4 py-6 text-[15px] leading-7 text-[var(--text-secondary)] sm:text-base sm:leading-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--accent-cyan)]">Narrative feed</p>
              {paragraphs.map((paragraph, index) => (
                <p key={`${index}-${paragraph.slice(0, 28)}`}>{paragraph}</p>
              ))}
            </article>
          ) : null}

          {children}
        </div>
      </main>

      {choices?.length ? (
        <footer className="shrink-0 border-t border-[var(--border)] bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6">
          <div className="mx-auto max-w-3xl">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-tertiary)]">
              Decision relay
            </p>
            <ChoiceBar choices={choices} onChoose={onChoose} />
          </div>
        </footer>
      ) : null}
    </div>
  );
}
