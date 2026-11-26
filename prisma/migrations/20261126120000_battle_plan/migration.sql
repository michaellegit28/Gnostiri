-- Battle Plan foundation: one unified per-lane store for student goals, exam
-- dates and generated plans (rules for High School, AI for University).
-- Additive only — no existing table is touched. Apply via Supabase SQL editor.

DO $$ BEGIN
  CREATE TYPE "BattlePlanStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "BattlePlan" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "domain" "AppDomain" NOT NULL,
  "title" TEXT NOT NULL,
  "goal" TEXT,
  "examDate" TIMESTAMPTZ,
  "inputs" JSONB,
  "plan" JSONB,
  "status" "BattlePlanStatus" NOT NULL DEFAULT 'DRAFT',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "BattlePlan_userId_domain_status_idx"
  ON "BattlePlan"("userId", "domain", "status");