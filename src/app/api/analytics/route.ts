import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

const EVENT_TYPES = [
  "session_start",
  "mission_viewed",
  "mission_completed",
  "question_answered",
  "streak_incremented",
  "paywall_viewed",
] as const;

type EventType = (typeof EVENT_TYPES)[number];

const SAFE_META_KEYS = new Set([
  "source",
  "feature",
  "plan",
  "kind",
  "subject",
  "durationSeconds",
  "score",
  "correct",
  "count",
  "target",
  "path",
]);

function eventType(value: unknown): EventType | null {
  return typeof value === "string" && (EVENT_TYPES as readonly string[]).includes(value)
    ? (value as EventType)
    : null;
}

function safeMeta(value: unknown): Record<string, string | number | boolean> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const meta: Record<string, string | number | boolean> = {};
  for (const [key, entry] of Object.entries(value as Record<string, unknown>).slice(0, 12)) {
    if (!SAFE_META_KEYS.has(key)) continue;
    if (typeof entry === "boolean") meta[key] = entry;
    else if (typeof entry === "number" && Number.isFinite(entry)) meta[key] = entry;
    else if (typeof entry === "string") meta[key] = entry.slice(0, 120);
  }
  return meta;
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as { type?: unknown; meta?: unknown } | null;
  const type = eventType(body?.type);
  if (!type) return NextResponse.json({ error: "Invalid analytics event" }, { status: 400 });

  const user = await getCurrentUser();
  if (user) {
    let optedOut = false;
    try {
      const preferences = await prisma.userPreference.findUnique({
        where: { userId: user.id },
        select: { analyticsOptOut: true },
      });
      optedOut = preferences?.analyticsOptOut ?? false;
    } catch {
      optedOut = false;
    }
    if (optedOut) return NextResponse.json({ accepted: true, stored: false });
  }

  const existingAnonId = req.cookies.get("gnostiri_anon")?.value;
  const anonId = existingAnonId || randomUUID();
  const meta = safeMeta(body?.meta);

  await prisma.analyticsEvent.create({
    data: {
      userId: user?.id ?? null,
      anonId: user ? null : anonId,
      type,
      meta,
    },
  });

  const response = NextResponse.json({ accepted: true, stored: true }, { status: 202 });
  if (!existingAnonId && !user) {
    response.cookies.set("gnostiri_anon", anonId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 180,
      path: "/",
    });
  }
  return response;
}
