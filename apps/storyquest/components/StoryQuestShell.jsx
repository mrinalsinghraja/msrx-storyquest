'use client';

import Link from 'next/link';
import ChoiceBar from './ChoiceBar';
import MathFormula from './MathFormula';
import MSRXLogo from './MSRXLogo';
import ProgressBadge from './ProgressBadge';
import SearchPalette, { useSearchPalette } from './SearchPalette';

/**
 * The trail from the catalogue root down to the mission being played.
 *
 * Derived here rather than passed in, because all three runtimes render this
 * shell with the same `mission` record and threading four identical props
 * through each of them invites them to drift apart.
 */
function trailFor(mission) {
  if (!mission) return [];
  const trail = [{ label: 'Catalogue', href: '/learn' }];
  if (mission.subject && mission.subjectLabel) {
    trail.push({ label: mission.subjectLabel, href: `/learn/${mission.subject}` });
  }
  if (mission.chapterSlug && mission.chapterLabel) {
    trail.push({ label: mission.chapterLabel, href: `/learn/${mission.subject}/${mission.chapterSlug}` });
  }
  return trail;
}

export default function StoryQuestShell({
  visual,
  paragraphs,
  choices,
  onChoose,
  progress,
  conceptLabel,
  missionNumber,
  formula,
  mission,
  /** True once both sides of the relationship agree; lights the casing. */
  solved = false,
  onExit,
  children,
}) {
  const palette = useSearchPalette();
  const trail = trailFor(mission);

  /**
   * Back goes up one level, not all the way out.
   *
   * It used to jump to `/learn` from four levels deep, which threw away the
   * chapter the learner was browsing and made "back" mean "start over". The
   * chapter is the page they actually came from; `onExit` stays as the fallback
   * for any caller that has no mission record to derive a parent from.
   */
  const parent = trail[trail.length - 1];

  return (
    <div
      className="mission flex h-[100dvh] flex-col overflow-hidden text-[var(--text-primary)]"
      data-world={mission?.subject}
    >
      <header className="nav-blur flex shrink-0 items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-2.5 sm:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          {parent ? (
            <Link
              href={parent.href}
              aria-label={`Back to ${parent.label}`}
              className="focus-ring grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[var(--border-strong)] bg-white text-[var(--text-secondary)] transition hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
            >
              <span aria-hidden="true" className="text-base leading-none">‹</span>
            </Link>
          ) : (
            <button
              type="button"
              aria-label="Return to mission library"
              onClick={onExit}
              className="focus-ring grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[var(--border-strong)] bg-white text-[var(--text-secondary)] transition hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
            >
              <span aria-hidden="true" className="text-base leading-none">‹</span>
            </button>
          )}

          <Link href="/" aria-label="MSRX StoryQuest home" className="focus-ring shrink-0 rounded-lg">
            <MSRXLogo size={22} />
          </Link>

          <div className="min-w-0">
            {trail.length ? (
              <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
                {trail.map((crumb, index) => (
                  <span key={crumb.href} className="flex min-w-0 items-center gap-1">
                    {index > 0 ? <span aria-hidden="true">›</span> : null}
                    {/* Deeper crumbs are the useful ones, so the shallow ones
                      * collapse first when the header runs out of room. */}
                    <Link
                      href={crumb.href}
                      className={`focus-ring truncate rounded transition-colors hover:text-[var(--text-primary)] ${index === 0 ? 'hidden sm:inline' : ''}`}
                    >
                      {crumb.label}
                    </Link>
                  </span>
                ))}
              </nav>
            ) : (
              <p className="truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
                StoryQuest · Mission {missionNumber ?? 'LIVE'}
              </p>
            )}
            <p className="mt-0.5 truncate text-[13px] font-semibold text-[var(--text-primary)]">{conceptLabel}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => palette.setOpen(true)}
            aria-label="Search missions"
            className="focus-ring grid h-9 w-9 place-items-center rounded-xl border border-[var(--border-strong)] bg-white text-[var(--text-secondary)] transition hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="9" cy="9" r="5.5" />
              <path d="M13.2 13.2 17 17" strokeLinecap="round" />
            </svg>
          </button>
          <ProgressBadge current={progress.current} total={progress.total} />
        </div>
      </header>

      <SearchPalette open={palette.open} onClose={palette.close} />

      <main
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6 sm:py-7"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="mx-auto max-w-3xl">
          {/* Apparatus and equation in one casing.
            *
            * They were two stacked cards — a grey equation bar, then a
            * separately-ringed lab — which read as two unrelated widgets that
            * happened to be adjacent. The equation is the rule this machine
            * obeys, so it belongs on the machine. */}
          {visual ? (
            <div className="console" data-world={mission?.subject} data-state={solved ? 'success' : undefined}>
              <div className="console-rail">
                <span className="console-lamp" aria-hidden="true" />
                <span className="console-name">{mission?.title ?? conceptLabel}</span>
                <span className="console-live">Running</span>
              </div>

              <div className="console-screen">{visual}</div>

              {formula ? (
                <div className="console-formula">
                  <span className="label">What has to balance</span>
                  <MathFormula expression={formula} />
                </div>
              ) : null}
            </div>
          ) : null}

          {/* The heading only earns its place when there is a feed under it.
            * Construct and explore state their brief on the apparatus itself and
            * pass no paragraphs, which left the label stranded over blank space. */}
          {paragraphs?.length ? (
            <article className="space-y-4 py-6 text-[15px] leading-7 text-[var(--text-secondary)] sm:text-base sm:leading-8">
              {/* "Narrative feed" named the subsystem, not the content. This
                * says what the paragraphs under it actually are. */}
              <p className="step-label">What is happening</p>
              {paragraphs.map((paragraph, index) => (
                <p key={`${index}-${paragraph.slice(0, 28)}`}>{paragraph}</p>
              ))}
            </article>
          ) : null}

          {children}
        </div>
      </main>

      {choices?.length ? (
        <footer className="shrink-0 border-t border-[var(--border)] bg-[var(--paper-warm)] px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6">
          <div className="mx-auto max-w-3xl">
            {/* Asks the question the buttons answer. "Decision relay" described
              * the mechanism routing the choice, which is not the learner's
              * problem. */}
            <p className="step-label mb-2">What do you do?</p>
            <ChoiceBar choices={choices} onChoose={onChoose} />
          </div>
        </footer>
      ) : null}
    </div>
  );
}
