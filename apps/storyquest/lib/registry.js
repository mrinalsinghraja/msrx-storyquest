/**
 * Board registry — canonical chapter → syllabus label.
 *
 * The catalogue is authored board-neutral: a chapter is called "Forces & Motion"
 * because that is what it is about, not because a particular syllabus numbers it
 * that way. This module is the lens that re-labels those canonical keys into
 * whichever syllabus the reader actually sits.
 *
 * Pure data and pure functions, no React and no browser API, so a server
 * component can pre-label a page and a client component can re-label it after
 * the reader picks a board. `components/BoardProvider.jsx` holds the selection.
 *
 * PROVENANCE: these anchors came from the Phase 1 architecture doc and are
 * indicative, not verified against current published specifications. Verifying
 * them is a Phase 1 exit gate (docs/CURRICULUM_ARCHITECTURE.md §4). Treat a
 * label here as "where this sits, roughly" until that gate passes.
 */

export const NEUTRAL_BOARD = 'neutral';

export const BOARDS = [
  { id: NEUTRAL_BOARD, label: 'Neutral', short: 'Neutral', region: '—', blurb: 'Our own chapter names, no syllabus overlay.' },
  { id: 'cbse', label: 'CBSE', short: 'CBSE', region: 'India', blurb: 'Central Board of Secondary Education.' },
  { id: 'icse', label: 'ICSE', short: 'ICSE', region: 'India', blurb: 'Indian Certificate of Secondary Education.' },
  { id: 'ngss', label: 'NGSS', short: 'NGSS', region: 'United States', blurb: 'Next Generation Science Standards.' },
  { id: 'uk', label: 'UK National Curriculum', short: 'UK', region: 'United Kingdom', blurb: 'Key Stages 1 to 4.' },
  { id: 'igcse', label: 'Cambridge IGCSE', short: 'IGCSE', region: 'International', blurb: 'Cambridge lower secondary and IGCSE.' },
  { id: 'ibmyp', label: 'IB MYP', short: 'IB', region: 'International', blurb: 'Middle Years Programme, years 1 to 5.' },
];

const BOARD_IDS = new Set(BOARDS.map((board) => board.id));

export const isBoard = (id) => BOARD_IDS.has(id);
export const boardMeta = (id) => BOARDS.find((board) => board.id === id) ?? BOARDS[0];

/**
 * Chapter → board label.
 *
 * A missing entry is meaningful: it says this chapter has no clean home in that
 * syllabus at this age range, which is a real answer and is rendered as such
 * rather than being hidden. `chemistry.rates-energetics` genuinely does not
 * appear in the UK curriculum before KS4, and pretending otherwise would be
 * worse than saying so.
 */
