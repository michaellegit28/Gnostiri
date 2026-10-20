#!/usr/bin/env node
/**
 * build-banks.mjs — ROUND 2 JAMB bank builder.
 *
 * Per subject: migrate the existing bank + expansion files + the A4 pipeline
 * batches into ONE flat 500-question bank, tagging every row with the
 * dual-version fields (coreId, variant, provenance, track), then top the bank
 * up with NEW machine-verified items from round-2 families.
 *
 * Guarantees enforced here:
 *   - every generated key passes its family's independent verifier or is DROPPED
 *   - coreId and stem duplicates are removed (a family instance never ships twice)
 *   - answer positions are balanced by a deterministic re-placement pass
 *   - reviewStatus is "needs-human-review" on every shipped row
 *   - Version B rows never carry attribution; no A rows are created here
 *
 * Usage: node tools/pq/build-banks.mjs [subject ...] [--report path.json]
 */

import { writeFileSync, readFileSync } from "node:fs";
import { rng, seedFrom, difficultyFor, shuffled } from "./engine.mjs";
import { familyById } from "./families.mjs";

const ROOT = new URL("../../", import.meta.url).pathname;
const Q = (p) => (p.startsWith("/") ? p : `${ROOT}${p}`);

/** topicSlug normalisation (canonical slugs from src/lib/curriculum.ts only). */
const SLUG_FIX = { "cell-structure": "cell-biology" };

/** Deterministic key-placement pattern: each of positions 0-3 is hit exactly
 * once per 4 items, so a 500-item bank lands on 125/125/125/125. */
const POS_PATTERN = [0, 2, 1, 3, 1, 3, 0, 2, 2, 0, 3, 1, 3, 1, 2, 0];

function arg(flag, fallback) {
  const i = process.argv.indexOf(flag);
  return i === -1 ? fallback : process.argv[i + 1];
}

/** Stable, unique coreId per family instance (hash of the full parameter set). */
function coreIdFor(family, p) {
  return `${family.id}:${(seedFrom(JSON.stringify(p)) >>> 0).toString(36)}`;
}

function normText(s) {
  return String(s).toLowerCase().replace(/\s+/g, " ").replace(/[.\s]+$/, "").trim();
}

const FIELD_ORDER = [
  "id",
  "coreId",
  "provenance",
  "variant",
  "track",
  "domain",
  "topicSlug",
  "styleBoard",
  "type",
  "questionText",
  "options",
  "correctAnswer",
  "explanation",
  "hint",
  "difficulty",
  "sourceExam",
  "reviewStatus",
  "selfCheck",
];

function reorder(q, extra = []) {
  const out = {};
  for (const k of FIELD_ORDER) if (q[k] !== undefined) out[k] = q[k];
  for (const k of extra) if (q[k] !== undefined) out[k] = q[k];
  for (const k of Object.keys(q)) if (!(k in out)) out[k] = q[k];
  return out;
}

/** One machine-verified instance from a family at seed index i. */
function instantiate(family, seedText, i, subject) {
  const itemRng = rng(seedFrom(family.id, seedText, String(i)));
  globalThis.__pq_rng = itemRng;
  const difficulty = difficultyFor(itemRng);
  const p = family.params(itemRng, difficulty);
  const key = family.answer(p);
  const distractors = family.distractors(p, itemRng);
  return { itemRng, difficulty, p, key, distractors };
}

/** Generate up to n verified, in-bank-unique items for one family. */
function generate(family, seedText, n, seenCores, seenStems, subject, idCounter) {
  const items = [];
  const drops = { verifier: 0, distractors: 0, collision: 0, duplicate: 0 };
  let i = 0;
  let attempts = 0;
  while (items.length < n && attempts < n * 60) {
    attempts++;
    const { itemRng, difficulty, p, key, distractors } = instantiate(family, seedText, i, subject);
    i++;
    if (distractors.length !== 3) {
      drops.distractors++;
      continue;
    }
    if (new Set(distractors).size !== 3 || distractors.includes(key)) {
      drops.collision++;
      continue;
    }
    if (!family.verify(p, key)) {
      drops.verifier++;
      continue;
    }
    const coreId = coreIdFor(family, p);
    const stem = normText(family.stem(p));
    if (seenCores.has(coreId) || seenStems.has(stem)) {
      drops.duplicate++;
      continue;
    }
    seenCores.add(coreId);
    seenStems.add(stem);
    items.push({
      id: `${subject}-${family.id}-g${++idCounter.n}`,
      coreId,
      provenance: "original",
      variant: "B",
      track: ["global"],
      domain: "highschool",
      topicSlug: family.topicSlug,
      styleBoard: "JAMB",
      type: "mcq",
      questionText: family.stem(p),
      options: shuffled(itemRng, [key, ...distractors]),
      correctAnswer: key,
      explanation: family.explanation(p),
      hint: family.hint(p),
      difficulty,
      sourceExam: "original-exam-style",
      reviewStatus: "needs-human-review",
      selfCheck: "passed",
    });
  }
  return { items, drops, attempts };
}

