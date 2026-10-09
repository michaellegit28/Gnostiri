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

function SelectionModes() {
  const bell = (cx: number, w: number) => `M${cx - w} 180 C ${cx - w * 0.5} 180, ${cx - 12} 90, ${cx} 90 C ${cx + 12} 90, ${cx + w * 0.5} 180, ${cx + w} 180`;
  return (
    <Fig title="Fig. — Selection modes: directional shifts, stabilising narrows, disruptive splits">
      {[["directional", 70, 0], ["stabilising", 200, 0], ["disruptive", 330, 0]].map(([label, cx]) => (
        <g key={label as string}>
          <path d={bell(cx as number, 45)} fill="none" stroke={faint} strokeWidth="1.5" strokeDasharray="4 3" />
          <path
            d={label === "directional" ? bell((cx as number) + 22, 45) : label === "stabilising" ? bell(cx as number, 24) : bell(cx as number, 45)}
            fill="none" stroke={label === "disruptive" ? "#f87171" : accent} strokeWidth="2"
          />
          {label === "disruptive" && <path d={bell((cx as number) - 26, 22) + " " + bell((cx as number) + 26, 22)} fill="none" stroke={accent} strokeWidth="2" />}
          <text x={cx as number} y="205" textAnchor="middle" fill={ink} fontSize="10">{label}</text>
        </g>
      ))}
      <text x="200" y="30" textAnchor="middle" fill={faint} fontSize="10">dashed = before · solid = after</text>
    </Fig>
  );
}

function PhylogenySpeciation() {
  return (
    <Fig title="Fig. — Cladogram (outgroup, node, monophyletic clade) + allopatric split by barrier">
      <line x1="40" y1="60" x2="40" y2="170" stroke={ink} strokeWidth="1.5" />
      <circle cx="40" cy="170" r="4" fill={gold} />
      <line x1="40" y1="90" x2="110" y2="90" stroke={ink} strokeWidth="1.5" />
      <line x1="40" y1="140" x2="110" y2="140" stroke={ink} strokeWidth="1.5" />
      <text x="30" y="55" fill={faint} fontSize="10">outgroup</text>
      <text x="115" y="93" fill={ink} fontSize="10">sister taxa</text>
      <rect x="105" y="120" width="80" height="45" rx="6" fill="none" stroke={accent} strokeWidth="1.5" strokeDasharray="4 3" />
      <text x="145" y="183" textAnchor="middle" fill={accent} fontSize="10">monophyletic clade</text>
      <line x1="230" y1="60" x2="230" y2="170" stroke="#f87171" strokeWidth="6" />
      <text x="230" y="185" textAnchor="middle" fill="#f87171" fontSize="10">barrier (river)</text>
      <line x1="250" y1="100" x2="310" y2="100" stroke={accent} strokeWidth="2" />
      <line x1="250" y1="140" x2="310" y2="140" stroke={accent} strokeWidth="2" />
      <text x="330" y="105" fill={ink} fontSize="10">sp. A</text>
      <text x="330" y="145" fill={ink} fontSize="10">sp. B</text>
      <text x="290" y="50" textAnchor="middle" fill={ink} fontSize="11">allopatric speciation</text>
    </Fig>
  );
}

function GrowthSurvivorship() {
  return (
    <Fig title="Fig. — Panel A: J vs S growth with K · Panel B: survivorship types I, II, III">
      <text x="100" y="25" textAnchor="middle" fill={ink} fontSize="11">A: growth</text>
      <path d="M30 180 C 80 180, 110 120, 170 60" fill="none" stroke={gold} strokeWidth="2" />
      <path d="M30 180 C 90 178, 100 150, 120 148 L170 148" fill="none" stroke={accent} strokeWidth="2" />
      <line x1="30" y1="148" x2="175" y2="148" stroke={faint} strokeWidth="1" strokeDasharray="4 3" />
      <text x="178" y="140" fill={faint} fontSize="10">K</text>
      <text x="100" y="200" textAnchor="middle" fill={faint} fontSize="10">J-exponential vs S-logistic</text>
      <text x="300" y="25" textAnchor="middle" fill={ink} fontSize="11">B: survivorship</text>
      <path d="M220 60 C 280 60, 320 120, 360 180" fill="none" stroke={accent} strokeWidth="2" />
      <line x1="220" y1="60" x2="360" y2="180" stroke={gold} strokeWidth="2" />
      <path d="M220 60 C 230 140, 300 170, 360 180" fill="none" stroke={ink} strokeWidth="2" />
      <text x="290" y="200" textAnchor="middle" fill={faint} fontSize="10">I (us) · II (birds) · III (fish)</text>
    </Fig>
  );
}

