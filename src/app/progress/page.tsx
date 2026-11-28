import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BarChart3, LogIn } from "lucide-react";
import { getCurrentUser } from "@/lib/server-auth";
import prisma from "@/lib/db";
import {
  DEFAULT_LEARNING_DOMAIN,
  domainLabel,
  normalizeLearningDomain,
  type LearningDomain,
} from "@/lib/learning-domain";
import StatsRow from "@/components/dashboard/StatsRow";
import LeagueStatusWidget from "@/components/dashboard/LeagueStatusWidget";
import RecentAchievements from "@/components/dashboard/RecentAchievements";
import WeekTimeline from "@/components/progress/WeekTimeline";
import ProgressDashboard from "@/components/progress/ProgressDashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Progress — Gnostiri",
  description: "Your streak, accuracy, study minutes, week plan, ranking and earned achievements.",
};

/**
 * /progress — the analytics home (owner IA directive). Home answers "what
 * now"; everything that is merely interesting lives here: the stat chips
 * (streak / accuracy / minutes), the seven-day plan timeline, the global
 * ranking and recent achievements. The lane-filtered topic tables are the
 * client half (ProgressDashboard); the server shell owns the rest so the
 * DB reads stay server-side (AGENTS.md rule 4).
 */
export default async function ProgressPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="min-h-screen bg-transparent text-slate-100 p-6 md:p-12 flex items-center justify-center">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-gold/10 text-gold flex items-center justify-center mx-auto">
            <LogIn className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-serif font-bold text-slate-100">Sign in required</h1>
            <p className="text-slate-400 text-sm">
              Sign in to see your streak, accuracy, study minutes, week plan and every recent quiz attempt.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gold hover:bg-gold-hover text-on-gold font-semibold text-sm transition-colors w-full"
          >
            <span>Sign in or create an account</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
    select: { currentDomain: true },
  });
  const domain: LearningDomain = normalizeLearningDomain(profile?.currentDomain) ?? DEFAULT_LEARNING_DOMAIN;

  return (
    <div className="min-h-screen bg-transparent text-slate-100 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-slate-800 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-semibold mb-3">
            <BarChart3 className="w-4 h-4" />
            <span>Progress</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-100 tracking-tight">
            Your progress
          </h1>
          <p className="mt-2 text-slate-400 text-base max-w-2xl">
            Your {domainLabel(domain)} numbers at a glance, the week ahead, your ranking and what you&apos;ve earned.
          </p>
        </div>

        {/* Stat chips — streak, accuracy, minutes (lane-scoped) */}
        <StatsRow userId={user.id} domain={domain} linkTo={null} />

        {/* Seven-day plan timeline (relocated here from Home; High School only) */}
        <WeekTimeline domain={domain} />

        {/* Ranking + achievements */}
        <div className="grid gap-6 lg:grid-cols-2">
          <LeagueStatusWidget />
          <RecentAchievements userId={user.id} />
        </div>

        {/* Lane-filtered topic tables (client) */}
        <ProgressDashboard />
      </div>
    </div>
  );
}