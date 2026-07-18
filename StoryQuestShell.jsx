import React from 'react';

const defaultTargets = [
  { id: 'observe', label: 'Observe' },
  { id: 'compare', label: 'Compare' },
  { id: 'continue', label: 'Continue' },
];

/**
 * Mobile-first shell for a StoryQuest concept screen.
 */
export default function StoryQuestShell({
  visual,
  paragraphs = [
    'Trace the clues in the scene before choosing your next move.',
    'Every choice reveals a different way to understand the concept.',
  ],
  selectionTargets = defaultTargets,
  onSelect,
}) {
  const targets = defaultTargets.map((fallback, index) => ({
    ...fallback,
    ...selectionTargets[index],
  }));

  return (
    <section className="relative h-[100dvh] overflow-hidden bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-20 flex shrink-0 items-center justify-between border-b border-slate-800/90 bg-slate-950/95 px-4 py-3 backdrop-blur sm:px-6">
        <a
          href="/"
          aria-label="story.msrx.co.in home"
          className="group inline-flex items-center gap-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
          <span className="grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br from-cyan-400 to-violet-500 text-sm font-black text-slate-950 shadow-lg shadow-cyan-500/20">
            S
          </span>
          <span className="text-sm font-bold tracking-tight text-slate-100">
            story<span className="text-cyan-300">.</span>msrx<span className="text-cyan-300">.</span>co<span className="text-cyan-300">.</span>in
          </span>
        </a>

        <div aria-label="Concept level" className="flex items-center gap-1.5">
          <span className="rounded-full border border-violet-400/30 bg-violet-400/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-violet-200">
            Concept
          </span>
          <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-cyan-200">
            Level 02
          </span>
        </div>
      </header>

      <main
        className="h-[calc(100dvh-61px)] overflow-y-auto px-4 pb-28 pt-5 sm:px-6"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="mx-auto max-w-3xl">
          <div className="aspect-video overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900 shadow-2xl shadow-black/30">
            {visual ?? (
              <div className="grid h-full place-items-center bg-[radial-gradient(circle_at_50%_35%,rgba(34,211,238,0.18),transparent_45%)] p-6">
                <svg viewBox="0 0 640 360" className="h-full w-full" role="img" aria-label="Interactive story visualization placeholder">
                  <path d="M86 254C166 190 217 248 294 174s141-24 255-108" fill="none" stroke="currentColor" strokeWidth="4" className="text-cyan-300/70" />
                  <circle cx="86" cy="254" r="12" className="fill-violet-400" />
                  <circle cx="294" cy="174" r="12" className="fill-cyan-300" />
                  <circle cx="549" cy="66" r="12" className="fill-violet-400" />
                </svg>
              </div>
            )}
          </div>

          <article className="space-y-4 py-6 text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
            {paragraphs.map((paragraph, index) => (
              <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
            ))}
          </article>
        </div>
      </main>

      <footer className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-800/90 bg-slate-950/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur sm:px-6">
        <div className="mx-auto grid max-w-3xl grid-cols-3 gap-2">
          {targets.map((target) => (
            <button
              key={target.id}
              type="button"
              onClick={() => onSelect?.(target.id)}
              className="min-h-[52px] rounded-xl border border-slate-700 bg-slate-900 px-2 text-sm font-semibold text-slate-100 transition-colors hover:border-cyan-400/70 hover:bg-cyan-400/10 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              {target.label}
            </button>
          ))}
        </div>
      </footer>
    </section>
  );
}