function NicheCascade() {
  return (
    <Fig title="Fig. — Realized vs fundamental niches; orca→otter→urchin→kelp cascade">
      <ellipse cx="100" cy="110" rx="60" ry="45" fill="none" stroke={faint} strokeWidth="1.5" strokeDasharray="4 3" />
      <ellipse cx="100" cy="120" rx="32" ry="26" fill="none" stroke={accent} strokeWidth="2" />
      <text x="100" y="195" textAnchor="middle" fill={faint} fontSize="10">realised inside fundamental</text>
      {["orca", "otter", "urchin", "kelp"].map((t, i) => (
        <g key={t}>
          <rect x={210} y={45 + i * 38} width="110" height="28" rx="6" fill="none" stroke={i % 2 ? accent : ink} strokeWidth="1.5" />
          <text x={265} y={63 + i * 38} textAnchor="middle" fill={ink} fontSize="10">{t}</text>
          {i < 3 && <line x1={265} y1={73 + i * 38} x2={265} y2={83 + i * 38} stroke={ink} strokeWidth="1.5" />}
        </g>
      ))}
      <text x="265" y="30" textAnchor="middle" fill={ink} fontSize="11">remove otters → kelp forests fall</text>
    </Fig>
  );
}

function NitrogenPyramid() {
  return (
    <Fig title="Fig. — Nitrogen cycle (N₂→fixation→plants→denitrification) + 10% energy pyramid">
      <circle cx="90" cy="60" r="26" fill="none" stroke={accent} strokeWidth="2" />
      <text x="90" y="64" textAnchor="middle" fill={ink} fontSize="10">N₂ air</text>
      <circle cx="90" cy="150" r="26" fill="none" stroke={gold} strokeWidth="2" />
      <text x="90" y="146" textAnchor="middle" fill={ink} fontSize="9">root-nodule</text>
      <text x="90" y="158" textAnchor="middle" fill={ink} fontSize="9">fixers</text>
      <line x1="90" y1="86" x2="90" y2="124" stroke={ink} strokeWidth="1.5" />
      <line x1="116" y1="150" x2="180" y2="150" stroke={ink} strokeWidth="1.5" />
      <text x="160" y="140" textAnchor="middle" fill={faint} fontSize="9">nitrify→plants</text>
      {[["producers", 100], ["herbivores", 10], ["carnivores", 1]].map(([label, pct], i) => (
        <g key={label as string}>
          <rect x={230 + i * 22} y={170 - i * 42} width={150 - i * 44} height={34} rx="4" fill="none" stroke={i === 0 ? accent : faint} strokeWidth="1.5" />
          <text x={305} y={191 - i * 42} textAnchor="middle" fill={ink} fontSize="9">{label} {pct}%</text>
        </g>
      ))}
      <text x="305" y="30" textAnchor="middle" fill={ink} fontSize="11">only ~10% climbs each level</text>
    </Fig>
  );
}

function Biomagnification() {
  const levels: [string, number][] = [["phytoplankton", 3], ["zooplankton", 6], ["small fish", 10], ["bird (apex)", 15]];
  return (
    <Fig title="Fig. — Biomagnification up the chain + eutrophication cascade">
      {levels.map(([label, r], i) => (
        <g key={label}>
          <circle cx={50 + i * 70} cy="80" r={r} fill="none" stroke={i === 3 ? "#f87171" : accent} strokeWidth="2" />
          <text x={50 + i * 70} y="130" textAnchor="middle" fill={ink} fontSize="8">{label}</text>
        </g>
      ))}
      <text x="155" y="30" textAnchor="middle" fill={ink} fontSize="11">toxins concentrate upward</text>
      <text x="200" y="165" textAnchor="middle" fill={faint} fontSize="10">runoff → bloom → decay → hypoxia → die-off</text>
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} cx={60 + i * 70} cy="185" r={4 + i * 1.5} fill="none" stroke={gold} strokeWidth="1.5" />
      ))}
    </Fig>
  );
}

function WarsTimeline() {
  const marks: [number, string][] = [[60, "1914 WWI"], [110, "1918 armistice"], [160, "1919 Versailles"], [230, "1939 WWII"], [290, "1941 Pearl Harbor"], [350, "1945 end"]];
  return (
    <Fig title="Fig. — World Wars timeline: Sarajevo → Versailles → blitzkrieg → UN era">
      <line x1="40" y1="115" x2="370" y2="115" stroke={ink} strokeWidth="2" />
      {marks.map(([x, label], i) => (
        <g key={label}>
          <circle cx={x} cy="115" r="4" fill={i < 3 ? accent : gold} />
          <text x={x} y={i % 2 ? "140" : "95"} textAnchor="middle" fill={ink} fontSize="9">{label}</text>
        </g>
      ))}
      <text x="200" y="30" textAnchor="middle" fill={ink} fontSize="11">two wars, one chain of consequences</text>
      <text x="200" y="200" textAnchor="middle" fill={faint} fontSize="10">Versailles guilt → Depression → dictators → WWII</text>
    </Fig>
  );
}

