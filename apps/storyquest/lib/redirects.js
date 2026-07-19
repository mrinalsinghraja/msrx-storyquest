import { curriculum } from './curriculum';

/**
 * Legacy URL resolution.
 *
 * Every mission used to live at a flat `/missions/<id>`, where `<id>` was
 * derived from the topic's position in its subject array (`physics-01`) and the
 * catalogue displayed it as a plate number (`M001`). Both are position-derived,
 * which is exactly why they could not survive the move to a three-tier tree.
 *
 * Those URLs are indexed, sitemapped, and linked from the MSRX portal, so they
 * resolve rather than 404. Four spellings are accepted because all four exist in
 * the wild:
 *
 *   /missions/physics-01      the real id, used by the app and the sitemap
 *   /missions/M001            the plate number, used in copy and screenshots
 *   /missions/m001            the same, lowercased by a mail client or a CMS
 *   /missions/torque-balance  the bare slug, guessable and worth honouring
 *
 * A note on the status code: Next's `permanentRedirect` emits 308, not 301. Both
 * are permanent and Google treats them identically for canonicalisation; 308 also
 * preserves the request method. A literal 301 would mean declaring the map in
 * `next.config.js`, which is CommonJS and cannot import this module — `lib/`
 * uses extensionless relative imports that only webpack resolves.
 */

/** Built once at module scope: the route handler is called per mission. */
const byLegacyKey = new Map();

for (const mission of curriculum) {
  const plate = `m${String(mission.number).padStart(3, '0')}`;
  byLegacyKey.set(mission.id, mission);
  byLegacyKey.set(plate, mission);
  // Slugs are unique across the catalogue today. If that ever stops being true
  // the first one wins, which is why the id and the plate number are checked
  // first — those are the two forms that were actually published.
  if (!byLegacyKey.has(mission.slug)) byLegacyKey.set(mission.slug, mission);
}

/**
 * Resolves a legacy mission identifier to its nested path.
 * Returns null when nothing matches, so the caller can 404 rather than guess.
 */
export function resolveLegacyMission(identifier) {
  if (typeof identifier !== 'string') return null;
  const mission = byLegacyKey.get(identifier.trim().toLowerCase());
  return mission ? mission.path : null;
}

/**
 * The full legacy → canonical map.
 *
 * Only the published `id` form is emitted. The plate-number and bare-slug
 * spellings are handled at request time and deliberately left out: listing them
 * would treble the map for URLs that were never in the sitemap to begin with.
 */
export function legacyMissionRedirects() {
  return curriculum.map((mission) => ({
    source: `/missions/${mission.id}`,
    destination: mission.path,
  }));
}

/** Static legacy paths with no data dependency. */
export const LEGACY_PATHS = {
  '/missions': '/learn',
};
