#!/usr/bin/env node
/**
 * Build-time catalogue validation.
 *
 * Runs as `prebuild`, so a malformed simulator aborts the production build
 * rather than shipping. The dev guard in `lib/curriculum.js` covers the same
 * ground at import time in development; this is the gate that a CI machine and
 * a `vercel --prod` from a laptop both have to pass through.
 *
 * Two schema generations are accepted on purpose:
 *
 *   v1  the 100 migrated topics — a `model` block, no `interactionKind`.
 *       Treated as an implicit `balance` simulator, which is what they are.
 *   v2  an explicit `interactionKind` plus an `engine` block, per the 300-slot
 *       architecture in docs/CURRICULUM_ARCHITECTURE.md.
 *
 * Rejecting v1 would abort the build on all 100 existing simulators the moment
 * this script was wired in, so the v2 contract is enforced only where a record
 * has opted into it. Every v1 record still gets the full legacy check.
 *
 * The topic files and `lib/taxonomy.js` are import-free leaves, so they load
 * directly here. `lib/curriculum.js` is deliberately not imported: it uses
 * extensionless relative imports that only webpack resolves, and pulling it in
 * would need a loader hook.
 */

import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { compilePredicate } from '../lib/predicate-compile.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const load = async (rel) => (await import(path.join(ROOT, rel))).default ?? (await import(path.join(ROOT, rel)));

const DISCIPLINES = ['physics', 'chemistry', 'mathematics', 'biology'];
const INTERACTION_KINDS = new Set(['balance', 'construct', 'explore']);
const DIFFICULTIES = new Set(['Foundation', 'Explorer', 'Challenge']);
const GRADE_GROUPS = new Set(['early', 'middle', 'high']);
const GRADE_RANGE = [1, 12];

/* -------------------------------------------------------------------------
 * Board reference grammar.
 *
 * Standard ids are matched against a per-board pattern rather than merely
 * checked for presence. The failure this blocks is text drift: `NGSS MS-PS2.2`,
 * `ngss:ms-ps2-2`, and `MS PS2-2` all mean the same thing to a human author and
 * all break a lookup. One spelling is legal per board.
 * ---------------------------------------------------------------------- */
const BOARD_PATTERNS = {
  cbse: /^cbse:(?:[1-9]|1[0-2]):(?:[1-9]|1\d|2\d)$/,
  icse: /^icse:(?:[1-9]|1[0-2]):[a-z0-9-]+$/,
  ngss: /^ngss:(?:K-2|3-5|MS|HS)-(?:PS|LS|ESS|ETS)\d-\d$/,
  uk: /^uk:KS[1-4]:[a-z][a-z-]*(?::[a-z][a-z-]*)?$/,
  igcse: /^igcse:\d{1,2}(?:\.\d{1,2})?$/,
  ibmyp: /^ibmyp:[1-5]:[a-z][a-z-]*$/,
};

/* -------------------------------------------------------------------------
 * Predicate safety.
 *
 * The grammar lives in `lib/predicate-compile.js` and is shared with the
 * runtime, so there is exactly one allowlist. This used to be a second copy
 * here, which meant a capability could be added to one and not the other.
 *
 * Compiling is the check: anything outside the grammar throws.
 * ---------------------------------------------------------------------- */
function checkPredicate(source, fail) {
  try {
    compilePredicate(source);
  } catch (error) {
    fail(`predicate rejected: ${error.message}`);
  }
}

/* ---------------------------------------------------------------------- */

const errors = [];
const stats = { total: 0, v1: 0, v2: 0, byKind: { balance: 0, construct: 0, explore: 0 } };

const isFiniteNumber = (value) => typeof value === 'number' && Number.isFinite(value);
const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

/**
 * A unit has to be declared, but it is allowed to be empty.
 *
 * Roughly a dozen controls are genuinely dimensionless — "Winning tickets",
 * "Fraction of the whole", electrons accepted — and their authors wrote
 * `unit: ''` on purpose. An empty string is that declaration; `undefined` is a
 * forgotten one, and only the second is a defect.
 */