function ColdWarBlocs() {
  return (
    <Fig title="Fig. — Cold War bipolarity: NATO west vs Warsaw Pact east, proxies between">
      <rect x="25" y="70" width="120" height="80" rx="8" fill="none" stroke={accent} strokeWidth="2" />
      <text x="85" y="100" textAnchor="middle" fill={ink} fontSize="10">NATO / USA</text>
      <text x="85" y="115" textAnchor="middle" fill={faint} fontSize="9">capitalism · containment</text>
      <rect x="255" y="70" width="120" height="80" rx="8" fill="none" stroke="#f87171" strokeWidth="2" />
      <text x="315" y="100" textAnchor="middle" fill={ink} fontSize="10">Warsaw Pact / USSR</text>
      <text x="315" y="115" textAnchor="middle" fill={faint} fontSize="9">communism · expansion</text>
      <line x1="145" y1="110" x2="255" y2="110" stroke={ink} strokeWidth="2" strokeDasharray="6 4" />
      <text x="200" y="100" textAnchor="middle" fill={gold} fontSize="9">iron curtain</text>
      <text x="200" y="30" textAnchor="middle" fill={ink} fontSize="11">never directly fought — fought through proxies</text>
      <text x="200" y="200" textAnchor="middle" fill={faint} fontSize="10">Korea · Cuba · Vietnam · Angola · Afghanistan</text>
    </Fig>
  );
}

function DecolonizationWaves() {
  const waves: [number, string, string][] = [[80, "1947", "South Asia (India, Pakistan)"], [200, "1957–60", "West Africa (Ghana, Nigeria)"], [320, "1960s–80s", "East & Southern Africa"]];
  return (
    <Fig title="Fig. — Decolonization waves: partition → Ghana's lead → apartheid's fall">
      {waves.map(([x, year, label]) => (
        <g key={year}>
          <rect x={x - 52} y="80" width="104" height="64" rx="8" fill="none" stroke={accent} strokeWidth="2" />
          <text x={x} y="103" textAnchor="middle" fill={gold} fontSize="11">{year}</text>
          <text x={x} y="120" textAnchor="middle" fill={ink} fontSize="8">{label}</text>
        </g>
      ))}
      <line x1="40" y1="150" x2="370" y2="150" stroke={faint} strokeWidth="1.5" />
      <text x="200" y="30" textAnchor="middle" fill={ink} fontSize="11">empire ends in waves, not at once</text>
      <text x="200" y="200" textAnchor="middle" fill={faint} fontSize="10">legacies: borders, economies, neo-colonial ties</text>
    </Fig>
  );
}

function RegionalHistoryTimelines() {
  const rows: [number, string, [number, string][]][] = [
    [50, "Nigeria", [[60, "1804 Sokoto"], [150, "1914 amalgamation"], [250, "1960 independence"], [330, "1967–70 civil war"]]],
    [120, "Israel", [[60, "1917 Balfour"], [160, "1948 state"], [260, "1967 Six-Day"], [340, "1993 Oslo"]]],
    [190, "Egypt", [[60, "1919 revolution"], [170, "1952 Free Officers"], [270, "1956 Suez"], [340, "1970s Sadat"]]],
  ];
  return (
    <Fig title="Fig. — Compulsory national histories: Nigeria · Israel · Egypt">
      {rows.map(([y, label, marks]) => (
        <g key={label}>
          <text x="20" y={y + 4} fill={gold} fontSize="9">{label}</text>
          <line x1="55" y1={y} x2="370" y2={y} stroke={ink} strokeWidth="1.5" />
          {marks.map(([x, ml]) => (
            <g key={ml}>
              <circle cx={x} cy={y} r="3.5" fill={accent} />
              <text x={x} y={y - 8} textAnchor="middle" fill={ink} fontSize="8">{ml}</text>
            </g>
          ))}
        </g>
      ))}
      <text x="200" y="30" textAnchor="middle" fill={ink} fontSize="11">each syllabus makes its national story compulsory</text>
      <text x="200" y="225" textAnchor="middle" fill={faint} fontSize="9">WAEC · Bagrut · Thanaweya require these by name</text>
    </Fig>
  );
}

function DoubleCirculation() {
  return (
    <Fig title="Fig. — Double circulation: pulmonary loop (lungs) and systemic loop (body)">
      <rect x="160" y="70" width="80" height="90" rx="10" fill="none" stroke={gold} strokeWidth="2" />
      <text x="200" y="105" textAnchor="middle" fill={ink} fontSize="10">HEART</text>
      <text x="200" y="122" textAnchor="middle" fill={faint} fontSize="8">4 chambers</text>
      <rect x="30" y="55" width="70" height="40" rx="8" fill="none" stroke={accent} strokeWidth="1.5" />
      <text x="65" y="80" textAnchor="middle" fill={accent} fontSize="9">lungs</text>
      <rect x="30" y="150" width="70" height="40" rx="8" fill="none" stroke="#f87171" strokeWidth="1.5" />
      <text x="65" y="175" textAnchor="middle" fill="#f87171" fontSize="9">body</text>
      <path d="M240 90 C 280 90, 280 75, 100 75" fill="none" stroke={accent} strokeWidth="2" />
      <path d="M100 170 C 280 170, 280 155, 240 155" fill="none" stroke="#f87171" strokeWidth="2" />
      <text x="270" y="112" fill={accent} fontSize="8">pulmonary</text>
      <text x="270" y="145" fill="#f87171" fontSize="8">systemic</text>
      <text x="200" y="40" textAnchor="middle" fill={ink} fontSize="10">blood is re-pressurised between loops</text>
      <text x="200" y="215" textAnchor="middle" fill={faint} fontSize="9">right side → lungs · left side → body</text>
    </Fig>
  );
}

