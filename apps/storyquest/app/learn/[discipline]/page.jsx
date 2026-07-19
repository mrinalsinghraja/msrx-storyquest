import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BoardProvider } from '../../../components/BoardProvider';
import ChapterIndex from '../../../components/ChapterIndex';
import SiteFooter from '../../../components/SiteFooter';
import SiteHeader from '../../../components/SiteHeader';
import { chapterCatalog } from '../../../lib/curriculum';
import { DISCIPLINES } from '../../../lib/taxonomy';

export function generateStaticParams() {
  return Object.keys(DISCIPLINES).map((discipline) => ({ discipline }));
}

export async function generateMetadata({ params }) {
  const { discipline } = await params;
  const entry = DISCIPLINES[discipline];
  if (!entry) return { title: 'Discipline not found' };

  return {
    title: entry.label,
    description: entry.blurb,
    alternates: { canonical: `/learn/${discipline}` },
  };
}

export default async function DisciplinePage({ params }) {
  const { discipline } = await params;
  const entry = DISCIPLINES[discipline];
  if (!entry) notFound();

  // Only what the client component needs. Passing the whole chapter catalogue
  // would ship every mission's model and narrative into the browser to render a
  // list of eight headings.
  const chapters = chapterCatalog(discipline).map((chapter) => ({
    id: chapter.id,
    slug: chapter.slug,
    label: chapter.label,
    blurb: chapter.blurb,
    count: chapter.missions.length,
  }));

  const plates = chapters.reduce((sum, chapter) => sum + chapter.count, 0);

  return (
    <>
      <SiteHeader />

      <main className="catalogue" data-world={discipline} style={{ flex: 1 }}>
        <header className="masthead">
          <div className="shell">
            <nav className="masthead-meta data" aria-label="Breadcrumb">
              <Link href="/learn" className="focus crumb">Catalogue</Link>
              <span>{plates} plates · {chapters.length} chapters</span>
            </nav>

            <div className="masthead-body">
              <div>
                <h1>
                  <span className="masthead-glyph" aria-hidden="true">{entry.glyph}</span>
                  {entry.label}
                </h1>
                <p>{entry.blurb}</p>
              </div>
            </div>
          </div>
        </header>

        <BoardProvider>
          <ChapterIndex discipline={discipline} chapters={chapters} />
        </BoardProvider>
      </main>

      <SiteFooter />
    </>
  );
}
