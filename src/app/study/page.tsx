import type { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import StudyGrid, { type StudyCardSpec } from "@/components/study/StudyGrid";
import StudyLaneSwitch from "@/components/study/StudyLaneSwitch";
import {
  DEFAULT_LEARNING_DOMAIN,
  domainLabel,
  isVisibleForAudience,
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
 * /study — the hub. The full lane grid (this lane's study surfaces) plus the
 * shared tools, grouped into labelled sections. Counts are live from the
 * database; the payload only ever carries the current lane's cards (the
 * audience filter runs server-side too), and the lane switch round-trips the
 * server so switching lanes re-scopes what ships.
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

  const laneCards: StudyCardSpec[] =
    domain === "university"
      ? [
          {
            href: "/university",
            label: "Courses",
            icon: "GraduationCap",
            line: "Your curriculum, concepts and course exam halls",
            count: `${courses} courses · lessons, quizzes and mastery`,
            audience: "university" as const,
          },
          {
            href: "/university/ai",
            label: "AI Studio",
            icon: "Sparkles",
            line: "Lecture capture, notes and AI-generated assessments",
            count: "Advanced lane",
            audience: "university" as const,
          },
          {
            href: "/desk",
            label: "PDF Desk",
            icon: "FolderOpen",
            line: "Turn your PDFs into notes and quizzes",
            count: user ? `${deskCount} document${deskCount === 1 ? "" : "s"} on your desk` : "Sign in to open your desk",
            audience: "university" as const,
          },
          {
            href: "/university/revision",
            label: "Review",
            icon: "RotateCcw",
            line: "Due concepts and spaced-repetition revision",
            count: "SM-2 schedule",
            audience: "university" as const,
          },
        ]
      : [
          {
            href: "/highschool",
            label: "High School",
            icon: "BookOpen",
            line: "GSE past papers and the syllabuses behind them",
            count: `${jambQuestions.toLocaleString("en-NG")} questions · ${jambSubjects} subjects`,
            audience: "highschool" as const,
          },
          {
            href: "/highschool/exams",
            label: "GSE exam halls",
            icon: "ClipboardList",
            line: "Full papers by subject, timed or untimed",
            count: `${jambSubjects} subjects`,
            audience: "highschool" as const,
          },
          {
            href: "/highschool/study",
            label: "Textbook study",
            icon: "BookOpen",
            line: "Read a topic, then quiz yourself on it",
            count: `${jambSubjects} subjects`,
            audience: "highschool" as const,
          },
          {
            href: "/cbt",
            label: "Timed CBT",
            icon: "MonitorPlay",
            line: "Exam conditions, question by question",
            count: "Timed mode",
            audience: "highschool" as const,
          },
        ];

  const toolCards: StudyCardSpec[] = [
    {
      href: "/tutor",
      label: "AI Tutor",
      icon: "MessageCircle",
      line: "Ask anything — explanations, worked steps, hints",
      count: "Always on",
      audience: "shared" as const,
    },
    {
      href: "/discovery",
      label: "Discovery",
      icon: "Compass",
      line: "Open research trails past the syllabus",
      count: `${discoveryTopics} research trails`,
      audience: "shared" as const,
    },
    {
      href: "/battle-plan",
      label: "Study plan",
      icon: "ListChecks",
      line: "Your week-by-week path to exam day",
      count: "Plan and catch up",
      audience: "shared" as const,
    },
  ];

  const sections = [
    { id: "lane", label: `Your lane — ${domainLabel(domain)}`, cards: laneCards },
    { id: "tools", label: "Tools", cards: toolCards },
  ].map((section) => ({ ...section, cards: section.cards.filter((card) => isVisibleForAudience(card.audience, domain)) }));

  return (
    <main className="mx-auto max-w-4xl px-5 py-8 md:py-12">
      <p className="text-[11px] uppercase tracking-[0.3em] text-primary">Study</p>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
        <h1 className="gn-title-gradient font-serif text-3xl font-bold tracking-tight md:text-4xl">Your study lane</h1>
        <StudyLaneSwitch />
      </div>
      <p className="mt-3 max-w-2xl text-sm text-muted">
        Everything in your current lane, plus the tools that follow you everywhere.{" "}
        <Link
          href="/settings#learning-domain-settings"
          className="font-semibold text-electric-text underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Lane settings
        </Link>{" "}
        live in Settings.
      </p>
      <div className="mt-8">
        <StudyGrid sections={sections} />
      </div>
    </main>
  );
}