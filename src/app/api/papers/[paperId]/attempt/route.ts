import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";

interface SubmittedAnswer {
  questionId: string;
  selectedAnswer: string | null;
}

// Grade a paper attempt. Answers may be partial (timed auto-submit at zero),
// but every provided answer must be one of the listed options. Marks come
// from PaperQuestion.marks, so score/maxScore are in marks, not question
// count. Attempts are saved to the signed-in user's account only — anonymous
// preview visitors still get their results back unsaved.
export async function POST(req: NextRequest, { params }: { params: { paperId: string } }) {
  try {
    const body = await req.json();
    const mode = body?.mode === "open" ? "open" : "timed";
    const durationSeconds = Math.min(Math.max(Number(body?.durationSeconds) || 0, 0), 86400);
    const submitted: SubmittedAnswer[] = Array.isArray(body?.answers) ? body.answers : [];

    const paper = await prisma.examPaper.findFirst({
      where: { id: params.paperId, isPublished: true },
    });
    if (!paper) return NextResponse.json({ error: "Paper not found" }, { status: 404 });

    const questions = await prisma.paperQuestion.findMany({
      where: { paperId: paper.id },
      orderBy: { orderIndex: "asc" },
    });
    if (questions.length === 0) return NextResponse.json({ error: "Paper has no questions" }, { status: 400 });

    const byQuestion = new Map(
      submitted
        .map((entry) => [String(entry.questionId), entry.selectedAnswer == null ? null : String(entry.selectedAnswer).slice(0, 500)])
    );
    for (const question of questions) {
      const answer = byQuestion.get(question.id);
      if (answer != null && !(Array.isArray(question.options) && question.options.some((option) => String(option) === answer))) {
        return NextResponse.json({ error: "Choose one of the listed options" }, { status: 400 });
      }
    }

    const results = questions.map((question) => {
      const answer = byQuestion.get(question.id) ?? null;
      const isCorrect =
        answer != null && answer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
      return {
        questionId: question.id,
        selectedAnswer: answer,
        correctAnswer: question.correctAnswer,
        earnedMarks: isCorrect ? question.marks : 0,
        marks: question.marks,
        explanation: question.explanation,
        isCorrect,
      };
    });

    const score = results.reduce((sum, result) => sum + result.earnedMarks, 0);
    const maxScore = results.reduce((sum, result) => sum + result.marks, 0);

    let attemptId: string | null = null;
    let saved = false;
    const user = await getCurrentUser();
    if (user) {
      const attempt = await prisma.paperAttempt.create({
        data: {
          userId: user.id,
          paperId: paper.id,
          mode,
          score,
          maxScore,
          answers: results.map((result) => ({
            questionId: result.questionId,
            selectedAnswer: result.selectedAnswer,
          })),
          durationSeconds,
        },
      });
      attemptId = attempt.id;
      saved = true;
    }

    return NextResponse.json({ score, maxScore, results, saved, attemptId });
  } catch (error) {
    console.error("Error grading paper attempt:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
