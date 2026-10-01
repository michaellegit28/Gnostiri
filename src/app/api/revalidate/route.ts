import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

// On-demand revalidation for admin edits (Vercel instant propagation).
// Called by admin actions or: POST /api/revalidate { topic?: slug, path?: string }
// Auth: admin session OR REVALIDATE_SECRET bearer.
export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-revalidate-secret");
  let authorized = secret && process.env.REVALIDATE_SECRET && secret === process.env.REVALIDATE_SECRET;
  if (!authorized) {
    const { authorized: adminOk } = await requireAdmin();
    authorized = adminOk;
  }
  if (!authorized) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const { path, topic } = await req.json().catch(() => ({}) as { path?: string; topic?: string });
    revalidatePath("/admin/alignments");
    if (typeof path === "string" && path.startsWith("/")) revalidatePath(path);
    // Topic pages are ISR 60s; targeted path revalidation keeps it under 60s requirement.
    if (typeof topic === "string" && topic) revalidatePath(`/highschool`, "layout");
    return NextResponse.json({ revalidated: true });
  } catch (e) {
    console.error("Revalidate failed", e);
    return NextResponse.json({ error: "Revalidate failed" }, { status: 500 });
  }
}
