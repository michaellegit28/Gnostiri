import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { getDueConcepts } from "@/lib/spaced-repetition";

export const dynamic = "force-dynamic";

/**
 * GET /api/mastery/due
 * The student's revision queue — concepts whose forgetting curve has elapsed.
 */
export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const limit = Math.min(50, Math.max(1, Number(req.nextUrl.searchParams.get("limit") || 20)));
  let srsEnabled = true;
  try {
    const preferences = await prisma.userPreference.findUnique({
      where: { userId: user.id },
      select: { srsEnabled: true },
    });
    srsEnabled = preferences?.srsEnabled ?? true;
  } catch {
    srsEnabled = true;
  }
  const due = srsEnabled ? await getDueConcepts(user.id, limit) : [];
  return NextResponse.json({ due, count: due.length, enabled: srsEnabled });
}
