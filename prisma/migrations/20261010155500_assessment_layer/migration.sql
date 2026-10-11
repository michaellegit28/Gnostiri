-- CreateTable
CREATE TABLE "AssessmentItem" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "caseId" TEXT,
    "conceptId" TEXT,
    "format" TEXT NOT NULL DEFAULT 'sba',
    "stem" TEXT NOT NULL,
    "options" JSONB NOT NULL,
    "correctAnswer" TEXT,
    "explanation" TEXT,
    "marks" INTEGER NOT NULL DEFAULT 1,
    "negativeMarks" DOUBLE PRECISION,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "difficulty" TEXT NOT NULL DEFAULT 'medium',

    CONSTRAINT "AssessmentItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "mode" TEXT NOT NULL DEFAULT 'timed',
    "durationMinutes" INTEGER NOT NULL DEFAULT 60,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "answers" JSONB NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "maxScore" DOUBLE PRECISION NOT NULL,
    "negativeApplied" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssessmentSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetencyLine" (
    "id" TEXT NOT NULL,
    "transcriptId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "level" TEXT NOT NULL DEFAULT 'developing',
    "evidence" TEXT,
    "awardedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompetencyLine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AssessmentItem_courseId_idx" ON "AssessmentItem"("courseId");
CREATE INDEX "AssessmentItem_caseId_idx" ON "AssessmentItem"("caseId");
CREATE INDEX "AssessmentItem_conceptId_idx" ON "AssessmentItem"("conceptId");
CREATE INDEX "AssessmentSession_userId_idx" ON "AssessmentSession"("userId");
CREATE INDEX "AssessmentSession_courseId_idx" ON "AssessmentSession"("courseId");
CREATE INDEX "CompetencyLine_transcriptId_idx" ON "CompetencyLine"("transcriptId");

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentItem_slug_key" ON "AssessmentItem"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CompetencyTranscript_userId_programmeId_key" ON "CompetencyTranscript"("userId", "programmeId");

-- AddForeignKey
ALTER TABLE "AssessmentItem" ADD CONSTRAINT "AssessmentItem_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AssessmentItem" ADD CONSTRAINT "AssessmentItem_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "ClinicalCase"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AssessmentItem" ADD CONSTRAINT "AssessmentItem_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "ConceptNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AssessmentSession" ADD CONSTRAINT "AssessmentSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AssessmentSession" ADD CONSTRAINT "AssessmentSession_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CompetencyLine" ADD CONSTRAINT "CompetencyLine_transcriptId_fkey" FOREIGN KEY ("transcriptId") REFERENCES "CompetencyTranscript"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RLS: Gnostiri reaches Postgres only from trusted server code via Prisma
-- (see 20260926 migrations). No anon/authenticated policies; exam items,
-- correct answers and marking keys must never be readable through the
-- Supabase Data API.
ALTER TABLE "AssessmentItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AssessmentSession" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CompetencyLine" ENABLE ROW LEVEL SECURITY;