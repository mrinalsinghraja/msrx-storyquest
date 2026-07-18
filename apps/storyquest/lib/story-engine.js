'use client';

import { useCallback, useMemo, useState } from 'react';
import { createModel } from './models';

const clampPercent = (value) => Math.min(100, Math.max(0, Number(value) || 0));

/**
 * Length of the shortest complete route from the start to an ending.
 *
 * Used for the progress badge. A branching story has no single "total", so the
 * badge reports position against the shortest honest route rather than against
 * the raw step count, which would be misleading on a long detour.
 */
function shortestRouteLength(story) {
  const queue = [[story.startStepId, 1]];
  const seen = new Set([story.startStepId]);
  while (queue.length) {
    const [stepId, depth] = queue.shift();
    const step = story.steps[stepId];
    for (const choice of step.choices) {
      if (choice.next === null) return depth;
      if (!seen.has(choice.next)) {
        seen.add(choice.next);
        queue.push([choice.next, depth + 1]);
      }
    }
  }
  return Object.keys(story.steps).length;
}

function initialState(story) {
  const step = story.steps[story.startStepId];
  return {
    stepId: story.startStepId,
    percent: step.visual?.start ?? 50,
    status: 'neutral',
    guidance: '',
    visitedPath: [],
    isComplete: false,
    ending: null,
  };
}

export function useStoryEngine(story) {
  const model = useMemo(() => createModel(story.model), [story]);
  const [state, setState] = useState(() => initialState(story));

  // When the story is swapped (the AI retell), reset during render rather than
  // in an effect. An effect would render the new story against the old state
  // first, then immediately re-render — a visible flash and a wasted pass.
  const [renderedStory, setRenderedStory] = useState(story);
  if (renderedStory !== story) {
    setRenderedStory(story);
    setState(initialState(story));
  }

  const step = story.steps[state.stepId];
  const reading = useMemo(() => model.evaluate(state.percent), [model, state.percent]);

  const routeLength = useMemo(() => shortestRouteLength(story), [story]);
  const visitedPath = useMemo(() => (
    state.isComplete ? state.visitedPath : [...state.visitedPath, state.stepId]
  ), [state.isComplete, state.stepId, state.visitedPath]);

  const setPercent = useCallback((next) => {
    // Moving the control clears the previous blocked hint. Leaving it up while
    // the reading is already balanced reads as the app being wrong.
    setState((current) => ({ ...current, percent: clampPercent(next), status: 'neutral', guidance: '' }));
  }, []);

  const choose = useCallback((choiceId) => {
    setState((current) => {
      if (current.isComplete) return current;
      const activeStep = story.steps[current.stepId];
      const choice = activeStep.choices.find((item) => item.id === choiceId);
      if (!choice) return current;

      // The gate is decided by the equation, not by how close the slider looks.
      if (choice.requiresBalance && !model.evaluate(current.percent).balanced) {
        return { ...current, status: 'failure', guidance: choice.blockedHint };
      }

      const nextVisited = [...current.visitedPath, activeStep.id];

      if (choice.next === null) {
        return {
          ...current,
          status: 'success',
          guidance: '',
          visitedPath: nextVisited,
          isComplete: true,
          ending: activeStep.ending,
        };
      }

      const nextStep = story.steps[choice.next];
      return {
        stepId: nextStep.id,
        percent: nextStep.visual?.start ?? current.percent,
        status: 'neutral',
        guidance: '',
        visitedPath: nextVisited,
        isComplete: false,
        ending: null,
      };
    });
  }, [model, story]);

  const restart = useCallback(() => setState(initialState(story)), [story]);

  return {
    step,
    model,
    reading,
    percent: state.percent,
    status: state.status,
    guidance: state.guidance,
    paragraphs: state.guidance ? [...step.paragraphs, state.guidance] : step.paragraphs,
    progress: {
      current: Math.min(routeLength, visitedPath.length),
      total: routeLength,
    },
    isComplete: state.isComplete,
    ending: state.ending,
    visitedPath,
    setPercent,
    choose,
    restart,
  };
}
