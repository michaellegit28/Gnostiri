import Link from "next/link";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import type { Metadata } from "next";
import Greeting from "@/components/dashboard/Greeting";
import BattlePlanHero from "@/components/dashboard/TodaysPath";
import UniversityToday from "@/components/dashboard/UniversityToday";
import Landing from "@/components/landing/Landing";
import { LogoMark } from "@/components/brand/Logo";
import AnalyticsBeacon from "@/components/dashboard/AnalyticsBeacon";
import {
  DEFAULT_LEARNING_DOMAIN,
  normalizeLearningDomain,
  type LearningDomain,
} from "@/lib/learning-domain";
import { learningDomainFromCookies } from "@/lib/learning-domain-server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gnostiri",
  description: "Your study day at a glance — high school and university, kept separate.",
};

/**
 * Home — explicitly split per lane (owner directive: the lanes never
 * collapse). Signed in: the greeting plus the lane's own "what now" panel —
 * High School gets today's path from its study plan; University gets its
 * spaced-repetition revision. Signed out: one landing screen. No study
 * categories on Home (they live at /study).
 */
export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col font-sans">
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
      </div>
    );
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
    select: { currentDomain: true },
  });
  const domain: LearningDomain =
    normalizeLearningDomain(profile?.currentDomain) ?? learningDomainFromCookies() ?? DEFAULT_LEARNING_DOMAIN;

  return (
    <main className="mx-auto w-full max-w-4xl px-5 py-8 md:py-10">
      <section aria-label="Today" className="space-y-6">
        <Greeting name={user.name} email={user.email} />
        <AnalyticsBeacon type="mission_viewed" meta={{ source: "dashboard", domain }} />
        {domain === "university" ? (
          <UniversityToday userId={user.id} />
        ) : (
          <>
            <BattlePlanHero userId={user.id} />
            <Link
              href="/battle-plan"
              className="gn-motion inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-electric-text underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              View full plan →
            </Link>
          </>
        )}
      </section>
    </main>
  );
}