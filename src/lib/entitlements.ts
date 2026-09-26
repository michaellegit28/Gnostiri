import { AppDomain } from "@prisma/client";
import prisma from "@/lib/db";

export async function hasPremiumAccess(userId: string, domain: AppDomain = "university") {
  const subscription = await prisma.subscription.findFirst({
    where: { userId, tier: "premium", status: "active", OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
    orderBy: { updatedAt: "desc" },
  });
  return !!subscription && (domain !== "university" || subscription.domainAccess.includes("university"));
}
