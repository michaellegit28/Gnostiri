"use client";

import React from "react";

// Hand-drawn SVG study diagrams — offline-safe, no external images.
// Each diagram is labelled like a textbook figure. Add new ones here and
// reference by diagramId from lesson blocks: { type: "diagram", diagramId, caption }.

const ink = "#cbd5e1";
const accent = "#2dd4bf";
const gold = "#D4AF37";
const faint = "#64748b";

function Fig({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <figure className="my-4 overflow-x-auto rounded-xl border border-slate-700 bg-slate-950/60 p-3">
      <svg viewBox="0 0 400 230" className="mx-auto w-full max-w-md" role="img" aria-label={title}>
        {children}
      </svg>
      <figcaption className="mt-1 text-center text-xs text-slate-400">{title}</figcaption>
    </figure>
  );
}

function Mitochondrion() {
  return (
    <Fig title="Fig. 1 — Mitochondrion: double membrane, cristae (ETC), matrix (Krebs)">
      <ellipse cx="200" cy="115" rx="170" ry="85" fill="none" stroke={ink} strokeWidth="2" />
      <ellipse cx="200" cy="115" rx="150" ry="68" fill="none" stroke={accent} strokeWidth="1.5" strokeDasharray="6 4" />
      <path d="M80 90 q30 -25 60 0 q30 25 60 0 q30 -25 60 0 q30 25 60 0" fill="none" stroke={gold} strokeWidth="2" />
      <path d="M80 140 q30 -25 60 0 q30 25 60 0 q30 -25 60 0 q30 25 60 0" fill="none" stroke={gold} strokeWidth="2" />
      <text x="200" y="40" textAnchor="middle" fill={ink} fontSize="12">outer membrane</text>
      <text x="200" y="200" textAnchor="middle" fill={accent} fontSize="12">matrix (Krebs cycle)</text>
      <text x="200" y="118" textAnchor="middle" fill={gold} fontSize="12">cristae (electron transport chain)</text>
      <circle cx="120" cy="160" r="10" fill="none" stroke={faint} strokeWidth="1.5" />
      <text x="120" y="185" textAnchor="middle" fill={faint} fontSize="10">ribosome</text>
    </Fig>
  );
}

function Chloroplast() {
  return (
    <Fig title="Fig. 2 — Chloroplast: grana stacks (light reactions), stroma (Calvin cycle)">
      <ellipse cx="200" cy="115" rx="170" ry="85" fill="none" stroke={ink} strokeWidth="2" />
      {[130, 200, 270].map((x) => (
        <g key={x}>
          {[95, 108, 121].map((y) => (
            <rect key={y} x={x - 32} y={y} width="64" height="10" rx="3" fill="none" stroke={accent} strokeWidth="1.5" />
          ))}
          <text x={x} y="155" textAnchor="middle" fill={accent} fontSize="10">granum</text>
        </g>
      ))}
      <text x="200" y="40" textAnchor="middle" fill={ink} fontSize="12">thylakoid membranes</text>
      <text x="200" y="200" textAnchor="middle" fill={gold} fontSize="12">stroma (Calvin cycle)</text>
    </Fig>
  );
}

function EnzymeOptimum() {
  const curve = "M40 190 C 120 190, 150 60, 200 60 C 250 60, 280 190, 360 190";
  return (
    <Fig title="Fig. 3 — Enzyme rate vs temperature/pH: rise to optimum, denaturation crash">
      <line x1="40" y1="20" x2="40" y2="195" stroke={faint} strokeWidth="1.5" />
      <line x1="40" y1="195" x2="365" y2="195" stroke={faint} strokeWidth="1.5" />
      <path d={curve} fill="none" stroke={accent} strokeWidth="2.5" />
      <circle cx="200" cy="60" r="4" fill={gold} />
      <text x="200" y="45" textAnchor="middle" fill={gold} fontSize="11">optimum</text>
      <text x="300" y="150" fill={faint} fontSize="11">denaturation</text>
      <text x="30" y="110" fill={faint} fontSize="11">rate</text>
      <text x="200" y="212" textAnchor="middle" fill={faint} fontSize="11">temperature / pH →</text>
    </Fig>
  );
}

function MichaelisMenten() {
  return (
    <Fig title="Fig. 4 — Michaelis–Menten: rate plateaus at Vmax; Km is [S] at Vmax/2">
      <line x1="40" y1="20" x2="40" y2="195" stroke={faint} strokeWidth="1.5" />
      <line x1="40" y1="195" x2="365" y2="195" stroke={faint} strokeWidth="1.5" />
      <path d="M40 195 C 120 190, 140 70, 360 60" fill="none" stroke={accent} strokeWidth="2.5" />
      <line x1="40" y1="62" x2="365" y2="62" stroke={gold} strokeWidth="1" strokeDasharray="5 4" />
      <text x="368" y="65" fill={gold} fontSize="11">Vmax</text>
      <line x1="150" y1="62" x2="150" y2="195" stroke={faint} strokeWidth="1" strokeDasharray="5 4" />
      <text x="150" y="212" textAnchor="middle" fill={gold} fontSize="11">Km</text>
      <text x="30" y="110" fill={faint} fontSize="11">rate</text>
      <text x="200" y="212" textAnchor="middle" fill={faint} fontSize="11">[substrate] →</text>
    </Fig>
  );
}

