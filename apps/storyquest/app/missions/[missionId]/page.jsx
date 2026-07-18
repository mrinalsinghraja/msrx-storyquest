import { notFound } from 'next/navigation';
import MissionRuntime from '../../../components/MissionRuntime';
import { curriculum } from '../../../lib/curriculum';

export function generateStaticParams() {
  return curriculum.map((mission) => ({ missionId: mission.id }));
}

export async function generateMetadata({ params }) {
  const { missionId } = await params;
  const mission = curriculum.find((item) => item.id === missionId);
  if (!mission) return { title: 'Mission not found' };
  return {
    title: mission.title,
    description: `Solve ${mission.title.toLowerCase()} inside ${mission.scenario}. Tune ${mission.model.control.label.toLowerCase()} until the relationship balances.`,
  };
}

export default async function MissionPage({ params }) {
  const { missionId } = await params;
  const mission = curriculum.find((item) => item.id === missionId);
  if (!mission) notFound();
  return <MissionRuntime mission={mission} />;
}
