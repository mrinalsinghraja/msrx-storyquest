# MSRX StoryQuest — Global Curriculum Architecture (300 Simulators)

Phase 1 deliverable. Taxonomy, distribution, schema, and rollout plan for scaling
from 100 missions to ~300 interactive simulators covering ages 6–16.

No simulator canvas code here by design. This document is the contract that the
canvas engines are written against.

---

## 0. The constraint that shapes everything else

StoryQuest's core architecture rule is that **the answer is solved from a real
equation, never picked to look plausible** (`lib/models.js`, 17 relationship
kinds; the dev guard in `lib/curriculum.js` throws if a solved value is off-slider
or if a mission starts already balanced).

That rule is what makes the product honest. It also does not survive contact with
the new age bracket:

- A 7-year-old learning "heavier things sink" has no equation to balance.
- Most Class 1–5 mathematics is counting, place value, and shape — manipulable,
  but not a two-sided relation.
- Biology below Class 9 is overwhelmingly qualitative. Forcing equations onto
  photosynthesis for a 10-year-old produces exactly the fake-target problem the
  2026-07-18 rebuild existed to kill.

**Resolution: add an `interactionKind` axis rather than weakening the rule.**

| `interactionKind` | Learner does | Correctness judged by | Ages |
|---|---|---|---|
| `balance` | Moves a control until two sides of a real relation agree | Solved quantity within tolerance, in the quantity's own unit | 11–16 |
| `construct` | Builds an artifact to a stated spec (build the atom, tile the shape, wire the circuit) | Structural predicate over the built state | 6–16 |
| `explore` | Manipulates inputs and observes emergent behaviour; no single answer | Reaching a described regime, or answering a checkpoint about what was observed | 6–13 |

`balance` keeps the existing engine and the existing guard, untouched. The two new
kinds get their own validators. Nothing gets a fabricated target.

This is the single most important decision in Phase 1. Everything below assumes it.

---

## 1. Macro-distribution matrix — 300 slots

### Age bands

| Band | Age | Indian class | Global equivalents |
|---|---|---|---|
| **Early** | 6–10 | Class 1–5 | UK KS1–KS2 · NGSS K–5 · IB PYP upper · IGCSE pre |
| **Middle** | 11–13 | Class 6–8 | UK KS3 · NGSS MS · IB MYP 1–3 |
| **High** | 14–16 | Class 9–10 | UK KS4 · NGSS HS (entry) · IGCSE · IB MYP 4–5 |

### Discipline × age band

| Discipline | Early (6–10) | Middle (11–13) | High (14–16) | **Total** |
|---|---:|---:|---:|---:|
| ⌗ Mathematics | 42 | 25 | 18 | **85** |
| ⚛ Physics | 18 | 28 | 34 | **80** |
| 🧪 Chemistry | 12 | 26 | 32 | **70** |
| 🧬 Biology | 18 | 26 | 21 | **65** |
| **Total** | **90** | **105** | **105** | **300** |

### Why this shape, and not an even 75/75/75/75

**Mathematics is front-loaded (42 Early).** It is the only discipline taught with
full weight at every age in every board listed, and primary mathematics — number
line, fractions as area, symmetry, measurement, clock — is inherently
manipulable. These are the best `construct` and `explore` simulators we will ever
build. It then *falls* to 18 at High, because Class 9–10 algebra and trigonometry
are largely symbolic; 18 honest simulators beat 40 contrived ones.

**Chemistry is back-loaded (12 Early).** No board teaches chemistry as a separate
discipline before roughly Class 6. The 12 Early slots are materials and states of
matter, which sit inside general science everywhere.

**Biology is capped at 65.** It is the discipline with the least
equation-solvable content, and its quantitative material (Punnett ratios,
population growth, osmosis rate, magnification) clusters at High. Padding it to 75
would mean inventing equations, which the architecture forbids.

**Physics peaks at High (34).** Class 9–10 physics is where the board overlap is
densest and where the existing `balance` engine is strongest.

### Interaction kind × age band

