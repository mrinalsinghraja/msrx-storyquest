# Migration Handoff — 3-tier taxonomy + interaction archetypes

State sync as of 2026-07-19. Everything below is **uncommitted working tree**.
Nothing pushed, nothing deployed.

---

## 0. Read this first — two things that will bite you

### 0.1 Test fixtures are still in the catalogue — RESOLVED

> **Resolved before the `feature/learn-runtime-v2` commit.** `lib/topics/physics.js`
> was restored from `/tmp/phys.bak` and the validator reports the clean
> `100 simulators (100 legacy, 0 v2) · 100 balance` baseline. The section below is
> kept as the record of what the fixtures were and how they were used, because the
> same technique is the only way to exercise the construct and explore branches
> until real content exists for them.

`lib/topics/physics.js` currently contains **two fake topics** appended at the
end of the array:

| slug | kind | lab |
|---|---|---|
| `fixture-construct` | `construct` | `friction` |
| `fixture-explore` | `explore` | `collision` |

They exist to exercise the two new runtime branches, which no real content uses
yet. They are **not curriculum** and must be removed before any commit:

```bash
# Pristine copy taken before the fixtures were added (24926 bytes)
cp /tmp/phys.bak "apps/storyquest/lib/topics/physics.js"
```

`/tmp/phys.bak` will not survive a reboot. If it is gone, delete the two objects
by hand — they are the last two entries in the array and both carry an
`interactionKind` key, which no real topic does.

With fixtures present the validator reports `102 simulators (100 legacy, 2 v2)`.
After removal it must report `100 simulators (100 legacy, 0 v2) · 100 balance`.

### 0.2 `npm run build` destroys a running dev server

Documented already, hit three times this session. The build writes `.next`, the
dev server is reading it, and the result is a cascade of
`Cannot find module './331.js'` / `ENOENT routes-manifest.json` / HTTP 500 on
every route. **Not a code fault.** Always:

```
preview_stop → rm -rf .next → npm run build → rm -rf .next → preview_start
```

Corollary: when the dev server is in this state its **console errors are stale**
and will keep replaying a fixed syntax error indefinitely. `npm run build` is the
only authoritative answer. See §3.2 — an hour went into chasing a phantom because
of this.

---

## 1. Pure AST predicate interpreter

### 1.1 Why no `eval`

`next.config.js` builds its CSP with `'unsafe-eval'` **only when
`NODE_ENV !== 'production'`**. A `new Function(predicateSource)` call therefore:

- works in dev,
- works in `npm run build` (Node, no CSP),
- **throws only on the deployed site.**

That is the worst possible failure shape, and it is the same family as the
existing repo gotcha where a missing dev `'unsafe-eval'` made the page serve HTML
and never hydrate with no console error.

So predicates are never evaluated. They are **parsed to a tree at build time and
walked at runtime**.

### 1.2 The two-module split

| File | Imports | Runs where | Purpose |
|---|---|---|---|
| `lib/predicate.js` | **nothing** | server + client + validator | grammar constants, `evaluatePredicate`, `runPredicate` |
| `lib/predicate-compile.js` | `acorn` | build/server only | `compilePredicate(source) → tree` |

The split is load-bearing. `lib/predicate.js` having zero imports is what lets
the `.mjs` validator load it directly (no extensionless-resolver hook) *and*
keeps acorn (~120 kB) out of the client bundle. **Nothing reachable from a
`'use client'` component may import `predicate-compile.js`.**

### 1.3 Grammar

Roots — the only free identifiers allowed:

```
state · count · built · target
```

Operators:

```
=== !== == != < <= > >= + - * / % && || !
```

Banned keys, rejected at compile *and* re-checked at runtime:

```
__proto__ prototype constructor eval Function require import process
globalThis global window document fetch child_process this
Reflect Proxy Symbol WebAssembly
```

Compact node types produced by the compiler and consumed by the evaluator:

| `t` | shape | source form |
|---|---|---|
| `lit` | `{t,v}` | literal |
| `id` | `{t,n}` | root identifier |
| `mem` | `{t,o,c,p}` | member access; `c` = computed |
| `un` | `{t,op,a}` | unary |
| `bin` | `{t,op,l,r}` | binary |
| `log` | `{t,op,l,r}` | `&&` / `\|\|`, short-circuits |
| `cond` | `{t,c,a,b}` | ternary |
| `arr` | `{t,e[]}` | array literal |

