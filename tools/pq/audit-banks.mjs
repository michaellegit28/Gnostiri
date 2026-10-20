#!/usr/bin/env node
/**
 * audit-banks.mjs — the round-2 deliverable proof, run over the 12 JAMB banks.
 *
 * Gates (exit non-zero on any failure):
 *   1. each bank is a valid JSON array of EXACTLY 500 question objects
 *   2. schema conformance — core fields present, MCQ 4 distinct options, key
 *      present, dual-version fields (coreId/variant/provenance/track) well-formed
 *   3. reviewStatus is "needs-human-review" everywhere — nothing "verified"
 *   4. the word "verified" appears NOWHERE in any bank string
 *   5. ids, coreIds and stems are unique within each bank
 *   6. answer-key positions do not cluster (share at any position <= 35%)
 *
 * Usage: node tools/pq/audit-banks.mjs [bank ...]
 */

import { readFileSync } from "node:fs";

const BANKS = [
  "physics",
  "chemistry",
  "mathematics",
  "biology",
  "english",
  "economics",
  "government",
  "commerce",
  "accounting",
  "geography",
  "agricultural-science",
  "literature-in-english",
];
const ROOT = new URL("../../", import.meta.url).pathname;
const files = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const targets = files.length
  ? files
  : BANKS.map((s) =>
      s === "english" ? "english.json" : s === "mathematics" ? "mathematics.json" : `${s}.json`,
    );

const REQUIRED = [
  "id",
  "domain",
  "topicSlug",
  "type",
  "questionText",
  "options",
  "correctAnswer",
  "explanation",
  "difficulty",
  "sourceExam",
  "reviewStatus",
  "coreId",
  "variant",
  "provenance",
  "track",
];

const errors = [];
const summary = [];

function scanStrings(v, hit) {
  if (typeof v === "string") {
    hit(v);
  } else if (Array.isArray(v)) {
    for (const x of v) scanStrings(x, hit);
  } else if (v && typeof v === "object") {
    for (const x of Object.values(v)) scanStrings(x, hit);
  }
}

for (const rel of targets) {
  const path = rel.startsWith("/") ? rel : rel.includes("/") ? `${ROOT}${rel}` : `${ROOT}content/questions/${rel}`;
  let rows;
  try {
    rows = JSON.parse(readFileSync(path, "utf8"));
  } catch (err) {
    errors.push(`${rel}: unreadable JSON — ${err.message}`);
    continue;
  }
  if (!Array.isArray(rows)) {
    errors.push(`${rel}: not a flat array`);
    continue;
  }
  const where = (i) => `${rel}[${i}]`;
  if (rows.length !== 500) errors.push(`${rel}: has ${rows.length} items, expected exactly 500`);

  const ids = new Set();
  const cores = new Set();
  const stems = new Set();
  const positions = [0, 1, 2, 3];
  const posCounts = [0, 0, 0, 0];
  let mcq = 0;
  let theory = 0;
  const mix = {};

  rows.forEach((q, i) => {
    const isTheory = q.type === "theory";
    for (const k of REQUIRED) {
      // Theory rows carry modelAnswer/markingPoints in place of options/explanation
      // (matching nsc-official.batch1.json and the seeded theory items).
      if (isTheory && (k === "explanation" || k === "options")) continue;
      if (q[k] === undefined || q[k] === null || q[k] === "") errors.push(`${where(i)} (${q.id ?? "?"}): missing field ${k}`);
    }
    if (isTheory && !(typeof q.modelAnswer === "string" && q.modelAnswer.trim())) {
      errors.push(`${where(i)}: theory rows need a modelAnswer`);
    }
    if (q.reviewStatus !== "needs-human-review") {
      errors.push(`${where(i)}: reviewStatus must be needs-human-review, got "${q.reviewStatus}"`);
    }
    if (q.variant !== "B" || q.provenance !== "original") {
      errors.push(`${where(i)}: JAMB-pool rows must be variant B / provenance original`);
    }
    if (!Array.isArray(q.track) || q.track.length === 0) errors.push(`${where(i)}: track must be a non-empty array`);
    if (q.attribution) errors.push(`${where(i)}: Version B must not carry attribution`);
    if (q.domain !== "highschool") errors.push(`${where(i)}: domain must be highschool`);
    if (ids.has(q.id)) errors.push(`${where(i)}: duplicate id ${q.id}`);
    ids.add(q.id);
    if (cores.has(q.coreId)) errors.push(`${where(i)}: duplicate coreId ${q.coreId}`);
    cores.add(q.coreId);
    const stem = String(q.questionText).toLowerCase();
    if (stems.has(stem)) errors.push(`${where(i)}: duplicate stem "${stem.slice(0, 60)}..."`);
    stems.add(stem);
    scanStrings(q, (s) => {
      if (/verified/i.test(s)) errors.push(`${where(i)}: the word "verified" appears in bank text`);
    });
    if (q.type === "mcq") {
      mcq++;
      if (!Array.isArray(q.options) || q.options.length !== 4) {
        errors.push(`${where(i)}: MCQ needs 4 options, got ${Array.isArray(q.options) ? q.options.length : "none"}`);
      } else {
        if (new Set(q.options).size !== 4) errors.push(`${where(i)}: duplicate options`);
        const pos = q.options.indexOf(q.correctAnswer);
        if (pos < 0) errors.push(`${where(i)}: correctAnswer not among options`);
        else if (positions.includes(pos)) posCounts[pos]++;
      }
    } else if (q.type === "theory") {
      theory++;
      if (Array.isArray(q.options) && q.options.length > 0) errors.push(`${where(i)}: theory rows must not carry options`);
    } else {
      errors.push(`${where(i)}: unknown type "${q.type}"`);
    }
    mix[q.difficulty] = (mix[q.difficulty] ?? 0) + 1;
  });

  const mcqTotal = posCounts.reduce((a, b) => a + b, 0);
  const worstShare = mcqTotal ? Math.max(...posCounts) / mcqTotal : 0;
  if (worstShare > 0.35) errors.push(`${rel}: answer-position clustering ${Math.round(worstShare * 100)}% at one position`);

  summary.push({
    bank: rel,
    items: rows.length,
    mcq,
    theory,
    positions: posCounts.join("/"),
    maxPositionShare: `${Math.round(worstShare * 100)}%`,
    difficultyMix: mix,
  });
}

console.log(JSON.stringify({ banks: summary.length, gates: "count=500 · schema · needs-human-review · no-'verified' · uniqueness · position-share<=35%" }, null, 2));
for (const s of summary) console.log(JSON.stringify(s));
if (errors.length) {
  console.error(`\nFAILED — ${errors.length} violations:`);
  for (const e of errors.slice(0, 50)) console.error(`  ${e}`);
  if (errors.length > 50) console.error(`  ... and ${errors.length - 50} more`);
  process.exit(1);
}
console.log(`\nPASS — ${summary.length} banks: 500 each, schema-conformant, no "verified", keys balanced.`);
