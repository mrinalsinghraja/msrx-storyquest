'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { prepareAll, search } from '../lib/search';

/**
 * Module-scoped cache for the fetched corpus.
 *
 * The palette unmounts and remounts as the learner moves between routes, so
 * component state would refetch on every navigation. Hoisting it here means the
 * index is fetched at most once per session. `pending` holds the in-flight
 * promise so two rapid opens share one request rather than racing.
 */
let cachedIndex = null;
let pending = null;

async function loadIndex() {
  if (cachedIndex) return cachedIndex;
  if (!pending) {
    pending = fetch('/search-index.json')
      .then((response) => {
        if (!response.ok) throw new Error(`search index responded ${response.status}`);
        return response.json();
      })
      .then((entries) => {
        cachedIndex = prepareAll(entries);
        return cachedIndex;
      })
      .finally(() => { pending = null; });
  }
  return pending;
}

const KIND_LABEL = { mission: 'Mission', chapter: 'Chapter', discipline: 'Subject' };

/**
 * Gate and dialog are separate components so that opening the palette *mounts*
 * it.
 *
 * Keeping one always-mounted component and clearing its fields in an effect
 * when `open` flipped is the obvious shape and the wrong one: it sets state
 * from an effect body, which React now flags as a cascading render, and it
 * leaves the previous query briefly painted on the first frame of the reopen.
 * A fresh mount starts empty by construction, so there is nothing to reset.
 */
export default function SearchPalette({ open, onClose }) {
  if (!open) return null;
  return <PaletteDialog onClose={onClose} />;
}

