
-- Global Ranking engine (2026-10-31, Phase 7): Stars, tiers, season groups,
-- async-simultaneous pods, and the Hall of Fame.
--
-- One currency (Stars), six cumulative tiers, groups of 20 per tier that
-- auto-assign by tier as members join the queue, pods of 2–4 racing a shared
-- 20-minute window at their own pace, and season close (Hall of Fame, Prime
-- days, promotion/relegation).
--
-- This migration ONLY creates new tables: no existing model, column, index or
-- constraint is touched, so the Merit League cup formats (Speed / Endurance /
-- Mastery / Bracket) and their scoring path are unaffected. The derived
-- question-set invariant is unchanged — no answer key is stored here at all.
--
-- RLS follows the repo convention (20260926 / 20261011 / 20261029): Gnostiri
-- reaches Postgres only from trusted server code via Prisma, so no table is
-- exposed through the Supabase Data API.

CREATE TABLE "Season" (
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    CONSTRAINT "Season_pkey" PRIMARY KEY ("slug")
);

CREATE TABLE "StarLedger" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "delta" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "balanceAfter" INTEGER NOT NULL,
    "seasonSlug" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StarLedger_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "StarLedger_userId_createdAt_idx" ON "StarLedger"("userId","createdAt");
CREATE INDEX "StarLedger_userId_reason_idx" ON "StarLedger"("userId","reason");

CREATE TABLE "RankState" (
    "userId" TEXT NOT NULL,
    "stars" INTEGER NOT NULL DEFAULT 0,
    "tier" INTEGER NOT NULL DEFAULT 1,
    "groupId" TEXT,
    "podReadyAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RankState_pkey" PRIMARY KEY ("userId")
);

CREATE TABLE "LeagueGroup" (
    "id" TEXT NOT NULL,
    "seasonSlug" TEXT NOT NULL,
    "tier" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 20,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LeagueGroup_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "LeagueGroup_seasonSlug_tier_name_key" ON "LeagueGroup"("seasonSlug","tier","name");
CREATE INDEX "LeagueGroup_seasonSlug_tier_idx" ON "LeagueGroup"("seasonSlug","tier");

CREATE TABLE "LeagueGroupMember" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LeagueGroupMember_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "LeagueGroupMember_groupId_userId_key" ON "LeagueGroupMember"("groupId","userId");
CREATE INDEX "LeagueGroupMember_userId_idx" ON "LeagueGroupMember"("userId");

CREATE TABLE "PodMatch" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "seasonSlug" TEXT NOT NULL,
    "tier" INTEGER NOT NULL,
    "round" INTEGER NOT NULL DEFAULT 1,
    "windowOpensAt" TIMESTAMP(3) NOT NULL,
    "windowClosesAt" TIMESTAMP(3) NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'open',
    "seed" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PodMatch_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "PodMatch_groupId_createdAt_idx" ON "PodMatch"("groupId","createdAt");
CREATE INDEX "PodMatch_seasonSlug_tier_idx" ON "PodMatch"("seasonSlug","tier");
CREATE INDEX "PodMatch_state_windowClosesAt_idx" ON "PodMatch"("state","windowClosesAt");

CREATE TABLE "PodMember" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "seed" INTEGER NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "submittedAt" TIMESTAMP(3),
    CONSTRAINT "PodMember_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "PodMember_matchId_userId_key" ON "PodMember"("matchId","userId");
CREATE INDEX "PodMember_userId_idx" ON "PodMember"("userId");

CREATE TABLE "HallOfFameEntry" (
    "id" TEXT NOT NULL,
    "seasonSlug" TEXT NOT NULL,
    "tier" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,
    "groupName" TEXT NOT NULL,
    "rosterJson" TEXT[] NOT NULL,
    "avgStars" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "HallOfFameEntry_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "HallOfFameEntry_seasonSlug_tier_rank_key" ON "HallOfFameEntry"("seasonSlug","tier","rank");
CREATE INDEX "HallOfFameEntry_seasonSlug_tier_idx" ON "HallOfFameEntry"("seasonSlug","tier");

-- Foreign keys: the ladder's own graph is enforced in-database (degenerate
-- rows cannot be written by a bug), and the season graph cascades so closing
-- a season cannot leave orphan pods behind. StarLedger.seasonSlug and
-- RankState.groupId stay plain columns — the ledger is append-only history
-- and a rank state must survive its season closing.
ALTER TABLE "LeagueGroup" ADD CONSTRAINT "LeagueGroup_seasonSlug_fkey" FOREIGN KEY ("seasonSlug") REFERENCES "Season"("slug") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LeagueGroupMember" ADD CONSTRAINT "LeagueGroupMember_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "LeagueGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PodMatch" ADD CONSTRAINT "PodMatch_seasonSlug_fkey" FOREIGN KEY ("seasonSlug") REFERENCES "Season"("slug") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PodMatch" ADD CONSTRAINT "PodMatch_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "LeagueGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PodMember" ADD CONSTRAINT "PodMember_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "PodMatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "HallOfFameEntry" ADD CONSTRAINT "HallOfFameEntry_seasonSlug_fkey" FOREIGN KEY ("seasonSlug") REFERENCES "Season"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- Ranking rows are never readable through the Data API: the only legitimate
-- readers are the server-side engine and the season-close admin route.
ALTER TABLE "Season" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "StarLedger" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "RankState" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LeagueGroup" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LeagueGroupMember" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PodMatch" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PodMember" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "HallOfFameEntry" ENABLE ROW LEVEL SECURITY;
