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
      <text x="320" y="91" fill={Math.abs(value - target) <= 4 ? accent : '#6e6e73'} fontSize="16" fontWeight="700" textAnchor="middle">{controlText}</text>
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
      <text x="320" y="160" fill={accent} fontSize="30" fontWeight="700" textAnchor="middle">{Math.round(angle)}°</text>
      <text x="320" y="318" fill="#6e6e73" fontSize="11" fontWeight="700" textAnchor="middle">INTERIOR ANGLE LOCK</text>
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
      {[{ x: 142, y: 132 }, { x: 148, y: 224 }, { x: 214, y: 182 }].map((virus, index) => <g key={index}><circle cx={virus.x} cy={virus.y} r="14" fill="#db2777" /><path d={`M${virus.x - 20} ${virus.y}H${virus.x + 20}M${virus.x} ${virus.y - 20}V${virus.x} ${virus.y + 20}`} stroke="#f472b6" strokeWidth="3" /></g>)}
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
  const dotGroup = (amount, startX, color) => Array.from({ length: amount }, (_, index) => <circle key={index} cx={startX + (index % 4) * 16} cy={126 + Math.floor(index / 4) * 28} r="5" fill={color} />);
  return (
    <>
      <rect x="92" y="94" width="456" height="176" rx="22" fill="#ffffff" stroke="#a1a1a6" strokeWidth="3" />
      <rect x="288" y="100" width="64" height="164" rx="14" fill="#cffafe" fillOpacity="0.7" stroke={accent} strokeWidth="3" strokeDasharray="6 5" />
      {dotGroup(outside, 128, '#8b5cf6')}{dotGroup(inside, 380, accent)}
      <path d="M244 174H278" stroke="#1d1d1f" strokeWidth="4" markerEnd={`url(#${arrowId})`} />
      <path d="M396 204H362" stroke="#1d1d1f" strokeWidth="4" markerEnd={`url(#${arrowId})`} />
      <text x="190" y="292" fill="#6e6e73" fontSize="11" fontWeight="700" textAnchor="middle">WATER POTENTIAL</text>
      <text x="450" y="292" fill={accent} fontSize="11" fontWeight="700" textAnchor="middle">CELL PRESSURE</text>
      <text x="320" y="82" fill="#6e6e73" fontSize="10" fontWeight="700" textAnchor="middle">SELECTIVE MEMBRANE</text>
    </>
  );
}

function LabScene({ kind, value, target, accent, arrowId, leftLabel, rightLabel, controlText, leftText, leftValue }) {
  switch (kind) {
    case 'circuit': return <CircuitLab value={value} target={target} accent={accent} arrowId={arrowId} leftLabel={leftLabel} rightLabel={rightLabel} controlText={controlText} leftText={leftText} />;
    case 'lens': return <LensLab value={value} target={target} accent={accent} arrowId={arrowId} controlText={controlText} leftText={leftText} />;
    case 'wave': return <WaveLab value={value} target={target} accent={accent} controlText={controlText} leftText={leftText} />;
    case 'particle': return <ParticleLab value={value} accent={accent} controlText={controlText} leftText={leftText} />;
    case 'reaction': return <ReactionLab value={value} target={target} accent={accent} arrowId={arrowId} controlText={controlText} leftText={leftText} />;
    case 'ph': return <PhLab value={value} accent={accent} gradientId={`${arrowId}-ph`} controlText={controlText} leftText={leftText} leftValue={leftValue} />;
    case 'atom': return <AtomLab value={value} accent={accent} controlText={controlText} leftText={leftText} />;
    case 'ratio': return <RatioLab value={value} target={target} accent={accent} controlText={controlText} leftText={leftText} />;
    case 'coordinate': return <CoordinateLab value={value} accent={accent} controlText={controlText} leftText={leftText} />;
    case 'geometry': return <GeometryLab value={value} accent={accent} controlText={controlText} leftText={leftText} />;
    case 'data': return <DataLab value={value} target={target} accent={accent} controlText={controlText} leftText={leftText} />;
    case 'cell': return <CellLab value={value} accent={accent} arrowId={arrowId} controlText={controlText} leftText={leftText} />;
    case 'ecosystem': return <EcosystemLab value={value} accent={accent} arrowId={arrowId} controlText={controlText} leftText={leftText} />;
    case 'lungs': return <LungsLab value={value} accent={accent} controlText={controlText} leftText={leftText} />;
    case 'osmosis': return <OsmosisLab value={value} accent={accent} arrowId={arrowId} controlText={controlText} leftText={leftText} />;
    case 'lever':
    default: return <LeverLab value={value} target={target} accent={accent} arrowId={arrowId} leftLabel={leftLabel} rightLabel={rightLabel} controlText={controlText} leftText={leftText} />;
  }
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
