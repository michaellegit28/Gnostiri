
-- Desk pipeline (2026-10-29): processed study documents, their quiz items, and scheduled tasks.

CREATE TABLE "StudyDocument" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "contentHash" TEXT NOT NULL,
    "domain" TEXT NOT NULL DEFAULT 'highschool',
    "subjectSlug" TEXT,
    "status" TEXT NOT NULL DEFAULT 'processing',
    "pageCount" INTEGER NOT NULL DEFAULT 0,
    "errorNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StudyDocument_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "StudyDocument_contentHash_key" ON "StudyDocument"("contentHash");
CREATE INDEX "StudyDocument_userId_createdAt_idx" ON "StudyDocument"("userId","createdAt");

CREATE TABLE "DocumentQuizItem" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stem" TEXT NOT NULL,
    "options" JSONB NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL DEFAULT 'medium',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DocumentQuizItem_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "DocumentQuizItem_documentId_idx" ON "DocumentQuizItem"("documentId");
CREATE INDEX "DocumentQuizItem_userId_idx" ON "DocumentQuizItem"("userId");

CREATE TABLE "StudyTask" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "documentId" TEXT,
    "kind" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "minutes" INTEGER NOT NULL DEFAULT 30,
    "scheduledFor" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StudyTask_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "StudyTask_userId_scheduledFor_status_idx" ON "StudyTask"("userId","scheduledFor","status");

ALTER TABLE "StudyDocument" ADD CONSTRAINT "StudyDocument_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DocumentQuizItem" ADD CONSTRAINT "DocumentQuizItem_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "StudyDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DocumentQuizItem" ADD CONSTRAINT "DocumentQuizItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StudyTask" ADD CONSTRAINT "StudyTask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StudyTask" ADD CONSTRAINT "StudyTask_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "StudyDocument"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "StudyDocument" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DocumentQuizItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "StudyTask" ENABLE ROW LEVEL SECURITY;
