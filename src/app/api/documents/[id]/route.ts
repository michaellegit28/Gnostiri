import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";

/**
 * /api/documents/[id] — one processed document.
 *
 * GET returns notes, the caller's own quiz items, and their tasks. Integrity
 * (the league rule): correctAnswer and explanation are NEVER sent before
 * submit — the quiz is scored by POST /api/documents/[id]/quiz against the
 * stored answers.
 *
 * Access: the document owner, plus any user who adopted it through hash
 * dedupe (they hold copied quiz items for it). Anyone else gets a 404 — the
 * document's existence is not leaked.
 */

interface RouteContext {
  params: { id: string };
}

async function loadForUser(id: string, userId: string) {
  const document = await prisma.studyDocument.findUnique({ where: { id } });
  if (!document) return null;
  const owned = document.userId === userId;
  if (!owned) {
    const adopted = await prisma.documentQuizItem.findFirst({ where: { documentId: id, userId }, select: { id: true } });
    if (!adopted) return null;
  }
  const quizItems = await prisma.documentQuizItem.findMany({
    where: { documentId: id, userId },
    orderBy: { createdAt: "asc" },
  });
  const tasks = await prisma.studyTask.findMany({
    where: { documentId: id, userId },
    orderBy: { scheduledFor: "asc" },
  });
  return { document, quizItems, tasks, owned };
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const loaded = await loadForUser(params.id, user.id);
  if (!loaded) return NextResponse.json({ error: "Document not found" }, { status: 404 });
  const { document, quizItems, tasks, owned } = loaded;

  return NextResponse.json({
    document: {
      id: document.id,
      title: document.title,
      status: document.status,
      pageCount: document.pageCount,
      errorNote: document.errorNote,
      subjectSlug: document.subjectSlug,
      createdAt: document.createdAt,
      notes: document.notes,
      owned,
    },
    // No correctAnswer / explanation before submit.
    quizItems: quizItems.map((item) => ({
      id: item.id,
      stem: item.stem,
      options: item.options,
      difficulty: item.difficulty,
    })),
    tasks: tasks.map((task) => ({
      id: task.id,
      kind: task.kind,
      title: task.title,
      minutes: task.minutes,
      scheduledFor: task.scheduledFor,
      status: task.status,
    })),
  });
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const document = await prisma.studyDocument.findUnique({ where: { id: params.id }, select: { id: true, userId: true } });
  if (!document || document.userId !== user.id) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  // Quiz items cascade with the document (foundation schema); tasks would
  // survive orphaned (onDelete: SetNull), so the plan is removed explicitly.
  await prisma.studyTask.deleteMany({ where: { documentId: document.id } });
  await prisma.studyDocument.delete({ where: { id: document.id } });
  return NextResponse.json({ deleted: document.id });
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
