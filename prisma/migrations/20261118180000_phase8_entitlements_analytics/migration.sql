-- Phase 8: plan-based entitlements, analytics events, downloads, content requests.
-- Apply via the Supabase SQL editor (production pooler unreachable from agent boxes).

ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "plan" TEXT NOT NULL DEFAULT 'free';
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "addons" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "currency" TEXT;
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "amountCents" INTEGER;

CREATE TABLE IF NOT EXISTS "AnalyticsEvent" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT REFERENCES "User"("id") ON DELETE SET NULL,
  "anonId" TEXT,
  "type" TEXT NOT NULL,
  "meta" JSONB,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "AnalyticsEvent_type_createdAt_idx" ON "AnalyticsEvent"("type", "createdAt");
CREATE INDEX IF NOT EXISTS "AnalyticsEvent_userId_createdAt_idx" ON "AnalyticsEvent"("userId", "createdAt");

CREATE TABLE IF NOT EXISTS "Download" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "kind" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "plan" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "Download_userId_createdAt_idx" ON "Download"("userId", "createdAt");

CREATE TABLE IF NOT EXISTS "ContentRequest" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "kind" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "note" TEXT,
  "status" TEXT NOT NULL DEFAULT 'open',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "ContentRequest_status_createdAt_idx" ON "ContentRequest"("status", "createdAt");