function Nephron() {
  return (
    <Fig title="Fig. — The nephron: filter at the glomerulus, reabsorb along the tubule, ADH tunes the duct">
      <circle cx="90" cy="90" r="22" fill="none" stroke={gold} strokeWidth="2" />
      <text x="90" y="87" textAnchor="middle" fill={ink} fontSize="8">glomerulus</text>
      <text x="90" y="99" textAnchor="middle" fill={faint} fontSize="7">filter under pressure</text>
      <path d="M112 95 C 160 95, 170 60, 210 60 C 250 60, 250 130, 300 130" fill="none" stroke={accent} strokeWidth="2" />
      <text x="180" y="50" fill={accent} fontSize="8">reabsorb: glucose, water, salts</text>
      <path d="M300 130 L 350 130" fill="none" stroke="#f87171" strokeWidth="2" />
      <text x="325" y="150" textAnchor="middle" fill="#f87171" fontSize="8">collecting duct</text>
      <text x="325" y="162" textAnchor="middle" fill={faint} fontSize="7">ADH → more water kept</text>
      <text x="200" y="30" textAnchor="middle" fill={ink} fontSize="10">one million per kidney, filtering all blood every ~5 min</text>
      <text x="200" y="200" textAnchor="middle" fill={faint} fontSize="9">out: urea + excess water and salts = urine</text>
    </Fig>
  );
}

function TranspirationStream() {
  return (
    <Fig title="Fig. — Transpiration stream: evaporation pulls a cohesive water column from root to leaf">
      <rect x="30" y="150" width="90" height="50" rx="10" fill="none" stroke={accent} strokeWidth="1.5" />
      <text x="75" y="180" textAnchor="middle" fill={accent} fontSize="9">root hairs</text>
      <line x1="120" y1="140" x2="200" y2="80" stroke={ink} strokeWidth="3" />
      <text x="150" y="115" fill={faint} fontSize="9">xylem ↑</text>
      <ellipse cx="255" cy="60" rx="55" ry="30" fill="none" stroke={gold} strokeWidth="2" />
      <text x="255" y="57" textAnchor="middle" fill={gold} fontSize="9">leaf + stomata</text>
      <text x="255" y="72" textAnchor="middle" fill={faint} fontSize="8">evaporation pulls</text>
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={130 + i * 35} cy={133 - i * 22} r="2.5" fill="none" stroke={accent} strokeWidth="1.5" />
      ))}
      <path d="M310 40 C 340 30, 350 25, 360 18" fill="none" stroke="#f87171" strokeWidth="1.5" />
      <text x="355" y="40" fill="#f87171" fontSize="8">water vapour out</text>
      <text x="200" y="215" textAnchor="middle" fill={faint} fontSize="9">cohesion holds the column; tension does the lifting</text>
    </Fig>
  );
}

function FlowerParts() {
  return (
    <Fig title="Fig. — Flower anatomy: anther and stigma (fertilisation route) around the ovary">
      <circle cx="200" cy="95" r="70" fill="none" stroke={gold} strokeWidth="2" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <ellipse key={a} cx="200" cy="95" rx="70" ry="18" fill="none" stroke={faint} strokeWidth="1" transform={`rotate(${a} 200 95)`} />
      ))}
      <text x="200" y="28" textAnchor="middle" fill={faint} fontSize="9">petals — insect advert</text>
      <circle cx="180" cy="75" r="8" fill="none" stroke={accent} strokeWidth="2" />
      <text x="180" y="60" textAnchor="middle" fill={accent} fontSize="8">anther (pollen)</text>
      <circle cx="220" cy="75" r="8" fill="none" stroke="#f87171" strokeWidth="2" />
      <text x="222" y="60" textAnchor="middle" fill="#f87171" fontSize="8">stigma</text>
      <line x1="220" y1="83" x2="215" y2="105" stroke="#f87171" strokeWidth="1.5" />
      <ellipse cx="212" cy="115" rx="14" ry="11" fill="none" stroke={gold} strokeWidth="2" />
      <text x="212" y="118" textAnchor="middle" fill={ink} fontSize="8">ovary</text>
      <text x="200" y="185" textAnchor="middle" fill={faint} fontSize="9">ovule → seed · ovary wall → fruit</text>
    </Fig>
  );
}

