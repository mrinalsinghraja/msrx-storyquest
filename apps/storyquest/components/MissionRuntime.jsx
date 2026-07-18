'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import CompletionCard from './CompletionCard';
import InteractiveGraphFrame from './InteractiveGraphFrame';
import StoryQuestShell from './StoryQuestShell';
import { createMissionStory } from '../lib/curriculum';
import { useStoryEngine } from '../lib/story-engine';

export default function MissionRuntime({ mission }) {
  const router = useRouter();
  const authored = useMemo(() => createMissionStory(mission), [mission]);
  const [story, setStory] = useState(authored);
  const [retelling, setRetelling] = useState(false);

  const engine = useStoryEngine(story);
  const pathTitles = engine.visitedPath.map((stepId) => story.steps[stepId]?.title ?? stepId);

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
    />
  );

  return (
    <StoryQuestShell
      visual={visual}
      paragraphs={engine.paragraphs}
      choices={engine.isComplete ? [] : engine.step.choices}
      onChoose={engine.choose}
      progress={engine.progress}
      conceptLabel={`${mission.subjectLabel} · ${mission.difficulty}`}
      missionNumber={String(mission.number).padStart(3, '0')}
      formula={mission.formula}
      onExit={() => router.push('/missions')}
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
          onTryAnother={() => router.push('/missions')}
        />
      ) : null}
    </StoryQuestShell>
  );
}
