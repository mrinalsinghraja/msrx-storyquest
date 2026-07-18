'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import MathFormula from './MathFormula';
import SiteFooter from './SiteFooter';
import SiteHeader from './SiteHeader';
import { labTitle } from '../lib/labs';

/** Subject tints, matching the pastel app-icon treatment used on the portal. */
const subjectTint = {
  cyan: { bg: '#F0F9FF', fg: '#0369A1' },
  violet: { bg: '#FAF5FF', fg: '#9333EA' },
  amber: { bg: '#EEF2FF', fg: '#4F46E5' },
  emerald: { bg: '#F0FDF4', fg: '#15803D' },
};

const difficulties = ['all', 'Foundation', 'Explorer', 'Challenge'];

export default function MissionLobby({ curriculum, subjects }) {
  const router = useRouter();
  const [subject, setSubject] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(curriculum[0].id);

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return curriculum.filter((mission) => {
      const matchesSubject = subject === 'all' || mission.subject === subject;
      const matchesDifficulty = difficulty === 'all' || mission.difficulty === difficulty;
      const matchesSearch = !search || [mission.title, mission.subjectLabel, labTitle(mission.lab), mission.scenario, mission.model.control.label].join(' ').toLowerCase().includes(search);
      return matchesSubject && matchesDifficulty && matchesSearch;
    });
  }, [curriculum, difficulty, query, subject]);

  const selected = filtered.find((mission) => mission.id === selectedId) ?? filtered[0] ?? curriculum[0];
  const selectedTint = subjectTint[selected.color] ?? subjectTint.cyan;

  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-[var(--border)]" style={{ background: 'linear-gradient(160deg, #f8f9ff 0%, #f0f4ff 45%, #f5f0ff 100%)' }}>
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div style={{ position: 'absolute', top: '8%', right: '10%', width: 300, height: 300, background: 'radial-gradient(ellipse, rgba(0,196,223,0.13) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)' }} />
            <div style={{ position: 'absolute', bottom: '-10%', left: '4%', width: 280, height: 280, background: 'radial-gradient(ellipse, rgba(139,92,246,0.11) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)' }} />
          </div>

          <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--accent-cyan)]">Mission control</p>
            <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
              Choose the system you want to understand.
            </h1>
            <p className="mt-4 max-w-2xl text-[16px] leading-7 text-[var(--text-secondary)]">
              100 interactive missions across four worlds. Each one has its own scenario, its own control, and its own
              equation to satisfy.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[['100', 'interactive missions'], ['16', 'visual lab systems'], ['4', 'STEM worlds']].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-[var(--border)] bg-white px-5 py-4 shadow-[var(--shadow-card)]">
                  <span className="text-2xl font-bold text-[var(--text-primary)]">{value}</span>
                  <span className="ml-2 text-[12px] font-medium uppercase tracking-[0.1em] text-[var(--text-tertiary)]">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
          <div className="flex flex-col gap-4 border-b border-[var(--border)] pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--accent-purple)]">Curriculum</p>
              <h2 className="mt-2 text-2xl font-bold text-[var(--text-primary)]">Explore by world</h2>
            </div>
            <label className="relative block w-full max-w-md">
              <span className="sr-only">Search missions</span>
              <span aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">⌕</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                type="search"
                placeholder="Search concepts, labs, or scenarios"
                className="focus-ring min-h-12 w-full rounded-xl border border-[var(--border-strong)] bg-white pl-10 pr-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
              />
            </label>
          </div>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            <button
              type="button"
              onClick={() => setSubject('all')}
              className={`focus-ring min-h-11 shrink-0 rounded-xl border px-4 text-sm font-semibold transition ${subject === 'all' ? 'border-transparent bg-[var(--text-primary)] text-white' : 'border-[var(--border-strong)] bg-white text-[var(--text-secondary)] hover:bg-[var(--surface)]'}`}
            >
              All missions
            </button>
            {subjects.map((item) => {
              const tint = subjectTint[item.color] ?? subjectTint.cyan;
              const active = subject === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSubject(item.id)}
                  style={active ? { background: tint.bg, color: tint.fg, borderColor: tint.fg } : undefined}
                  className={`focus-ring min-h-11 shrink-0 rounded-xl border px-4 text-sm font-semibold transition ${active ? '' : 'border-[var(--border-strong)] bg-white text-[var(--text-secondary)] hover:bg-[var(--surface)]'}`}
                >
                  <span className="mr-2">{item.icon}</span>{item.label}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-tertiary)]">Level</span>
            {difficulties.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setDifficulty(item)}
                className={`focus-ring min-h-9 rounded-lg px-3 text-xs font-semibold transition ${difficulty === item ? 'bg-[#00c4df]/10 text-[#0891a5]' : 'text-[var(--text-tertiary)] hover:bg-[var(--surface)] hover:text-[var(--text-secondary)]'}`}
              >
                {item === 'all' ? 'All levels' : item}
              </button>
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-[var(--text-secondary)]">
                {filtered.length} {filtered.length === 1 ? 'mission' : 'missions'} ready to explore
              </p>
              <span className="text-xs text-[var(--text-tertiary)]">Select a card for preview</span>
            </div>

            {filtered.length ? (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((mission) => {
                  const tint = subjectTint[mission.color] ?? subjectTint.cyan;
                  const active = selected.id === mission.id;
                  return (
                    <button
                      key={mission.id}
                      type="button"
                      onClick={() => setSelectedId(mission.id)}
                      className={`card-hover focus-ring min-h-44 rounded-2xl border bg-white p-4 text-left shadow-[var(--shadow-card)] transition ${active ? 'border-[#00c4df]' : 'border-[var(--border)]'}`}
                    >
                      <span className="flex items-start justify-between gap-2">
                        <span className="rounded-lg px-2 py-1 text-[10px] font-bold" style={{ background: tint.bg, color: tint.fg }}>
                          {mission.icon} M{String(mission.number).padStart(3, '0')}
                        </span>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">{mission.difficulty}</span>
                      </span>
                      <span className="mt-7 block text-[15px] font-semibold text-[var(--text-primary)]">{mission.title}</span>
                      <span className="mt-2 block text-xs text-[var(--text-secondary)]">Tune {mission.model.control.label.toLowerCase()}</span>
                      <span className="mt-4 block text-xs font-semibold text-[var(--accent-cyan)]">Preview mission →</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[var(--border-strong)] bg-white p-10 text-center">
                <p className="text-lg font-semibold text-[var(--text-primary)]">No mission found</p>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">Try a wider search or clear a filter.</p>
                <button
                  type="button"
                  onClick={() => { setQuery(''); setSubject('all'); setDifficulty('all'); }}
                  className="focus-ring msrx-gradient mt-5 rounded-full px-5 py-3 text-sm font-semibold text-white"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-20 lg:h-fit">
            <div className="premium-ring overflow-hidden rounded-2xl border border-[var(--border)] bg-white">
              <div className="p-6" style={{ background: `linear-gradient(160deg, ${selectedTint.bg} 0%, #ffffff 100%)` }}>
                <div className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-2xl shadow-[var(--shadow-card)]" style={{ color: selectedTint.fg }}>
                    {selected.icon}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[var(--text-secondary)] shadow-[var(--shadow-card)]">
                    MISSION {String(selected.number).padStart(3, '0')}
                  </span>
                </div>
                <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
                  {selected.subjectLabel} · {selected.difficulty}
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-[var(--text-primary)]">{selected.title}</h2>
                <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">{selected.scenario}</p>
              </div>

              <div className="border-t border-[var(--border)] p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-tertiary)]">Assigned lab</span>
                  <span className="rounded-full bg-[var(--surface)] px-2.5 py-1 text-xs font-semibold text-[var(--text-secondary)]">{labTitle(selected.lab)}</span>
                </div>
                <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-4 text-center text-[var(--text-primary)]">
                  <MathFormula expression={selected.formula} />
                </div>
                <button
                  type="button"
                  onClick={() => router.push(`/missions/${selected.id}`)}
                  className="focus-ring msrx-gradient mt-5 inline-flex w-full items-center justify-center rounded-full px-4 py-3.5 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Enter this mission <span aria-hidden="true" className="ml-2">→</span>
                </button>
                <p className="mt-4 text-center text-xs leading-5 text-[var(--text-tertiary)]">
                  No sign-in. Start immediately. Follow the evidence.
                </p>
              </div>
            </div>
          </aside>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
