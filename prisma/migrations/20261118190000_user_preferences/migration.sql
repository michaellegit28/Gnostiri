-- Phase 8f: server-stored user preferences (settings hub). Apply via Supabase SQL editor.

CREATE TABLE IF NOT EXISTS "UserPreference" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL UNIQUE REFERENCES "User"("id") ON DELETE CASCADE,
  "country" TEXT,
  "examStandard" TEXT,
  "dailyGoalMinutes" INTEGER NOT NULL DEFAULT 20,
  "srsEnabled" BOOLEAN NOT NULL DEFAULT true,
  "analyticsOptOut" BOOLEAN NOT NULL DEFAULT false,
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);
