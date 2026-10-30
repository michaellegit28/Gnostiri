import Link from "next/link";
import prisma from "@/lib/db";
import { ArrowRight, CalendarDays, Swords, Timer } from "lucide-react";

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

const PRIORITY_CHIP: Record<BattleItem["priority"], string> = {
  high: "border-rose-500/30 bg-rose-500/10 text-rose-300",
  medium: "border-gold/30 bg-gold/10 text-gold",
  low: "border-teal-500/30 bg-teal-500/10 text-teal-300",
};

const PRIORITY_LABEL: Record<BattleItem["priority"], string> = {
  high: "Weak spot",
  medium: "New",
  low: "Review",
};

async function loadNextMission(userId: string): Promise<{
  hasPlan: boolean;
  mission: (BattleItem & { done: boolean }) | null;
  daysLeft: number | null;
} | null> {
  try {
    const plan = await prisma.studyPlan.findFirst({
      where: { userId, domain: "highschool", generatedBy: "battle", isActive: true },
      orderBy: { updatedAt: "desc" },
    });
    if (!plan) return { hasPlan: false, mission: null, daysLeft: null };

    const items = (plan.items as unknown as BattleItem[]).filter(
      (i) => !i.examCode || i.examCode === "jamb"
    );
    const topicIds = Array.from(new Set(items.map((i) => i.topicId)));
    const doneRows = topicIds.length
      ? await prisma.progress.findMany({
          where: {
            userId,
            domain: "highschool",
            entityType: "topic",
            entityId: { in: topicIds },
            status: "completed",
          },
          select: { entityId: true },
        })
      : [];
    const done = new Set(doneRows.map((r: { entityId: string }) => r.entityId));

    const today = new Date().toISOString().slice(0, 10);
    const withStatus = items.map((i) => ({ ...i, done: done.has(i.topicId) }));
    const next = withStatus.find((i) => i.date <= today && !i.done) ?? null;

    const examDate = plan.examDate ? new Date(plan.examDate) : null;
    const daysLeft = examDate
      ? Math.max(0, Math.ceil((examDate.getTime() - Date.now()) / 86400000))
      : null;

    return { hasPlan: true, mission: next, daysLeft };
  } catch {
    return null;
  }
}

export default async function BattlePlanHero({ userId }: { userId: string }) {
  const data = await loadNextMission(userId);
  const hasPlan = data?.hasPlan ?? false;
  const mission = data?.mission ?? null;
  const heading = mission
    ? mission.topic
    : hasPlan
      ? "All clear for today"
      : "Build your battle plan";
  const cta = hasPlan ? "Resume Battle Plan" : "Build your battle plan";

  return (
    <section
      aria-label="Today's battle plan"
      className="relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 p-6 shadow-lg shadow-black/20 md:p-8"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-gold/20 blur-3xl animate-pulse"
      />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 space-y-4">
          <p className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">
            <Swords className="h-4 w-4" aria-hidden />
            {hasPlan ? "Today's mission" : "Exam battle plan"}
          </p>
          <h2 className="font-serif text-2xl font-bold leading-tight text-slate-100 md:text-3xl">
            {heading}
          </h2>
          {mission ? (
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-400">
              <span className="text-slate-300">{mission.subject}</span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4 text-gold" aria-hidden />
                {mission.kind === "quiz" ? "Practice" : "Study"}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Timer className="h-4 w-4 text-gold" aria-hidden />
                {mission.duration} min
              </span>
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.15em] ${PRIORITY_CHIP[mission.priority]}`}
              >
                {PRIORITY_LABEL[mission.priority]}
              </span>
            </div>
          ) : (
            <p className="max-w-xl text-sm text-slate-400">
              {hasPlan
                ? "Every mission scheduled for today is done — rest, or pull tomorrow forward."
                : "Pick your exam date and the real syllabus becomes a day-by-day mission — weak topics first."}
            </p>
          )}
          {data?.daysLeft !== null && data?.daysLeft !== undefined && (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              {data.daysLeft === 0 ? "Exam is today" : `${data.daysLeft} days to exam`}
            </p>
          )}
        </div>
        <Link
          href="/battle-plan"
          className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          {cta}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
