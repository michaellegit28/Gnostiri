import type { Metadata } from "next";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import StudyGrid from "@/components/study/StudyGrid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Study — Gnostiri",
  description: "High school exam banks, university courses, discovery and your desk.",
};

/**
 * /study — the four ways to study. Counts are live from the database; the Desk
 * count is the signed-in user's own processed documents.
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

  const cards = [
    {
      href: "/highschool",
      label: "High School",
      icon: "BookOpen" as const,
      line: "Exam questions, machine-verified",
      count: `${jambQuestions.toLocaleString("en-NG")} questions · ${jambSubjects} subjects`,
    },
    {
      href: "/university",
      label: "University",
      icon: "GraduationCap" as const,
      line: "Courses, full depth",
      count: `${courses} courses · lessons, quizzes and mastery`,
    },
    {
      href: "/discovery",
      label: "Discovery",
      icon: "Compass" as const,
      line: "Explore past the syllabus",
      count: `${discoveryTopics} research trails`,
    },
    {
      href: "/desk",
      label: "Desk",
      icon: "FolderOpen" as const,
      line: "Your uploads, notes and plans",
      count: user ? `${deskCount} document${deskCount === 1 ? "" : "s"} on your desk` : "Sign in to open your desk",
    },
  ];

  return (
    <main className="mx-auto max-w-4xl px-5 py-8 md:py-12">
      <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Study</p>
      <h1 className="mt-3 font-serif text-3xl font-bold text-ink md:text-4xl">Pick your lane</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted">
        Four ways in: the verified exam banks, full university courses, open research trails, and your
        own uploaded material.
      </p>
      <div className="mt-8">
        <StudyGrid cards={cards} />
      </div>
    </main>
  );
}
