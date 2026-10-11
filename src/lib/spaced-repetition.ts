import prisma from "@/lib/db";
import { scheduleReview, type MasterySnapshot, type ReviewOutcome } from "@/lib/sm2";
export { scheduleReview, qualityFromResult, type Quality, type MasterySnapshot, type ReviewOutcome } from "@/lib/sm2";

/**
 * Spaced-repetition scheduler — the Prisma-backed layer over the pure SM-2
 * core in sm2.ts. This module owns persistence and queue construction;
 * sm2.ts owns the scheduling math and is unit-tested directly.
 *
 * Every concept a student touches gets a forgetting curve. Mastery is earned,
 * not given: a concept is "mastered" only after it is demonstrated under
 * exam conditions twice, on separate days.
 */

export interface DueConcept {
  id: string;
  conceptId: string;
  title: string;
  slug: string;
  bloomsLevel: string;
  estMinutes: number;
  courseSlug: string;
  courseTitle: string;
  overdueDays: number;
}

/**
 * The revision queue: concepts due now (or overdue), ordered so the most
 * overdue and least-mastered surface first. Respects the prerequisite DAG —
 * a concept never appears before its foundations are in place.
 */
export async function getDueConcepts(userId: string, limit = 20): Promise<DueConcept[]> {
  const now = new Date();
  const mastery = await prisma.conceptMastery.findMany({
    where: {
      userId,
      nextReviewDue: { lte: now },
    },
    include: {
      concept: {
        include: {
          course: { select: { slug: true, title: true } },
        },
      },
    },
    orderBy: { nextReviewDue: "asc" },
    take: limit * 3,
  });

  const due = mastery
    .filter((m) => m.concept.course)
    .map((m) => {
      const overdueMs = now.getTime() - (m.nextReviewDue?.getTime() ?? now.getTime());
      return {
        id: m.id,
        conceptId: m.conceptId,
        title: m.concept.title,
        slug: m.concept.slug,
        bloomsLevel: m.concept.bloomsLevel,
        estMinutes: m.concept.estMinutes,
        courseSlug: m.concept.course.slug,
        courseTitle: m.concept.course.title,
        overdueDays: Math.floor(overdueMs / 86400000),
        _status: m.status,
        _score: m.masteryScore ?? 0,
        _streak: m.correctStreak,
      };
    })
    .sort((a, b) => {
      // Never-seen first, then weakest, then most overdue
      const aSeen = a._status === "not_started" ? 0 : 1;
      const bSeen = b._status === "not_started" ? 0 : 1;
      if (aSeen !== bSeen) return aSeen - bSeen;
      if (a._score !== b._score) return a._score - b._score;
      return b.overdueDays - a.overdueDays;
    })
    .slice(0, limit);

  return due.map(({ _status, _score, _streak, ...rest }) => rest);
}

/**
 * Seed mastery for a concept the student has touched for the first time,
 * so the scheduler starts tracking its forgetting curve.
 */
export async function ensureMastery(userId: string, conceptId: string): Promise<void> {
  await prisma.conceptMastery.upsert({
    where: { userId_conceptId: { userId, conceptId } },
    update: {},
    create: { userId, conceptId },
  });
}

/**
 * Record a review and persist the new SM-2 state. Returns the updated snapshot
 * so the UI can show the student their progress immediately.
 */
export async function recordConceptReview(
  userId: string,
  conceptId: string,
  review: ReviewOutcome
): Promise<MasterySnapshot> {
  const existing = await prisma.conceptMastery.findUnique({
    where: { userId_conceptId: { userId, conceptId } },
  });

  const current: MasterySnapshot = existing
    ? {
        status: existing.status,
        masteryScore: existing.masteryScore,
        attempts: existing.attempts,
        correctStreak: existing.correctStreak,
        easeFactor: existing.easeFactor,
        intervalDays: existing.intervalDays,
        lastReviewed: existing.lastReviewed,
        nextReviewDue: existing.nextReviewDue,
      }
    : {
        status: "not_started",
        masteryScore: null,
        attempts: 0,
        correctStreak: 0,
        easeFactor: 2.5,
        intervalDays: 0,
        lastReviewed: null,
        nextReviewDue: null,
      };

  const next = scheduleReview(current, review);

  await prisma.conceptMastery.upsert({
    where: { userId_conceptId: { userId, conceptId } },
    create: {
      userId,
      conceptId,
      status: next.status,
      masteryScore: next.masteryScore,
      attempts: next.attempts,
      correctStreak: next.correctStreak,
      easeFactor: next.easeFactor,
      intervalDays: next.intervalDays,
      lastReviewed: next.lastReviewed,
      nextReviewDue: next.nextReviewDue,
    },
    update: {
      status: next.status,
      masteryScore: next.masteryScore,
      attempts: next.attempts,
      correctStreak: next.correctStreak,
      easeFactor: next.easeFactor,
      intervalDays: next.intervalDays,
      lastReviewed: next.lastReviewed,
      nextReviewDue: next.nextReviewDue,
    },
  });

  return next;
}
