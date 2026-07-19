import { parse } from 'acorn';
import { ALLOWED_OPERATORS, ALLOWED_ROOTS, BANNED_KEYS, PredicateError } from './predicate.js';

/**
 * Predicate source → compact tree.
 *
 * Build-time and validator only. This module imports acorn, so nothing that
 * reaches a client component may import it — the runtime side lives in
 * `lib/predicate.js`, which has no parser and no dependencies.
 *
 * The walk is an allowlist. Any node type, operator, root, or property name not
 * named here is a build failure, so extending the grammar is a deliberate edit
 * rather than something that slips in with a new predicate.
 */

const OPERATORS = new Set(ALLOWED_OPERATORS);
const ROOTS = new Set(ALLOWED_ROOTS);
const BANNED = new Set(BANNED_KEYS);

const NODE_MAP = {
  BinaryExpression: 'bin',
  LogicalExpression: 'log',
  UnaryExpression: 'un',
  ConditionalExpression: 'cond',
  MemberExpression: 'mem',
  Identifier: 'id',
  Literal: 'lit',
  ArrayExpression: 'arr',
};

function compileNode(node) {
  const kind = NODE_MAP[node.type];
  if (!kind) throw new PredicateError(`disallowed syntax: ${node.type}`);

  switch (node.type) {
    case 'Literal':
      return { t: 'lit', v: node.value };

    case 'Identifier':
      if (BANNED.has(node.name)) throw new PredicateError(`banned identifier: ${node.name}`);
      if (!ROOTS.has(node.name)) {
        throw new PredicateError(`unknown root "${node.name}" (allowed: ${[...ROOTS].join(', ')})`);
      }
      return { t: 'id', n: node.name };

    case 'MemberExpression': {
      const object = compileNode(node.object);

      if (node.computed) {
        // A computed key must be a literal, so no property name can be built
        // at evaluation time.
        if (node.property.type !== 'Literal') {
          throw new PredicateError('computed property must be a literal');
        }
        if (typeof node.property.value === 'string' && BANNED.has(node.property.value)) {
          throw new PredicateError(`banned property: ${node.property.value}`);
        }
        return { t: 'mem', o: object, c: true, p: { t: 'lit', v: node.property.value } };
      }

      if (BANNED.has(node.property.name)) throw new PredicateError(`banned property: ${node.property.name}`);
      return { t: 'mem', o: object, c: false, p: node.property.name };
    }

    case 'UnaryExpression':
      if (!OPERATORS.has(node.operator)) throw new PredicateError(`disallowed operator: ${node.operator}`);
      return { t: 'un', op: node.operator, a: compileNode(node.argument) };

    case 'BinaryExpression':
      if (!OPERATORS.has(node.operator)) throw new PredicateError(`disallowed operator: ${node.operator}`);
      return { t: 'bin', op: node.operator, l: compileNode(node.left), r: compileNode(node.right) };

    case 'LogicalExpression':
      if (!OPERATORS.has(node.operator)) throw new PredicateError(`disallowed operator: ${node.operator}`);
      return { t: 'log', op: node.operator, l: compileNode(node.left), r: compileNode(node.right) };

    case 'ConditionalExpression':
      return {
        t: 'cond',
        c: compileNode(node.test),
        a: compileNode(node.consequent),
        b: compileNode(node.alternate),
      };

    case 'ArrayExpression':
      return { t: 'arr', e: node.elements.map((element) => {
        if (!element) throw new PredicateError('array holes are not allowed');
        return compileNode(element);
      }) };

    default:
      throw new PredicateError(`disallowed syntax: ${node.type}`);
  }
}

/** Throws PredicateError on anything the grammar does not cover. */
export function compilePredicate(source) {
  if (typeof source !== 'string' || !source.trim()) {
    throw new PredicateError('predicate must be a non-empty string');
  }

  let ast;
  try {
    ast = parse(source, { ecmaVersion: 2022, sourceType: 'script' });
  } catch (error) {
    throw new PredicateError(`predicate does not parse: ${error.message}`);
  }

  if (ast.body.length !== 1 || ast.body[0].type !== 'ExpressionStatement') {
    throw new PredicateError('predicate must be a single expression');
  }

  return compileNode(ast.body[0].expression);
}
