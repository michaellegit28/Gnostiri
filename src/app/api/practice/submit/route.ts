import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { scorePracticeSession } from "@/lib/exam-manifest";
import { recordLearningActivity } from "@/lib/activity";

export const dynamic = "force-dynamic";

// POST /api/practice/submit — grades the SERVER-STORED draft answers and
// closes the session. Objective sections score per question; theory sections
// return model answers + marking points for self-assessment (MVP). After
// submit, every further write to the session is 409.
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const sessionId = String(body?.sessionId || "");
  if (!sessionId) return NextResponse.json({ error: "sessionId is required" }, { status: 400 });

  const session = await prisma.practiceSession.findUnique({ where: { id: sessionId } });
  if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });
  if (session.userId !== user.id) {
    return NextResponse.json({ error: "This session belongs to another learner" }, { status: 403 });
  }
  if (session.status !== "active") return NextResponse.json({ error: "Session already submitted" }, { status: 409 });

  const breakdown = await scorePracticeSession(session);

  await prisma.practiceSession.update({
    where: { id: sessionId },
    data: { status: "completed" },
  });

  await recordLearningActivity(user.id);
}
