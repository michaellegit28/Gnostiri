-- Curriculum Alignment Engine — Phase 2
-- Reuses existing "Topic" table per approved Adaptation A.
-- Deviations from spec documented in schema: Topic.slug nullable-unique (backfilled from id),
-- Topic.lastAuditedDate nullable to support needs_verification=TRUE hybrid seed,
-- verifiedBy TEXT (User.id is cuid String, not INT).

-- Create enum for tier with CHECK-equivalent
CREATE TYPE "AlignmentTier" AS ENUM ('core', 'elective', 'excluded');

-- Regions
CREATE TABLE "Region" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "isoCode" TEXT NOT NULL,
  "rtlLanguage" BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Region_isoCode_key" ON "Region"("isoCode");

-- Departments (master subjects)
CREATE TABLE "Department" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "iconSlug" TEXT,
  CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Department_name_key" ON "Department"("name");

-- Curriculum boards
CREATE TABLE "CurriculumBoard" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "regionId" TEXT NOT NULL,
  "officialSyllabusUrl" TEXT,
  "syllabusVersionYear" INTEGER,
  "lastAuditedDate" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CurriculumBoard_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "CurriculumBoard_regionId_idx" ON "CurriculumBoard"("regionId");
ALTER TABLE "CurriculumBoard" ADD CONSTRAINT "CurriculumBoard_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Study tracks (board-specific streams, nullable usage = applies to all tracks)
CREATE TABLE "StudyTrack" (
  "id" TEXT NOT NULL,
  "boardId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  CONSTRAINT "StudyTrack_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "StudyTrack_boardId_idx" ON "StudyTrack"("boardId");
ALTER TABLE "StudyTrack" ADD CONSTRAINT "StudyTrack_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "CurriculumBoard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Extend existing Topic table (do NOT recreate)
ALTER TABLE "Topic" ADD COLUMN "departmentId" TEXT;
ALTER TABLE "Topic" ADD COLUMN "slug" TEXT;
ALTER TABLE "Topic" ADD COLUMN "lastAuditedDate" TIMESTAMP(3);
ALTER TABLE "Topic" ADD COLUMN "needsVerification" BOOLEAN NOT NULL DEFAULT true;

-- Backfill for NOT NULL safety on existing rows (per Q1 approval):
-- existing content rows get today's date + slug fallback so UNIQUE holds
UPDATE "Topic" SET "lastAuditedDate" = CURRENT_TIMESTAMP WHERE "lastAuditedDate" IS NULL AND "id" NOT LIKE 'master-%';
UPDATE "Topic" SET "slug" = "id" WHERE "slug" IS NULL;
-- New master-* topics inserted by seed keep lastAuditedDate NULL + needsVerification TRUE (pending verification)

CREATE UNIQUE INDEX "Topic_slug_key" ON "Topic"("slug");
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Alignment intelligence layer
CREATE TABLE "TopicBoardAlignment" (
  "id" TEXT NOT NULL,
  "topicId" TEXT NOT NULL,
  "boardId" TEXT NOT NULL,
  "trackId" TEXT,
  "tier" "AlignmentTier" NOT NULL,
  "languageOfInstruction" TEXT,
  "weightNotes" TEXT,
  "verifiedDate" TIMESTAMP(3) NOT NULL,
  "verifiedBy" TEXT,
  CONSTRAINT "TopicBoardAlignment_pkey" PRIMARY KEY ("id")
);
-- UNIQUE(topic_id, board_id, track_id). NOTE: Postgres treats NULL trackId as distinct,
-- so application layer must enforce single NULL-track row per (topic, board).
CREATE UNIQUE INDEX "TopicBoardAlignment_topicId_boardId_trackId_key" ON "TopicBoardAlignment"("topicId", "boardId", "trackId");
CREATE INDEX "TopicBoardAlignment_topicId_boardId_idx" ON "TopicBoardAlignment"("topicId", "boardId");
CREATE INDEX "TopicBoardAlignment_tier_idx" ON "TopicBoardAlignment"("tier");
CREATE INDEX "TopicBoardAlignment_boardId_idx" ON "TopicBoardAlignment"("boardId");
ALTER TABLE "TopicBoardAlignment" ADD CONSTRAINT "TopicBoardAlignment_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TopicBoardAlignment" ADD CONSTRAINT "TopicBoardAlignment_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "CurriculumBoard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TopicBoardAlignment" ADD CONSTRAINT "TopicBoardAlignment_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "StudyTrack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Audit log for admin panel (Phase 3)
CREATE TABLE "AlignmentAudit" (
  "id" TEXT NOT NULL,
  "alignmentId" TEXT NOT NULL,
  "actorEmail" TEXT,
  "action" TEXT NOT NULL,
  "previousValue" JSONB,
  "newValue" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AlignmentAudit_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "AlignmentAudit_alignmentId_idx" ON "AlignmentAudit"("alignmentId");