const isDeclaredUnit = (value) => typeof value === 'string';

async function main() {
  const { CHAPTERS } = await import(path.join(ROOT, 'lib/taxonomy.js'));
  const { LABS } = await import(path.join(ROOT, 'lib/labs.js'));

  for (const discipline of DISCIPLINES) {
    const topics = await load(`lib/topics/${discipline}.js`);

    if (!Array.isArray(topics) || topics.length === 0) {
      errors.push(`${discipline}: topic file exports no array`);
      continue;
    }

    const seenSlugs = new Set();

    topics.forEach((topic, index) => {
      const ref = `${discipline}[${index}] ${topic?.slug ?? '<no slug>'}`;
      const fail = (message) => errors.push(`${ref}: ${message}`);
      stats.total += 1;

      /* --- identity and taxonomy ------------------------------------- */

      if (!isNonEmptyString(topic.slug)) fail('missing slug');
      else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(topic.slug)) fail(`slug "${topic.slug}" is not kebab-case`);
      else if (seenSlugs.has(topic.slug)) fail(`duplicate slug "${topic.slug}"`);
      else seenSlugs.add(topic.slug);

      if (!isNonEmptyString(topic.title)) fail('missing title');

      if (!isNonEmptyString(topic.chapterId)) {
        fail('missing chapterId');
      } else if (!CHAPTERS[topic.chapterId]) {
        fail(`unknown chapterId "${topic.chapterId}"`);
      } else if (CHAPTERS[topic.chapterId].discipline !== discipline) {
        fail(`chapterId "${topic.chapterId}" belongs to ${CHAPTERS[topic.chapterId].discipline}`);
      }

      if (!DIFFICULTIES.has(topic.difficulty)) {
        fail(`difficulty must be one of ${[...DIFFICULTIES].join(', ')}, got ${JSON.stringify(topic.difficulty)}`);
      }
      if (!GRADE_GROUPS.has(topic.gradeGroup)) {
        fail(`gradeGroup must be one of ${[...GRADE_GROUPS].join(', ')}, got ${JSON.stringify(topic.gradeGroup)}`);
      }
      if (!Number.isInteger(topic.gradeLevel) || topic.gradeLevel < GRADE_RANGE[0] || topic.gradeLevel > GRADE_RANGE[1]) {
        fail(`gradeLevel must be an integer class between ${GRADE_RANGE[0]} and ${GRADE_RANGE[1]}`);
      }

      if (!isNonEmptyString(topic.lab)) fail('missing lab');
      else if (!LABS[topic.lab]) fail(`unknown lab "${topic.lab}"`);

      /* --- board references ------------------------------------------ */

      if (topic.standardIds !== undefined) {
        if (!Array.isArray(topic.standardIds)) {
          fail('standardIds must be an array');
        } else {
          for (const id of topic.standardIds) {
            if (!isNonEmptyString(id)) {
              fail('standardIds contains a non-string entry');
              continue;
            }
            const board = id.split(':')[0];
            const pattern = BOARD_PATTERNS[board];
            if (!pattern) {
              fail(`standard "${id}" names unknown board "${board}" (known: ${Object.keys(BOARD_PATTERNS).join(', ')})`);
            } else if (!pattern.test(id)) {
              fail(`standard "${id}" does not match the ${board} grammar ${pattern}`);
            }
          }
        }
      }

      /* --- interaction contract -------------------------------------- */

      const kind = topic.interactionKind ?? 'balance';
      const isV2 = topic.interactionKind !== undefined;

      if (!INTERACTION_KINDS.has(kind)) {
        fail(`interactionKind must be one of ${[...INTERACTION_KINDS].join(', ')}, got ${JSON.stringify(topic.interactionKind)}`);
        return;
      }

      if (isV2) stats.v2 += 1;
      else stats.v1 += 1;
      stats.byKind[kind] += 1;

      if (!isV2) {
        validateLegacyBalance(topic, fail);
        return;
      }

      const engine = topic.engine;
      if (!engine || typeof engine !== 'object') {
        fail('v2 record has no engine block');
        return;
      }

      if (kind === 'balance') validateBalance(engine, fail);
      if (kind === 'construct') validateConstruct(engine, fail);
      if (kind === 'explore') validateExplore(engine, fail);
    });
  }

  report();
}