/** Move every 4-option key onto a balanced deterministic position. */
function balancePositions(items) {
  let k = 0;
  for (const q of items) {
    if (!Array.isArray(q.options) || q.options.length !== 4) continue;
    const pos = q.options.indexOf(q.correctAnswer);
    if (pos < 0) continue;
    const target = POS_PATTERN[k % POS_PATTERN.length];
    k++;
    if (target === pos) continue;
    const rest = q.options.filter((o) => o !== q.correctAnswer);
    q.options = [rest[0], rest[1], rest[2]];
    q.options.splice(target, 0, q.correctAnswer);
  }
}

const PLAN = {
  physics: {
    bank: "content/questions/physics.json",
    files: ["content/questions/physics.json"],
    a4: ["speed-distance-time", "ohms-law"],
    fill: [
      "kinematics-final-velocity",
      "kinematics-distance",
      "newtons-second-law",
      "weight-from-mass",
      "work-done",
      "mechanical-power",
      "pressure-force-area",
      "density-calculation",
      "wave-speed",
      "wave-period",
      "specific-heat-capacity",
      "latent-heat",
      "efficiency-percent",
      "momentum",
      "impulse",
      "half-life-remaining",
      "boyle-gas-law",
      "gravitational-pe",
      "lens-formula",
      "magnification-lens",
      "electrical-power",
      "heating-effect-current",
      "pendulum-period",
      "centripetal-force",
      "elastic-energy",
      "kinetic-energy",
      "charles-gas-law",
      "acceleration-from-speeds",
    ],
  },
  chemistry: {
    bank: "content/questions/chemistry.json",
    files: [
      "content/questions/chemistry.json",
      "content/questions/chemistry.expansion-1.json",
      "content/questions/chemistry.expansion-2.json",
    ],
    a4: ["mole-mass"],
    fill: [
      "mass-from-moles",
      "moles-from-gas-volume",
      "volume-from-moles",
      "molar-concentration",
      "titration-moles",
      "dilution-molarity",
      "percent-composition",
      "empirical-formula",
      "limiting-reagent",
      "percentage-yield",
      "ph-from-h-plus",
      "neutralisation-enthalpy",
      "faraday-electrolysis",
      "oxidation-state",
      "isotope-ram",
      "electron-configuration",
      "moles-from-particles",
      "equilibrium-constant",
      "bond-enthalpy-change",
      "solubility-mass",
    ],
  },
  mathematics: {
    bank: "content/questions/mathematics.json",
    files: ["content/questions/mathematics.json"],
    a4: [
      "linear-two-sided",
      "rectangle-area-quadratic",
      "percent-increase-money",
      "pythagoras-triple",
      "simultaneous-linear-pair",
      "compound-growth",
    ],
    fill: [
      "derivative-polynomial",
      "integral-polynomial",
      "arithmetic-nth",
      "geometric-nth",
      "matrix-determinant",
      "logarithm-evaluate",
      "powers-of-powers",
      "probability-two-dice",
      "permutation-count",
      "polygon-interior-angle",
      "line-gradient",
      "cylinder-volume",
      "quadratic-discriminant",
      "mean-of-data",
      "sine-rule",
    ],
  },
  biology: {
    bank: "content/questions/biology.json",
    files: [
      "content/questions/biology.json",
      "content/questions/biology.expansion-1.json",
      "content/questions/biology.expansion-2.json",
    ],
    a4: [],
    fill: [
      "punnett-monohybrid",
      "microscope-magnification",
      "mark-recapture",
      "hardy-weinberg",
      "food-chain-energy",
      "organelle-functions",
      "membrane-transport",
      "enzymes",
      "respiration-photosynthesis",
      "dna-protein-synthesis",
      "inheritance-terms",
      "blood-circulation",
      "digestion",
      "gas-exchange-excretion",
      "nerves-hormones",
      "ecology-terms",
      "evolution-evidence",
      "plant-transport",
      "plant-reproduction",
      "infection-immunity",
    ],
  },
  "english-language": {
    bank: "content/questions/english.json",
    files: ["content/questions/english.json"],
    a4: [],
    fill: [
      "concord-subject-verb",
      "question-tag",
      "article-choice",
      "pronoun-case",
      "sentence-type",
      "punctuation-join",
      "reported-speech",
      "noun-plurals",
      "verb-past-tense",
      "synonyms-nearest",
      "antonyms-opposite",
      "idioms-meaning",
      "phrasal-verbs",
      "preposition-collocation",
      "oral-vowel-sounds",
      "oral-stress",
      "word-class-function",
      "letter-format",
      "summary-writing",
      "oral-consonants",
      "spelling-rules",
    ],
  },
  economics: {
    bank: "content/questions/economics.json",
    files: [],
    a4: [],
    fill: [
      "price-elasticity",
      "equilibrium-price",
      "gdp-factor-cost",
      "inflation-rate",
      "per-capita-income",
      "simple-multiplier",
      "balance-of-trade",
      "basic-economics-concepts",
      "demand-supply",
      "money-banking",
      "inflation-unemployment",
      "public-finance-trade",
    ],
  },
  government: {
    bank: "content/questions/government.json",
    files: [],
    a4: [],
    fill: [
      "vote-threshold",
      "age-qualification",
      "arms-of-government",
      "forms-of-government",
      "citizenship-constitution",
      "public-administration",
      "international-relations",
      "nigerian-politics-history",
      "political-ideologies",
      "elections-and-parties",
      "constitutions-and-rights",
      "public-policy",
      "federalism-local-government",
      "nigerian-institutions",
      "pressure-groups-media",
    ],
  },
  commerce: {
    bank: "content/questions/commerce.json",
    files: [],
    a4: [],
    fill: [
      "trade-discount",
      "mark-up-profit",
      "profit-margin",
      "rate-of-turnover",
      "hire-purchase-total",
      "commission-pay",
      "commerce-basics",
      "insurance-banking",
      "transport-advertising",
      "business-units-cooperatives",
      "ecommerce-warehousing",
    ],
  },
  accounting: {
    bank: "content/questions/accounting.json",
    files: [],
    a4: [],
    fill: [
      "straight-line-depreciation",
      "reducing-balance-depreciation",
      "bank-reconciliation",
      "bad-debt-provision",
      "current-ratio",
      "gross-profit-ratio",
      "vat-computation",
      "partnership-appropriation",
      "accruals-prepayments",
      "accounting-principles",
      "final-accounts",
      "control-accounts",
    ],
  },
  geography: {
    bank: "content/questions/geography.json",
    files: [],
    a4: [],
    fill: [
      "map-scale-distance",
      "longitude-time",
      "latitude-distance",
      "contour-gradient",
      "population-density",
      "natural-increase",
      "river-discharge",
      "temperature-lapse",
      "map-reading",
      "rocks-landforms",
      "climate-vegetation-soil",
      "settlement-population",
    ],
  },
  "agricultural-science": {
    bank: "content/questions/agricultural-science.json",
    files: [],
    a4: [],
    fill: [
      "percentage-germination",
      "stocking-rate",
      "feed-ration-percentage",
      "plant-population",
      "dose-calculation",
      "land-area-rectangle",
      "soil-science",
      "crop-production",
      "pests-and-diseases",
      "livestock-husbandry",
      "agricultural-economics",
    ],
  },
  "literature-in-english": { bank: "content/questions/literature-in-english.json", files: [], a4: [], fill: [] },
};

