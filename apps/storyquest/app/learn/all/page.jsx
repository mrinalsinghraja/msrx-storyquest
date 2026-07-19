import MissionLobby from '../../../components/MissionLobby';
import { curriculum, subjectCatalog } from '../../../lib/curriculum';
import { toPlates } from '../../../lib/plates';

export const metadata = {
  title: 'All plates',
  description: 'Every interactive STEM simulator in one filterable catalogue, across Physics, Chemistry, Mathematics, and Biology.',
  alternates: { canonical: '/learn/all' },
};

const plates = toPlates(curriculum);

export default function AllPlatesPage() {
  return <MissionLobby plates={plates} subjects={subjectCatalog} />;
}
