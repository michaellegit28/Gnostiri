import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { hasPremiumAccess } from "@/lib/entitlements";

/**
 * GET /api/competitions/{id} — one cup. Visible to the host, any member, or
 * when the cup is public; otherwise 404 (a private cup's existence is not
 * leaked to strangers). Members come back ordered by rank, then score.
 */
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();

  const competition = await prisma.competition.findUnique({
    where: { id: params.id },
    include: {
      host: { select: { id: true, name: true } },
      _count: { select: { members: true } },
    },
  });
  if (!competition) {
    return NextResponse.json({ error: "Cup not found" }, { status: 404 });
  }

  const callerMembership = user
    ? await prisma.competitionMember.findUnique({
        where: { competitionId_userId: { competitionId: competition.id, userId: user.id } },
      })
    : null;

  const visible =
    competition.visibility === "public" || competition.hostId === user?.id || !!callerMembership;
  if (!visible) {
    return NextResponse.json({ error: "Cup not found" }, { status: 404 });
  }

  const members = await prisma.competitionMember.findMany({
    where: { competitionId: competition.id },
    orderBy: [{ rank: "asc" }, { score: "desc" }],
    select: {
      id: true,
      anonymous: true,
      score: true,
      rank: true,
      joinedAt: true,
      user: { select: { id: true, name: true } },
    },
  });

  const nowMs = Date.now();
  const started = nowMs >= competition.startsAt.getTime();
  const full = competition._count.members >= competition.maxMembers;
  const blockedByPrime = competition.entryRule === "prime" && !callerMembership;

  // "canViewerJoin" — a hint for the UI; the join route is the only enforcer.
  let canJoin = !!user && !callerMembership && !started && !full && competition.status !== "finished" && competition.status !== "cancelled";
  if (canJoin && blockedByPrime && user) {
    canJoin = await hasPremiumAccess(user.id, competition.domain);
  }

  return NextResponse.json({
    competition: {
      id: competition.id,
      title: competition.title,
      format: competition.format,
      subjectSlug: competition.subjectSlug,
      domain: competition.domain,
      visibility: competition.visibility,
      entryRule: competition.entryRule,
      status: competition.status,
      maxMembers: competition.maxMembers,
      startsAt: competition.startsAt,
      endsAt: competition.endsAt,
      seasonSlug: competition.seasonSlug,
      host: { id: competition.host.id, name: competition.host.name },
      memberCount: competition._count.members,
    },
    members: members.map((m) => ({
      id: m.id,
      userId: m.user.id,
      name: m.user.name,
      anonymous: m.anonymous,
      score: m.score,
      rank: m.rank,
      joinedAt: m.joinedAt,
      isCaller: user?.id === m.user.id,
    })),
    caller: {
      isAuthenticated: !!user,
      isHost: competition.hostId === user?.id,
      isMember: !!callerMembership,
      membership: callerMembership
        ? { id: callerMembership.id, score: callerMembership.score, rank: callerMembership.rank, anonymous: callerMembership.anonymous }
        : null,
      started,
      full,
      requiresPrime: competition.entryRule === "prime",
      canJoin,
    },
  });
}
