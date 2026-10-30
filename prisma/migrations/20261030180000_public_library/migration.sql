-- Public Library (2026-10-30): artifacts (never source files) may be shared and adopted.

ALTER TABLE "StudyDocument" ADD COLUMN "visibility" TEXT NOT NULL DEFAULT 'private';
ALTER TABLE "StudyDocument" ADD COLUMN "sharedAt" TIMESTAMP(3);
ALTER TABLE "StudyDocument" ADD COLUMN "reuseCount" INTEGER NOT NULL DEFAULT 0;
CREATE INDEX "StudyDocument_visibility_createdAt_idx" ON "StudyDocument"("visibility","createdAt");
