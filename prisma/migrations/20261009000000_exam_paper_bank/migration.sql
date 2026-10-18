-- Exam Paper Bank — real past papers per board, subject, and year.
-- Phase 1: data model + board page. Timed attempts (/take) and review
-- (/review) land in later migrations.

-- Examination.slug is the canonical route key for board pages. Backfill from
-- lower(code) before constraining, so a plain `migrate dev` diff (which would
-- emit a bare NOT NULL column and fail on existing rows) is not used here.
-- NOTE: requires lower(code) to be unique across examinations.
ALTER TABLE "Examination" ADD COLUMN "slug" TEXT;
UPDATE "Examination" SET "slug" = lower("code") WHERE "slug" IS NULL;
ALTER TABLE "Examination" ALTER COLUMN "slug" SET NOT NULL;
CREATE UNIQUE INDEX "Examination_slug_key" ON "Examination"("slug");

-- One physical past paper (board + subject + year + paper number).
CREATE TABLE "ExamPaper" (
  "id" TEXT NOT NULL,
  "examinationId" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "year" INTEGER NOT NULL,
  "paperNumber" TEXT NOT NULL,
  "durationMinutes" INTEGER NOT NULL,
  "totalMarks" INTEGER NOT NULL,
  "isPublished" BOOLEAN NOT NULL DEFAULT true,
  "markingSchemeUrl" TEXT,
  "sourceUrl" TEXT,
  CONSTRAINT "ExamPaper_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ExamPaper_examinationId_subject_year_paperNumber_key" ON "ExamPaper"("examinationId", "subject", "year", "paperNumber");
CREATE INDEX "ExamPaper_examinationId_subject_idx" ON "ExamPaper"("examinationId", "subject");
CREATE INDEX "ExamPaper_year_idx" ON "ExamPaper"("year");
ALTER TABLE "ExamPaper" ADD CONSTRAINT "ExamPaper_examinationId_fkey" FOREIGN KEY ("examinationId") REFERENCES "Examination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Questions inside a paper, in paper order. topicId cross-links back to the
-- curriculum tree (SET NULL on topic delete keeps the question for re-linking).
CREATE TABLE "PaperQuestion" (
  "id" TEXT NOT NULL,
  "paperId" TEXT NOT NULL,
  "orderIndex" INTEGER NOT NULL DEFAULT 0,
  "questionText" TEXT NOT NULL,
  "options" JSONB NOT NULL,
  "correctAnswer" TEXT NOT NULL,
  "marks" INTEGER NOT NULL DEFAULT 1,
  "explanation" TEXT,
  "topicId" TEXT,
  CONSTRAINT "PaperQuestion_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "PaperQuestion_paperId_idx" ON "PaperQuestion"("paperId");
CREATE INDEX "PaperQuestion_topicId_idx" ON "PaperQuestion"("topicId");
ALTER TABLE "PaperQuestion" ADD CONSTRAINT "PaperQuestion_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "ExamPaper"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PaperQuestion" ADD CONSTRAINT "PaperQuestion_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- A learner's sitting of a paper ('timed' | 'open' mode).
CREATE TABLE "PaperAttempt" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "paperId" TEXT NOT NULL,
  "mode" TEXT NOT NULL DEFAULT 'timed',
  "score" INTEGER NOT NULL,
  "maxScore" INTEGER NOT NULL,
  "answers" JSONB NOT NULL,
  "durationSeconds" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PaperAttempt_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "PaperAttempt_userId_idx" ON "PaperAttempt"("userId");
CREATE INDEX "PaperAttempt_paperId_idx" ON "PaperAttempt"("paperId");
ALTER TABLE "PaperAttempt" ADD CONSTRAINT "PaperAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PaperAttempt" ADD CONSTRAINT "PaperAttempt_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "ExamPaper"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RLS: Gnostiri reaches Postgres only from trusted server code via Prisma
-- (see 20260926 migrations). No anon/authenticated policies; marking schemes
-- and correct answers must never be readable through the Supabase Data API.
ALTER TABLE "ExamPaper" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PaperQuestion" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PaperAttempt" ENABLE ROW LEVEL SECURITY;
