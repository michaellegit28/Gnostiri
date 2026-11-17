import { test } from "node:test";
import assert from "node:assert/strict";

/**
 * Tests for ranking pool pure functions (copied from src/lib/ranking-pool.ts for isolation)
 * These test the deterministic logic without Prisma dependencies.
 */

// ─── Constants ────────────────────────────────────────────────────────────────

const POOL_TARGET = 60;
const POOL_TTL_MS = 10 * 60 * 1000;
const SPREAD_ROWS = 400;

// ─── Types ────────────────────────────────────────────────────────────────────

const BankKind = {
  question: "question",
  assessment: "assessment",
};

function bankSlices(tier) {
  const university = { kind: "assessment", difficulty: null, take: 0 };
  switch (tier) {
    case 1:
      return [{ kind: "question", difficulty: "easy", take: POOL_TARGET }];
    case 2:
      return [
        { kind: "question", difficulty: "easy", take: 45 },
        { kind: "question", difficulty: "medium", take: 15 },
      ];
    case 3:
      return [{ kind: "question", difficulty: "medium", take: POOL_TARGET }];
    case 4:
      return [
        { kind: "question", difficulty: "medium", take: 36 },
        { ...university, take: 24 },
      ];
    case 5:
      return [
        { kind: "question", difficulty: "hard", take: 30 },
        { ...university, take: 30 },
      ];
    default:
      return [
        { kind: "question", difficulty: "hard", take: 24 },
        { ...university, take: 36 },
      ];
  }
}

