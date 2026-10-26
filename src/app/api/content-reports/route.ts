import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { contentReportSchema } from "@/lib/content-reports";

export const dynamic = "force-dynamic";

// Learner content report: POST a problem spotted on a lesson/study/item page.
// Signed-in users only; stored as 'open' for the admin triage queue.
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });

  const parsed = contentReportSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid report", issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })) },
      { status: 400 }
    );
  }

  const { domain, targetType, targetId, targetUrl, targetTitle, category, detail } = parsed.data;

  const report = await prisma.contentReport.create({
    data: {
      domain,
      targetType,
      targetId,
      targetUrl,
      targetTitle: targetTitle ?? null,
      category,
      detail,
      reporterId: user.id,
      reporterEmail: user.email,
      status: "open",
    },
    select: { id: true },
  });

  return NextResponse.json({ ok: true, id: report.id }, { status: 201 });
}
