import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";

/**
 * /api/study-tasks — the scheduled Desk plan.
 *
 * GET  ?scope=today → tasks scheduled for today (UTC day); otherwise the
 *      upcoming pending plan (today onward), oldest first.
 * PUT  {id, status}  → complete or skip one of the user's own tasks.
 */

function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function endOfUtcDay(date: Date): Date {
  return new Date(startOfUtcDay(date).getTime() + 86_400_000);
}

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const todayOnly = req.nextUrl.searchParams.get("scope") === "today";
  const from = startOfUtcDay(new Date());
  const where = todayOnly
    ? { userId: user.id, scheduledFor: { gte: from, lt: endOfUtcDay(new Date()) } }
    : { userId: user.id, scheduledFor: { gte: from }, status: "pending" as const };

  const tasks = await prisma.studyTask.findMany({
    where,
    orderBy: { scheduledFor: "asc" },
    take: 100,
    include: { document: { select: { id: true, title: true } } },
  });

  return NextResponse.json({
    scope: todayOnly ? "today" : "upcoming",
    tasks: tasks.map((task) => ({
      id: task.id,
      kind: task.kind,
      title: task.title,
      minutes: task.minutes,
      scheduledFor: task.scheduledFor,
      status: task.status,
      documentId: task.documentId,
      documentTitle: task.document?.title ?? null,
    })),
  });
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  let body: { id?: unknown; status?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id : "";
  const status = body.status === "done" || body.status === "skipped" ? body.status : null;
  if (!id || !status) return NextResponse.json({ error: "id and status (done|skipped) required" }, { status: 400 });

  // Scoped by userId: a task the caller does not own is a 404, not a 403 —
  // existence stays private.
  const result = await prisma.studyTask.updateMany({ where: { id, userId: user.id }, data: { status } });
  if (result.count === 0) return NextResponse.json({ error: "Task not found" }, { status: 404 });

  const task = await prisma.studyTask.findFirst({ where: { id, userId: user.id }, include: { document: { select: { id: true, title: true } } } });
  return NextResponse.json({
    task: task
      ? {
          id: task.id,
          kind: task.kind,
          title: task.title,
          minutes: task.minutes,
          scheduledFor: task.scheduledFor,
          status: task.status,
          documentId: task.documentId,
          documentTitle: task.document?.title ?? null,
        }
      : null,
  });
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
