import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

// POST /api/practice/section/start — the bridge lock. Once a later section
// starts, every earlier section is locked server-side: drafts to it return
// 409 and submit ignores it. Forward-only, one step at a time.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const sessionId = String(body?.sessionId || "");
  const sequence = Number(body?.sequence);
  if (!sessionId || !Number.isInteger(sequence) || sequence < 1) {
    return NextResponse.json({ error: "sessionId and a positive sequence are required" }, { status: 400 });
  }

  const session = await prisma.practiceSession.findUnique({ where: { id: sessionId } });
  if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });
  if (session.status !== "active") return NextResponse.json({ error: "Session already submitted" }, { status: 409 });
  if (session.expiresAt && session.expiresAt < new Date()) {
    return NextResponse.json({ error: "Session expired" }, { status: 410 });
  }

  if (sequence !== session.currentSectionIndex + 1) {
    return NextResponse.json(
      {
        error: "Sections advance one at a time, in order",
        currentSectionIndex: session.currentSectionIndex,
      },
      { status: 409 }
    );
  }

  const updated = await prisma.practiceSession.update({
    where: { id: sessionId },
    data: { currentSectionIndex: sequence },
  });

  return NextResponse.json({ currentSectionIndex: updated.currentSectionIndex });
}