| Band | `balance` | `construct` | `explore` | Total |
|---|---:|---:|---:|---:|
| Early | 12 | 34 | 44 | 90 |
| Middle | 48 | 27 | 30 | 105 |
| High | 76 | 18 | 11 | 105 |
| **Total** | **136** | **79** | **85** | **300** |

136 `balance` simulators means the existing engine covers 45% of the target and
the current 100 missions port into it directly. The other two kinds are new build.

---

## 2. Level 2 — Core chapters

28 chapters across the four disciplines. Each carries its slot budget and its
board anchors. Board codes are indicative anchors for mapping, not verbatim
syllabus citations — Phase 1 exit criteria include verifying each against the
current published specification.

### ⚛ Physics — 8 chapters, 80 slots

| # | Chapter | Slots | Bands | Board relevance |
|---|---|---:|---|---|
| P1 | Forces & Motion | 14 | E·M·H | CBSE 8 Ch11 / 9 Ch8–9 · ICSE 9–10 · IGCSE 1.5–1.6 · NGSS MS-PS2, HS-PS2 · UK KS2–KS4 Forces · MYP Sciences |
| P2 | Energy, Work & Power | 11 | M·H | CBSE 9 Ch11 · IGCSE 1.7 · NGSS MS-PS3, HS-PS3 · UK KS3–KS4 Energy |
| P3 | Light & Optics | 12 | E·M·H | CBSE 10 Ch10–11 · ICSE 10 · IGCSE 3.2 · NGSS MS-PS4-2 · UK KS2 Light, KS4 |
| P4 | Electricity & Magnetism | 13 | M·H | CBSE 10 Ch12–13 · IGCSE 4 · NGSS MS-PS2-3, HS-PS2-5 · UK KS2 Circuits → KS4 |
| P5 | Heat & Thermal Physics | 9 | E·M·H | CBSE 7 Ch4 / 11 · IGCSE 2.2–2.3 · NGSS MS-PS3-4 · UK KS3 Particle model |
| P6 | Waves & Sound | 9 | E·M·H | CBSE 8 Ch13 / 9 Ch12 · IGCSE 3.1 · NGSS MS-PS4-1 · UK KS2 Sound, KS3 |
| P7 | Pressure & Fluids | 6 | M·H | CBSE 8 Ch11 · ICSE 8–9 · IGCSE 1.8 · UK KS3 |
| P8 | Space, Gravity & Earth Systems | 6 | E·M·H | CBSE 9 Ch10 · NGSS MS-ESS1, HS-ESS1 · UK KS2 Earth & Space, KS3 · IGCSE 6 |

### 🧪 Chemistry — 6 chapters, 70 slots

| # | Chapter | Slots | Bands | Board relevance |
|---|---|---:|---|---|
| C1 | Matter & the Particle Model | 14 | E·M·H | CBSE 9 Ch1 · IGCSE 1.1 · NGSS MS-PS1-1, MS-PS1-4 · UK KS2 States of Matter, KS3 Particulate · MYP |
| C2 | Atomic Structure & the Periodic Table | 13 | M·H | CBSE 9 Ch4 / 10 Ch5 · IGCSE 2–3 · NGSS MS-PS1-1, HS-PS1-1 · UK KS3–KS4 |
| C3 | Chemical Reactions & Equations | 13 | M·H | CBSE 10 Ch1 · IGCSE 4, 6 · NGSS MS-PS1-2, MS-PS1-5 · UK KS4 |
| C4 | Acids, Bases & Salts | 11 | M·H | CBSE 10 Ch2 · ICSE 10 · IGCSE 8 · UK KS3–KS4 |
| C5 | Mixtures, Solutions & Separation | 10 | E·M·H | CBSE 9 Ch2 · IGCSE 1.2 · NGSS MS-PS1-3 · UK KS2 Separating mixtures, KS3 |
| C6 | Rates, Energetics & Electrochemistry | 9 | H | IGCSE 5–7 · CBSE 10 Ch3 · NGSS HS-PS1-5, HS-PS1-6 · UK KS4 |

