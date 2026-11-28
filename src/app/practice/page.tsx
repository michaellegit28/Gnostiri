import type { Metadata } from "next";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import PracticeGrid from "@/components/practice/PracticeGrid";
import { PRACTICE_CARDS } from "@/components/practice/practice-cards";
import {
  DEFAULT_LEARNING_DOMAIN,
  isVisibleForAudience,
  normalizeLearningDomain,
  type LearningDomain,
} from "@/lib/learning-domain";
import { learningDomainFromCookies } from "@/lib/learning-domain-server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Practice — Gnostiri",
  description: "Timed CBT, GPE past papers, and university course exam halls.",
};

/**
 * /practice — the practice hub filtered to the student's learning lane.
 * The lane is resolved server-side so the payload itself only ever carries
 * the active lane's cards (a High School session never receives the
 * University card's label or href to strip client-side).
 */
export default async function PracticePage() {
  const user = await getCurrentUser();
  const profile = user
    ? await prisma.profile.findUnique({ where: { userId: user.id }, select: { currentDomain: true } })
    : null;
  const domain: LearningDomain =
    (user ? normalizeLearningDomain(profile?.currentDomain) : null) ??
    learningDomainFromCookies() ??
    DEFAULT_LEARNING_DOMAIN;

  return (
    <main className="mx-auto max-w-5xl px-5 py-10 md:px-8 md:py-14">
      <header className="max-w-3xl">
        <p className="text-[11px] uppercase tracking-[0.3em] text-electric-text">Practice</p>
        <h1 className="gn-title-gradient mt-3 font-serif text-4xl font-bold tracking-tight md:text-5xl">
          Practice
        </h1>
      </header>
      <PracticeGrid cards={PRACTICE_CARDS.filter((card) => isVisibleForAudience(card.audience, domain))} />
    </main>
  );
}