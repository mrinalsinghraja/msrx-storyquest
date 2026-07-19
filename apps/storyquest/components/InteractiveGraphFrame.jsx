'use client';

import { useId } from 'react';
import { LABS } from '../lib/labs';

const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const point = (angle, radius, cx = 320, cy = 174) => `${cx + Math.cos(angle) * radius},${cy + Math.sin(angle) * radius}`;

function LabHeader({ label, status, accent, glow }) {
  return (
    <g>
      <rect x="42" y="28" width="556" height="38" rx="12" fill="#f5f5f7" stroke="rgba(0,0,0,0.08)" />
      <circle cx="64" cy="47" r="5" fill={accent} />
      <text x="78" y="51" fill="#6e6e73" fontSize="12" fontWeight="700" letterSpacing="1.4">{label.toUpperCase()}</text>
      <rect x="449" y="35" width="127" height="24" rx="12" fill={glow} stroke={accent} />
      <text x="512" y="51" fill="#1d1d1f" fontSize="11" fontWeight="700" textAnchor="middle">{status}</text>
    </g>
  );
}

function LeverLab({ value, target, accent, arrowId, leftLabel, rightLabel, controlText, leftText }) {
  const rotation = clamp((value - target) * 0.28, -14, 14);
  const leftHeight = 46 + (100 - value) * 0.55;
  const rightHeight = 46 + value * 0.55;
  return (
    <>
      <line x1="72" y1="286" x2="568" y2="286" stroke="#c7c7cc" strokeWidth="2" />
      <g transform={`rotate(${rotation} 320 218)`}>
        <rect x="102" y="210" width="436" height="16" rx="8" fill="#d1d1d6" />
        <rect x="102" y="210" width="436" height="5" rx="2.5" fill="#e5e5ea" />
        <rect x="168" y={210 - leftHeight} width="76" height={leftHeight} rx="10" fill="#8b5cf6" />
        <rect x="396" y={210 - rightHeight} width="76" height={rightHeight} rx="10" fill={accent} />
        <line x1="206" y1={192 - leftHeight} x2="206" y2="199" stroke="#8b5cf6" strokeWidth="4" markerEnd={`url(#${arrowId})`} />
        <line x1="434" y1={192 - rightHeight} x2="434" y2="199" stroke={accent} strokeWidth="4" markerEnd={`url(#${arrowId})`} />
      </g>
      <path d="M320 232L286 286H354Z" fill="#8b5cf6" />
      <circle cx="320" cy="218" r="17" fill="#ffffff" stroke={accent} strokeWidth="3" />
      <circle cx="320" cy="218" r="5" fill={accent} />
      <text x="206" y="258" fill="#6e6e73" fontSize="10" fontWeight="700" textAnchor="middle">{leftLabel}</text>
      <text x="434" y="258" fill="#6e6e73" fontSize="10" fontWeight="700" textAnchor="middle">{rightLabel}</text>
    </>
  );
}