### ⌗ Mathematics — 8 chapters, 85 slots

| # | Chapter | Slots | Bands | Board relevance |
|---|---|---:|---|---|
| M1 | Number Sense & Place Value | 14 | E | CBSE 1–5 · UK KS1–KS2 Number · US CCSS K–5.NBT · IB PYP · MYP 1 |
| M2 | Fractions, Decimals & Percentage | 13 | E·M | CBSE 4–7 · UK KS2 Fractions · CCSS 3–6.NF, 6.RP · IGCSE 1 |
| M3 | Ratio, Proportion & Rate | 9 | M·H | CBSE 6–8 · CCSS 6–7.RP · IGCSE 1.11 · UK KS3 |
| M4 | Geometry, Shape & Symmetry | 13 | E·M·H | CBSE 6–10 · UK KS1–KS3 Geometry · CCSS K–8.G · IGCSE 4 |
| M5 | Measurement & Mensuration | 11 | E·M·H | CBSE 4–10 · UK KS2 Measurement · CCSS 3–7.MD · IGCSE 5 |
| M6 | Algebra & Equations | 9 | M·H | CBSE 6–10 · UK KS3–KS4 Algebra · CCSS 6–8.EE · IGCSE 2 |
| M7 | Coordinate Geometry & Graphs | 8 | M·H | CBSE 9–10 · IGCSE 3 · CCSS 8.F · UK KS4 |
| M8 | Data, Statistics & Probability | 8 | E·M·H | CBSE 6–10 · CCSS 6–8.SP · IGCSE 9 · UK KS2–KS4 |

Trigonometry (CBSE 10 Ch8–9, IGCSE 6) is deliberately folded into **M4 Geometry**
rather than given its own chapter — at this age ceiling it is 3–4 simulators, and
a chapter that thin reads as an error in the catalogue.

### 🧬 Biology — 6 chapters, 65 slots

| # | Chapter | Slots | Bands | Board relevance |
|---|---|---:|---|---|
| B1 | Cells, Microscopy & Organisation | 12 | M·H | CBSE 8 Ch8 / 9 Ch5 · IGCSE 2 · NGSS MS-LS1-1, MS-LS1-2 · UK KS3 Cells |
| B2 | Human Body Systems | 14 | E·M·H | CBSE 6–10 · IGCSE 9, 11, 12 · NGSS MS-LS1-3 · UK KS2 Human body, KS3 |
| B3 | Plants & Photosynthesis | 11 | E·M·H | CBSE 7 Ch1 / 10 Ch6 · IGCSE 6 · NGSS MS-LS1-6 · UK KS2 Plants, KS3 |
| B4 | Ecosystems & Energy Flow | 12 | E·M·H | CBSE 10 Ch15 · IGCSE 19 · NGSS MS-LS2-1…4 · UK KS3–KS4 |
| B5 | Genetics, Heredity & Evolution | 9 | H | CBSE 10 Ch9 · IGCSE 17–18 · NGSS MS-LS3, MS-LS4, HS-LS3 · UK KS4 |
| B6 | Health, Disease & Microbes | 7 | M·H | CBSE 9 Ch13 · IGCSE 10, 21 · NGSS MS-LS1-5 · UK KS3–KS4 |

**Totals check:** Physics 80 · Chemistry 70 · Mathematics 85 · Biology 65 = **300**.

---

## 3. Database schema

### 3.1 Design decisions worth defending

**Standards are references into a registry, never inline strings.** 300 simulators
× ~6 boards would mean ~1800 hand-typed syllabus strings that drift the moment
CBSE renumbers a chapter. The registry is the single place a board code is
spelled, and simulators hold IDs into it. This also makes "show me every simulator
that covers NGSS MS-PS2-2" a lookup instead of a substring search.

**`controls` is an array even when there is one.** The current schema has a
singular `model.control`. Half the new simulators need two or three inputs (lens
distance *and* focal length; temperature *and* pressure). Migrating a singular
field to an array across 300 records later is far worse than accepting an array of
one now.