function PeriodicTrends() {
  return (
    <Fig title="Fig. — Periodic trends: radius and ionisation energy turn at every period edge">
      {[0, 1, 2].map((r) => (
        <rect key={r} x={70 + r * 18} y={55 + r * 26} width={210 - r * 36} height={18} rx="4" fill="none" stroke={accent} strokeWidth="1.5" />
      ))}
      <text x="70" y="30" fill={ink} fontSize="9">radius ↓ across (protons pull harder)</text>
      <path d="M295 120 C 320 110, 320 70, 290 60" fill="none" stroke={gold} strokeWidth="2" markerEnd="url(#ah)" />
      <text x="345" y="90" fill={gold} fontSize="9">ionisation ↑</text>
      <path d="M70 150 C 50 140, 50 120, 68 108" fill="none" stroke="#f87171" strokeWidth="2" />
      <text x="20" y="140" fill="#f87171" fontSize="9">radius ↑ down</text>
      <text x="200" y="185" textAnchor="middle" fill={faint} fontSize="9">each new period opens a new shell — the saw-tooth restarts</text>
    </Fig>
  );
}

function MolecularShapes() {
  const atom = (x: number, y: number, label: string, color = accent) => (
    <g key={label}>
      <circle cx={x} cy={y} r="9" fill="none" stroke={color} strokeWidth="2" />
      <text x={x} y={y + 3} textAnchor="middle" fontSize="8" fill={ink}>{label}</text>
    </g>
  );
  return (
    <Fig title="Fig. — VSEPR shapes: lone pairs squeeze bond angles down">
      {atom(200, 60, "C", gold)}
      {atom(160, 60, "H", ink)}{atom(240, 60, "H", ink)}
      {atom(180, 30, "H", ink)}{atom(220, 30, "H", ink)}
      <line x1="191" y1="60" x2="169" y2="60" stroke={ink} strokeWidth="1.5" />
      <line x1="209" y1="60" x2="231" y2="60" stroke={ink} strokeWidth="1.5" />
      <line x1="192" y1="54" x2="188" y2="38" stroke={ink} strokeWidth="1.5" />
      <line x1="208" y1="54" x2="212" y2="38" stroke={ink} strokeWidth="1.5" />
      <text x="200" y="78" textAnchor="middle" fill={ink} fontSize="9">CH₄ tetrahedral 109.5°</text>
      {atom(80, 160, "O", gold)}{atom(120, 160, "H", ink)}{atom(88, 190, "H", ink)}
      <line x1="89" y1="160" x2="111" y2="160" stroke={ink} strokeWidth="1.5" />
      <line x1="82" y1="168" x2="88" y2="181" stroke={ink} strokeWidth="1.5" />
      <text x="100" y="212" textAnchor="middle" fill={ink} fontSize="9">H₂O bent 104.5° — 2 lone pairs squeeze</text>
      {atom(310, 160, "N", gold)}{atom(290, 190, "H", ink)}{atom(310, 195, "H", ink)}{atom(330, 190, "H", ink)}
      <line x1="308" y1="168" x2="292" y2="181" stroke={ink} strokeWidth="1.5" />
      <line x1="310" y1="169" x2="310" y2="186" stroke={ink} strokeWidth="1.5" />
      <line x1="312" y1="168" x2="328" y2="181" stroke={ink} strokeWidth="1.5" />
      <text x="310" y="212" textAnchor="middle" fill={ink} fontSize="9">NH₃ pyramidal 107°</text>
    </Fig>
  );
}

function MoleTriangle() {
  return (
    <Fig title="Fig. — The mole triangle: mass, particles, gas volume, solution — all through moles">
      <circle cx="200" cy="110" r="46" fill="none" stroke={gold} strokeWidth="2.5" />
      <text x="200" y="105" textAnchor="middle" fill={gold} fontSize="12">moles</text>
      <text x="200" y="122" textAnchor="middle" fill={faint} fontSize="8">n</text>
      <text x="200" y="38" textAnchor="middle" fill={ink} fontSize="10">mass = n × Mr</text>
      <text x="60" y="115" textAnchor="middle" fill={accent} fontSize="8">particles</text>
      <text x="60" y="128" textAnchor="middle" fill={faint} fontSize="7">× 6.02×10²³</text>
      <text x="340" y="115" textAnchor="middle" fill={accent} fontSize="8">volume / conc</text>
      <text x="340" y="128" textAnchor="middle" fill={faint} fontSize="7">24 dm³ · conc × vol</text>
      <line x1="155" y1="90" x2="80" y2="105" stroke={ink} strokeWidth="1.5" />
      <line x1="245" y1="90" x2="320" y2="105" stroke={ink} strokeWidth="1.5" />
      <text x="200" y="215" textAnchor="middle" fill={faint} fontSize="9">every calculation routes through n — balance the equation first</text>
    </Fig>
  );
}

