import SiteFooter from '../../components/SiteFooter';
import SiteHeader from '../../components/SiteHeader';

export const metadata = { title: 'FAQ', description: 'Answers about using MSRX StoryQuest interactive STEM missions.' };

const questions = [
  ['What is StoryQuest?', 'StoryQuest is a browser-based STEM learning experience. Each mission drops you into a system that is going wrong, gives you one variable you can change, and asks you to work out what it should be.'],
  ['Do I need an account?', 'No. Every mission works without sign-in, and nothing you do is saved to a profile.'],
  ['How do the missions work?', 'Choose a mission, read what the instruments are telling you, move the control, and commit once the two sides of the relationship agree. Some choices stay locked until the system is genuinely balanced.'],
  ['Is the answer a real number, or just "somewhere near the middle"?', 'It is a real number. Every mission is built on an actual equation with real quantities, and the balance point is solved from that equation. Torque balance answers 2.4 m because 12 kN × 1.8 m equals 9 kN × 2.4 m — not because 2.4 happens to sit in the middle of the slider.'],
  ['Why does the mission show two numbers instead of a score?', 'Because the two numbers are the point. You are watching both sides of a relationship respond in their own units, so you can see which way you are wrong and by how much, rather than being told right or wrong.'],
  ['Can I use it on a phone or tablet?', 'Yes. The interface is mobile-first, the controls are touch-friendly, and pinch-zoom is never blocked.'],
  ['What subjects are included?', 'Physics, Chemistry, Mathematics and Biology, with 25 missions in each — 100 in total, across 16 different visual labs.'],
  ['What does "Same problem, new story" do?', 'It asks an AI to rewrite the scene around the mission — a different setting, a different crisis. The equation, the quantities and the answer never change; only the storytelling does.'],
  ['Is this a replacement for a teacher or textbook?', 'No. StoryQuest supports exploration, discussion and conceptual practice alongside teaching and other learning materials.'],
  ['Does StoryQuest collect my personal information?', 'No accounts, no cookies, no analytics, and no learner profile. Your progress lives in the browser tab and is gone on refresh. Read the Privacy Policy for the full explanation.'],
];

/** FAQPage markup, matching the portal's structured-data standard. */
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: questions.map(([question, answer]) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
};

export default function FaqPage() {
  return (
    <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} /><SiteHeader /><main className="mx-auto w-full max-w-4xl flex-1 px-4 py-14 sm:px-6 lg:py-20"><p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--accent-cyan)]">Help centre</p><h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">Frequently asked questions</h1><p className="mt-5 max-w-2xl text-[16px] leading-7 text-[var(--text-secondary)]">Everything needed to begin exploring StoryQuest with confidence.</p><div className="mt-10 space-y-3">{questions.map(([question, answer]) => <details key={question} className="group premium-ring rounded-2xl border border-[var(--border)] bg-white open:border-[#00c4df]/40"><summary className="focus-ring flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 px-5 text-left text-[15px] font-semibold text-[var(--text-primary)]"><span>{question}</span><span aria-hidden="true" className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[var(--border-strong)] text-[var(--accent-cyan)] transition group-open:rotate-45">+</span></summary><p className="border-t border-[var(--border)] px-5 py-5 text-[15px] leading-7 text-[var(--text-secondary)]">{answer}</p></details>)}</div></main><SiteFooter /></>
  );
}
