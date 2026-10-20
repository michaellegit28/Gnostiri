/**
 * Biology families (round 2, JAMB pool).
 * Computational families re-derive by enumeration (Punnett gametes, capture
 * ratios, allele frequencies). Recall families use the dual-answer contract:
 * the table stores the key TWICE (independently authored) — a disagreement
 * drops the item, so a hallucinated key can never ship.
 */

import { int, pick, shuffled } from "./engine.mjs";
import { recallFamily, parseNum, pool3 } from "./families-support.mjs";

const trim = (v, dp) => String(Number(Number(v).toFixed(dp)));

/** Monohybrid Punnett — the verifier re-crosses the gametes from scratch. */
function crossRatio(parents, dom, rec) {
  const gametes = (g) => [g[0], g[1]].filter((x, i, a) => a.indexOf(x) === i);
  const combos = [];
  for (const a of gametes(parents[0])) {
    for (const b of gametes(parents[1])) {
      combos.push(a + b);
    }
  }
  const domCount = combos.filter((g) => g.includes(dom[0])).length;
  const recCount = combos.length - domCount;
  if (recCount === 0) return `all ${dom}`;
  if (domCount === 0) return `all ${rec}`;
  const g = (a, b) => (b === 0 ? a : g(b, a % b));
  const d = g(domCount, recCount);
  return `${domCount / d} ${dom} : ${recCount / d} ${rec}`;
}

const PUNNETT = [
  { trait: "height", dom: "tall", rec: "short", domA: "T", recA: "t", p1: "Tt", p2: "Tt" },
  { trait: "height", dom: "tall", rec: "short", domA: "T", recA: "t", p1: "Tt", p2: "tt" },
  { trait: "height", dom: "tall", rec: "short", domA: "T", recA: "t", p1: "TT", p2: "tt" },
  { trait: "height", dom: "tall", rec: "short", domA: "T", recA: "t", p1: "TT", p2: "Tt" },
  { trait: "height", dom: "tall", rec: "short", domA: "T", recA: "t", p1: "tt", p2: "tt" },
  { trait: "seed shape", dom: "round", rec: "wrinkled", domA: "R", recA: "r", p1: "Rr", p2: "Rr" },
  { trait: "seed shape", dom: "round", rec: "wrinkled", domA: "R", recA: "r", p1: "Rr", p2: "rr" },
  { trait: "seed shape", dom: "round", rec: "wrinkled", domA: "R", recA: "r", p1: "RR", p2: "rr" },
  { trait: "seed shape", dom: "round", rec: "wrinkled", domA: "R", recA: "r", p1: "rr", p2: "Rr" },
  { trait: "seed shape", dom: "round", rec: "wrinkled", domA: "R", recA: "r", p1: "rr", p2: "rr" },
  { trait: "flower colour", dom: "purple", rec: "white", domA: "P", recA: "p", p1: "Pp", p2: "Pp" },
  { trait: "flower colour", dom: "purple", rec: "white", domA: "P", recA: "p", p1: "Pp", p2: "pp" },
  { trait: "flower colour", dom: "purple", rec: "white", domA: "P", recA: "p", p1: "PP", p2: "Pp" },
  { trait: "seed colour", dom: "yellow", rec: "green", domA: "Y", recA: "y", p1: "Yy", p2: "Yy" },
  { trait: "seed colour", dom: "yellow", rec: "green", domA: "Y", recA: "y", p1: "Yy", p2: "yy" },
  { trait: "seed colour", dom: "yellow", rec: "green", domA: "Y", recA: "y", p1: "YY", p2: "yy" },
  { trait: "pod colour", dom: "green", rec: "yellow", domA: "G", recA: "g", p1: "Gg", p2: "gg" },
  { trait: "pod colour", dom: "green", rec: "yellow", domA: "G", recA: "g", p1: "Gg", p2: "Gg" },
  { trait: "pod shape", dom: "inflated", rec: "constricted", domA: "I", recA: "i", p1: "Ii", p2: "Ii" },
  { trait: "pod shape", dom: "inflated", rec: "constricted", domA: "I", recA: "i", p1: "Ii", p2: "ii" },
];