There is **no call node and no loop node**, so evaluation always terminates and
cannot reach outside `scope`.

### 1.4 Runtime hardening beyond the compile gate

The compiler is the real gate, but a compiled tree is *shipped data*, so
`evaluatePredicate` re-checks rather than trusting provenance:

- banned key lookup on every `mem` access, including computed ones;
- **own-properties only** — `Object.hasOwn`, with explicit exceptions for array
  indices, `Array.prototype.length`, and `String.prototype.length`;
- unknown `t` throws instead of falling through to a default;
- computed keys must have compiled from a `Literal`, so no property name can be
  assembled at evaluation time.

`runPredicate(tree, scope)` wraps it and returns
`{ isSatisfied: boolean, error: string|null }`. A throwing predicate is a build
escape, not a wrong learner, so it degrades to *not satisfied yet* with the
reason surfaced in dev — it never unmounts the simulator.

### 1.5 The same interpreter runs `explore` projections

`ExploreRuntime` originally took `engine.project` as a **function** authored in
the topic file. That cannot cross the server→client boundary:

```
Functions cannot be passed directly to Client Components unless you explicitly
expose it by marking it with "use server".
```

Fixed by making it `engine.projection` — an expression **string** (fixture value:
`'state.angle'`) compiled by the same `compilePredicate` in the page's
`prepare()` and walked by `evaluatePredicate` with
`{ state: inputs, count: {}, built: [], target: {} }`. Plain JSON across the
boundary, no second mechanism, still no `eval`.

`lib/curriculum.js` now enforces `typeof engine.projection === 'string'` so a
regression fails at import rather than as a runtime error on the page.

### 1.6 One allowlist, not two

`scripts/validate-catalog.mjs` previously carried its own copy of the node/
operator/root/banned tables. It now imports `compilePredicate` and its
`checkPredicate` is:

```js
function checkPredicate(source, fail) {
  try { compilePredicate(source); }
  catch (error) { fail(`predicate rejected: ${error.message}`); }
}
```

Compiling *is* the check. Two copies meant a capability could be added to one and
not the other.

### 1.7 Verified

41/41 in a standalone harness: evaluation (counts, array index, `length`,
arithmetic, ternary, short-circuit, missing key → `undefined` not throw);
compiler rejection of `eval`, `state.constructor`, `__proto__`, `process`, calls,
assignment, non-literal computed keys, unknown roots, `import()`, template
literals, arrow functions, sequences; and runtime defence against **hand-forged
trees** that bypass the compiler entirely.

---

## 2. `model.control` crashes on the new archetypes

`interactionKind` splits the catalogue into records that have a `model` and
records that do not. Five places assumed every mission had one. All five threw
the moment a single construct/explore record entered `lib/topics/*`.

### 2.1 `lib/curriculum.js` — the severe one

The dev guard ran `buildStory(mission)` and `createModel(mission.model)` for
**every** mission unconditionally:

```
TypeError: Cannot read properties of undefined (reading 'start')
  at probeShape (lib/story-builder.js:18:29)
  at buildStory (lib/story-builder.js:249:55)
  at eval (lib/curriculum.js:85:15)
```

This throws at **module scope**, and `lib/curriculum.js` is evaluated once for
the whole catalogue. One malformed construct record therefore 500s **every page
that imports the curriculum — all 100 balance simulators included**, plus
`/learn`, `/learn/all`, and every chapter index.

Without a fixture this would have shipped as adapters that could never be
enabled without taking the site down.

Now branched:

```js
const kind = mission.interactionKind ?? 'balance';

if (kind === 'balance')   { buildStory(...); createModel(...); reachable; not-pre-balanced }
if (kind === 'construct') { engine.initial.slots non-empty; engine.validation.predicate present }
if (kind === 'explore')   { engine.projection is a non-empty string; engine.controls non-empty }
// lab / chapter / difficulty / gradeGroup / gradeLevel checks stay common to all three
```

### 2.2 `generateMetadata` — `app/learn/[discipline]/[chapter]/[id]/page.jsx`

Read `mission.model.control.label.toLowerCase()` unconditionally →
`Cannot read properties of undefined (reading 'control')`. Now falls back:

```js
const description = mission.model?.control
  ? `Solve … Tune ${mission.model.control.label.toLowerCase()} until the relationship balances.`
  : mission.engine?.brief ?? mission.title;
```

