import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { recordConceptReview, qualityFromResult, type ReviewOutcome } from "@/lib/spaced-repetition";

export const dynamic = "force-dynamic";

/**
 * POST /api/mastery/review
 * { conceptId, correct, confidence?: 'low'|'medium'|'high', examCondition?: boolean }
 *
 * Advances one concept's SM-2 state and returns the new mastery snapshot.
 */
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const conceptId = typeof body.conceptId === "string" ? body.conceptId : null;
  if (!conceptId) return NextResponse.json({ error: "conceptId required" }, { status: 400 });

  const correct = body.correct === true;
  const confidence = ["low", "medium", "high"].includes(body.confidence) ? body.confidence : undefined;
  const examCondition = body.examCondition === true;

  const concept = await prisma.conceptNode.findUnique({ where: { id: conceptId } });
  if (!concept) return NextResponse.json({ error: "Concept not found" }, { status: 404 });

  const review: ReviewOutcome = {
    quality: qualityFromResult(correct, confidence),
    correct,
    examCondition,
  };

  const snapshot = await recordConceptReview(user.id, conceptId, review);
  return NextResponse.json({ conceptId, mastery: snapshot });
}
