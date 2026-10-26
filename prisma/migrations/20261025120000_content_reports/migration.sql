-- Learner content reports — the discreet "flag a problem" channel on lesson /
-- study / item pages. Deliberately NOT coupled to CourseLesson.reviewStatus:
-- a report is learner feedback about what is on screen, not a governance flag.
-- Written only by trusted server code (POST /api/content-reports).

-- CreateTable
CREATE TABLE "ContentReport" (
    "id" TEXT NOT NULL,
    "domain" "AppDomain" NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "targetUrl" TEXT NOT NULL,
    "targetTitle" TEXT,
    "category" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "reporterId" TEXT,
    "reporterEmail" TEXT,
    "status" TEXT NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" TEXT,

    CONSTRAINT "ContentReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContentReport_status_createdAt_idx" ON "ContentReport"("status", "createdAt");

-- CreateIndex
CREATE INDEX "ContentReport_targetType_targetId_idx" ON "ContentReport"("targetType", "targetId");

-- CreateIndex
CREATE INDEX "ContentReport_reporterId_idx" ON "ContentReport"("reporterId");

-- AddForeignKey
ALTER TABLE "ContentReport" ADD CONSTRAINT "ContentReport_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- RLS: Gnostiri reaches Postgres only from trusted server code via Prisma
-- (see 20260926 migrations). Learner reports must never be readable or
-- insertable through the Supabase Data API.
ALTER TABLE "ContentReport" ENABLE ROW LEVEL SECURITY;