**`chapterId` is stored, `difficulty` is stored, neither is derived from array
position.** `difficultyFor(index)` in the current `lib/curriculum.js` infers
difficulty from a topic's index inside its subject array. At 25 topics that is a
neat trick. At 300 it means inserting one simulator silently re-grades every
simulator after it. This must be explicit before Phase 2 begins.

**`slug` is stable and human-authored; the numeric `id` is derived.** The current
`M001`-style numbering is a display artifact computed from position. URLs must not
be, or every insertion breaks every inbound link and the SEO work done in
`app/missions`.

### 3.2 Registry: `data/standards.json`

```json
{
  "boards": {
    "cbse":  { "label": "CBSE",  "region": "IN", "system": "class",   "levels": ["1","2","3","4","5","6","7","8","9","10"] },
    "icse":  { "label": "ICSE",  "region": "IN", "system": "class",   "levels": ["1","2","3","4","5","6","7","8","9","10"] },
    "ngss":  { "label": "NGSS",  "region": "US", "system": "band",    "levels": ["K-2","3-5","MS","HS"] },
    "uk":    { "label": "UK National Curriculum", "region": "GB", "system": "keystage", "levels": ["KS1","KS2","KS3","KS4"] },
    "igcse": { "label": "Cambridge IGCSE", "region": "INTL", "system": "unit", "levels": ["core","extended"] },
    "ibmyp": { "label": "IB MYP", "region": "INTL", "system": "year", "levels": ["1","2","3","4","5"] }
  },

  "standards": {
    "ngss:MS-PS2-2": {
      "board": "ngss",
      "level": "MS",
      "code": "MS-PS2-2",
      "statement": "Plan an investigation to provide evidence that the change in an object's motion depends on the sum of the forces on the object and the mass of the object.",
      "chapterId": "physics.forces-motion"
    },
    "cbse:9:9": {
      "board": "cbse",
      "level": "9",
      "code": "Ch 9 — Force and Laws of Motion",
      "statement": "Newton's three laws of motion, inertia, momentum, conservation of momentum.",
      "chapterId": "physics.forces-motion"
    },
    "uk:KS3:physics:forces": {
      "board": "uk",
      "level": "KS3",
      "code": "Physics / Forces",
      "statement": "Forces as pushes or pulls arising from interaction between two objects; balanced and unbalanced forces.",
      "chapterId": "physics.forces-motion"
    },
    "igcse:1.5": {
      "board": "igcse",
      "level": "core",
      "code": "1.5 Forces",
      "statement": "Effects of forces, resultant force, friction, Newton's third law.",
      "chapterId": "physics.forces-motion"
    }
  }
}
```

### 3.3 Taxonomy: `data/taxonomy.json`

Level 1 and Level 2. Level 3 lives with the simulators.

```json
{
  "disciplines": [
    {
      "id": "physics",
      "label": "Physics",
      "glyph": "⚛",
      "pigment": "oklch(0.48 0.075 235)",
      "blurb": "Forces, energy, light, circuits, and the rules the world runs on.",
      "slotBudget": 80
    }
  ],

  "chapters": [
    {
      "id": "physics.forces-motion",
      "disciplineId": "physics",
      "ordinal": 1,
      "label": "Forces & Motion",
      "blurb": "What makes things start, stop, turn, and stay put.",
      "slotBudget": 14,
      "ageBands": ["early", "middle", "high"],
      "bigIdeas": [
        "A force is an interaction between two objects, never a property of one.",
        "Balanced forces change nothing; only a resultant force changes motion.",
        "Turning depends on force and distance together, not force alone."
      ],
      "prerequisiteChapterIds": [],
      "unlocksChapterIds": ["physics.energy-work", "physics.pressure-fluids"]
    }
  ]
}
```

### 3.4 Simulator record — full shape

One file per chapter under `data/simulators/<discipline>/<chapter>.json`, so a
chapter can be authored, reviewed, and code-split independently.

