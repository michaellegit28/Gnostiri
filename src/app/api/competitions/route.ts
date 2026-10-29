import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import {
  COMPETITION_FORMATS,
  CURRENT_SEASON,
  makeInviteCode,
  evaluateLeagueEligibility,
  type CompetitionFormat,
} from "@/lib/competition";
import { createNotification } from "@/lib/notify";

const STATUS_VALUES = ["scheduled", "live", "finished", "cancelled"] as const;
const MEMBER_MIN = 4;
const MEMBER_MAX = 64;
const BRACKET_MAX = 32;

/**
 * GET /api/competitions?status=scheduled|live|finished|cancelled
 * Public cups plus, for a signed-in caller, everything they host or have
 * joined. Every row carries its live member count (_count.members).
 */
export async function GET(req: NextRequest) {
  const nowMs = Date.now();
  const user = await getCurrentUser();
  const statusFilter = req.nextUrl.searchParams.get("status");

  const where: Record<string, unknown> = user
    ? { OR: [{ visibility: "public" }, { hostId: user.id }, { members: { some: { userId: user.id } } }] }
    : { visibility: "public" };
  if (statusFilter) (where as { status?: string }).status = statusFilter;

  const [cups, joinedIds] = await Promise.all([
    prisma.competition.findMany({
      where,
      orderBy: { startsAt: "asc" },
      take: 100,
      include: {
        host: { select: { id: true, name: true } },
        _count: { select: { members: true } },
      },
    }),
    user
      ? prisma.competitionMember.findMany({ where: { userId: user.id }, select: { competitionId: true } })
      : Promise.resolve([]),
  ]);

  const joinedSet = new Set(joinedIds.map((m) => m.competitionId));

  return NextResponse.json({
    competitions: cups.map((c) => {
      const start = c.startsAt.getTime();
      const end = c.endsAt.getTime();
      const started = nowMs >= start;
      const live = c.status !== "cancelled" && start <= nowMs && nowMs <= end;
      const finished = c.status === "finished" || (c.status !== "cancelled" && nowMs > end);
      return {
        id: c.id,
        title: c.title,
        format: c.format,
        visibility: c.visibility,
        entryRule: c.entryRule,
        status: c.status,
        seasonSlug: c.seasonSlug,
        startsAt: c.startsAt,
        endsAt: c.endsAt,
        maxMembers: c.maxMembers,
        domain: c.domain,
        memberCount: c._count.members,
        host: { id: c.host.id, name: c.host.name },
        isHost: user?.id === c.hostId,
        isMember: joinedSet.has(c.id),
        started,
        live,
        finished,
        full: c._count.members >= c.maxMembers,
      };
    }),
  });
}

/**
 * POST /api/competitions — host a new cup. Auth required; the four create-cup
 * gates (Prime tenure + mastery + accuracy + clean record) are re-run
 * SERVER-SIDE here — a client flag is never trusted (ROADMAP.md §3).
 */
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const format = typeof body.format === "string" ? body.format : "";
  const subjectSlug = typeof body.subjectSlug === "string" ? body.subjectSlug.trim() || null : null;
  const visibility = body.visibility === "public" ? "public" : "private";
  const entryRule = body.entryRule === "prime" ? "prime" : "free";

  if (!title) return NextResponse.json({ error: "A cup title is required" }, { status: 400 });
  if (!COMPETITION_FORMATS.includes(format as CompetitionFormat)) {
    return NextResponse.json({ error: "Pick a cup format" }, { status: 400 });
  }

  const cap = format === "bracket" ? BRACKET_MAX : MEMBER_MAX;
  let maxMembers = Number(body.maxMembers);
  if (!Number.isFinite(maxMembers) || maxMembers === 0) maxMembers = format === "bracket" ? 8 : 16;
  maxMembers = Math.max(MEMBER_MIN, Math.min(cap, Math.round(maxMembers)));

  const now = Date.now();
  const startsAt = typeof body.startsAt === "string" && body.startsAt ? new Date(body.startsAt) : new Date(now + 3600_000);
  const endsAt = typeof body.endsAt === "string" && body.endsAt ? new Date(body.endsAt) : new Date(now + 25 * 3600_000);
  if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime())) {
    return NextResponse.json({ error: "Invalid start or end date" }, { status: 400 });
  }
  if (endsAt.getTime() <= startsAt.getTime()) {
    return NextResponse.json({ error: "The end must come after the start" }, { status: 400 });
  }

  // Server-side eligibility gate — the ONLY place it is enforced.
  const eligibility = await evaluateLeagueEligibility(user.id);
  if (!eligibility.eligible) {
    return NextResponse.json({ error: "You are not eligible to host a cup yet", reasons: eligibility.reasons }, { status: 403 });
  }

  const inviteCode = visibility === "private" ? makeInviteCode() : null;

  const competition = await prisma.competition.create({
    data: {
      hostId: user.id,
      format,
      title,
      subjectSlug,
      visibility,
      inviteCode,
      entryRule,
      maxMembers,
      startsAt,
      endsAt,
      status: "scheduled",
      seasonSlug: CURRENT_SEASON,
      members: {
        create: { userId: user.id, anonymous: true },
      },
    },
    select: {
      id: true,
      title: true,
      format: true,
      visibility: true,
      inviteCode: true,
      entryRule: true,
      maxMembers: true,
      status: true,
      startsAt: true,
      endsAt: true,
    },
  });

  await createNotification(user.id, {
    type: "cup_starting",
    title: "Your cup is scheduled",
    body: `"${competition.title}" opens ${startsAt.toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}.`,
    href: `/league/${competition.id}`,
  });

  return NextResponse.json({ competition }, { status: 201 });
}
