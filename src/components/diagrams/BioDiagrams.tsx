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

function MicroscopeScale() {
  return (
    <Fig title="Fig. — Resolution ladder: light microscope (cells) → TEM (organelles) → SEM (surfaces)">
      <line x1="40" y1="60" x2="40" y2="200" stroke={faint} strokeWidth="1.5" />
      <line x1="40" y1="200" x2="365" y2="200" stroke={faint} strokeWidth="1.5" />
      <rect x="60" y="150" width="90" height="40" rx="4" fill="none" stroke={accent} strokeWidth="2" />
      <text x="105" y="168" textAnchor="middle" fill={accent} fontSize="10">Light: cells,</text>
      <text x="105" y="181" textAnchor="middle" fill={accent} fontSize="10">nuclei (~200nm)</text>
      <rect x="165" y="110" width="90" height="40" rx="4" fill="none" stroke={gold} strokeWidth="2" />
      <text x="210" y="128" textAnchor="middle" fill={gold} fontSize="10">TEM: membranes,</text>
      <text x="210" y="141" textAnchor="middle" fill={gold} fontSize="10">ribosomes (~1nm)</text>
      <rect x="270" y="70" width="90" height="40" rx="4" fill="none" stroke={ink} strokeWidth="2" />
      <text x="315" y="88" textAnchor="middle" fill={ink} fontSize="10">SEM: 3D</text>
      <text x="315" y="101" textAnchor="middle" fill={ink} fontSize="10">surfaces (~10nm)</text>
      <text x="200" y="30" textAnchor="middle" fill={ink} fontSize="12">resolution improves → smaller visible</text>
      <text x="200" y="218" textAnchor="middle" fill={faint} fontSize="10">magnification without resolution is empty enlargement</text>
    </Fig>
  );
}

function FluidMosaic() {
  return (
    <Fig title="Fig. — Fluid mosaic: bilayer + cholesterol + proteins; diffusion, channel, Na⁺/K⁺ pump">
      <circle cx="90" cy="90" r="9" fill="none" stroke={accent} strokeWidth="2" />
      <line x1="90" y1="99" x2="90" y2="112" stroke={accent} strokeWidth="2" />
      <circle cx="310" cy="90" r="9" fill="none" stroke={accent} strokeWidth="2" />
      <line x1="310" y1="99" x2="310" y2="112" stroke={accent} strokeWidth="2" />
      {[115, 140, 165, 235, 260, 285].map((x) => (
        <g key={x}>
          <circle cx={x} cy="90" r="9" fill="none" stroke={ink} strokeWidth="1.5" />
          <line x1={x} y1="99" x2={x} y2="112" stroke={ink} strokeWidth="1.5" />
          <circle cx={x} cy="138" r="9" fill="none" stroke={ink} strokeWidth="1.5" />
          <line x1={x} y1="129" x2={x} y2="116" stroke={ink} strokeWidth="1.5" />
        </g>
      ))}
      <rect x="185" y="70" width="30" height="80" rx="6" fill="none" stroke={gold} strokeWidth="2" />
      <text x="200" y="165" textAnchor="middle" fill={gold} fontSize="10">channel</text>
      <rect x="330" y="70" width="34" height="80" rx="6" fill="none" stroke="#f87171" strokeWidth="2" />
      <text x="347" y="165" textAnchor="middle" fill="#f87171" fontSize="10">Na⁺/K⁺ pump</text>
      <text x="60" y="70" fill={faint} fontSize="10">outside</text>
      <text x="60" y="185" fill={faint} fontSize="10">inside</text>
      <line x1="40" y1="80" x2="365" y2="60" stroke={faint} strokeWidth="1" strokeDasharray="4 3" />
      <text x="250" y="45" fill={faint} fontSize="10">simple diffusion ↓ gradient</text>
    </Fig>
  );
}

function EndomembranePath() {
  const steps: [number, string][] = [[60, "RER"], [150, "vesicle"], [240, "Golgi"], [330, "membrane/lysosome"]];
  return (
    <Fig title="Fig. — Secretory pathway: RER → vesicle → Golgi (cis→trans) → membrane or lysosome">
      {steps.map(([x, label], i) => (
        <g key={label}>
          <rect x={x - 32} y="95" width="64" height="44" rx="8" fill="none" stroke={i === 2 ? gold : accent} strokeWidth="2" />
          <text x={x} y="113" textAnchor="middle" fill={ink} fontSize="10">{label}</text>
          <text x={x} y="128" textAnchor="middle" fill={faint} fontSize="9">{["translate", "carry", "modify", "deliver"][i]}</text>
          {i < 3 && <line x1={x + 32} y1="117" x2={x + 58} y2="117" stroke={ink} strokeWidth="2" />}
        </g>
      ))}
      <text x="200" y="50" textAnchor="middle" fill={ink} fontSize="12">nucleus feeds the RER; Golgi cis receives, trans ships</text>
      <text x="200" y="200" textAnchor="middle" fill={faint} fontSize="10">lysosomes digest • secretions exit by exocytosis</text>
    </Fig>
  );
}

