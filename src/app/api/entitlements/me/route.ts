import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server-auth";
import { getEntitlements } from "@/lib/entitlements";
import { PLANS, planPrice } from "@/lib/plans";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const entitlements = await getEntitlements(user);
  return NextResponse.json({
    entitlements,
    plan: PLANS[entitlements.plan],
    price: planPrice(entitlements.plan, user.country),
  });
}
