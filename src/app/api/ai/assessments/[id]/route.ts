import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

// Delete an AI assessment. Ownership enforced in the WHERE clause (deleteMany
// with id + userId), so a missing note or someone else's both 404.
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in to manage your assessments" }, { status: 401 });
  const { id } = await params;
  try {
    const result = await prisma.aiAssessment.deleteMany({ where: { id, userId: user.id } });
    if (result.count === 0) return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not delete the assessment" }, { status: 503 });
  }
}