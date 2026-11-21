import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import {
  DEFAULT_USER_PREFERENCES,
  normalizeUserPreferences,
  userPreferenceSchema,
} from "@/lib/user-preferences";

export const dynamic = "force-dynamic";

function storageUnavailable(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error.code === "P2021" || error.code === "P2022")
  );
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  try {
    const preferences = await prisma.userPreference.findUnique({
      where: { userId: user.id },
      select: {
        country: true,
        examStandard: true,
        dailyGoalMinutes: true,
        srsEnabled: true,
        analyticsOptOut: true,
      },
    });
    return NextResponse.json({
      preferences: normalizeUserPreferences(preferences ?? DEFAULT_USER_PREFERENCES, user.country),
    });
  } catch (error) {
    if (storageUnavailable(error)) {
      return NextResponse.json(
        { error: "Synced preferences are not available yet. Try again after the preference migration is applied." },
        { status: 503 }
      );
    }
    console.error("Could not load user preferences", error);
    return NextResponse.json({ error: "Could not load preferences" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = userPreferenceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid preferences",
        issues: parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 }
    );
  }

  const preferences = parsed.data;
  try {
    const saved = await prisma.$transaction(async (tx) => {
      const row = await tx.userPreference.upsert({
        where: { userId: user.id },
        create: { userId: user.id, ...preferences },
        update: preferences,
        select: {
          country: true,
          examStandard: true,
          dailyGoalMinutes: true,
          srsEnabled: true,
          analyticsOptOut: true,
        },
      });
      await tx.user.update({
        where: { id: user.id },
        data: { country: preferences.country },
      });
      return row;
    });
    return NextResponse.json({ preferences: normalizeUserPreferences(saved, preferences.country) });
  } catch (error) {
    if (storageUnavailable(error)) {
      return NextResponse.json(
        { error: "Synced preferences are not available yet. Try again after the preference migration is applied." },
        { status: 503 }
      );
    }
    console.error("Could not save user preferences", error);
    return NextResponse.json({ error: "Could not save preferences" }, { status: 500 });
  }
}
