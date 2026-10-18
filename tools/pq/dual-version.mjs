#!/usr/bin/env node
/**
 * Dual-version emitter — Version A (official, verbatim) + Version B (cloned
 * variant, localised) bound to one coreId.
 *
 * Usage:
 *   node tools/pq/dual-version.mjs --family rectangle-area-quadratic \
 *        --official-file content/questions/official.nsc.json --locale NG \
 *        --out content/questions/nsc-necta.dual-version.json
 *
 * An official record supplies the VERBATIM text and the attribution. If the
 * source text is not yet transcribed, the A slot is emitted as
 * "pending-source" so the track placement and attribution are reserved without
 * ever shipping placeholder text as if it were real. Version B is always fully
 * generated and machine-verified by the generator path.
 */

import { writeFileSync, readFileSync } from "node:fs";
import { rng, seedFrom, shuffled } from "./engine.mjs";
import { localeFor } from "./locales.mjs";
import { familyById } from "./families.mjs";

function arg(flag, fallback) {
  const i = process.argv.indexOf(flag);
  return i === -1 ? fallback : process.argv[i + 1];
}

const familyId = arg("--family", "rectangle-area-quadratic");
const officialPath = arg("--official-file", null);
const track = arg("--locale", "NG");
const seedText = arg("--seed", "1");
const outPath = arg("--out", null);

const family = familyById(familyId);
const locale = localeFor(track);

/** Official records: [{ track, board, questionText?, options?, correctAnswer? }] */
const official = officialPath
  ? JSON.parse(readFileSync(officialPath, "utf8"))
  : [{ track: "ZA", board: "NSC" }, { track: "TZ", board: "NECTA" }];

const out = [];

for (const record of official) {
  const coreId = `${family.id}:${arg("--core-suffix", "ns1")}`;
  const hasText = typeof record.questionText === "string" && record.questionText.trim() !== "";
  out.push({
    id: `${record.board.toLowerCase()}-${record.track.toLowerCase()}-${coreId}`,
    coreId,
    provenance: "official",
    variant: "A",
    track: [record.track],
    styleBoard: record.board,
    domain: "highschool",
    topicSlug: family.topicSlug,
    type: "mcq",
    questionText: hasText
      ? record.questionText
      : "[PENDING OFFICIAL SOURCE TEXT — to be transcribed exactly from the supplied paper, unedited.]",
    options: hasText && record.options ? record.options : [],
    correctAnswer: hasText && record.correctAnswer ? record.correctAnswer : "",
    explanation: "",
    hint: "",
    difficulty: arg("--difficulty", "medium"),
    sourceExam: `official-${record.board.toLowerCase()}`,
    attribution: `Official past question \u2014 \u00a9 ${
      record.board === "NSC"
        ? "Department of Basic Education, Republic of South Africa"
        : "National Examinations Council of Tanzania"
    }, reproduced for educational practice.`,
    reviewStatus: "needs-human-review",
    selfCheck: hasText ? "pending-key-verification" : "pending-source",
  });
}

// Version B — generated, machine-verified, localised to the target track.
const bRng = rng(seedFrom(familyId, "B", track, seedText));
globalThis.__pq_rng = bRng;
const difficulty = arg("--difficulty", "medium");
const p = family.params(bRng, difficulty);
const key = family.answer(p);
const distractors = family.distractors(p, bRng);
if (distractors.length !== 3 || new Set(distractors).size !== 3 || distractors.includes(key)) {
  console.error("ABORT: could not build 3 valid distractors for Version B");
  process.exit(1);
}
const opts = shuffled(bRng, [key, ...distractors]);
out.push({
  id: `global-${coreIdOf()}`,
  coreId: coreIdOf(),
  provenance: "original",
  variant: "B",
  track: [track === "ZA" || track === "TZ" ? "global" : track],
  styleBoard: arg("--board", "JAMB"),
  domain: "highschool",
  topicSlug: family.topicSlug,
  type: "mcq",
  questionText: family.stem(p, locale),
  options: opts,
  correctAnswer: key,
  explanation: family.explanation(p, locale),
  hint: family.hint(p),
  difficulty,
  sourceExam: "original-exam-style",
  reviewStatus: "needs-human-review",
  selfCheck: family.verify(p, key) ? "passed" : "FAILED-VERIFICATION",
});

function coreIdOf() {
  return `${family.id}:${arg("--core-suffix", "ns1")}`;
}

if (outPath) {
  writeFileSync(outPath, JSON.stringify(out, null, 1) + "\n");
  console.log(`wrote ${out.length} records (${out.filter((x) => x.variant === "A").length} official + 1 variant) -> ${outPath}`);
}
console.log(JSON.stringify(out.map((x) => ({ id: x.id, coreId: x.coreId, variant: x.variant, provenance: x.provenance, track: x.track, selfCheck: x.selfCheck })), null, 2));
