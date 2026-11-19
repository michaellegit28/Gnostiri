import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { buildRenderManifest } from "@/lib/exam-manifest";

export const dynamic = "force-dynamic";

// POST /api/practice/draft — autosave partial answers for the CURRENT
// section only. Locked sections reject with 409; stale clients can never
// write backwards. Answers live server-side, so submit scores what was
// actually saved, not what a client claims.
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const sessionId = String(body?.sessionId || "");
  const sectionId = String(body?.sectionId || "");
  const answers = body?.answers;
  if (!sessionId || !sectionId || !Array.isArray(answers)) {
    return NextResponse.json({ error: "sessionId, sectionId and answers[] are required" }, { status: 400 });
  }

  const session = await prisma.practiceSession.findUnique({
    where: { id: sessionId },
    include: { examination: { select: { slug: true } } },
  });
  if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });
  if (session.userId !== user.id) {
    return NextResponse.json({ error: "This session belongs to another learner" }, { status: 403 });
  }
  if (session.status !== "active") return NextResponse.json({ error: "Session already submitted" }, { status: 409 });
  if (session.expiresAt && session.expiresAt < new Date()) {
    return NextResponse.json({ error: "Session expired" }, { status: 410 });
  }

  const manifest = await buildRenderManifest(
    session.examination.slug,
    session.subjectSlug,
    session.topicId
  );
  const manifestSection = manifest?.sections.find((candidate) => candidate.sectionId === sectionId);
  if (!manifestSection) {
    return NextResponse.json({ error: "Section not part of this board" }, { status: 404 });
  }

  // Bridge lock: only the active section accepts writes.
  if (manifestSection.order !== session.currentSectionIndex) {
    return NextResponse.json(
      { error: "Locked", lockedSection: true, activeSectionIndex: session.currentSectionIndex },
      { status: 409 }
    );
  }

  const safeAnswers = answers
    .map((entry: { questionId?: string; selectedAnswer?: string | null }) => ({
      questionId: String(entry?.questionId || ""),
      selectedAnswer:
        entry?.selectedAnswer == null ? null : String(entry.selectedAnswer).slice(0, 2000),
    }))
    .filter((entry: { questionId: string }) => entry.questionId.length > 0);
  const allowedQuestionIds = new Set(manifestSection.questions.map((question) => question.id));
  if (
    safeAnswers.length === 0 ||
    safeAnswers.some((entry) => !allowedQuestionIds.has(entry.questionId)) ||
    new Set(safeAnswers.map((entry) => entry.questionId)).size !== safeAnswers.length
  ) {
    return NextResponse.json({ error: "Answers must belong to the active section" }, { status: 400 });
  }

  const stored =
    (session.answers as Record<string, { questionId: string; selectedAnswer: string | null; source?: "reveal" | "draft" }[]>) ?? {};
  const existingAnswers = stored[sectionId] ?? [];
  const clientAnswerByQuestion = new Map(safeAnswers.map((entry) => [entry.questionId, entry]));
  const mergedAnswers = existingAnswers.map((entry) => {
    if (entry.source === "reveal") return entry;
    const clientEntry = clientAnswerByQuestion.get(entry.questionId);
    return clientEntry
      ? { ...clientEntry, source: "draft" as const }
      : { ...entry, source: "draft" as const };
  });
  for (const entry of safeAnswers) {
    if (!mergedAnswers.some((existing) => existing.questionId === entry.questionId)) {
      mergedAnswers.push({ ...entry, source: "draft" });
    }
  }
  await prisma.practiceSession.update({
    where: { id: sessionId },
    data: { answers: { ...stored, [sectionId]: mergedAnswers } },
  });

  return NextResponse.json({ ok: true, saved: mergedAnswers.length, sectionId });
}
