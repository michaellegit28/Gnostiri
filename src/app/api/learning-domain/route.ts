import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { DEFAULT_LEARNING_DOMAIN, normalizeLearningDomain, type LearningDomain } from "@/lib/learning-domain";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  domain: z.enum(["highschool", "university"]),
});

/**
 * The student's learning lane — High School or University.
 *
 * This is a product IA choice (what the nav and study hubs show), not an
 * entitlement: subscriptions still gate premium content per domain in
 * src/lib/entitlements.ts. Discovery stays shared, so it is not a lane here.
 */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: { currentDomain: true },
    });
    const domain: LearningDomain = normalizeLearningDomain(profile?.currentDomain) ?? DEFAULT_LEARNING_DOMAIN;
    return NextResponse.json({ domain });
  } catch (error) {
    console.error("Could not load learning domain", error);
    return NextResponse.json({ error: "Could not load learning domain" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid learning domain" }, { status: 400 });
  }

  const domain: LearningDomain = parsed.data.domain;
  try {
    await prisma.profile.upsert({
      where: { userId: user.id },
      update: { currentDomain: domain },
      create: { userId: user.id, currentDomain: domain },
    });
    return NextResponse.json({ domain });
  } catch (error) {
    console.error("Could not save learning domain", error);
    return NextResponse.json({ error: "Could not save learning domain" }, { status: 500 });
  }
}