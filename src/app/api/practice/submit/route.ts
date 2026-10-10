import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { scorePracticeSession } from "@/lib/exam-manifest";

export const dynamic = "force-dynamic";

// POST /api/practice/submit — grades the SERVER-STORED draft answers and
// closes the session. Objective sections score per question; theory sections
// return model answers + marking points for self-assessment (MVP). After
// submit, every further write to the session is 409.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const sessionId = String(body?.sessionId || "");
  if (!sessionId) return NextResponse.json({ error: "sessionId is required" }, { status: 400 });

  const session = await prisma.practiceSession.findUnique({ where: { id: sessionId } });
  if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });
  if (session.status !== "active") return NextResponse.json({ error: "Session already submitted" }, { status: 409 });

  const breakdown = await scorePracticeSession(session);

  await prisma.practiceSession.update({
    where: { id: sessionId },
    data: { status: "completed" },
  });

  return NextResponse.json(breakdown);
}
