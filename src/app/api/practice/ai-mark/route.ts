import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";

// Stage 2 theory marking: AI grades the learner's SERVER-STORED draft answer
// against the official marking points — point-by-point, rubric-clamped, with
// a short feedback note. Signed-in only, rate-limited via Upstash.
// Hard daily cap applies to everyone while open-preview mode is on
// (premium-unlimited activates when accounts are re-wired in src/lib/access.ts).

const AI_MARK_DAILY_LIMIT = 10;

// Reasoning models (e.g. Atria-Dawn-Preview) take 20-40s on real marking
// prompts — the default 10s function limit is not enough.
export const maxDuration = 60;

interface DraftedAnswer {
  questionId: string;
  selectedAnswer: string | null;
}

async function aiMarkCount(userId: string): Promise<number> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return 0;
  const date = new Date().toISOString().slice(0, 10);
  const key = `ai-mark:${userId}:${date}`;
  const response = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!response.ok) return 0;
  const result = await response.json();
  return Number(result.result || 0);
}

async function incrementAiMarkCount(userId: string): Promise<number> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error("AI marking limiter is not configured");
  const date = new Date().toISOString().slice(0, 10);
  const key = `ai-mark:${userId}:${date}`;
  const response = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify([["INCR", key], ["EXPIRE", key, 90000]]),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("AI marking limiter unavailable");
  const result = await response.json();
  return Number(result?.[0]?.result || 0);
}

interface AiMarkPoint {
  index: number;
  point: string;
  maxMarks: number;
  awarded: number;
  reason: string;
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Sign in to use AI marking" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const sessionId = String(body?.sessionId || "");
    const sectionId = String(body?.sectionId || "");
    const questionId = String(body?.questionId || "");
    if (!sessionId || !sectionId || !questionId) {
      return NextResponse.json({ error: "sessionId, sectionId and questionId are required" }, { status: 400 });
    }

    const session = await prisma.practiceSession.findUnique({ where: { id: sessionId } });
    if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });
    if (session.userId && session.userId !== user.id) {
      return NextResponse.json({ error: "This session belongs to another learner" }, { status: 403 });
    }

    // The answer graded is the one stored server-side — never client-supplied.
    const answers = (session.answers as unknown as Record<string, DraftedAnswer[]>) ?? {};
    const drafted = (answers[sectionId] ?? []).find((a) => a.questionId === questionId);
    const learnerAnswer = drafted?.selectedAnswer?.trim() ?? "";
    if (!learnerAnswer) {
      return NextResponse.json({ error: "No typed answer to mark for this question" }, { status: 400 });
    }

    const question = await prisma.question.findUnique({ where: { id: questionId } });
    if (!question || !Array.isArray(question.markingPoints) || question.markingPoints.length === 0) {
      return NextResponse.json({ error: "This question has no marking scheme to mark against" }, { status: 400 });
    }
    const markingPoints = question.markingPoints as { point: string; marks: number }[];

    const count = await aiMarkCount(user.id);
    if (count >= AI_MARK_DAILY_LIMIT) {
      return NextResponse.json(
        { error: `Daily AI marking limit reached (${AI_MARK_DAILY_LIMIT}/day)`, remaining: 0 },
        { status: 429 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "AI marking is not configured" }, { status: 503 });

    const client = new OpenAI({ apiKey, baseURL: process.env.OPENAI_BASE_URL || undefined });
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_TUTOR_MODEL || "gpt-4o-mini",
      response_format: { type: "json_object" },
      temperature: 0,
      messages: [
        {
          role: "system",
          content:
            "You are a strict but fair exam invigilator marking a theory answer against an official marking scheme. " +
            "For each marking point, award its marks only if the learner's answer genuinely covers it (full or clear partial credit as integers). " +
            "Never exceed a point's maximum marks. Respond ONLY as JSON: " +
            '{"points":[{"index":0,"awarded":2,"reason":"short justification"}],"totalAwarded":6,"feedback":"one or two sentences of exam-focused feedback"}',
        },
        {
          role: "user",
          content: JSON.stringify({
            question: question.questionText,
            markingScheme: markingPoints.map((mp, index) => ({ index, point: mp.point, marks: mp.marks })),
            modelAnswer: question.correctAnswer,
            learnerAnswer,
          }),
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content || "";
    // Robust extraction: some models wrap JSON in markdown fences or prose.
    const stripped = raw.replace(/```(?:json)?/gi, "").trim();
    const start = stripped.indexOf("{");
    const end = stripped.lastIndexOf("}");
    const parsed = JSON.parse(start >= 0 && end > start ? stripped.slice(start, end + 1) : stripped) as {
      points?: { index?: number; awarded?: number; reason?: string }[];
      totalAwarded?: number;
      feedback?: string;
    };

    // Clamp to the rubric — the scheme is the authority, not the model.
    const points: AiMarkPoint[] = markingPoints.map((mp, index) => {
      const match = parsed.points?.find((p) => Number(p.index) === index) ?? {};
      const max = Number(mp.marks) || 0;
      const awarded = Math.max(0, Math.min(max, Math.floor(Number(match.awarded) || 0)));
      return {
        index,
        point: mp.point,
        maxMarks: max,
        awarded,
        reason: String(match.reason ?? "").slice(0, 300),
      };
    });
    const totalAwarded = points.reduce((sum, p) => sum + p.awarded, 0);
    const maxTotal = points.reduce((sum, p) => sum + p.maxMarks, 0);

    const used = await incrementAiMarkCount(user.id);

    return NextResponse.json({
      aiMark: {
        points,
        totalAwarded,
        maxTotal,
        feedback: String(parsed.feedback ?? "").slice(0, 600),
      },
      remaining: Math.max(0, AI_MARK_DAILY_LIMIT - used),
    });
  } catch (error) {
    console.error("AI marking failed:", error);
    return NextResponse.json(
      {
        error: "AI marking failed — please try again",
        detail: error instanceof Error ? error.message.slice(0, 400) : String(error).slice(0, 400),
      },
      { status: 500 }
    );
  }
}
