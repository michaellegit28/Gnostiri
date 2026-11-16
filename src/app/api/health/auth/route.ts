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
  let dbErrorDetail = "";
  try {
    await prisma.$queryRawUnsafe("SELECT 1");
    checks.userColumn = "db-reachable";
    try {
      await prisma.user.findFirst({ select: { supabaseUid: true } });
      checks.userColumn = "supabaseUid";
    } catch (schemaError) {
      // Schema-level (migration) failure — vs the connectivity answer above.
      dbErrorCode =
        schemaError && typeof schemaError === "object" && "code" in schemaError
          ? String((schemaError as { code: unknown }).code)
          : schemaError instanceof Error
            ? schemaError.message.split("\n")[0].slice(0, 180)
            : "unknown";
      checks.userColumn = `schema-error:${dbErrorCode.slice(0, 60)}`;
    }
  } catch (connectError) {
    dbErrorCode =
      connectError && typeof connectError === "object" && "code" in connectError
        ? String((connectError as { code: unknown }).code)
        : "unknown";
    // Connectivity failure. Truncated only; Prisma error text never carries
    // credentials — it names the host at most, which is already public.
    dbErrorDetail =
      connectError instanceof Error
        ? connectError.message.replace(/\s+/g, " ").slice(0, 180)
        : "unreachable";
    checks.userColumn = "db-unreachable";
  }

  const healthy =
    checks.env === "configured" &&
    checks.supabaseKey === "accepted" &&
    checks.userColumn === "supabaseUid";

  return NextResponse.json(
    {
      healthy,
      checks,
      ...(dbErrorCode && dbErrorCode !== "unknown" ? { dbErrorCode } : {}),
      ...(dbErrorDetail ? { dbErrorDetail } : {}),
      service: "auth",
    },
    { status: healthy ? 200 : 503 }
  );
}