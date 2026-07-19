'use client';

import { useCallback, useMemo, useState } from 'react';
import CataloguePlate from './CataloguePlate';
import SiteFooter from './SiteFooter';
import SiteHeader from './SiteHeader';

const levels = ['all', 'Foundation', 'Explorer', 'Challenge'];

/**
 * Runs a state change inside a view transition where the browser supports one.
 *
 * Filtering swaps most of the grid at once, which is jarring as a hard cut. The
 * grid carries a single `view-transition-name`, so this cross-fades the whole
 * plate field rather than trying to name 100 individual elements.
 */
function useTransitionedUpdate() {
  return useCallback((update) => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof document.startViewTransition !== 'function') {
      update();
      return;
    }
    document.startViewTransition(update);
  }, []);
}

export default function MissionLobby({ plates, subjects }) {
  const [world, setWorld] = useState('all');
  const [level, setLevel] = useState('all');
  const [query, setQuery] = useState('');
  const withTransition = useTransitionedUpdate();

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return plates.filter((plate) => {
      if (world !== 'all' && plate.subject !== world) return false;
      if (level !== 'all' && plate.difficulty !== level) return false;
      if (!search) return true;
      return [plate.title, plate.subjectLabel, plate.lab, plate.scenario, plate.control]
        .join(' ')
        .toLowerCase()
        .includes(search);
    });
  }, [level, plates, query, world]);

  // The masthead shows the first plate of the current selection, so choosing a
  // world previews that world's typesetting instead of holding a fixed sample.
  //
  // It has to be a plate that actually carries an equation: construct and
  // explore simulators have none, and the frontispiece specimen is the one place
  // on the page where a blank would read as a broken render rather than an
  // absence.
  const feature = filtered.find((plate) => plate.formulaHtml)
    ?? plates.find((plate) => plate.formulaHtml)
    ?? null;

  const clearFilters = () => withTransition(() => {
    setQuery('');
    setWorld('all');
    setLevel('all');
  });

  return (
    <>
      <SiteHeader />

      <main className="catalogue" style={{ flex: 1 }}>
        <header className="masthead">
          <div className="shell">
            <div className="masthead-meta data">
              <span>Catalogue of interactive apparatus</span>
              <span>One hundred plates · Four worlds</span>
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

              {feature && (
                <figure className="masthead-specimen" data-world={feature.subject} style={{ margin: 0 }}>
                  <div
                    className="specimen-body"
                    aria-label={`Formula: ${feature.formula}`}
                    dangerouslySetInnerHTML={{ __html: feature.formulaHtml }}
                  />
                  <figcaption className="data">
                    Plate M{String(feature.number).padStart(3, '0')} · {feature.subjectLabel} · {feature.lab}
                  </figcaption>
                </figure>
              )}
            </div>
          </div>
        </header>

        <div className="filters">
          <div className="shell">
            <div className="filter-row">
              <span className="data filter-label" id="world-label">World</span>
              <div className="filter-set" role="group" aria-labelledby="world-label">
                <button
                  type="button"
                  className="chip focus"
                  aria-pressed={world === 'all'}
                  onClick={() => withTransition(() => setWorld('all'))}
                >
                  All
                </button>
                {subjects.map((subject) => (
                  <button
                    key={subject.id}
                    type="button"
                    className="chip focus"
                    data-world={subject.id}
                    aria-pressed={world === subject.id}
                    onClick={() => withTransition(() => setWorld(subject.id))}
                  >
                    {subject.label}
                  </button>
                ))}
              </div>

              <label className="search">
                <span className="sr-only">Search missions</span>
                <span className="data" aria-hidden="true" style={{ color: 'var(--ink-3)' }}>Find</span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="a concept, a lab, or a scenario"
                />
              </label>
            </div>

            <div className="filter-row">
              <span className="data filter-label" id="level-label">Level</span>
              <div className="filter-set" role="group" aria-labelledby="level-label">
                {levels.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="chip focus"
                    aria-pressed={level === item}
                    onClick={() => withTransition(() => setLevel(item))}
                  >
                    {item === 'all' ? 'All' : item}
                  </button>
                ))}
              </div>
              <span className="data tally" aria-live="polite">
                {filtered.length} {filtered.length === 1 ? 'plate' : 'plates'}
              </span>
            </div>
          </div>
        </div>

        <div className="shell">
          <div className="plates">
            {filtered.map((plate) => <CataloguePlate key={plate.id} plate={plate} />)}

            {!filtered.length && (
              <div className="empty">
                <h2>Nothing catalogued under those filters.</h2>
                <p>Widen the world or the level to bring more plates back into view.</p>
                <button type="button" className="reset focus" onClick={clearFilters}>
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
