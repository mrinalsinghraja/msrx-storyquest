import { notFound } from 'next/navigation';
import MissionRuntime from '../../../../../components/MissionRuntime';
import { curriculum, findByPath } from '../../../../../lib/curriculum';
import { compilePredicate } from '../../../../../lib/predicate-compile';

export function generateStaticParams() {
  return curriculum.map((mission) => ({
    discipline: mission.subject,
    chapter: mission.chapterSlug,
    id: mission.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { discipline, chapter, id } = await params;
  const mission = findByPath(discipline, chapter, id);
  if (!mission) return { title: 'Simulator not found' };

  // Only a balance simulator has a scenario and a named control to describe.
  const description = mission.model?.control
    ? `Solve ${mission.title.toLowerCase()} inside ${mission.scenario}. Tune ${mission.model.control.label.toLowerCase()} until the relationship balances.`
    : mission.engine?.brief ?? mission.title;

  return {
    title: mission.title,
    description,
    alternates: { canonical: mission.path },
  };
}

/**
 * Compiles authored expressions here, on the server, at build time.
 *
 * The client receives trees, never source strings, so acorn stays out of the
 * browser bundle and the runtime needs no parser — which is what lets the
 * production CSP keep refusing 'unsafe-eval'.
 *
 * An expression that fails to compile throws during the build rather than
 * shipping a simulator nobody can finish.
 */
function prepare(mission) {
  if (mission.interactionKind === 'construct') {
    return {
      ...mission,
      engine: {
        ...mission.engine,
        validation: {
          ...mission.engine.validation,
          predicate: compilePredicate(mission.engine.validation.predicate),
        },
      },
    };
  }

  if (mission.interactionKind === 'explore') {
    // `projection` is an expression string, not a function.
    //
    // It began as `project(inputs)`, which cannot cross the server/client
    // boundary — React refuses to serialise a function into a client component,
    // and the failure is a runtime error on the page rather than a build error.
    // Compiling it to a tree makes it plain JSON and reuses the same
    // interpreter the predicates run through.
    return {
      ...mission,
      engine: {
        ...mission.engine,
        projection: compilePredicate(mission.engine.projection),
      },
    };
  }

  return mission;
}

export default async function SimulatorPage({ params }) {
  const { discipline, chapter, id } = await params;
  const mission = findByPath(discipline, chapter, id);
  if (!mission) notFound();
  return <MissionRuntime mission={prepare(mission)} />;
}
