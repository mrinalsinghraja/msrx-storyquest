'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import MSRXLogo from './MSRXLogo';

const links = [
  { href: '/learn', label: 'Catalogue' },
  { href: '/faq', label: 'FAQ' },
  { href: '/privacy', label: 'Privacy' },
];

/** `MSRX` in the brand gradient, product name in ink — the house wordmark. */
function Brand() {
  return (
    <Link href="/" className="focus-ring inline-flex select-none items-center gap-2.5 rounded-lg">
      <MSRXLogo size={26} />
      <span className="text-[17px] font-bold tracking-tight">
        <span className="msrx-gradient-text">MSRX</span>{' '}
        <span className="text-[var(--text-primary)]">StoryQuest</span>
      </span>
    </Link>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="nav-blur sticky top-0 z-40 border-b border-[var(--border)]">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Brand />

        <nav aria-label="Primary navigation" className="hidden items-center gap-6 md:flex">
          {links.map((item) => {
            const active = pathname === item.href || (item.href === '/learn' && pathname.startsWith('/learn/'));
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`focus-ring rounded text-[14px] transition-colors ${active ? 'font-semibold text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
              >
                {item.label}
              </Link>
            );
          })}
          <a
            href="https://www.msrx.co.in"
            className="focus-ring inline-flex items-center gap-1 rounded text-[14px] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          >
            MSRX Portal
            <span aria-hidden="true" className="text-[11px]">↗</span>
          </a>
          <Link
            href="/learn"
            className="focus-ring msrx-gradient inline-flex h-9 items-center rounded-full px-4 text-[13px] font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            Start a mission
          </Link>
        </nav>

        <button
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
          className="focus-ring grid h-10 w-10 place-items-center rounded-xl border border-[var(--border-strong)] bg-white text-[var(--text-primary)] md:hidden"
        >
          <span className="text-lg" aria-hidden="true">{isOpen ? '×' : '☰'}</span>
        </button>
      </div>

      {isOpen ? (
        <nav aria-label="Mobile navigation" className="border-t border-[var(--border)] bg-white px-4 py-3 md:hidden">
          <div className="mx-auto grid max-w-6xl gap-1">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="focus-ring rounded-xl px-3 py-3 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--surface)]"
              >
                {item.label}
              </Link>
            ))}
            <a
              href="https://www.msrx.co.in"
              onClick={() => setIsOpen(false)}
              className="focus-ring rounded-xl px-3 py-3 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--surface)]"
            >
              MSRX Portal ↗
            </a>
            <Link
              href="/learn"
              onClick={() => setIsOpen(false)}
              className="focus-ring msrx-gradient mt-1 rounded-xl px-3 py-3 text-center text-sm font-semibold text-white"
            >
              Start a mission
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
