import type { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import StudyGrid from "@/components/study/StudyGrid";
import {
  DEFAULT_LEARNING_DOMAIN,
  isVisibleForLearningDomain,
  normalizeLearningDomain,
  type LearningDomain,
} from "@/lib/learning-domain";
import { learningDomainFromCookies } from "@/lib/learning-domain-server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Study — Gnostiri",
  description: "Your study lane, open research trails, and your own uploaded material.",
};

/**
 * /study — the lane-specific ways to study plus the shared work surfaces.
 * Counts are live from the database; the Desk count is the signed-in user's
 * own processed documents. The card list is filtered in StudyGrid by the
 * learning lane, so a university session never carries the high-school card.
 */
export default async function StudyPage() {
  const [jambQuestions, jambSubjects, courses, discoveryTopics, user] = await Promise.all([
    prisma.question.count({ where: { topic: { id: { startsWith: "jamb-" } } } }),
    prisma.topic.count({ where: { domain: "highschool", parentId: "jamb" } }),
    prisma.course.count(),
    prisma.topic.count({ where: { domain: "extras" } }),
    getCurrentUser(),
  ]);

  const deskCount = user
    ? await prisma.studyDocument.count({ where: { userId: user.id } })
    : 0;

  // The lane is resolved server-side too, so a university session never carries
  // the high-school card (label, count and href) in the payload for the client
  // filter to strip.
  const profile = user
    ? await prisma.profile.findUnique({ where: { userId: user.id }, select: { currentDomain: true } })
    : null;
  const domain: LearningDomain =
    (user ? normalizeLearningDomain(profile?.currentDomain) : learningDomainFromCookies()) ??
    DEFAULT_LEARNING_DOMAIN;

  const cards = [
    {
      href: "/highschool",
      label: "High School",
      icon: "BookOpen" as const,
      line: "GPE past papers and the syllabuses behind them",
      count: `${jambQuestions.toLocaleString("en-NG")} questions · ${jambSubjects} subjects`,
      audience: "highschool" as const,
    },
    {
      href: "/university",
      label: "University",
      icon: "GraduationCap" as const,
      line: "Courses, concepts and course exam halls",
      count: `${courses} courses · lessons, quizzes and mastery`,
      audience: "university" as const,
    },
    {
      href: "/discovery",
      label: "Discovery",
      icon: "Compass" as const,
      line: "Open research trails past the syllabus",
      count: `${discoveryTopics} research trails`,
      audience: "shared" as const,
    },
    {
      href: "/desk",
      label: "PDF Desk",
      icon: "FolderOpen" as const,
      line: "Turn your PDFs into notes and quizzes",
      count: user ? `${deskCount} document${deskCount === 1 ? "" : "s"} on your desk` : "Sign in to open your desk",
      audience: "university" as const,
    },
  ];

  return (
    <main className="mx-auto max-w-4xl px-5 py-8 md:py-12">
      <p className="text-[11px] uppercase tracking-[0.3em] text-primary">Study</p>
      <h1 className="gn-title-gradient mt-3 font-serif text-3xl font-bold tracking-tight md:text-4xl">Your study lane</h1>
      <div className="mt-5">
        <Link
          href="/settings#learning-domain-settings"
          className="gn-motion inline-flex min-h-[44px] items-center rounded-lg border border-line px-3 py-2 text-sm font-semibold text-muted hover:border-primary/50 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Wrong lane? Change High School / University
        </Link>
      </div>
      <div className="mt-8">
        <StudyGrid cards={cards.filter((card) => isVisibleForLearningDomain(card.href, domain))} />
      </div>
    </main>
  );
}
