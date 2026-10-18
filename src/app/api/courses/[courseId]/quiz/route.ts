import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { hasPremiumAccess } from "@/lib/entitlements";

async function access(courseId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: NextResponse.json({ error: "Authentication required" }, { status: 401 }) };
  if (!(await hasPremiumAccess(user.id))) return { error: NextResponse.json({ error: "Premium subscription required" }, { status: 403 }) };
  const course = await prisma.course.findFirst({ where: { id: courseId, domain: "university", isPublished: true } });
  if (!course) return { error: NextResponse.json({ error: "Course not found" }, { status: 404 }) };
  return { user, course };
}

export async function GET(_req: NextRequest, { params }: { params: { courseId: string } }) {
  const result = await access(params.courseId); if ("error" in result) return result.error;
  const { course } = result;
  const questions = await prisma.courseQuestion.findMany({ where: { courseId: course.id, domain: "university" } });
  return NextResponse.json({ questions: questions.map((question) => ({ id: question.id, questionText: question.questionText, options: question.options })) });
}

export async function POST(req: NextRequest, { params }: { params: { courseId: string } }) {
  const result = await access(params.courseId); if ("error" in result) return result.error;
  const { user, course } = result;
  const { answers } = await req.json();
  if (!Array.isArray(answers) || !answers.length) return NextResponse.json({ error: "Answers required" }, { status: 400 });
  const questions = await prisma.courseQuestion.findMany({ where: { courseId: course.id, domain: "university", id: { in: answers.map((answer: any) => String(answer.questionId)) } } });
  if (questions.length !== answers.length || new Set(answers.map((answer: any) => answer.questionId)).size !== answers.length) return NextResponse.json({ error: "Invalid answers" }, { status: 400 });
  const results = questions.map((question) => { const answer = answers.find((entry: any) => entry.questionId === question.id); return { questionId: question.id, selectedAnswer: String(answer.selectedAnswer), correctAnswer: question.correctAnswer, explanation: question.explanation, isCorrect: String(answer.selectedAnswer).trim().toLowerCase() === question.correctAnswer.trim().toLowerCase() }; });
  if (questions.some((question) => !Array.isArray(question.options) || !question.options.some((option) => String(option) === String(answers.find((answer: any) => answer.questionId === question.id)?.selectedAnswer)))) return NextResponse.json({ error: "Choose one of the listed options" }, { status: 400 });
  const score = results.filter((result) => result.isCorrect).length;
  const attempt = await prisma.courseQuizAttempt.create({ data: { userId: user.id, courseId: course.id, domain: "university", score, maxScore: questions.length } });
  const lessons = await prisma.courseLesson.findMany({ where: { courseId: course.id, domain: "university" }, select: { id: true } });
  const completedLessons = await prisma.progress.count({ where: { userId: user.id, domain: "university", entityType: "courseLesson", entityId: { in: lessons.map((lesson) => lesson.id) }, status: "completed" } });
  const certificate = completedLessons === lessons.length && lessons.length > 0 ? await prisma.certificate.upsert({ where: { userId_courseId: { userId: user.id, courseId: course.id } }, update: {}, create: { userId: user.id, courseId: course.id, domain: "university" } }) : null;
  return NextResponse.json({ results, score, maxScore: questions.length, attemptId: attempt.id, certificateId: certificate?.id || null });
}
