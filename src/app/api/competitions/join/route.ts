import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { hasPremiumAccess } from "@/lib/entitlements";
import { createNotification } from "@/lib/notify";

/**
 * GET /api/competitions/join?code=XXXX | ?competitionId=ID
 * Resolve an invite landing into a cup summary. For a private cup the
 * unguessable invite code is the only key; for a public one the id works.
 * Returns 404 for an unknown/expired code so the landing can show its error
 * state. The POST below performs the actual join.
 */
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const code = (params.get("code") || "").trim().toUpperCase();
  const competitionId = (params.get("competitionId") || "").trim();
  if (!code && !competitionId) {
    return NextResponse.json({ error: "An invite code or cup id is required" }, { status: 400 });
  }

  const user = await getCurrentUser();

  const competition = code
    ? await prisma.competition.findUnique({ where: { inviteCode: code } })
    : await prisma.competition.findUnique({ where: { id: competitionId } });
  if (!competition) {
    return NextResponse.json({ error: "This invite link is invalid or has expired" }, { status: 404 });
  }
  if (!code && competition.visibility !== "public") {
    return NextResponse.json({ error: "That cup isn't open to join directly" }, { status: 404 });
  }

  const [host, count, callerMembership] = await Promise.all([
    prisma.user.findUnique({ where: { id: competition.hostId }, select: { name: true } }),
    prisma.competitionMember.count({ where: { competitionId: competition.id } }),
    user
      ? prisma.competitionMember.findUnique({
          where: { competitionId_userId: { competitionId: competition.id, userId: user.id } },
        })
      : Promise.resolve(null),
  ]);

  const nowMs = Date.now();
  const started = nowMs >= competition.startsAt.getTime();
  const finished = competition.status === "finished" || (competition.status !== "cancelled" && nowMs > competition.endsAt.getTime());
  const full = count >= competition.maxMembers;

  let canJoin = !!user && !callerMembership && !started && !full && !finished && competition.status !== "cancelled";
  let reason: string | null = null;
  if (!user) reason = "sign-in";
  else if (callerMembership) reason = "member";
  else if (started || finished) reason = "started";
  else if (full) reason = "full";
  else if (competition.entryRule === "prime" && !callerMembership) {
    const premium = await hasPremiumAccess(user.id, competition.domain);
    if (!premium) {
      canJoin = false;
      reason = "premium";
    }
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
      memberCount: count,
      hostName: host?.name ?? null,
    },
    caller: {
      isAuthenticated: !!user,
      isMember: !!callerMembership,
      isHost: competition.hostId === user?.id,
      started,
      full,
      finished,
      requiresPrime: competition.entryRule === "prime",
      canJoin,
      reason,
    },
  });
}

/**
 * POST /api/competitions/join — { inviteCode } for a private cup, or
 * { competitionId } for a public one. Auth required.
 *
 * 409 when the cup already started/live, is full, or the caller is already a
 * member. Public cups whose entryRule is "prime" require Prime (free cups stay
 * open to everyone — ROADMAP.md §3). Joining notifies the host.
 */
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in to join a cup" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const inviteCode = typeof body?.inviteCode === "string" ? body.inviteCode.trim().toUpperCase() : null;
  const competitionId = typeof body?.competitionId === "string" ? body.competitionId.trim() : null;
  if (!inviteCode && !competitionId) {
    return NextResponse.json({ error: "An invite code or cup id is required" }, { status: 400 });
  }

  const competition = inviteCode
    ? await prisma.competition.findUnique({ where: { inviteCode } })
    : await prisma.competition.findUnique({ where: { id: competitionId as string } });
  if (!competition) {
    return NextResponse.json({ error: "This invite link is invalid or has expired" }, { status: 404 });
  }
  if (!inviteCode && competition.visibility !== "public") {
    return NextResponse.json({ error: "That cup isn't open to join directly" }, { status: 404 });
  }

  const nowMs = Date.now();
  const start = competition.startsAt.getTime();

  // Guards — 409 on any conflict. Membership/capacity checked before the prime
  // gate so a full private cup reads as "full", not "needs Prime".
  const existing = await prisma.competitionMember.findUnique({
    where: { competitionId_userId: { competitionId: competition.id, userId: user.id } },
    select: { id: true },
  });
  if (existing) {
    return NextResponse.json({ error: "You are already in this cup" }, { status: 409 });
  }
  if (nowMs >= start || competition.status === "live" || competition.status === "finished" || competition.status === "cancelled") {
    return NextResponse.json({ error: "This cup has already started — joining closed" }, { status: 409 });
  }
  const memberCount = await prisma.competitionMember.count({ where: { competitionId: competition.id } });
  if (memberCount >= competition.maxMembers) {
    return NextResponse.json({ error: "This cup is full" }, { status: 409 });
  }
  if (competition.entryRule === "prime") {
    const premium = await hasPremiumAccess(user.id, competition.domain);
    if (!premium) {
      return NextResponse.json({ error: "This is a Prime-entry cup — upgrade to join", reason: "prime" }, { status: 403 });
    }
  }

  const isHost = competition.hostId === user.id;
  await prisma.competitionMember.create({
    data: { competitionId: competition.id, userId: user.id, anonymous: true },
  });

  // Tell the host someone joined. No honest "join" type exists — "milestone"
  // is the closest fit (ROADMAP §2 closed list); skip when the host joins self.
  if (!isHost) {
    await createNotification(competition.hostId, {
      type: "milestone",
      title: "New member joined",
      body: `${user.name || "Someone"} joined "${competition.title}".`,
      href: `/league/${competition.id}`,
    });
  }

  return NextResponse.json({
    competitionId: competition.id,
    title: competition.title,
    visibility: competition.visibility,
    status: competition.status,
    joined: true,
  });
}
