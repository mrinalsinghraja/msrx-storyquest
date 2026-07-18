import React, { useMemo, useState } from 'react';

const clamp = (number, minimum, maximum) => Math.min(Math.max(number, minimum), maximum);

export default function InteractiveGraphFrame({
  value = 50,
  status = 'neutral',
  onUpdate,
}) {
  const [localValue, setLocalValue] = useState(clamp(value, 0, 100));
  const force = useMemo(() => clamp(localValue, 0, 100), [localValue]);
  const isBalanced = Math.abs(force - 50) <= 4;
  const activeStatus = status === 'neutral' ? (isBalanced ? 'success' : 'neutral') : status;
  const palette = {
    neutral: { vector: '#22d3ee', glow: 'rgba(34,211,238,0.16)', label: 'Adjust force' },
    success: { vector: '#22d3ee', glow: 'rgba(34,211,238,0.28)', label: 'Balanced' },
    failure: { vector: '#a78bfa', glow: 'rgba(167,139,250,0.22)', label: 'Unbalanced' },
  }[activeStatus] ?? {
    vector: '#22d3ee',
    glow: 'rgba(34,211,238,0.16)',
    label: 'Adjust force',
  };

  const setForce = (nextValue) => {
    const nextForce = clamp(Number(nextValue), 0, 100);
    setLocalValue(nextForce);
    onUpdate?.(nextForce);
  };

  const leftWeight = 100 - force;
  const rightWeight = force;
  const beamAngle = (force - 50) * 0.22;

  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-900">
      <svg
        viewBox="0 0 640 360"
        className="h-full w-full select-none"
        role="img"
        aria-labelledby="force-graph-title force-graph-description"
      >
        <title id="force-graph-title">Interactive force balance</title>
        <desc id="force-graph-description">A beam responds to the force control below.</desc>
        <defs>
          <pattern id="force-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#334155" strokeWidth="1" opacity="0.55" />
          </pattern>
          <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L7,3 z" fill={palette.vector} />
          </marker>
        </defs>

        <rect width="640" height="360" fill="url(#force-grid)" />
        <line x1="48" x2="592" y1="292" y2="292" stroke="#475569" strokeWidth="2" />
        <text x="48" y="324" fill="#94a3b8" fontSize="12" letterSpacing="1.2">
          UNIVERSAL FORCE LAB
        </text>

        <path d="M320 250 L286 292 H354 Z" fill="#a78bfa" opacity="0.9" />
        <g transform={`rotate(${beamAngle} 320 236)`}>
          <rect x="112" y="228" width="416" height="16" rx="8" fill="#334155" />
          <rect x="112" y="228" width="416" height="5" rx="2.5" fill="#475569" />
          <rect x="174" y={176 - leftWeight * 0.18} width="72" height={leftWeight * 0.18 + 42} rx="7" fill="#a78bfa" />
          <rect x="394" y={176 - rightWeight * 0.18} width="72" height={rightWeight * 0.18 + 42} rx="7" fill="#22d3ee" />
          <line
            x1="210"
            y1={160 - leftWeight * 0.18}
            x2="210"
            y2="218"
            stroke="#a78bfa"
            strokeWidth="5"
            markerEnd="url(#arrowhead)"
          />
          <line
            x1="430"
            y1={160 - rightWeight * 0.18}
            x2="430"
            y2="218"
            stroke={palette.vector}
            strokeWidth="5"
            markerEnd="url(#arrowhead)"
          />
        </g>

        <circle cx="320" cy="236" r="15" fill="#0f172a" stroke={palette.vector} strokeWidth="3" />
        <circle cx="320" cy="236" r="5" fill={palette.vector} />
        <rect x="255" y="52" width="130" height="34" rx="17" fill={palette.glow} stroke={palette.vector} />
        <text x="320" y="74" textAnchor="middle" fill="#e2e8f0" fontSize="14" fontWeight="700">
          {palette.label}
        </text>
      </svg>

      <div className="absolute inset-x-0 bottom-0 border-t border-slate-700/80 bg-slate-950/85 px-4 py-3 backdrop-blur-sm">
        <label htmlFor="force-control" className="mb-2 flex items-center justify-between text-xs font-semibold tracking-wide text-slate-300">
          <span>RIGHT VECTOR</span>
          <output className="text-cyan-400">{force}%</output>
        </label>
        <input
          id="force-control"
          aria-label="Set right vector force"
          type="range"
          min="0"
          max="100"
          value={force}
          onChange={(event) => setForce(event.target.value)}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-800 accent-cyan-400"
        />
      </div>
    </div>
  );
}
