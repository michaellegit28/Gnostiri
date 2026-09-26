CREATE TYPE "AppDomain" AS ENUM ('highschool', 'university', 'extras');

CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "firebaseUid" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "name" TEXT,
  "avatar" TEXT,
  "country" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "User_firebaseUid_key" ON "User"("firebaseUid");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

CREATE TABLE "Profile" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "currentDomain" "AppDomain" NOT NULL DEFAULT 'highschool',
  "streak" INTEGER NOT NULL DEFAULT 0,
  "lastActive" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "preferredExam" TEXT,
  CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "Subscription" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "tier" TEXT NOT NULL DEFAULT 'free',
  "domainAccess" "AppDomain"[] NOT NULL DEFAULT ARRAY[]::"AppDomain"[],
  "expiresAt" TIMESTAMP(3),
  "provider" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "Domain" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "isPublic" BOOLEAN NOT NULL DEFAULT true,
  "requiresSubscription" BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT "Domain_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Domain_slug_key" ON "Domain"("slug");

CREATE TABLE "Examination" (
  "id" TEXT NOT NULL,
  "domain" "AppDomain" NOT NULL,
  "name" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "country" TEXT,
  "syllabusUrl" TEXT,
  CONSTRAINT "Examination_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Topic" (
  "id" TEXT NOT NULL,
  "domain" "AppDomain" NOT NULL,
  "parentId" TEXT,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "orderIndex" INTEGER NOT NULL DEFAULT 0,
  "isPublished" BOOLEAN NOT NULL DEFAULT true,
  CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "Lesson" (
  "id" TEXT NOT NULL,
  "domain" "AppDomain" NOT NULL,
  "topicId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "content" JSONB NOT NULL,
  "orderIndex" INTEGER NOT NULL DEFAULT 0,
  "estimatedMinutes" INTEGER NOT NULL DEFAULT 10,
  CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "Question" (
  "id" TEXT NOT NULL,
  "domain" "AppDomain" NOT NULL,
  "topicId" TEXT NOT NULL,
  "type" TEXT NOT NULL DEFAULT 'mcq',
  "questionText" TEXT NOT NULL,
  "options" JSONB NOT NULL,
  "correctAnswer" TEXT NOT NULL,
  "explanation" TEXT,
  "difficulty" TEXT NOT NULL DEFAULT 'medium',
  "sourceExam" TEXT,
  CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "Question" ADD CONSTRAINT "Question_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "QuizAttempt" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "domain" "AppDomain" NOT NULL,
  "topicId" TEXT NOT NULL,
  "score" INTEGER NOT NULL,
  "maxScore" INTEGER NOT NULL,
  "answers" JSONB NOT NULL,
  "durationSeconds" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "QuizAttempt_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "Progress" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "domain" "AppDomain" NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'not_started',
  "accuracy" DOUBLE PRECISION,
  "lastStudied" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Progress_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "TutorSession" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "domain" "AppDomain" NOT NULL,
  "subjectId" TEXT,
  "topicId" TEXT,
  "messages" JSONB NOT NULL,
  "context" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TutorSession_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "TutorSession" ADD CONSTRAINT "TutorSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TutorSession" ADD CONSTRAINT "TutorSession_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "StudyPlan" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "domain" "AppDomain" NOT NULL,
  "examDate" TIMESTAMP(3),
  "items" JSONB NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "generatedBy" TEXT NOT NULL DEFAULT 'ai',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "StudyPlan_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "StudyPlan" ADD CONSTRAINT "StudyPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
