import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import relabel from "../../../../content/questions/relabel-sourceExam.json";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

// TEMP SEEDER — A2-2: relabel sourceExam for the audited bank questions.
// Reads the committed data file (content/questions/relabel-sourceExam.json, 380 ids)
// and upserts sourceExam "WAEC" -> "original-exam-style" for the IDs that exist.
// Self-healing: missing IDs are skipped and logged, never created. Idempotent:
// IDs already relabelled are reported, not rewritten. One-shot; Agent 1 triggers
// with the secret, then removes per cadence.

const TO = "original-exam-style";

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const ids = relabel.ids as string[];
    const existing = await prisma.question.findMany({
      where: { id: { in: ids } },
      select: { id: true, sourceExam: true },
    });
    const foundIds = new Set(existing.map((q) => q.id));
    const missing = ids.filter((id) => !foundIds.has(id));
    const toUpdate = existing.filter((q) => q.sourceExam === "WAEC").map((q) => q.id);
    const alreadyCorrect = existing.filter((q) => q.sourceExam === TO).map((q) => q.id);
    const otherValue = existing.filter((q) => q.sourceExam !== "WAEC" && q.sourceExam !== TO).map((q) => ({ id: q.id, sourceExam: q.sourceExam }));
    let updated = 0;
    if (toUpdate.length > 0) {
      const res = await prisma.question.updateMany({
        where: { id: { in: toUpdate } },
        data: { sourceExam: TO },
      });
      updated = res.count;
    }
    return NextResponse.json({
      ok: true,
      task: "relabel-sourceExam",
      totalInFile: ids.length,
      found: existing.length,
      updated,
      alreadyCorrect: alreadyCorrect.length,
      otherValue,
      missing,
      missingCount: missing.length,
    });
  } catch (e) {
    console.error("relabel sourceExam failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
