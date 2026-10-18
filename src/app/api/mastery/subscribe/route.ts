import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { ensureMastery } from "@/lib/spaced-repetition";

export const dynamic = "force-dynamic";

/**
 * POST /api/mastery/subscribe
 * { conceptId }
 *
 * Seeds a concept into the student's spaced-repetition queue so the scheduler
 * starts tracking its forgetting curve. This is the study-loop handoff: a
 * student finishing/sitting a lesson adds its concept to revision, so mastery
 * begins the moment they touch it. Idempotent — re-subscribing a concept is a
 * no-op (ensureMastery upserts on update: {}).
 */
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const conceptId = typeof body.conceptId === "string" ? body.conceptId : null;
  if (!conceptId) return NextResponse.json({ error: "conceptId required" }, { status: 400 });

  const concept = await prisma.conceptNode.findUnique({
    where: { id: conceptId },
    select: { id: true, title: true },
  });
  if (!concept) return NextResponse.json({ error: "Concept not found" }, { status: 404 });

  await ensureMastery(user.id, conceptId);

  return NextResponse.json({ conceptId, title: concept.title, subscribed: true });
}
