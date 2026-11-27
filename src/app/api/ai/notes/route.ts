import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

// University AI lane — notes (PDF-intelligence study notes). Server-owned reads
// and writes; the student's identity comes from the session, never the client.
// Fails GRACEFULLY (503) if the AI-lane tables aren't migrated yet, so the rest
// of the site is unaffected by the rollout order.
const NOTE_FIELDS = {
  id: true,
  title: true,
  body: true,
  courseId: true,
  lessonId: true,
  createdAt: true,
} as const;

const SETUP_PENDING = "The AI lane is being set up — migrations pending.";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in to see your notes" }, { status: 401 });
  try {
    const notes = await prisma.aiNote.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 100,
      select: NOTE_FIELDS,
    });
    return NextResponse.json({ notes });
  } catch {
    return NextResponse.json({ error: SETUP_PENDING }, { status: 503 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in to save notes" }, { status: 401 });
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const p = (payload ?? {}) as Record<string, unknown>;
  const title = typeof p.title === "string" ? p.title.trim() : "";
  const body = typeof p.body === "string" ? p.body.trim() : "";
  if (!title || !body) {
    return NextResponse.json({ error: "A title and a note are required" }, { status: 400 });
  }
  try {
    const note = await prisma.aiNote.create({
      data: {
        userId: user.id,
        title,
        body,
        courseId: typeof p.courseId === "string" ? p.courseId : null,
        lessonId: typeof p.lessonId === "string" ? p.lessonId : null,
      },
      select: NOTE_FIELDS,
    });
    return NextResponse.json({ note }, { status: 201 });
  } catch {
    // Table not migrated yet (or a transient DB error) — degrade, don't crash.
    return NextResponse.json({ error: SETUP_PENDING }, { status: 503 });
  }
}