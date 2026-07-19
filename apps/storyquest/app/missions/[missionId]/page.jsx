import { notFound, permanentRedirect } from 'next/navigation';
import { curriculum } from '../../../lib/curriculum';
import { resolveLegacyMission } from '../../../lib/redirects';

/**
 * Legacy flat mission URLs.
 *
 * Only the published `physics-01` form is prerendered — those are the 100 URLs
 * that were in the sitemap. The plate-number (`M001`) and bare-slug spellings
 * still resolve, on demand, through `resolveLegacyMission`.
 */
export function generateStaticParams() {
  return curriculum.map((mission) => ({ missionId: mission.id }));
}

export default async function LegacyMissionRedirect({ params }) {
  const { missionId } = await params;
  const destination = resolveLegacyMission(missionId);
  if (!destination) notFound();
  permanentRedirect(destination);
}
