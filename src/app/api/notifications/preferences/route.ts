import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { NOTIFICATION_TYPES, isValidQuietHours } from "@/lib/notify";

export const dynamic = "force-dynamic";

const KNOWN_TYPES: readonly string[] = NOTIFICATION_TYPES;

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const prefs = await prisma.notificationPreference.findUnique({ where: { userId: user.id } });
  return NextResponse.json({
    preferences: {
      emailOptIn: prefs?.emailOptIn ?? false,
      quietHours: prefs?.quietHours ?? null,
      mutedTypes: prefs?.mutedTypes ?? [],
    },
  });
}

// PUT replaces the caller's preference row (upsert, one row per user).
// Every supplied field is validated: 400 on anything malformed.
export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const issues: { path: string; message: string }[] = [];
  const data: { emailOptIn?: boolean; quietHours?: string | null; mutedTypes?: string[] } = {};

  if ("emailOptIn" in body) {
    if (typeof body.emailOptIn !== "boolean") issues.push({ path: "emailOptIn", message: "must be a boolean" });
    else data.emailOptIn = body.emailOptIn;
  }

  if ("quietHours" in body && body.quietHours !== null) {
    if (typeof body.quietHours !== "string" || !isValidQuietHours(body.quietHours)) {
      issues.push({ path: "quietHours", message: 'must be null or "HH:MM-HH:MM" (24h)' });
    } else {
      data.quietHours = body.quietHours;
    }
  } else if (body.quietHours === null) {
    data.quietHours = null;
  }

  if ("mutedTypes" in body) {
    const list = body.mutedTypes;
    if (!Array.isArray(list) || list.some((t: unknown) => typeof t !== "string" || !KNOWN_TYPES.includes(t))) {
      issues.push({ path: "mutedTypes", message: `must be an array of: ${KNOWN_TYPES.join(", ")}` });
    } else {
      data.mutedTypes = Array.from(new Set(list as string[]));
    }
  }

  if (issues.length > 0) return NextResponse.json({ error: "Invalid preferences", issues }, { status: 400 });
  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No preference fields supplied" }, { status: 400 });
  }

  const prefs = await prisma.notificationPreference.upsert({
    where: { userId: user.id },
    create: { userId: user.id, ...data },
    update: data,
  });

  return NextResponse.json({
    preferences: { emailOptIn: prefs.emailOptIn, quietHours: prefs.quietHours, mutedTypes: prefs.mutedTypes },
  });
}
