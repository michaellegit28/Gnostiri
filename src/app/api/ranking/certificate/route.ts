import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { requireAdmin } from "@/lib/admin-auth";
import { displayHandle, tierInfo } from "@/lib/ranking";
import { buildCertificatePdf, type CertificateInput } from "@/lib/certificate";

export const dynamic = "force-dynamic";

// GET /api/ranking/certificate?season=<slug>&member=<userId|displayName>[&tier=<n>]
//
// The verified season certificate. A signed-in winner downloads the PDF for
// the Hall of Fame entry THEY are engraved on; an allowlisted admin can fetch
// anyone's. Ownership is checked against the real LeagueGroupMember row, never
// against a display name, so two learners with the same name cannot claim one
// another's certificate.

const MAX_CERTIFICATE_ENTRIES = 500;

async function isAllowlistedAdmin(): Promise<boolean> {
  const gate = await requireAdmin();
  return gate.authorized && gate.reason === "allowlisted";
}

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in to download your certificate" }, { status: 401 });

  const params = req.nextUrl.searchParams;
  const seasonSlug = (params.get("season") ?? "").trim();
  const member = (params.get("member") ?? "").trim();
  const tierParam = params.get("tier");
  const tierFilter = tierParam === null ? null : Number(tierParam);

  if (!seasonSlug || !member) {
    return NextResponse.json({ error: "season and member are required" }, { status: 400 });
  }
  if (tierFilter !== null && !Number.isInteger(tierFilter)) {
    return NextResponse.json({ error: "tier must be an integer" }, { status: 400 });
  }

  const byId = await prisma.user.findUnique({
    where: { id: member },
    select: { id: true, name: true },
  });
  const holders = byId
    ? [byId]
    : await prisma.user.findMany({
        where: { name: member },
        select: { id: true, name: true },
        orderBy: { createdAt: "asc" },
      });
  if (holders.length === 0) {
    return NextResponse.json({ error: "No member found for that name or id" }, { status: 404 });
  }

  const admin = await isAllowlistedAdmin();
  const holderIds = holders.map((holder) => holder.id);
  if (!admin && !holderIds.includes(user.id)) {
    return NextResponse.json({ error: "This certificate belongs to another member" }, { status: 403 });
  }

  const memberships = await prisma.leagueGroupMember.findMany({
    where: { userId: { in: holderIds } },
    include: {
      group: {
        select: {
          seasonSlug: true,
          tier: true,
          name: true,
          members: {
            select: { userId: true },
            orderBy: { joinedAt: "asc" },
          },
        },
      },
    },
  });

  const entries = await prisma.hallOfFameEntry.findMany({
    where: tierFilter === null ? { seasonSlug } : { seasonSlug, tier: tierFilter },
    orderBy: { rank: "asc" },
    take: MAX_CERTIFICATE_ENTRIES,
  });

  const holderById = new Map(holders.map((holder) => [holder.id, holder]));
  let matchedEntry = false;
  let entry: (typeof entries)[number] | null = null;
  let membership: (typeof memberships)[number] | null = null;
  let holder: (typeof holders)[number] | null = null;

  for (const candidateEntry of entries) {
    const groupMatches = memberships.filter(
      (candidateMembership) =>
        candidateMembership.group.seasonSlug === candidateEntry.seasonSlug &&
        candidateMembership.group.tier === candidateEntry.tier &&
        candidateMembership.group.name === candidateEntry.groupName
    );
    if (groupMatches.length === 0) continue;
    matchedEntry = true;

    const selectedMembership =
      groupMatches.find((candidateMembership) => candidateMembership.userId === user.id) ??
      (admin ? groupMatches[0] : null);
    if (!selectedMembership) continue;
    const selectedHolder = holderById.get(selectedMembership.userId);
    if (!selectedHolder) continue;
    entry = candidateEntry;
    membership = selectedMembership;
    holder = selectedHolder;
    break;
  }

  if (!entry) {
    if (!admin && matchedEntry) {
      return NextResponse.json({ error: "This certificate belongs to another member" }, { status: 403 });
    }
    return NextResponse.json(
      { error: "No Hall of Fame certificate for that member in this season" },
      { status: 404 }
    );
  }
  if (!membership || !holder) {
    return NextResponse.json(
      { error: "No Hall of Fame certificate for that member in this season" },
      { status: 404 }
    );
  }

  const season = await prisma.season.findUnique({ where: { slug: entry.seasonSlug }, select: { name: true } });
  const engravedName = displayHandle(holder.name);
  const engravedInRoster = entry.rosterJson.includes(engravedName);
  const memberName = displayHandle(holder.name);
  const memberSeat = engravedInRoster
    ? Math.max(1, entry.rosterJson.indexOf(engravedName) + 1)
    : Math.max(
        1,
        membership.group.members.findIndex((groupMember) => groupMember.userId === membership.userId) + 1
      );

  const input: CertificateInput = {
    seasonSlug: entry.seasonSlug,
    seasonName: season?.name ?? entry.seasonSlug,
    tier: entry.tier,
    tierLabel: tierInfo(entry.tier).label,
    rank: entry.rank,
    groupName: entry.groupName,
    rosterJson: entry.rosterJson,
    memberName,
    memberSeat,
    avgStars: entry.avgStars,
    issuedAt: entry.createdAt,
  };

  const pdf = await buildCertificatePdf(input);
  const filename = `gnostiri-certificate-${entry.seasonSlug}-${tierInfo(entry.tier).label.toLowerCase().replace(/\s+/g, "-")}-rank${entry.rank}.pdf`;

  return new NextResponse(Buffer.from(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
