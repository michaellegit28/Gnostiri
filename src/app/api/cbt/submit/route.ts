import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import prisma from "@/lib/db";
import { presetFor } from "@/lib/cbt/config";
import { gradeSubject, type CbtReport, type SubjectResult } from "@/lib/cbt/scoring";
import { getCurrentUser } from "@/lib/server-auth";
import { recordLearningActivity } from "@/lib/activity";
import { descendantTopicIds } from "@/lib/cbt/data";

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
  const boardRoot = preset.code.toLowerCase();
  const papers = (body.papers ?? []).filter((p) => /^[a-z0-9-]+$/.test(p.topicId) && p.topicId.startsWith(`${boardRoot}-`));
  if (!papers.length) return NextResponse.json({ error: "papers required" }, { status: 400 });
  if (papers.some((p) => !Array.isArray(p.questionIds) || p.questionIds.length > 100)) {
    return NextResponse.json({ error: "paper too large" }, { status: 400 });
  }

  const allIds = papers.flatMap((p) => p.questionIds).filter((id) => /^[A-Za-z0-9._-]+$/.test(id));
  if (allIds.length > 300) return NextResponse.json({ error: "too many questions" }, { status: 400 });

  // Route-level reveal budget: a garbage-answering script cannot pull the bank
  // faster than a handful of submits per minute (the middleware's global
  // 100/min/IP still applies on top). Fails open on Redis errors by design —
  // production 503s upstream when the limiter is unconfigured entirely.
  const ip = req.ip ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rlUrl = process.env.UPSTASH_REDIS_REST_URL;
  const rlToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (rlUrl && rlToken) {
    try {
      const key = `route-limit:cbt-submit:${ip}:${Math.floor(Date.now() / 60000)}`;
      const incr = await fetch(`${rlUrl}/incr/${encodeURIComponent(key)}`, { headers: { Authorization: `Bearer ${rlToken}` }, cache: "no-store" });
      const { result } = (await incr.json()) as { result?: number | string };
      if (Number(result) === 1) {
        await fetch(`${rlUrl}/expire/${encodeURIComponent(key)}/70`, { headers: { Authorization: `Bearer ${rlToken}` }, cache: "no-store" });
      }
      if (Number(result) > 6) return NextResponse.json({ error: "Too many submissions — slow down." }, { status: 429 });
    } catch {
      // fail open: the global middleware limit still bounds abuse
    }
  }

  // Membership check: a submitted id must be a real question under the topic
  // tree its paper claims. The sim is deliberately stateless and anonymous,
  // so membership — not a session — is what stops enumeration of the bank.
  const [idRows, topicSets] = await Promise.all([
    prisma.question.findMany({
      where: { id: { in: allIds } },
      select: { id: true, topicId: true, options: true, correctAnswer: true, questionText: true },
    }),
    Promise.all(papers.map((p) => descendantTopicIds(p.topicId))),
  ]);
  type GradeRow = {
    id: string;
    topicId: string;
    options: Prisma.JsonValue;
    correctAnswer: string;
    questionText: string;
  };
  // Explicit tuple types + Array.from keep this compatible with the repo's ES5
  // TS target without needing downlevelIteration.
  const rowById = new Map<string, GradeRow>(
    idRows.map((r) => [r.id, r] as [string, GradeRow])
  );
  const memberIds = new Set<string>();
  papers.forEach((p, i) => {
    const tree = new Set(topicSets[i]);
    for (const id of p.questionIds) {
      const row = rowById.get(id);
      if (row && tree.has(row.topicId)) memberIds.add(id);
    }
  });
  const memberPapers = papers.map((p) => ({ ...p, questionIds: p.questionIds.filter((id) => memberIds.has(id)) }));
  const byId = new Map<string, GradeRow>(
    Array.from(rowById.entries()).filter(([id]) => memberIds.has(id))
  );
  const answers = body.answers ?? {};

  const subjectResults: SubjectResult[] = [];
  const review: CbtReport["review"] = [];
  let answeredCount = 0;

  for (const paper of memberPapers) {
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
        // Keys are revealed only for questions the candidate actually
        // answered — a zero-effort submission must not return the scheme.
        correctIndex: chosenIndex === null ? -1 : correctIndex < 0 ? 0 : correctIndex,
        correctText: chosenIndex === null ? "" : row.correctAnswer,
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
    questionCount: memberIds.size,
    durationUsedSec: Math.max(0, Math.min(Number(body.durationUsedSec) || 0, 24 * 3600)),
  };

  // Best-effort attempt history is device-local (results UI reads the report
  // from sessionStorage); nothing user-identifiable is persisted here.
  // CBT is usable anonymously so a prospective student can sit a full sim
  // before signing up; the streak is recorded only when we know who they are.
  const cbtUser = await getCurrentUser();
  if (cbtUser) await recordLearningActivity(cbtUser.id);
  return NextResponse.json(report);
}
