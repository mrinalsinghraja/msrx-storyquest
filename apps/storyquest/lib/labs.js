/**
 * Display names for each visual lab. Shared by the lobby and the lab frame.
 *
 * A lab is a *visual apparatus*, not a subject. Two missions share a lab only
 * when the same picture honestly explains both — `hydraulic` genuinely suits
 * both "pressure systems" and "hydraulic lifts", because both are force over
 * area on a piston. When no existing apparatus fits a concept, add one here
 * rather than reusing the nearest neighbour: an earlier build assigned eight
 * different physics topics to `lever`, so every Foundation physics mission
 * rendered a torque rig no matter what its equation was about.
 */
export const LABS = {
  // Physics
  lever: { title: 'Torque rig', unit: 'position' },
  friction: { title: 'Friction sled', unit: 'force' },
  force: { title: 'Force cart', unit: 'thrust' },
  collision: { title: 'Collision track', unit: 'speed' },
  energy: { title: 'Energy ledger', unit: 'energy' },
  projectile: { title: 'Launch arc', unit: 'speed' },
  orbit: { title: 'Orbital ring', unit: 'radius' },
  hydraulic: { title: 'Piston bench', unit: 'pressure' },
  thermal: { title: 'Heat bridge', unit: 'temperature' },
  circuit: { title: 'Current splitter', unit: 'current' },
  magnet: { title: 'Field coil', unit: 'field' },
  lens: { title: 'Optics bench', unit: 'focus' },
  mirror: { title: 'Reflection deck', unit: 'angle' },
  wave: { title: 'Wave console', unit: 'frequency' },

  // Chemistry
  particle: { title: 'Particle chamber', unit: 'energy' },
  gas: { title: 'Gas cylinder', unit: 'volume' },
  reaction: { title: 'Reaction vessel', unit: 'energy' },
  ph: { title: 'pH stabilizer', unit: 'neutraliser' },
  atom: { title: 'Atom builder', unit: 'electrons' },
  bond: { title: 'Bonding bench', unit: 'bonds' },
  solution: { title: 'Solution beaker', unit: 'concentration' },
  redox: { title: 'Electron transfer cell', unit: 'electrons' },
  chromatography: { title: 'Separation strip', unit: 'distance' },

  // Mathematics
  ratio: { title: 'Bridge scaler', unit: 'scale' },
  fraction: { title: 'Fraction wheel', unit: 'share' },
  coordinate: { title: 'Coordinate navigator', unit: 'gradient' },
  geometry: { title: 'Angle lock', unit: 'angle' },
  triangle: { title: 'Right-triangle rig', unit: 'length' },
  circle: { title: 'Circle gauge', unit: 'radius' },
  area: { title: 'Area planner', unit: 'area' },
  volume: { title: 'Volume block', unit: 'volume' },
  numberline: { title: 'Number line', unit: 'offset' },
  balance: { title: 'Equation balance', unit: 'terms' },
  sequence: { title: 'Sequence steps', unit: 'step' },
  probability: { title: 'Chance spinner', unit: 'odds' },
  data: { title: 'Data balancing board', unit: 'data point' },

  // Biology
  cell: { title: 'Cell defense grid', unit: 'response' },
  osmosis: { title: 'Osmosis chamber', unit: 'concentration' },
  mitosis: { title: 'Division timeline', unit: 'time' },
  dna: { title: 'DNA transcriber', unit: 'codons' },
  mitochondria: { title: 'Mitochondrial furnace', unit: 'output' },
  leaf: { title: 'Leaf canopy', unit: 'light' },
  ecosystem: { title: 'Ecosystem web', unit: 'support' },
  biodiversity: { title: 'Species board', unit: 'species' },
  watercycle: { title: 'Water cycle loop', unit: 'water' },
  lungs: { title: 'Pulmonary monitor', unit: 'volume' },
  heart: { title: 'Circulation loop', unit: 'flow' },
  neuron: { title: 'Nerve relay', unit: 'signal' },
  digestion: { title: 'Digestive tract', unit: 'intake' },
};

export const labTitle = (kind) => LABS[kind]?.title ?? LABS.lever.title;
