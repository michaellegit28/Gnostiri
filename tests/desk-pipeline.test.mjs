// Pure-logic tests for the Desk pipeline (ROADMAP.md Phase 3).
//
// No DB, no network, no filesystem: chunking, sentence ranking, content
// hashing, quiz invariants, and task scheduling are all side-effect free, so
// they are tested directly (node:test runs the .ts module with type
// stripping — the module's only runtime import is node:crypto).

import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  buildExtractiveNotes,
  chunkText,
  contentHashOf,
  dedupeKey,
  normaliseText,
  rankSentences,
  scheduleTasks,
  splitSentences,
  validateQuizItem,
} from "../src/lib/desk-pipeline.ts";

const PROSE = [
  "The mitochondrion is the organelle that generates most of the cell's supply of adenosine triphosphate, used as a source of chemical energy.",
  "The inner membrane is folded into structures called cristae, which increase the surface area available for ATP synthesis.",
  "Cells with high energy demand, such as cardiac muscle cells, contain unusually large numbers of mitochondria.",
  "The matrix contains mitochondrial DNA, which is inherited exclusively from the mother in humans.",
  "Oxidative phosphorylation couples electron transport to ATP production across the inner mitochondrial membrane.",
  "Reactive oxygen species produced during respiration can damage mitochondrial components over time.",
].join(" ");

// ── chunkText ───────────────────────────────────────────────────────────────

test("chunkText respects the maxChars bound and preserves content", () => {
  const chunks = chunkText(PROSE, { maxChars: 200 });
  assert.ok(chunks.length >= 5, `a 400-char-plus text at a 200-char cap yields several chunks (got ${chunks.length})`);
  for (const chunk of chunks) assert.ok(chunk.length <= 200, `chunk of ${chunk.length} chars exceeds the 200-char cap`);
  assert.equal(chunks.join(" "), normaliseText(PROSE), "joining the chunks with spaces reproduces the normalised text");
});

test("chunkText handles empty input and degenerate limits", () => {
  assert.deepEqual(chunkText("", { maxChars: 100 }), []);
  assert.deepEqual(chunkText("   \n  ", { maxChars: 100 }), []);
  const forced = chunkText(PROSE, { maxChars: 10 });
  assert.ok(forced.length > 0 && forced.every((c) => c.length <= 10), "a cap smaller than any sentence still holds (hard split)");
});

// ── rankSentences ───────────────────────────────────────────────────────────

test("rankSentences returns at most topN real sentences, deterministically", () => {
  const top3 = rankSentences(PROSE, 3);
  assert.ok(top3.length <= 3, `asked for 3, got ${top3.length}`);
  const realSentences = splitSentences(PROSE);
  for (const sentence of top3) assert.ok(realSentences.includes(sentence), `not a real sentence: ${sentence}`);
  assert.deepEqual(rankSentences(PROSE, 3), top3, "same input ranks identically twice");
  assert.deepEqual(rankSentences(PROSE, 99), realSentences.slice().sort((a, b) => realSentences.indexOf(a) - realSentences.indexOf(b)), "topN above the sentence count returns every sentence, in document order");
});

// ── content hashing + dedupe ────────────────────────────────────────────────

test("contentHashOf is deterministic, distinguishes text, and matches sha256", () => {
  const hash = contentHashOf(PROSE);
  assert.equal(hash, contentHashOf(PROSE), "same text hashes identically");
  assert.notEqual(hash, contentHashOf(PROSE + " A different textbook entirely."), "different text hashes differently");
  assert.equal(hash, createHash("sha256").update(PROSE, "utf8").digest("hex"), "hash is the sha256 of the normalised text");
  assert.equal(normaliseText("a\n  b"), "a b", "normalisation collapses whitespace");
});

test("dedupeKey: same normalised text collides, different text does not", () => {
  assert.equal(dedupeKey(normaliseText("The quick brown fox jumps.")), dedupeKey(normaliseText("The quick brown fox jumps.")), "layout-only differences must not defeat dedupe");
  assert.notEqual(dedupeKey(normaliseText("The quick brown fox jumps.")), dedupeKey(normaliseText("The quick brown fox leaps.")), "real content differences must not collide");
  assert.equal(dedupeKey(normaliseText("x")), contentHashOf(normaliseText("x")), "dedupe key is the content hash");
});

// ── quiz invariants ─────────────────────────────────────────────────────────

const GOOD_ITEM = {
  stem: "Which organelle generates most of the cell's ATP?",
  options: ["The mitochondria", "The nucleus", "The ribosome", "The Golgi apparatus"],
  correctAnswer: "The mitochondria",
  explanation: "Mitochondria perform oxidative phosphorylation; the nucleus stores DNA, ribosomes synthesise protein, and the Golgi packages it.",
};

test("validateQuizItem accepts a sound item", () => {
  assert.deepEqual(validateQuizItem(GOOD_ITEM), { ok: true });
});

