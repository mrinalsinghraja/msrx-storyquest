import { permanentRedirect } from 'next/navigation';
import { LEGACY_PATHS } from '../../lib/redirects';

/**
 * The flat catalogue moved to `/learn` when the curriculum grew a three-tier
 * tree. This URL is indexed and linked from the MSRX portal, so it redirects
 * rather than 404s.
 */
export default function MissionsIndexRedirect() {
  permanentRedirect(LEGACY_PATHS['/missions']);
}
