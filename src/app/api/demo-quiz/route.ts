import { createHmac, randomUUID, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

type DemoToken = {
  questionId: string;
  expiresAt: number;
};

function signingSecret() {
  return process.env.LAUNCH_SECRET || process.env.REVALIDATE_SECRET || "";
}

function signToken(token: DemoToken) {
  const payload = Buffer.from(JSON.stringify(token)).toString("base64url");
  const signature = createHmac("sha256", signingSecret()).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

function readToken(value: string): DemoToken | null {
  const [payload, signature] = value.split(".");
  if (!payload || !signature || !signingSecret()) return null;
  const expected = createHmac("sha256", signingSecret()).update(payload).digest("base64url");
  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return null;
  try {
    const token = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as DemoToken;
    if (!token.questionId || token.expiresAt <= Date.now()) return null;
    return token;
  } catch {
    return null;
  }
}

export async function GET() {
  if (!signingSecret()) {
    return NextResponse.json({ error: "Quiz demo is not configured" }, { status: 503 });
  }
  const candidates = await prisma.question.findMany({
    where: { domain: "highschool", type: "mcq", topic: { isPublished: true } },
    orderBy: { id: "asc" },
    take: 100,
    select: { id: true, questionText: true, options: true, correctAnswer: true, difficulty: true },
  });
  const usable = candidates.filter((question) => {
    const options = Array.isArray(question.options) ? question.options.map(String) : [];
    return options.length >= 2 && options.includes(question.correctAnswer);
  });
  if (usable.length === 0) {
    return NextResponse.json({ error: "Quiz demo is not available" }, { status: 503 });
  }
  const question = usable[Math.floor(Math.random() * usable.length)];
  const options = Array.isArray(question.options) ? question.options.map(String) : [];
  const token = signToken({ questionId: question.id, expiresAt: Date.now() + 10 * 60 * 1000 });
  return NextResponse.json(
    {
      question: {
        id: question.id,
        prompt: question.questionText,
        options,
        difficulty: question.difficulty,
      },
      token,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as { token?: unknown; answer?: unknown } | null;
  const tokenValue = typeof body?.token === "string" ? body.token : "";
  const answer = typeof body?.answer === "string" ? body.answer : "";
  const token = readToken(tokenValue);
  if (!token) return NextResponse.json({ error: "Quiz session expired" }, { status: 410 });

  const question = await prisma.question.findUnique({
    where: { id: token.questionId },
    select: { id: true, options: true, correctAnswer: true, explanation: true },
  });
  if (!question) return NextResponse.json({ error: "Quiz question not found" }, { status: 404 });
  if (!optionMatches(question.options, answer)) {
    return NextResponse.json({ error: "Choose one of the listed options" }, { status: 400 });
  }
  const isCorrect = answer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
  return NextResponse.json({
    isCorrect,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
    attemptId: randomUUID(),
  });
}

function optionMatches(options: unknown, answer: string) {
  return Array.isArray(options) && options.some((option) => String(option) === answer);
}
