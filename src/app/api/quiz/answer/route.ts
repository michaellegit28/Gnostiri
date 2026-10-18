import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  const { domain, topicId, questionId, answer } = await req.json();
  if (!["highschool", "university", "extras"].includes(domain)) return NextResponse.json({ error: "Domain not found" }, { status: 404 });
  if (!topicId || !questionId || typeof answer !== "string") return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  const question = await prisma.question.findFirst({ where: { id: questionId, topicId, domain } });
  if (!question) return NextResponse.json({ error: "Question not found" }, { status: 404 });
  if (!Array.isArray(question.options) || !question.options.some((option) => String(option) === answer)) return NextResponse.json({ error: "Choose one of the listed options" }, { status: 400 });
  return NextResponse.json({ isCorrect: answer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase(), correctAnswer: question.correctAnswer, explanation: question.explanation });
}
