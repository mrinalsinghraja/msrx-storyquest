'use client';

import { useMemo, useState } from 'react';
import StoryQuestShell from '../StoryQuestShell';
import InteractiveGraphFrame from '../InteractiveGraphFrame';

const conceptStepSeed = [
  {
    id: 'equal-and-opposite',
    title: 'Equal and opposite forces',
    target: 50,
    prompt: 'Set the right-hand vector until the beam reaches equilibrium.',
  },
  {
    id: 'stable-system',
    title: 'Stable system',
    target: 50,
    prompt: 'A balanced system has no net turning effect around its pivot.',
  },
  {
    id: 'resultant-force',
    title: 'Resultant force',
    target: 50,
    prompt: 'Use the graph as evidence before making your final choice.',
  },
];

const initialNodes = conceptStepSeed.map((step) => ({
  id: step.id,
  vector: 50,
  status: 'neutral',
}));

const isBalanced = (vector, target) => Math.abs(vector - target) <= 4;

export default function StoryQuestIndex() {
  const [conceptSteps] = useState(conceptStepSeed);
  const [activeNodes, setActiveNodes] = useState(initialNodes);
  const [selectionStates, setSelectionStates] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [guidance, setGuidance] = useState('Use the slider to compare both vector forces.');

  const step = conceptSteps[stepIndex];
  const activeNode = activeNodes[stepIndex];
  const paragraphs = useMemo(
    () => [step.prompt, guidance],
    [guidance, step.prompt],
  );

  const updateVector = (vector) => {
    setActiveNodes((nodes) => nodes.map((node, index) => (
      index === stepIndex ? { ...node, vector, status: 'neutral' } : node
    )));
  };

  const evaluateSelection = (action) => {
    const balanced = isBalanced(activeNode.vector, step.target);
    setSelectionStates((states) => [...states, {
      stepId: step.id,
      action,
      vector: activeNode.vector,
      balanced,
    }]);

    if (!balanced) {
      setActiveNodes((nodes) => nodes.map((node, index) => (
        index === stepIndex ? { ...node, status: 'failure' } : node
      )));
      setGuidance('Academic guidance: equilibrium requires equal moments about the pivot. Adjust the vector until the two force effects balance.');
      return;
    }

    setActiveNodes((nodes) => nodes.map((node, index) => (
      index === stepIndex ? { ...node, status: 'success' } : node
    )));

    if (stepIndex < conceptSteps.length - 1) {
      setStepIndex((index) => index + 1);
      setGuidance('Correct. The next node extends the same equilibrium principle.');
      return;
    }

    setGuidance('Correct. You have completed the force-balance concept path.');
  };

  return (
    <StoryQuestShell
      visual={(
        <div className="h-full w-full p-2 sm:p-3">
          <InteractiveGraphFrame
            key={activeNode.id}
            value={activeNode.vector}
            status={activeNode.status}
            onUpdate={updateVector}
          />
        </div>
      )}
      paragraphs={paragraphs}
      onSelect={evaluateSelection}
    />
  );
}
