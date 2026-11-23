import prisma from "@/lib/db";
import type { AnalyticsEventType } from "@/lib/analytics-client";

export async function recordAnalyticsEvent(
  userId: string,
  type: AnalyticsEventType,
  meta: Record<string, string | number | boolean> = {}
) {
  let optedOut = false;
  try {
    const preferences = await prisma.userPreference.findUnique({
      where: { userId },
      select: { analyticsOptOut: true },
    });
    optedOut = preferences?.analyticsOptOut ?? false;
  } catch {
    optedOut = false;
  }
  if (optedOut) return;
  try {
    await prisma.analyticsEvent.create({
      data: {
        userId,
        type,
        meta,
      },
    });
  } catch {
    return;
  }
}
