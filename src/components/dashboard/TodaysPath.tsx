import Link from "next/link";
import prisma from "@/lib/db";
import { ArrowRight, Check, CircleDot, Clock, Flame, MapPin } from "lucide-react";

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

type StopState = "done" | "current" | "overdue" | "planned";

const PRIORITY_LABEL: Record<BattleItem["priority"], string> = {
  high: "Weak spot",
  medium: "New",
  low: "Review",
};

function isBattleItem(value: unknown): value is BattleItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<BattleItem>;
  return (
    typeof item.subject === "string" &&
    typeof item.topic === "string" &&
    typeof item.topicId === "string" &&
    typeof item.subjectSlug === "string" &&
    typeof item.topicSlug === "string" &&
    typeof item.examCode === "string" &&
    typeof item.date === "string" &&
    typeof item.duration === "number" &&
    (item.priority === "high" || item.priority === "medium" || item.priority === "low") &&
    (item.kind === "study" || item.kind === "quiz")
  );
}

function parseBattleItems(value: unknown): BattleItem[] {
  if (!Array.isArray(value)) return [];
  return (value as unknown[])
    .filter(isBattleItem)
    .filter((item) => !item.examCode || item.examCode === "jamb");
}

function dateKey(base: Date, offset: number) {
  const date = new Date(base);
  date.setUTCDate(date.getUTCDate() + offset);
  return date.toISOString().slice(0, 10);
}

function stopClass(state: StopState) {
  if (state === "done") return "border-success/40 bg-success/10";
  if (state === "current") return "border-primary/60 bg-primary/10";
  if (state === "overdue") return "border-warning/50 bg-warning/10";
  return "border-line bg-bg";
}

function stopTextClass(state: StopState) {
  if (state === "done") return "text-emerald-200";
  if (state === "current") return "text-electric-text";
  if (state === "overdue") return "text-amber-200";
  return "text-muted";
}

function stopStateLabel(state: StopState) {
  if (state === "done") return "Topic complete";
  if (state === "current") return "Current stop";
  if (state === "overdue") return "Overdue";
  return "Planned";
}

