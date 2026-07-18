import Link from 'next/link';
import MSRXLogo from '../components/MSRXLogo';

export default function NotFound() {
  return (
    <main className="grid min-h-[100dvh] flex-1 place-items-center px-6" style={{ background: 'linear-gradient(160deg, #f8f9ff 0%, #f0f4ff 45%, #f5f0ff 100%)' }}>
      <section className="premium-ring max-w-sm rounded-2xl border border-[var(--border)] bg-white p-7 text-center">
        <span className="inline-flex"><MSRXLogo size={28} /></span>
        <p className="mt-4 text-[13px] font-semibold uppercase tracking-[0.16em] text-[var(--accent-purple)]">404</p>
        <h1 className="mt-2 text-xl font-semibold text-[var(--text-primary)]">This story path does not exist.</h1>
        <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">The mission you were looking for is not in the library.</p>
        <Link
          href="/missions"
          className="focus-ring msrx-gradient mt-6 inline-flex min-h-[52px] items-center rounded-full px-5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Browse the mission library
        </Link>
      </section>
    </main>
  );
}
