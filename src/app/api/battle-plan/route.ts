import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";

const SUPPORTED_EXAMS = ["waec", "jamb", "neco"];
const MAX_ITEMS = 100;
const SESSIONS_PER_DAY = 2;

interface BattleItem {
  subject: string;
  topic: string;
  topicId: string;
  subjectSlug: string;
  topicSlug: string;
  examCode: string;
  date: string;
  duration: number;
  priority: "high" | "medium" | "low";
  kind: "study" | "quiz";
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function addDays(base: Date, n: number): string {
  const d = new Date(base);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/**
 * GET /api/battle-plan?exam=waec
 * Returns the active battle plan plus today's mission, countdown and progress.
 * Free for highschool — no premium gate.
 */
export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const exam = (req.nextUrl.searchParams.get("exam") || "waec").toLowerCase();
  if (!SUPPORTED_EXAMS.includes(exam)) {
    return NextResponse.json({ error: "Unsupported exam" }, { status: 404 });
  }

  const plan = await prisma.studyPlan.findFirst({
    where: { userId: user.id, domain: "highschool", generatedBy: "battle", isActive: true },
    orderBy: { updatedAt: "desc" },
  });
  if (!plan) return NextResponse.json({ plan: null });

  const items = (plan.items as unknown as BattleItem[]).filter(
    (i) => !i.examCode || i.examCode === exam
  );
  const topicIds = Array.from(new Set(items.map((i) => i.topicId)));
  const doneRows = topicIds.length
    ? await prisma.progress.findMany({
        where: {
          userId: user.id,
          domain: "highschool",
          entityType: "topic",
          entityId: { in: topicIds },
          status: "completed",
        },
        select: { entityId: true },
      })
    : [];
  const done = new Set(doneRows.map((r: { entityId: string }) => r.entityId));

  const today = todayKey();
  const examDate = plan.examDate ? new Date(plan.examDate) : null;
  const daysLeft = examDate
    ? Math.max(0, Math.ceil((examDate.getTime() - Date.now()) / 86400000))
    : null;

  const withStatus = items.map((i) => ({ ...i, done: done.has(i.topicId) }));
  const todayItems = withStatus.filter((i) => i.date <= today && !i.done);
  const upcomingMap = new Map<string, typeof withStatus>();
  for (const i of withStatus.filter((i) => i.date > today && !i.done)) {
    if (!upcomingMap.has(i.date)) upcomingMap.set(i.date, []);
    upcomingMap.get(i.date)?.push(i);
  }
  const upcoming = Array.from(upcomingMap.entries())
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .slice(0, 7)
    .map(([date, dayItems]) => ({ date, items: dayItems }));

  return NextResponse.json({
    plan: { id: plan.id, examDate: plan.examDate, updatedAt: plan.updatedAt },
    daysLeft,
    total: withStatus.length,
    doneCount: withStatus.filter((i) => i.done).length,
    today: todayItems,
    upcoming,
  });
}

/**
 * POST /api/battle-plan { examCode, examDate }
 * Auto-generates a day-by-day plan from real syllabus topics.
 * Weak topics (quiz accuracy < 60% or never attempted) get study + quiz
 * sessions first; everything else is spread across remaining days.
 */
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const examCode = String(body.examCode || "waec").toLowerCase();
  if (!SUPPORTED_EXAMS.includes(examCode)) {
    return NextResponse.json({ error: "Unsupported exam" }, { status: 400 });
  }
  const examDate = body.examDate ? new Date(body.examDate) : null;
  if (!examDate || Number.isNaN(examDate.getTime())) {
    return NextResponse.json({ error: "A valid exam date is required" }, { status: 400 });
  }

  const examination = await prisma.examination.findFirst({
    where: { code: examCode, domain: "highschool" },
  });
  if (!examination) {
    return NextResponse.json({ error: "Exam not found" }, { status: 404 });
  }

  // Syllabus tree: exam root -> subjects -> topics.
  const subjects: { id: string; title: string; children: { id: string; title: string }[] }[] =
    await prisma.topic.findMany({
    where: { domain: "highschool", parentId: examination.id },
    orderBy: { orderIndex: "asc" },
    include: {
      children: { orderBy: { orderIndex: "asc" } },
    },
  });
  const topics = subjects.flatMap((s) =>
    s.children.map((t) => ({
      subjectTitle: s.title,
      subjectSlug: s.id.replace(`${examination.code.toLowerCase()}-`, ""),
      topicId: t.id,
      topicSlug: t.id.replace(`${s.id}-`, ""),
      title: t.title,
    }))
  );
  if (!topics.length) {
    return NextResponse.json({ error: "No syllabus topics found for this exam yet" }, { status: 400 });
  }

  // Weakness map from quiz history.
  const topicIds = topics.map((t) => t.topicId);
  const attempts = await prisma.quizAttempt.findMany({
    where: { userId: user.id, domain: "highschool", topicId: { in: topicIds } },
    select: { topicId: true, score: true, maxScore: true },
  });
  const byTopic = new Map<string, { got: number; max: number }>();
  for (const a of attempts) {
    const cur = byTopic.get(a.topicId) ?? { got: 0, max: 0 };
    cur.got += a.score;
    cur.max += a.maxScore;
    byTopic.set(a.topicId, cur);
  }
  const accuracyOf = (id: string): number | null => {
    const s = byTopic.get(id);
    if (!s || s.max <= 0) return null;
    return s.got / s.max;
  };

  const days = Math.max(
    1,
    Math.ceil((examDate.getTime() - Date.now()) / 86400000)
  );
  const slots = Math.min(MAX_ITEMS, days * SESSIONS_PER_DAY);

  // Priority order: weak first, then new, then strong.
  const ranked = [...topics].sort((a, b) => {
    const rank = (id: string) => {
      const acc = accuracyOf(id);
      if (acc === null) return 1;
      if (acc < 0.6) return 0;
      return 2;
    };
    return rank(a.topicId) - rank(b.topicId);
  });

  const items: BattleItem[] = [];
  const now = new Date();
  let day = 0;
  let usedToday = 0;
  const push = (t: (typeof topics)[number], kind: "study" | "quiz", priority: BattleItem["priority"]) => {
    if (items.length >= slots) return;
    if (usedToday >= SESSIONS_PER_DAY) {
      day += 1;
      usedToday = 0;
    }
    items.push({
      subject: t.subjectTitle,
      topic: t.title,
      topicId: t.topicId,
      subjectSlug: t.subjectSlug,
      topicSlug: t.topicSlug,
      examCode,
      date: addDays(now, day),
      duration: 30,
      priority,
      kind,
    });
    usedToday += 1;
  };

  for (const t of ranked) {
    const acc = accuracyOf(t.topicId);
    if (acc !== null && acc < 0.6) {
      push(t, "study", "high");
      push(t, "quiz", "high");
    } else if (acc === null) {
      push(t, "study", "medium");
    } else {
      push(t, "study", "low");
    }
    if (items.length >= slots) break;
  }

  await prisma.studyPlan.updateMany({
    where: { userId: user.id, domain: "highschool", generatedBy: "battle", isActive: true },
    data: { isActive: false },
  });
  const plan = await prisma.studyPlan.create({
    data: {
      userId: user.id,
      domain: "highschool",
      items: items as unknown as object,
      examDate,
      generatedBy: "battle",
      isActive: true,
    },
  });

  return NextResponse.json(
    { plan: { id: plan.id, examDate: plan.examDate }, items: items.length, days },
    { status: 201 }
  );
}
