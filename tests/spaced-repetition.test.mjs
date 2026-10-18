import { test, describe } from "node:test";
import assert from "node:assert";
import { scheduleReview, qualityFromResult } from "../src/lib/sm2.ts";

const BASE = {
  status: "not_started",
  masteryScore: null,
  attempts: 0,
  correctStreak: 0,
  easeFactor: 2.5,
  intervalDays: 0,
  lastReviewed: null,
  nextReviewDue: null,
};

describe("SM-2 spaced repetition", () => {
  test("first correct review schedules a 1-day interval", () => {
    const next = scheduleReview(BASE, { quality: 5, correct: true, examCondition: true });
    assert.equal(next.intervalDays, 1, "first success → 1 day");
    assert.equal(next.attempts, 1);
    assert.equal(next.status, "completed", "one success completes it, but is not yet mastery");
    assert.notEqual(next.status, "mastered", "one success is not mastery");
    assert.ok(next.nextReviewDue > new Date(), "a due date is set");
  });

  test("interval grows: 1 → 3 → then multiplicative", () => {
    let s = scheduleReview(BASE, { quality: 5, correct: true, examCondition: true });
    assert.equal(s.intervalDays, 1);
    s = scheduleReview(s, { quality: 5, correct: true, examCondition: true });
    assert.equal(s.intervalDays, 3, "second success → 3 days");
    const prev = s.intervalDays;
    s = scheduleReview(s, { quality: 5, correct: true, examCondition: true });
    assert.ok(s.intervalDays > prev, "third success grows the interval");
  });

  test("a lapse collapses the interval to 1", () => {
    let s = scheduleReview(BASE, { quality: 5, correct: true, examCondition: true });
    s = scheduleReview(s, { quality: 5, correct: true, examCondition: true });
    assert.equal(s.intervalDays, 3);
    s = scheduleReview(s, { quality: 1, correct: false, examCondition: true });
    assert.equal(s.intervalDays, 1, "failure resets the interval");
    assert.equal(s.correctStreak, 0, "streak resets");
    assert.equal(s.status, "in_progress");
  });

  test("mastery requires two exam-condition successes", () => {
    let s = scheduleReview(BASE, { quality: 5, correct: true, examCondition: true });
    assert.notEqual(s.status, "mastered", "one success is not mastery");
    s = scheduleReview(s, { quality: 5, correct: true, examCondition: true });
    assert.equal(s.status, "mastered", "two exam successes → mastered");
    assert.ok(s.masteryScore >= 0.8, "mastery score clears the bar");
  });

  test("practice (non-exam) reviews never grant mastery", () => {
    let s = scheduleReview(BASE, { quality: 5, correct: true, examCondition: false });
    s = scheduleReview(s, { quality: 5, correct: true, examCondition: false });
    s = scheduleReview(s, { quality: 5, correct: true, examCondition: false });
    assert.notEqual(s.status, "mastered", "practice never masters");
    assert.equal(s.masteryScore, null, "practice does not feed the score");
  });

  test("ease factor stays within bounds", () => {
    let s = { ...BASE };
    for (let i = 0; i < 20; i++) {
      s = scheduleReview(s, { quality: 0, correct: false, examCondition: true });
    }
    assert.ok(s.easeFactor >= 1.3, `ease floors at 1.3, got ${s.easeFactor}`);
    let s2 = { ...BASE };
    for (let i = 0; i < 20; i++) {
      s2 = scheduleReview(s2, { quality: 5, correct: true, examCondition: true });
    }
    assert.ok(s2.easeFactor <= 3.2, `ease caps at 3.2, got ${s2.easeFactor}`);
  });

  test("quality mapping rewards honest confidence", () => {
    assert.equal(qualityFromResult(true, "high"), 5);
    assert.equal(qualityFromResult(true, "medium"), 4);
    assert.equal(qualityFromResult(true, "low"), 3, "a guessed correct answer scores lower");
    assert.equal(qualityFromResult(false, "low"), 2, "aware-of-being-wrong is less bad");
    assert.equal(qualityFromResult(false, "high"), 1, "confident-and-wrong is the worst");
  });
});
