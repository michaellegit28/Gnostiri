-- Supabase Auth migration (replaces Firebase Auth).
-- The old live deployment reads `firebaseUid`, so that column stays in place
-- (nullable, deprecated) until the new code ships — no downtime window.
-- New rows are keyed by `supabaseUid` (Supabase auth.users id).

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "supabaseUid" text;
CREATE UNIQUE INDEX IF NOT EXISTS "User_supabaseUid_key" ON "User"("supabaseUid");
ALTER TABLE "User" ALTER COLUMN "firebaseUid" DROP NOT NULL;