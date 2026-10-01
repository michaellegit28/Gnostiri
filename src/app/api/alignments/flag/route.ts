import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

// Public educator flag: POST { alignmentId, reason } — any signed-in user; audit-logged.
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const { alignmentId, reason } = await req.json();
  if (typeof alignmentId !== "string" || !alignmentId) return NextResponse.json({ error: "alignmentId required" }, { status: 400 });
  const alignment = await prisma.topicBoardAlignment.findUnique({ where: { id: alignmentId } });
  if (!alignment) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.alignmentAudit.create({
    data: { alignmentId, actorEmail: user.email, action: "flagged", newValue: { reason: String(reason || "Flagged for review").slice(0, 500) } as object },
  });
  return NextResponse.json({ ok: true });
}
