import Link from 'next/link';

const footerLinks = [
  { href: '/learn', label: 'Catalogue' },
  { href: '/faq', label: 'FAQ' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms' },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <p className="text-[13px] text-[var(--text-tertiary)]">
          © {new Date().getFullYear()} MSRX. Part of the{' '}
          <a href="https://www.msrx.co.in" className="focus-ring rounded transition-colors hover:text-[var(--text-secondary)]">
            MSRX Apps ecosystem
          </a>
          .
        </p>
        <nav aria-label="Footer navigation" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {footerLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="focus-ring rounded text-[13px] text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-secondary)]"
            >
              {item.label}
            </Link>
          ))}
          <a
            href="mailto:mrinalsinghraja@gmail.com"
            className="focus-ring rounded text-[13px] text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-secondary)]"
          >
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
