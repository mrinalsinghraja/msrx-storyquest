import MissionLobby from '../../components/MissionLobby';
import { curriculum, subjectCatalog } from '../../lib/curriculum';

export const metadata = { title: 'Mission Library', description: 'Browse 100 interactive STEM missions across Physics, Chemistry, Mathematics, and Biology.' };

export default function MissionsPage() {
  return <MissionLobby curriculum={curriculum} subjects={subjectCatalog} />;
}
