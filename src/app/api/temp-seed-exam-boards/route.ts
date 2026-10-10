import { NextRequest, NextResponse } from "next/server";
import { seedExamBoards } from "../../../../prisma/seed-exam-boards";

// One-shot production seeder for the exam blueprint engine (board profiles,
// cross-board question tags, validation samples). Same cadence as the other
// temp seeders: deploy -> trigger ONCE with REVALIDATE_SECRET -> remove in a
// cleanup commit.
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }
  try {
    await seedExamBoards();
    return NextResponse.json({ ok: true, seeded: "6 board profiles, cross-board question tags, blueprint validation samples" });
  } catch (error) {
    console.error("Exam board seed failed:", error);
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Seed failed" }, { status: 500 });
  }
}
