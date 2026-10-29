-- Merit League + notification centre + library rewards (2026-10-27)

CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "href" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "emailed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Notification_userId_read_createdAt_idx" ON "Notification"("userId","read","createdAt");

CREATE TABLE "NotificationPreference" (
    "userId" TEXT NOT NULL,
    "emailOptIn" BOOLEAN NOT NULL DEFAULT false,
    "quietHours" TEXT,
    "mutedTypes" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    CONSTRAINT "NotificationPreference_pkey" PRIMARY KEY ("userId")
);

CREATE TABLE "Competition" (
    "id" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subjectSlug" TEXT,
    "domain" TEXT NOT NULL DEFAULT 'highschool',
    "visibility" TEXT NOT NULL DEFAULT 'private',
    "inviteCode" TEXT,
    "entryRule" TEXT NOT NULL DEFAULT 'free',
    "maxMembers" INTEGER NOT NULL DEFAULT 16,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "seasonSlug" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Competition_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Competition_inviteCode_key" ON "Competition"("inviteCode");
CREATE INDEX "Competition_status_startsAt_idx" ON "Competition"("status","startsAt");
CREATE INDEX "Competition_visibility_status_idx" ON "Competition"("visibility","status");

CREATE TABLE "CompetitionMember" (
    "id" TEXT NOT NULL,
    "competitionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "anonymous" BOOLEAN NOT NULL DEFAULT true,
    "score" INTEGER NOT NULL DEFAULT 0,
    "rank" INTEGER,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CompetitionMember_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "CompetitionMember_competitionId_userId_key" ON "CompetitionMember"("competitionId","userId");

CREATE TABLE "LeagueBadge" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "awardedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LeagueBadge_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "LeagueBadge_userId_key_key" ON "LeagueBadge"("userId","key");

CREATE TABLE "LeagueCredit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "delta" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "balanceAfter" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LeagueCredit_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "LeagueCredit_userId_createdAt_idx" ON "LeagueCredit"("userId","createdAt");

ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "NotificationPreference" ADD CONSTRAINT "NotificationPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Competition" ADD CONSTRAINT "Competition_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CompetitionMember" ADD CONSTRAINT "CompetitionMember_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CompetitionMember" ADD CONSTRAINT "CompetitionMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LeagueBadge" ADD CONSTRAINT "LeagueBadge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LeagueCredit" ADD CONSTRAINT "LeagueCredit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Notification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "NotificationPreference" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Competition" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CompetitionMember" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LeagueBadge" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LeagueCredit" ENABLE ROW LEVEL SECURITY;
