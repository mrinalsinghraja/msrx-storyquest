import Link from 'next/link';
import SiteFooter from '../components/SiteFooter';
import SiteHeader from '../components/SiteHeader';
import MSRXLogo from '../components/MSRXLogo';

const steps = [
  { number: '01', title: 'Enter a live system', text: 'Start inside a problem, not a worksheet. Every mission opens on a situation that is already going wrong.' },
  { number: '02', title: 'Tune the evidence', text: 'Move one real variable and watch both sides of the equation respond in their own units.' },
  { number: '03', title: 'Make the call', text: 'Commit only when the relationship balances. The lab will not let you pass on a guess.' },
];

const subjects = [
  { icon: '⚛', label: 'Physics', bg: '#F0F9FF', fg: '#0369A1', description: 'Torque, circuits, waves, optics and gravity.' },
  { icon: '🧪', label: 'Chemistry', bg: '#FAF5FF', fg: '#9333EA', description: 'Particles, bonding, reactions and pH.' },
  { icon: '⌗', label: 'Mathematics', bg: '#EEF2FF', fg: '#4F46E5', description: 'Ratios, geometry, coordinates and data.' },
  { icon: '🧬', label: 'Biology', bg: '#F0FDF4', fg: '#15803D', description: 'Cells, ecosystems, respiration and homeostasis.' },
];

/** Mirrors the portal hero: soft gradient wash plus ambient cyan/purple blobs. */
function HeroBackdrop() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div style={{ position: 'absolute', top: '5%', left: '5%', width: 350, height: 350, background: 'radial-gradient(ellipse, rgba(0,196,223,0.14) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)' }} />
      <div style={{ position: 'absolute', top: '10%', right: '8%', width: 280, height: 280, background: 'radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)' }} />
      <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 700, height: 180, background: 'radial-gradient(ellipse, rgba(99,102,241,0.07) 0%, transparent 70%)', filter: 'blur(30px)' }} />
    </div>
  );
}

/** Static preview of a lab, drawn in the same light palette as the real thing. */
function LabPreview() {
  return (
    <div className="premium-ring mx-auto w-full max-w-[430px] rounded-[1.75rem] border border-[var(--border-strong)] bg-white p-3">
      <div className="rounded-[1.25rem] border border-[var(--border)] bg-white p-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-tertiary)]">Live relationship</span>
          <span className="rounded-full border border-[#00c4df]/30 bg-[#00c4df]/10 px-2.5 py-1 text-[10px] font-semibold text-[#0891a5]">BALANCED</span>
        </div>

        <svg viewBox="0 0 320 150" className="mt-4 h-auto w-full" role="img" aria-label="A balance beam resting level on its pivot">
          <line x1="30" y1="128" x2="290" y2="128" stroke="#c7c7cc" strokeWidth="2" />
          <rect x="52" y="92" width="216" height="9" rx="4.5" fill="#d1d1d6" />
          <rect x="82" y="60" width="38" height="32" rx="6" fill="#8b5cf6" />
          <rect x="200" y="60" width="38" height="32" rx="6" fill="#00c4df" />
          <path d="M160 101 L142 128 H178 Z" fill="#8b5cf6" />
          <circle cx="160" cy="96" r="9" fill="#ffffff" stroke="#00c4df" strokeWidth="3" />
        </svg>

        <div className="mt-3 grid grid-cols-2 gap-3 border-t border-[var(--border)] pt-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">Load moment</p>
            <p className="text-sm font-bold tabular-nums text-[var(--text-primary)]">21.6 <span className="text-[11px] text-[var(--text-tertiary)]">kN·m</span></p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">Counter moment</p>
            <p className="text-sm font-bold tabular-nums text-[var(--text-primary)]">21.6 <span className="text-[11px] text-[var(--text-tertiary)]">kN·m</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-[var(--border)]" style={{ background: 'linear-gradient(160deg, #f8f9ff 0%, #f0f4ff 45%, #f5f0ff 100%)' }}>
          <HeroBackdrop />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]">
                <MSRXLogo size={13} />
                Interactive STEM
              </p>

              <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-[var(--text-primary)] sm:text-5xl lg:text-6xl">
                Think deeply.<br />
                <span className="msrx-gradient-text">Change the outcome.</span>
              </h1>

              <p className="mt-6 max-w-xl text-[17px] leading-8 text-[var(--text-secondary)]">
                100 interactive missions across physics, chemistry, maths and biology. Tune a live lab until the real
                equation balances — the answer comes from the relationship, never from a guess.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/learn" className="focus-ring msrx-gradient inline-flex min-h-13 items-center justify-center rounded-full px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90">
                  Explore the mission library
                  <span aria-hidden="true" className="ml-2">↗</span>
                </Link>
                <a href="#how-it-works" className="focus-ring inline-flex min-h-13 items-center justify-center rounded-full border border-[var(--border-strong)] bg-white px-6 py-3.5 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[var(--surface)]">
                  See how it works
                </a>
              </div>

              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-[var(--text-tertiary)]">
                <span>No sign-up</span>
                <span>Nothing stored</span>
                <span>Works on mobile</span>
              </div>
            </div>

            <LabPreview />
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="max-w-xl">
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--accent-cyan)]">A clear learning loop</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">Build intuition by doing.</h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {steps.map((step) => (
              <article key={step.number} className="card-hover rounded-2xl border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-card)]">
                <span className="msrx-gradient-text text-sm font-bold">{step.number}</span>
                <h3 className="mt-6 text-lg font-semibold text-[var(--text-primary)]">{step.title}</h3>
                <p className="mt-3 text-[15px] leading-7 text-[var(--text-secondary)]">{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-[var(--border)] bg-[var(--surface)]">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--accent-purple)]">Four connected worlds</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text-primary)]">Find the system behind the story.</h2>
              </div>
              <Link href="/learn" className="focus-ring rounded text-sm font-semibold text-[var(--accent-cyan)] hover:opacity-80">
                Browse all 100 missions →
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {subjects.map((subject) => (
                <Link key={subject.label} href="/learn" className="card-hover focus-ring rounded-2xl border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-card)]">
                  <span className="grid h-11 w-11 place-items-center rounded-xl text-xl" style={{ background: subject.bg, color: subject.fg }}>
                    {subject.icon}
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-[var(--text-primary)]">{subject.label}</h3>
                  <p className="mt-2 text-[14px] leading-6 text-[var(--text-secondary)]">{subject.description}</p>
                  <span className="mt-4 block text-[13px] font-semibold text-[var(--accent-cyan)]">25 missions →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="premium-ring relative overflow-hidden rounded-[1.75rem] border border-[var(--border)] p-8 sm:p-12" style={{ background: 'linear-gradient(160deg, #f8f9ff 0%, #f0f4ff 45%, #f5f0ff 100%)' }}>
            <HeroBackdrop />
            <div className="relative max-w-2xl">
              <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--accent-cyan)]">Mission control is open</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
                Every strong answer starts with a better question.
              </h2>
              <p className="mt-4 text-[16px] leading-7 text-[var(--text-secondary)]">
                Choose a concept. Take control of the lab. Let the evidence decide your next move.
              </p>
              <Link href="/learn" className="focus-ring msrx-gradient mt-7 inline-flex min-h-12 items-center rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90">
                Launch a mission →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
