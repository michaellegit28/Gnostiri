-- AlterTable
ALTER TABLE "CourseLesson" ADD COLUMN "reviewStatus" TEXT NOT NULL DEFAULT 'needs-human-review',
                          ADD COLUMN "needsCheck" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "AssessmentItem" ADD COLUMN "reviewStatus" TEXT NOT NULL DEFAULT 'needs-human-review',
                            ADD COLUMN "needsCheck" BOOLEAN NOT NULL DEFAULT false;

-- RLS: n/a. Both tables already exist and already carry ENABLE ROW LEVEL
-- SECURITY (CourseLesson from migration 20260926070000_enable_content_rls,
-- AssessmentItem from 20261010155500_assessment_layer). No new tables here.