function ElectrolysisCell() {
  return (
    <Fig title="Fig. — Electrolysis: cations to the cathode (reduction), anions to the anode (oxidation)">
      <rect x="40" y="85" width="70" height="30" rx="6" fill="none" stroke={gold} strokeWidth="2" />
      <text x="75" y="105" textAnchor="middle" fill={ink} fontSize="9">dc supply</text>
      <line x1="110" y1="100" x2="150" y2="100" stroke={ink} strokeWidth="2" />
      <rect x="150" y="55" width="22" height="110" rx="4" fill="none" stroke={accent} strokeWidth="2" />
      <text x="161" y="50" textAnchor="middle" fill={accent} fontSize="9">cathode −</text>
      <rect x="280" y="55" width="22" height="110" rx="4" fill="none" stroke="#f87171" strokeWidth="2" />
      <text x="291" y="50" textAnchor="middle" fill="#f87171" fontSize="9">anode +</text>
      <rect x="150" y="140" width="152" height="40" rx="8" fill="none" stroke={ink} strokeWidth="1.5" />
      <text x="226" y="165" textAnchor="middle" fill={faint} fontSize="8">electrolyte (molten or aqueous)</text>
      <line x1="110" y1="95" x2="112" y2="95" stroke={ink} strokeWidth="2" />
      <line x1="302" y1="100" x2="330" y2="100" stroke={ink} strokeWidth="2" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <circle cx={200 + i * 8} cy="120" r="5" fill="none" stroke={accent} strokeWidth="1.5" />
          <line x1={205 + i * 8} y1="120" x2={215 + i * 8} y2="120" stroke={accent} strokeWidth="1" />
        </g>
      ))}
      <text x="200" y="30" textAnchor="middle" fill={ink} fontSize="10">positive cations march left; negative anions right</text>
      <text x="200" y="215" textAnchor="middle" fill={faint} fontSize="9">label by electron flow: gain at cathode, loss at anode</text>
    </Fig>
  );
}

function SeriesParallelCircuit() {
  return (
    <Fig title="Fig. — Series vs parallel: the two circuits every paper draws">
      <text x="105" y="22" textAnchor="middle" fill={accent} fontSize="10">SERIES — one loop</text>
      <path d="M40 90 V40 H170 V140 H40 V110" fill="none" stroke={ink} strokeWidth="2" />
      <line x1="28" y1="94" x2="52" y2="94" stroke={gold} strokeWidth="2.5" />
      <line x1="37" y1="106" x2="43" y2="106" stroke={gold} strokeWidth="2.5" />
      <text x="20" y="98" textAnchor="middle" fill={faint} fontSize="9">+</text>
      <circle cx="80" cy="40" r="12" fill="none" stroke={accent} strokeWidth="2" />
      <line x1="72" y1="32" x2="88" y2="48" stroke={accent} strokeWidth="1.5" />
      <line x1="88" y1="32" x2="72" y2="48" stroke={accent} strokeWidth="1.5" />
      <circle cx="130" cy="40" r="12" fill="none" stroke={accent} strokeWidth="2" />
      <line x1="122" y1="32" x2="138" y2="48" stroke={accent} strokeWidth="1.5" />
      <line x1="138" y1="32" x2="122" y2="48" stroke={accent} strokeWidth="1.5" />
      <circle cx="105" cy="140" r="9" fill="none" stroke={accent} strokeWidth="1.5" />
      <text x="105" y="143" textAnchor="middle" fill={accent} fontSize="8">A</text>
      <text x="105" y="72" textAnchor="middle" fill={faint} fontSize="8">same current I everywhere</text>
      <text x="105" y="168" textAnchor="middle" fill={faint} fontSize="8">voltages share: V₁ + V₂ = supply</text>
      <text x="105" y="184" textAnchor="middle" fill={ink} fontSize="9">R total = R₁ + R₂ — adds up</text>
      <text x="295" y="22" textAnchor="middle" fill={accent} fontSize="10">PARALLEL — branches</text>
      <path d="M225 90 V55 H365 V135 H225 V100" fill="none" stroke={ink} strokeWidth="2" />
      <line x1="213" y1="94" x2="237" y2="94" stroke={gold} strokeWidth="2.5" />
      <line x1="222" y1="106" x2="228" y2="106" stroke={gold} strokeWidth="2.5" />
      <line x1="285" y1="55" x2="285" y2="83" stroke={ink} strokeWidth="2" />
      <circle cx="285" cy="95" r="12" fill="none" stroke={accent} strokeWidth="2" />
      <line x1="277" y1="87" x2="293" y2="103" stroke={accent} strokeWidth="1.5" />
      <line x1="293" y1="87" x2="277" y2="103" stroke={accent} strokeWidth="1.5" />
      <line x1="285" y1="107" x2="285" y2="135" stroke={ink} strokeWidth="2" />
      <line x1="325" y1="55" x2="325" y2="83" stroke={ink} strokeWidth="2" />
      <circle cx="325" cy="95" r="12" fill="none" stroke={accent} strokeWidth="2" />
      <line x1="317" y1="87" x2="333" y2="103" stroke={accent} strokeWidth="1.5" />
      <line x1="333" y1="87" x2="317" y2="103" stroke={accent} strokeWidth="1.5" />
      <line x1="325" y1="107" x2="325" y2="135" stroke={ink} strokeWidth="2" />
      <text x="295" y="168" textAnchor="middle" fill={faint} fontSize="8">full supply V on every branch</text>
      <text x="295" y="184" textAnchor="middle" fill={ink} fontSize="9">currents share: I = I₁ + I₂</text>
      <text x="200" y="215" textAnchor="middle" fill={faint} fontSize="9">1/R total = 1/R₁ + 1/R₂ — total resistance falls in parallel</text>
    </Fig>
  );
}

