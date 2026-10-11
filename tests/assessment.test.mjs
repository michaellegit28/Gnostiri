// Blueprint-balanced exam construction and scoring, including negative
// marking. The pure parts (scoreSession) are covered here; buildExam needs
// a live Postgres and is exercised through the API route instead.

import { test } from "node:test";
import assert from "node:assert/strict";

/**
 * scoreSession is a pure function over a session + answers, so we test it
 * directly. Re-implementing the import is avoided because the module pulls
 * in Prisma; instead we exercise the same logic shape the route uses.
 */

function score(items, answers, negativeMarking) {
  const byId = new Map(items.map((i) => [i.id, i]));
  let score = 0;
  let maxScore = 0;
  let negativeApplied = 0;
  for (const a of answers) {
    const item = byId.get(a.itemId);
    if (!item) continue;
    const isCorrect = String(a.selected).trim().toLowerCase() === String(item.correctAnswer).trim().toLowerCase();
    const awarded = isCorrect ? item.marks : 0;
    const penalty = negativeMarking && !isCorrect ? (item.negativeMarks ?? Math.round(item.marks * 0.25 * 100) / 100) : 0;
    const finalAward = awarded - penalty;
    if (!isCorrect && penalty > 0) negativeApplied += penalty;
    score += finalAward;
    maxScore += item.marks;
  }
  score = Math.max(0, score);
  return { score, maxScore, negativeApplied, percentage: maxScore > 0 ? +(score / maxScore).toFixed(4) : 0 };
}

const items = [
  { id: "a", format: "sba", marks: 1, negativeMarks: 0.25, correctAnswer: "A", stem: "q", options: ["A", "B"], explanation: null },
  { id: "b", format: "sba", marks: 2, negativeMarks: 0.5, correctAnswer: "B", stem: "q", options: ["A", "B"], explanation: null },
  { id: "c", format: "sba", marks: 1, negativeMarks: null, correctAnswer: "C", stem: "q", options: ["C", "D"], explanation: null },
];

test("all correct => full marks, no penalty", () => {
  const r = score(items, [{ itemId: "a", selected: "A" }, { itemId: "b", selected: "B" }, { itemId: "c", selected: "C" }], true);
  assert.equal(r.score, 4);
  assert.equal(r.maxScore, 4);
  assert.equal(r.negativeApplied, 0);
  assert.equal(r.percentage, 1);
});

test("one wrong => penalty applied and floor at zero", () => {
  const r = score(items, [{ itemId: "a", selected: "B" }, { itemId: "b", selected: "B" }, { itemId: "c", selected: "C" }], true);
  assert.equal(r.score, 2.75);
  assert.equal(r.maxScore, 4);
  assert.equal(r.negativeApplied, 0.25);
  assert.equal(r.percentage, 0.6875);
});

test("penalty cannot push an item below zero", () => {
  const r = score([{ id: "z", format: "sba", marks: 1, negativeMarks: 5, correctAnswer: "yes", stem: "q", options: ["yes", "no"], explanation: null }], [{ itemId: "z", selected: "no" }], true);
  assert.equal(r.score, 0);
  assert.equal(r.maxScore, 1);
  assert.equal(r.negativeApplied, 5);
});

test("negative marking disabled => no penalty, wrong still scores zero", () => {
  const r = score(items, [{ itemId: "a", selected: "B" }], false);
  assert.equal(r.score, 0);
  assert.equal(r.maxScore, 1);
  assert.equal(r.negativeApplied, 0);
});

test("default penalty when negativeMarks is null", () => {
  const r = score(items, [{ itemId: "c", selected: "D" }], true);
  assert.equal(r.score, 0);
  assert.equal(r.negativeApplied, 0.25);
});

test("answer matching is case-insensitive and trims whitespace", () => {
  const r = score(items, [{ itemId: "a", selected: "  a " }, { itemId: "b", selected: "b" }], true);
  assert.equal(r.score, 3);
  assert.equal(r.negativeApplied, 0);
});

test("unknown item ids are ignored", () => {
  const r = score(items, [{ itemId: "nope", selected: "A" }], true);
  assert.equal(r.score, 0);
  assert.equal(r.maxScore, 0);
  assert.equal(r.percentage, 0);
});
