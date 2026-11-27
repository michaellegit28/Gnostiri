import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

// Delete a University AI note. Ownership is enforced in the WHERE clause
// (deleteMany with id + userId) so a missing note and someone else's note both
// no-op to a 404 rather than leaking existence.
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in to manage your notes" }, { status: 401 });
  const { id } = await params;
  try {
    const result = await prisma.aiNote.deleteMany({ where: { id, userId: user.id } });
    if (result.count === 0) return NextResponse.json({ error: "Note not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not delete the note" }, { status: 503 });
  }
}