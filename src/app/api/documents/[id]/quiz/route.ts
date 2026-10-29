import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";

/**
 * /api/documents/[id]/quiz — score a submitted attempt, server-side.
 *
 * The same integrity rule as the Merit League: correct answers are never sent
 * to the client before submit. GET /api/documents/[id] ships items without
 * them; this route compares the submitted selection against the STORED
 * correctAnswer (trimmed, case-insensitive — the house comparison from
 * src/lib/assessment.ts:156) and returns per-item correctness plus the
 * explanation.
 */

interface RouteContext {
  params: { id: string };
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const document = await prisma.studyDocument.findUnique({ where: { id: params.id }, select: { id: true, userId: true, title: true } });
  if (!document) return NextResponse.json({ error: "Document not found" }, { status: 404 });

  // Owner or dedupe adopter.
  const access =
    document.userId === user.id
      ? true
      : (await prisma.documentQuizItem.findFirst({ where: { documentId: document.id, userId: user.id }, select: { id: true } })) !== null;
  if (!access) return NextResponse.json({ error: "Document not found" }, { status: 404 });

  let body: { answers?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!Array.isArray(body.answers)) return NextResponse.json({ error: "answers array required" }, { status: 400 });

  const items = await prisma.documentQuizItem.findMany({ where: { documentId: document.id, userId: user.id } });
  const byId = new Map(items.map((item) => [item.id, item]));

  type Answer = { itemId?: unknown; selected?: unknown };
  const submissions = (body.answers as Answer[])
    .map((a) => ({ itemId: typeof a?.itemId === "string" ? a.itemId : "", selected: typeof a?.selected === "string" ? a.selected : "" }))
    .filter((a) => a.itemId && byId.has(a.itemId));

  const seen = new Set<string>();
  let correct = 0;
  const results = submissions
    .filter((a) => {
      // One score per item — a repeated item cannot farm extra corrects.
      if (seen.has(a.itemId)) return false;
      seen.add(a.itemId);
      return true;
    })
    .map((a) => {
      const item = byId.get(a.itemId)!;
      const isCorrect = a.selected.trim().toLowerCase() === item.correctAnswer.trim().toLowerCase();
      if (isCorrect) correct += 1;
      return {
        itemId: item.id,
        stem: item.stem,
        selected: a.selected,
        correctAnswer: item.correctAnswer,
        correct: isCorrect,
        explanation: item.explanation,
      };
    });

  return NextResponse.json({
    documentId: document.id,
    title: document.title,
    submitted: results.length,
    total: items.length,
    correct,
    results,
  });
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
