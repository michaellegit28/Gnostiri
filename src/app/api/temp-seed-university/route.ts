import { NextRequest, NextResponse } from "next/server";
import { seedUniversity } from "../../../../prisma/seed-university";

// One-shot production seeder for the Phase 0 university academic structure
// (13 faculties, medical departments, MBBS programme, pre-clinical courses,
// concept DAG). Same pattern and cadence as the content rebuild seeders:
// deploy -> trigger ONCE with REVALIDATE_SECRET -> remove in a cleanup commit.
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }
  try {
    await seedUniversity();
    return NextResponse.json({ ok: true, seeded: "faculties, departments, MBBS programme, pre-clinical courses, concept DAG" });
  } catch (error) {
    console.error("University seed failed:", error);
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Seed failed" }, { status: 500 });
  }
}
