import Link from 'next/link';
import SiteFooter from '../../components/SiteFooter';
import SiteHeader from '../../components/SiteHeader';

export const metadata = { title: 'Terms of Use', description: 'Terms for using MSRX StoryQuest.' };

const sections = [
  ['Using StoryQuest', 'You may use StoryQuest for personal, classroom, and non-commercial educational exploration. Please use the mission content responsibly and respectfully.'],
  ['Educational content', 'StoryQuest provides interactive conceptual practice. It is not professional scientific, medical, legal, safety, or emergency advice.'],
  ['Availability', 'We aim to keep the experience available and reliable, but features, mission content, and access may change as the product evolves.'],
  ['Intellectual property', 'The StoryQuest interface, mission writing, visual systems, and branding are protected by applicable intellectual-property laws. Do not copy, republish, or resell material without permission.'],
  ['Acceptable use', 'Do not attempt to disrupt the service, bypass security controls, scrape protected resources, or use StoryQuest in a way that harms people or systems.'],
  ['Changes', 'By continuing to use StoryQuest after an update to these terms, you accept the revised terms.'],
];

export default function TermsPage() {
  return (
    <><SiteHeader /><main className="mx-auto w-full max-w-3xl flex-1 px-4 py-14 sm:px-6 lg:py-20"><p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--accent-cyan)]">Legal</p><h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">Terms of Use</h1><p className="mt-4 text-sm text-[var(--text-tertiary)]">Last updated: July 18, 2026</p><div className="mt-10 space-y-9">{sections.map(([title, content]) => <section key={title}><h2 className="text-xl font-semibold text-[var(--text-primary)]">{title}</h2><p className="mt-3 text-[15px] leading-7 text-[var(--text-secondary)]">{content}</p></section>)}<p className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-[15px] leading-7 text-[var(--text-secondary)]">For privacy information, read the <Link className="font-semibold text-[var(--accent-cyan)] hover:opacity-80" href="/privacy">Privacy Policy</Link>.</p></div></main><SiteFooter /></>
  );
}
