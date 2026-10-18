-- 1st-launch access tokens: single-use, country-bound, capped supply.
-- Max 220 total (enforced in the generator), of which max 20 benefactor
-- tier (launch access + university premium). Tokens die on consumption or
-- when their launch window ends.

-- CreateTable
CREATE TABLE "LaunchToken" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "tier" TEXT NOT NULL DEFAULT 'standard',
    "usedById" TEXT,
    "usedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LaunchToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LaunchToken_code_key" ON "LaunchToken"("code");

-- CreateIndex
CREATE UNIQUE INDEX "LaunchToken_usedById_key" ON "LaunchToken"("usedById");

-- CreateIndex
CREATE INDEX "LaunchToken_country_tier_idx" ON "LaunchToken"("country", "tier");

-- CreateIndex
CREATE INDEX "LaunchToken_usedById_idx" ON "LaunchToken"("usedById");

-- AddForeignKey
ALTER TABLE "LaunchToken" ADD CONSTRAINT "LaunchToken_usedById_fkey" FOREIGN KEY ("usedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- RLS: Gnostiri reaches Postgres only from trusted server code via Prisma
-- (see 20260926 migrations). Launch tokens must never be readable or
-- redeemable through the Supabase Data API.
ALTER TABLE "LaunchToken" ENABLE ROW LEVEL SECURITY;