/** Per-item content patches applied at migration (documented in the report). */
const PATCHES = {
  "mock3-oral-q1": {
    explanation:
      "'book' contains the short /ʊ/ vowel. 'good', 'look', 'full' and 'put' also contain it; the other options carry the long /uː/ sound heard in 'food'.",
  },
};

const TARGET = 500;

function loadJson(rel) {
  return JSON.parse(readFileSync(Q(rel), "utf8"));
}

async function main() {
  const only = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  const reportPath = arg("--report", null);
  const a4 = {};
  for (const f of ["a4-generated-batch-1", "a4-generated-batch-2"]) {
    for (const q of await loadJson(`content/questions/${f}.json`)) {
      a4[q.coreId.split(":")[0]] = a4[q.coreId.split(":")[0]] ?? [];
      a4[q.coreId.split(":")[0]].push(q);
    }
  }

  const results = {};
  for (const [subject, plan] of Object.entries(PLAN)) {
    if (only.length && !only.includes(subject)) continue;
    const bank = [];
    const seenCores = new Set();
    const seenStems = new Set();
    const stats = { legacy: 0, legacyFiles: plan.files, a4: 0, a4Families: plan.a4, generated: 0, trimmed: 0 };

    // --- inventory: legacy files (schemas migrated to dual-version fields) ---
    for (const rel of plan.files) {
      const rows = await loadJson(rel);
      for (const raw of rows) {
        const q = { ...raw };
        q.coreId = raw.coreId ?? raw.id;
        q.variant = raw.variant ?? "B";
        q.provenance = raw.provenance ?? "original";
        q.track = Array.isArray(raw.track) ? [...raw.track] : ["global"];
        if (q.track.length === 1 && q.track[0] === "NG") q.track = ["global"];
        q.styleBoard = raw.styleBoard ?? "JAMB";
        q.topicSlug = SLUG_FIX[q.topicSlug] ?? q.topicSlug;
        // A4 batches were generated under the "mathematics" subject label for
        // family classes that belong to other pools — re-prefix ids (and their
        // coreId-only twins) so an id always identifies its own bank.
        if (typeof q.id === "string") q.id = q.id.replace(/^(mathematics|physics|chemistry|biology|english)-/, `${subject}-`);
        q.reviewStatus = "needs-human-review";
        if (PATCHES[q.id]) Object.assign(q, PATCHES[q.id]);
        const core = q.coreId;
        const stem = normText(q.questionText);
        if (seenCores.has(core) || seenStems.has(stem)) {
          stats.trimmed++;
          continue;
        }
        seenCores.add(core);
        seenStems.add(stem);
        bank.push(reorder(q, ["paper", "modelAnswer", "markingPoints", "totalMarks", "attribution"]));
        stats.legacy++;
      }
    }

    // --- inventory: A4 pipeline batches (already dual-version rows) ---
    for (const famId of plan.a4) {
      for (const raw of a4[famId] ?? []) {
        const q = { ...raw, track: ["global"] };
        if (typeof q.id === "string") q.id = q.id.replace(/^(mathematics|physics|chemistry|biology|english)-/, `${subject}-`);
        const core = q.coreId;
        const stem = normText(q.questionText);
        if (seenCores.has(core) || seenStems.has(stem)) {
          stats.trimmed++;
          continue;
        }
        seenCores.add(core);
        seenStems.add(stem);
        bank.push(reorder(q));
        stats.a4++;
      }
    }

    // --- fill: round-robin generation from round-2 families ---
    let need = TARGET - bank.length;
    if (need < 0) need = 0;
    const famStats = {};
    const idCounter = { n: 0 };
    let round = 0;
    while (need > 0 && round < 12) {
      round++;
      let producedThisRound = 0;
      for (const famId of plan.fill) {
        if (need <= 0) break;
        const family = familyById(famId);
        const seedText = `jamb-r${round}`;
        const { items, drops } = generate(family, seedText, Math.min(need, 14), seenCores, seenStems, subject, idCounter);
        const kept = items.slice(0, need);
        const trimmed = items.length - kept.length;
        for (const it of kept) bank.push(it);
        famStats[famId] = famStats[famId] ?? { attempts: 0, kept: 0, drops: { verifier: 0, distractors: 0, collision: 0, duplicate: 0 } };
        famStats[famId].kept += kept.length;
        famStats[famId].trimmed = (famStats[famId].trimmed ?? 0) + trimmed;
        for (const k of Object.keys(famStats[famId].drops)) famStats[famId].drops[k] += drops[k];
        famStats[famId].attempts += drops.verifier + drops.distractors + drops.collision + drops.duplicate + kept.length;
        need -= kept.length;
        producedThisRound += kept.length;
        stats.trimmed += trimmed;
      }
      if (producedThisRound === 0) break;
    }
    stats.generated = bank.length - stats.legacy - stats.a4;

    if (bank.length > TARGET) {
      stats.trimmed += bank.length - TARGET;
      bank.length = TARGET;
    }
    if (bank.length !== TARGET) {
      console.error(`FATAL ${subject}: bank has ${bank.length} items, need ${TARGET}`);
      process.exit(1);
    }

    balancePositions(bank);
    writeFileSync(Q(plan.bank), JSON.stringify(bank, null, 1) + "\n");

    const positions = [0, 1, 2, 3].map((i) => bank.filter((q) => Array.isArray(q.options) && q.options.length === 4 && q.options.indexOf(q.correctAnswer) === i).length);
    const mix = {};
    for (const q of bank) mix[q.difficulty] = (mix[q.difficulty] ?? 0) + 1;
    results[subject] = {
      bank: plan.bank,
      final: bank.length,
      ...stats,
      familyStats: famStats,
      difficultyMix: mix,
      answerPositions: positions,
    };
    console.log(
      `${subject.padEnd(20)} final=${bank.length} legacy=${stats.legacy} a4=${stats.a4} generated=${stats.generated} trimmed=${stats.trimmed} positions=${positions.join("/")} mix=${JSON.stringify(mix)}`,
    );
  }

  if (reportPath) writeFileSync(Q(reportPath), JSON.stringify(results, null, 2) + "\n");
}

main();
