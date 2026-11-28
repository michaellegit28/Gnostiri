import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

// University AI lane — assessments. Server-owned; identity from the session.
// `config` holds the item set (empty until items are added); attempt/score land
// next. Fails gracefully (503) if the AI-lane tables aren't migrated yet.
const FIELDS = { id: true, title: true, courseId: true, createdAt: true } as const;
const SETUP_PENDING = "The AI lane is being set up — migrations pending.";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in to see your assessments" }, { status: 401 });
  try {
    const assessments = await prisma.aiAssessment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 100,
      select: FIELDS,
    });
    return NextResponse.json({ assessments });
  } catch {
    return NextResponse.json({ error: SETUP_PENDING }, { status: 503 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in to save assessments" }, { status: 401 });
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const p = (payload ?? {}) as Record<string, unknown>;
  const title = typeof p.title === "string" ? p.title.trim() : "";
  if (!title) return NextResponse.json({ error: "A title is required" }, { status: 400 });
  try {
    const assessment = await prisma.aiAssessment.create({
      data: {
        userId: user.id,
        title,
        courseId: typeof p.courseId === "string" ? p.courseId : null,
        config: {},
      },
      select: FIELDS,
    });
    return NextResponse.json({ assessment }, { status: 201 });
  } catch {
    return NextResponse.json({ error: SETUP_PENDING }, { status: 503 });
  }
}