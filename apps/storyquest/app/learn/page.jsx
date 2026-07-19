import Link from 'next/link';
import SiteFooter from '../../components/SiteFooter';
import SiteHeader from '../../components/SiteHeader';
import { chapterCatalog } from '../../lib/curriculum';
import { DISCIPLINES } from '../../lib/taxonomy';
import { CATALOGUE, gradeRange } from '../../lib/catalogue-stats';

export const metadata = {
  title: 'Catalogue',
  description: `${CATALOGUE.disciplines} disciplines, ${CATALOGUE.chapters} chapters, ${CATALOGUE.missions} interactive STEM simulators spanning ${gradeRange}. Every mission is solved from a real equation.`,
  alternates: { canonical: '/learn' },
};

/**
 * The frontispiece.
 *
 * Four discipline plates over a paper canvas, hairline-divided. Not a card grid:
 * with four entries a grid is honest, but the plate architecture already carries
 * the pigment cascade and the hairline treatment, so reusing it keeps one visual
 * grammar across all three tiers of the tree instead of inventing a second.
 */
const directory = Object.entries(DISCIPLINES).map(([id, discipline]) => {
  const chapters = chapterCatalog(id);
  return {
    id,
    ...discipline,
    chapters: chapters.length,
    plates: chapters.reduce((sum, chapter) => sum + chapter.missions.length, 0),
    opening: chapters.filter((chapter) => chapter.missions.length > 0).slice(0, 3),
  };
});

const totals = directory.reduce(
  (acc, entry) => ({ chapters: acc.chapters + entry.chapters, plates: acc.plates + entry.plates }),
  { chapters: 0, plates: 0 },
);

export default function LearnPage() {
  return (
    <>
      <SiteHeader />

      <main className="catalogue" style={{ flex: 1 }}>
        <header className="masthead">
          <div className="shell">
            <div className="masthead-meta data">
              <span>Catalogue of interactive apparatus</span>
              <span>{totals.plates} plates · {totals.chapters} chapters · four worlds</span>
            </div>

            <div className="masthead-body">
              <div>
                <h1>
                  Every mission is an equation with <em>one quantity you can move.</em>
                </h1>
                <p>
                  Read what the instruments are telling you, move the control, and commit once both
                  sides of the relationship agree. No sign-in, nothing stored.
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="shell">
          <div className="plates directory">
            {directory.map((entry) => (
              <Link
                key={entry.id}
                href={`/learn/${entry.id}`}
                className="plate focus"
                data-world={entry.id}
                data-size="half"
              >
                <span className="plate-head">
                  <span className="data plate-no" aria-hidden="true">{entry.glyph}</span>
                  <span className="data plate-level">
                    {entry.chapters} chapters
                  </span>
                </span>

                <h3>{entry.label}</h3>
                <p className="caption">{entry.blurb}</p>

                {/* Naming the opening chapters is the one place this page says
                  * what is actually inside a discipline. A count alone tells a
                  * reader how much there is, never what it is. */}
                <ul className="plate-contents data">
                  {entry.opening.map((chapter) => (
                    <li key={chapter.id}>{chapter.label}</li>
                  ))}
                  {entry.chapters > entry.opening.length && (
                    <li className="plate-contents-more">
                      and {entry.chapters - entry.opening.length} more
                    </li>
                  )}
                </ul>

                <span className="plate-foot">
                  <span className="data plate-lab">{entry.plates} plates</span>
                  <span className="data plate-cta">
                    Open <span aria-hidden="true">→</span>
                  </span>
                </span>
              </Link>
            ))}
          </div>

          <p className="directory-note caption">
            Looking for one specific thing?{' '}
            <Link href="/learn/all" className="focus crumb">Browse all {totals.plates} plates</Link>{' '}
            with filters for world, level, and keyword.
          </p>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
