import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { MIN_TIER, MAX_TIER, displayHandle, podStars, rankPodMembers, tierFor, tierInfo } from "@/lib/ranking";
import { deltaLabel, winCardSvg, type WinCardInput } from "@/lib/win-card";

export const dynamic = "force-dynamic";

// GET /api/ranking/win-card?match=<matchId>            → a pod win card
// GET /api/ranking/win-card?tier=<n>&delta=<n>&context=<s>  → a rank-up card
//
// A 1080x1920 PNG sized for WhatsApp Status. Authorisation is per-variant
// and reads from the caller's OWN rows only:
//
//  - match:    the caller must hold a seat in that pod (their placement in
//              it decides the delta, so it cannot be inflated).
//  - rank-up:  the caller must have a RankState, the tier must be THEIR tier
//              (from their own stars) and delta must equal the delta of
//              their MOST RECENT StarLedger row. A spoofed delta is a 400,
//              not a card.
//
// The SVG carries a display name and nothing else — the renderer has no
// parameter for an email or a user id (see src/lib/win-card.ts).

/** Longest context line accepted — keeps the card legible on a phone. */
const MAX_CONTEXT_LENGTH = 80;

/** Rasterise the card. sharp is the only rasteriser: librsvg does the SVG.
 *  Returned as a Uint8Array so it is valid Response body input. */
async function toPng(input: WinCardInput): Promise<Uint8Array> {
  const raster = await sharp(Buffer.from(winCardSvg(input))).png().toBuffer();
  return new Uint8Array(raster);
}

function pngResponse(png: Uint8Array, filename: string): NextResponse {
  return new NextResponse(Buffer.from(png), {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in to share your win card" }, { status: 401 });

  const params = req.nextUrl.searchParams;
  const matchId = (params.get("match") ?? "").trim();

  if (matchId) {
    // ── pod win: seat, placement, award ────────────────────────────────────
    const seat = await prisma.podMember.findFirst({
      where: { matchId, userId: user.id },
      include: { match: { include: { group: { select: { name: true } } } } },
    });
    if (!seat) return NextResponse.json({ error: "You are not a member of that pod" }, { status: 403 });

    const seats = await prisma.podMember.findMany({
      where: { matchId },
      select: { userId: true, score: true, submittedAt: true },
    });
    const placement = rankPodMembers(seats).find((row) => row.userId === user.id)?.placement ?? seats.length;
    const tier = seat.match.tier;

    return pngResponse(
      await toPng({
        handle: displayHandle(user.name),
        tierLabel: tierInfo(tier).label,
        delta: podStars(placement),
        context: `Pod quickfire · ${seat.match.group?.name ?? "your group"}`,
        title: placement === 1 ? "Pod victory" : "Pod finished",
        dateLabel: seat.match.windowClosesAt.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      }),
      `gnostiri-wincard-pod-${matchId}.png`,
    );
  }

  // ── rank-up: the caller's own ladder state and their last award ──────────
  const tierParam = Number(params.get("tier"));
  const deltaParam = Number(params.get("delta"));
  const context = (params.get("context") ?? "").trim().slice(0, MAX_CONTEXT_LENGTH);

  if (!Number.isInteger(tierParam) || tierParam < MIN_TIER || tierParam > MAX_TIER || !Number.isInteger(deltaParam)) {
    return NextResponse.json({ error: "tier and delta are required integers" }, { status: 400 });
  }

  const rankState = await prisma.rankState.findUnique({ where: { userId: user.id } });
  if (!rankState) return NextResponse.json({ error: "Join the queue before sharing a rank-up" }, { status: 404 });

  // The tier MUST be the caller's own, derived from their own stars.
  if (tierFor(rankState.stars) !== tierParam) {
    return NextResponse.json({ error: "tier does not match your own standing" }, { status: 400 });
  }

  const lastAward = await prisma.starLedger.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: { delta: true },
  });
  if (!lastAward) return NextResponse.json({ error: "No star award to share yet" }, { status: 404 });
  if (lastAward.delta !== deltaParam) {
    return NextResponse.json({ error: "delta must equal your most recent star award" }, { status: 400 });
  }

  return pngResponse(
    await toPng({
      handle: displayHandle(user.name),
      tierLabel: tierInfo(tierParam).label,
      delta: deltaParam,
      context: context || `Rank up · ${tierInfo(tierParam).label}`,
      title: "Rank up",
      dateLabel: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    }),
    `gnostiri-wincard-tier${tierParam}-${deltaLabel(deltaParam).replace(/\s+/g, "-").toLowerCase()}.png`,
  );
}