export const families = [
  {
    id: "punnett-monohybrid",
    topicSlug: "genetics-molecular-biology",
    label: "Monohybrid cross phenotypic ratio",
    params(r) {
      const row = pick(r, PUNNETT);
      return { ...row, ratio: crossRatio([row.p1, row.p2], row.dom, row.rec) };
    },
    answer: (p) => p.ratio,
    stem(p) {
      return `In ${p.trait === "height" ? "pea plants" : "peas"}, ${p.dom} is completely dominant to ${p.rec}. A cross between two parents of genotypes ${p.p1} and ${p.p2} is made. What phenotypic ratio is expected among the offspring?`;
    },
    distractors(p, r) {
      const key = p.ratio;
      const flip = key.replace(/: /g, " flipped: ");
      const genotypic = (() => {
        const gametes = (g) => [g[0], g[1]].filter((x, i, a) => a.indexOf(x) === i);
        const combos = [];
        for (const a of gametes(p.p1)) for (const b of gametes(p.p2)) combos.push(a + b);
        const counts = {};
        for (const c of combos) counts[c] = (counts[c] ?? 0) + 1;
        return Object.entries(counts)
          .map(([k, v]) => `${v} ${k}`)
          .join(" : ");
      })();
      const pool = [genotypic, `1 ${p.dom} : 3 ${p.rec}`, `9 ${p.dom} : 3 ${p.rec} : 3 ${p.dom} : 1 ${p.rec}`, `all ${p.dom}`, `1 ${p.dom} : 1 ${p.rec}`, `3 ${p.rec} : 1 ${p.dom}`];
      const out = [];
      for (const c of shuffled(r, pool)) {
        if (out.length === 3) break;
        if (c !== key && !out.includes(c)) out.push(c);
      }
      for (let e = 1; out.length < 3; e++) {
        const c = `${e + 1} ${p.dom} : 1 ${p.rec}`;
        if (c !== key && !out.includes(c)) out.push(c);
      }
      return out.slice(0, 3);
    },
    explanation(p) {
      return `Cross ${p.p1} x ${p.p2}: the offspring genotypes split ${p.ratio === `all ${p.dom}` ? "entirely dominant" : "between dominant and recessive"} → ${p.ratio}. 1:1 is the test-cross signature, 3:1 the monohybrid self-cross; a genotypic answer counts genotypes, not phenotypes.`;
    },
    hint: () => "Pair the gametes from each parent; dominant phenotype hides the heterozygote.",
    verify(p, chosen) {
      const rebuilt = crossRatio([p.p1, p.p2], p.dom, p.rec);
      return chosen === rebuilt && chosen === p.ratio && rebuilt.length > 0;
    },
  },
  {
    id: "microscope-magnification",
    topicSlug: "cell-biology",
    label: "Image size = real size x magnification",
    params(r) {
      const real = int(r, 10, 400);
      const mag = pick(r, [50, 100, 200, 400, 1000]);
      return { real, mag, image: real * mag };
    },
    answer: (p) => `${p.image} µm`,
    stem(p) {
      return `A cell ${p.real} µm across is viewed under a magnification of x${p.mag}. What is the size of the image?`;
    },
    distractors(p, r) {
      return pool3(r, p.image, [p.real + p.mag, p.image / 2, p.image * 2, Math.round(p.image / p.mag), p.real * 10], String).map((v) => `${v} µm`);
    },
    explanation(p) {
      return `image size = real size x magnification = ${p.real} x ${p.mag} = ${p.image} µm. Dividing by the magnification finds the real size, not the image.`;
    },
    hint: () => "Multiply the real size by the magnification factor.",
    verify(p, chosen) {
      return parseNum(chosen) === p.real * p.mag;
    },
  },
  {
    id: "mark-recapture",
    topicSlug: "ecology-evolution",
    label: "Population estimate: Lincoln-Petersen index",
    params(r) {
      const n1 = int(r, 20, 90);
      const n2 = int(r, 25, 80);
      let m = int(r, 4, 20);
      for (let g = 0; g < 60 && (n1 * n2) % m !== 0; g++) m = int(r, 4, 20);
      if ((n1 * n2) % m !== 0) m = 5;
      return { n1, n2, m, n: (n1 * n2) / m };
    },
    answer: (p) => p.n,
    stem(p) {
      return `${p.n1} animals were captured, marked and released. A second sample of ${p.n2} animals later contained ${p.m} marked individuals. Estimate the population size.`;
    },
    distractors(p, r) {
      return pool3(r, p.n, [p.n1 + p.n2, p.n1 * p.m, p.n2 * p.m, p.n / 2, p.n + p.n1], String);
    },
    explanation(p) {
      return `N = (n1 x n2)/m = (${p.n1} x ${p.n2})/${p.m} = ${p.n}. The marked proportion of the second sample estimates the marked proportion of the whole population: ${p.m}/${p.n2} = ${p.n1}/N.`;
    },
    hint: () => "marked fraction of sample = marked fraction of population.",
    verify(p, chosen) {
      return parseNum(chosen) === (p.n1 * p.n2) / p.m;
    },
  },
  {
    id: "hardy-weinberg",
    topicSlug: "ecology-evolution",
    label: "Hardy-Weinberg genotype frequencies",
    params(r) {
      const p = pick(r, [0.2, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]);
      const q = 1 - p;
      const ask = pick(r, ["2pq", "p2", "q2", "q"]);
      return { p, q, ask, val: ask === "2pq" ? 2 * p * q : ask === "p2" ? p * p : ask === "q2" ? q * q : q };
    },
    answer: (p) => trim(p.val, 2),
    stem(p) {
      const desc =
        p.ask === "2pq"
          ? "the expected frequency of the heterozygote (2pq)"
          : p.ask === "p2"
            ? "the expected frequency of the homozygous dominant genotype (p²)"
            : p.ask === "q2"
              ? "the expected frequency of the homozygous recessive genotype (q²)"
              : "the frequency of the recessive allele (q)";
      return `In a population at Hardy-Weinberg equilibrium, the frequency of the dominant allele is ${p.p}. What is ${desc}?`;
    },
    distractors(p, r) {
      const others = [
        p.ask === "2pq" ? p.p * p.p : 2 * p.p * (1 - p.p),
        p.ask === "q2" ? p.p * p.p : (1 - p.p) * (1 - p.p),
        p.ask === "q" ? p.p : 1 - p.p,
        p.val + 0.1,
        Math.max(0.01, p.val - 0.1),
      ];
      return pool3(r, p.val, others, trim);
    },
    explanation(p) {
      return `p + q = 1 so q = ${p.q}; genotype frequencies follow p² + 2pq + q² = 1: p² = ${trim(p.p * p.p, 2)}, 2pq = ${trim(2 * p.p * p.q, 2)}, q² = ${trim(p.q * p.q, 2)}. The heterozygote frequency is 2pq, not pq.`;
    },
    hint: () => "p² + 2pq + q² = 1, with q = 1 − p.",
    verify(p, chosen) {
      const want = p.ask === "2pq" ? 2 * p.p * p.q : p.ask === "p2" ? p.p * p.p : p.ask === "q2" ? p.q * p.q : p.q;
      return Math.abs(parseNum(chosen) - want) < 5e-3 && Math.abs(parseNum(chosen) - p.val) < 5e-3;
    },
  },
  {
    id: "food-chain-energy",
    topicSlug: "ecology-evolution",
    label: "Energy transfer between trophic levels",
    params(r) {
      const level = pick(r, ["producers", "primary consumers", "secondary consumers", "tertiary consumers"]);
      const next = { producers: "primary consumers", "primary consumers": "secondary consumers", "secondary consumers": "tertiary consumers", "tertiary consumers": "quaternary consumers" }[level];
      const energy = int(r, 2, 40) * 1000;
      const pct = pick(r, [10, 20]);
      return { level, next, energy, pct, transferred: (energy * pct) / 100 };
    },
    answer: (p) => `${p.transferred} kJ`,
    stem(p) {
      return `About ${p.pct}% of the energy in ${p.level} is transferred to ${p.next}. If ${p.energy} kJ is stored in ${p.level}, how much reaches ${p.next}?`;
    },
    distractors(p, r) {
      return pool3(r, p.transferred, [p.energy - p.transferred, p.energy * 2, p.energy / p.pct, (p.energy * p.pct) / 10, p.energy], String).map((v) => `${v} kJ`);
    },
    explanation(p) {
      return `${p.pct}% of ${p.energy} kJ = ${p.transferred} kJ reaches the next level; the rest is lost to respiration, heat and egestion. Subtracting the transfer gives the loss, not the gain.`;
    },
    hint: () => "Efficiency = (energy in next level / energy in level) x 100.",
    verify(p, chosen) {
      return parseNum(chosen) === (p.energy * p.pct) / 100;
    },
  },
  recallFamily({
    id: "organelle-functions",
    topicSlug: "cell-biology",
    label: "Organelle functions",
    hint: "Match the structure to the job it does inside the cell.",
    rows: [
      ["Which organelle is the site of aerobic respiration?", "mitochondrion", ["ribosome", "nucleus", "chloroplast"], "Mitochondria release energy from glucose as ATP; ribosomes make protein and the nucleus stores DNA.", "mitochondrion"],
      ["Which organelle translates mRNA into protein?", "ribosome", ["lysosome", "vacuole", "centriole"], "Ribosomes read the mRNA code and assemble amino acids into polypeptide chains.", "ribosome"],
      ["Which organelle contains the cell's chromosomes?", "nucleus", ["nucleolus is inside it", "Golgi body", "smooth ER"], "The nucleus is bounded by a nuclear envelope and holds the chromosomes.", "nucleus"],
      ["Which organelle modifies and packages proteins for secretion?", "Golgi apparatus", ["mitochondrion", "chloroplast", "peroxisome"], "The Golgi body adds carbohydrates to proteins and packs them into vesicles.", "Golgi apparatus"],
      ["Which organelle digests worn-out cell parts?", "lysosome", ["ribosome", "nucleolus", "cell wall"], "Lysosomes hold hydrolytic enzymes that break down debris and old organelles.", "lysosome"],
      ["Which structure is found in plant cells but not in animal cells?", "chloroplast", ["centriole", "lysosome", "mitochondrion"], "Chloroplasts contain chlorophyll and carry out photosynthesis; they are confined to plants (and algae).", "chloroplast"],
      ["Which organelle is the site of photosynthesis?", "chloroplast", ["mitochondrion", "ribosome", "Golgi apparatus"], "Chloroplasts house chlorophyll in thylakoid membranes where the light reactions run.", "chloroplast"],
      ["Which organelle synthesises lipids?", "smooth endoplasmic reticulum", ["rough endoplasmic reticulum", "nucleolus", "centrosome"], "The smooth ER lacks ribosomes and makes lipids and steroids.", "smooth endoplasmic reticulum"],
      ["Proteins for secretion are assembled on which surface?", "rough endoplasmic reticulum", ["smooth endoplasmic reticulum", "nuclear envelope", "cell membrane"], "The rough ER is studded with ribosomes that thread new proteins into its lumen.", "rough endoplasmic reticulum"],
      ["Which structure organises the spindle during animal cell division?", "centriole", ["cell wall", "large vacuole", "nucleolus"], "Centrioles (in the centrosome) form the spindle fibres of animal mitosis.", "centriole"],
      ["The fluid part of the cytoplasm in which organelles are suspended is called", "cytosol", ["stroma", "granum", "crista"], "The cytosol is the jelly-like solution filling the cytoplasm.", "cytosol"],
      ["Folded inner membranes of the mitochondrion are called", "cristae", ["thylakoids", "grana", "cisternae"], "Cristae increase surface area for the electron transport chain.", "cristae"],
      ["Stacks of thylakoids inside a chloroplast are called", "grana", ["cristae", "cisternae", "tubules"], "A granum is a stack of thylakoid discs bearing chlorophyll.", "grana"],
      ["Which organelle produces ribosomal RNA?", "nucleolus", ["Golgi apparatus", "lysosome", "vacuole"], "The nucleolus assembles rRNA and ribosomal subunits.", "nucleolus"],
      ["Which structure gives a plant cell its rigid shape?", "cell wall", ["cell membrane", "cytoskeleton", "vacuole"], "The cellulose cell wall resists turgor pressure and fixes the cell's shape.", "cell wall"],
      ["Water and salts accumulate in which plant-cell structure?", "large central vacuole", ["nucleus", "ribosome", "chloroplast"], "The tonoplast-bounded vacuole stores water, salts and pigments.", "large central vacuole"],
      ["Which organelle packages digestive enzymes into vesicles?", "Golgi apparatus", ["lysosome", "peroxisome", "nucleolus"], "The Golgi sends enzyme-filled vesicles that become lysosomes.", "Golgi apparatus"],
      ["Which cell part lets only certain substances pass?", "cell membrane", ["cell wall", "cytoskeleton", "vacuole"], "The phospholipid bilayer is partially permeable and controls transport.", "cell membrane"],
    ],
  }),
  recallFamily({
    id: "membrane-transport",
    topicSlug: "cell-biology",
    label: "Membrane transport processes",
    hint: "Decide first whether energy or a gradient drives the movement.",
    rows: [
      ["Movement of water from a dilute to a concentrated solution across a membrane is", "osmosis", ["diffusion of solutes", "active transport", "plasmolysis"], "Osmosis is the passive movement of water through a partially permeable membrane down its water-potential gradient.", "osmosis"],
      ["Which transport requires ATP?", "active transport", ["simple diffusion", "osmosis", "facilitated diffusion"], "Only active transport moves substances against the concentration gradient, paying with ATP.", "active transport"],
      ["Net movement of molecules from high to low concentration is", "diffusion", ["active transport", "endocytosis", "osmosis"], "Diffusion is passive and follows the concentration gradient.", "diffusion"],
      ["Uptake of dissolved minerals by root hairs against a gradient uses", "active transport", ["diffusion", "osmosis", "mass flow"], "Root hair cells spend ATP on carrier proteins to load minerals against the gradient.", "active transport"],
      ["A plant cell that has lost water until the cytoplasm pulls from the wall is", "plasmolysed", ["turgid", "flaccid but intact", "lysed"], "In plasmolysis the membrane pulls away from the cellulose wall.", "plasmolysed"],
      ["A plant cell fully inflated with water is said to be", "turgid", ["plasmolysed", "crenated", "flaccid"], "Turgor pressure makes the cell firm against its wall.", "turgid"],
      ["Animal cells placed in distilled water will", "burst", ["shrivel", "become turgid", "stay unchanged"], "Water enters by osmosis; without a wall the cell lyses.", "burst"],
      ["Movement of ions down a gradient through protein channels without ATP is", "facilitated diffusion", ["active transport", "endocytosis", "exocytosis"], "Facilitated diffusion is passive but needs a channel or carrier protein.", "facilitated diffusion"],
      ["Engulfing of large particles by the cell membrane is", "phagocytosis", ["pinocytosis of fluid", "exocytosis", "osmosis"], "Phagocytosis is 'cell eating' of solids; pinocytosis drinks fluids.", "phagocytosis"],
      ["Which solution has the higher water potential?", "dilute solution", ["concentrated solution", "both equal", "neither"], "Water potential rises as solute concentration falls; pure water is highest.", "dilute solution"],
      ["Release of substances from a cell in vesicles is", "exocytosis", ["endocytosis", "phagocytosis", "diffusion"], "Exocytosis fuses vesicles with the membrane to secrete contents.", "exocytosis"],
      ["Which factor most slows simple diffusion across a membrane?", "greater distance", ["steeper gradient", "larger surface area", "higher temperature"], "Fick's law: rate falls as the diffusion distance grows.", "greater distance"],
      ["The shrinkage of red blood cells in a strong salt solution is called", "crenation", ["haemolysis", "plasmolysis", "turgidity"], "Crenation is animal-cell shrinking in a hypertonic solution.", "crenation"],
      ["Bursting of red blood cells in distilled water is", "haemolysis", ["crenation", "plasmolysis", "turgidity"], "Haemolysis follows water entry by osmosis into a wall-less cell.", "haemolysis"],
      ["Carrier proteins in active transport are called", "pumps", ["channels only", "enzymes", "receptors"], "Pumps spend ATP to move solutes uphill across the membrane.", "pumps"],
      ["Sodium-glucose co-transport in the gut is an example of", "indirect active transport", ["simple diffusion", "osmosis", "facilitated diffusion alone"], "The sodium gradient (built by ATP) drags glucose in — secondary active transport.", "indirect active transport"],
    ],
  }),
  recallFamily({
    id: "enzymes",
    topicSlug: "bioenergetics-biochemistry",
    label: "Enzyme properties",
    hint: "Enzymes are biological catalysts — proteins, reusable, specific, pH sensitive.",
    rows: [
      ["Enzymes are chemically", "proteins", ["lipids", "carbohydrates", "nucleic acids"], "Enzymes are globular proteins that lower activation energy.", "proteins"],
      ["The substance an enzyme acts on is the", "substrate", ["product", "cofactor", "coenzyme"], "Substrates bind the active site and are converted to products.", "substrate"],
      ["After the reaction an enzyme is", "unchanged and reusable", ["used up", "converted to product", "degraded"], "Catalysts emerge unchanged and catalyse again.", "unchanged and reusable"],
      ["Enzymes speed reactions by", "lowering the activation energy", ["raising the temperature", "shifting the equilibrium", "adding product"], "They reduce the energy barrier, not the overall equilibrium.", "lowering the activation energy"],
      ["Most human enzymes work best at about", "37 °C", ["0 °C", "60 °C", "100 °C"], "Body temperature optimises molecular motion before denaturing sets in.", "37 °C"],
      ["Above the optimum temperature enzyme activity falls because the enzyme", "denatures", ["freezes", "is reused faster", "multiplies"], "Heat breaks the bonds holding the active-site shape.", "denatures"],
      ["Lock-and-key describes enzyme", "specificity", ["reversibility", "denaturation", "inhibition"], "One active-site shape fits one substrate family.", "specificity"],
      ["A molecule that blocks the active site is a", "competitive inhibitor", ["coenzyme", "prosthetic group", "allosteric activator"], "Competitive inhibitors resemble the substrate and occupy the site.", "competitive inhibitor"],
      ["A non-competitive inhibitor binds", "away from the active site", ["in the active site", "to the substrate only", "to the product only"], "It changes the enzyme's shape, so substrate binding is distorted.", "away from the active site"],
      ["Enzyme activity is measured as the", "rate of product formation", ["mass of enzyme", "colour of substrate", "pH of solution"], "Activity tracks how fast product appears or substrate disappears.", "rate of product formation"],
      ["Pepsin works in the stomach at pH about", "2", ["7", "9", "11"], "Gastric pepsin suits the acid stomach; trypsin suits the alkaline ileum.", "2"],
      ["Amylase digests", "starch", ["protein", "fat", "cellulose"], "Amylase hydrolyses starch to maltose.", "starch"],
      ["Proteases digest", "protein", ["starch", "lipids", "nucleic acids"], "Proteases split proteins into peptides and amino acids.", "protein"],
      ["Lipases digest", "fats", ["starch", "proteins", "vitamins"], "Lipases hydrolyse triglycerides into fatty acids and glycerol.", "fats"],
      ["The induced-fit model says the active site", "moulds to the substrate", ["is rigid and unchanging", "destroys the substrate", "works without binding"], "Binding reshapes the site to catalyse the reaction.", "moulds to the substrate"],
      ["Cofactors that are organic molecules are called", "coenzymes", ["metal ions", "substrates", "inhibitors"], "NAD and FAD are organic coenzymes; Mg²⁺ and Zn²⁺ are inorganic cofactors.", "coenzymes"],
    ],
  }),
  recallFamily({
    id: "respiration-photosynthesis",
    topicSlug: "bioenergetics-biochemistry",
    label: "Respiration and photosynthesis",
    hint: "Track the gases and the ATP yield of each stage.",
    rows: [
      ["The first stage of respiration, common to aerobic and anaerobic pathways, is", "glycolysis", ["Krebs cycle", "electron transport chain", "fermentation only"], "Glycolysis splits glucose to pyruvate in the cytoplasm, with or without oxygen.", "glycolysis"],
      ["Glycolysis takes place in the", "cytoplasm", ["mitochondrial matrix", "inner membrane", "nucleus"], "It is the cytosolic stage; the Krebs cycle runs in the matrix.", "cytoplasm"],
      ["The Krebs cycle occurs in the", "mitochondrial matrix", ["cytoplasm", "thylakoid membrane", "stroma"], "Acetyl-CoA enters the matrix cycle.", "mitochondrial matrix"],
      ["The final electron acceptor in aerobic respiration is", "oxygen", ["NAD+", "carbon dioxide", "water"], "Oxygen accepts electrons and protons to form water.", "oxygen"],
      ["Most ATP of aerobic respiration is made by", "oxidative phosphorylation", ["glycolysis", "the Krebs cycle alone", "fermentation"], "Chemiosmosis on the inner membrane yields the bulk of ATP.", "oxidative phosphorylation"],
      ["Anaerobic respiration in muscle produces", "lactate", ["ethanol and CO2", "pyruvate only", "water and CO2"], "Mammalian fermentation reduces pyruvate to lactate.", "lactate"],
      ["Anaerobic respiration in yeast produces", "ethanol and carbon dioxide", ["lactate", "water and oxygen", "acetic acid"], "Alcoholic fermentation decarboxylates pyruvate to acetaldehyde, then ethanol.", "ethanol and carbon dioxide"],
      ["Aerobic respiration of one glucose molecule yields about", "30-32 ATP", ["2 ATP", "8 ATP", "100 ATP"], "Modern estimates give about 30-32 ATP per glucose.", "30-32 ATP"],
      ["The raw materials of photosynthesis are", "carbon dioxide and water", ["oxygen and glucose", "glucose and oxygen", "carbon dioxide and oxygen"], "Six CO2 plus six H2O make one glucose under light.", "carbon dioxide and water"],
      ["The light-dependent reactions occur in the", "thylakoid membranes", ["stroma", "cytoplasm", "matrix"], "Photosystems embedded in thylakoids capture light and split water.", "thylakoid membranes"],
      ["The Calvin cycle occurs in the", "stroma", ["thylakoid lumen", "cytoplasm", "matrix"], "The light-independent cycle fixes CO2 in the stroma.", "stroma"],
      ["Splitting of water by light is called", "photolysis", ["carboxylation", "reduction", "decarboxylation"], "Photolysis supplies electrons, protons and O2.", "photolysis"],
      ["The enzyme that fixes carbon dioxide in the Calvin cycle is", "rubisco", ["amylase", "pepsin", "ATP synthase"], "Rubisco attaches CO2 to ribulose bisphosphate.", "rubisco"],
      ["Oxygen released in photosynthesis comes from", "water", ["carbon dioxide", "glucose", "the air"], "Isotope tracing shows the O2 comes from photolysis of water.", "water"],
      ["The products of the light reactions used by the Calvin cycle are", "ATP and NADPH", ["glucose and oxygen", "NADH and FAD", "ADP and NADP+"], "The light reactions stock the cycle with ATP and reducing power.", "ATP and NADPH"],
      ["A limiting factor for photosynthesis at low light is", "light intensity", ["chlorophyll amount", "temperature only", "oxygen level"], "Light drives the rate until another factor becomes limiting.", "light intensity"],
    ],
  }),
  recallFamily({
    id: "dna-protein-synthesis",
    topicSlug: "genetics-molecular-biology",
    label: "DNA replication, transcription, translation",
    hint: "Follow the flow: DNA -> mRNA -> protein.",
    rows: [
      ["DNA replication is described as", "semi-conservative", ["conservative", "dispersive", "random"], "Each daughter duplex keeps one parental strand.", "semi-conservative"],
      ["The enzyme that unwinds the DNA double helix is", "helicase", ["ligase", "polymerase", "primase"], "Helicase breaks hydrogen bonds between the strands.", "helicase"],
      ["DNA polymerase extends a new strand", "5' to 3'", ["3' to 5'", "both directions", "randomly"], "Polymerase adds nucleotides only to the 3' end.", "5' to 3'"],
      ["The leading strand is made", "continuously", ["in short Okazaki fragments", "in both directions", "by ligase alone"], "The lagging strand is the one made in fragments.", "continuously"],
      ["Short fragments on the lagging strand are called", "Okazaki fragments", ["primers only", "exons", "codons"], "They are later joined by ligase.", "Okazaki fragments"],
      ["The enzyme that joins DNA fragments is", "ligase", ["helicase", "polymerase", "nuclease"], "Ligase seals the nicks in the sugar-phosphate backbone.", "ligase"],
      ["Transcription produces", "mRNA", ["protein", "DNA", "tRNA as the product"], "RNA polymerase copies a gene into messenger RNA.", "mRNA"],
      ["Transcription takes place in the", "nucleus", ["cytoplasm", "ribosome", "Golgi apparatus"], "In eukaryotes the gene is transcribed in the nucleus.", "nucleus"],
      ["Translation takes place at the", "ribosome", ["nucleolus", "lysosome", "membrane"], "Ribosomes read codons with the help of tRNA anticodons.", "ribosome"],
      ["Three bases coding for one amino acid are a", "codon", ["anticodon is on tRNA", "exon", "intron"], "A codon is the mRNA triplet; its complement on tRNA is the anticodon.", "codon"],
      ["The start codon is", "AUG", ["UAA", "UGA", "UAG"], "AUG codes methionine and opens the reading frame.", "AUG"],
      ["Which codons stop translation?", "UAA, UAG, UGA", ["AUG only", "AAA and GGG", "CCC and TTT"], "These three are stop codons; they bind release factors, not tRNAs.", "UAA, UAG, UGA"],
      ["Sections removed from pre-mRNA are", "introns", ["exons", "codons", "promoters"], "Splicing removes introns and joins exons.", "introns"],
      ["The sequence read during translation is built from", "exons", ["introns", "promoters", "terminators"], "Mature mRNA contains the exons in order.", "exons"],
      ["In base pairing, adenine pairs with", "thymine in DNA", ["guanine", "cytosine", "uracil"], "A-T (two bonds); in RNA, A-U.", "thymine in DNA"],
      ["Guanine pairs with", "cytosine", ["adenine", "thymine", "uracil"], "G-C shares three hydrogen bonds.", "cytosine"],
    ],
  }),
  recallFamily({
    id: "inheritance-terms",
    topicSlug: "genetics-molecular-biology",
    label: "Inheritance vocabulary and rules",
    hint: "Name the cross design before working out ratios.",
    rows: [
      ["The observable trait is the", "phenotype", ["genotype", "allele", "locus"], "Phenotype is what shows; genotype is the hidden allele pair.", "phenotype"],
      ["Different forms of a gene are", "alleles", ["chromosomes", "loci only", "genes of another trait"], "Alleles occupy the same locus on homologous chromosomes.", "alleles"],
      ["An organism with two identical alleles is", "homozygous", ["heterozygous", "codominant", "haemizygous"], "Homozygous means like alleles; heterozygous means unlike.", "homozygous"],
      ["A cross with an individual of unknown genotype and a homozygous recessive is a", "test cross", ["back cross only", "self-cross", "reciprocal cross"], "The test cross exposes hidden recessive alleles in the offspring.", "test cross"],
      ["Alleles that both show in a heterozygote are", "codominant", ["dominant and recessive", "linked", "sex-linked"], "In codominance (e.g. AB blood) neither allele masks the other.", "codominant"],
      ["Genes on the X chromosome show", "sex linkage", ["autosomal linkage", "cytoplasmic inheritance", "polygenic inheritance"], "Males (XY) express recessive X alleles they inherit.", "sex linkage"],
      ["A gene carried on both sex chromosomes in birds but not by the Y pattern in humans is said to be", "sex-linked", ["autosomal", "mitochondrial", "polygenic"], "Sex-linked genes sit on a sex chromosome.", "sex-linked"],
      ["A trait controlled by many genes is", "polygenic", ["monogenic", "sex-linked", "codominant"], "Height and skin colour involve many loci with additive effects.", "polygenic"],
      ["Genes located close together on a chromosome are", "linked", ["assorted independently", "codominant", "pleiotropic"], "Linked genes break the 9:3:3:1 ratio of independent assortment.", "linked"],
      ["The exchange of segments between chromatids is", "crossing over", ["duplication", "inversion", "translocation"], "Crossing over recombines linked alleles in prophase I.", "crossing over"],
      ["A male with normal vision whose mother was colour-blind has genotype", "X^N Y", ["X^N X^n", "X^n Y", "X^N Y^N"], "Males are XY and inherit the X from the mother; normal vision needs X^N.", "X^N Y"],
      ["Failure of chromosomes to separate in meiosis is", "non-disjunction", ["crossing over", "linkage", "assortment"], "Non-disjunction gives gametes with extra or missing chromosomes.", "non-disjunction"],
      ["Down's syndrome results from an extra chromosome", "21", ["13", "18", "23"], "Trisomy 21 causes Down's syndrome.", "21"],
      ["Mendel's law of segregation states that alleles", "separate in gamete formation", ["always blend", "stay paired in gametes", "sort by size"], "Only one allele of each pair enters a gamete.", "separate in gamete formation"],
      ["A cross between two heterozygotes showing independent assortment of two genes gives a 9:3:3:1 ratio only if the genes are", "on different chromosomes", ["linked", "sex-linked", "codominant"], "Independent assortment needs unlinked loci.", "on different chromosomes"],
      ["A person with blood group AB is an example of", "codominance", ["complete dominance", "epistasis", "pleiotropy"], "Both A and B antigens appear.", "codominance"],
    ],
  }),
  recallFamily({
    id: "blood-circulation",
    topicSlug: "human-physiology",
    label: "Blood and circulation",
    hint: "Follow the blood round: heart -> lungs -> heart -> body.",
    rows: [
      ["The liquid part of blood is", "plasma", ["serum minus fibrinogen", "lymph", "platelet suspension"], "Plasma is water with dissolved proteins, glucose, salts and hormones.", "plasma"],
      ["Which pigment carries oxygen in blood?", "haemoglobin", ["chlorophyll", "myoglobin only", "carotene"], "Haemoglobin's iron binds O2 reversibly in red cells.", "haemoglobin"],
      ["The blood cells that fight infection are", "white blood cells", ["red cells", "platelets", "plasma cells only"], "Leucocytes defend by phagocytosis and antibodies.", "white blood cells"],
      ["Cell fragments essential for clotting are", "platelets", ["red cells", "white cells", "plasma proteins"], "Platelets start the plug at a wound.", "platelets"],
      ["The largest artery in the body is the", "aorta", ["vena cava", "pulmonary artery", "carotid"], "The aorta leaves the left ventricle with oxygenated blood.", "aorta"],
      ["Blood returning from the lungs enters the", "left atrium", ["right atrium", "left ventricle first", "right ventricle"], "Oxygenated blood flows from lungs to left atrium to left ventricle.", "left atrium"],
      ["The valve between the left atrium and left ventricle is the", "bicuspid (mitral) valve", ["tricuspid", "aortic semilunar", "pulmonary valve"], "The mitral valve guards the left atrioventricular opening.", "bicuspid (mitral) valve"],
      ["Deoxygenated blood leaves the heart through the", "pulmonary artery", ["aorta", "pulmonary vein", "coronary artery"], "The pulmonary artery is the only artery carrying deoxygenated blood.", "pulmonary artery"],
      ["Which vessel carries blood away from the heart?", "artery", ["vein", "capillary", "venule"], "Arteries lead away from the heart even when deoxygenated.", "artery"],
      ["The pacemaker of the heart is the", "sino-atrial node", ["atrioventricular node", "Purkyne tissue", "septum"], "The SA node in the right atrium sets the rhythm.", "sino-atrial node"],
      ["Which chamber has the thickest wall?", "left ventricle", ["right ventricle", "left atrium", "right atrium"], "It pumps blood round the whole body, so it works hardest.", "left ventricle"],
      ["The exchange of gases with tissues occurs in", "capillaries", ["arteries", "veins", "ventricles"], "Capillary walls are one cell thick.", "capillaries"],
      ["Blood plasma becomes lymph when it", "enters lymphatic vessels from tissue fluid", ["clots", "leaves the aorta", "reaches the lungs"], "Lymph is tissue fluid drained into lymphatics.", "enters lymphatic vessels from tissue fluid"],
      ["A blood pressure reading of 120/80 means", "120 systolic, 80 diastolic", ["120 diastolic, 80 systolic", "both systolic", "both diastolic"], "Systole is ventricular contraction; diastole is relaxation.", "120 systolic, 80 diastolic"],
      ["Red blood cells are made in the", "bone marrow", ["liver", "spleen", "lymph nodes"], "Marrow erythropoiesis makes erythrocytes.", "bone marrow"],
      ["Which blood group is the universal donor for red cells?", "O negative", ["AB positive", "A positive", "AB negative"], "O negative lacks A, B and RhD antigens.", "O negative"],
      ["Tissue fluid differs from plasma mainly in its", "lower protein content", ["higher glucose", "absence of salts", "red colour"], "Large plasma proteins stay in the capillaries.", "lower protein content"],
      ["The vessel with valves that prevent backflow is the", "vein", ["artery", "capillary", "arteriole"], "Valves help low-pressure venous return.", "vein"],
    ],
  }),
  recallFamily({
    id: "digestion",
    topicSlug: "human-physiology",
    label: "Digestion and absorption",
    hint: "Match each enzyme to its substrate and site of action.",
    rows: [
      ["Digestion begins in the", "mouth", ["stomach", "duodenum", "ileum"], "Salivary amylase starts starch digestion in the mouth.", "mouth"],
      ["The enzyme in saliva is", "salivary amylase", ["pepsin", "trypsin", "lipase"], "Amylase hydrolyses starch to maltose.", "salivary amylase"],
      ["The stomach enzyme is", "pepsin", ["trypsin", "amylase", "maltase"], "Pepsin starts protein digestion in acid pH.", "pepsin"],
      ["Hydrochloric acid in the stomach", "activates pepsinogen and kills germs", ["digests starch", "neutralises bile", "emulsifies fat"], "Low pH gives pepsin its optimum and is antiseptic.", "activates pepsinogen and kills germs"],
      ["Bile is made in the", "liver", ["gall bladder", "pancreas", "stomach"], "The liver secretes bile; the gall bladder only stores it.", "liver"],
      ["Bile acts by", "emulsifying fats", ["digesting protein", "absorbing glucose", "neutralising acid"], "Bile salts break fat droplets into micelles — physical, not enzymatic.", "emulsifying fats"],
      ["Most digestion of food is completed in the", "small intestine", ["stomach", "large intestine", "mouth"], "Pancreatic and intestinal enzymes finish digestion in the ileum and duodenum.", "small intestine"],
      ["Pancreatic juice enters the", "duodenum", ["stomach", "colon", "oesophagus"], "The pancreatic duct opens into the duodenum.", "duodenum"],
      ["Amino acids are absorbed by", "villi of the ileum", ["stomach lining", "colon", "oesophagus"], "Villi give a huge surface for amino acid uptake.", "villi of the ileum"],
      ["Finger-like projections increasing absorption are", "villi", ["cilia", "rugae", "plicae"], "Each villus bears microvilli over its epithelium.", "villi"],
      ["The end product of starch digestion is", "glucose", ["maltose", "amino acids", "fatty acids"], "Maltase and other enzymes finish starch to glucose.", "glucose"],
      ["The end products of protein digestion are", "amino acids", ["fatty acids and glycerol", "glucose", "nucleotides"], "Proteases and peptidases release amino acids.", "amino acids"],
      ["Fatty acids and glycerol enter", "lacteals", ["blood capillaries directly", "the hepatic portal vein", "the colon"], "Fats pass into lymph lacteals inside each villus.", "lacteals"],
      ["Absorbed glucose first travels to", "the liver via the hepatic portal vein", ["the heart directly", "the lungs", "the kidneys"], "The hepatic portal system routes nutrients to the liver.", "the liver via the hepatic portal vein"],
      ["Water is mainly absorbed in the", "large intestine", ["stomach", "duodenum", "oesophagus"], "The colon reclaims water from indigestible residue.", "large intestine"],
      ["Peristalsis is", "waves of muscle pushing food along the gut", ["churning in the stomach", "enzyme secretion", "bile release"], "Circular and longitudinal muscles propel the bolus.", "waves of muscle pushing food along the gut"],
      ["The gullet is also called the", "oesophagus", ["trachea", "larynx", "pharynx only"], "The oesophagus carries food from pharynx to stomach.", "oesophagus"],
      ["Trypsin is secreted by the", "pancreas", ["stomach", "liver", "salivary glands"], "The pancreas makes trypsinogen, activated to trypsin in the duodenum.", "pancreas"],
    ],
  }),
  recallFamily({
    id: "gas-exchange-excretion",
    topicSlug: "human-physiology",
    label: "Gas exchange and excretion",
    hint: "Match each excretory organ with its waste and the driving gradient.",
    rows: [
      ["Gas exchange in humans occurs in the", "alveoli", ["bronchi", "trachea", "pleura"], "Alveoli give a huge thin surface for diffusion.", "alveoli"],
      ["Oxygen moves from alveolus to blood by", "diffusion", ["active transport", "osmosis", "filtration"], "The gradient (high PO2 in air, low in blood) drives passive diffusion.", "diffusion"],
      ["The functional unit of the kidney is the", "nephron", ["neuron", "alveolus", "villus"], "Each kidney holds about a million nephrons.", "nephron"],
      ["Filtration of blood happens in the", "glomerulus", ["loop of Henle", "collecting duct", "bladder"], "High pressure forces plasma into Bowman's capsule.", "glomerulus"],
      ["The main nitrogenous waste in humans is", "urea", ["uric acid", "ammonia", "creatine"], "The liver converts ammonia to urea for safe excretion.", "urea"],
      ["Most water is reabsorbed in the", "collecting duct", ["glomerulus", "bladder", "ureter"], "ADH controls water permeability of the collecting duct.", "collecting duct"],
      ["The hormone that controls water reabsorption is", "ADH (vasopressin)", ["insulin", "adrenaline", "thyroxine"], "ADH from the posterior pituitary opens aquaporins.", "ADH (vasopressin)"],
      ["Glucose is normally", "fully reabsorbed", ["excreted in urine", "converted to urea", "stored in the bladder"], "The proximal tubule reclaims all filtered glucose.", "fully reabsorbed"],
      ["Sugar in urine indicates a fault in", "reabsorption or blood-sugar control", ["urine storage", "urea production", "bile flow"], "Glycosuria follows hyperglycaemia or tubule damage.", "reabsorption or blood-sugar control"],
      ["Insulin lowers blood glucose by promoting", "uptake and storage as glycogen", ["urea production", "water loss", "fat digestion"], "Liver and muscle cells store glucose as glycogen under insulin.", "uptake and storage as glycogen"],
      ["The tube carrying urine from kidney to bladder is the", "ureter", ["urethra", "nephron", "ductus deferens"], "Ureters connect kidneys to the bladder.", "ureter"],
      ["Breathing rate is mainly driven by the level of", "carbon dioxide", ["oxygen", "nitrogen", "urea"], "CO2 (via pH) stimulates the respiratory centre.", "carbon dioxide"],
      ["The diaphragm during inhalation", "contracts and flattens", ["relaxes and domes", "stays still", "pushes upwards"], "Flattening enlarges the thorax and draws air in.", "contracts and flattens"],
      ["The lungs are enclosed in", "pleural membranes", ["peritoneum", "pericardium", "meninges"], "Pleurae seal the thoracic cavity around each lung.", "pleural membranes"],
      ["Excess water and salts are also lost through the", "skin", ["liver only", "pancreas", "spleen"], "Sweat excretes water, salts and a little urea.", "skin"],
      ["The main excretory organ of the human body is the", "kidney", ["skin", "liver", "lung"], "Kidneys regulate water, salts and nitrogenous waste.", "kidney"],
    ],
  }),
  recallFamily({
    id: "nerves-hormones",
    topicSlug: "human-physiology",
    label: "Nervous and hormonal control",
    hint: "Nerves are fast and electrical; hormones are slow and chemical.",
    rows: [
      ["The basic unit of the nervous system is the", "neuron", ["nephron", "axon is part of it", "ganglion"], "Neurons transmit impulses; neuroglia support them.", "neuron"],
      ["The gap between two neurons is a", "synapse", ["node", "junction of muscles", "receptor"], "Chemicals cross the synaptic cleft.", "synapse"],
      ["Impulses cross a synapse by", "neurotransmitter chemicals", ["direct electrical flow only", "osmosis", "hormones in blood"], "Acetylcholine diffuses across the cleft.", "neurotransmitter chemicals"],
      ["A reflex arc passes through the", "spinal cord", ["brain only", "cerebellum only", "thalamus first"], "Reflexes are quick because the cord decides without the brain.", "spinal cord"],
      ["The part of the brain controlling balance is the", "cerebellum", ["cerebrum", "medulla", "hypothalamus"], "The cerebellum coordinates posture and balance.", "cerebellum"],
      ["The hormone that prepares the body for action is", "adrenaline", ["insulin", "thyroxine", "ADH"], "Adrenaline raises heart rate, breathing rate and blood glucose.", "adrenaline"],
      ["Which hormone lowers blood sugar?", "insulin", ["glucagon", "adrenaline", "thyroxine"], "Insulin is the only hypoglycaemic hormone here.", "insulin"],
      ["The gland controlling metabolism is the", "thyroid", ["adrenal", "pancreas", "pituitary"], "Thyroxine sets the metabolic rate.", "thyroid"],
      ["The master gland of the endocrine system is the", "pituitary", ["thyroid", "adrenal", "pancreas"], "The pituitary controls other endocrine glands.", "pituitary"],
      ["The hormone from the posterior pituitary that retains water is", "ADH", ["oxytocin only here", "FSH", "ACTH"], "ADH acts on the collecting ducts.", "ADH"],
      ["The 'fight or flight' division of the autonomic system is the", "sympathetic", ["parasympathetic", "somatic", "central"], "Sympathetic activity mobilises; parasympathetic conserves.", "sympathetic"],
      ["After contraction, a muscle", "relaxes when the stimulus stops", ["stays contracted", "dies", "stops receiving nerve supply"], "Muscle relaxation follows calcium reuptake and nerve impulse end.", "relaxes when the stimulus stops"],
      ["Sense organs that detect stimuli are", "receptors", ["effectors", "relay neurons", "synapses"], "Receptors convert stimuli into impulses.", "receptors"],
      ["Muscles and glands that respond are", "effectors", ["receptors", "sensory neurons", "interneurons"], "Effectors carry out the response.", "effectors"],
      ["Impulses travel along a motor neuron as", "electrochemical changes", ["sound waves", "heat", "hormones"], "Action potentials are electrochemical events.", "electrochemical changes"],
      ["Diabetes mellitus type 1 is treated with", "insulin injections", ["thyroxine", "adrenaline", "ADH"], "Type 1 lacks insulin production from beta cells.", "insulin injections"],
    ],
  }),
  recallFamily({
    id: "ecology-terms",
    topicSlug: "ecology-evolution",
    label: "Ecological vocabulary",
    hint: "Place each term: habitat, population, community, ecosystem.",
    rows: [
      ["A group of organisms of one species in an area is a", "population", ["community", "ecosystem", "biome"], "A population is one species in one place at one time.", "population"],
      ["All populations in a habitat form a", "community", ["population", "niche", "biome"], "The community is all the interacting species together.", "community"],
      ["The role of an organism in its ecosystem is its", "niche", ["habitat", "trophic level only", "territory"], "Niche covers feeding, timing and interactions, not just address.", "niche"],
      ["Organisms that make their own food are", "producers", ["consumers", "decomposers", "parasites"], "Producers (plants, algae) photosynthesise.", "producers"],
      ["Fungi and bacteria that break down dead matter are", "decomposers", ["producers", "herbivores", "parasites"], "Saprotrophs recycle nutrients to the soil.", "decomposers"],
      ["An animal that eats only plants is a", "herbivore", ["carnivore", "omnivore", "detritivore"], "Herbivores are primary consumers.", "herbivore"],
      ["Animals eating the flesh of other animals are", "carnivores", ["herbivores", "producers", "autotrophs"], "Carnivores are secondary or higher consumers.", "carnivores"],
      ["A relationship where both partners benefit is", "mutualism", ["parasitism", "commensalism", "predation"], "Mutualism benefits both species (e.g. legumes and rhizobium).", "mutualism"],
      ["A relationship where one benefits and the other is harmed is", "parasitism", ["mutualism", "commensalism", "symbiosis only"], "The parasite gains, the host suffers.", "parasitism"],
      ["A tapeworm living in a human gut is a", "parasite", ["mutualist", "commensal", "saprotroph"], "It takes nutrients from the host.", "parasite"],
      ["The first organism to colonise bare rock is a", "pioneer species", ["climax species", "parasite", "secondary consumer"], "Lichens are classic pioneers of succession.", "pioneer species"],
      ["The stable end point of succession is the", "climax community", ["pioneer community", "population", "niche"], "The climax is the balanced final community.", "climax community"],
      ["Which process releases carbon dioxide into the atmosphere?", "respiration in living cells", ["photosynthesis", "nitrogen fixation", "protein synthesis"], "All living cells respire, releasing CO2; photosynthesis consumes it.", "respiration in living cells"],
      ["Bacteria that convert ammonia to nitrates are", "nitrifying bacteria", ["nitrogen-fixing bacteria", "denitrifying bacteria", "decay bacteria"], "Nitrosomonas and Nitrobacter run nitrification.", "nitrifying bacteria"],
      ["Bacteria that return nitrogen to the air are", "denitrifying bacteria", ["nitrifying", "nitrogen-fixing", "decomposing"], "Denitrifiers in waterlogged soil release N2.", "denitrifying bacteria"],
      ["The main source of energy for ecosystems is", "the sun", ["soil", "decomposers", "geothermal heat"], "Sunlight powers photosynthesis at the base of food chains.", "the sun"],
      ["Feeding relationships shown as interlocking chains form a", "food web", ["food chain only", "pyramid of numbers", "biome"], "Real ecosystems are webs, not simple chains.", "food web"],
      ["Removing one species from a food web", "disturbs the populations linked to it", ["has no effect", "only affects its predators", "stabilises the web"], "Each species is linked to several others.", "disturbs the populations linked to it"],
    ],
  }),
  recallFamily({
    id: "evolution-evidence",
    topicSlug: "ecology-evolution",
    label: "Evolution and natural selection",
    hint: "Selection needs variation, heritability and differential survival.",
    rows: [
      ["Natural selection acts on", "heritable variation", ["learned behaviour", "random mutations only", "environment alone"], "Only heritable differences pass to offspring.", "heritable variation"],
      ["The scientist who proposed natural selection was", "Charles Darwin", ["Gregor Mendel", "Louis Pasteur", "Jean Lamarck only"], "Darwin (and Wallace) framed selection by differential survival.", "Charles Darwin"],
      ["Structures with common ancestry but different function are", "homologous", ["analogous", "vestigial", "convergent"], "A bat's wing and a human arm share a bone pattern.", "homologous"],
      ["Structures with the same function but different origins are", "analogous", ["homologous", "vestigial", "parallel"], "Bird and insect wings evolved independently.", "analogous"],
      ["A useless remnant of an ancestral structure is", "vestigial", ["homologous", "analogous", "adaptive"], "The human appendix and whale pelvis are vestiges.", "vestigial"],
      ["An adaptation is", "a trait that raises fitness", ["any change in an organism", "a learned trick", "a mutation"], "Adaptations are inherited traits that aid survival and reproduction.", "a trait that raises fitness"],
      ["Antibiotic resistance in bacteria spreads because", "resistant survivors reproduce", ["the drug creates the genes", "bacteria plan it", "viruses transfer it"], "Selection favours pre-existing resistant mutants.", "resistant survivors reproduce"],
      ["Selection favouring one extreme form is", "directional", ["stabilising", "disruptive", "balancing"], "Directional selection shifts the mean (e.g. darker moths).", "directional"],
      ["Selection favouring the average form is", "stabilising", ["directional", "disruptive", "sexual"], "Stabilising selection cuts the extremes (e.g. human birth weight).", "stabilising"],
      ["Selection favouring both extremes over the average is", "disruptive", ["stabilising", "directional", "artificial"], "Disruptive selection can split a population.", "disruptive"],
      ["Breeding pigeons for show traits is", "artificial selection", ["natural selection", "genetic drift", "gene flow"], "Humans choose the parents.", "artificial selection"],
      ["Similar species on islands suggest", "descent from a common ancestor", ["identical origins everywhere", "convergence only", "no evolution"], "Island radiations show divergence from shared ancestors.", "descent from a common ancestor"],
      ["The wings of a bird and the wing of a butterfly are", "analogous", ["homologous", "vestigial", "serial"], "They serve flight but grew from different tissues.", "analogous"],
      ["Fossils in older rock layers show", "simpler forms", ["identical modern forms", "no life", "only plants"], "Simpler organisms generally appear deeper in the record.", "simpler forms"],
      ["Two species evolving together in response to each other show", "coevolution", ["convergent evolution", "stasis", "drift"], "Flowers and pollinators coevolve.", "coevolution"],
      ["The total genetic information of a population is its", "gene pool", ["genome of one individual", "chromosome set", "phenotype pool"], "The gene pool is all alleles in an interbreeding population.", "gene pool"],
    ],
  }),
  recallFamily({
    id: "plant-transport",
    topicSlug: "plant-biology",
    label: "Transport in plants",
    hint: "Xylem up, phloem both ways — transpiration drives the xylem flow.",
    rows: [
      ["Water travels up the stem in the", "xylem", ["phloem", "cambium", "cortex"], "Xylem vessels carry water and minerals upward.", "xylem"],
      ["Food is transported in the", "phloem", ["xylem", "pith", "epidermis"], "Phloem translocates sucrose from sources to sinks.", "phloem"],
      ["The loss of water from leaves is", "transpiration", ["respiration", "guttation only", "condensation"], "Transpiration is evaporation from leaf surfaces.", "transpiration"],
      ["Most transpiration happens through the", "stomata", ["cuticle", "lenticels", "root hairs"], "Stomatal pores dominate water loss.", "stomata"],
      ["The pulling force on the water column comes from", "evaporation from the leaves", ["root pressure only", "osmosis in the xylem", "phloem loading"], "Transpiration pull maintains the tension in xylem.", "evaporation from the leaves"],
      ["The movement of sucrose in phloem is called", "translocation", ["transpiration", "diffusion only", "respiration"], "Translocation is pressure-flow between source and sink.", "translocation"],
      ["Which tissue transports sugars?", "phloem", ["xylem", "sclerenchyma", "collenchyma"], "Sieve tubes and companion cells form phloem.", "phloem"],
      ["Root hairs absorb water by", "osmosis", ["active transport", "diffusion of sugars", "transpiration"], "Soil water is more dilute than the root-cell sap.", "osmosis"],
      ["Minerals enter root hairs by", "active transport", ["osmosis", "transpiration", "diffusion only"], "Minerals are usually scarcer in soil, so uptake needs ATP.", "active transport"],
      ["Gas exchange in a stem happens at", "lenticels", ["stomata", "xylem", "root caps"], "Lenticels are loose patches in woody stems.", "lenticels"],
      ["The upward movement of water is helped by", "cohesion between water molecules", ["phloem pumping", "stomatal closure", "root respiration"], "Cohesion (with adhesion) keeps the water column unbroken.", "cohesion between water molecules"],
      ["Wilting occurs when", "water loss exceeds uptake", ["phloem is blocked", "stomata close completely", "soil is flooded"], "Turgor falls as cells lose water faster than roots replace it.", "water loss exceeds uptake"],
      ["Rings of xylem in a woody stem are formed by the", "cambium", ["phloem", "cortex", "pith"], "The vascular cambium adds secondary xylem each year.", "cambium"],
      ["Trans location of sucrose needs", "companion cells", ["tracheids", "sclereids", "root cap cells"], "Companion cells load and unload sieve tubes using ATP.", "companion cells"],
      ["Water vapour is lost fastest when air is", "dry and windy", ["humid and still", "cool and dark", "night time"], "Dry air raises the gradient; wind thins the boundary layer.", "dry and windy"],
      ["Which experiment measures the rate of water uptake?", "potometer", ["thermometer", "barometer", "colorimeter"], "A potometer tracks the movement of an air bubble in the capillary.", "potometer"],
    ],
  }),
  recallFamily({
    id: "plant-reproduction",
    topicSlug: "plant-biology",
    label: "Plant reproduction and development",
    hint: "From flower to fruit: pollination, fertilisation, seed, dispersal, germination.",
    rows: [
      ["Transfer of pollen to the stigma is", "pollination", ["fertilisation", "germination", "dispersal"], "Pollination only moves pollen; fertilisation follows it.", "pollination"],
      ["Pollen lands on the", "stigma", ["ovule", "anther", "style"], "The stigma is the receptive tip of the carpel.", "stigma"],
      ["Pollen grows a tube down the", "style", ["filament", "sepal", "receptacle"], "The pollen tube carries male nuclei to the ovule.", "style"],
      ["Male gametes are produced in the", "anther", ["ovary", "stigma", "sepal"], "Anthers make pollen grains.", "anther"],
      ["Fertilisation in flowering plants is", "double fertilisation", ["single fusion only", "external", "by mitosis only"], "One male nucleus fuses with the egg, another with polar nuclei.", "double fertilisation"],
      ["After fertilisation the ovule becomes the", "seed", ["fruit", "stamen", "petal"], "The ovary becomes the fruit around the seed.", "seed"],
      ["The ovary develops into the", "fruit", ["seed", "stigma", "anther"], "The ovary wall becomes the pericarp.", "fruit"],
      ["The embryo plant inside a seed has", "plumule and radicle", ["only a radicle", "only a cotyledon pair", "endosperm only"], "Plumule grows into the shoot, radicle into the root.", "plumule and radicle"],
      ["Food stored for the seedling is in the", "cotyledons or endosperm", ["seed coat only", "testa", "micropyle"], "Dicots use cotyledons; many monocots rely on endosperm.", "cotyledons or endosperm"],
      ["Dispersal of seeds by wind is aided by", "parachute-like hairs", ["fleshy fruit", "hooks", "water"], "Dandelion pappus, willow hairs aid wind carriage.", "parachute-like hairs"],
      ["Seeds with hooks are carried by", "animals", ["wind", "water", "explosion"], "Burdock hooks catch fur.", "animals"],
      ["Coconut fruits are dispersed by", "water", ["wind", "explosion", "ants"], "The fibrous husk floats.", "water"],
      ["Germination needs", "water, oxygen and warmth", ["light and soil only", "fertiliser", "chlorophyll"], "Enzymes need water; respiration needs oxygen; warmth speeds metabolism.", "water, oxygen and warmth"],
      ["The first part of the seedling to appear is the", "radicle", ["plumule", "cotyledon", "flower"], "The radicle becomes the root.", "radicle"],
      ["Self-pollination occurs when pollen lands on", "the same flower or plant", ["another species", "a different species' stigma", "the soil"], "Self-pollination uses the same plant's pollen.", "the same flower or plant"],
      ["Flowers pollinated by insects are usually", "colourful and scented", ["small and green", "wind-borne and feathery", "underwater"], "Showy petals, scent and nectar attract insects.", "colourful and scented"],
    ],
  }),
  recallFamily({
    id: "infection-immunity",
    topicSlug: "human-physiology",
    label: "Disease and immunity",
    hint: "Separate the pathogen, the vector and the body's defences.",
    rows: [
      ["Organisms that cause disease are", "pathogens", ["antibodies", "antigens", "leukocytes"], "Pathogens include bacteria, viruses, fungi and protozoa.", "pathogens"],
      ["Malaria is transmitted by", "the female Anopheles mosquito", ["the tsetse fly", "the housefly", "blackfly"], "Plasmodium travels in mosquito saliva.", "the female Anopheles mosquito"],
      ["The malaria parasite belongs to", "Protoctista", ["Bacteria", "Fungi", "Viruses"], "Plasmodium is a protozoan.", "Protoctista"],
      ["HIV attacks", "white blood cells (T-helper lymphocytes)", ["red blood cells", "platelets", "plasma"], "HIV infects CD4 lymphocytes.", "white blood cells (T-helper lymphocytes)"],
      ["Proteins that recognise pathogens are", "antibodies", ["antigens are on the pathogen", "antibiotics", "toxins"], "Antibodies bind specific antigens.", "antibodies"],
      ["Chemicals made by pathogens that harm the body are", "toxins", ["antitoxins", "antibodies", "vaccines"], "Antitoxins neutralise toxins.", "toxins"],
      ["Immunity gained by vaccination is", "artificial active", ["natural active", "artificial passive", "natural passive"], "A vaccine makes the body produce its own antibodies.", "artificial active"],
      ["Antibodies passed from mother to baby in milk give", "natural passive immunity", ["artificial active", "natural active", "artificial passive"], "Ready-made antibodies are transferred without the infant making them.", "natural passive immunity"],
      ["Washing hands before eating chiefly interrupts the spread of", "disease", ["vitamins", "immunity", "antibiotics"], "Hand hygiene removes pathogens from the hands, cutting contact spread of disease.", "disease"],
      ["A substance that kills bacteria is an", "antibiotic", ["antitoxin", "antiseptic", "antibody"], "Antibiotics act inside the body; antiseptics act on surfaces.", "antibiotic"],
      ["Antibiotics are useless against", "viruses", ["bacteria", "some protozoa", "rickettsia"], "Viruses lack the ribosomes and walls that antibiotics target.", "viruses"],
      ["Mosquitoes that carry pathogens are", "vectors", ["hosts only", "pathogens themselves", "reservoirs"], "A vector transmits the pathogen between hosts.", "vectors"],
      ["First line of defence against pathogens includes", "skin and mucus", ["antibodies", "memory cells", "vaccines"], "Physical barriers act before immunity engages.", "skin and mucus"],
      ["Cells that engulf bacteria are", "phagocytes", ["lymphocytes", "platelets", "erythrocytes"], "Phagocytes digest microbes by phagocytosis.", "phagocytes"],
      ["Boosting a weakened immune response by injecting ready-made antibodies is", "passive immunisation", ["active immunisation", "vaccination", "natural immunity"], "Passive immunity starts at once but is short-lived.", "passive immunisation"],
      ["Cholera is mainly spread by", "contaminated water", ["airborne droplets", "insect bites", "skin contact"], "Vibrio cholerae travels in untreated water.", "contaminated water"],
    ],
  }),
];
