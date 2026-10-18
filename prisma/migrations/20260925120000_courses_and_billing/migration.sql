ALTER TABLE "Subscription"
  ADD COLUMN "providerRef" TEXT,
  ADD COLUMN "billingPeriod" TEXT NOT NULL DEFAULT 'monthly';

CREATE UNIQUE INDEX "Subscription_providerRef_key" ON "Subscription"("providerRef");

CREATE TABLE "Course" (
  "id" TEXT NOT NULL,
  "domain" "AppDomain" NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "department" TEXT NOT NULL,
  "description" TEXT,
  "isPublished" BOOLEAN NOT NULL DEFAULT true,
  CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Course_domain_slug_key" ON "Course"("domain", "slug");

CREATE TABLE "CourseLesson" (
  "id" TEXT NOT NULL,
  "courseId" TEXT NOT NULL,
  "domain" "AppDomain" NOT NULL DEFAULT 'university',
  "title" TEXT NOT NULL,
  "content" JSONB NOT NULL,
  "orderIndex" INTEGER NOT NULL DEFAULT 0,
  "estimatedMinutes" INTEGER NOT NULL DEFAULT 10,
  CONSTRAINT "CourseLesson_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "CourseLesson" ADD CONSTRAINT "CourseLesson_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "CourseQuestion" (
  "id" TEXT NOT NULL,
  "courseId" TEXT NOT NULL,
  "domain" "AppDomain" NOT NULL DEFAULT 'university',
  "questionText" TEXT NOT NULL,
  "options" JSONB NOT NULL,
  "correctAnswer" TEXT NOT NULL,
  "explanation" TEXT,
  CONSTRAINT "CourseQuestion_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "CourseQuestion" ADD CONSTRAINT "CourseQuestion_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "CourseQuizAttempt" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "courseId" TEXT NOT NULL,
  "domain" "AppDomain" NOT NULL DEFAULT 'university',
  "score" INTEGER NOT NULL,
  "maxScore" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CourseQuizAttempt_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "CourseQuizAttempt" ADD CONSTRAINT "CourseQuizAttempt_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "Certificate" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "courseId" TEXT NOT NULL,
  "domain" "AppDomain" NOT NULL DEFAULT 'university',
  "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Certificate_userId_courseId_key" ON "Certificate"("userId", "courseId");
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "PaymentEvent" (
  "id" TEXT NOT NULL,
  "eventId" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PaymentEvent_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "PaymentEvent_eventId_key" ON "PaymentEvent"("eventId");
