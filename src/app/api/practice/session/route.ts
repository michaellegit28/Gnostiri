import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { buildRenderManifest } from "@/lib/exam-manifest";

export const dynamic = "force-dynamic";

// POST /api/practice/session — open a practice session for the section
// bridge lock. Drafts and submits are validated against this session;
// the client is never trusted with lock state.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const boardId = String(body?.boardId || "");
  const subjectId = String(body?.subjectId || "");
  const topicId = String(body?.topicId || "");
  if (!boardId || !subjectId || !topicId) {
    return NextResponse.json({ error: "boardId, subjectId and topicId are required" }, { status: 400 });
  }
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const examination = await prisma.examination.findFirst({
    where: { domain: "highschool", slug: { equals: boardId.toLowerCase(), mode: "insensitive" } },
  });
  if (!examination) return NextResponse.json({ error: "Board not found" }, { status: 404 });

  const manifest = await buildRenderManifest(boardId, subjectId, topicId);
  if (!manifest) return NextResponse.json({ error: "Topic not found for this board" }, { status: 404 });

  const session = await prisma.practiceSession.create({
    data: {
      userId: user.id,
      examinationId: examination.id,
      topicId: manifest.topicId,
      subjectSlug: manifest.subject,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  return NextResponse.json({ sessionId: session.id });
}
