import Link from "next/link";
import prisma from "@/lib/db";
import { ArrowRight, Clock, Flame, Target } from "lucide-react";

interface StatWidget {
  key: string;
  label: string;
  value: string;
  hint: string;
  icon: typeof Flame;
  accent: string;
  border: string;
  shadowToken: "gold" | "cyan" | "primary";
}

type StatsSnapshot =
  | { status: "ok"; streak: number; accuracy: number | null; minutes: number | null }
  | { status: "error" };

async function loadStats(userId: string): Promise<StatsSnapshot> {
  try {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const today = new Date().toISOString().slice(0, 10);
    const [profile, attempts, sessions, tasks] = await Promise.all([
      prisma.profile.findUnique({
        where: { userId },
        select: { streak: true, lastActive: true },
      }),
      prisma.quizAttempt.aggregate({
        where: { userId, maxScore: { gt: 0 } },
        _sum: { score: true, maxScore: true, durationSeconds: true },
        _count: { _all: true },
      }),
      prisma.assessmentSession.aggregate({
        where: { userId },
        _sum: { score: true, maxScore: true },
        _count: { _all: true },
      }),
      prisma.studyTask.aggregate({
        where: { userId, status: "done" },
        _sum: { minutes: true },
        _count: { _all: true },
      }),
    ]);

    const lastActiveDay = profile?.lastActive?.toISOString().slice(0, 10);
    const streak =
      profile && (lastActiveDay === today || lastActiveDay === yesterday) ? profile.streak : 0;

    const scoredRows = attempts._count._all + sessions._count._all;
    const gotRight = (attempts._sum.score ?? 0) + (sessions._sum.score ?? 0);
    const outOf = (attempts._sum.maxScore ?? 0) + (sessions._sum.maxScore ?? 0);
    const accuracy = scoredRows > 0 && outOf > 0 ? Math.round((gotRight / outOf) * 100) : null;

    const sessionRows = attempts._count._all + tasks._count._all;
    const seconds = attempts._sum.durationSeconds ?? 0;
    const taskMinutes = tasks._sum.minutes ?? 0;
    const minutes = sessionRows > 0 ? Math.round(seconds / 60) + taskMinutes : null;

    return { status: "ok", streak, accuracy, minutes };
  } catch {
    return { status: "error" };
  }
}

export default async function StatsRow({ userId }: { userId: string }) {
  const stats = await loadStats(userId);
  const unavailable = stats.status === "error";
  const streak = unavailable ? null : stats.streak;
  const accuracy = unavailable ? null : stats.accuracy;
  const minutes = unavailable ? null : stats.minutes;

  const widgets: StatWidget[] = [
    {
      key: "streak",
      label: "Current streak",
      value: `${streak ?? "—"}`,
      hint: unavailable ? "temporarily unavailable" : "days in a row",
      icon: Flame,
      accent: "text-amber-200",
      border: "border-warning/50",
      shadowToken: "gold",
    },
    {
      key: "accuracy",
      label: "Assessment accuracy",
      value: accuracy === null ? "—" : `${accuracy}%`,
      hint: unavailable
        ? "temporarily unavailable"
        : accuracy === null
          ? "appears after your first session"
          : "all scored sessions",
      icon: Target,
      accent: "text-cyan-300",
      border: "border-cyan-300/50",
      shadowToken: "cyan",
    },
    {
      key: "minutes",
      label: "Total study minutes",
      value: minutes === null ? "—" : minutes.toLocaleString("en-US"),
      hint: unavailable
        ? "temporarily unavailable"
        : minutes === null
          ? "appears after your first session"
          : "quizzes + desk tasks",
      icon: Clock,
      accent: "text-electric-text",
      border: "border-primary/50",
      shadowToken: "primary",
    },
  ];

  return (
    <ul aria-label="Sticker stats" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {widgets.map((w) => {
        const Icon = w.icon;
        const empty = w.value === "—";
        return (
          <li key={w.key}>
            <Link
              href="/progress"
              title={empty ? (unavailable ? "temporarily unavailable" : "appears after your first session") : undefined}
              style={{ boxShadow: `3px 3px 0 rgb(var(--${w.shadowToken}))` }}
              className={`group relative flex h-full items-center justify-between gap-4 rounded-2xl border bg-surface p-5 -rotate-[0.25deg] transition-[transform,border-color,background-color] hover:-translate-y-0.5 hover:rotate-0 motion-reduce:transform-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${w.border}`}
            >
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
                  {w.label}
                </p>
                <p className="mt-2 font-serif text-3xl font-bold text-ink">
                  {w.value}
                  {empty ? null : w.key === "streak" ? " days" : null}
                </p>
                <p className="mt-1 truncate text-xs text-muted">{w.hint}</p>
              </div>
              <div className="flex shrink-0 flex-col items-center gap-2">
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-surface-2 ${w.accent}`}>
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <ArrowRight className="h-4 w-4 text-muted transition-colors group-hover:text-primary" aria-hidden />
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
