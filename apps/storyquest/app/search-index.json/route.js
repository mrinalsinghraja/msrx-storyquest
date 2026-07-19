import { buildSearchIndex } from '../../lib/search-index';

/**
 * The search corpus, as a static asset.
 *
 * `force-static` matters: the catalogue is fixed at build time, so this is
 * prerendered into a file and served from the edge cache rather than re-derived
 * per request. The palette fetches it once, on first open, and keeps it in
 * module scope for the rest of the session.
 *
 * Shipping it this way rather than as a prop is what keeps it off the critical
 * path. Threading the index through the page tree would put ~25 kB of JSON into
 * the payload of all 246 prerendered pages, charged to every visitor whether or
 * not they ever press a key. Here it costs one cached request, paid only by
 * people who actually search.
 */
export const dynamic = 'force-static';

export function GET() {
  return Response.json(buildSearchIndex(), {
    headers: {
      // Immutable for a day, then revalidated in the background. The content
      // only changes when the catalogue does, which is a redeploy.
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    },
  });
}
