-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "code" TEXT,
ADD COLUMN     "credits" INTEGER,
ADD COLUMN     "facultyId" TEXT,
ADD COLUMN     "level" INTEGER,
ADD COLUMN     "programmeId" TEXT,
ADD COLUMN     "semester" TEXT;

-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "facultyId" TEXT;

-- CreateTable
CREATE TABLE "Faculty" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "blurb" TEXT,
    "iconSlug" TEXT,
    "accent" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Faculty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Programme" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "degreeAwarded" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,
    "departmentId" TEXT,
    "durationYears" INTEGER NOT NULL DEFAULT 5,
    "totalCredits" INTEGER,
    "description" TEXT,
    "iconSlug" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Programme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enrollment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "programmeId" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 100,
    "status" TEXT NOT NULL DEFAULT 'active',
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurriculumStandard" (
    "id" TEXT NOT NULL,
    "programmeId" TEXT NOT NULL,
    "authority" TEXT NOT NULL,
    "editionYear" INTEGER NOT NULL,
    "officialUrl" TEXT,
    "lastAuditedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CurriculumStandard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurriculumAlignment" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "standardId" TEXT NOT NULL,
    "moduleCode" TEXT,
    "mappingTier" TEXT NOT NULL DEFAULT 'core',
    "weightNotes" TEXT,
    "verifiedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedBy" TEXT,

    CONSTRAINT "CurriculumAlignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoursePrerequisite" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "prerequisiteId" TEXT NOT NULL,

    CONSTRAINT "CoursePrerequisite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseModule" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CourseModule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConceptNode" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "moduleId" TEXT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "bloomsLevel" TEXT NOT NULL DEFAULT 'understand',
    "estMinutes" INTEGER NOT NULL DEFAULT 15,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ConceptNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConceptPrerequisite" (
    "id" TEXT NOT NULL,
    "conceptId" TEXT NOT NULL,
    "prerequisiteId" TEXT NOT NULL,
    "rationale" TEXT,

    CONSTRAINT "ConceptPrerequisite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConceptMastery" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "conceptId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'not_started',
    "masteryScore" DOUBLE PRECISION,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "correctStreak" INTEGER NOT NULL DEFAULT 0,
    "lastReviewed" TIMESTAMP(3),
    "nextReviewDue" TIMESTAMP(3),

    CONSTRAINT "ConceptMastery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicalCase" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "vignette" TEXT NOT NULL,
    "presentation" TEXT,
    "questions" JSONB NOT NULL,
    "teachingPoints" TEXT,
    "difficulty" TEXT NOT NULL DEFAULT 'medium',
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ClinicalCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillStation" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "checklist" JSONB NOT NULL,
    "durationMinutes" INTEGER NOT NULL DEFAULT 10,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "SkillStation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillStationAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stationId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "maxScore" INTEGER NOT NULL,
    "checks" JSONB NOT NULL,
    "feedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SkillStationAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetencyTranscript" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "programmeId" TEXT,
    "title" TEXT NOT NULL,
    "summary" JSONB NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompetencyTranscript_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Faculty_slug_key" ON "Faculty"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Programme_slug_key" ON "Programme"("slug");

-- CreateIndex
CREATE INDEX "Programme_facultyId_idx" ON "Programme"("facultyId");

-- CreateIndex
CREATE INDEX "Programme_departmentId_idx" ON "Programme"("departmentId");

-- CreateIndex
CREATE INDEX "Enrollment_userId_idx" ON "Enrollment"("userId");

-- CreateIndex
CREATE INDEX "Enrollment_programmeId_idx" ON "Enrollment"("programmeId");

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_userId_programmeId_key" ON "Enrollment"("userId", "programmeId");

-- CreateIndex
CREATE INDEX "CurriculumStandard_programmeId_idx" ON "CurriculumStandard"("programmeId");

-- CreateIndex
CREATE UNIQUE INDEX "CurriculumStandard_programmeId_authority_editionYear_key" ON "CurriculumStandard"("programmeId", "authority", "editionYear");

-- CreateIndex
CREATE INDEX "CurriculumAlignment_courseId_idx" ON "CurriculumAlignment"("courseId");

-- CreateIndex
CREATE INDEX "CurriculumAlignment_standardId_idx" ON "CurriculumAlignment"("standardId");

-- CreateIndex
CREATE UNIQUE INDEX "CurriculumAlignment_courseId_standardId_key" ON "CurriculumAlignment"("courseId", "standardId");

-- CreateIndex
CREATE INDEX "CoursePrerequisite_courseId_idx" ON "CoursePrerequisite"("courseId");

-- CreateIndex
CREATE INDEX "CoursePrerequisite_prerequisiteId_idx" ON "CoursePrerequisite"("prerequisiteId");

-- CreateIndex
CREATE UNIQUE INDEX "CoursePrerequisite_courseId_prerequisiteId_key" ON "CoursePrerequisite"("courseId", "prerequisiteId");

