import { AppDomain } from "@prisma/client";
import prisma from "@/lib/db";
import { UNIVERSITY_OPEN } from "@/lib/access";
import { isBenefactor } from "@/lib/launch";
import { isAddonId, isPlanId, type AddonId, type PlanId } from "@/lib/plans";

export interface EntitlementFeatures {
  aiTutor: boolean;
  aiMarking: boolean;
  pdfIntelligence: boolean;
  voiceTranscription: boolean;
  downloadsPerMonth: number | null;
  privateSection: boolean;
  requestCourses: boolean;
  discoveryAI: boolean;
  competitionEntriesPerWeek: number | null;
  masteryFeedback: boolean;
}

export interface Entitlements {
  plan: PlanId;
  addons: AddonId[];
  features: EntitlementFeatures;
}

function featuresFor(plan: PlanId, addons: AddonId[]): EntitlementFeatures {
  const paid = plan !== "free";
  const productivityPack = addons.includes("ai-productivity-pack");
  return {
    aiTutor: paid,
    aiMarking: plan === "university" || plan === "prime",
    pdfIntelligence: productivityPack,
    voiceTranscription: productivityPack,
    downloadsPerMonth: paid ? null : 0,
    privateSection: paid,
    requestCourses: paid,
    discoveryAI: plan === "discovery" || plan === "prime",
    competitionEntriesPerWeek: paid ? null : 1,
    masteryFeedback: paid,
  };
}

export async function getEntitlements(user: { id: string } | string): Promise<Entitlements> {
  const userId = typeof user === "string" ? user : user.id;
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: "active",
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
    orderBy: { updatedAt: "desc" },
    select: { plan: true, tier: true, addons: true },
  });

  let plan: PlanId = "free";
  if (subscription) {
    if (isPlanId(subscription.plan)) plan = subscription.plan;
    else if (subscription.tier === "premium") plan = "prime";
  }
  const addons = (subscription?.addons ?? []).filter(isAddonId);
  return { plan, addons, features: featuresFor(plan, addons) };
}

export async function hasPremiumAccess(userId: string, domain: AppDomain = "university") {
  if (UNIVERSITY_OPEN) return true;
  if (await isBenefactor(userId)) return true;
  const entitlements = await getEntitlements(userId);
  if (entitlements.plan === "free") return false;
  if (domain === "university") return entitlements.plan === "university" || entitlements.plan === "prime";
  if (domain === "highschool") return entitlements.plan === "highschool" || entitlements.plan === "prime";
  return entitlements.plan === "discovery" || entitlements.plan === "prime";
}