### 2.3 `lib/plates.js`

Read `mission.model.control.label` and typeset `mission.formula` for every plate.
Now derives `kind` first, sets `formula = kind === 'balance' ? mission.formula : null`,
and emits `control: mission.model?.control?.label ?? null`,
`formulaHtml: formula ? katex.renderToString(...) : null`,
`scenario: mission.scenario ?? mission.engine?.brief ?? ''`, plus a new
`interactionKind` field.

### 2.4 `components/CataloguePlate.jsx`

`showsSpecimen` keyed on size alone. Now `plate.size !== 'quarter' && Boolean(plate.formulaHtml)` —
a construct/explore plate has no equation to typeset.

### 2.5 `components/MissionLobby.jsx` — masthead specimen

`const feature = filtered[0] ?? plates[0]` could select a plate with no formula,
producing an empty frontispiece specimen that reads as a broken render. Now picks
the first plate that actually has one, and the `<figure>` is conditional on
`feature` being non-null.

### 2.6 Orchestrator dispatch

`components/MissionRuntime.jsx` is now a switch that mounts before any canvas
parameters are configured:

```js
switch (mission.interactionKind) {
  case 'construct': return <ConstructRuntime mission={mission} />;
  case 'explore':   return <ExploreRuntime   mission={mission} />;
  default:          return <BalanceRuntime   mission={mission} />;
}
```

The original component is renamed `BalanceRuntime` and is **otherwise unchanged**
except for one added effect that calls `recordCompletion(mission.id, { kind: 'balance' })`
when the story reaches its ending.

---

## 3. Regime tracker streak logic + what broke in MissionLobby

### 3.1 Streak validation — current state

`lib/regime.js`, `stepRegime(state, raw, regime)`.

The rule: a value must stay inside the window for `sustainFor` **consecutive**
samples. A single in-bounds reading proves nothing, because a slider dragged end
to end passes through every window on the way.

**The fix.** Original code, on an unreadable sample:

```js
if (value === null) return { ...state, samples };
```

That preserved the streak across a gap, so `[50, 51, 'nope', 52]` satisfied a
`sustainFor: 3` regime — crediting a hold that was never measured. Current code
(`lib/regime.js:99`):

```js
// An unreadable sample breaks the streak rather than carrying it.
if (value === null) return { ...state, samples, streak: 0, inWindow: false };
```

"We could not measure it" is not evidence the learner was still holding. Values
come from range inputs, so in practice this only fires on a real fault.

Other settled semantics:

