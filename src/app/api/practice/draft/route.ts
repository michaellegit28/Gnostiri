import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

// POST /api/practice/draft — autosave partial answers for the CURRENT
// section only. Locked sections reject with 409; stale clients can never
// write backwards. Answers live server-side, so submit scores what was
// actually saved, not what a client claims.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const sessionId = String(body?.sessionId || "");
  const sectionId = String(body?.sectionId || "");
  const answers = body?.answers;
  if (!sessionId || !sectionId || !Array.isArray(answers)) {
    return NextResponse.json({ error: "sessionId, sectionId and answers[] are required" }, { status: 400 });
  }

  const session = await prisma.practiceSession.findUnique({ where: { id: sessionId } });
  if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });
  if (session.status !== "active") return NextResponse.json({ error: "Session already submitted" }, { status: 409 });
  if (session.expiresAt && session.expiresAt < new Date()) {
    return NextResponse.json({ error: "Session expired" }, { status: 410 });
  }

  const paper = await prisma.examinationPaper.findFirst({
    where: { examinationId: session.examinationId, paperId: sectionId },
  });
  if (!paper) return NextResponse.json({ error: "Section not part of this board" }, { status: 404 });

  // Bridge lock: only the active section accepts writes.
  if (paper.sequence !== session.currentSectionIndex) {
    return NextResponse.json(
      { error: "Locked", lockedSection: true, activeSectionIndex: session.currentSectionIndex },
      { status: 409 }
    );
  }

  const safeAnswers = answers
    .map((entry: { questionId?: string; selectedAnswer?: string | null }) => ({
      questionId: String(entry?.questionId || ""),
      selectedAnswer: entry?.selectedAnswer == null ? null : String(entry.selectedAnswer).slice(0, 2000),
    }))
    .filter((entry: { questionId: string }) => entry.questionId.length > 0);

  const stored =
    (session.answers as Record<string, { questionId: string; selectedAnswer: string | null }[]>) ?? {};
  await prisma.practiceSession.update({
    where: { id: sessionId },
    data: { answers: { ...stored, [sectionId]: safeAnswers } },
  });

  return NextResponse.json({ ok: true, saved: safeAnswers.length, sectionId });
}
