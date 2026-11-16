import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

// Runtime auth health probe — "green build ≠ working site" (AGENTS.md rule 5).
// Deploys of the auth stack are verified by curling this route; a missing
// DB column or an unreachable Supabase project fails LOUDLY here instead of
// silently rendering every learner as signed out. Never leaks values.
export async function GET() {
  const checks: Record<string, string> = {};

  checks.env = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ? "configured"
    : "missing-env";

  // The key must be accepted by the GoTrue auth endpoints this app calls.
  // A no-bearer /user request is answered 401-with-code when the key is
  // valid (healthy anonymous answer) vs the API-key middleware's
  // "Invalid API key" when the key belongs to another/rotated project.
  checks.supabaseKey = "unreachable";
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (url && key) {
      const res = await fetch(`${url}/auth/v1/user`, {
        headers: { apikey: key },
        cache: "no-store",
      });
      const body = await res.text();
      checks.supabaseKey = body.includes("Invalid API key") ? "rejected" : "accepted";
    }
  } catch {
    checks.supabaseKey = "unreachable";
  }

  checks.userColumn = "missing";
  let dbErrorCode = "";
  try {
    await prisma.user.findFirst({ select: { supabaseUid: true } });
    checks.userColumn = "supabaseUid";
  } catch (error) {
    // Surface the Prisma code so a missing migration (P2022) is never
    // confused with an unreachable MIGRATED-ELSEWHERE database (P1001+).
    dbErrorCode =
      error && typeof error === "object" && "code" in error
        ? String((error as { code: unknown }).code)
        : "unknown";
    checks.userColumn = `error:${dbErrorCode}`;
  }

  const healthy =
    checks.env === "configured" &&
    checks.supabaseKey === "accepted" &&
    checks.userColumn === "supabaseUid";

  return NextResponse.json(
    { healthy, checks, ...(dbErrorCode ? { dbErrorCode } : {}), service: "auth" },
    { status: healthy ? 200 : 503 }
  );
}