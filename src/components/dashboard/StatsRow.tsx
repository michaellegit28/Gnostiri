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
}

async function loadStats(userId: string): Promise<Array<{ streak: number; accuracy: number | null; minutes: number | null }>> {
  try {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const today = new Date().toISOString().slice(0, 10);
    const [profile, attempts, sessions, tasks] = await Promise.all([
      prisma.profile.findUnique({
        where: { userId },
        select: { streak: true, lastActive: true },
      }),
      prisma.quizAttempt.aggregate({
        where: { userId },
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

    return [{ streak, accuracy, minutes }];
  } catch {
    return [];
  }
}

export default async function StatsRow({ userId }: { userId: string }) {
  const [stats] = await loadStats(userId);
  const streak = stats?.streak ?? 0;
  const accuracy = stats?.accuracy ?? null;
  const minutes = stats?.minutes ?? null;

  const widgets: StatWidget[] = [
    {
      key: "streak",
      label: "Current streak",
      value: `${streak}`,
      hint: "days in a row",
      icon: Flame,
      accent: "text-orange-400",
    },
    {
      key: "accuracy",
      label: "Assessment accuracy",
      value: accuracy === null ? "—" : `${accuracy}%`,
      hint: accuracy === null ? "appears after your first session" : "all scored sessions",
      icon: Target,
      accent: "text-teal-300",
    },
    {
      key: "minutes",
      label: "Total study minutes",
      value: minutes === null ? "—" : minutes.toLocaleString("en-US"),
      hint: minutes === null ? "appears after your first session" : "quizzes + desk tasks",
      icon: Clock,
      accent: "text-gold",
    },
  ];

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {widgets.map((w) => {
        const Icon = w.icon;
        const empty = w.value === "—";
        return (
          <li key={w.key}>
            <Link
              href="/progress"
              title={empty ? "appears after your first session" : undefined}
              className="group flex h-full items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/60 p-5 backdrop-blur transition-colors hover:border-gold/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                  {w.label}
                </p>
                <p className="mt-2 font-serif text-3xl font-bold text-slate-100">
                  {w.value}
                  {empty ? null : w.key === "streak" ? " days" : null}
                </p>
                <p className="mt-1 truncate text-xs text-slate-500">{w.hint}</p>
              </div>
              <div className="flex shrink-0 flex-col items-center gap-2">
                <Icon className={`h-7 w-7 ${w.accent}`} aria-hidden />
                <ArrowRight className="h-4 w-4 text-slate-600 transition-colors group-hover:text-gold" aria-hidden />
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
