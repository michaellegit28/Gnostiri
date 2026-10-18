import prisma from "@/lib/db";

export async function recordLearningActivity(userId: string) {
  const profile = await prisma.profile.findUnique({ where: { userId } });
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const lastDay = profile?.lastActive.toISOString().slice(0, 10);
  const yesterday = new Date(now.getTime() - 86400000).toISOString().slice(0, 10);
  const streak = lastDay === today ? profile?.streak || 1 : lastDay === yesterday ? (profile?.streak || 0) + 1 : 1;
  await prisma.profile.upsert({ where: { userId }, update: { streak, lastActive: now }, create: { userId, streak, lastActive: now } });
}
