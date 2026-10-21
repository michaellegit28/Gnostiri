import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { presetFor } from "@/lib/cbt/config";
import { gradeSubject, type CbtReport, type SubjectResult } from "@/lib/cbt/scoring";

interface SubmitBody {
  boardCode?: string;
  mode?: "simulation" | "practice";
  answers?: Record<string, { chosen: number | null; text?: string; marked?: boolean }>;
  durationUsedSec?: number;
  /** subject papers as delivered (topicId + question ids + option count) */
  papers?: { topicId: string; title: string; questionIds: string[] }[];
}

/**
 * POST /api/cbt/submit — authoritative grading. The client never saw the
 * keys; everything it claims about correctness is recomputed here from the DB.
 */
export async function POST(req: NextRequest) {
  let body: SubmitBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }

  const preset = presetFor(body.boardCode ?? "");
  if (!preset) return NextResponse.json({ error: "unknown board" }, { status: 400 });
  const mode = body.mode === "practice" ? "practice" : "simulation";
  const papers = (body.papers ?? []).filter((p) => /^[a-z0-9-]+$/.test(p.topicId));
  if (!papers.length) return NextResponse.json({ error: "papers required" }, { status: 400 });

  const allIds = papers.flatMap((p) => p.questionIds).filter((id) => /^[A-Za-z0-9._-]+$/.test(id));
  const rows = await prisma.question.findMany({
    where: { id: { in: allIds } },
    select: { id: true, options: true, correctAnswer: true, questionText: true },
  });
  const byId = new Map(rows.map((r) => [r.id, r]));
  const answers = body.answers ?? {};

  const subjectResults: SubjectResult[] = [];
  const review: CbtReport["review"] = [];
  let answeredCount = 0;

  for (const paper of papers) {
    let correct = 0;
    let answered = 0;
    for (const qid of paper.questionIds) {
      const row = byId.get(qid);
      const a = answers[qid];
      if (!row) continue;
      const options = Array.isArray(row.options) ? row.options.map(String) : [];
      const correctIndex = options.findIndex((o) => o === row.correctAnswer);
      const chosenIndex = a && typeof a.chosen === "number" ? a.chosen : null;
      if (chosenIndex !== null) answered++;
      const isCorrect = chosenIndex !== null && chosenIndex === correctIndex;
      if (isCorrect) correct++;
      review.push({
        questionId: qid,
        subject: paper.title,
        chosenIndex,
        correctIndex: correctIndex < 0 ? 0 : correctIndex,
        correctText: row.correctAnswer,
        options,
        questionText: row.questionText,
        correct: isCorrect,
        marked: Boolean(a?.marked),
      });
    }
    answeredCount += answered;
    const g = gradeSubject(correct, paper.questionIds.length, preset.scoring);
    subjectResults.push({
      topicId: paper.topicId,
      title: paper.title,
      total: paper.questionIds.length,
      correct,
      rawPercent: g.rawPercent,
      scaled: g.scaled,
      grade: g.grade,
    });
  }

  const totalScore = subjectResults.reduce((s, r) => s + r.scaled, 0);
  const maxTotal = preset.scoring.kind === "jamb-scale" ? preset.scoring.maxTotal : preset.scoring.maxTotal * subjectResults.length;
  const percent = maxTotal > 0 ? Math.round((totalScore / maxTotal) * 100) : 0;
  const grade = preset.scoring.kind === "percent" ? preset.scoring.grades.find((x) => percent >= x.min)?.grade : undefined;

  const report: CbtReport = {
    boardCode: preset.code,
    boardName: preset.name,
    mode,
    model: preset.scoring,
    subjects: subjectResults,
    totalScore,
    maxTotal,
    percent,
    passMark: preset.scoring.kind === "jamb-scale" ? preset.scoring.passMark : undefined,
    passed: preset.scoring.kind === "jamb-scale" ? totalScore >= preset.scoring.passMark : undefined,
    grade,
    review,
    answeredCount,
    questionCount: allIds.length,
    durationUsedSec: Math.max(0, Math.min(Number(body.durationUsedSec) || 0, 24 * 3600)),
  };

  // Best-effort attempt history is device-local (results UI reads the report
  // from sessionStorage); nothing user-identifiable is persisted here.
  return NextResponse.json(report);
}