export default async function TodaysPath({ userId }: { userId: string }) {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const yesterday = dateKey(now, -1);

  let plan: { items: unknown; examDate: Date | null } | null = null;
  let doneTopicIds = new Set<string>();
  let activeStreak = 0;
  let loadFailed = false;

  try {
    const [planRow, profile] = await Promise.all([
      prisma.studyPlan.findFirst({
        where: { userId, domain: "highschool", generatedBy: "battle", isActive: true },
        orderBy: { updatedAt: "desc" },
        select: { items: true, examDate: true },
      }),
      prisma.profile.findUnique({
        where: { userId },
        select: { streak: true, lastActive: true },
      }),
    ]);
    plan = planRow;
    const lastActiveDay = profile?.lastActive?.toISOString().slice(0, 10);
    activeStreak =
      profile && (lastActiveDay === today || lastActiveDay === yesterday) ? profile.streak : 0;

    if (planRow) {
      const items = parseBattleItems(planRow.items);
      const topicIds = Array.from(new Set(items.map((item) => item.topicId)));
      if (topicIds.length) {
        const completed = await prisma.progress.findMany({
          where: {
            userId,
            domain: "highschool",
            entityType: "topic",
            entityId: { in: topicIds },
            status: "completed",
          },
          select: { entityId: true },
        });
        doneTopicIds = new Set(completed.map((row) => row.entityId));
      }
    }
  } catch {
    plan = null;
    loadFailed = true;
  }

  const items = parseBattleItems(plan?.items);
  const withStatus = items.map((item) => ({ ...item, done: doneTopicIds.has(item.topicId) }));
  const overdue = withStatus.filter((item) => item.date < today && !item.done);
  const todayItems = withStatus.filter((item) => item.date === today);
  const currentToday = todayItems.find((item) => !item.done) ?? null;
  const mission = currentToday ?? overdue[0] ?? null;
  const completedToday = todayItems.length > 0 && todayItems.every((item) => item.done);
  const hasFuture = withStatus.some((item) => item.date > today);
  const noStopScheduled = Boolean(plan && todayItems.length === 0 && overdue.length === 0 && hasFuture);
  // Home shows today's stops only — overdue items collapse into a single
  // catch-up banner (one gentle prompt, not a wall of 42 rows).
  const visibleStops = todayItems
    .filter((item, index, stops) => stops.findIndex((candidate) => candidate.topicId === item.topicId) === index)
    .slice(0, 3);
  const daysLeft = plan?.examDate
    ? Math.max(0, Math.ceil((new Date(plan.examDate).getTime() - now.getTime()) / 86400000))
    : null;

  const heading = loadFailed
    ? "Today's path is unavailable"
    : mission
      ? mission.topic
      : completedToday
        ? "All clear for today"
        : noStopScheduled
          ? "No stop scheduled today"
          : plan && withStatus.length > 0 && !hasFuture
            ? "Your recorded path is complete"
            : plan
              ? "No active stop is recorded"
              : "Build your battle plan";
  const cta = loadFailed ? null : plan ? "View full plan" : "Build your plan";

  return (
    <section
      aria-labelledby="todays-path-title"
      className="gn-card relative overflow-hidden rounded-2xl border border-line bg-surface p-5 md:p-7"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-electric-text">
            Study roadmap
          </p>
          <h2 id="todays-path-title" className="mt-1 font-serif text-2xl font-bold text-ink md:text-3xl">
            Today&apos;s path
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            {mission
              ? `${mission.subject} · ${mission.kind === "quiz" ? "Practice" : "Study"} · ${mission.duration} min · ${PRIORITY_LABEL[mission.priority]}`
              : loadFailed
                ? "We could not load your real schedule. Nothing is inferred while the path is unavailable."
                : completedToday
                  ? "Every mission scheduled for today is done — rest, or pull tomorrow forward."
                  : noStopScheduled
                    ? "Your next recorded stop is on a later day. The full week is shown below."
                    : plan && withStatus.length > 0 && !hasFuture
                      ? "Every recorded stop on your path is complete."
                      : plan
                        ? "No active stop is recorded for today."
                        : "Choose an exam date and your real syllabus becomes a week-by-week path."}
          </p>
          {!loadFailed && plan && activeStreak === 0 ? (
            <p className="mt-2 text-xs text-subtle">
              Finish today&apos;s stop to start your streak — one session is all it takes.
            </p>
          ) : null}
        </div>
        <div className="flex items-center gap-3">
          {activeStreak > 0 ? (
            <span className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-warning/40 bg-warning/10 px-3 text-sm font-semibold text-amber-200">
              <Flame className="h-4 w-4" aria-hidden />
              {activeStreak} day streak
            </span>
          ) : null}
          {cta ? (
            <Link
              href="/battle-plan"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {cta}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          ) : null}
        </div>
      </div>

      {daysLeft !== null ? (
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
          {daysLeft === 0 ? "Exam is today" : `${daysLeft} days to exam`}
        </p>
      ) : null}

      {loadFailed ? (
        <div role="status" className="mt-6 rounded-xl border border-warning/40 bg-warning/10 px-5 py-6 text-center">
          <MapPin className="mx-auto h-6 w-6 text-amber-200" aria-hidden />
          <p className="mt-3 font-semibold text-ink">Today&apos;s path is temporarily unavailable</p>
          <p className="mt-1 text-sm text-muted">No schedule or completion state is inferred after a failed read.</p>
        </div>
      ) : !plan ? (
        <div className="mt-6 rounded-xl border border-line bg-bg px-5 py-6 text-center">
          <MapPin className="mx-auto h-6 w-6 text-electric-text" aria-hidden />
          <p className="mt-3 font-semibold text-ink">Your path starts with a battle plan</p>
          <p className="mt-1 text-sm text-muted">No schedule is shown until real exam dates and syllabus topics are available.</p>
        </div>
      ) : (
        <>
          {overdue.length > 0 ? (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-warning/40 bg-warning/10 px-5 py-4">
              <p className="text-sm font-semibold text-amber-100">
                You have {overdue.length} {overdue.length === 1 ? "task" : "tasks"} to catch up on.
              </p>
              <Link
                href="/battle-plan"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-warning/50 px-4 text-sm font-semibold text-amber-200 transition-colors hover:text-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Review overdue
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          ) : null}

          <div className="mt-5 border-t border-line pt-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-semibold text-ink">
                {completedToday ? "Today is complete" : "Today's stops"}
              </h3>
            </div>

            {visibleStops.length > 0 ? (
              <ol className="mt-3 space-y-3">
                {visibleStops.map((item, index) => {
                  const state: StopState = item.done
                    ? "done"
                    : item.date < today
                      ? "overdue"
                      : currentToday?.topicId === item.topicId
                        ? "current"
                        : "planned";
                  const href = `/highschool/${item.examCode || "jamb"}/${item.subjectSlug}/${item.topicSlug}/${item.kind === "quiz" ? "quiz" : "study"}`;
                  return (
                    <li key={`${item.topicId}-${item.kind}`}>
                      <Link
                        href={href}
                        aria-current={state === "current" ? "step" : undefined}
                        className={`flex min-h-[56px] items-center gap-3 rounded-xl border px-4 py-3 transition-colors hover:border-primary/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${stopClass(state)}`}
                      >
                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line-strong ${stopTextClass(state)}`}>
                          {state === "done" ? (
                            <Check className="h-4 w-4" aria-hidden />
                          ) : state === "current" ? (
                            <CircleDot className="h-4 w-4 motion-safe:animate-pulse" aria-hidden />
                          ) : (
                            <span className="text-xs font-bold">{index + 1}</span>
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className={`block truncate text-sm font-semibold ${stopTextClass(state)}`}>
                            {item.topic}
                          </span>
                          <span className="mt-0.5 block text-xs text-muted">
                            {item.subject} · {item.kind === "quiz" ? "Practice" : "Study"} · {item.duration} min · {stopStateLabel(state)}
                          </span>
                        </span>
                        <Clock className="h-4 w-4 shrink-0 text-muted" aria-hidden />
                      </Link>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <p className="mt-3 rounded-xl border border-line bg-bg px-4 py-4 text-sm text-muted">
                No stop is recorded for today. Check the battle plan for the next scheduled session.
              </p>
            )}
          </div>
        </>
      )}
    </section>
  );
}
