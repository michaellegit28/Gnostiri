import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { requireAdmin } from "@/lib/admin-auth";
import { displayHandle, tierInfo } from "@/lib/ranking";
import { buildCertificatePdf, type CertificateInput } from "@/lib/certificate";

export const dynamic = "force-dynamic";

// GET /api/ranking/certificate?season=<slug>&member=<userId|displayName>[&tier=<n>]
//
// The verified season certificate. A signed-in member downloads the PDF for
// the Hall of Fame entry THEY are engraved on; an admin can fetch anyone's.
// Nobody else ever gets bytes: this route returns a 403 (not a 200) for a
// stranger, and a 404 with a plain JSON error when no entry exists for that
// member in that season — a fake certificate is never minted.
//
// `member` accepts a user id (exact) or a display name. The roster stores
// DISPLAY NAMES ONLY, so the row is matched through the User row's name, and
// a name shared by several users resolves to all of them (any of them may
// fetch their own certificate).

const MAX_CERTIFICATE_ENTRIES = 500;

/** The repo's admin gate, minus its "no allowlist configured = everyone"
 *  convenience: a certificate belongs to its owner, so only an explicitly
 *  allowlisted admin may fetch someone else's. */
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

  if (!seasonSlug || !member) {
    return NextResponse.json({ error: "season and member are required" }, { status: 400 });
  }

  // Resolve the requested member: exact user id first, then display name.
  const byId = await prisma.user.findUnique({ where: { id: member }, select: { id: true, name: true } });
  const holders = byId
    ? [byId]
    : await prisma.user.findMany({ where: { name: member }, select: { id: true, name: true }, orderBy: { createdAt: "asc" } });
  if (holders.length === 0) {
    return NextResponse.json({ error: "No member found for that name or id" }, { status: 404 });
  }

  // Authorise: the caller IS one of the holders, or an allowlisted admin.
  if (!holders.some((holder) => holder.id === user.id) && !(await isAllowlistedAdmin())) {
    return NextResponse.json({ error: "This certificate belongs to another member" }, { status: 403 });
  }

  // The engraved entry: this season, this tier (when given), roster carries
  // the requester's display name. A member sits in one group per season, so
  // the best-placed entry wins.
  const entries = await prisma.hallOfFameEntry.findMany({
    where: { seasonSlug },
    orderBy: { rank: "asc" },
    take: MAX_CERTIFICATE_ENTRIES,
  });
  const tierFilter = tierParam === null ? null : Number(tierParam);
  const candidates = entries.filter((entry) => {
    if (tierFilter !== null && entry.tier !== tierFilter) return false;
    return holders.some((holder) => entry.rosterJson.includes(displayHandle(holder.name)));
  });
  const entry = candidates[0];

  if (!entry) {
    // No engraving, no certificate — never a fabricated one.
    return NextResponse.json({ error: "No Hall of Fame certificate for that member in this season" }, { status: 404 });
  }

  const season = await prisma.season.findUnique({ where: { slug: seasonSlug }, select: { name: true } });
  const memberName = displayHandle(holders.find((h) => entry.rosterJson.includes(displayHandle(h.name)))?.name ?? holders[0].name);

  const input: CertificateInput = {
    seasonSlug: entry.seasonSlug,
    seasonName: season?.name ?? entry.seasonSlug,
    tier: entry.tier,
    tierLabel: tierInfo(entry.tier).label,
    rank: entry.rank,
    groupName: entry.groupName,
    rosterJson: entry.rosterJson,
    memberName,
    memberSeat: entry.rosterJson.indexOf(memberName) + 1,
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
