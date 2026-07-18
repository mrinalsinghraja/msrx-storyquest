/**
 * Canonical origin for the site.
 *
 * The bare subdomain is canonical — it matches the CNAME on host `story`.
 * `www.story.msrx.co.in` should 308 here at the edge so only one URL is indexed.
 */
export const SITE_ORIGIN = 'https://story.msrx.co.in';

export const canonical = (path = '') => `${SITE_ORIGIN}${path}`;