const REGISTRY = {
  // ---- Physics ----------------------------------------------------------
  'physics.forces-motion': {
    cbse: 'Class 9 · Ch 8–9 — Motion, Force and Laws of Motion',
    icse: 'Class 9 · Force, Work, Power and Energy',
    ngss: 'MS-PS2 — Motion and Stability',
    uk: 'KS3 · Physics — Forces',
    igcse: 'Unit 1.5–1.6 — Forces and Momentum',
    ibmyp: 'MYP 2–3 · Sciences — Systems',
  },
  'physics.energy-work': {
    cbse: 'Class 9 · Ch 11 — Work and Energy',
    icse: 'Class 10 · Work, Energy and Power',
    ngss: 'MS-PS3 — Energy',
    uk: 'KS3 · Physics — Energy',
    igcse: 'Unit 1.7 — Energy, Work and Power',
    ibmyp: 'MYP 3 · Sciences — Change',
  },
  'physics.light-optics': {
    cbse: 'Class 10 · Ch 10–11 — Light, the Human Eye',
    icse: 'Class 10 · Light — Refraction and Lenses',
    ngss: 'MS-PS4-2 — Wave Properties',
    uk: 'KS3 · Physics — Light',
    igcse: 'Unit 3.2 — Light',
    ibmyp: 'MYP 3–4 · Sciences — Relationships',
  },
  'physics.electricity-magnetism': {
    cbse: 'Class 10 · Ch 12–13 — Electricity, Magnetic Effects',
    icse: 'Class 10 · Current Electricity',
    ngss: 'MS-PS2-3 — Electric and Magnetic Forces',
    uk: 'KS3 · Physics — Electricity and Electromagnetism',
    igcse: 'Unit 4 — Electricity and Magnetism',
    ibmyp: 'MYP 4 · Sciences — Systems',
  },
  'physics.heat-thermal': {
    cbse: 'Class 7 · Ch 4 — Heat',
    icse: 'Class 8 · Heat Transfer',
    ngss: 'MS-PS3-4 — Thermal Energy',
    uk: 'KS3 · Physics — Particle Model',
    igcse: 'Unit 2.2–2.3 — Thermal Physics',
    ibmyp: 'MYP 2 · Sciences — Change',
  },
  'physics.waves-sound': {
    cbse: 'Class 9 · Ch 12 — Sound',
    icse: 'Class 9 · Sound and Vibrations',
    ngss: 'MS-PS4-1 — Wave Properties',
    uk: 'KS3 · Physics — Sound Waves',
    igcse: 'Unit 3.1 — General Properties of Waves',
    ibmyp: 'MYP 3 · Sciences — Relationships',
  },
  'physics.pressure-fluids': {
    cbse: 'Class 8 · Ch 11 — Force and Pressure',
    icse: 'Class 9 · Pressure in Fluids',
    uk: 'KS3 · Physics — Pressure',
    igcse: 'Unit 1.8 — Pressure',
    ibmyp: 'MYP 2 · Sciences — Systems',
  },
  'physics.space-gravity': {
    cbse: 'Class 9 · Ch 10 — Gravitation',
    icse: 'Class 10 · Gravitation',
    ngss: 'MS-ESS1 — Earth’s Place in the Universe',
    uk: 'KS3 · Physics — Space Physics',
    igcse: 'Unit 6 — Space Physics',
    ibmyp: 'MYP 4 · Sciences — Systems',
  },

  // ---- Chemistry --------------------------------------------------------
  'chemistry.matter-particle': {
    cbse: 'Class 9 · Ch 1 — Matter in Our Surroundings',
    icse: 'Class 8 · Matter and its Composition',
    ngss: 'MS-PS1-1 — Structure of Matter',
    uk: 'KS3 · Chemistry — Particulate Nature of Matter',
    igcse: 'Unit 1.1 — States of Matter',
    ibmyp: 'MYP 1–2 · Sciences — Systems',
  },
  'chemistry.atomic-structure': {
    cbse: 'Class 9 · Ch 4 — Structure of the Atom',
    icse: 'Class 9 · Atomic Structure and Chemical Bonding',
    ngss: 'HS-PS1-1 — Periodic Trends',
    uk: 'KS3 · Chemistry — Atoms, Elements and Compounds',
    igcse: 'Unit 2–3 — Atoms, Elements, Bonding',
    ibmyp: 'MYP 3–4 · Sciences — Relationships',
  },
  'chemistry.chemical-reactions': {
    cbse: 'Class 10 · Ch 1 — Chemical Reactions and Equations',
    icse: 'Class 9 · Chemical Changes and Reactions',
    ngss: 'MS-PS1-2 — Chemical Reactions',
    uk: 'KS3 · Chemistry — Chemical Reactions',
    igcse: 'Unit 4 — Stoichiometry',
    ibmyp: 'MYP 3 · Sciences — Change',
  },
  'chemistry.acids-bases': {
    cbse: 'Class 10 · Ch 2 — Acids, Bases and Salts',
    icse: 'Class 10 · Study of Acids, Bases and Salts',
    uk: 'KS3 · Chemistry — Acids and Alkalis',
    igcse: 'Unit 8 — Acids, Bases and Salts',
    ibmyp: 'MYP 3 · Sciences — Change',
  },
  'chemistry.mixtures-solutions': {
    cbse: 'Class 9 · Ch 2 — Is Matter Around Us Pure',
    icse: 'Class 8 · Elements, Compounds and Mixtures',
    ngss: 'MS-PS1-3 — Synthetic Materials',
    uk: 'KS2–KS3 · Chemistry — Separating Mixtures',
    igcse: 'Unit 1.2 — Mixtures and Separation',
    ibmyp: 'MYP 1–2 · Sciences — Systems',
  },
  'chemistry.rates-energetics': {
    cbse: 'Class 10 · Ch 3 — Metals and Non-metals',
    ngss: 'HS-PS1-5 — Reaction Rates',
    igcse: 'Unit 5–7 — Energetics, Rates, Electrochemistry',
    ibmyp: 'MYP 5 · Sciences — Change',
  },

  // ---- Mathematics ------------------------------------------------------
  'mathematics.number-sense': {
    cbse: 'Class 6 · Ch 1–3 — Knowing Our Numbers, Integers',
    icse: 'Class 6 · Number System',
    uk: 'KS2 · Mathematics — Number and Place Value',
    igcse: 'Unit 1 — Number',
    ibmyp: 'MYP 1 · Mathematics — Form',
  },
  'mathematics.fractions-decimals': {
    cbse: 'Class 7 · Ch 2 — Fractions and Decimals',
    icse: 'Class 6 · Fractions and Decimals',
    uk: 'KS2 · Mathematics — Fractions, Decimals, Percentages',
    igcse: 'Unit 1 — Number',
    ibmyp: 'MYP 1–2 · Mathematics — Form',
  },
  'mathematics.ratio-proportion': {
    cbse: 'Class 7 · Ch 8 — Comparing Quantities',
    icse: 'Class 7 · Ratio and Proportion',
    uk: 'KS3 · Mathematics — Ratio, Proportion and Rates',
    igcse: 'Unit 1.11 — Ratio and Proportion',
    ibmyp: 'MYP 2–3 · Mathematics — Relationships',
  },
  'mathematics.geometry-shape': {
    cbse: 'Class 9 · Ch 5–7 — Euclid, Lines, Triangles',
    icse: 'Class 9 · Rectilinear Figures, Triangles',
    uk: 'KS3 · Mathematics — Geometry and Measures',
    igcse: 'Unit 4 — Geometry',
    ibmyp: 'MYP 3–4 · Mathematics — Form',
  },
  'mathematics.measurement-mensuration': {
    cbse: 'Class 9 · Ch 12–13 — Heron’s Formula, Surface Areas',
    icse: 'Class 9 · Mensuration',
    uk: 'KS2–KS3 · Mathematics — Measurement',
    igcse: 'Unit 5 — Mensuration',
    ibmyp: 'MYP 2–3 · Mathematics — Form',
  },
  'mathematics.algebra-equations': {
    cbse: 'Class 8 · Ch 2 — Linear Equations in One Variable',
    icse: 'Class 8 · Algebraic Expressions and Equations',
    uk: 'KS3 · Mathematics — Algebra',
    igcse: 'Unit 2 — Algebra and Graphs',
    ibmyp: 'MYP 3–4 · Mathematics — Relationships',
  },
  'mathematics.coordinate-graphs': {
    cbse: 'Class 9 · Ch 3 — Coordinate Geometry',
    icse: 'Class 9 · Coordinate Geometry',
    uk: 'KS4 · Mathematics — Graphs',
    igcse: 'Unit 3 — Coordinate Geometry',
    ibmyp: 'MYP 4 · Mathematics — Relationships',
  },
  'mathematics.data-statistics': {
    cbse: 'Class 9 · Ch 14–15 — Statistics and Probability',
    icse: 'Class 9 · Statistics',
    uk: 'KS3 · Mathematics — Statistics and Probability',
    igcse: 'Unit 9 — Statistics and Probability',
    ibmyp: 'MYP 3–4 · Mathematics — Logic',
  },

  // ---- Biology ----------------------------------------------------------
  'biology.cells-microscopy': {
    cbse: 'Class 9 · Ch 5 — The Fundamental Unit of Life',
    icse: 'Class 9 · Cell — The Unit of Life',
    ngss: 'MS-LS1-1 — Structure and Function',
    uk: 'KS3 · Biology — Cells and Organisation',
    igcse: 'Unit 2 — Organisation of the Organism',
    ibmyp: 'MYP 2–3 · Sciences — Systems',
  },
  'biology.human-body': {
    cbse: 'Class 10 · Ch 6 — Life Processes',
    icse: 'Class 10 · Circulatory, Respiratory, Nervous Systems',
    ngss: 'MS-LS1-3 — Body Systems',
    uk: 'KS3 · Biology — Structure and Function of Body Systems',
    igcse: 'Unit 9, 11, 12 — Transport, Respiration, Coordination',
    ibmyp: 'MYP 3–4 · Sciences — Systems',
  },
  'biology.plants-photosynthesis': {
    cbse: 'Class 10 · Ch 6 — Life Processes (Nutrition)',
    icse: 'Class 9 · Nutrition in Plants',
    ngss: 'MS-LS1-6 — Photosynthesis',
    uk: 'KS3 · Biology — Nutrition and Digestion',
    igcse: 'Unit 6 — Plant Nutrition',
    ibmyp: 'MYP 2–3 · Sciences — Change',
  },
  'biology.ecosystems': {
    cbse: 'Class 10 · Ch 15 — Our Environment',
    icse: 'Class 9 · Ecosystems',
    ngss: 'MS-LS2 — Ecosystems: Interactions and Dynamics',
    uk: 'KS3 · Biology — Relationships in an Ecosystem',
    igcse: 'Unit 19 — Organisms and their Environment',
    ibmyp: 'MYP 3–4 · Sciences — Relationships',
  },
  'biology.genetics-evolution': {
    cbse: 'Class 10 · Ch 9 — Heredity and Evolution',
    icse: 'Class 10 · Genetics — Some Basic Fundamentals',
    ngss: 'MS-LS3 — Heredity',
    uk: 'KS4 · Biology — Inheritance and Variation',
    igcse: 'Unit 17–18 — Inheritance, Variation and Selection',
    ibmyp: 'MYP 4–5 · Sciences — Relationships',
  },
  'biology.health-disease': {
    cbse: 'Class 9 · Ch 13 — Why Do We Fall Ill',
    icse: 'Class 9 · Health and Hygiene',
    ngss: 'MS-LS1-5 — Growth of Organisms',
    uk: 'KS3 · Biology — Health',
    igcse: 'Unit 10, 21 — Diseases and Immunity',
    ibmyp: 'MYP 3 · Sciences — Systems',
  },
};

/**
 * The board's own name for a chapter, or null when that board has no clean home
 * for it. Neutral always returns null — the caller falls back to the catalogue's
 * own label, which is the point of a neutral selection.
 */
export function chapterLabelFor(chapterId, boardId) {
  if (!boardId || boardId === NEUTRAL_BOARD) return null;
  return REGISTRY[chapterId]?.[boardId] ?? null;
}

/** Every board that names this chapter, for a "also appears as" line. */
export function boardsCovering(chapterId) {
  const entry = REGISTRY[chapterId];
  if (!entry) return [];
  return BOARDS.filter((board) => board.id !== NEUTRAL_BOARD && entry[board.id]);
}

/**
 * Coverage of a board across a set of chapters.
 *
 * Reported rather than hidden: a board that covers 22 of 28 chapters should say
 * so, so a teacher can see the gap before they plan around it.
 */
export function coverageFor(boardId, chapterIds) {
  if (!boardId || boardId === NEUTRAL_BOARD) return null;
  const mapped = chapterIds.filter((id) => REGISTRY[id]?.[boardId]);
  return { mapped: mapped.length, total: chapterIds.length, missing: chapterIds.filter((id) => !REGISTRY[id]?.[boardId]) };
}
