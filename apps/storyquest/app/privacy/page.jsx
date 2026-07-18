import Link from 'next/link';
import SiteFooter from '../../components/SiteFooter';
import SiteHeader from '../../components/SiteHeader';

export const metadata = { title: 'Privacy Policy', description: 'Privacy information for MSRX StoryQuest.' };

const sections = [
  ['The short version', 'StoryQuest does not require an account, profile, name, email address, or date of birth to explore missions.'],
  ['Information processed', 'When you visit the site, hosting infrastructure may process standard technical information such as IP address, browser type, device information, and request logs to deliver and protect the service. StoryQuest itself does not provide fields for personal information in its mission flow.'],
  ['Mission activity', 'Mission choices and simulator controls are used in your browser to run the experience. This version of StoryQuest does not create a personal learner profile or store mission history on our servers.'],
  ['Cookies and analytics', 'StoryQuest does not use advertising cookies. If privacy-preserving operational analytics or security tooling is introduced, this policy will be updated before that change takes effect.'],
  ['Third parties', 'The site is hosted on Vercel. Vercel may process technical request data as a service provider to host, secure, and deliver the website.'],
  ['Children', 'StoryQuest is designed for educational exploration. We do not knowingly collect personal information from children through the mission interface.'],
  ['Updates', 'We may revise this policy as the product changes. The latest version will always be available on this page with its updated date.'],
];

export default function PrivacyPage() {
  return (
    <><SiteHeader /><main className="mx-auto w-full max-w-3xl flex-1 px-4 py-14 sm:px-6 lg:py-20"><p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--accent-cyan)]">Legal</p><h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">Privacy Policy</h1><p className="mt-4 text-sm text-[var(--text-tertiary)]">Last updated: July 18, 2026</p><div className="mt-10 space-y-9">{sections.map(([title, content]) => <section key={title}><h2 className="text-xl font-semibold text-[var(--text-primary)]">{title}</h2><p className="mt-3 text-[15px] leading-7 text-[var(--text-secondary)]">{content}</p></section>)}<p className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-[15px] leading-7 text-[var(--text-secondary)]">Questions about this policy? Review the <Link className="font-semibold text-[var(--accent-cyan)] hover:opacity-80" href="/faq">FAQ</Link> or contact MSRX through its official channels.</p></div></main><SiteFooter /></>
  );
}
