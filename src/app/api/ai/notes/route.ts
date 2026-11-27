import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

// University AI lane — notes (PDF-intelligence study notes). Server-owned reads
// and writes; the student's identity comes from the session, never the client.
const NOTE_FIELDS = {
  id: true,
  title: true,
  body: true,
  courseId: true,
  lessonId: true,
  createdAt: true,
} as const;

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in to see your notes" }, { status: 401 });
  const notes = await prisma.aiNote.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: NOTE_FIELDS,
  });
  return NextResponse.json({ notes });
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
}