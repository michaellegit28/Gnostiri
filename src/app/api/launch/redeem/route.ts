import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { redeemLaunchToken, signLaunchCookie } from "@/lib/launch";

export const dynamic = "force-dynamic";

// POST /api/launch/redeem — consumes a launch token for the signed-in user.
// Country-bound and single-use (atomic claim). On success the signed launch
// cookie is set; middleware trusts only this signature.
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in first, then redeem your token." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const code = String(body?.code || "");
  if (!code) return NextResponse.json({ error: "Enter your token code." }, { status: 400 });

  const result = await redeemLaunchToken(user.id, user.country, code);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });

  const response = NextResponse.json({ ok: true, tier: result.tier });
  response.cookies.set("__launch", signLaunchCookie(user.id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 60, // 60 days — the middleware + LAUNCH_ENDS_AT decide actual access
  });
  return response;
}