function AtpCycle() {
  return (
    <Fig title="Fig. 5 — ATP cycle: respiration/photosynthesis charge it, work spends it">
      <ellipse cx="200" cy="60" rx="90" ry="28" fill="none" stroke={gold} strokeWidth="2" />
      <text x="200" y="65" textAnchor="middle" fill={gold} fontSize="13">ATP (charged)</text>
      <ellipse cx="200" cy="170" rx="90" ry="28" fill="none" stroke={ink} strokeWidth="2" />
      <text x="200" y="175" textAnchor="middle" fill={ink} fontSize="13">ADP + Pi (spent)</text>
      <path d="M290 70 C 330 100, 330 130, 292 158" fill="none" stroke={accent} strokeWidth="2" markerEnd="url(#ah)" />
      <path d="M108 158 C 70 130, 70 100, 110 72" fill="none" stroke={accent} strokeWidth="2" />
      <defs><marker id="ah" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="none" stroke={accent} strokeWidth="1.5" /></marker></defs>
      <text x="330" y="118" textAnchor="middle" fill={accent} fontSize="10">work: −30.5 kJ/mol</text>
      <text x="70" y="118" textAnchor="middle" fill={accent} fontSize="10">recharge</text>
    </Fig>
  );
}

function RespirationMap() {
  return (
    <Fig title="Fig. 6 — Respiration roadmap: cytoplasm → matrix → cristae">
      <rect x="20" y="80" width="100" height="70" rx="8" fill="none" stroke={accent} strokeWidth="2" />
      <text x="70" y="105" textAnchor="middle" fill={ink} fontSize="11">Glycolysis</text>
      <text x="70" y="122" textAnchor="middle" fill={faint} fontSize="10">cytoplasm</text>
      <text x="70" y="137" textAnchor="middle" fill={faint} fontSize="10">2 ATP + 2 NADH</text>
      <rect x="150" y="80" width="100" height="70" rx="8" fill="none" stroke={accent} strokeWidth="2" />
      <text x="200" y="105" textAnchor="middle" fill={ink} fontSize="11">Krebs cycle</text>
      <text x="200" y="122" textAnchor="middle" fill={faint} fontSize="10">matrix</text>
      <text x="200" y="137" textAnchor="middle" fill={faint} fontSize="10">CO₂ + carriers</text>
      <rect x="280" y="80" width="100" height="70" rx="8" fill="none" stroke={gold} strokeWidth="2" />
      <text x="330" y="105" textAnchor="middle" fill={ink} fontSize="11">ETC + ATP</text>
      <text x="330" y="122" textAnchor="middle" fill={faint} fontSize="10">cristae</text>
      <text x="330" y="137" textAnchor="middle" fill={faint} fontSize="10">O₂ → H₂O</text>
      <line x1="120" y1="115" x2="150" y2="115" stroke={ink} strokeWidth="2" />
      <line x1="250" y1="115" x2="280" y2="115" stroke={ink} strokeWidth="2" />
      <text x="200" y="40" textAnchor="middle" fill={ink} fontSize="12">glucose in → ~30 ATP out</text>
      <text x="200" y="200" textAnchor="middle" fill={faint} fontSize="11">no O₂ → fermentation (2 ATP, NAD⁺ recycled)</text>
    </Fig>
  );
}

function PhotosynthesisMap() {
  return (
    <Fig title="Fig. 7 — Photosynthesis: light reactions feed the Calvin cycle">
      <rect x="20" y="80" width="160" height="70" rx="8" fill="none" stroke={gold} strokeWidth="2" />
      <text x="100" y="105" textAnchor="middle" fill={ink} fontSize="11">Light reactions</text>
      <text x="100" y="122" textAnchor="middle" fill={faint} fontSize="10">thylakoids</text>
      <text x="100" y="137" textAnchor="middle" fill={faint} fontSize="10">ATP + NADPH + O₂</text>
      <rect x="220" y="80" width="160" height="70" rx="8" fill="none" stroke={accent} strokeWidth="2" />
      <text x="300" y="105" textAnchor="middle" fill={ink} fontSize="11">Calvin cycle</text>
      <text x="300" y="122" textAnchor="middle" fill={faint} fontSize="10">stroma</text>
      <text x="300" y="137" textAnchor="middle" fill={faint} fontSize="10">CO₂ → G3P sugar</text>
      <line x1="180" y1="115" x2="220" y2="115" stroke={ink} strokeWidth="2" />
      <text x="200" y="40" textAnchor="middle" fill={ink} fontSize="12">light + water + CO₂ → sugar + O₂</text>
      <text x="200" y="200" textAnchor="middle" fill={faint} fontSize="11">C4: split by cell · CAM: split by night/day</text>
    </Fig>
  );
}

const DIAGRAMS: Record<string, () => React.JSX.Element> = {
  mitochondrion: Mitochondrion,
  chloroplast: Chloroplast,
  "enzyme-optimum": EnzymeOptimum,
  "michaelis-menten": MichaelisMenten,
  "atp-cycle": AtpCycle,
  "respiration-map": RespirationMap,
  "photosynthesis-map": PhotosynthesisMap,
};

export function BioDiagram({ diagramId, caption }: { diagramId: string; caption: string }) {
  const D = DIAGRAMS[diagramId];
  if (!D) return <p className="text-xs text-slate-500">[Diagram unavailable: {diagramId} — {caption}]</p>;
  return <D />;
}

export function hasDiagram(id: string) {
  return id in DIAGRAMS;
}
