import Link from "next/link";
import { getCurrentUser } from "@/lib/server-auth";
import type { Metadata } from "next";
import Greeting from "@/components/dashboard/Greeting";
import BattlePlanHero from "@/components/dashboard/TodaysPath";
import LaneBoard from "@/components/dashboard/LaneBoard";
import StatsRow from "@/components/dashboard/StatsRow";
import LeagueStatusWidget from "@/components/dashboard/LeagueStatusWidget";
import TutorShortcut from "@/components/dashboard/TutorShortcut";
import QuickLinks from "@/components/dashboard/QuickLinks";
import RecentAchievements from "@/components/dashboard/RecentAchievements";
import Landing from "@/components/landing/Landing";
import { LogoMark } from "@/components/brand/Logo";
import AnalyticsBeacon from "@/components/dashboard/AnalyticsBeacon";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gnostiri",
  description: "GPE past papers, university course exam halls, your AI study assistant, and a season league.",
};

/**
 * Home. Signed in: the dashboard — greeting, today's battle plan, the lane-tabbed
 * continue board, honest stats, the ranking widget and the tutor shortcut.
 * Signed out: one landing screen. No study categories on Home (they live at /study).
 */
export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col font-sans">
      {user ? (
        <main className="mx-auto w-full max-w-4xl px-5 py-8 md:py-10">
          <section aria-label="Dashboard" className="space-y-8">
            <Greeting name={user.name} email={user.email} />
            <AnalyticsBeacon type="mission_viewed" meta={{ source: "dashboard" }} />
            <BattlePlanHero userId={user.id} />
            <LaneBoard />
            <QuickLinks />
            <StatsRow userId={user.id} />
            <div className="grid gap-6 lg:grid-cols-2">
              <LeagueStatusWidget />
              <RecentAchievements userId={user.id} />
            </div>
            <TutorShortcut />
          </section>
        </main>
      ) : (
        <>
          <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-5">
            <span className="flex items-center gap-2.5">
              <LogoMark size={26} />
              <span className="font-serif text-base font-bold tracking-tight text-ink">Gnostiri</span>
            </span>
            <Link
              href="/login"
              className="inline-flex min-h-[44px] items-center rounded-xl border border-line-strong px-5 text-sm font-semibold text-ink transition-colors hover:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Sign in
            </Link>
          </header>
          <Landing />
        </>
      )}
    </div>
  );
}
