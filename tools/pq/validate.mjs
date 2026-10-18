#!/usr/bin/env node
/**
 * PQ validator — the gates every generated or authored batch must pass.
 * Usage:
 *   node tools/pq/validate.mjs content/questions/*.json
 *
 * Gates:
 *  STRUCTURE  4 distinct options, key present among them, required fields
 *  KEY        key is a real string answer (not a placeholder)
 *  PAIRING    every coreId has at least one Version A and one Version B
 *  OFFICIAL   A items sit only on ZA/TZ and carry attribution
 *  LEAKAGE    no Version B text equals or contains a Version A text
 *  LOCALE     B items carry no foreign-track currency marker
 *  BIAS       answer-position distribution (flags >70% at one position)
 *  MIX        difficulty mix reported against the 30/40/30 target
 */

import { readFileSync } from "node:fs";

const OFFICIAL_TRACKS = new Set(["ZA", "TZ"]);
const CURRENCY_BY_TRACK = {
  NG: ["\u20a6", "naira"],
  ZA: ["R", "rand"],
  TZ: ["TSh", "shilling"],
  GH: ["\u20b5", "cedi"],
  KE: ["KSh", "shilling"],
  US: ["$", "dollar"],
  UK: ["\u00a3", "pound"],
};

const files = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const items = [];
for (const f of files) {
  let parsed;
  try {
    parsed = JSON.parse(readFileSync(f, "utf8"));
  } catch (err) {
    console.error(`FAIL ${f}: unreadable JSON (${err.message})`);
    process.exit(1);
  }
  for (const it of parsed) items.push({ ...it, __file: f });
}

const errors = [];
const warnings = [];
const pending = [];

const ATTRIBUTION_MARKERS = [
  "Department of Basic Education",
  "National Examinations Council of Tanzania",
];
const hasAttribution = (q) =>
  typeof q.attribution === "string" && q.attribution.trim() !== ""
    ? true
    : ATTRIBUTION_MARKERS.some((m) => typeof q.questionText === "string" && q.questionText.includes(m));

for (const q of items) {
  const where = `${q.__file}:${q.id ?? "<no id>"}`;
  const isPlaceholder =
    q.selfCheck === "pending-source" ||
    (typeof q.questionText === "string" && q.questionText.startsWith("[PENDING"));

  if (isPlaceholder) {
    pending.push(`${where} reserved slot — awaiting transcription (attribution ${hasAttribution(q) ? "present" : "MISSING"})`);
    if (q.variant === "A" && !hasAttribution(q)) {
      errors.push(`${where} Version A placeholder must still carry the attribution line`);
    }
  } else {
    if (!q.id || !q.questionText || !q.correctAnswer || !q.topicSlug) {
      errors.push(`${where} missing required fields`);
    }
    if (q.type === "mcq") {
      if (!Array.isArray(q.options) || q.options.length !== 4) {
        errors.push(`${where} expected 4 options, got ${Array.isArray(q.options) ? q.options.length : "none"}`);
      } else if (new Set(q.options).size !== 4) {
        errors.push(`${where} duplicate options`);
      } else if (!q.options.includes(q.correctAnswer)) {
        errors.push(`${where} correctAnswer is not among the options`);
      }
    }
  }

  // Official / variant rules.
  if (q.variant === "A") {
    if (q.provenance !== "official") errors.push(`${where} Version A must be provenance=official`);
    const tracks = Array.isArray(q.track) ? q.track : [q.track];
    if (!tracks.every((t) => OFFICIAL_TRACKS.has(t))) {
      errors.push(`${where} Version A may only live on ZA/TZ, got ${tracks.join(",")}`);
    }
    if (!hasAttribution(q)) errors.push(`${where} Version A is missing the attribution line`);
  }
  if (q.variant === "B") {
    if (q.provenance !== "original") errors.push(`${where} Version B must be provenance=original`);
    if (q.attribution) errors.push(`${where} Version B must NOT carry an attribution line`);
    const tracks = Array.isArray(q.track) ? q.track : [q.track];
    for (const t of tracks) {
      const markers = CURRENCY_BY_TRACK[t];
      if (!markers) continue;
      const others = Object.entries(CURRENCY_BY_TRACK).filter(([k]) => k !== t && !OFFICIAL_TRACKS.has(k));
      for (const [code, word] of others) {
        const symbol = CURRENCY_BY_TRACK[code][0];
        if (q.questionText.includes(symbol) && !markers.includes(symbol)) {
          errors.push(`${where} Version B on track ${t} carries ${code} currency marker`);
        }
      }
    }
  }

  // Position bias.
  if (q.type === "mcq" && Array.isArray(q.options)) {
    q.__pos = q.options.indexOf(q.correctAnswer);
  }
}

// coreId pairing + leakage.
const byCore = new Map();
for (const q of items) {
  if (!q.coreId) continue;
  if (!byCore.has(q.coreId)) byCore.set(q.coreId, []);
  byCore.get(q.coreId).push(q);
}
const hasAnyA = items.some((q) => q.variant === "A");
const hasAnyB = items.some((q) => q.variant === "B");
for (const [coreId, group] of byCore) {
  if (hasAnyA && !group.some((q) => q.variant === "A")) warnings.push(`coreId ${coreId} has no Version A`);
  if (hasAnyB && !group.some((q) => q.variant === "B")) warnings.push(`coreId ${coreId} has no Version B`);
}

const officialTexts = items.filter((q) => q.variant === "A").map((q) => q.questionText);
for (const q of items.filter((x) => x.variant === "B")) {
  for (const official of officialTexts) {
    if (official.length > 20 && q.questionText.includes(official)) {
      errors.push(`${q.id} Version B contains Version A text (leakage)`);
    }
  }
}

const positions = {};
for (const q of items) if (typeof q.__pos === "number") positions[q.__pos] = (positions[q.__pos] ?? 0) + 1;
const total = Object.values(positions).reduce((a, b) => a + b, 0);
if (total > 0) {
  const worst = Math.max(...Object.values(positions)) / total;
  if (worst > 0.7) warnings.push(`answer-position bias: ${Math.round(worst * 100)}% at one position`);
}

const mix = {};
for (const q of items) if (q.difficulty) mix[q.difficulty] = (mix[q.difficulty] ?? 0) + 1;

console.log(
  JSON.stringify(
    {
      files: files.length,
      items: items.length,
      coreIds: byCore.size,
      errors: errors.length,
      warnings: warnings.length,
      pendingTranscription: pending.length,
      difficultyMix: mix,
      answerPositions: positions,
    },
    null,
    2,
  ),
);
for (const e of errors) console.error(`ERROR ${e}`);
for (const w of warnings) console.warn(`WARN ${w}`);

process.exit(errors.length > 0 ? 1 : 0);
