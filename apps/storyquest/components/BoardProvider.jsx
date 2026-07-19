'use client';

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from 'react';
import { NEUTRAL_BOARD, isBoard } from '../lib/registry';

const STORAGE_KEY = 'storyquest_board';

/**
 * The reader's syllabus, held as a plain board id.
 *
 * Deliberately not a bitmask: a reader sits one board, so the states are not
 * combinable, and a string round-trips to localStorage, to a query parameter,
 * and to the React devtools panel without decoding.
 *
 * Backed by `useSyncExternalStore` rather than an effect that calls setState.
 * The server has no localStorage, so the selection genuinely is external state
 * with two different snapshots — that is exactly the hook's job. Reading it in
 * an effect instead would either mismatch on hydration or cascade a second
 * render on every mount.
 *
 * The cached snapshot matters: `getSnapshot` must return a stable reference
 * across calls or React re-renders forever, and `localStorage.getItem` is a
 * fresh read each time.
 */
let cached = null;
const listeners = new Set();

function read() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored && isBoard(stored) ? stored : NEUTRAL_BOARD;
  } catch {
    // Private browsing and blocked storage both throw. A reader who cannot
    // persist a board still gets a working catalogue on the neutral labels.
    return NEUTRAL_BOARD;
  }
}

function getSnapshot() {
  if (cached === null) cached = read();
  return cached;
}

/** The server, and the first client render, always see the neutral labels. */
const getServerSnapshot = () => NEUTRAL_BOARD;

function subscribe(listener) {
  listeners.add(listener);
  // Another tab changing the board should re-label this one.
  const onStorage = (event) => {
    if (event.key !== STORAGE_KEY) return;
    cached = null;
    listeners.forEach((notify) => notify());
  };
  window.addEventListener('storage', onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

function write(next) {
  if (!isBoard(next) || next === cached) return;
  cached = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch { /* see read() */ }
  listeners.forEach((notify) => notify());
}

const BoardContext = createContext({ board: NEUTRAL_BOARD, setBoard: () => {} });

export function BoardProvider({ children }) {
  const board = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const setBoard = useCallback((next) => write(next), []);
  const value = useMemo(() => ({ board, setBoard }), [board, setBoard]);

  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
}

export const useBoard = () => useContext(BoardContext);
