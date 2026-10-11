import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// One-shot: apply the two A3 university migrations to production before the
// feature deploy goes live. Idempotent (IF NOT EXISTS / IF NOT COLUMN guards).
// Cadence: deploy -> trigger ONCE with REVALIDATE_SECRET -> verify -> remove.
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }
  const steps: string[] = [];
  async function step(name: string, sql: string) {
    try {
      await prisma.$executeRawUnsafe(sql);
      steps.push(`${name}: ok`);
    } catch (error) {
      steps.push(`${name}: ${error instanceof Error ? error.message.slice(0, 120) : "failed"}`);
    }
  }

  // Migration 1: mastery SM-2 columns on ConceptMastery
  try {
    await prisma.$queryRawUnsafe(`SELECT "easeFactor" FROM "ConceptMastery" LIMIT 1`);
    steps.push("sm2-columns: already present");
  } catch {
    await step("sm2-columns", `ALTER TABLE "ConceptMastery" ADD COLUMN "easeFactor" DOUBLE PRECISION NOT NULL DEFAULT 2.5, ADD COLUMN "intervalDays" INTEGER NOT NULL DEFAULT 0`);
  }

  // Migration 2: assessment layer (3 tables + indexes + FKs + RLS)
  await step("assessment-items", `
    CREATE TABLE IF NOT EXISTS "AssessmentItem" (
        "id" TEXT NOT NULL, "slug" TEXT NOT NULL, "courseId" TEXT NOT NULL, "caseId" TEXT, "conceptId" TEXT,
        "format" TEXT NOT NULL DEFAULT 'sba', "stem" TEXT NOT NULL, "options" JSONB NOT NULL,
        "correctAnswer" TEXT, "explanation" TEXT, "marks" INTEGER NOT NULL DEFAULT 1,
        "negativeMarks" DOUBLE PRECISION, "orderIndex" INTEGER NOT NULL DEFAULT 0,
        "isPublished" BOOLEAN NOT NULL DEFAULT true, "difficulty" TEXT NOT NULL DEFAULT 'medium',
        CONSTRAINT "AssessmentItem_pkey" PRIMARY KEY ("id"))`);
  await step("assessment-sessions", `
    CREATE TABLE IF NOT EXISTS "AssessmentSession" (
        "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "courseId" TEXT NOT NULL, "title" TEXT NOT NULL,
        "mode" TEXT NOT NULL DEFAULT 'timed', "durationMinutes" INTEGER NOT NULL DEFAULT 60,
        "startTime" TIMESTAMP(3), "endTime" TIMESTAMP(3), "answers" JSONB NOT NULL,
        "score" DOUBLE PRECISION NOT NULL, "maxScore" DOUBLE PRECISION NOT NULL,
        "negativeApplied" DOUBLE PRECISION NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "AssessmentSession_pkey" PRIMARY KEY ("id"))`);
  await step("competency-lines", `
    CREATE TABLE IF NOT EXISTS "CompetencyLine" (
        "id" TEXT NOT NULL, "transcriptId" TEXT NOT NULL, "code" TEXT NOT NULL, "title" TEXT NOT NULL,
        "level" TEXT NOT NULL DEFAULT 'developing', "evidence" TEXT,
        "awardedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "CompetencyLine_pkey" PRIMARY KEY ("id"))`);

  for (const [n, s] of [
    ["idx-ai-course", `CREATE INDEX IF NOT EXISTS "AssessmentItem_courseId_idx" ON "AssessmentItem"("courseId")`],
    ["idx-ai-case", `CREATE INDEX IF NOT EXISTS "AssessmentItem_caseId_idx" ON "AssessmentItem"("caseId")`],
    ["idx-ai-concept", `CREATE INDEX IF NOT EXISTS "AssessmentItem_conceptId_idx" ON "AssessmentItem"("conceptId")`],
    ["idx-as-user", `CREATE INDEX IF NOT EXISTS "AssessmentSession_userId_idx" ON "AssessmentSession"("userId")`],
    ["idx-as-course", `CREATE INDEX IF NOT EXISTS "AssessmentSession_courseId_idx" ON "AssessmentSession"("courseId")`],
    ["idx-cl-transcript", `CREATE INDEX IF NOT EXISTS "CompetencyLine_transcriptId_idx" ON "CompetencyLine"("transcriptId")`],
    ["idx-ai-slug", `CREATE UNIQUE INDEX IF NOT EXISTS "AssessmentItem_slug_key" ON "AssessmentItem"("slug")`],
    ["idx-ct-up", `CREATE UNIQUE INDEX IF NOT EXISTS "CompetencyTranscript_userId_programmeId_key" ON "CompetencyTranscript"("userId", "programmeId")`],
    ["fk-ai-course", `ALTER TABLE "AssessmentItem" DROP CONSTRAINT IF EXISTS "AssessmentItem_courseId_fkey"; ALTER TABLE "AssessmentItem" ADD CONSTRAINT "AssessmentItem_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE`],
    ["fk-ai-case", `ALTER TABLE "AssessmentItem" DROP CONSTRAINT IF EXISTS "AssessmentItem_caseId_fkey"; ALTER TABLE "AssessmentItem" ADD CONSTRAINT "AssessmentItem_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "ClinicalCase"("id") ON DELETE SET NULL ON UPDATE CASCADE`],
    ["fk-ai-concept", `ALTER TABLE "AssessmentItem" DROP CONSTRAINT IF EXISTS "AssessmentItem_conceptId_fkey"; ALTER TABLE "AssessmentItem" ADD CONSTRAINT "AssessmentItem_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "ConceptNode"("id") ON DELETE SET NULL ON UPDATE CASCADE`],
    ["fk-as-user", `ALTER TABLE "AssessmentSession" DROP CONSTRAINT IF EXISTS "AssessmentSession_userId_fkey"; ALTER TABLE "AssessmentSession" ADD CONSTRAINT "AssessmentSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`],
    ["fk-as-course", `ALTER TABLE "AssessmentSession" DROP CONSTRAINT IF EXISTS "AssessmentSession_courseId_fkey"; ALTER TABLE "AssessmentSession" ADD CONSTRAINT "AssessmentSession_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE`],
    ["fk-cl-t", `ALTER TABLE "CompetencyLine" DROP CONSTRAINT IF EXISTS "CompetencyLine_transcriptId_fkey"; ALTER TABLE "CompetencyLine" ADD CONSTRAINT "CompetencyLine_transcriptId_fkey" FOREIGN KEY ("transcriptId") REFERENCES "CompetencyTranscript"("id") ON DELETE CASCADE ON UPDATE CASCADE`],
    ["rls-ai", `ALTER TABLE "AssessmentItem" ENABLE ROW LEVEL SECURITY`],
    ["rls-as", `ALTER TABLE "AssessmentSession" ENABLE ROW LEVEL SECURITY`],
    ["rls-cl", `ALTER TABLE "CompetencyLine" ENABLE ROW LEVEL SECURITY`],
  ] as [string, string][]) {
    await step(n, s);
  }

  return NextResponse.json({ ok: true, steps });
}
