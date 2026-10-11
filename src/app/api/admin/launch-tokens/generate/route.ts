import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { mintLaunchTokens, TokenTier } from "@/lib/launch";

export const dynamic = "force-dynamic";

// POST /api/admin/launch-tokens/generate?secret=<REVALIDATE_SECRET>
// Owner tool: mint launch tokens under the hard caps (220 total, max 20
// benefactor). Body: { count, country, tier, note? }. Returns the minted
// codes + running totals. GET returns stats only. Guarded by the server
// secret — same trust model as the seeder routes; rotate at completion.

async function authorized(req: NextRequest): Promise<boolean> {
  const secret = req.nextUrl.searchParams.get("secret");
  return Boolean(secret && process.env.REVALIDATE_SECRET && secret === process.env.REVALIDATE_SECRET);
}

export async function GET(req: NextRequest) {
  if (!(await authorized(req))) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  const grouped = await prisma.launchToken.groupBy({ by: ["country", "tier"], _count: { _all: true } });
  const used = await prisma.launchToken.count({ where: { usedById: { not: null } } });
  const total = await prisma.launchToken.count();
  return NextResponse.json({
    total,
    used,
    remaining: total - used,
    byCountryTier: grouped.map((g) => ({ country: g.country, tier: g.tier, count: g._count._all })),
  });
}

export async function POST(req: NextRequest) {
  if (!(await authorized(req))) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  const body = await req.json().catch(() => null);
  const count = Number(body?.count);
  const country = String(body?.country || "");
  const tier: TokenTier = body?.tier === "benefactor" ? "benefactor" : "standard";
  const note = body?.note ? String(body.note).slice(0, 200) : undefined;
  if (!Number.isInteger(count) || count < 1 || count > 200) {
    return NextResponse.json({ error: "count must be 1–200" }, { status: 400 });
  }
  if (!/^[A-Za-z]{2,3}$/.test(country)) {
    return NextResponse.json({ error: "country must be a 2–3 letter code, e.g. NG" }, { status: 400 });
  }

  const result = await mintLaunchTokens({ count, country, tier, note });
  return NextResponse.json(result, { status: result.minted.length > 0 ? 200 : 409 });
}