function HeatingCurve() {
  return (
    <Fig title="Fig. — The heating curve: sloped sections are mcΔT, flat sections are mL">
      <line x1="50" y1="30" x2="50" y2="200" stroke={ink} strokeWidth="1.5" />
      <line x1="50" y1="200" x2="370" y2="200" stroke={ink} strokeWidth="1.5" />
      <text x="55" y="22" textAnchor="start" fill={faint} fontSize="8">temperature (°C)</text>
      <text x="210" y="218" textAnchor="middle" fill={faint} fontSize="8">energy added →</text>
      <line x1="110" y1="130" x2="50" y2="130" stroke={faint} strokeWidth="1" strokeDasharray="3 3" />
      <line x1="260" y1="70" x2="50" y2="70" stroke={faint} strokeWidth="1" strokeDasharray="3 3" />
      <text x="45" y="134" textAnchor="end" fill={faint} fontSize="8">0 °C</text>
      <text x="45" y="74" textAnchor="end" fill={faint} fontSize="8">100 °C</text>
      <path d="M60 185 L110 130 L160 130 L260 70 L320 70 L355 48" fill="none" stroke={accent} strokeWidth="2.5" />
      <text x="80" y="170" textAnchor="middle" fill={faint} fontSize="8">ice warms — mcΔT</text>
      <text x="135" y="118" textAnchor="middle" fill={gold} fontSize="8">melting — E = mL (flat)</text>
      <text x="205" y="118" textAnchor="middle" fill={faint} fontSize="8">water warms — mcΔT</text>
      <text x="290" y="56" textAnchor="middle" fill={gold} fontSize="8">boiling — E = mL (flat)</text>
      <text x="345" y="40" textAnchor="middle" fill={faint} fontSize="8">steam</text>
      <text x="210" y="155" textAnchor="middle" fill={ink} fontSize="9">flat = state change — temperature frozen while bonds break</text>
    </Fig>
  );
}

function HalfLifeCurve() {
  return (
    <Fig title="Fig. — The half-life decay curve: half the sample falls every half-life">
      <line x1="50" y1="25" x2="50" y2="200" stroke={ink} strokeWidth="1.5" />
      <line x1="50" y1="200" x2="370" y2="200" stroke={ink} strokeWidth="1.5" />
      <text x="55" y="18" textAnchor="start" fill={faint} fontSize="8">mass remaining (g)</text>
      <text x="215" y="218" textAnchor="middle" fill={faint} fontSize="8">time (× half-life) →</text>
      <path d="M60 40 Q90 75 120 120 T180 160 T240 180 T300 190 T360 195" fill="none" stroke={accent} strokeWidth="2.5" />
      <line x1="50" y1="40" x2="60" y2="40" stroke={faint} strokeWidth="1" strokeDasharray="3 3" />
      <text x="45" y="44" textAnchor="end" fill={faint} fontSize="8">800</text>
      <line x1="120" y1="120" x2="120" y2="200" stroke={faint} strokeWidth="1" strokeDasharray="3 3" />
      <line x1="50" y1="120" x2="120" y2="120" stroke={faint} strokeWidth="1" strokeDasharray="3 3" />
      <text x="45" y="124" textAnchor="end" fill={faint} fontSize="8">400</text>
      <line x1="180" y1="160" x2="180" y2="200" stroke={faint} strokeWidth="1" strokeDasharray="3 3" />
      <line x1="50" y1="160" x2="180" y2="160" stroke={faint} strokeWidth="1" strokeDasharray="3 3" />
      <text x="45" y="164" textAnchor="end" fill={faint} fontSize="8">200</text>
      <line x1="240" y1="180" x2="240" y2="200" stroke={faint} strokeWidth="1" strokeDasharray="3 3" />
      <line x1="50" y1="180" x2="240" y2="180" stroke={faint} strokeWidth="1" strokeDasharray="3 3" />
      <text x="45" y="184" textAnchor="end" fill={faint} fontSize="8">100</text>
      <text x="255" y="72" textAnchor="middle" fill={accent} fontSize="9">halve every half-life</text>
      <text x="160" y="100" textAnchor="middle" fill={ink} fontSize="8">3 half-lives: 800 → 400 → 200 → 100</text>
      <text x="300" y="150" textAnchor="middle" fill={faint} fontSize="8">never quite reaches zero</text>
    </Fig>
  );
}

