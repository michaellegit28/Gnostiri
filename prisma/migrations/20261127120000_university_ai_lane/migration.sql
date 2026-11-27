-- Overhaul v1 PR-B — University AI lane. ADDITIVE ONLY: new tables, no ALTER/DROP
-- of any existing table. courseId/lessonId are plain columns (no FK to existing
-- tables) so this cannot break current data. Apply via Supabase SQL editor (rule 7).

CREATE TABLE IF NOT EXISTS "AiNote" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "courseId" TEXT,
  "lessonId" TEXT,
  "title" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "source" JSONB,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "AiNote_userId_courseId_idx" ON "AiNote"("userId", "courseId");
CREATE INDEX IF NOT EXISTS "AiNote_userId_createdAt_idx" ON "AiNote"("userId", "createdAt");

CREATE TABLE IF NOT EXISTS "AiTranscriptionSession" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "courseId" TEXT,
  "sourceType" TEXT NOT NULL,
  "sourceRef" TEXT,
  "transcript" TEXT NOT NULL,
  "notes" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "AiTranscriptionSession_userId_courseId_idx" ON "AiTranscriptionSession"("userId", "courseId");
CREATE INDEX IF NOT EXISTS "AiTranscriptionSession_userId_createdAt_idx" ON "AiTranscriptionSession"("userId", "createdAt");

CREATE TABLE IF NOT EXISTS "AiAssessment" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "courseId" TEXT,
  "title" TEXT NOT NULL,
  "config" JSONB NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "AiAssessment_userId_courseId_idx" ON "AiAssessment"("userId", "courseId");

CREATE TABLE IF NOT EXISTS "AiAssessmentAttempt" (
  "id" TEXT PRIMARY KEY,
  "assessmentId" TEXT NOT NULL REFERENCES "AiAssessment"("id") ON DELETE CASCADE,
  "responses" JSONB NOT NULL,
  "score" DOUBLE PRECISION,
  "feedback" JSONB,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "AiAssessmentAttempt_assessmentId_idx" ON "AiAssessmentAttempt"("assessmentId");
CREATE INDEX IF NOT EXISTS "AiAssessmentAttempt_assessmentId_createdAt_idx" ON "AiAssessmentAttempt"("assessmentId", "createdAt");

CREATE TABLE IF NOT EXISTS "AiCorrection" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "courseId" TEXT,
  "artifactRef" TEXT NOT NULL,
  "result" JSONB NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "AiCorrection_userId_courseId_idx" ON "AiCorrection"("userId", "courseId");
CREATE INDEX IF NOT EXISTS "AiCorrection_userId_createdAt_idx" ON "AiCorrection"("userId", "createdAt");