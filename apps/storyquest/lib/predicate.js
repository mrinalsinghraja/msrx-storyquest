/**
 * Predicate contract, shared by the build-time validator and the runtime.
 *
 * A `construct` simulator carries its success condition as a source string.
 * That string is never evaluated with `eval` or `new Function`, for two
 * independent reasons:
 *
 *   1. The production CSP in `next.config.js` has no 'unsafe-eval'. A
 *      `new Function` call would throw there and nowhere else, so the failure
 *      would only ever appear on the live site.
 *   2. Even authored content should not get an execution primitive when a
 *      50-line interpreter does the same job with a fixed instruction set.
 *
 * So the string is parsed to a compact tree at build time by
 * `lib/predicate-compile.js` and walked here at runtime. This module holds no
 * parser and imports nothing, which is what keeps acorn out of the client
 * bundle and lets the `.mjs` validator load it directly.
 */

/**
 * The only roots a predicate may read.
 *
 * `clock` is `{ t, frame, dt, isPlaying }` from `lib/clock.js` and lets an
 * `explore` projection describe motion — `state.amplitude * clock.t` — instead
 * of only a static reading. Every runtime supplies it, including the ones with
 * no loop, so a predicate never has to guard against it being absent.
 */
export const ALLOWED_ROOTS = ['state', 'count', 'built', 'target', 'clock'];

export const ALLOWED_OPERATORS = [
  '===', '!==', '==', '!=', '<', '<=', '>', '>=',
  '+', '-', '*', '/', '%', '&&', '||', '!',
];

/**
 * Property names that must never be reachable.
 *
 * Compile-time rejection is the real gate. This list is re-checked at runtime
 * because a compiled tree is shipped data, and data that reaches the browser
 * should not be trusted purely because of where it came from.
 */
export const BANNED_KEYS = [
  '__proto__', 'prototype', 'constructor',
  'eval', 'Function', 'require', 'import', 'process', 'globalThis', 'global',
  'window', 'document', 'fetch', 'child_process', 'this',
  'Reflect', 'Proxy', 'Symbol', 'WebAssembly',
];

const BANNED = new Set(BANNED_KEYS);
const OPERATORS = new Set(ALLOWED_OPERATORS);
const ROOTS = new Set(ALLOWED_ROOTS);

/** Thrown by both the compiler and the evaluator so callers catch one type. */
export class PredicateError extends Error {
  constructor(message) {
    super(message);
    this.name = 'PredicateError';
  }
}

/**
 * Walks a compiled predicate tree against a scope.
 *
 * Pure and total: every node type is handled explicitly and anything
 * unrecognised throws rather than falling through to a default. There is no
 * loop construct and no call construct in the grammar, so evaluation always
 * terminates and cannot reach outside `scope`.
 */
export function evaluatePredicate(node, scope) {
  if (!node || typeof node !== 'object') throw new PredicateError('malformed predicate node');

  switch (node.t) {
    case 'lit':
      return node.v;

    case 'id': {
      if (!ROOTS.has(node.n)) throw new PredicateError(`unknown root "${node.n}"`);
      return scope?.[node.n];
    }

    case 'mem': {
      const object = evaluatePredicate(node.o, scope);
      if (object === null || object === undefined) return undefined;

      const key = node.c ? evaluatePredicate(node.p, scope) : node.p;
      if (typeof key === 'string' && BANNED.has(key)) {
        throw new PredicateError(`predicate reached for banned key "${key}"`);
      }

      // Own properties only. Array indices and `length` are the two legitimate
      // inherited-looking reads, so they are allowed explicitly.
      if (Array.isArray(object) && (key === 'length' || Number.isInteger(Number(key)))) {
        return object[key];
      }
      if (typeof object === 'string' && key === 'length') return object.length;
      if (typeof object !== 'object') return undefined;

      return Object.hasOwn(object, key) ? object[key] : undefined;
    }

    case 'un': {
      if (!OPERATORS.has(node.op)) throw new PredicateError(`disallowed operator ${node.op}`);
      const value = evaluatePredicate(node.a, scope);
      if (node.op === '!') return !value;
      if (node.op === '-') return -value;
      if (node.op === '+') return +value;
      throw new PredicateError(`disallowed unary operator ${node.op}`);
    }

    case 'log': {
      // Short-circuits, matching the source semantics an author expects.
      const left = evaluatePredicate(node.l, scope);
      if (node.op === '&&') return left ? evaluatePredicate(node.r, scope) : left;
      if (node.op === '||') return left ? left : evaluatePredicate(node.r, scope);
      throw new PredicateError(`disallowed logical operator ${node.op}`);
    }

    case 'bin': {
      if (!OPERATORS.has(node.op)) throw new PredicateError(`disallowed operator ${node.op}`);
      const l = evaluatePredicate(node.l, scope);
      const r = evaluatePredicate(node.r, scope);
      switch (node.op) {
        case '===': return l === r;
        case '!==': return l !== r;
        // Loose equality is deliberate: `==` and `!=` are in the authored
        // grammar, so the interpreter has to reproduce their semantics exactly.
        case '==': return l == r;
        case '!=': return l != r;
        case '<': return l < r;
        case '<=': return l <= r;
        case '>': return l > r;
        case '>=': return l >= r;
        case '+': return l + r;
        case '-': return l - r;
        case '*': return l * r;
        case '/': return l / r;
        case '%': return l % r;
        default: throw new PredicateError(`disallowed binary operator ${node.op}`);
      }
    }

    case 'cond':
      return evaluatePredicate(node.c, scope) ? evaluatePredicate(node.a, scope) : evaluatePredicate(node.b, scope);

    case 'arr':
      return node.e.map((item) => evaluatePredicate(item, scope));

    default:
      throw new PredicateError(`unknown predicate node type "${node.t}"`);
  }
}

/**
 * Runs a predicate and coerces the result to a pass/fail.
 *
 * A predicate that throws is a failed build that got through, not a learner who
 * got the answer wrong. It reports `false` with the reason attached rather than
 * unmounting the simulator, so a bad predicate degrades to "not satisfied yet"
 * instead of a blank screen.
 */
export function runPredicate(tree, scope) {
  try {
    return { isSatisfied: Boolean(evaluatePredicate(tree, scope)), error: null };
  } catch (error) {
    return { isSatisfied: false, error: error.message };
  }
}
