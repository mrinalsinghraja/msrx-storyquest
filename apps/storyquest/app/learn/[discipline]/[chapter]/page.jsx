import Link from 'next/link';
import { notFound } from 'next/navigation';
import CataloguePlate from '../../../../components/CataloguePlate';
import SiteFooter from '../../../../components/SiteFooter';
import SiteHeader from '../../../../components/SiteHeader';
import { missionsInChapter } from '../../../../lib/curriculum';
import { toPlates } from '../../../../lib/plates';
import { CHAPTERS, DISCIPLINES, chapterIdFrom, chaptersFor } from '../../../../lib/taxonomy';

export function generateStaticParams() {
  return Object.entries(CHAPTERS).map(([id, chapter]) => ({
    discipline: chapter.discipline,
    chapter: id.split('.')[1],
  }));
}

export async function generateMetadata({ params }) {
  const { discipline, chapter } = await params;
  const entry = CHAPTERS[chapterIdFrom(discipline, chapter)];
  if (!entry) return { title: 'Chapter not found' };

  return {
    title: `${entry.label} — ${DISCIPLINES[discipline].label}`,
    description: entry.blurb,
    alternates: { canonical: `/learn/${discipline}/${chapter}` },
  };
}

export default async function ChapterPage({ params }) {
  const { discipline, chapter } = await params;
  const chapterId = chapterIdFrom(discipline, chapter);
  const entry = CHAPTERS[chapterId];
  if (!entry || !DISCIPLINES[discipline]) notFound();

  const plates = toPlates(missionsInChapter(discipline, chapter));
  const siblings = chaptersFor(discipline);
  const position = siblings.findIndex((item) => item.id === chapterId);

  return (
    <>
      <SiteHeader />

      <main className="catalogue" data-world={discipline} style={{ flex: 1 }}>
        <header className="masthead">
          <div className="shell">
            <nav className="masthead-meta data" aria-label="Breadcrumb">
              <Link href="/learn" className="focus crumb">Catalogue</Link>
              <Link href={`/learn/${discipline}`} className="focus crumb">
                {DISCIPLINES[discipline].label}
              </Link>
              <span>Chapter {String(position + 1).padStart(2, '0')}</span>
            </nav>

            <div className="masthead-body">
              <div>
                <h1>{entry.label}</h1>
                <p>{entry.blurb}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="shell">
          <div className="plates">
            {plates.map((plate) => <CataloguePlate key={plate.id} plate={plate} />)}

            {!plates.length && (
              <div className="empty">
                <h2>This chapter is still being catalogued.</h2>
                <p>The apparatus is designed but the plates are not yet engraved.</p>
                <Link href={`/learn/${discipline}`} className="reset focus">
                  Back to {DISCIPLINES[discipline].label}
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
