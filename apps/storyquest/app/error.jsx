'use client';

import MSRXLogo from '../components/MSRXLogo';

export default function GlobalError({ reset }) {
  return (
    <main className="grid min-h-[100dvh] flex-1 place-items-center px-6" style={{ background: 'linear-gradient(160deg, #f8f9ff 0%, #f0f4ff 45%, #f5f0ff 100%)' }}>
      <section className="premium-ring max-w-sm rounded-2xl border border-[var(--border)] bg-white p-7 text-center">
        <span className="inline-flex"><MSRXLogo size={28} /></span>
        <p className="mt-4 text-[13px] font-semibold uppercase tracking-[0.16em] text-[var(--accent-cyan)]">StoryQuest</p>
        <h1 className="mt-2 text-xl font-semibold text-[var(--text-primary)]">That path went quiet.</h1>
        <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Try reopening this story from the beginning.</p>
        <button
          type="button"
          onClick={reset}
          className="focus-ring msrx-gradient mt-6 min-h-[52px] rounded-full px-5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Try again
        </button>
      </section>
    </main>
  );
}