function GpcrCascade() {
  const nodes: [number, string, string][] = [[55, "ligand +", "GPCR"], [150, "G-protein", "activated"], [250, "adenylyl", "cyclase→cAMP"], [345, "PK-A", "response"] ];
  return (
    <Fig title="Fig. — GPCR cascade: reception → G-protein → cAMP → kinase amplification">
      {nodes.map(([x, a, b], i) => (
        <g key={a}>
          <circle cx={x} cy="115" r="34" fill="none" stroke={i === 0 ? accent : i === 3 ? gold : ink} strokeWidth="2" />
          <text x={x} y="112" textAnchor="middle" fill={ink} fontSize="9">{a}</text>
          <text x={x} y="125" textAnchor="middle" fill={ink} fontSize="9">{b}</text>
          {i < 3 && <line x1={x + 34} y1="115" x2={x + 61} y2="115" stroke={ink} strokeWidth="2" />}
        </g>
      ))}
      <text x="200" y="50" textAnchor="middle" fill={ink} fontSize="12">one signal → many cAMP → thousands phosphorylated</text>
      <text x="200" y="200" textAnchor="middle" fill={faint} fontSize="10">kinases on • phosphatases off • amplification at every arrow</text>
    </Fig>
  );
}

function CellCycleClock() {
  return (
    <Fig title="Fig. — Cell-cycle clock: G1–S–G2–M with checkpoints; mitosis PMAT beside it">
      <circle cx="130" cy="120" r="70" fill="none" stroke={ink} strokeWidth="2" />
      <path d="M130 50 A70 70 0 0 1 200 120" fill="none" stroke={accent} strokeWidth="8" />
      <path d="M200 120 A70 70 0 0 1 130 190" fill="none" stroke={gold} strokeWidth="8" />
      <path d="M130 190 A70 70 0 0 1 60 120" fill="none" stroke={accent} strokeWidth="8" opacity="0.6" />
      <text x="130" y="124" textAnchor="middle" fill={ink} fontSize="11">G1•S•G2•M</text>
      <circle cx="200" cy="120" r="5" fill="#f87171" />
      <text x="272" y="80" fill="#f87171" fontSize="10">● G1/S, G2/M, M</text>
      <text x="272" y="95" fill={faint} fontSize="10">p53 guards them</text>
      {["P", "M", "A", "T"].map((s, i) => (
        <g key={s}>
          <circle cx={250 + i * 38} cy="150" r="15" fill="none" stroke={accent} strokeWidth="1.5" />
          <text x={250 + i * 38} y="155" textAnchor="middle" fill={ink} fontSize="11">{s}</text>
        </g>
      ))}
      <text x="307" y="185" textAnchor="middle" fill={faint} fontSize="10">condense•align•split•reform</text>
    </Fig>
  );
}

function CrossingOver() {
  return (
    <Fig title="Fig. — Panel A: crossing over at the chiasma · Panel B: normal vs nondisjunction">
      <text x="100" y="30" textAnchor="middle" fill={accent} fontSize="11">A: crossover</text>
      <line x1="40" y1="60" x2="160" y2="160" stroke={accent} strokeWidth="3" />
      <line x1="160" y1="60" x2="40" y2="160" stroke={ink} strokeWidth="3" />
      <circle cx="100" cy="110" r="7" fill="none" stroke={gold} strokeWidth="2" />
      <text x="100" y="185" textAnchor="middle" fill={gold} fontSize="10">chiasma: swap</text>
      <text x="300" y="30" textAnchor="middle" fill={accent} fontSize="11">B: segregation</text>
      <line x1="260" y1="60" x2="260" y2="160" stroke={accent} strokeWidth="3" />
      <line x1="300" y1="60" x2="300" y2="160" stroke={accent} strokeWidth="3" />
      <text x="280" y="185" textAnchor="middle" fill={accent} fontSize="10">normal 1:1 ✓</text>
      <line x1="340" y1="60" x2="340" y2="160" stroke="#f87171" strokeWidth="3" />
      <line x1="360" y1="60" x2="360" y2="160" stroke="#f87171" strokeWidth="1" strokeDasharray="3 3" />
      <text x="350" y="185" textAnchor="middle" fill="#f87171" fontSize="10">2:0 ✗ Down/Turner</text>
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
  "microscope-scale": MicroscopeScale,
  "fluid-mosaic": FluidMosaic,
  "endomembrane-path": EndomembranePath,
  "gpcr-cascade": GpcrCascade,
  "cell-cycle-clock": CellCycleClock,
  "crossing-over": CrossingOver,
};

export function BioDiagram({ diagramId, caption }: { diagramId: string; caption: string }) {
  const D = DIAGRAMS[diagramId];
  if (!D) return <p className="text-xs text-slate-500">[Diagram unavailable: {diagramId} — {caption}]</p>;
  return <D />;
}

export function hasDiagram(id: string) {
  return id in DIAGRAMS;
}