-- CreateIndex
CREATE INDEX "CourseModule_courseId_idx" ON "CourseModule"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "CourseModule_courseId_slug_key" ON "CourseModule"("courseId", "slug");

-- CreateIndex
CREATE INDEX "ConceptNode_courseId_idx" ON "ConceptNode"("courseId");

-- CreateIndex
CREATE INDEX "ConceptNode_moduleId_idx" ON "ConceptNode"("moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "ConceptNode_courseId_slug_key" ON "ConceptNode"("courseId", "slug");

-- CreateIndex
CREATE INDEX "ConceptPrerequisite_conceptId_idx" ON "ConceptPrerequisite"("conceptId");

-- CreateIndex
CREATE INDEX "ConceptPrerequisite_prerequisiteId_idx" ON "ConceptPrerequisite"("prerequisiteId");

-- CreateIndex
CREATE UNIQUE INDEX "ConceptPrerequisite_conceptId_prerequisiteId_key" ON "ConceptPrerequisite"("conceptId", "prerequisiteId");

-- CreateIndex
CREATE INDEX "ConceptMastery_userId_idx" ON "ConceptMastery"("userId");

-- CreateIndex
CREATE INDEX "ConceptMastery_conceptId_idx" ON "ConceptMastery"("conceptId");

-- CreateIndex
CREATE UNIQUE INDEX "ConceptMastery_userId_conceptId_key" ON "ConceptMastery"("userId", "conceptId");

-- CreateIndex
CREATE INDEX "ClinicalCase_courseId_idx" ON "ClinicalCase"("courseId");

-- CreateIndex
CREATE INDEX "SkillStation_courseId_idx" ON "SkillStation"("courseId");

-- CreateIndex
CREATE INDEX "SkillStationAttempt_userId_idx" ON "SkillStationAttempt"("userId");

-- CreateIndex
CREATE INDEX "SkillStationAttempt_stationId_idx" ON "SkillStationAttempt"("stationId");

-- CreateIndex
CREATE INDEX "CompetencyTranscript_userId_idx" ON "CompetencyTranscript"("userId");

-- CreateIndex
CREATE INDEX "CompetencyTranscript_programmeId_idx" ON "CompetencyTranscript"("programmeId");

-- CreateIndex
CREATE INDEX "Course_programmeId_idx" ON "Course"("programmeId");

-- CreateIndex
CREATE INDEX "Course_facultyId_idx" ON "Course"("facultyId");

-- CreateIndex
CREATE INDEX "Course_level_idx" ON "Course"("level");

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "Programme"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Programme" ADD CONSTRAINT "Programme_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Programme" ADD CONSTRAINT "Programme_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "Programme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumStandard" ADD CONSTRAINT "CurriculumStandard_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "Programme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumAlignment" ADD CONSTRAINT "CurriculumAlignment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumAlignment" ADD CONSTRAINT "CurriculumAlignment_standardId_fkey" FOREIGN KEY ("standardId") REFERENCES "CurriculumStandard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoursePrerequisite" ADD CONSTRAINT "CoursePrerequisite_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoursePrerequisite" ADD CONSTRAINT "CoursePrerequisite_prerequisiteId_fkey" FOREIGN KEY ("prerequisiteId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseModule" ADD CONSTRAINT "CourseModule_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConceptNode" ADD CONSTRAINT "ConceptNode_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConceptNode" ADD CONSTRAINT "ConceptNode_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "CourseModule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConceptPrerequisite" ADD CONSTRAINT "ConceptPrerequisite_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "ConceptNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConceptPrerequisite" ADD CONSTRAINT "ConceptPrerequisite_prerequisiteId_fkey" FOREIGN KEY ("prerequisiteId") REFERENCES "ConceptNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConceptMastery" ADD CONSTRAINT "ConceptMastery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConceptMastery" ADD CONSTRAINT "ConceptMastery_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "ConceptNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalCase" ADD CONSTRAINT "ClinicalCase_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillStation" ADD CONSTRAINT "SkillStation_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillStationAttempt" ADD CONSTRAINT "SkillStationAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillStationAttempt" ADD CONSTRAINT "SkillStationAttempt_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "SkillStation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetencyTranscript" ADD CONSTRAINT "CompetencyTranscript_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetencyTranscript" ADD CONSTRAINT "CompetencyTranscript_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "Programme"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- RLS: Gnostiri reaches Postgres only from trusted server code via Prisma
-- (see 20260926 migrations and 20261009 exam_paper_bank). No anon/authenticated
-- policies — competency data and clinical content must never be readable
-- through the Supabase Data API.
ALTER TABLE "Faculty" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Programme" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Enrollment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CurriculumStandard" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CurriculumAlignment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CoursePrerequisite" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CourseModule" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ConceptNode" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ConceptPrerequisite" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ConceptMastery" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ClinicalCase" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SkillStation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SkillStationAttempt" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CompetencyTranscript" ENABLE ROW LEVEL SECURITY;
