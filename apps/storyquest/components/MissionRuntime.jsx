'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import CompletionCard from './CompletionCard';
import ConstructRuntime from './ConstructRuntime';
import ExploreRuntime from './ExploreRuntime';
import InteractiveGraphFrame from './InteractiveGraphFrame';
import StoryQuestShell from './StoryQuestShell';
import { createMissionStory } from '../lib/curriculum';
import { recordCompletion } from '../lib/progress';
import { useStoryEngine } from '../lib/story-engine';

/**
 * Orchestrator.
 *
 * Dispatches on `interactionKind` before any canvas is mounted, because the
 * three archetypes do not share a control surface — a construct simulator has
 * no slider to configure and an explore simulator has no solved value.
 *
 * A mission with no `interactionKind` is a legacy balance record, which is all
 * 100 of them today. That branch is the original component, untouched.
 */
export default function MissionRuntime({ mission }) {
  switch (mission.interactionKind) {
    case 'construct':
      return <ConstructRuntime mission={mission} />;
    case 'explore':
      return <ExploreRuntime mission={mission} />;
    default:
      return <BalanceRuntime mission={mission} />;
  }
}

function BalanceRuntime({ mission }) {
  const router = useRouter();
  const authored = useMemo(() => createMissionStory(mission), [mission]);
  const [story, setStory] = useState(authored);
  const [retelling, setRetelling] = useState(false);

  const engine = useStoryEngine(story);
  const pathTitles = engine.visitedPath.map((stepId) => story.steps[stepId]?.title ?? stepId);

  /**
   * Registers the completion, once, when the story reaches its ending.
   *
   * An effect here rather than a render-time call: `isComplete` is owned by
   * `useStoryEngine`, so this component cannot observe the transition into it
   * any earlier without duplicating that state.
   */
  const completed = engine.isComplete && Boolean(engine.ending);
  useEffect(() => {
    if (completed) recordCompletion(mission.id, { kind: 'balance' });
  }, [completed, mission.id]);

  /**
   * Asks the server for a freshly written telling of the same mission. The
   * equation never changes — only the scene does — so a failed or slow
   * generation costs nothing but the original story staying put.
   */
  const retell = useCallback(async () => {
    setRetelling(true);
    try {
      const response = await fetch('/api/story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ missionId: mission.id }),
      });
      if (!response.ok) return;
      const data = await response.json();
      if (data?.story) setStory(data.story);
    } catch {
      // Offline or the route is unavailable: keep the authored story.
    } finally {
      setRetelling(false);
    }
  }, [mission.id]);

  const visual = engine.isComplete || !engine.step.visual ? null : (
    <InteractiveGraphFrame
      percent={engine.percent}
      model={engine.model}
      reading={engine.reading}
      status={engine.status}
      onChange={engine.setPercent}
      labKind={engine.step.visual.lab}
      world={mission.subject}
    />
  );

  return (
    <StoryQuestShell
      visual={visual}
      paragraphs={engine.paragraphs}
      choices={engine.isComplete ? [] : engine.step.choices}
      onChoose={engine.choose}
      progress={engine.progress}
      solved={engine.status === 'success' || Boolean(engine.reading?.balanced)}
      conceptLabel={`${mission.subjectLabel} · ${mission.difficulty}`}
      missionNumber={String(mission.number).padStart(3, '0')}
      mission={mission}
      formula={mission.formula}
      onExit={() => router.push('/learn')}
    >
      {engine.isComplete && engine.ending ? (
        <CompletionCard
          ending={engine.ending}
          concept={story.concept}
          pathTitles={pathTitles}
          solved={`${engine.model.solvedValue} ${engine.model.control.unit}`.trim()}
          controlLabel={engine.model.control.label}
          retelling={retelling}
          onRetell={retell}
          onReplay={engine.restart}
          onTryAnother={() => router.push('/learn')}
        />
      ) : null}
    </StoryQuestShell>
  );
}