/**
 * The 100 migrated topics.
 *
 * Checked against the shape they actually have — `model.control`, `model.tolerance`,
 * `formula` — so the validator can be wired into `prebuild` today without a
 * second migration. Telemetry-bearing values (`start`, `tolerance`, the control
 * bounds) are asserted present and numeric, never rewritten.
 */
function validateLegacyBalance(topic, fail) {
  if (!isNonEmptyString(topic.formula)) fail('balance simulator has no formula');

  const model = topic.model;
  if (!model || typeof model !== 'object') {
    fail('legacy record has no model block');
    return;
  }

  if (!isNonEmptyString(model.kind)) fail('model.kind is missing');
  if (!isFiniteNumber(model.tolerance)) fail('model.tolerance must be a finite number');
  else if (model.tolerance <= 0) fail('model.tolerance must be positive');
  if (!isFiniteNumber(model.start)) fail('model.start must be a finite number');

  const control = model.control;
  if (!control || typeof control !== 'object') {
    fail('model.control is missing');
    return;
  }

  if (!isNonEmptyString(control.label)) fail('model.control.label is missing');
  if (!isDeclaredUnit(control.unit)) fail('model.control.unit is missing');
  if (!isFiniteNumber(control.min) || !isFiniteNumber(control.max)) fail('model.control needs finite min and max');
  else if (control.min >= control.max) fail(`model.control range is inverted (${control.min} >= ${control.max})`);
  if (control.precision !== undefined && !Number.isInteger(control.precision)) {
    fail('model.control.precision must be an integer');
  }
}

/** v2 balance: the equation is the subject, so it may not be null. */
function validateBalance(engine, fail) {
  if (!isNonEmptyString(engine.equation)) {
    fail('balance engine requires a non-empty equation string');
  }
  if (!isDeclaredUnit(engine.unit)) {
    fail('balance engine requires an explicit unit (empty string for a dimensionless quantity)');
  }
  if (!isFiniteNumber(engine.tolerance)) {
    fail('balance engine requires a finite tolerance');
  } else if (engine.tolerance <= 0) {
    fail('balance engine tolerance must be positive');
  }

  // The unit bug this blocks was real: a pH model solved in mol/L while its
  // control was authored in µmol/L, so every value counted as balanced.
  if (engine.toleranceUnit !== undefined && engine.toleranceUnit !== engine.unit) {
    fail(`tolerance is in ${engine.toleranceUnit} but the quantity is in ${engine.unit}`);
  }
}

/** v2 construct: no equation, but a predicate that has to survive the AST walk. */
function validateConstruct(engine, fail) {
  if (engine.equation !== null && engine.equation !== undefined) {
    fail('construct engine must declare equation as null — there is no relation to balance');
  }

  const validation = engine.validation;
  if (!validation || typeof validation !== 'object') {
    fail('construct engine has no validation block');
    return;
  }

  if (!isNonEmptyString(validation.predicate)) {
    fail('construct engine requires a validation.predicate string');
    return;
  }

  checkPredicate(validation.predicate, fail);
}

