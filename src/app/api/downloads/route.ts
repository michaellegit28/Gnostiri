import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { getEntitlements } from "@/lib/entitlements";
import { PLANS, planPrice } from "@/lib/plans";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const downloads = await prisma.download.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: { id: true, kind: true, slug: true, plan: true, createdAt: true },
  });
  return NextResponse.json({ downloads });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const entitlements = await getEntitlements(user);
  if (entitlements.features.downloadsPerMonth === 0) {
    return NextResponse.json(
      {
        error: "Downloads require a paid plan",
        paywall: true,
        feature: "downloads",
        plan: entitlements.plan,
        upgrade: {
          plan: "highschool",
          label: PLANS.highschool.label,
          price: planPrice("highschool", user.country),
        },
      },
      { status: 402 }
    );
  }

  const body = (await req.json().catch(() => null)) as { kind?: unknown; slug?: unknown } | null;
  const kind = typeof body?.kind === "string" ? body.kind : "";
  const slug = typeof body?.slug === "string" ? body.slug.trim().slice(0, 160) : "";
  if (!["course", "subject", "topic"].includes(kind) || !slug) {
    return NextResponse.json({ error: "kind and slug are required" }, { status: 400 });
  }

  const download = await prisma.download.create({
    data: {
      userId: user.id,
      kind,
      slug,
      plan: entitlements.plan,
    },
    select: { id: true, kind: true, slug: true, plan: true, createdAt: true },
  });
  return NextResponse.json({ download }, { status: 201 });
}
