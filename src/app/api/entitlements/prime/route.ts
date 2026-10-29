import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { hasPremiumAccess } from "@/lib/entitlements";

export const dynamic = "force-dynamic";

// GET /api/entitlements/prime — the Prime badge's status: premium + consecutive
// months of tenure (displayed as "Prime · N months" across the app shell).
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ premium: false, months: 0 }, { status: 200 });
  const premium = await hasPremiumAccess(user.id, "highschool");
  let months = 0;
  if (premium) {
    const first = await prisma.subscription.findFirst({
      where: { userId: user.id, tier: "premium", status: "active" },
      orderBy: { createdAt: "asc" },
      select: { createdAt: true },
    });
    if (first) {
      months = Math.floor((Date.now() - new Date(first.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 30.44));
    }
  }
  return NextResponse.json({ premium, months });
}