function PaletteDialog({ onClose }) {
  const router = useRouter();
  const listId = useId();
  const inputRef = useRef(null);

  const [index, setIndex] = useState(cachedIndex);
  const [status, setStatus] = useState(cachedIndex ? 'ready' : 'loading');
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  // Fetched on mount, which is first open — a learner who never searches never
  // pays for the corpus.
  useEffect(() => {
    if (cachedIndex) return undefined;
    let cancelled = false;
    loadIndex()
      .then((entries) => { if (!cancelled) { setIndex(entries); setStatus('ready'); } })
      .catch(() => { if (!cancelled) setStatus('error'); });
    return () => { cancelled = true; };
  }, []);

  // Take focus, lock the page behind, and hand focus back on close.
  useEffect(() => {
    const restore = document.activeElement;

    // Focused directly rather than inside `requestAnimationFrame`. The effect
    // already runs after commit, so the input exists — and rAF does not fire at
    // all in a backgrounded tab, which would leave the palette open with focus
    // still on the page behind it.
    inputRef.current?.focus();

    // The dialog scrolls its own results; the page behind it must not move.
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = overflow;
      if (restore instanceof HTMLElement && document.contains(restore)) restore.focus();
    };
  }, []);

  const results = useMemo(() => {
    if (!index) return [];
    if (!query.trim()) {
      // An empty field is an invitation, not an error. Subjects are the four
      // doors into the catalogue and the honest answer to "where do I start".
      return index.filter((entry) => entry.kind === 'discipline');
    }
    return search(index, query, { limit: 8 });
  }, [index, query]);

  /**
   * Clamped at read time rather than reset in an effect.
   *
   * A shrinking result list can leave `active` past the end — deleting a
   * character is the common way to do it. Clamping here means the highlight is
   * always valid for the list currently rendered, without a second render pass
   * to correct it.
   */
  const cursor = results.length ? Math.min(active, results.length - 1) : 0;

  const go = useCallback((entry) => {
    if (!entry) return;
    onClose();
    router.push(entry.path);
  }, [onClose, router]);

  /**
   * Moves the highlight by `delta`, wrapping at both ends.
   *
   * The updater is functional and re-clamps `current` itself rather than
   * closing over `cursor`. Reading the rendered cursor here looks equivalent and
   * is not: React batches, so two arrow presses landing in one task would both
   * see the same pre-batch value and the second would undo the first.
   */
  const move = (delta) => setActive((current) => {
    if (!results.length) return 0;
    const from = Math.min(current, results.length - 1);
    return (from + delta + results.length) % results.length;
  });

  const onKeyDown = (event) => {
    if (event.key === 'Escape') { event.preventDefault(); onClose(); return; }
    if (event.key === 'ArrowDown') { event.preventDefault(); move(1); return; }
    if (event.key === 'ArrowUp') { event.preventDefault(); move(-1); return; }
    if (event.key === 'Home') { event.preventDefault(); setActive(0); return; }
    if (event.key === 'End') { event.preventDefault(); setActive(Math.max(0, results.length - 1)); return; }
    if (event.key === 'Enter') { event.preventDefault(); go(results[cursor]); }
  };

  const activeId = results[cursor] ? `${listId}-${cursor}` : undefined;

  return (
    <div
      className="palette-backdrop"
      role="presentation"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <div
        className="palette"
        role="dialog"
        aria-modal="true"
        aria-label="Search missions"
        onKeyDown={onKeyDown}
      >
        <div className="palette-field">
          <svg viewBox="0 0 20 20" className="palette-icon" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7">
            <circle cx="9" cy="9" r="5.5" />
            <path d="M13.2 13.2 17 17" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => { setQuery(event.target.value); setActive(0); }}
            placeholder="Search 100 missions, chapters and subjects…"
            aria-label="Search missions, chapters and subjects"
            aria-controls={listId}
            aria-expanded="true"
            aria-activedescendant={activeId}
            autoComplete="off"
            spellCheck="false"
            role="combobox"
          />
          <kbd className="palette-kbd">esc</kbd>
        </div>

        <div className="palette-results" id={listId} role="listbox" aria-label="Search results">
          {status === 'loading' && <p className="palette-note">Loading the catalogue…</p>}
          {status === 'error' && (
            <p className="palette-note">
              The catalogue did not load. Check your connection and reopen search.
            </p>
          )}

          {status === 'ready' && !results.length && (
            <p className="palette-note">
              No mission matches “{query.trim()}”. Try a concept — torque, pH, ratio, osmosis.
            </p>
          )}

          {results.map((entry, position) => (
            <button
              key={entry.id}
              id={`${listId}-${position}`}
              type="button"
              role="option"
              aria-selected={position === cursor}
              data-active={position === cursor ? 'true' : undefined}
              className="palette-hit"
              onMouseMove={() => setActive(position)}
              onClick={() => go(entry)}
            >
              <span className="palette-glyph" aria-hidden="true">{entry.glyph}</span>
              <span className="palette-hit-body">
                <span className="palette-hit-title">{entry.title}</span>
                <span className="palette-hit-meta">
                  {KIND_LABEL[entry.kind]}
                  {entry.chapter ? ` · ${entry.chapter}` : ''}
                  {entry.difficulty ? ` · ${entry.difficulty}` : ''}
                </span>
              </span>
              {entry.number ? <span className="palette-hit-number" aria-hidden="true">{entry.number}</span> : null}
            </button>
          ))}
        </div>

        <p className="palette-live" role="status" aria-live="polite">
          {status === 'ready' && query.trim()
            ? `${results.length} result${results.length === 1 ? '' : 's'} for ${query.trim()}`
            : ''}
        </p>

        <footer className="palette-foot">
          <span><kbd>↑</kbd><kbd>↓</kbd> to move</span>
          <span><kbd>↵</kbd> to open</span>
        </footer>
      </div>
    </div>
  );
}

/**
 * Owns the shortcut and the open flag, so a host only renders one component.
 *
 * The listener is deliberately not installed on the input: the whole point of
 * ⌘K is that it works when focus is somewhere else entirely. `/` is the second
 * shortcut, guarded so it does not hijack a keystroke meant for a text field —
 * typing a slash while writing in an input should produce a slash.
 */
export function useSearchPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (event) => {
      const meta = event.metaKey || event.ctrlKey;
      if (meta && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((current) => !current);
        return;
      }
      if (event.key === '/' && !meta) {
        const target = event.target;
        const editable = target instanceof HTMLElement
          && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));
        if (editable) return;
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return { open, setOpen, close: () => setOpen(false) };
}
