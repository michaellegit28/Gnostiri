/**
 * SM-2 spaced-repetition core — pure, dependency-free.
 *
 * Kept separate from the Prisma-backed spaced-repetition.ts so the scheduling
 * math is unit-testable without a database. This is the single source of
 * truth for when a concept resurfaces in a student's revision queue.
 */

const MASTERED_DEMONSTRATIONS = 2;
const MASTERED_SCORE_FLOOR = 0.8;
const MIN_EASE = 1.3;
const MAX_EASE = 3.2;

/** Review quality (SM-2 scale 0-5), mapped from an assessment outcome. */
export type Quality = 0 | 1 | 2 | 3 | 4 | 5;

export interface MasterySnapshot {
  status: string;
  masteryScore: number | null;
  attempts: number;
  correctStreak: number;
  easeFactor: number;
  intervalDays: number;
  lastReviewed: Date | null;
  nextReviewDue: Date | null;
}

export interface ReviewOutcome {
  quality: Quality;
  correct: boolean;
  examCondition: boolean;
}

function clampEase(ease: number): number {
  return Math.min(MAX_EASE, Math.max(MIN_EASE, ease));
}

function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

/**
 * Advance one concept's SM-2 state. Pure function over the snapshot —
 * the caller persists the result, keeping this trivially testable.
 */
export function scheduleReview(current: MasterySnapshot, review: ReviewOutcome): MasterySnapshot {
  const now = new Date();
  const quality = review.quality;

  const ease = clampEase(current.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

  let interval: number;
  if (quality < 3) {
    interval = 1;
  } else {
    const prev = current.intervalDays;
    if (prev === 0) interval = 1;
    else if (prev === 1) interval = 3;
    else interval = Math.max(prev + 1, Math.round(prev * ease));
  }

  const correct = review.correct;
  const attempts = current.attempts + 1;
  const correctStreak = correct ? current.correctStreak + 1 : 0;

  const masteryScore = review.examCondition
    ? current.masteryScore == null
      ? correct ? 1 : 0
      : current.masteryScore * 0.6 + (correct ? 1 : 0) * 0.4
    : current.masteryScore;

  const status =
    masteryScore != null && correctStreak >= MASTERED_DEMONSTRATIONS && masteryScore >= MASTERED_SCORE_FLOOR
      ? "mastered"
      : attempts === 0
        ? "not_started"
        : correct
          ? "completed"
          : "in_progress";

  return {
    status,
    masteryScore,
    attempts,
    correctStreak,
    easeFactor: ease,
    intervalDays: interval,
    lastReviewed: now,
    nextReviewDue: addDays(now, interval),
  };
}

/**
 * Map a raw correctness result to an SM-2 quality score.
 * Confidence modulates the interval — a correct answer the student was sure
 * about deserves a longer gap than a lucky guess.
 */
export function qualityFromResult(correct: boolean, confidence?: "low" | "medium" | "high"): Quality {
  if (!correct) return confidence === "low" ? 2 : 1;
  if (confidence === "low") return 3;
  if (confidence === "medium") return 4;
  return 5;
}
