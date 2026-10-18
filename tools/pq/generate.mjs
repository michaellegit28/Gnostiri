#!/usr/bin/env node
/**
 * PQ generator — Track A of the two-track engine.
 * Usage:
 *   node tools/pq/generate.mjs --family linear-two-sided --n 12 --seed 7 \
 *        --locale NG --out content/questions/linear.ng.json
 *
 * Emits questions in the bank schema already used by the content pipeline
 * (id, domain, topicSlug, type, questionText, options, correctAnswer,
 * explanation, difficulty, sourceExam, selfCheck, styleBoard).
 * Every item is machine-verified before it is emitted: a bad key drops the item.
 */

import { writeFileSync } from "node:fs";
import { rng, seedFrom, difficultyFor, pick } from "./engine.mjs";
import { localeFor } from "./locales.mjs";
import { familyById } from "./families.mjs";

function arg(flag, fallback) {
  const i = process.argv.indexOf(flag);
  return i === -1 ? fallback : process.argv[i + 1];
}

const familyId = arg("--family", "linear-two-sided");
const count = Number(arg("--n", "12"));
const seedText = arg("--seed", "1");
const track = arg("--locale", "NEUTRAL");
const outPath = arg("--out", null);
const subject = arg("--subject", "mathematics");
const board = arg("--board", "JAMB");

const family = familyById(familyId);
const locale = localeFor(track);

const generated = [];
const rejected = [];
let i = 0;
let attempts = 0;

while (generated.length < count && attempts < count * 20) {
  attempts++;
  const itemRng = rng(seedFrom(familyId, seedText, String(i)));
  globalThis.__pq_rng = itemRng;
  const difficulty = difficultyFor(itemRng);
  const p = family.params(itemRng, difficulty);
  const key = family.answer(p);

  // Distractors must be exactly 3, distinct, and never equal to the key.
  let distractors = family.distractors(p, itemRng);
  if (distractors.length !== 3) {
    rejected.push({ i, reason: "distractor-count" });
    i++;
    continue;
  }
  if (new Set(distractors).size !== 3 || distractors.includes(key)) {
    rejected.push({ i, reason: "distractor-collision" });
    i++;
    continue;
  }

  // Independent verification: re-derive the answer from the statement.
  if (!family.verify(p, key)) {
    rejected.push({ i, reason: "key-verification-failed" });
    i++;
    continue;
  }

  const options = shuffledOptions(itemRng, [key, ...distractors], key);
  generated.push({
    id: `${subject}-${family.id}-${track.toLowerCase()}-${seedText}-g${generated.length + 1}`,
    coreId: `${family.id}:${stableKey(p)}`,
    provenance: "original",
    variant: "B",
    track: [track],
    domain: "highschool",
    topicSlug: family.topicSlug,
    styleBoard: board,
    type: "mcq",
    questionText: family.stem(p, locale),
    options,
    correctAnswer: key,
    explanation: family.explanation(p, locale),
    hint: family.hint(p),
    difficulty,
    sourceExam: "original-exam-style",
    reviewStatus: "needs-human-review",
    selfCheck: "passed",
  });
  i++;
}

function shuffledOptions(r, items, key) {
  const out = items.slice();
  for (let a = out.length - 1; a > 0; a--) {
    const b = Math.floor(r() * (a + 1));
    [out[a], out[b]] = [out[b], out[a]];
  }
  return out;
}

function stableKey(p) {
  return Object.values(p)
    .map((v) => String(v).replace(/[^0-9a-zA-Z]/g, ""))
    .join("_");
}

const report = {
  family: family.id,
  label: family.label,
  topicSlug: family.topicSlug,
  track,
  seed: seedText,
  requested: count,
  generated: generated.length,
  rejected: rejected.length,
  verifiedBy: "independent per-family re-derivation",
  answerPositions: generated.reduce((acc, q) => {
    const pos = q.options.indexOf(q.correctAnswer);
    acc[pos] = (acc[pos] ?? 0) + 1;
    return acc;
  }, {}),
};

if (outPath) {
  writeFileSync(outPath, JSON.stringify(generated, null, 1) + "\n");
  console.log(`wrote ${generated.length} questions -> ${outPath}`);
}
console.log(JSON.stringify(report, null, 2));
