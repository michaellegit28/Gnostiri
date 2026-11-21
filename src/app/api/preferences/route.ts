import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import {
  DEFAULT_USER_PREFERENCES,
  userPreferenceSchema,
  type UserPreferenceInput,
} from "@/lib/user-preferences";

export const dynamic = "force-dynamic";

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
    return NextResponse.json({ preferences: preferences ?? DEFAULT_USER_PREFERENCES });
  } catch {
    return NextResponse.json(
      { error: "Synced preferences are not available yet. Try again after the preference migration is applied." },
      { status: 503 }
    );
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

  const preferences: UserPreferenceInput = parsed.data;
  try {
    const saved = await prisma.userPreference.upsert({
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
    return NextResponse.json({ preferences: saved });
  } catch {
    return NextResponse.json(
      { error: "Synced preferences are not available yet. Try again after the preference migration is applied." },
      { status: 503 }
    );
  }
}
