/** Display names for each visual lab. Shared by the lobby and the lab frame. */
export const LABS = {
  lever: { title: 'Torque rig', unit: 'position' },
  circuit: { title: 'Current splitter', unit: 'current' },
  lens: { title: 'Optics bench', unit: 'focus' },
  wave: { title: 'Wave console', unit: 'frequency' },
  particle: { title: 'Particle chamber', unit: 'energy' },
  reaction: { title: 'Reaction vessel', unit: 'energy' },
  ph: { title: 'pH stabilizer', unit: 'neutraliser' },
  atom: { title: 'Atom builder', unit: 'electrons' },
  ratio: { title: 'Bridge scaler', unit: 'scale' },
  coordinate: { title: 'Coordinate navigator', unit: 'gradient' },
  geometry: { title: 'Angle lock', unit: 'angle' },
  data: { title: 'Data balancing board', unit: 'data point' },
  cell: { title: 'Cell defense grid', unit: 'response' },
  ecosystem: { title: 'Ecosystem web', unit: 'support' },
  lungs: { title: 'Pulmonary monitor', unit: 'volume' },
  osmosis: { title: 'Osmosis chamber', unit: 'concentration' },
};

export const labTitle = (kind) => LABS[kind]?.title ?? LABS.lever.title;
