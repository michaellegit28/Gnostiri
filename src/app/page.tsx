import Link from "next/link";
import { getCurrentUser } from "@/lib/server-auth";
import type { Metadata } from "next";
import Greeting from "@/components/dashboard/Greeting";
import BattlePlanHero from "@/components/dashboard/BattlePlanHero";
import StatsRow from "@/components/dashboard/StatsRow";
import LeagueStatusWidget from "@/components/dashboard/LeagueStatusWidget";
import TutorShortcut from "@/components/dashboard/TutorShortcut";
import Landing from "@/components/landing/Landing";
import { LogoMark } from "@/components/brand/Logo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gnostiri",
  description: "Verified exam questions, full university courses, your AI study assistant, and a season league.",
};

/**
 * Home. Signed in: the dashboard — greeting, today's battle plan, honest stats,
 * the Global Ranking widget and the tutor shortcut. Signed out: one landing
 * screen. No study categories on Home (they live at /study).
 */
export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col font-sans">
      {user ? (
        <main className="mx-auto w-full max-w-4xl px-5 py-8 md:py-10">
          <section aria-label="Dashboard" className="space-y-8">
            <Greeting name={user.name} email={user.email} />
            <BattlePlanHero userId={user.id} />
            <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
              <StatsRow userId={user.id} />
              <LeagueStatusWidget />
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
              className="inline-flex min-h-[44px] items-center rounded-xl border border-line-strong px-5 text-sm font-semibold text-ink transition-colors hover:border-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
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
