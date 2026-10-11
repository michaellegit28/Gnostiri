import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// One-shot (re-run): finish the 6 assessment-layer FK constraints that need
// one-statement-per-call execution. Idempotent.
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
      steps.push(`${name}: ${error instanceof Error ? error.message.slice(0, 100) : "failed"}`);
    }
  }

  const fks: [string, string, string, string, string][] = [
    ["ai-course", "AssessmentItem", "courseId", "Course", "CASCADE"],
    ["ai-case", "AssessmentItem", "caseId", "ClinicalCase", "SET NULL"],
    ["ai-concept", "AssessmentItem", "conceptId", "ConceptNode", "SET NULL"],
    ["as-user", "AssessmentSession", "userId", "User", "CASCADE"],
    ["as-course", "AssessmentSession", "courseId", "Course", "CASCADE"],
    ["cl-t", "CompetencyLine", "transcriptId", "CompetencyTranscript", "CASCADE"],
  ];

  for (const [n, table, col, ref, action] of fks) {
    await step(`drop-${n}`, `ALTER TABLE "${table}" DROP CONSTRAINT IF EXISTS "${table}_${col}_fkey"`);
    await step(`add-${n}`, `ALTER TABLE "${table}" ADD CONSTRAINT "${table}_${col}_fkey" FOREIGN KEY ("${col}") REFERENCES "${ref}"("id") ON DELETE ${action} ON UPDATE CASCADE`);
  }

  return NextResponse.json({ ok: true, steps });
}