```json
{
  "schemaVersion": 2,

  "slug": "torque-balance",
  "chapterId": "physics.forces-motion",
  "ordinal": 3,

  "title": "Torque balance",
  "conceptLabel": "Moments about a pivot",
  "blurb": "A small counterweight far out can hold a large load close in.",

  "audience": {
    "ageBand": "middle",
    "ageRange": [11, 14],
    "gradeSpan": { "cbse": ["8", "9"], "uk": ["KS3"], "ngss": ["MS"], "ibmyp": ["2", "3"] },
    "difficulty": "explorer",
    "readingLevel": "grade-7",
    "estimatedMinutes": 6
  },

  "standardIds": ["ngss:MS-PS2-2", "cbse:9:9", "uk:KS3:physics:forces", "igcse:1.5"],

  "interaction": {
    "kind": "balance",
    "labId": "lever",
    "formula": "\\tau_1 = \\tau_2 \\;\\Rightarrow\\; F_1 d_1 = F_2 d_2",
    "formulaPlain": "Load force times its distance equals counterweight force times its distance."
  },

  "state": {
    "modelKind": "inverseProduct",
    "params": {
      "leftA": 12, "leftB": 1.8, "rightA": 9,
      "leftName": "Load moment", "rightName": "Counter moment",
      "productUnit": "kN·m"
    },
    "controls": [
      {
        "id": "counterweight-distance",
        "label": "Counterweight distance",
        "unit": "m",
        "min": 0.5,
        "max": 4,
        "step": 0.01,
        "precision": 2,
        "start": 3.4,
        "solved": true
      }
    ],
    "readouts": [
      { "id": "load-moment",  "label": "Load moment",  "unit": "kN·m", "source": "left"  },
      { "id": "counter-moment","label": "Counter moment","unit": "kN·m", "source": "right" }
    ],
    "success": {
      "judgedOn": "quantity",
      "quantityId": "counter-moment",
      "tolerance": 0.9,
      "toleranceUnit": "kN·m"
    }
  },

  "narrative": {
    "scenario": "a cargo crane leaning over a flooded rail yard",
    "crisis": "The jib is holding a 12 kN pallet 1.8 m out from the pivot, and the counterweight is parked in the wrong slot. The whole arm is creeping downward.",
    "insight": "A pivot does not care about force alone. It cares about force multiplied by distance.",
    "resolution": "With the counterweight at the solved distance, both moments about the pivot are equal and the jib stops moving.",
    "aiRewritable": true
  },

  "media": {
    "ogImage": "auto",
    "altText": "A crane jib over a rail yard with an adjustable counterweight on the back arm."
  },

  "publish": {
    "status": "live",
    "authoredOn": "2026-07-19",
    "reviewedBy": "curriculum",
    "validatorsPassed": ["reachable", "not-pre-balanced", "unit-match", "lab-exists", "standards-resolve"]
  }
}
```

### 3.5 `success` block by interaction kind

The one field that differs across the three kinds. Everything else in the record
is identical, which is what lets one catalogue page render all 300.

```json
// kind: "balance" — existing engine, unchanged
"success": {
  "judgedOn": "quantity",
  "quantityId": "counter-moment",
  "tolerance": 0.9,
  "toleranceUnit": "kN·m"
}

// kind: "construct" — a predicate over the built state
"success": {
  "judgedOn": "structure",
  "predicate": {
    "all": [
      { "count": "electrons.shell[0]", "equals": 2 },
      { "count": "electrons.shell[1]", "equals": 8 },
      { "count": "electrons.shell[2]", "equals": 1 }
    ]
  },
  "hint": "The outer shell is where the reactivity lives."
}

// kind: "explore" — reach a regime, then answer what was seen
"success": {
  "judgedOn": "observation",
  "regime": { "variable": "predatorPopulation", "reaches": "oscillating", "withinSteps": 400 },
  "checkpoint": {
    "prompt": "What happened to the rabbits each time the foxes peaked?",
    "options": ["They rose", "They fell", "They stayed level"],
    "answerIndex": 1
  }
}
```

