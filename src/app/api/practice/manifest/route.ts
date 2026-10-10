import { NextRequest, NextResponse } from "next/server";
import { buildRenderManifest } from "@/lib/exam-manifest";

export const dynamic = "force-dynamic";

// GET /api/practice/manifest?boardId=&subjectId=&topicId=
// The RenderManifest is the single source of truth — sections in sequence
// order, empty and non-applicable papers omitted entirely (no theory
// sections for MCQ-only boards), lastVerified + syllabusUrl always present.
export async function GET(req: NextRequest) {
  const boardId = req.nextUrl.searchParams.get("boardId");
  const subjectId = req.nextUrl.searchParams.get("subjectId");
  const topicId = req.nextUrl.searchParams.get("topicId");
  if (!boardId || !subjectId || !topicId) {
    return NextResponse.json({ error: "boardId, subjectId and topicId are required" }, { status: 400 });
  }

  const manifest = await buildRenderManifest(boardId, subjectId, topicId);
  if (!manifest) return NextResponse.json({ error: "Board or topic not found" }, { status: 404 });

  return NextResponse.json(manifest);
}