test("validateQuizItem rejects the four failure classes", () => {
  assert.equal(validateQuizItem({ ...GOOD_ITEM, options: GOOD_ITEM.options.slice(0, 3) }).ok, false, "3 options rejected");
  const dup = validateQuizItem({ ...GOOD_ITEM, options: ["The mitochondria", "The mitochondria", "The ribosome", "The nucleus"] });
  assert.equal(dup.ok, false, "duplicate option rejected");
  const drift = validateQuizItem({ ...GOOD_ITEM, correctAnswer: "The mitochondria and the chloroplasts" });
  assert.equal(drift.ok, false, "correctAnswer not verbatim in options rejected");
  assert.equal(validateQuizItem({ ...GOOD_ITEM, stem: "   " }).ok, false, "empty stem rejected");
  assert.equal(validateQuizItem({ ...GOOD_ITEM, options: ["", "b", "c", "d"] }).ok, false, "empty option rejected");
  assert.equal(validateQuizItem({ ...GOOD_ITEM, explanation: "" }).ok, false, "empty explanation rejected");
});

// ── task scheduling ─────────────────────────────────────────────────────────

const START = new Date("2026-11-02T00:00:00.000Z"); // a Monday
const DAY = 86_400_000;
const COMBOS = [
  { minutesPerDay: 30, days: 3 },
  { minutesPerDay: 30, days: 7 },
  { minutesPerDay: 60, days: 3 },
  { minutesPerDay: 60, days: 7 },
  { minutesPerDay: 120, days: 3 },
  { minutesPerDay: 120, days: 7 },
];

test("scheduleTasks: all six minutes×days combinations produce a sane plan", () => {
  for (const { minutesPerDay, days } of COMBOS) {
    const rows = scheduleTasks({ minutesPerDay, days, startDate: START, userId: "u1", documentId: "d1", title: "Cell Biology" });
    const label = `${minutesPerDay}min/${days}d`;

    assert.ok(rows.length >= 2, `${label}: reading + quiz at minimum (got ${rows.length})`);
    assert.equal(rows[0].kind, "reading", `${label}: first task is day-1 reading`);
    assert.equal(rows[0].scheduledFor.getTime(), START.getTime(), `${label}: first task on day 1, never before it`);
    assert.equal(rows[rows.length - 1].kind, "quiz", `${label}: final task is the quiz`);
    assert.equal(
      rows[rows.length - 1].scheduledFor.getTime(),
      START.getTime() + (days - 1) * DAY,
      `${label}: quiz lands on the final day`,
    );

    for (const row of rows) {
      assert.ok(row.scheduledFor.getTime() >= START.getTime(), `${label}: nothing scheduled before the start date`);
      assert.ok(row.minutes <= minutesPerDay, `${label}: ${row.minutes} minutes exceeds the ${minutesPerDay}-minute daily budget`);
      assert.ok(row.minutes > 0, `${label}: minutes positive`);
      assert.equal(row.status, "pending", `${label}: new tasks are pending`);
    }
    const times = rows.map((r) => r.scheduledFor.getTime());
    assert.deepEqual(times, [...times].sort((a, b) => a - b), `${label}: tasks ordered by date`);
    assert.equal(rows.filter((r) => r.kind === "quiz").length, 1, `${label}: exactly one quiz`);

    if (minutesPerDay >= 60 && days >= 3) {
      const middleDays = rows.filter((r) => r.kind === "reading" && r.scheduledFor.getTime() > START.getTime() && r.scheduledFor.getTime() < START.getTime() + (days - 1) * DAY);
      assert.ok(middleDays.length >= 1, `${label}: a 60+ minute day also reads on middle days`);
    }
  }
});

test("scheduleTasks: reading tasks consume the daily budget, quiz stays bounded", () => {
  const rows = scheduleTasks({ minutesPerDay: 120, days: 7, startDate: START });
  for (const row of rows) {
    if (row.kind === "reading") assert.equal(row.minutes, 120, "reading uses the full daily budget");
    else assert.ok(row.minutes <= 45, `quiz of ${row.minutes} minutes is bounded`);
  }
});

// ── extractive notes (the honesty path) ─────────────────────────────────────

test("buildExtractiveNotes: one marked section per chunk, ranked real sentences only", () => {
  const chunks = chunkText(PROSE, { maxChars: 300 });
  const sections = buildExtractiveNotes(chunks);
  assert.equal(sections.length, chunks.length, "one section per chunk");
  for (let i = 0; i < sections.length; i += 1) {
    const blocks = sections[i].blocks;
    assert.equal(blocks[0].type, "heading", "section opens with a heading");
    assert.equal(blocks[1].type, "callout", "the extractive disclaimer callout is prefixed");
    assert.match(blocks[1].text, /extractive summarisation — no AI model configured/, "the callout says no AI model configured");
    const realSentences = splitSentences(chunks[i]);
    for (const block of blocks.slice(2)) {
      assert.equal(block.type, "paragraph", "note bodies are paragraphs");
      assert.ok(realSentences.includes(block.text), `invented sentence in section ${i + 1}: ${block.text}`);
    }
  }
});