### 3.6 Validators (extend the existing import-time dev guard)

| Validator | Applies to | Fails when |
|---|---|---|
| `reachable` | balance | Solved value sits outside a control's `[min, max]` |
| `not-pre-balanced` | balance | `start` already satisfies tolerance — no puzzle |
| `unit-match` | balance | `toleranceUnit` ≠ the judged quantity's unit (this caught a real µmol/L vs mol/L bug) |
| `solved-control` | balance | Not exactly one control marked `"solved": true` |
| `predicate-satisfiable` | construct | No reachable state satisfies the predicate |
| `regime-reachable` | explore | Regime never occurs within `withinSteps` across a parameter sweep |
| `lab-exists` | all | `labId` missing from the `LABS` registry |
| `standards-resolve` | all | A `standardIds` entry has no registry entry |
| `chapter-resolves` | all | `chapterId` missing from taxonomy |
| `slot-budget` | chapter | Chapter simulator count ≠ its declared `slotBudget` |
| `apparatus-spread` | chapter | One `labId` used by more than 4 simulators **in a chapter** |

Note the last one: the current guard caps apparatus reuse at 4 *per subject*. At
80 physics simulators that cap is unmeetable — it would demand 20 distinct
physics apparatus. Rescoping it to per-chapter keeps the intent (a chapter should
not look like one picture repeated) while staying achievable.

---

## 4. Four-phase implementation timeline

Durations are working weeks at the current single-maintainer pace. Each phase has
a hard exit gate; the next phase does not start until the gate passes.

### Phase 1 — Curriculum mapping & taxonomy · ~3 weeks

Data only. No UI, no engines.

| | |
|---|---|
| **Build** | `data/standards.json` registry · `data/taxonomy.json` (4 disciplines, 28 chapters) · 300 simulator stubs with slug, chapter, audience, standardIds, interaction kind, and `status: "planned"` · schema v2 TypeScript-free JSDoc typedefs |
| **Migrate** | The existing 100 missions into schema v2: `model.control` → `controls[]`, derived difficulty → stored, position-derived ID → stable slug, with a redirect map from every current `/missions/<id>` URL |
| **Exit gate** | Every chapter's stub count equals its `slotBudget` · every `standardIds` entry resolves · every board anchor in §2 verified against the current published specification · all 100 existing missions round-trip through v2 with byte-identical rendered output |
| **Risk** | Board verification is the long pole and is not parallelisable with anything. Budget the full first week for it and do not let stub authoring start before the chapter list is frozen. |

### Phase 2 — Layout scaffolding · ~2.5 weeks

Extends the `.catalogue` design system already shipped on `/missions` — the
tokens, the plate grid, the pigments, and the Instrument Serif / Newsreader /
JetBrains Mono stack all carry forward. This phase is routing and information
architecture, not a new visual language.

| | |
|---|---|
| **Build** | Three-tier routes: `/learn` → `/learn/[discipline]` → `/learn/[discipline]/[chapter]` → `/learn/[discipline]/[chapter]/[slug]` · discipline index (chapter cards with progress) · chapter index (the plate grid, now 6–14 plates instead of 100) · combined filters across age band, board, and interaction kind · a board-selector that rewrites the whole catalogue's labelling to the learner's own syllabus |
| **Also** | Redirects from the flat `/missions/*` URLs · sitemap regeneration for ~340 new pages · per-chapter JSON code splitting so a chapter page loads one chapter's data, not 300 |
| **Exit gate** | Every one of the 300 stubs has a reachable, indexable URL rendering its metadata · no route ships more than its own chapter's data · Lighthouse ≥ 95 on a chapter index · keyboard path from `/learn` to any simulator |
| **Risk** | **The current lobby renders all 100 plates in one DOM and pre-typesets 100 KaTeX strings at build time. At 300 that page must not exist.** The chapter index replacing it is the reason this phase is structural rather than cosmetic. |

### Phase 3 — Core canvas & logic engines · ~7 weeks, the bulk of the work