- `readValue(raw, axis)` accepts numbers, slider strings, `"x,y"` coordinate
  pairs (reduced by the regime's named axis, default `x`), and `{x,y}` objects.
  A coordinate pair is **not** reduced to distance-from-origin — a regime that
  tracks one variable must not silently start tracking another.
- `windowFor(regime)` accepts either `{bounds:{min,max}}` or `{target,tolerance}`.
- **Once `satisfied` is true the state is returned untouched.** Success is a
  thing the learner achieved, not a live readout that flickers off when they keep
  playing with the controls.
- `enteredAtSample` records the first moment in the window and is kept even if
  they leave again.
- `exhausted` when `samples >= withinSteps` without satisfying.

Verified: single touch insufficient · 3 consecutive satisfies · broken streak
resets · full drag-through does not satisfy · stays satisfied after leaving ·
`withinSteps` exhaustion · no-bounds regime is inert.

**In `ExploreRuntime` sustaining the regime is necessary but not sufficient** —
`complete = tracker.satisfied && correct`, where `correct` is the checkpoint
answer. Reaching a regime by accident is not understanding it. `recordCompletion`
fires only on `complete`.

### 3.2 What broke in `MissionLobby.jsx`

Wrapping the masthead `<figure>` in `{feature && ( … )}` was done as **two
separate edits**: the opening `{feature && (` first, the closing `)}` second.
Between them the file was genuinely unbalanced and SWC reported:

```
x Unterminated regexp literal
  ,-[components/MissionLobby.jsx:98:1]
```

The second edit fixed it. **The dev server never recovered**, and
`read_console_messages` kept replaying the same two cached errors pointing at a
line number that no longer matched the file contents (it cited `</div>` at line
98; line 98 was by then `)}`).

The consequence was misleading: a client-bundle compile error kills *all*
interactivity, so the construct adapter appeared broken — clicking
`→ near` did nothing, pool stayed at 3 crates, slots stayed `0/4`. Time was spent
debugging a `place()` callback that was correct all along.

Resolution: `npm run build` compiled clean (250 pages), proving the file was
fine. After a dev restart the adapter worked on the first click — `Crate 1 → near`
moved the pool from `[Crate 1, Crate 2, Crate 3]` to `[Crate 2, Crate 3]` and
`Near bay` from `0/4` to `1/4`.

**Lesson for the next session:** when the dev server reports a syntax error whose
quoted source does not match the file on disk, the error is stale. Trust
`npm run build`, not the console. Prefer a single `Write` over paired `Edit`s
when adding a JSX conditional wrapper.

---

## 4. Verification status — honest

| Thing | Status |
|---|---|
| Predicate compiler + interpreter | **Verified**, 41/41 including forged-tree defence |
| Regime tracker | **Verified**, pure-function tests |
| All three routes mount (200) | **Verified** |
| Production build | **Verified** — 250 pages, validator green |
| Legacy `/missions/*` redirects | **Verified** — 308 to nested paths, `/missions/nope` 404s |
| Board lens + localStorage | **Verified** |
| Construct adapter: reaching `isSatisfied` | **Verified** — 2 near + 1 far, card renders |
| Construct adapter: `recordCompletion` write | **Verified** — `{kind:"construct", plays:1}` |
| Explore adapter: hold + checkpoint | **Verified** — `{kind:"explore", plays:1}` |
| `recordCompletion` on the balance path | **Verified** — `{kind:"balance", plays:1}` |
| Apparatus styling, all states | **Verified** — pigment, type split, focus ring |
| `lib/progress.js` eviction at 500 entries | **NOT verified** |

The CSS classes the two adapters render (`.construct*`, `.explore*`) have **no
styling in `globals.css`** — they are unstyled markup. That is deliberate scope,
not an oversight, but the adapters will look raw until someone designs them.

---

## 5. Next actions, in order

1. **Remove the fixtures** (§0.1) and confirm the validator reports 100/0.
2. Finish construct verification: 2 crates → near, 1 → far, assert `isSatisfied`,
   the completion card, and the `storyquest_progress` localStorage write.
3. Drive the explore sliders into `40–50`, hold 3 samples, answer the checkpoint,
   assert `complete` and the progress write.
4. Style `.construct*` / `.explore*` in the catalogue design language.
5. Decide the four open questions in
   [CURRICULUM_ARCHITECTURE.md](CURRICULUM_ARCHITECTURE.md) §6 — the
   `interactionKind` split is now implemented but still not *approved*.
6. **Verify the board registry anchors.** `lib/registry.js` maps 28 chapters ×
   6 boards, and every one of those anchors is **unverified against current
   published specifications**. The UI states them to students with full
   confidence. Some are probably wrong. This is a Phase 1 exit gate.

---

## 6. File inventory

**New**

```
lib/taxonomy.js            4 disciplines, 28 chapters
lib/redirects.js           legacy URL resolution, 4 spellings
lib/plates.js              server-side KaTeX view model
lib/registry.js            board lens, 28 × 6 (UNVERIFIED anchors)
lib/predicate.js           runtime interpreter, zero imports
lib/predicate-compile.js   acorn compiler, build only
lib/regime.js              explore regime tracker
lib/progress.js            device-local completion registry
scripts/validate-catalog.mjs   prebuild gate
components/CataloguePlate.jsx  shared plate
components/BoardProvider.jsx   useSyncExternalStore + localStorage
components/BoardSelector.jsx
components/ChapterIndex.jsx
components/ConstructRuntime.jsx
components/ExploreRuntime.jsx
app/learn/                 4 route levels + /learn/all
docs/CURRICULUM_ARCHITECTURE.md
```

**Modified**

```
lib/curriculum.js          difficultyFor deleted; guard branched by kind
lib/topics/*.js            +4 keys × 100 topics (+2 fixtures in physics.js — REMOVE)
components/MissionRuntime.jsx   dispatch switch; original → BalanceRuntime
components/MissionLobby.jsx     CataloguePlate; formula-bearing feature
app/globals.css            directory, board lens, chapters, pigment self-selector fix
app/sitemap.js             137 canonical URLs, 0 legacy
app/missions/*             → redirects
package.json               prebuild + validate scripts, acorn devDependency
app/{page,not-found}.jsx, components/Site{Header,Footer}.jsx   /missions → /learn
```
