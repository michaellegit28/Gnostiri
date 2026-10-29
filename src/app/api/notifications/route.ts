import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

// Notification centre API. Every row is scoped to the session user —
// updateMany/findMany always carry userId in the where clause, so one user
// can never read or mark another user's notifications even with a known id.

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const limitParam = Number(req.nextUrl.searchParams.get("limit"));
  const limit = Number.isFinite(limitParam) ? Math.min(Math.max(Math.trunc(limitParam), 1), 100) : 20;
  const unreadOnly = req.nextUrl.searchParams.get("unread") === "true";

  const where = { userId: user.id, ...(unreadOnly ? { read: false } : {}) };

  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
    }),
    prisma.notification.count({ where: { userId: user.id, read: false } }),
  ]);

  return NextResponse.json({ notifications, unreadCount });
}

// Mark read: { id } marks one row, { all: true } marks every unread row.
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (body.all === true) {
    const { count } = await prisma.notification.updateMany({
      where: { userId: user.id, read: false },
      data: { read: true },
    });
    return NextResponse.json({ ok: true, markedRead: count });
  }

  const id = typeof body.id === "string" ? body.id.trim() : "";
  if (!id) return NextResponse.json({ error: "Provide { id } or { all: true }" }, { status: 400 });

  const { count } = await prisma.notification.updateMany({
    where: { id, userId: user.id },
    data: { read: true },
  });
  if (count === 0) return NextResponse.json({ error: "Notification not found" }, { status: 404 });

  return NextResponse.json({ ok: true, markedRead: count });
}
