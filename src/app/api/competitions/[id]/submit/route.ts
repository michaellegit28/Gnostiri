import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { createNotification } from "@/lib/notify";
import { buildCupQuestionSet } from "../question-set";

export const dynamic = "force-dynamic";

interface SubmittedAnswer {
  questionId: unknown;
  selected: unknown;
}

interface BreakdownRow {
  questionId: string;
  selected: string | null;
  correct: boolean;
  correctAnswer: string | null;
  explanation: string | null;
}

// Grading comparison — same convention as /api/courses/[courseId]/quiz.
function normalise(value: string): string {
  return value.trim().toLowerCase();
}

// POST /api/competitions/[id]/submit — grade a Speed Cup attempt.
//
// The question set is RE-DERIVED from the competition id (question-set.ts), so
// no set has to be stored between the session and the submit: the same seed
// produces the same questions for the marker as for the racer. The answer key
// (correctAnswer / explanation) is read here, after the submit, and only the
// breakdown comes back — the key never leaves the server during play.
//
// Scoring: +1 per correct, 0 per wrong. NO negative marking — a speed cup is a
// race against the clock and against the field; penalising a guess would push
// racers to leave questions blank rather than trade accuracy for pace, which
// is the opposite of what the format measures. Best-of keeps the higher score,
// so a retry can only improve a member's standing.
//
// Ranks are recomputed for EVERY member of this competition in one pass, so a
// fresh score cannot leave the ladder half-sorted; members the submitter
// overtook are notified with "overtaken", and the host gets the "milestone".
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const competition = await prisma.competition.findUnique({ where: { id: params.id } });
  if (!competition) return NextResponse.json({ error: "Competition not found" }, { status: 404 });

  const member = await prisma.competitionMember.findUnique({
    where: { competitionId_userId: { competitionId: competition.id, userId: user.id } },
  });
  if (!member) return NextResponse.json({ error: "Competition not found" }, { status: 404 });

  if (competition.status === "cancelled" || competition.status === "finished") {
    return NextResponse.json({ error: "This cup is no longer accepting answers" }, { status: 400 });
  }
  if (competition.format !== "speed") {
    return NextResponse.json({ error: "Live play is not available for this format" }, { status: 400 });
  }

  const body = (await req.json().catch(() => null)) as { answers?: SubmittedAnswer[] } | null;
  const answers = body?.answers;
  if (!Array.isArray(answers) || answers.length === 0) {
    return NextResponse.json({ error: "Answers required" }, { status: 400 });
  }

  const questions = await buildCupQuestionSet(competition);
  if (questions.length === 0) {
    return NextResponse.json({ error: "This cup has no questions available" }, { status: 404 });
  }
  const questionById = new Map(questions.map((q) => [q.id, q]));

  // Submit-side validation: only ids from THIS cup's derived set, each once,
  // and only a served option as the selection. A selection outside the options
  // is a tampered client, not a wrong answer.
  const submitted = new Map<string, string>();
  for (const entry of answers) {
    const questionId = typeof entry?.questionId === "string" ? entry.questionId : null;
    const selected = typeof entry?.selected === "string" ? entry.selected : null;
    if (!questionId || selected === null) {
      return NextResponse.json({ error: "Each answer needs a questionId and a selected option" }, { status: 400 });
    }
    const question = questionById.get(questionId);
    if (!question) {
      return NextResponse.json({ error: "Answer submitted for a question that is not part of this cup" }, { status: 400 });
    }
    if (!question.options.includes(selected)) {
      return NextResponse.json({ error: "Choose one of the listed options" }, { status: 400 });
    }
    if (submitted.has(questionId)) {
      return NextResponse.json({ error: "One answer per question" }, { status: 400 });
    }
    submitted.set(questionId, selected);
  }

  // The answer key, read only now that the attempt exists. Unanswered
  // questions are simply wrong — the clock running out is not an error.
  const keyRows = await prisma.question.findMany({
    where: { id: { in: questions.map((q) => q.id) } },
    select: { id: true, correctAnswer: true, explanation: true },
  });
  const keyById = new Map(keyRows.map((row) => [row.id, row]));

  const breakdown: BreakdownRow[] = questions.map((question) => {
    const key = keyById.get(question.id);
    const selected = submitted.get(question.id) ?? null;
    const correct = selected !== null && normalise(selected) === normalise(key?.correctAnswer ?? "");
    return {
      questionId: question.id,
      selected,
      correct,
      correctAnswer: key?.correctAnswer ?? null,
      explanation: key?.explanation ?? null,
    };
  });
  const score = breakdown.filter((row) => row.correct).length;

  // Ladder BEFORE the write — the pre/post comparison that detects overtakes.
  const preLadder = await prisma.competitionMember.findMany({
    where: { competitionId: competition.id },
    orderBy: [{ score: "desc" }, { joinedAt: "asc" }],
    select: { userId: true },
  });
  const preIndex = new Map(preLadder.map((m, i) => [m.userId, i]));

  // Best-of: the higher score stands, so repeats can only help a member.
  const bestScore = Math.max(member.score, score);
  if (bestScore > member.score) {
    await prisma.competitionMember.update({ where: { id: member.id }, data: { score: bestScore } });
  }

  // ONE ranking pass over every member of the competition: ties break by join
  // order, and rank is positional (1..n), so the ladder can never disagree
  // with itself across surfaces.
  const ladder = await prisma.competitionMember.findMany({
    where: { competitionId: competition.id },
    orderBy: [{ score: "desc" }, { joinedAt: "asc" }],
    select: { id: true, userId: true },
  });
  const rankOf = new Map(ladder.map((m, i) => [m.userId, i + 1]));
  await prisma.$transaction(
    ladder.map((m, i) => prisma.competitionMember.update({ where: { id: m.id }, data: { rank: i + 1 } })),
  );

  const href = `/league/${competition.id}`;
  const dropped = ladder.filter(
    (m, i) => m.userId !== user.id && (preIndex.get(m.userId) ?? i) < i,
  );
  const notifications: Promise<unknown>[] = [];
  for (const m of dropped) {
    notifications.push(
      createNotification(m.userId, {
        type: "overtaken",
        title: `Overtaken in ${competition.title}`,
        body: "Another racer just passed your score — the ladder moved.",
        href,
      }),
    );
  }
  // The host hears the scores are in — but not from their own submit.
  if (competition.hostId !== user.id) {
    notifications.push(
      createNotification(competition.hostId, {
        type: "milestone",
        title: "Scores are in",
        body: `${competition.title} has a fresh score on the board.`,
        href,
      }),
    );
  }
  // A notification is a side effect: it must never fail a racer's submit.
  await Promise.allSettled(notifications);

  return NextResponse.json(
    {
      score,
      rank: rankOf.get(user.id) ?? null,
      breakdown,
    },
    { status: 201 },
  );
}
