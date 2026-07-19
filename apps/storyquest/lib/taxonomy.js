/**
 * Level 1 (discipline) and Level 2 (chapter) of the curriculum tree.
 *
 * Level 3 — the simulators themselves — lives in `lib/topics/*`, where each
 * topic carries an explicit `chapterId` pointing back here. The tree is data,
 * not derivation: an earlier build inferred a topic's difficulty from its index
 * inside its subject array, which meant inserting one topic silently re-graded
 * every topic after it.
 */

export const DISCIPLINES = {
  physics: {
    label: 'Physics',
    glyph: '⚛',
    blurb: 'Forces, energy, light, circuits, and the rules the world runs on.',
  },
  chemistry: {
    label: 'Chemistry',
    glyph: '🧪',
    blurb: 'Particles, atoms, reactions, and what matter does under pressure.',
  },
  mathematics: {
    label: 'Mathematics',
    glyph: '⌗',
    blurb: 'Ratio, shape, coordinate, and the arithmetic of real situations.',
  },
  biology: {
    label: 'Biology',
    glyph: '🧬',
    blurb: 'Cells, bodies, ecosystems, and the systems that keep them running.',
  },
};

/**
 * Chapters, keyed by the `chapterId` each topic stores.
 *
 * `ordinal` fixes catalogue order independently of how many topics a chapter
 * currently holds, so an empty or thin chapter still sits in its teaching
 * sequence rather than sorting to the end.
 */
export const CHAPTERS = {
  // Physics
  'physics.forces-motion': { discipline: 'physics', ordinal: 1, label: 'Forces & Motion', blurb: 'What makes things start, stop, turn, and stay put.' },
  'physics.energy-work': { discipline: 'physics', ordinal: 2, label: 'Energy, Work & Power', blurb: 'Where energy goes when it stops being one thing and becomes another.' },
  'physics.light-optics': { discipline: 'physics', ordinal: 3, label: 'Light & Optics', blurb: 'Bending, bouncing, and focusing a beam you can aim.' },
  'physics.electricity-magnetism': { discipline: 'physics', ordinal: 4, label: 'Electricity & Magnetism', blurb: 'Current, voltage, and the fields they drag along with them.' },
  'physics.heat-thermal': { discipline: 'physics', ordinal: 5, label: 'Heat & Thermal Physics', blurb: 'Energy moving down a temperature difference.' },
  'physics.waves-sound': { discipline: 'physics', ordinal: 6, label: 'Waves & Sound', blurb: 'Frequency, wavelength, and what travels without the medium travelling.' },
  'physics.pressure-fluids': { discipline: 'physics', ordinal: 7, label: 'Pressure & Fluids', blurb: 'Force spread over an area, and what that buys you.' },
  'physics.space-gravity': { discipline: 'physics', ordinal: 8, label: 'Space, Gravity & Earth Systems', blurb: 'The one force that never pushes.' },

  // Chemistry
  'chemistry.matter-particle': { discipline: 'chemistry', ordinal: 1, label: 'Matter & the Particle Model', blurb: 'Everything solid, liquid, and gas, explained by what the particles are doing.' },
  'chemistry.atomic-structure': { discipline: 'chemistry', ordinal: 2, label: 'Atomic Structure & Bonding', blurb: 'Shells, valency, and why atoms stick to each other at all.' },
  'chemistry.chemical-reactions': { discipline: 'chemistry', ordinal: 3, label: 'Chemical Reactions & Equations', blurb: 'Atoms rearranged, never created or destroyed.' },
  'chemistry.acids-bases': { discipline: 'chemistry', ordinal: 4, label: 'Acids, Bases & Salts', blurb: 'The logarithmic scale that trips everyone up once.' },
  'chemistry.mixtures-solutions': { discipline: 'chemistry', ordinal: 5, label: 'Mixtures, Solutions & Separation', blurb: 'Getting things into a liquid, and getting them back out.' },
  'chemistry.rates-energetics': { discipline: 'chemistry', ordinal: 6, label: 'Rates, Energetics & Electrochemistry', blurb: 'How fast, how hot, and which way the electrons went.' },

  // Mathematics
  'mathematics.number-sense': { discipline: 'mathematics', ordinal: 1, label: 'Number Sense & Patterns', blurb: 'The number line, in both directions, with a rule behind it.' },
  'mathematics.fractions-decimals': { discipline: 'mathematics', ordinal: 2, label: 'Fractions, Decimals & Percentage', blurb: 'Three notations for one idea.' },
  'mathematics.ratio-proportion': { discipline: 'mathematics', ordinal: 3, label: 'Ratio, Proportion & Scale', blurb: 'When two quantities have to move together.' },
  'mathematics.geometry-shape': { discipline: 'mathematics', ordinal: 4, label: 'Geometry, Shape & Symmetry', blurb: 'Angles, triangles, and the transformations that leave a shape itself.' },
  'mathematics.measurement-mensuration': { discipline: 'mathematics', ordinal: 5, label: 'Measurement & Mensuration', blurb: 'Length, area, and volume, and how differently they scale.' },
  'mathematics.algebra-equations': { discipline: 'mathematics', ordinal: 6, label: 'Algebra & Equations', blurb: 'A balance you keep level by doing the same thing to both sides.' },
  'mathematics.coordinate-graphs': { discipline: 'mathematics', ordinal: 7, label: 'Coordinate Geometry & Graphs', blurb: 'Turning a relationship into a picture you can read off.' },
  'mathematics.data-statistics': { discipline: 'mathematics', ordinal: 8, label: 'Data, Statistics & Probability', blurb: 'Summarising a pile of numbers without lying about it.' },

  // Biology
  'biology.cells-microscopy': { discipline: 'biology', ordinal: 1, label: 'Cells & Organisation', blurb: 'The smallest thing that counts as alive.' },
  'biology.human-body': { discipline: 'biology', ordinal: 2, label: 'Human Body Systems', blurb: 'Lungs, heart, nerves, gut — the plumbing and the wiring.' },
  'biology.plants-photosynthesis': { discipline: 'biology', ordinal: 3, label: 'Plants & Photosynthesis', blurb: 'The reaction the rest of the food chain is standing on.' },
  'biology.ecosystems': { discipline: 'biology', ordinal: 4, label: 'Ecosystems & Energy Flow', blurb: 'Populations pushing on each other until something settles.' },
  'biology.genetics-evolution': { discipline: 'biology', ordinal: 5, label: 'Genetics & Heredity', blurb: 'Instructions copied, read, and occasionally mistyped.' },
  'biology.health-disease': { discipline: 'biology', ordinal: 6, label: 'Health, Disease & Microbes', blurb: 'What goes wrong, and what the body does about it.' },
};

/** `physics.forces-motion` → `forces-motion`, the URL segment. */
export const chapterSlug = (chapterId) => chapterId.split('.')[1];

/** `physics` + `forces-motion` → `physics.forces-motion`. */
export const chapterIdFrom = (discipline, slug) => `${discipline}.${slug}`;

export const chaptersFor = (discipline) => (
  Object.entries(CHAPTERS)
    .filter(([, chapter]) => chapter.discipline === discipline)
    .sort(([, a], [, b]) => a.ordinal - b.ordinal)
    .map(([id, chapter]) => ({ id, slug: chapterSlug(id), ...chapter }))
);

export const disciplineList = () => (
  Object.entries(DISCIPLINES).map(([id, discipline]) => ({ id, ...discipline }))
);