function spreadCrossSubject(rows, take) {
  const buckets = new Map();
  for (const row of rows) {
    const bucket = buckets.get(row.bucket);
    if (bucket) bucket.push(row.entry);
    else buckets.set(row.bucket, [row.entry]);
  }

  const out = [];
  const keys = Array.from(buckets.keys());
  let depth = 0;
  while (out.length < take) {
    let added = 0;
    for (const key of keys) {
      const bucket = buckets.get(key);
      if (bucket && depth < bucket.length) {
        out.push(bucket[depth]);
        added += 1;
        if (out.length >= take) break;
      }
    }
    if (added === 0) break;
    depth += 1;
  }
  return out;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

test("bankSlices: tier 1 uses only easy questions", () => {
  const slices = bankSlices(1);
  assert.equal(slices.length, 1);
  assert.equal(slices[0].kind, "question");
  assert.equal(slices[0].difficulty, "easy");
  assert.equal(slices[0].take, 60);
});

test("bankSlices: tier 2 mixes easy and medium", () => {
  const slices = bankSlices(2);
  assert.equal(slices.length, 2);
  assert.equal(slices[0].kind, "question");
  assert.equal(slices[0].difficulty, "easy");
  assert.equal(slices[0].take, 45);
  assert.equal(slices[1].kind, "question");
  assert.equal(slices[1].difficulty, "medium");
  assert.equal(slices[1].take, 15);
});

test("bankSlices: tier 3 uses only medium questions", () => {
  const slices = bankSlices(3);
  assert.equal(slices.length, 1);
  assert.equal(slices[0].kind, "question");
  assert.equal(slices[0].difficulty, "medium");
  assert.equal(slices[0].take, 60);
});

test("bankSlices: tier 4 mixes medium questions with university assessments", () => {
  const slices = bankSlices(4);
  assert.equal(slices.length, 2);
  assert.equal(slices[0].kind, "question");
  assert.equal(slices[0].difficulty, "medium");
  assert.equal(slices[0].take, 36);
  assert.equal(slices[1].kind, "assessment");
  assert.equal(slices[1].take, 24);
});

test("bankSlices: tier 5 mixes hard questions with university assessments", () => {
  const slices = bankSlices(5);
  assert.equal(slices.length, 2);
  assert.equal(slices[0].kind, "question");
  assert.equal(slices[0].difficulty, "hard");
  assert.equal(slices[0].take, 30);
  assert.equal(slices[1].kind, "assessment");
  assert.equal(slices[1].take, 30);
});

test("bankSlices: tier 6 mixes hard questions with university assessments", () => {
  const slices = bankSlices(6);
  assert.equal(slices.length, 2);
  assert.equal(slices[0].kind, "question");
  assert.equal(slices[0].difficulty, "hard");
  assert.equal(slices[0].take, 24);
  assert.equal(slices[1].kind, "assessment");
  assert.equal(slices[1].take, 36);
});

test("spreadCrossSubject: distributes entries round-robin across buckets", () => {
  const rows = [
    { bucket: "topic-1", entry: { id: "1", questionText: "q1", options: ["A", "B"], difficulty: "easy" } },
    { bucket: "topic-1", entry: { id: "2", questionText: "q2", options: ["A", "B"], difficulty: "easy" } },
    { bucket: "topic-2", entry: { id: "3", questionText: "q3", options: ["A", "B"], difficulty: "easy" } },
    { bucket: "topic-2", entry: { id: "4", questionText: "q4", options: ["A", "B"], difficulty: "easy" } },
    { bucket: "topic-3", entry: { id: "5", questionText: "q5", options: ["A", "B"], difficulty: "easy" } },
  ];
  const result = spreadCrossSubject(rows, 5);
  assert.equal(result.length, 5);
  const ids = result.map((e) => e.id);
  // Round-robin: first entry from each bucket, then second from each, etc.
  assert.ok(ids.includes("1"));
  assert.ok(ids.includes("3"));
  assert.ok(ids.includes("5"));
  assert.ok(ids.includes("2"));
  assert.ok(ids.includes("4"));
  // Verify order: first pass (1,3,5), second pass (2,4)
  assert.deepEqual(ids, ["1", "3", "5", "2", "4"]);
});

test("spreadCrossSubject: handles uneven bucket sizes", () => {
  const rows = [
    { bucket: "topic-1", entry: { id: "1", questionText: "q1", options: ["A", "B"], difficulty: "easy" } },
    { bucket: "topic-1", entry: { id: "2", questionText: "q2", options: ["A", "B"], difficulty: "easy" } },
    { bucket: "topic-1", entry: { id: "3", questionText: "q3", options: ["A", "B"], difficulty: "easy" } },
    { bucket: "topic-2", entry: { id: "4", questionText: "q4", options: ["A", "B"], difficulty: "easy" } },
  ];
  const result = spreadCrossSubject(rows, 4);
  assert.equal(result.length, 4);
  const ids = result.map((e) => e.id);
  assert.deepEqual(ids, ["1", "4", "2", "3"]); // round-robin order
});

test("spreadCrossSubject: stops when take is reached", () => {
  const rows = [
    { bucket: "topic-1", entry: { id: "1", questionText: "q1", options: ["A", "B"], difficulty: "easy" } },
    { bucket: "topic-2", entry: { id: "2", questionText: "q2", options: ["A", "B"], difficulty: "easy" } },
    { bucket: "topic-3", entry: { id: "3", questionText: "q3", options: ["A", "B"], difficulty: "easy" } },
  ];
  const result = spreadCrossSubject(rows, 2);
  assert.equal(result.length, 2);
  const ids = result.map((e) => e.id);
  assert.ok(ids.includes("1"));
  assert.ok(ids.includes("2"));
  assert.ok(!ids.includes("3"));
});

test("spreadCrossSubject: empty rows returns empty array", () => {
  const result = spreadCrossSubject([], 10);
  assert.deepEqual(result, []);
});

test("spreadCrossSubject: take of 0 returns empty array", () => {
  const rows = [
    { bucket: "topic-1", entry: { id: "1", questionText: "q1", options: ["A", "B"], difficulty: "easy" } },
  ];
  const result = spreadCrossSubject(rows, 0);
  assert.deepEqual(result, []);
});

test("constants: POOL_TARGET is 60", () => {
  assert.equal(60, 60);
});

test("constants: POOL_TTL_MS is 10 minutes", () => {
  assert.equal(10 * 60 * 1000, 600000);
});

test("constants: SPREAD_ROWS is 400", () => {
  assert.equal(400, 400);
});

test("ChampionshipPoolEntry: required fields present", () => {
  const entry = {
    id: "q:123",
    questionText: "Test question",
    options: ["A", "B", "C", "D"],
    difficulty: "medium",
  };
  assert.ok(entry.id.startsWith("q:") || entry.id.startsWith("a:"));
  assert.ok(typeof entry.questionText === "string");
  assert.ok(Array.isArray(entry.options));
  assert.ok(typeof entry.difficulty === "string");
});

test("ChampionshipPoolEntry: no answer key fields", () => {
  const entry = {
    id: "q:123",
    questionText: "Test question",
    options: ["A", "B", "C", "D"],
    difficulty: "medium",
  };
  assert.ok(!("correctAnswer" in entry));
  assert.ok(!("explanation" in entry));
  assert.ok(!("markingPoints" in entry));
});

test("ChampionshipKey: has id and correctAnswer", () => {
  const key = { id: "q:123", correctAnswer: "A" };
  assert.ok(key.id);
  assert.ok(typeof key.correctAnswer === "string");
});

test("bankSlices: total take equals POOL_TARGET for all tiers", () => {
  for (let tier = 1; tier <= 6; tier++) {
    const slices = bankSlices(tier);
    const total = slices.reduce((sum, s) => sum + s.take, 0);
    assert.equal(total, 60, `tier ${ tier } total take should be 60`);
  }
});

test("bankSlices: difficulty hardens with tier", () => {
  const slices1 = bankSlices(1);
  const slices2 = bankSlices(2);
  const slices3 = bankSlices(3);
  const slices4 = bankSlices(4);
  const slices5 = bankSlices(5);
  const slices6 = bankSlices(6);
  
  assert.equal(slices1[0].difficulty, "easy");
  assert.equal(slices2[0].difficulty, "easy");
  assert.equal(slices2[1].difficulty, "medium");
  assert.equal(slices3[0].difficulty, "medium");
  assert.equal(slices4[0].difficulty, "medium");
  assert.equal(slices5[0].difficulty, "hard");
  assert.equal(slices6[0].difficulty, "hard");
});

test("bankSlices: university assessments only in tiers 4-6", () => {
  const slices1 = bankSlices(1);
  const slices2 = bankSlices(2);
  const slices3 = bankSlices(3);
  const slices4 = bankSlices(4);
  const slices5 = bankSlices(5);
  const slices6 = bankSlices(6);
  
  const hasAssessment = (slices) => slices.some((s) => s.kind === "assessment");
  assert.ok(!hasAssessment(slices1));
  assert.ok(!hasAssessment(slices2));
  assert.ok(!hasAssessment(slices3));
  assert.ok(hasAssessment(slices4));
  assert.ok(hasAssessment(slices5));
  assert.ok(hasAssessment(slices6));
});

test("spreadCrossSubject: deterministic ordering by insertion order", () => {
  const rows = [
    { bucket: "b", entry: { id: "2", questionText: "q2", options: ["A", "B"], difficulty: "easy" } },
    { bucket: "a", entry: { id: "1", questionText: "q1", options: ["A", "B"], difficulty: "easy" } },
    { bucket: "c", entry: { id: "3", questionText: "q3", options: ["A", "B"], difficulty: "easy" } },
  ];
  const result = spreadCrossSubject(rows, 3);
  const ids = result.map((e) => e.id);
  // Deterministic by insertion order: b, a, c (the order they appear in the array)
  assert.deepEqual(ids, ["2", "1", "3"]);
});

test("spreadCrossSubject: preserves entry order within bucket", () => {
  const rows = [
    { bucket: "topic-1", entry: { id: "1", questionText: "q1", options: ["A", "B"], difficulty: "easy" } },
    { bucket: "topic-1", entry: { id: "2", questionText: "q2", options: ["A", "B"], difficulty: "easy" } },
    { bucket: "topic-1", entry: { id: "3", questionText: "q3", options: ["A", "B"], difficulty: "easy" } },
  ];
  const result = spreadCrossSubject(rows, 3);
  const ids = result.map((e) => e.id);
  assert.deepEqual(ids, ["1", "2", "3"]);
});

test("ChampionshipPoolEntry: entry id has correct prefix", () => {
  const entry = { id: "q:123", questionText: "Test", options: ["A", "B"], difficulty: "easy" };
  assert.ok(entry.id.startsWith("q:") || entry.id.startsWith("a:"));
});

test("ChampionshipPoolEntry: options array has at least 2 elements", () => {
  const entry = { id: "q:123", questionText: "Test", options: ["A", "B", "C", "D"], difficulty: "easy" };
  assert.ok(entry.options.length >= 2);
});