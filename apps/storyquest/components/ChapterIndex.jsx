'use client';

import Link from 'next/link';
import { chapterLabelFor, coverageFor } from '../lib/registry';
import { useBoard } from './BoardProvider';
import BoardSelector from './BoardSelector';

/**
 * The chapter directory for one discipline.
 *
 * A ruled list, not a grid. A discipline holds 6–8 chapters, and a grid of six
 * cards leaves holes at most column counts — the same defect the plate gutter
 * fix addressed. A list cannot have holes, and it keeps the ordinal, the title,
 * and the count on one reading line.
 */
export default function ChapterIndex({ discipline, chapters }) {
  const { board } = useBoard();
  const coverage = coverageFor(board, chapters.map((chapter) => chapter.id));

  return (
    <>
      <div className="filters">
        <div className="shell">
          <div className="filter-row">
            <BoardSelector />
            {coverage && (
              <span className="data tally" aria-live="polite">
                {coverage.mapped} of {coverage.total} chapters mapped
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="shell">
        <ol className="chapters">
          {chapters.map((chapter, index) => {
            const boardLabel = chapterLabelFor(chapter.id, board);

            return (
              <li key={chapter.id}>
                <Link href={`/learn/${discipline}/${chapter.slug}`} className="chapter focus">
                  <span className="data chapter-no">{String(index + 1).padStart(2, '0')}</span>

                  <span className="chapter-body">
                    <h2>{chapter.label}</h2>
                    {/* The syllabus line sits under the canonical title rather
                      * than replacing it: a reader should still be able to tell
                      * two boards are looking at the same chapter. */}
                    {boardLabel && <span className="data chapter-board">{boardLabel}</span>}
                    <p className="caption">{chapter.blurb}</p>
                  </span>

                  <span className="data chapter-count">
                    {chapter.count} {chapter.count === 1 ? 'plate' : 'plates'}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>

        {/* A gap is a real answer about a syllabus, so it is stated rather than
          * quietly rendered as an unlabelled row. */}
        {coverage?.missing.length > 0 && (
          <p className="coverage-note caption">
            {coverage.missing.length} {coverage.missing.length === 1 ? 'chapter sits' : 'chapters sit'} outside
            this syllabus at this age range, and {coverage.missing.length === 1 ? 'is' : 'are'} shown under our own name.
          </p>
        )}
      </div>
    </>
  );
}