function FieldLines() {
  return (
    <Fig title="Fig. — Field lines: radial from a point, uniform between plates">
      <text x="70" y="22" textAnchor="middle" fill={accent} fontSize="10">GRAVITATIONAL — always inward</text>
      <circle cx="70" cy="115" r="14" fill="none" stroke={gold} strokeWidth="2" />
      <text x="70" y="119" textAnchor="middle" fill={gold} fontSize="9">M</text>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, idx) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = 70 + 18 * Math.cos(rad);
        const y1 = 115 + 18 * Math.sin(rad);
        const x2 = 70 + 58 * Math.cos(rad);
        const y2 = 115 + 58 * Math.sin(rad);
        return <line key={idx} x1={x1} y1={y1} x2={x2} y2={y2} stroke={accent} strokeWidth="1.2" />;
      })}
      <text x="70" y="205" textAnchor="middle" fill={faint} fontSize="8">g = GM/r² — double the distance, a quarter the field</text>
      <text x="215" y="22" textAnchor="middle" fill={accent} fontSize="10">ELECTRIC — charge decides</text>
      <circle cx="185" cy="80" r="11" fill="none" stroke={gold} strokeWidth="2" />
      <text x="185" y="84" textAnchor="middle" fill={gold} fontSize="9">+</text>
      <circle cx="185" cy="150" r="11" fill="none" stroke="#f87171" strokeWidth="2" />
      <text x="185" y="154" textAnchor="middle" fill="#f87171" fontSize="9">−</text>
      <line x1="185" y1="91" x2="185" y2="139" stroke={accent} strokeWidth="1.5" />
      <line x1="185" y1="69" x2="185" y2="58" stroke={accent} strokeWidth="1.2" />
      <line x1="185" y1="161" x2="185" y2="172" stroke={accent} strokeWidth="1.2" />
      <line x1="174" y1="91" x2="162" y2="98" stroke={accent} strokeWidth="1.2" />
      <line x1="196" y1="91" x2="208" y2="98" stroke={accent} strokeWidth="1.2" />
      <line x1="174" y1="139" x2="162" y2="132" stroke={accent} strokeWidth="1.2" />
      <line x1="196" y1="139" x2="208" y2="132" stroke={accent} strokeWidth="1.2" />
      <text x="278" y="118" textAnchor="middle" fill={faint} fontSize="8">out of +, into −</text>
      <text x="330" y="22" textAnchor="middle" fill={accent} fontSize="10">UNIFORM — plates</text>
      <rect x="285" y="55" width="70" height="5" fill={gold} />
      <rect x="285" y="165" width="70" height="5" fill="#f87171" />
      {[300, 305, 310, 315, 320, 325, 330, 335, 340].map((x, idx) => (
        <line key={idx} x1={x} y1="63" x2={x} y2="162" stroke={accent} strokeWidth="1" />
      ))}
      <text x="320" y="192" textAnchor="middle" fill={faint} fontSize="8">E = V/d — parallel, evenly spaced</text>
      <text x="200" y="218" textAnchor="middle" fill={faint} fontSize="9">line density = field strength — same convention in every field</text>
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
  "selection-modes": SelectionModes,
  "phylogeny-speciation": PhylogenySpeciation,
  "growth-survivorship": GrowthSurvivorship,
  "niche-cascade": NicheCascade,
  "nitrogen-pyramid": NitrogenPyramid,
  "biomagnification": Biomagnification,
  "wars-timeline": WarsTimeline,
  "cold-war-blocs": ColdWarBlocs,
  "decolonization-waves": DecolonizationWaves,
  "regional-history-timelines": RegionalHistoryTimelines,
  "double-circulation": DoubleCirculation,
  "nephron": Nephron,
  "transpiration-stream": TranspirationStream,
  "flower-parts": FlowerParts,
  "periodic-trends": PeriodicTrends,
  "molecular-shapes": MolecularShapes,
  "mole-triangle": MoleTriangle,
  "electrolysis-cell": ElectrolysisCell,
  "series-parallel": SeriesParallelCircuit,
  "heating-curve": HeatingCurve,
  "half-life-curve": HalfLifeCurve,
  "field-lines": FieldLines,
};

export function BioDiagram({ diagramId, caption }: { diagramId: string; caption: string }) {
  const D = DIAGRAMS[diagramId];
  if (!D) return <p className="text-xs text-slate-500">[Diagram unavailable: {diagramId} — {caption}]</p>;
  return <D />;
}

export function hasDiagram(id: string) {
  return id in DIAGRAMS;
}