function CircuitLab({ value, target, accent, arrowId, leftLabel, rightLabel, controlText, leftText }) {
  const split = clamp(value / 100, 0.14, 0.86);
  const currentY = 135 + split * 74;
  return (
    <>
      <rect x="104" y="112" width="70" height="126" rx="14" fill="#eff6ff" stroke={accent} strokeWidth="2" />
      <line x1="139" y1="133" x2="139" y2="164" stroke="#1d1d1f" strokeWidth="4" />
      <line x1="125" y1="149" x2="153" y2="149" stroke="#1d1d1f" strokeWidth="4" />
      <line x1="139" y1="188" x2="139" y2="215" stroke="#1d1d1f" strokeWidth="4" />
      <path d="M174 149H252V104H488V248H252V202H174" fill="none" stroke="#c7c7cc" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M174 ${currentY}H286V162H488`} fill="none" stroke={accent} strokeWidth="5" strokeLinecap="round" markerEnd={`url(#${arrowId})`} />
      <path d="M252 104V248" fill="none" stroke="#8b5cf6" strokeWidth="5" strokeLinecap="round" />
      {[104, 162, 248].map((y, index) => <circle key={y} cx={488} cy={y} r="17" fill={index === 1 ? accent : '#f5f5f7'} stroke={index === 1 ? accent : '#a1a1a6'} strokeWidth="3" />)}
      <text x="139" y="260" fill="#6e6e73" fontSize="10" fontWeight="700" textAnchor="middle">SOURCE</text>
      <text x="280" y="95" fill="#6e6e73" fontSize="10" fontWeight="700">{leftLabel}</text>
      <text x="502" y="280" fill="#6e6e73" fontSize="10" fontWeight="700" textAnchor="end">{rightLabel}</text>
      <text x="320" y="284" fill={accent} fontSize="14" fontWeight="700" textAnchor="middle">{controlText}</text>
    </>
  );
}

function LensLab({ value, target, accent, arrowId, controlText, leftText }) {
  const focusX = 326 + (value - target) * 1.45;
  return (
    <>
      <line x1="70" y1="248" x2="570" y2="248" stroke="#a1a1a6" strokeWidth="2" />
      <line x1="190" y1="248" x2="190" y2="126" stroke="#8b5cf6" strokeWidth="6" markerEnd={`url(#${arrowId})`} />
      <path d="M320 96C282 137 282 211 320 252C358 211 358 137 320 96Z" fill="#cffafe" fillOpacity="0.55" stroke={accent} strokeWidth="3" />
      <line x1="190" y1="126" x2="320" y2="154" stroke="#8b5cf6" strokeWidth="3" />
      <line x1="320" y1="154" x2="540" y2={focusX > 320 ? 235 : 112} stroke={accent} strokeWidth="3" />
      <line x1="190" y1="126" x2="320" y2="126" stroke="#8b5cf6" strokeWidth="3" />
      <line x1="320" y1="126" x2="540" y2={focusX > 320 ? 258 : 102} stroke={accent} strokeWidth="3" />
      <line x1={focusX} y1="92" x2={focusX} y2="266" stroke={accent} strokeWidth="2" strokeDasharray="5 5" />
      <circle cx={focusX} cy="248" r="7" fill={accent} />
      <text x="190" y="276" fill="#6e6e73" fontSize="10" fontWeight="700" textAnchor="middle">OBJECT</text>
      <text x="320" y="82" fill="#6e6e73" fontSize="10" fontWeight="700" textAnchor="middle">CONVEX LENS</text>
      <text x={focusX} y="280" fill={accent} fontSize="10" fontWeight="700" textAnchor="middle">FOCAL PLANE</text>
    </>
  );
}

function WaveLab({ value, target, accent, controlText, leftText }) {
  const cycles = 1.5 + value / 23;
  const amplitude = 30 + Math.abs(value - target) * 0.62;
  const path = Array.from({ length: 81 }, (_, index) => {
    const x = 74 + index * 6.15;
    const y = 182 - Math.sin((index / 80) * Math.PI * 2 * cycles) * amplitude;
    return `${index ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');
  return (
    <>
      {[112, 182, 252].map((y) => <line key={y} x1="70" y1={y} x2="570" y2={y} stroke="#d1d1d6" strokeDasharray="4 7" />)}
      <path d={path} fill="none" stroke={accent} strokeWidth="5" strokeLinecap="round" />
      <circle cx="74" cy="182" r="11" fill="#8b5cf6" />
      <circle cx="566" cy="182" r="11" fill={accent} />
      <path d="M118 286H522" stroke="#c7c7cc" strokeWidth="2" />
      <path d={`M118 286H${118 + (value / 100) * 404}`} stroke={accent} strokeWidth="5" strokeLinecap="round" />
      <text x="74" y="307" fill="#6e6e73" fontSize="10" fontWeight="700">SOURCE</text>
      <text x="566" y="307" fill="#6e6e73" fontSize="10" fontWeight="700" textAnchor="end">RESONANCE</text>
      <text x="320" y="112" fill={accent} fontSize="18" fontWeight="700" textAnchor="middle">{controlText}</text>
    </>
  );
}

function ParticleLab({ value, accent, controlText, leftText }) {
  const dots = Array.from({ length: 18 }, (_, index) => ({
    x: 155 + ((index * 71) % 310),
    y: 112 + ((index * 47) % 132),
    r: 4 + ((index + Math.round(value)) % 3),
  }));
  return (
    <>
      <rect x="118" y="92" width="404" height="174" rx="22" fill="#ffffff" stroke="#a1a1a6" strokeWidth="3" />
      <rect x="137" y="111" width="366" height="136" rx="14" fill="#eff6ff" fillOpacity="0.55" />
      {dots.map((dot, index) => <circle key={index} cx={dot.x} cy={dot.y} r={dot.r} fill={index % 2 ? accent : '#8b5cf6'} opacity="0.9" />)}
      <path d="M150 284H490" stroke="#d1d1d6" strokeWidth="8" strokeLinecap="round" />
      <path d={`M150 284H${150 + value * 3.4}`} stroke={accent} strokeWidth="8" strokeLinecap="round" />
      <text x="320" y="76" fill="#6e6e73" fontSize="11" fontWeight="700" textAnchor="middle">SEALED PARTICLE CHAMBER</text>
      <text x="320" y="314" fill={accent} fontSize="15" fontWeight="700" textAnchor="middle">{controlText}</text>
    </>
  );
}

function ReactionLab({ value, target, accent, arrowId, controlText, leftText }) {
  const peak = 118 - (value / 100) * 38;
  return (
    <>
      <path d={`M96 258H202C236 258 244 ${peak} 320 ${peak}C396 ${peak} 404 258 538 258`} fill="none" stroke={accent} strokeWidth="5" />
      <line x1="96" y1="258" x2="538" y2="258" stroke="#c7c7cc" strokeWidth="2" />
      <line x1="320" y1="258" x2="320" y2={peak} stroke="#8b5cf6" strokeWidth="3" strokeDasharray="5 5" markerEnd={`url(#${arrowId})`} />
      {[{ x: 144, y: 186, color: '#8b5cf6' }, { x: 184, y: 206, color: accent }, { x: 458, y: 186, color: accent }, { x: 498, y: 206, color: '#8b5cf6' }].map((molecule, index) => <g key={index}><circle cx={molecule.x} cy={molecule.y} r="18" fill={molecule.color} /><circle cx={molecule.x + 21} cy={molecule.y + 11} r="12" fill={molecule.color} opacity="0.75" /></g>)}
      <text x="165" y="302" fill="#6e6e73" fontSize="11" fontWeight="700" textAnchor="middle">REACTANTS</text>
      <text x="475" y="302" fill="#6e6e73" fontSize="11" fontWeight="700" textAnchor="middle">PRODUCTS</text>
      <text x="320" y={peak - 12} fill={accent} fontSize="11" fontWeight="700" textAnchor="middle">ACTIVATION PATH</text>
      {/* Sits below the curve: the activation label rides the peak, so a fixed
          readout near the top collides with it at mid-range values. */}
      <text x="320" y="332" fill={Math.abs(value - target) <= 4 ? accent : '#6e6e73'} fontSize="16" fontWeight="700" textAnchor="middle">{controlText}</text>
    </>
  );
}

function PhLab({ value, accent, gradientId, controlText, leftText, leftValue }) {
  const ph = Math.min(14, Math.max(0, Number(leftValue) || 0));
  const hue = 275 - (ph / 14) * 155;
  const dropX = 92 + (ph / 14) * 456;
  return (
    <>
      <defs><linearGradient id={gradientId} x1="0" x2="1"><stop stopColor="#ec4899" /><stop offset="0.5" stopColor="#00c4df" /><stop offset="1" stopColor="#65a30d" /></linearGradient></defs>
      <rect x="92" y="150" width="456" height="44" rx="22" fill={`url(#${gradientId})`} opacity="0.88" />
      {Array.from({ length: 15 }, (_, index) => <text key={index} x={108 + index * 30.5} y="219" fill="#a1a1a6" fontSize="10" textAnchor="middle">{index}</text>)}
      <line x1={dropX} y1="116" x2={dropX} y2="222" stroke="#1d1d1f" strokeWidth="3" />
      <path d={`M${dropX} 101C${dropX - 12} 116 ${dropX - 12} 132 ${dropX} 141C${dropX + 12} 132 ${dropX + 12} 116 ${dropX} 101Z`} fill={`hsl(${hue} 85% 62%)`} stroke="#1d1d1f" strokeWidth="2" />
      <text x="92" y="131" fill="#f472b6" fontSize="11" fontWeight="700">ACIDIC</text>
      <text x="548" y="131" fill="#4d7c0f" fontSize="11" fontWeight="700" textAnchor="end">BASIC</text>
      <text x="320" y="276" fill={accent} fontSize="24" fontWeight="700" textAnchor="middle">{leftText}</text>
    </>
  );
}

function AtomLab({ value, accent, controlText, leftText }) {
  const electrons = Math.max(1, Math.round(value / 13));
  return (
    <>
      {[44, 80, 116].map((radius) => <circle key={radius} cx="320" cy="178" r={radius} fill="none" stroke="#d1d1d6" strokeWidth="2" />)}
      <circle cx="320" cy="178" r="30" fill="#8b5cf6" opacity="0.92" />
      {Array.from({ length: electrons }, (_, index) => {
        const radius = index < 2 ? 44 : index < 6 ? 80 : 116;
        const total = index < 2 ? Math.min(electrons, 2) : index < 6 ? Math.min(Math.max(electrons - 2, 1), 4) : Math.max(electrons - 6, 1);
        const angle = ((index + 1) / total) * Math.PI * 2 + (index < 2 ? 0 : index < 6 ? 0.7 : 1.3);
        return <circle key={index} cx={320 + Math.cos(angle) * radius} cy={178 + Math.sin(angle) * radius} r="7" fill={accent} />;
      })}
      <text x="320" y="183" fill="#ffffff" fontSize="10" fontWeight="800" textAnchor="middle">NUCLEUS</text>
      <text x="320" y="316" fill={accent} fontSize="15" fontWeight="700" textAnchor="middle">{controlText}</text>
    </>
  );
}

function RatioLab({ value, target, accent, controlText, leftText }) {
  const targetSpan = 130 + (value / 100) * 200;
  return (
    <>
      <path d="M102 250L202 120L302 250Z" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="3" />
      <path d={`M338 250L${338 + targetSpan / 2} 120L${338 + targetSpan} 250Z`} fill="#e0f2fe" stroke={accent} strokeWidth="3" />
      <line x1="102" y1="272" x2="302" y2="272" stroke="#8b5cf6" strokeWidth="3" />
      <line x1="338" y1="272" x2={338 + targetSpan} y2="272" stroke={accent} strokeWidth="3" />
      <text x="202" y="302" fill="#6e6e73" fontSize="11" fontWeight="700" textAnchor="middle">REFERENCE 1 : 1</text>
      <text x={338 + targetSpan / 2} y="302" fill={accent} fontSize="11" fontWeight="700" textAnchor="middle">{controlText}</text>
      <text x="320" y="92" fill={Math.abs(value - target) <= 4 ? accent : '#6e6e73'} fontSize="16" fontWeight="700" textAnchor="middle">PROPORTIONAL SPAN</text>
    </>
  );
}

function CoordinateLab({ value, accent, controlText, leftText }) {
  const rise = clamp((value - 50) * 1.55, -72, 72);
  const endY = 198 - rise;
  return (
    <>
      {Array.from({ length: 9 }, (_, index) => 110 + index * 52).map((x) => <line key={`x-${x}`} x1={x} y1="86" x2={x} y2="278" stroke="#d1d1d6" strokeWidth="1" />)}
      {Array.from({ length: 5 }, (_, index) => 102 + index * 42).map((y) => <line key={`y-${y}`} x1="110" y1={y} x2="526" y2={y} stroke="#d1d1d6" strokeWidth="1" />)}
      <line x1="110" y1="198" x2="526" y2="198" stroke="#a1a1a6" strokeWidth="2" />
      <line x1="318" y1="86" x2="318" y2="278" stroke="#a1a1a6" strokeWidth="2" />
      <path d={`M162 240L478 ${endY}`} fill="none" stroke={accent} strokeWidth="5" />
      <circle cx="162" cy="240" r="8" fill="#8b5cf6" />
      <circle cx="478" cy={endY} r="8" fill={accent} />
      <path d={`M478 240V${endY}H162`} fill="none" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="5 5" />
      <text x="320" y="306" fill={accent} fontSize="14" fontWeight="700" textAnchor="middle">{controlText}</text>
    </>
  );
}

function GeometryLab({ value, accent, controlText, leftText }) {
  const angle = 25 + value * 1.3;
  const end = point((-angle * Math.PI) / 180, 136, 320, 240);
  return (
    <>
      <path d="M320 240L176 240" stroke="#8b5cf6" strokeWidth="7" strokeLinecap="round" />
      <path d={`M320 240L${end}`} stroke={accent} strokeWidth="7" strokeLinecap="round" />
      <path d={`M260 240A60 60 0 0 1 ${point((-angle * Math.PI) / 180, 60, 320, 240)}`} fill="none" stroke="#f59e0b" strokeWidth="4" />
      <circle cx="320" cy="240" r="10" fill="#1d1d1f" />
      <path d="M162 116H478V294H162Z" fill="none" stroke="#d1d1d6" strokeDasharray="5 7" />
      {/* Both rays sweep the space above the vertex, so the readout lives below
          it — anywhere above collides with the moving ray at some angle. */}
      <text x="320" y="300" fill={accent} fontSize="28" fontWeight="700" textAnchor="middle">{Math.round(angle)}°</text>
      <text x="320" y="330" fill="#6e6e73" fontSize="11" fontWeight="700" textAnchor="middle">INTERIOR ANGLE LOCK</text>
    </>
  );
}

function DataLab({ value, target, accent, controlText, leftText }) {
  const bars = [38, 56, 72, value, 64, 44, 84];
  const mean = bars.reduce((sum, bar) => sum + bar, 0) / bars.length;
  const meanY = 268 - mean * 1.55;
  return (
    <>
      <line x1="102" y1="270" x2="538" y2="270" stroke="#a1a1a6" strokeWidth="2" />
      {bars.map((bar, index) => <rect key={index} x={130 + index * 54} y={270 - bar * 1.55} width="30" height={bar * 1.55} rx="6" fill={index === 3 ? accent : '#c7c7cc'} />)}
      <line x1="116" y1={meanY} x2="524" y2={meanY} stroke="#8b5cf6" strokeWidth="3" strokeDasharray="7 6" />
      <text x="524" y={meanY - 8} fill="#a78bfa" fontSize="11" fontWeight="700" textAnchor="end">MEAN {mean.toFixed(1)}</text>
      <text x="320" y="112" fill={Math.abs(value - target) <= 4 ? accent : '#6e6e73'} fontSize="16" fontWeight="700" textAnchor="middle">{controlText}</text>
    </>
  );
}

function CellLab({ value, accent, arrowId, controlText, leftText }) {
  const shield = 34 + value * 0.62;
  return (
    <>
      <circle cx="350" cy="185" r="112" fill="#d1fae5" fillOpacity="0.32" stroke="#10b981" strokeWidth="4" />
      <circle cx="350" cy="185" r={shield} fill="none" stroke={accent} strokeWidth="5" strokeDasharray="8 6" />
      <circle cx="350" cy="185" r="36" fill="#8b5cf6" />
      <circle cx="350" cy="185" r="13" fill="#ede9fe" />
      {[{ x: 142, y: 132 }, { x: 148, y: 224 }, { x: 214, y: 182 }].map((virus, index) => <g key={index}><circle cx={virus.x} cy={virus.y} r="14" fill="#db2777" />{/* V takes a single y. Passing "x y" made the spikes render as a stray bar. */}
<path d={`M${virus.x - 20} ${virus.y}H${virus.x + 20}M${virus.x} ${virus.y - 20}V${virus.y + 20}`} stroke="#f472b6" strokeWidth="3" /></g>)}
      <line x1="232" y1="182" x2="286" y2="182" stroke={accent} strokeWidth="4" markerEnd={`url(#${arrowId})`} />
      <text x="350" y="325" fill={accent} fontSize="14" fontWeight="700" textAnchor="middle">{controlText}</text>
    </>
  );
}

function EcosystemLab({ value, accent, arrowId, controlText, leftText }) {
  const resource = 60 + value * 1.3;
  const predator = 210 - value * 0.7;
  const nodes = [{ x: 160, y: 238, label: 'PLANTS', color: '#65a30d' }, { x: 320, y: 174, label: 'GRAZERS', color: '#8b5cf6' }, { x: 480, y: 118, label: 'PREDATORS', color: accent }];
  return (
    <>
      <line x1="185" y1="224" x2="286" y2="186" stroke="#a1a1a6" strokeWidth="5" markerEnd={`url(#${arrowId})`} />
      <line x1="345" y1="160" x2="446" y2="126" stroke="#a1a1a6" strokeWidth="5" markerEnd={`url(#${arrowId})`} />
      {nodes.map((node) => <g key={node.label}><circle cx={node.x} cy={node.y} r="35" fill="#ffffff" stroke={node.color} strokeWidth="4" /><text x={node.x} y={node.y + 4} fill="#1d1d1f" fontSize="9" fontWeight="700" textAnchor="middle">{node.label}</text></g>)}
      <rect x="120" y="290" width="170" height="12" rx="6" fill="#f5f5f7" /><rect x="120" y="290" width={resource} height="12" rx="6" fill="#65a30d" />
      <rect x="350" y="290" width="170" height="12" rx="6" fill="#f5f5f7" /><rect x="350" y="290" width={predator} height="12" rx="6" fill={accent} />
      <text x="120" y="280" fill="#6e6e73" fontSize="10" fontWeight="700">RESOURCE BASE</text>
      <text x="520" y="280" fill="#6e6e73" fontSize="10" fontWeight="700" textAnchor="end">PREDATOR DEMAND</text>
    </>
  );
}

function LungsLab({ value, accent, controlText, leftText }) {
  const scale = 0.74 + value / 380;
  const wave = Array.from({ length: 40 }, (_, index) => {
    const x = 102 + index * 11;
    const y = 288 - Math.sin((index / 39) * Math.PI * 3) * (12 + value * 0.16);
    return `${index ? 'L' : 'M'}${x} ${y}`;
  }).join(' ');
  return (
    <>
      <path d="M320 94V147" stroke="#a1a1a6" strokeWidth="14" strokeLinecap="round" />
      <g transform={`translate(320 177) scale(${scale}) translate(-320 -177)`}>
        <path d="M304 148C234 116 184 145 184 207C184 255 226 270 304 244Z" fill="#67e8f9" fillOpacity="0.8" stroke={accent} strokeWidth="4" />
        <path d="M336 148C406 116 456 145 456 207C456 255 414 270 336 244Z" fill="#67e8f9" fillOpacity="0.8" stroke={accent} strokeWidth="4" />
      </g>
      <path d={wave} fill="none" stroke="#8b5cf6" strokeWidth="4" />
      <text x="320" y="74" fill={accent} fontSize="16" fontWeight="700" textAnchor="middle">{controlText}</text>
      <text x="320" y="322" fill="#6e6e73" fontSize="10" fontWeight="700" textAnchor="middle">BREATHING WAVEFORM</text>
    </>
  );
}

function OsmosisLab({ value, accent, arrowId, controlText, leftText }) {
  const inside = Math.round(value / 7);
  const outside = 14 - inside;
  // `--drift-i` staggers each solute so the group reads as independent
  // particles rather than one block sliding. The animation itself lives in
  // globals.css; nothing here knows about timing.
  const dotGroup = (amount, startX, color, phase) => Array.from({ length: amount }, (_, index) => (
    <circle
      key={index}
      className="particle-drift"
      style={{ '--drift-i': index + phase }}
      cx={startX + (index % 4) * 16}
      cy={126 + Math.floor(index / 4) * 28}
      r="5"
      fill={color}
    />
  ));
  return (
    <>
      <rect x="92" y="94" width="456" height="176" rx="22" fill="#ffffff" stroke="#a1a1a6" strokeWidth="3" />
      <rect className="membrane-fluid" x="288" y="100" width="64" height="164" rx="14" fill="#cffafe" fillOpacity="0.7" stroke={accent} strokeWidth="3" strokeDasharray="6 5" />
      {dotGroup(outside, 128, '#8b5cf6', 0)}{dotGroup(inside, 380, accent, 7)}
      <path className="solution-flow" d="M244 174H278" stroke="#1d1d1f" strokeWidth="4" markerEnd={`url(#${arrowId})`} />
      <path className="solution-flow solution-flow-return" d="M396 204H362" stroke="#1d1d1f" strokeWidth="4" markerEnd={`url(#${arrowId})`} />
      <text x="190" y="292" fill="#6e6e73" fontSize="11" fontWeight="700" textAnchor="middle">WATER POTENTIAL</text>
      <text x="450" y="292" fill={accent} fontSize="11" fontWeight="700" textAnchor="middle">CELL PRESSURE</text>
      <text x="320" y="82" fill="#6e6e73" fontSize="10" fontWeight="700" textAnchor="middle">SELECTIVE MEMBRANE</text>
    </>
  );
}

function FrictionLab({ value, accent, arrowId, leftLabel, rightLabel, controlText }) {
  const grip = 30 + value * 0.42;
  return (
    <>
      <path d="M86 268H554" stroke="#a1a1a6" strokeWidth="3" />
      {Array.from({ length: 24 }, (_, index) => <path key={index} d={`M${92 + index * 19} 268l-9 12`} stroke="#c7c7cc" strokeWidth="2" />)}
      <rect x="238" y="176" width="150" height="92" rx="10" fill="#8b5cf6" />
      <text x="313" y="228" fill="#ffffff" fontSize="12" fontWeight="800" textAnchor="middle">LOAD</text>
      <line x1="313" y1="120" x2="313" y2="170" stroke="#8b5cf6" strokeWidth="5" markerEnd={`url(#${arrowId})`} />
      <text x="313" y="112" fill="#6e6e73" fontSize="10" fontWeight="700" textAnchor="middle">NORMAL FORCE</text>
      <line x1="238" y1="222" x2={238 - grip} y2="222" stroke={accent} strokeWidth="6" markerEnd={`url(#${arrowId})`} />
      <line x1="388" y1="222" x2={388 + 62} y2="222" stroke="#d1d1d6" strokeWidth="6" markerEnd={`url(#${arrowId})`} />
      <text x="150" y="204" fill={accent} fontSize="10" fontWeight="700" textAnchor="middle">{leftLabel}</text>
      <text x="470" y="204" fill="#6e6e73" fontSize="10" fontWeight="700" textAnchor="middle">{rightLabel}</text>
      <text x="320" y="316" fill={accent} fontSize="15" fontWeight="700" textAnchor="middle">{controlText}</text>
    </>
  );
}

function ForceLab({ value, accent, arrowId, leftLabel, rightLabel, controlText }) {
  const thrust = 24 + value * 1.5;
  return (
    <>
      <path d="M96 272H544" stroke="#c7c7cc" strokeWidth="3" />
      <rect x="248" y="164" width="146" height="86" rx="12" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="3" />
      <text x="321" y="214" fill="#8b5cf6" fontSize="13" fontWeight="800" textAnchor="middle">MASS</text>
      <circle cx="284" cy="258" r="18" fill="#1d1d1f" /><circle cx="358" cy="258" r="18" fill="#1d1d1f" />
      <circle cx="284" cy="258" r="6" fill="#ffffff" /><circle cx="358" cy="258" r="6" fill="#ffffff" />
      <line x1="394" y1="196" x2={394 + thrust} y2="196" stroke={accent} strokeWidth="7" markerEnd={`url(#${arrowId})`} />
      <line x1="248" y1="228" x2="182" y2="228" stroke="#a1a1a6" strokeWidth="5" markerEnd={`url(#${arrowId})`} />
      <text x="470" y="176" fill={accent} fontSize="10" fontWeight="700" textAnchor="middle">{leftLabel}</text>
      <text x="180" y="210" fill="#6e6e73" fontSize="10" fontWeight="700" textAnchor="middle">{rightLabel}</text>
      <text x="320" y="316" fill={accent} fontSize="15" fontWeight="700" textAnchor="middle">{controlText}</text>
    </>
  );
}

function CollisionLab({ value, accent, arrowId, leftLabel, rightLabel, controlText }) {
  const approach = 128 + value * 0.92;
  return (
    <>
      <path d="M76 268H564" stroke="#c7c7cc" strokeWidth="3" />
      <rect x={approach} y="196" width="96" height="60" rx="10" fill="#8b5cf6" />
      <circle cx={approach + 24} cy="262" r="12" fill="#1d1d1f" /><circle cx={approach + 72} cy="262" r="12" fill="#1d1d1f" />
      <line x1={approach + 100} y1="180" x2={approach + 100 + value * 0.7 + 18} y2="180" stroke={accent} strokeWidth="6" markerEnd={`url(#${arrowId})`} />
      <rect x="428" y="196" width="96" height="60" rx="10" fill="#e5e5ea" stroke="#a1a1a6" strokeWidth="3" />
      <circle cx="452" cy="262" r="12" fill="#1d1d1f" /><circle cx="500" cy="262" r="12" fill="#1d1d1f" />
      <path d="M414 186V266" stroke={accent} strokeWidth="3" strokeDasharray="6 6" />
      <text x="176" y="180" fill="#8b5cf6" fontSize="10" fontWeight="700">{leftLabel}</text>
      <text x="476" y="180" fill="#6e6e73" fontSize="10" fontWeight="700" textAnchor="middle">{rightLabel}</text>
      <text x="320" y="316" fill={accent} fontSize="15" fontWeight="700" textAnchor="middle">{controlText}</text>
    </>
  );
}

function EnergyLab({ value, accent, leftLabel, rightLabel, controlText }) {
  const kinetic = clamp(value, 0, 100) * 3.9;
  return (
    <>
      <rect x="118" y="132" width="404" height="46" rx="10" fill="#f5f5f7" stroke="#d1d1d6" strokeWidth="2" />
      <rect x="118" y="132" width={kinetic} height="46" rx="10" fill={accent} />
      <rect x="118" y="204" width="404" height="46" rx="10" fill="#f5f5f7" stroke="#d1d1d6" strokeWidth="2" />
      <rect x={522 - (404 - kinetic)} y="204" width={404 - kinetic} height="46" rx="10" fill="#8b5cf6" />
      <text x="118" y="124" fill={accent} fontSize="11" fontWeight="700">{leftLabel}</text>
      <text x="118" y="196" fill="#8b5cf6" fontSize="11" fontWeight="700">{rightLabel}</text>
      <path d="M118 274H522" stroke="#1d1d1f" strokeWidth="3" />
      <text x="320" y="300" fill="#6e6e73" fontSize="10" fontWeight="700" textAnchor="middle">TOTAL ENERGY IS FIXED — THE SPLIT IS NOT</text>
      <text x="320" y="326" fill={accent} fontSize="15" fontWeight="700" textAnchor="middle">{controlText}</text>
    </>
  );
}

function ProjectileLab({ value, accent, controlText, leftText }) {
  const range = 90 + (value / 100) ** 2 * 380;
  const apex = 262 - range * 0.28;
  return (
    <>
      <path d="M86 262H562" stroke="#a1a1a6" strokeWidth="3" />
      <path d={`M104 262Q${104 + range / 2} ${apex} ${104 + range} 262`} fill="none" stroke={accent} strokeWidth="4" strokeDasharray="7 6" />
      <path d="M84 262L104 240L124 262Z" fill="#8b5cf6" />
      <circle cx={104 + range} cy="262" r="9" fill={accent} />
      <line x1={104 + range} y1="262" x2={104 + range} y2="290" stroke={accent} strokeWidth="2" />
      <line x1="104" y1="290" x2={104 + range} y2="290" stroke="#8b5cf6" strokeWidth="2" markerEnd="none" />
      <text x={104 + range / 2} y="310" fill="#8b5cf6" fontSize="11" fontWeight="700" textAnchor="middle">RANGE {leftText}</text>
      <text x="320" y="112" fill={accent} fontSize="15" fontWeight="700" textAnchor="middle">{controlText}</text>
    </>
  );
}

function OrbitLab({ value, accent, controlText, leftText }) {
  const radius = 44 + value * 0.92;
  const angle = -0.7;
  return (
    <>
      <circle cx="320" cy="192" r="30" fill="#8b5cf6" />
      <circle cx="320" cy="192" r={radius} fill="none" stroke={accent} strokeWidth="3" strokeDasharray="8 7" />
      <circle cx={320 + Math.cos(angle) * radius} cy={192 + Math.sin(angle) * radius} r="12" fill={accent} />
      <line x1="320" y1="192" x2={320 + radius} y2="192" stroke="#a1a1a6" strokeWidth="2" />
      <text x={320 + radius / 2} y="184" fill="#6e6e73" fontSize="10" fontWeight="700" textAnchor="middle">r</text>
      <text x="320" y="330" fill={accent} fontSize="15" fontWeight="700" textAnchor="middle">{controlText}</text>
      <text x="320" y="306" fill="#6e6e73" fontSize="10" fontWeight="700" textAnchor="middle">FIELD STRENGTH {leftText}</text>
    </>
  );
}

function HydraulicLab({ value, accent, leftLabel, rightLabel, controlText }) {
  // A small input piston drops as the wide output piston rises: fluid is
  // conserved, so both pistons must ride on the fluid surface rather than
  // float above their own cylinders.
  const lift = clamp(value, 0, 100) * 0.62;
  const outputTop = 250 - lift;
  const inputTop = 152 + lift * 0.55;
  return (
    <>
      <path d={`M120 300V${inputTop}h86v${296 - inputTop}`} fill="none" stroke="#a1a1a6" strokeWidth="3" />
      <path d={`M392 300V${outputTop - 26}h150v${326 - outputTop}`} fill="none" stroke="#a1a1a6" strokeWidth="3" />
      <path d={`M124 300h78v-${300 - inputTop - 12}h-78Z`} fill="#cffafe" />
      <rect x="396" y={outputTop} width="142" height={300 - outputTop} fill="#cffafe" />
      <rect x="124" y="270" width="414" height="30" fill="#cffafe" />
      <rect x="124" y={inputTop} width="78" height="16" rx="4" fill="#8b5cf6" />
      <rect x="396" y={outputTop - 16} width="142" height="16" rx="4" fill={accent} />
      <line x1="163" y1={inputTop} x2="163" y2={inputTop - 42} stroke="#8b5cf6" strokeWidth="5" />
      <text x="163" y={inputTop - 52} fill="#8b5cf6" fontSize="10" fontWeight="700" textAnchor="middle">{rightLabel}</text>
      <text x="467" y={outputTop - 28} fill={accent} fontSize="10" fontWeight="700" textAnchor="middle">{leftLabel}</text>
      <text x="300" y="330" fill={accent} fontSize="15" fontWeight="700" textAnchor="middle">{controlText}</text>
    </>
  );
}

function ThermalLab({ value, accent, arrowId, leftLabel, rightLabel, controlText, leftText }) {
  // Capped at 6: past that the arrowheads merge into one solid band and stop
  // reading as discrete heat flow.
  const flow = Math.min(6, 2 + Math.round(value / 22));
  return (
    <>
      <rect x="96" y="132" width="128" height="140" rx="16" fill="#fee2e2" stroke="#ef4444" strokeWidth="3" />
      <rect x="416" y="132" width="128" height="140" rx="16" fill="#e0f2fe" stroke={accent} strokeWidth="3" />
      <rect x="224" y="178" width="192" height="48" fill="#e5e5ea" stroke="#a1a1a6" strokeWidth="2" />
      {Array.from({ length: flow }, (_, index) => (
        <line key={index} x1={238 + index * 29} y1="202" x2={252 + index * 29} y2="202" stroke="#ef4444" strokeWidth="4" markerEnd={`url(#${arrowId})`} />
      ))}
      <text x="160" y="120" fill="#ef4444" fontSize="10" fontWeight="700" textAnchor="middle">{leftLabel}</text>
      <text x="480" y="120" fill={accent} fontSize="10" fontWeight="700" textAnchor="middle">{rightLabel}</text>
      <text x="320" y="164" fill="#6e6e73" fontSize="10" fontWeight="700" textAnchor="middle">CONDUCTING BRIDGE</text>
      <text x="320" y="296" fill={accent} fontSize="15" fontWeight="700" textAnchor="middle">{controlText}</text>
      <text x="320" y="322" fill="#6e6e73" fontSize="11" fontWeight="700" textAnchor="middle">{leftText}</text>
    </>
  );
}

function MagnetLab({ value, accent, arrowId, leftLabel, controlText }) {
  const turns = Math.max(3, Math.round(value / 7));
  return (
    <>
      <rect x="232" y="146" width="176" height="76" rx="8" fill="#e5e5ea" stroke="#a1a1a6" strokeWidth="3" />
      {Array.from({ length: turns }, (_, index) => (
        <ellipse key={index} cx={244 + index * (152 / Math.max(1, turns - 1))} cy="184" rx="9" ry="46" fill="none" stroke={accent} strokeWidth="4" />
      ))}
      {[126, 242].map((y, index) => (
        <path key={y} d={`M150 ${y}Q320 ${index ? y + 62 : y - 62} 490 ${y}`} fill="none" stroke="#8b5cf6" strokeWidth="3" strokeDasharray="7 6" markerEnd={`url(#${arrowId})`} />
      ))}
      <path d="M120 184H210" stroke="#8b5cf6" strokeWidth="4" markerEnd={`url(#${arrowId})`} />
      <text x="320" y="106" fill="#8b5cf6" fontSize="10" fontWeight="700" textAnchor="middle">{leftLabel}</text>
      <text x="320" y="300" fill={accent} fontSize="15" fontWeight="700" textAnchor="middle">{controlText}</text>
      <text x="320" y="324" fill="#6e6e73" fontSize="10" fontWeight="700" textAnchor="middle">{turns} TURNS SHOWN</text>
    </>
  );
}

function MirrorLab({ value, accent, controlText }) {
  const theta = (clamp(value, 0, 100) / 100) * 80;
  const radians = (theta * Math.PI) / 180;
  const reach = 150;
  return (
    <>
      <path d="M120 254H520" stroke="#1d1d1f" strokeWidth="5" />
      {Array.from({ length: 20 }, (_, index) => <path key={index} d={`M${126 + index * 20} 254l-10 14`} stroke="#a1a1a6" strokeWidth="2" />)}
      <line x1="320" y1="254" x2="320" y2="112" stroke="#a1a1a6" strokeWidth="2" strokeDasharray="6 6" />
      <line x1={320 - Math.sin(radians) * reach} y1={254 - Math.cos(radians) * reach} x2="320" y2="254" stroke="#8b5cf6" strokeWidth="4" />
      <line x1="320" y1="254" x2={320 + Math.sin(radians) * reach} y2={254 - Math.cos(radians) * reach} stroke={accent} strokeWidth="4" />
      <circle cx="320" cy="254" r="7" fill="#1d1d1f" />
      <text x={320 - Math.sin(radians) * reach - 6} y={248 - Math.cos(radians) * reach} fill="#8b5cf6" fontSize="10" fontWeight="700" textAnchor="end">INCIDENT</text>
      <text x={320 + Math.sin(radians) * reach + 6} y={248 - Math.cos(radians) * reach} fill={accent} fontSize="10" fontWeight="700">REFLECTED</text>
      <text x="320" y="300" fill={accent} fontSize="15" fontWeight="700" textAnchor="middle">{controlText}</text>
    </>
  );
}

function GasLab({ value, accent, arrowId, leftLabel, rightLabel, controlText, leftText }) {
  const height = 40 + value * 1.5;
  return (
    <>
      <rect x="196" y="96" width="176" height="196" rx="10" fill="#ffffff" stroke="#a1a1a6" strokeWidth="4" />
      <rect x="202" y={292 - height} width="164" height={height} fill="#cffafe" fillOpacity="0.8" />
      <rect x="196" y={286 - height} width="176" height="14" rx="4" fill="#8b5cf6" />
      <line x1="284" y1={280 - height} x2="284" y2="112" stroke="#8b5cf6" strokeWidth="6" />
      <line x1="284" y1="112" x2="284" y2="148" stroke="#8b5cf6" strokeWidth="6" markerEnd={`url(#${arrowId})`} />
      {Array.from({ length: 12 }, (_, index) => (
        <circle key={index} cx={214 + ((index * 43) % 140)} cy={292 - ((index * 29) % Math.max(20, height - 12)) - 8} r="4" fill={accent} />
      ))}
      <circle cx="452" cy="176" r="52" fill="#f5f5f7" stroke="#a1a1a6" strokeWidth="3" />
      <line x1="452" y1="176" x2={452 + Math.cos((value / 100) * Math.PI - Math.PI) * 38} y2={176 + Math.sin((value / 100) * Math.PI - Math.PI) * 38} stroke="#ef4444" strokeWidth="4" />
      <circle cx="452" cy="176" r="6" fill="#1d1d1f" />
      <text x="452" y="248" fill="#6e6e73" fontSize="10" fontWeight="700" textAnchor="middle">{rightLabel}</text>
      <text x="452" y="268" fill={accent} fontSize="12" fontWeight="700" textAnchor="middle">{leftText}</text>
      <text x="284" y="322" fill={accent} fontSize="14" fontWeight="700" textAnchor="middle">{controlText}</text>
      <text x="284" y="90" fill="#6e6e73" fontSize="10" fontWeight="700" textAnchor="middle">{leftLabel}</text>
    </>
  );
}

function BondLab({ value, accent, controlText, leftText }) {
  const bonds = Math.max(1, Math.min(4, Math.round(value / 25) || 1));
  return (
    <>
      <circle cx="212" cy="188" r="52" fill="#8b5cf6" />
      <circle cx="428" cy="188" r="52" fill={accent} />
      {Array.from({ length: bonds }, (_, index) => (
        <line key={index} x1="264" y1={188 - (bonds - 1) * 9 + index * 18} x2="376" y2={188 - (bonds - 1) * 9 + index * 18} stroke="#1d1d1f" strokeWidth="6" strokeLinecap="round" />
      ))}
      <text x="212" y="194" fill="#ffffff" fontSize="14" fontWeight="800" textAnchor="middle">A</text>
      <text x="428" y="194" fill="#ffffff" fontSize="14" fontWeight="800" textAnchor="middle">B</text>
      <text x="320" y="286" fill="#6e6e73" fontSize="10" fontWeight="700" textAnchor="middle">SHARED PAIRS: {bonds}</text>
      <text x="320" y="312" fill={accent} fontSize="15" fontWeight="700" textAnchor="middle">{controlText}</text>
      <text x="320" y="112" fill="#6e6e73" fontSize="11" fontWeight="700" textAnchor="middle">{leftText}</text>
    </>
  );
}

function SolutionLab({ value, accent, leftLabel, rightLabel, controlText, leftText }) {
  const level = 60 + value * 1.5;
  const solutes = Math.max(2, Math.round(value / 6));
  return (
    <>
      <path d="M212 96V276a22 22 0 0 0 22 22h172a22 22 0 0 0 22-22V96" fill="#ffffff" stroke="#a1a1a6" strokeWidth="4" />
      <path d={`M214 ${298 - level}h212V276a20 20 0 0 1-20 20H234a20 20 0 0 1-20-20Z`} fill="#cffafe" fillOpacity="0.9" />
      <rect x="214" y={298 - level} width="212" height={Math.max(0, level - 24)} fill="#cffafe" fillOpacity="0.9" />
      {Array.from({ length: solutes }, (_, index) => (
        <circle key={index} cx={230 + ((index * 37) % 180)} cy={294 - ((index * 53) % Math.max(24, level - 16))} r="5" fill={accent} />
      ))}
      <line x1="446" y1={298 - level} x2="492" y2={298 - level} stroke="#8b5cf6" strokeWidth="3" strokeDasharray="6 5" />
      <text x="498" y={302 - level} fill="#8b5cf6" fontSize="10" fontWeight="700">{rightLabel}</text>
      <text x="320" y="90" fill="#6e6e73" fontSize="10" fontWeight="700" textAnchor="middle">{leftLabel}</text>
      <text x="320" y="330" fill={accent} fontSize="14" fontWeight="700" textAnchor="middle">{controlText} · {leftText}</text>
    </>
  );
}

function RedoxLab({ value, accent, arrowId, leftLabel, rightLabel, controlText }) {
  const electrons = Math.max(1, Math.round(value / 12));
  return (
    <>
      <rect x="112" y="140" width="128" height="150" rx="10" fill="#faf5ff" stroke="#8b5cf6" strokeWidth="3" />
      <rect x="400" y="140" width="128" height="150" rx="10" fill="#ecfeff" stroke={accent} strokeWidth="3" />
      <rect x="168" y="112" width="16" height="120" rx="4" fill="#8b5cf6" />
      <rect x="456" y="112" width="16" height="120" rx="4" fill={accent} />
      <path d="M176 112V92H464V112" fill="none" stroke="#1d1d1f" strokeWidth="4" />
      {Array.from({ length: Math.min(8, electrons) }, (_, index) => (
        <circle key={index} cx={196 + index * 34} cy="92" r="7" fill="#f59e0b" />
      ))}
      <line x1="300" y1="92" x2="352" y2="92" stroke="#f59e0b" strokeWidth="4" markerEnd={`url(#${arrowId})`} />
      <text x="176" y="312" fill="#8b5cf6" fontSize="10" fontWeight="700" textAnchor="middle">{leftLabel}</text>
      <text x="464" y="312" fill={accent} fontSize="10" fontWeight="700" textAnchor="middle">{rightLabel}</text>
      <text x="320" y="216" fill={accent} fontSize="15" fontWeight="700" textAnchor="middle">{controlText}</text>
      <text x="320" y="70" fill="#6e6e73" fontSize="10" fontWeight="700" textAnchor="middle">ELECTRON FLOW</text>
    </>
  );
}

function ChromatographyLab({ value, accent, leftLabel, rightLabel, controlText, leftText }) {
  const travel = clamp(value, 0, 100) * 1.6;
  return (
    <>
      <rect x="252" y="92" width="136" height="212" rx="6" fill="#ffffff" stroke="#a1a1a6" strokeWidth="3" />
      <line x1="252" y1="284" x2="388" y2="284" stroke="#6e6e73" strokeWidth="2" strokeDasharray="5 4" />
      <line x1="252" y1="112" x2="388" y2="112" stroke="#8b5cf6" strokeWidth="3" />
      <ellipse cx="320" cy={284 - travel} rx="24" ry="13" fill={accent} opacity="0.85" />
      <ellipse cx="320" cy="284" rx="18" ry="9" fill="#d1d1d6" />
      <line x1="410" y1="284" x2="410" y2={284 - travel} stroke={accent} strokeWidth="2" />
      <text x="420" y={288 - travel / 2} fill={accent} fontSize="10" fontWeight="700">{leftText}</text>
      <text x="240" y="116" fill="#8b5cf6" fontSize="10" fontWeight="700" textAnchor="end">{rightLabel}</text>
      <text x="240" y="288" fill="#6e6e73" fontSize="10" fontWeight="700" textAnchor="end">{leftLabel}</text>
      <text x="320" y="330" fill={accent} fontSize="14" fontWeight="700" textAnchor="middle">{controlText}</text>
    </>
  );
}

function FractionLab({ value, accent, controlText, leftText }) {
  const fraction = clamp(value, 0, 100) / 100;
  const angle = fraction * Math.PI * 2 - Math.PI / 2;
  const large = fraction > 0.5 ? 1 : 0;
  const slice = fraction >= 0.999
    ? 'M320 84A94 94 0 1 1 319.9 84Z'
    : `M320 178L320 84A94 94 0 ${large} 1 ${(320 + Math.cos(angle) * 94).toFixed(1)} ${(178 + Math.sin(angle) * 94).toFixed(1)}Z`;
  return (
    <>
      <circle cx="320" cy="178" r="94" fill="#f5f5f7" stroke="#d1d1d6" strokeWidth="3" />
      <path d={slice} fill={accent} opacity="0.9" />
      {Array.from({ length: 8 }, (_, index) => {
        const tick = (index / 8) * Math.PI * 2 - Math.PI / 2;
        return <line key={index} x1={320 + Math.cos(tick) * 84} y1={178 + Math.sin(tick) * 84} x2={320 + Math.cos(tick) * 94} y2={178 + Math.sin(tick) * 94} stroke="#a1a1a6" strokeWidth="2" />;
      })}
      <text x="320" y="304" fill={accent} fontSize="16" fontWeight="700" textAnchor="middle">{controlText}</text>
      <text x="320" y="328" fill="#6e6e73" fontSize="11" fontWeight="700" textAnchor="middle">{leftText}</text>
    </>
  );
}

function TriangleLab({ value, accent, leftLabel, controlText, leftText }) {
  const rise = 30 + clamp(value, 0, 100) * 1.7;
  const baseY = 288;
  return (
    <>
      <path d={`M156 ${baseY}H436V${baseY - rise}Z`} fill="#ede9fe" stroke="#8b5cf6" strokeWidth="3" />
      <path d={`M436 ${baseY}h-26v-26h26`} fill="none" stroke="#a1a1a6" strokeWidth="2" />
      <line x1="436" y1={baseY} x2="436" y2={baseY - rise} stroke={accent} strokeWidth="5" />
      <line x1="156" y1={baseY} x2="436" y2={baseY - rise} stroke="#8b5cf6" strokeWidth="5" />
      <text x="296" y={baseY + 22} fill="#6e6e73" fontSize="11" fontWeight="700" textAnchor="middle">BASE</text>
      <text x="452" y={baseY - rise / 2} fill={accent} fontSize="11" fontWeight="700">{leftLabel}</text>
      <text x="270" y={baseY - rise / 2 - 12} fill="#8b5cf6" fontSize="11" fontWeight="700" textAnchor="middle">{leftText}</text>
      <text x="320" y="112" fill={accent} fontSize="15" fontWeight="700" textAnchor="middle">{controlText}</text>
    </>
  );
}

function CircleLab({ value, accent, controlText, leftText }) {
  const radius = 26 + clamp(value, 0, 100) * 0.98;
  return (
    <>
      <circle cx="320" cy="188" r={radius} fill="#e0f2fe" fillOpacity="0.7" stroke={accent} strokeWidth="4" />
      <line x1="320" y1="188" x2={320 + radius} y2="188" stroke="#8b5cf6" strokeWidth="4" />
      <circle cx="320" cy="188" r="6" fill="#1d1d1f" />
      <text x={320 + radius / 2} y="180" fill="#8b5cf6" fontSize="11" fontWeight="700" textAnchor="middle">r</text>
      <text x="320" y="316" fill={accent} fontSize="15" fontWeight="700" textAnchor="middle">{controlText}</text>
      <text x="320" y="338" fill="#6e6e73" fontSize="11" fontWeight="700" textAnchor="middle">{leftText}</text>
    </>
  );
}

function AreaLab({ value, accent, leftLabel, controlText, leftText }) {
  const width = 60 + clamp(value, 0, 100) * 3.1;
  return (
    <>
      <rect x="120" y="132" width={width} height="140" rx="4" fill="#e0f2fe" fillOpacity="0.75" stroke={accent} strokeWidth="4" />
      {Array.from({ length: 7 }, (_, index) => <line key={index} x1="120" y1={146 + index * 20} x2={120 + width} y2={146 + index * 20} stroke={accent} strokeWidth="1" opacity="0.35" />)}
      <line x1="120" y1="292" x2={120 + width} y2="292" stroke="#8b5cf6" strokeWidth="3" />
      <line x1="104" y1="132" x2="104" y2="272" stroke="#a1a1a6" strokeWidth="3" />
      <text x={120 + width / 2} y="312" fill="#8b5cf6" fontSize="11" fontWeight="700" textAnchor="middle">{leftLabel}</text>
      <text x="86" y="206" fill="#6e6e73" fontSize="11" fontWeight="700" textAnchor="end">HEIGHT</text>
      <text x="320" y="112" fill={accent} fontSize="15" fontWeight="700" textAnchor="middle">{controlText} · {leftText}</text>
    </>
  );
}

function VolumeLab({ value, accent, controlText, leftText }) {
  const height = 34 + clamp(value, 0, 100) * 1.6;
  const top = 292 - height;
  return (
    <>
      <path d={`M198 292V${top}l52-40h180v${height}l-52 40Z`} fill="#e0f2fe" fillOpacity="0.55" stroke={accent} strokeWidth="3" />
      <path d={`M198 ${top}h180v${height}`} fill="none" stroke={accent} strokeWidth="3" />
      <path d={`M378 ${top}l52-40`} stroke={accent} strokeWidth="3" />
      <rect x="198" y={top} width="180" height={height} fill={accent} fillOpacity="0.22" />
      <line x1="182" y1="292" x2="182" y2={top} stroke="#8b5cf6" strokeWidth="3" />
      <text x="168" y={top + height / 2} fill="#8b5cf6" fontSize="11" fontWeight="700" textAnchor="end">h</text>
      <text x="320" y="322" fill={accent} fontSize="15" fontWeight="700" textAnchor="middle">{controlText}</text>
      <text x="320" y="112" fill="#6e6e73" fontSize="11" fontWeight="700" textAnchor="middle">{leftText}</text>
    </>
  );
}

function NumberLineLab({ value, accent, controlText, leftText }) {
  const x = 104 + clamp(value, 0, 100) * 4.32;
  return (
    <>
      <line x1="104" y1="196" x2="536" y2="196" stroke="#1d1d1f" strokeWidth="3" />
      {Array.from({ length: 11 }, (_, index) => {
        const tick = 104 + index * 43.2;
        return (
          <g key={index}>
            <line x1={tick} y1="186" x2={tick} y2="206" stroke="#a1a1a6" strokeWidth="2" />
            <text x={tick} y="228" fill="#a1a1a6" fontSize="10" textAnchor="middle">{index * 10 - 50}</text>
          </g>
        );
      })}
      <line x1="320" y1="172" x2="320" y2="220" stroke="#8b5cf6" strokeWidth="3" />
      <circle cx={x} cy="196" r="12" fill={accent} />
      <line x1={x} y1="196" x2={x} y2="146" stroke={accent} strokeWidth="3" />
      <text x={x} y="138" fill={accent} fontSize="12" fontWeight="700" textAnchor="middle">{controlText}</text>
      <text x="320" y="290" fill="#6e6e73" fontSize="11" fontWeight="700" textAnchor="middle">{leftText}</text>
    </>
  );
}

function BalanceLab({ value, target, accent, leftLabel, rightLabel, controlText }) {
  const tilt = clamp((value - target) * 0.24, -12, 12);
  return (
    <>
      <path d="M320 246L282 296H358Z" fill="#8b5cf6" />
      <line x1="240" y1="296" x2="400" y2="296" stroke="#c7c7cc" strokeWidth="3" />
      <g transform={`rotate(${tilt} 320 236)`}>
        <rect x="140" y="230" width="360" height="12" rx="6" fill="#d1d1d6" />
        {/* Hanger plus a shallow pan on each arm — a scale, not an arrow. */}
        <line x1="164" y1="242" x2="164" y2="276" stroke="#8b5cf6" strokeWidth="3" />
        <path d="M124 276h80l-13 24h-54Z" fill="#8b5cf6" opacity="0.85" />
        <line x1="476" y1="242" x2="476" y2="276" stroke={accent} strokeWidth="3" />
        <path d="M436 276h80l-13 24h-54Z" fill={accent} opacity="0.85" />
      </g>
      <circle cx="320" cy="236" r="12" fill="#ffffff" stroke={accent} strokeWidth="3" />
      <text x="164" y="152" fill="#8b5cf6" fontSize="11" fontWeight="700" textAnchor="middle">{leftLabel}</text>
      <text x="476" y="152" fill={accent} fontSize="11" fontWeight="700" textAnchor="middle">{rightLabel}</text>
      <text x="320" y="126" fill={accent} fontSize="15" fontWeight="700" textAnchor="middle">{controlText}</text>
    </>
  );
}

function SequenceLab({ value, accent, controlText, leftText }) {
  const step = 8 + clamp(value, 0, 100) * 0.34;
  return (
    <>
      <line x1="112" y1="292" x2="536" y2="292" stroke="#a1a1a6" strokeWidth="3" />
      {Array.from({ length: 6 }, (_, index) => {
        const height = 26 + step * index;
        return (
          <g key={index}>
            <rect x={128 + index * 70} y={292 - height} width="54" height={height} rx="5" fill={index % 2 ? accent : '#8b5cf6'} opacity="0.88" />
            <text x={155 + index * 70} y="312" fill="#a1a1a6" fontSize="10" textAnchor="middle">{index + 1}</text>
          </g>
        );
      })}
      <text x="320" y="112" fill={accent} fontSize="15" fontWeight="700" textAnchor="middle">STEP {controlText}</text>
      <text x="320" y="136" fill="#6e6e73" fontSize="11" fontWeight="700" textAnchor="middle">{leftText}</text>
    </>
  );
}

function ProbabilityLab({ value, accent, controlText, leftText }) {
  const share = clamp(value, 0, 100) / 100;
  const angle = share * Math.PI * 2 - Math.PI / 2;
  const large = share > 0.5 ? 1 : 0;
  const wedge = share >= 0.999
    ? 'M320 88A92 92 0 1 1 319.9 88Z'
    : `M320 180L320 88A92 92 0 ${large} 1 ${(320 + Math.cos(angle) * 92).toFixed(1)} ${(180 + Math.sin(angle) * 92).toFixed(1)}Z`;
  return (
    <>
      <circle cx="320" cy="180" r="92" fill="#f5f5f7" stroke="#a1a1a6" strokeWidth="3" />
      {share > 0 ? <path d={wedge} fill={accent} opacity="0.88" /> : null}
      <circle cx="320" cy="180" r="10" fill="#1d1d1f" />
      <path d="M320 62l14 26h-28Z" fill="#8b5cf6" />
      <text x="320" y="306" fill={accent} fontSize="15" fontWeight="700" textAnchor="middle">{controlText}</text>
      <text x="320" y="330" fill="#6e6e73" fontSize="11" fontWeight="700" textAnchor="middle">WINNING SHARE {leftText}</text>
    </>
  );
}

function MitosisLab({ value, accent, controlText, leftText }) {
  const stage = clamp(value, 0, 100) / 100;
  const split = stage * 46;
  return (
    <>
      <line x1="112" y1="292" x2="536" y2="292" stroke="#d1d1d6" strokeWidth="3" />
      {[0, 1, 2, 3].map((index) => (
        <text key={index} x={158 + index * 108} y="316" fill="#a1a1a6" fontSize="10" fontWeight="700" textAnchor="middle">
          {['ONE CELL', 'DUPLICATE', 'SEPARATE', 'TWO CELLS'][index]}
        </text>
      ))}
      <ellipse cx={320 - split} cy="180" rx={62 - split * 0.35} ry="62" fill="#d1fae5" fillOpacity="0.6" stroke="#10b981" strokeWidth="4" />
      <ellipse cx={320 + split} cy="180" rx={62 - split * 0.35} ry="62" fill="#d1fae5" fillOpacity="0.6" stroke="#10b981" strokeWidth="4" />
      <circle cx={320 - split} cy="180" r="20" fill="#8b5cf6" />
      <circle cx={320 + split} cy="180" r="20" fill={accent} />
      <line x1="112" y1="272" x2={112 + stage * 424} y2="272" stroke={accent} strokeWidth="5" strokeLinecap="round" />
      {/* The two daughter cells reach y≈118 at full separation, so the readout
          sits above them and its second line goes below the progress bar. */}
      <text x="320" y="104" fill={accent} fontSize="15" fontWeight="700" textAnchor="middle">{controlText}</text>
      <text x="320" y="298" fill="#6e6e73" fontSize="11" fontWeight="700" textAnchor="middle">{leftText}</text>
    </>
  );
}

function DnaLab({ value, accent, controlText, leftText }) {
  const rungs = Math.max(4, Math.round(value / 5));
  const strand = (phase) => Array.from({ length: 61 }, (_, index) => {
    const x = 120 + index * 6.7;
    const y = 190 + Math.sin(index / 6 + phase) * 54;
    return `${index ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');
  return (
    <>
      <path d={strand(0)} fill="none" stroke="#8b5cf6" strokeWidth="5" />
      <path d={strand(Math.PI)} fill="none" stroke={accent} strokeWidth="5" />
      {Array.from({ length: Math.min(20, rungs) }, (_, index) => {
        const t = index * 3;
        const x = 120 + t * 6.7;
        return <line key={index} x1={x} y1={190 + Math.sin(t / 6) * 54} x2={x} y2={190 + Math.sin(t / 6 + Math.PI) * 54} stroke="#a1a1a6" strokeWidth="3" />;
      })}
      <text x="320" y="300" fill={accent} fontSize="15" fontWeight="700" textAnchor="middle">{controlText}</text>
      <text x="320" y="324" fill="#6e6e73" fontSize="11" fontWeight="700" textAnchor="middle">{leftText}</text>
    </>
  );
}

function MitochondriaLab({ value, accent, leftLabel, rightLabel, controlText, leftText }) {
  const output = clamp(value, 0, 100) * 3.4;
  return (
    <>
      <ellipse cx="300" cy="176" rx="150" ry="80" fill="#fee2e2" fillOpacity="0.5" stroke="#ef4444" strokeWidth="4" />
      {Array.from({ length: 5 }, (_, index) => (
        <path key={index} d={`M${200 + index * 50} 108q26 34 0 68q-26 34 0 68`} fill="none" stroke="#ef4444" strokeWidth="4" opacity="0.75" />
      ))}
      <rect x="130" y="280" width="340" height="16" rx="8" fill="#f5f5f7" stroke="#d1d1d6" />
      <rect x="130" y="280" width={output} height="16" rx="8" fill={accent} />
      <text x="130" y="270" fill="#6e6e73" fontSize="10" fontWeight="700">{rightLabel}</text>
      <text x="470" y="270" fill={accent} fontSize="10" fontWeight="700" textAnchor="end">{leftText}</text>
      <text x="300" y="86" fill="#6e6e73" fontSize="10" fontWeight="700" textAnchor="middle">{leftLabel}</text>
      <text x="320" y="326" fill={accent} fontSize="14" fontWeight="700" textAnchor="middle">{controlText}</text>
    </>
  );
}

function LeafLab({ value, accent, arrowId, leftLabel, controlText, leftText }) {
  const light = Math.max(2, Math.round(value / 12));
  return (
    <>
      <circle cx="140" cy="118" r="34" fill="#fbbf24" />
      {Array.from({ length: light }, (_, index) => (
        <line key={index} x1={168 + index * 6} y1={132 + index * 4} x2={236 + index * 22} y2={170 + index * 8} stroke="#fbbf24" strokeWidth="3" markerEnd={`url(#${arrowId})`} />
      ))}
      <path d="M300 288C300 200 348 140 452 128C452 232 396 284 300 288Z" fill="#86efac" fillOpacity="0.75" stroke="#15803d" strokeWidth="4" />
      <path d="M300 288C348 240 400 194 452 128" fill="none" stroke="#15803d" strokeWidth="3" />
      <path d="M300 288V318" stroke="#15803d" strokeWidth="5" />
      <text x="140" y="176" fill="#a16207" fontSize="10" fontWeight="700" textAnchor="middle">{leftLabel}</text>
      <text x="180" y="288" fill={accent} fontSize="14" fontWeight="700" textAnchor="middle">{controlText}</text>
      <text x="180" y="312" fill="#6e6e73" fontSize="10" fontWeight="700" textAnchor="middle">{leftText}</text>
    </>
  );
}

function BiodiversityLab({ value, accent, controlText, leftText }) {
  const present = Math.max(1, Math.min(24, Math.round(value / 4.2)));
  return (
    <>
      {Array.from({ length: 24 }, (_, index) => {
        const x = 148 + (index % 6) * 60;
        const y = 116 + Math.floor(index / 6) * 48;
        const alive = index < present;
        return (
          <g key={index}>
            <rect x={x} y={y} width="46" height="36" rx="8" fill={alive ? accent : '#f5f5f7'} stroke={alive ? accent : '#d1d1d6'} strokeWidth="2" opacity={alive ? 0.9 : 1} />
            {alive ? <circle cx={x + 23} cy={y + 18} r="7" fill="#ffffff" /> : null}
          </g>
        );
      })}
      <text x="320" y="326" fill={accent} fontSize="15" fontWeight="700" textAnchor="middle">{controlText} · {leftText}</text>
    </>
  );
}

function WaterCycleLab({ value, accent, arrowId, leftLabel, rightLabel, controlText }) {
  const drops = Math.max(2, Math.round(value / 8));
  return (
    <>
      <path d="M188 128a44 44 0 0 1 86-14a36 36 0 0 1 62 26a30 30 0 0 1-8 58H206a36 36 0 0 1-18-70Z" fill="#e5e5ea" stroke="#a1a1a6" strokeWidth="3" />
      {Array.from({ length: Math.min(12, drops) }, (_, index) => (
        <path key={index} d={`M${212 + index * 22} 210l-6 14 6 8 6-8Z`} fill={accent} />
      ))}
      <path d="M96 288h448" stroke="#15803d" strokeWidth="5" />
      <rect x="380" y="238" width="150" height="50" rx="8" fill="#cffafe" stroke={accent} strokeWidth="3" />
      <path d="M456 236V160" stroke="#8b5cf6" strokeWidth="4" strokeDasharray="7 6" markerEnd={`url(#${arrowId})`} />
      <text x="256" y="252" fill={accent} fontSize="10" fontWeight="700" textAnchor="middle">{leftLabel}</text>
      <text x="500" y="152" fill="#8b5cf6" fontSize="10" fontWeight="700" textAnchor="middle">{rightLabel}</text>
      <text x="320" y="326" fill={accent} fontSize="15" fontWeight="700" textAnchor="middle">{controlText}</text>
    </>
  );
}

function HeartLab({ value, accent, controlText, leftText }) {
  const beats = Math.max(2, Math.round(value / 14));
  const trace = Array.from({ length: 121 }, (_, index) => {
    const x = 112 + index * 3.5;
    const phase = (index / 120) * beats;
    const spike = Math.abs(phase % 1 - 0.5) < 0.05 ? -44 : 0;
    return `${index ? 'L' : 'M'}${x.toFixed(1)} ${(288 + spike).toFixed(1)}`;
  }).join(' ');
  // Scaled about the heart's own centre so the beat pulse never grows into the
  // ECG trace or the readout beneath it.
  const scale = 0.62 + (value / 100) * 0.1;
  return (
    <>
      <path d="M258 148h-64M382 148h64" stroke="#e11d48" strokeWidth="6" strokeLinecap="round" />
      <g transform={`translate(320 167) scale(${scale.toFixed(3)}) translate(-320 -167)`}>
        <path d="M320 238c-70-46-96-80-96-114a44 44 0 0 1 96-28a44 44 0 0 1 96 28c0 34-26 68-96 114Z" fill="#fecdd3" stroke="#e11d48" strokeWidth="5" />
      </g>
      <path d={trace} fill="none" stroke={accent} strokeWidth="3" />
      <text x="320" y="240" fill="#e11d48" fontSize="13" fontWeight="700" textAnchor="middle">{controlText}</text>
      <text x="320" y="326" fill="#6e6e73" fontSize="11" fontWeight="700" textAnchor="middle">{leftText}</text>
    </>
  );
}

function NeuronLab({ value, accent, arrowId, controlText, leftText }) {
  const pulse = 176 + clamp(value, 0, 100) * 2.9;
  return (
    <>
      <circle cx="160" cy="188" r="46" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="4" />
      <circle cx="160" cy="188" r="16" fill="#8b5cf6" />
      {[-1, 0, 1].map((offset) => <path key={offset} d={`M124 ${188 + offset * 30}l-42 ${offset * 26 - 4}`} stroke="#8b5cf6" strokeWidth="4" strokeLinecap="round" />)}
      <path d="M206 188H468" stroke="#c7c7cc" strokeWidth="14" strokeLinecap="round" />
      {Array.from({ length: 5 }, (_, index) => <rect key={index} x={218 + index * 52} y="180" width="12" height="16" rx="3" fill="#ffffff" />)}
      <circle cx={pulse} cy="188" r="13" fill={accent} />
      <path d="M468 188h44" stroke={accent} strokeWidth="5" markerEnd={`url(#${arrowId})`} />
      <text x="320" y="252" fill="#6e6e73" fontSize="10" fontWeight="700" textAnchor="middle">MYELINATED AXON</text>
      <text x="320" y="300" fill={accent} fontSize="15" fontWeight="700" textAnchor="middle">{controlText}</text>
      <text x="320" y="324" fill="#6e6e73" fontSize="11" fontWeight="700" textAnchor="middle">{leftText}</text>
    </>
  );
}

function DigestionLab({ value, accent, arrowId, leftLabel, rightLabel, controlText }) {
  const bolus = Math.max(1, Math.round(value / 14));
  return (
    <>
      <path d="M300 104v46" stroke="#a1a1a6" strokeWidth="16" strokeLinecap="round" />
      {/* Closed pouch. An open arc with a fill renders a stray wedge back to
          the start point instead of a stomach. */}
      <path d="M288 148c-46 12-62 62-44 106c14 34 58 46 88 26c26-18 30-58 12-86c-12-20-32-34-56-46Z" fill="#fef3c7" stroke="#d97706" strokeWidth="4" />
      <path d="M330 288q-70 8-64 34t68 4q52-16 40 12" fill="none" stroke="#d97706" strokeWidth="13" strokeLinecap="round" />
      {Array.from({ length: Math.min(6, bolus) }, (_, index) => (
        <circle key={index} cx={272 + (index % 3) * 30} cy={196 + Math.floor(index / 3) * 32} r="9" fill={accent} />
      ))}
      <path d="M354 196h50" stroke="#8b5cf6" strokeWidth="4" markerEnd={`url(#${arrowId})`} />
      <text x="300" y="94" fill="#6e6e73" fontSize="10" fontWeight="700" textAnchor="middle">{leftLabel}</text>
      <text x="414" y="190" fill="#8b5cf6" fontSize="10" fontWeight="700">{rightLabel}</text>
      <text x="474" y="290" fill={accent} fontSize="14" fontWeight="700" textAnchor="end">{controlText}</text>
    </>
  );
}

/**
 * Every lab kind in `LABS` maps to exactly one apparatus here.
 *
 * All scenes take the same props and destructure the ones they use, so adding a
 * lab is one entry rather than a new prop-plumbing branch. The keys are checked
 * against `LABS` at import time below — a lab with no scene, or a scene with no
 * lab, fails loudly instead of quietly falling back to the torque rig.
 */
const SCENES = {
  lever: LeverLab,
  friction: FrictionLab,
  force: ForceLab,
  collision: CollisionLab,
  energy: EnergyLab,
  projectile: ProjectileLab,
  orbit: OrbitLab,
  hydraulic: HydraulicLab,
  thermal: ThermalLab,
  circuit: CircuitLab,
  magnet: MagnetLab,
  lens: LensLab,
  mirror: MirrorLab,
  wave: WaveLab,
  particle: ParticleLab,
  gas: GasLab,
  reaction: ReactionLab,
  ph: PhLab,
  atom: AtomLab,
  bond: BondLab,
  solution: SolutionLab,
  redox: RedoxLab,
  chromatography: ChromatographyLab,
  ratio: RatioLab,
  fraction: FractionLab,
  coordinate: CoordinateLab,
  geometry: GeometryLab,
  triangle: TriangleLab,
  circle: CircleLab,
  area: AreaLab,
  volume: VolumeLab,
  numberline: NumberLineLab,
  balance: BalanceLab,
  sequence: SequenceLab,
  probability: ProbabilityLab,
  data: DataLab,
  cell: CellLab,
  osmosis: OsmosisLab,
  mitosis: MitosisLab,
  dna: DnaLab,
  mitochondria: MitochondriaLab,
  leaf: LeafLab,
  ecosystem: EcosystemLab,
  biodiversity: BiodiversityLab,
  watercycle: WaterCycleLab,
  lungs: LungsLab,
  heart: HeartLab,
  neuron: NeuronLab,
  digestion: DigestionLab,
};

if (process.env.NODE_ENV !== 'production') {
  const missingScene = Object.keys(LABS).filter((kind) => !SCENES[kind]);
  const orphanScene = Object.keys(SCENES).filter((kind) => !LABS[kind]);
  if (missingScene.length) throw new Error(`Labs with no scene: ${missingScene.join(', ')}`);
  if (orphanScene.length) throw new Error(`Scenes with no lab: ${orphanScene.join(', ')}`);
}

function LabScene({ kind, ...props }) {
  const Scene = SCENES[kind] ?? SCENES.lever;
  return <Scene {...props} />;
}

/** One side of the relationship, shown as a real dimensioned quantity. */
function Readout({ name, value, unit, accent, emphasise }) {
  return (
    <div className="min-w-0 flex-1">
      <p className="truncate text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">{name}</p>
      <p className="truncate text-sm font-black tabular-nums" style={{ color: emphasise ? accent : '#1d1d1f' }}>
        {value}
        {unit ? <span className="ml-1 text-[11px] font-bold text-[var(--text-tertiary)]">{unit}</span> : null}
      </p>
    </div>
  );
}

export default function InteractiveGraphFrame({
  percent,
  model,
  reading,
  status = 'neutral',
  onChange,
  labKind,
  disabled = false,
}) {
  const instanceId = useId().replace(/:/g, '');
  const kind = LABS[labKind] ? labKind : 'lever';
  const lab = LABS[kind];
  const inputId = `lab-control-${instanceId}`;
  const titleId = `lab-title-${instanceId}`;
  const gridId = `lab-grid-${instanceId}`;
  const arrowId = `lab-arrow-${instanceId}`;

  const currentPercent = clamp(Number(percent) || 0, 0, 100);
  const { labels, control, solvedPercent } = model;
  const isBalanced = reading.balanced;

  const effectiveStatus = status === 'failure' ? 'failure' : (status === 'success' || isBalanced ? 'success' : 'neutral');
  const palette = {
    neutral: { stroke: '#00c4df', glow: 'rgba(0, 196, 223, 0.10)', label: 'TUNING' },
    success: { stroke: '#00c4df', glow: 'rgba(0, 196, 223, 0.20)', label: 'BALANCED' },
    failure: { stroke: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.16)', label: 'OUT OF RANGE' },
  }[effectiveStatus];

  // Describes which way the system is off, so the learner gets a direction to
  // move rather than a bare pass/fail.
  const drift = isBalanced
    ? 'the two sides agree'
    : reading.direction > 0
      ? `${labels.left.toLowerCase()} is over by ${Math.abs(reading.error)} ${labels.unit}`.trim()
      : `${labels.left.toLowerCase()} is short by ${Math.abs(reading.error)} ${labels.unit}`.trim();

  const spoken = `${lab.title}. ${control.label} at ${reading.value} ${control.unit}. ${labels.left} ${reading.left} ${labels.unit}, ${labels.right} ${reading.right} ${labels.unit}. Currently ${drift}.`;

  return (
    <section className="relative w-full overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-white" aria-label={lab.title}>
      <div className="aspect-video w-full">
        <svg viewBox="0 0 640 360" preserveAspectRatio="xMidYMid meet" className="h-full w-full" role="img" aria-labelledby={titleId}>
          <title id={titleId}>{spoken}</title>
          <defs>
            <pattern id={gridId} width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="rgba(0,0,0,0.10)" strokeWidth="1" opacity="1" /></pattern>
            <marker id={arrowId} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0L0 6L7 3Z" fill={palette.stroke} /></marker>
          </defs>
          <rect width="640" height="360" fill="#ffffff" />
          <rect width="640" height="360" fill={`url(#${gridId})`} />
          <LabHeader label={lab.title} status={palette.label} accent={palette.stroke} glow={palette.glow} />
          <LabScene
            kind={kind}
            value={currentPercent}
            target={solvedPercent}
            accent={palette.stroke}
            arrowId={arrowId}
            gradientId={`${arrowId}-fill`}
            leftLabel={labels.left.toUpperCase()}
            rightLabel={labels.right.toUpperCase()}
            controlText={`${reading.value} ${control.unit}`.trim().toUpperCase()}
            leftText={`${reading.left} ${labels.unit}`.trim()}
            leftValue={reading.left}
          />
        </svg>
      </div>

      <div className="border-t border-[var(--border)] bg-[var(--surface)] px-4 py-3">
        <div className="mb-3 flex items-start gap-3">
          <Readout name={labels.left} value={reading.left} unit={labels.unit} accent={palette.stroke} emphasise={isBalanced} />
          <span aria-hidden="true" className="mt-4 shrink-0 text-xs font-black text-[var(--text-tertiary)]">{isBalanced ? '=' : '≠'}</span>
          <Readout name={labels.right} value={reading.right} unit={labels.unit} accent={palette.stroke} emphasise={isBalanced} />
        </div>

        <div className="mb-2 flex items-center justify-between gap-3">
          <label htmlFor={inputId} className="truncate text-xs font-semibold tracking-wide text-[var(--text-primary)]">{control.label}</label>
          <output htmlFor={inputId} className="shrink-0 text-xs font-bold tabular-nums" style={{ color: palette.stroke }}>
            {reading.value} {control.unit}
          </output>
        </div>
        <input
          id={inputId}
          type="range"
          min="0"
          max="100"
          step="0.5"
          value={currentPercent}
          disabled={disabled}
          onChange={(event) => onChange(Number(event.target.value))}
          aria-valuetext={`${reading.value} ${control.unit}. ${drift}.`}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#e5e5ea] accent-[#00c4df] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c4df]"
        />
      </div>
      <p role="status" aria-live="polite" className="sr-only">{spoken}</p>
    </section>
  );
}