/** v2 explore: a regime to reach, and a checkpoint whose bounds are reachable. */
function validateExplore(engine, fail) {
  const validation = engine.validation;
  if (!validation || typeof validation !== 'object') {
    fail('explore engine has no validation block');
    return;
  }

  // The projection is what the runtime measures. It goes through the same AST
  // walk as a predicate because it is the same grammar and the same interpreter
  // — and because a projection that does not compile leaves the readout stuck
  // on "—" with nothing in the console to say why.
  if (!isNonEmptyString(engine.projection)) {
    fail('explore engine requires a projection expression string');
  } else {
    checkPredicate(engine.projection, fail);
  }

  if (!Array.isArray(engine.controls) || engine.controls.length === 0) {
    fail('explore engine requires at least one control');
  }

  const regime = validation.regime;
  if (!regime || typeof regime !== 'object') {
    fail('explore engine requires a validation.regime');
  } else {
    if (!isNonEmptyString(regime.variable)) fail('regime.variable is missing');
    if (!isNonEmptyString(regime.reaches)) fail('regime.reaches is missing');
    if (!Number.isInteger(regime.withinSteps) || regime.withinSteps <= 0) {
      fail('regime.withinSteps must be a positive integer');
    }
    if (regime.sustainFor !== undefined && (!Number.isInteger(regime.sustainFor) || regime.sustainFor <= 0)) {
      fail('regime.sustainFor must be a positive integer number of samples');
    }
    if (regime.sustainFor !== undefined && Number.isInteger(regime.withinSteps)
      && regime.sustainFor > regime.withinSteps) {
      // The tracker marks the run exhausted at `withinSteps`, so a hold longer
      // than the budget can never be completed.
      fail(`regime.sustainFor (${regime.sustainFor}) exceeds withinSteps (${regime.withinSteps}), so the hold is unreachable`);
    }

    // Samples per second for the frame loop. `sustainFor` is counted in
    // samples, so this is the only thing that turns it into a duration.
    if (regime.sampleHz !== undefined && (!isFiniteNumber(regime.sampleHz) || regime.sampleHz <= 0 || regime.sampleHz > 60)) {
      fail('regime.sampleHz must be a finite rate between 0 and 60 samples per second');
    }
  }

  const checkpoint = validation.checkpoint;
  if (!checkpoint || typeof checkpoint !== 'object') {
    fail('explore engine requires a validation.checkpoint');
    return;
  }

  if (!isNonEmptyString(checkpoint.prompt)) fail('checkpoint.prompt is missing');

  if (!Array.isArray(checkpoint.options) || checkpoint.options.length < 2) {
    fail('checkpoint.options needs at least two choices');
  } else if (!Number.isInteger(checkpoint.answerIndex)
    || checkpoint.answerIndex < 0
    || checkpoint.answerIndex >= checkpoint.options.length) {
    // An out-of-range answer index is unanswerable — the learner can never be
    // right, and nothing in the runtime would report it.
    fail(`checkpoint.answerIndex ${checkpoint.answerIndex} is outside options[0..${(checkpoint.options?.length ?? 1) - 1}]`);
  }

  if (checkpoint.bounds !== undefined) {
    const { min, max } = checkpoint.bounds ?? {};
    if (!isFiniteNumber(min) || !isFiniteNumber(max)) fail('checkpoint.bounds needs finite min and max');
    else if (min >= max) fail(`checkpoint.bounds is inverted (${min} >= ${max})`);
  }
}

function report() {
  if (errors.length) {
    console.error(`\n✗ Catalogue validation failed — ${errors.length} problem${errors.length === 1 ? '' : 's'}:\n`);
    for (const error of errors) console.error(`  • ${error}`);
    console.error('');
    process.exit(1);
  }

  const kinds = Object.entries(stats.byKind)
    .filter(([, count]) => count > 0)
    .map(([kind, count]) => `${count} ${kind}`)
    .join(' · ');

  console.log(`✓ Catalogue valid — ${stats.total} simulators (${stats.v1} legacy, ${stats.v2} v2) · ${kinds}`);
}

main().catch((error) => {
  console.error(`\n✗ Catalogue validation crashed: ${error.stack ?? error.message}\n`);
  process.exit(1);
});
