import prisma from "@/lib/db";
import { recordAnalyticsEvent } from "@/lib/analytics-server";

/**
 * Advances the learner's daily streak. Every completion endpoint (quiz, CBT
 * submit, practice, course quiz, exam hall, mastery review, competition, pod)
 * calls this so the number on the dashboard means "days you studied", not
 * "days you happened to use two particular routes".
 *
 * This is a REWARD side-effect, never the substance of a submission. The
 * caller's work is already committed by the time we run, so a failure here
 * must not turn a finished exam into a 500 and lose the student's answers. We
 * swallow and log instead — a missing streak is a bug; lost work is a defect.
 */
export async function recordLearningActivity(userId: string) {
  try {
    const profile = await prisma.profile.findUnique({ where: { userId } });
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const lastDay = profile?.lastActive.toISOString().slice(0, 10);
    const yesterday = new Date(now.getTime() - 86400000).toISOString().slice(0, 10);
    const streak = lastDay === today ? profile?.streak || 1 : lastDay === yesterday ? (profile?.streak || 0) + 1 : 1;
    await prisma.profile.upsert({ where: { userId }, update: { streak, lastActive: now }, create: { userId, streak, lastActive: now } });
    if (profile && streak > profile.streak) {
      await recordAnalyticsEvent(userId, "streak_incremented", { count: streak });
    }
  } catch (error) {
    console.error(`recordLearningActivity failed for ${userId}; the learner's submission is unaffected:`, error);
  }
}