| | |
|---|---|
| **3a · Engines** | Extend `lib/models.js` from 17 to ~28 relationship kinds for the new `balance` simulators · new `lib/construct/` predicate evaluator · new `lib/explore/` stepped-simulation runtime with regime detection |
| **3b · Apparatus** | Grow `LABS` from 49 to ~90 visual apparatus, batched by chapter so a whole chapter's pictures are designed together and share a visual grammar |
| **3c · Authoring** | Fill the 300 stubs with real parameters, real narrative, and real tolerances — chapter by chapter, each chapter shipping behind its `publish.status` flag |
| **Exit gate** | All 300 records at `status: "live"` · every validator in §3.6 green · no chapter using one apparatus more than 4 times |
| **Risk** | Authoring is the true cost, not engineering — roughly 40 hours of curriculum work per discipline. Sequence chapters by board overlap density so the highest-value 100 simulators are live before the tail is written, and ship chapters as they complete rather than holding the whole set. |

### Phase 4 — Validation & release · ~3 weeks

| | |
|---|---|
| **Correctness** | Automated: full validator sweep in CI, plus a parameter-sweep fuzz over every `balance` model asserting exactly one solution in range · Manual: subject-expert review of all 300 equations and tolerances, which no test can replace |
| **Curriculum** | Coverage audit per board — for each of the six boards, which chapters are fully covered, partly covered, and absent, published as a gap report rather than a claim of completeness |
| **Pedagogy** | Reading-level check per age band · classroom trial with real learners in each band |
| **Technical** | Cross-browser and touch-device sweep of all ~90 apparatus (the throwaway paginated sweep page pattern from the 2026-07-19 lab fix, which caught four SVG defects the build could not) · a11y audit · Core Web Vitals on chapter and simulator routes |
| **Exit gate** | Zero validator failures · expert sign-off per discipline · published per-board coverage report · no P1 defect open |
| **Risk** | Expert review is the gate that cannot be compressed, and it is the one most likely to send simulators back into Phase 3c. Start it on completed chapters during 3c rather than waiting for all 300. |

**Total: ~15.5 weeks**, with Phase 3 accounting for nearly half.

---

## 5. Load-bearing changes to existing code

Consequences of the above that touch shipped code and should be understood before
Phase 1 starts.

1. **`difficultyFor(index)` must die.** Index-derived difficulty silently re-grades
   every downstream simulator on insertion.
2. **`lib/curriculum.js` eagerly imports all four topic files and flat-maps them at
   module scope.** At 300 records that ships the entire curriculum to every route
   that touches it. Becomes a per-chapter manifest.
3. **`/missions` pre-typesets 100 KaTeX strings at build time.** Correct at 100 on
   one page; wrong at 300. Moves to per-chapter.
4. **The apparatus cap is per-subject.** Must become per-chapter or it is
   unsatisfiable at 80 physics simulators.
5. **Routes are flat (`/missions/[id]`) and IDs are position-derived.** The
   three-tier hierarchy needs three-tier URLs, and the existing SEO work needs a
   redirect map rather than a break.
6. **`subjects` in `lib/curriculum.js` hardcodes a `color` name per discipline**
   (`cyan`, `violet`, `amber`, `emerald`) from the pre-redesign palette. The
   catalogue pigments are now OKLCH values in `globals.css`. One of the two is
   redundant.

---

## 6. Open questions for the next session

1. **Does the `interactionKind` split get approved?** Everything downstream assumes
   it. The alternative is holding the equation-only rule and cutting the target to
   roughly 180 honest simulators.
2. **Does the catalogue design language propagate site-wide,** or does `/learn`
   fork from home and FAQ the way `/missions` currently does?
3. **Is per-board labelling in scope for Phase 2,** or does the catalogue stay
   board-neutral with standards shown only on the simulator page? The former is a
   real differentiator for schools and a meaningful chunk of Phase 2.
4. **Is progress persisted?** 300 simulators without state is a library; with state
   it is a course, and that decision changes whether accounts enter the picture.
