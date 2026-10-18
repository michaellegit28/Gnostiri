-- Exam Blueprint Engine — Layer 2 board profiles, question board tags,
-- and server-enforced practice sessions with the section bridge lock.
-- SyllabusUrl already existed on Examination; lastVerified + notes are added here.

-- AlterTable
ALTER TABLE "Examination" ADD COLUMN     "lastVerified" TIMESTAMP(3),
ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "hint" TEXT,
ADD COLUMN     "markingPoints" JSONB;

-- CreateTable
CREATE TABLE "ExaminationPaper" (
    "id" TEXT NOT NULL,
    "examinationId" TEXT NOT NULL,
    "paperId" TEXT NOT NULL,
    "paperName" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "delivery" TEXT NOT NULL,
    "questionTypes" JSONB NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "marks" INTEGER NOT NULL,
    "applicability" JSONB NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "instructions" TEXT,

    CONSTRAINT "ExaminationPaper_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExaminationPaper_examinationId_paperId_key" ON "ExaminationPaper"("examinationId", "paperId");

-- CreateIndex
CREATE INDEX "ExaminationPaper_examinationId_sequence_idx" ON "ExaminationPaper"("examinationId", "sequence");

-- AddForeignKey
ALTER TABLE "ExaminationPaper" ADD CONSTRAINT "ExaminationPaper_examinationId_fkey" FOREIGN KEY ("examinationId") REFERENCES "Examination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "QuestionBoardTag" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "examinationId" TEXT NOT NULL,
    "tier" TEXT NOT NULL DEFAULT 'CORE',
    "paperIds" JSONB NOT NULL,

    CONSTRAINT "QuestionBoardTag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuestionBoardTag_questionId_examinationId_key" ON "QuestionBoardTag"("questionId", "examinationId");

-- CreateIndex
CREATE INDEX "QuestionBoardTag_examinationId_tier_idx" ON "QuestionBoardTag"("examinationId", "tier");

-- CreateIndex
CREATE INDEX "QuestionBoardTag_questionId_idx" ON "QuestionBoardTag"("questionId");

-- AddForeignKey
ALTER TABLE "QuestionBoardTag" ADD CONSTRAINT "QuestionBoardTag_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionBoardTag" ADD CONSTRAINT "QuestionBoardTag_examinationId_fkey" FOREIGN KEY ("examinationId") REFERENCES "Examination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "PracticeSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "examinationId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "subjectSlug" TEXT NOT NULL,
    "currentSectionIndex" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "answers" JSONB NOT NULL DEFAULT '{}',
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PracticeSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PracticeSession_userId_idx" ON "PracticeSession"("userId");

-- CreateIndex
CREATE INDEX "PracticeSession_examinationId_topicId_idx" ON "PracticeSession"("examinationId", "topicId");

-- AddForeignKey
ALTER TABLE "PracticeSession" ADD CONSTRAINT "PracticeSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticeSession" ADD CONSTRAINT "PracticeSession_examinationId_fkey" FOREIGN KEY ("examinationId") REFERENCES "Examination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticeSession" ADD CONSTRAINT "PracticeSession_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RLS: Gnostiri reaches Postgres only from trusted server code via Prisma
-- (see 20260926 migrations). No anon/authenticated policies — practice
-- sessions and board tags must never be readable through the Data API.
ALTER TABLE "ExaminationPaper" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "QuestionBoardTag" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PracticeSession" ENABLE ROW LEVEL SECURITY;
