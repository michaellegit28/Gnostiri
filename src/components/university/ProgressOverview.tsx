import Link from "next/link";
import prisma from "@/lib/db";
import type { AppDomain } from "@prisma/client";
import { GraduationCap, ListChecks, Percent } from "lucide-react";

/**
 * ProgressOverview — where this course sits in the learner's degree.
 *
 * Server component: it reads the learner's own Progress rows (domain
 * "university", entityType "courseLesson", status "completed") and turns them
 * into the three numbers a student actually asks — how much of this course is
 * done, how many courses have been started, and how much of the whole
 * catalogue is complete. Anonymous visitors see the catalogue totals only, so
 * the page still teaches what the degree is.
 */

const DOMAIN: AppDomain = "university";

interface ProgressOverviewProps {
  courseId: string;
  lessonCount: number;
  totalUniversityLessons: number;
  totalUniversityCourses: number;
  userId: string | null;
}

export default async function ProgressOverview({
  courseId,
  lessonCount,
  totalUniversityLessons,
  totalUniversityCourses,
  userId,
}: ProgressOverviewProps) {
  let doneHere = 0;
  let doneAll = 0;
  let startedCourses = 0;

  if (userId) {
    const rows = await prisma.progress.findMany({
      where: { userId, domain: DOMAIN, entityType: "courseLesson", status: "completed" },
      select: { entityId: true },
    });
    const lessonIds = new Set(
      (
        await prisma.courseLesson.findMany({
          where: { courseId },
          select: { id: true },
        })
      ).map((l) => l.id),
    );
    doneAll = rows.length;
    doneHere = rows.filter((r) => lessonIds.has(r.entityId)).length;
    if (doneHere > 0) startedCourses = 1;
  }

  const coursePercent = lessonCount > 0 ? Math.round((doneHere / lessonCount) * 100) : 0;
  const degreePercent = totalUniversityLessons > 0 ? Math.round((doneAll / totalUniversityLessons) * 100) : 0;

  const stats = [
    {
      icon: Percent,
      label: "This course",
      value: `${coursePercent}%`,
      detail: `${doneHere} of ${lessonCount} lesson${lessonCount === 1 ? "" : "s"}`,
    },
    {
      icon: ListChecks,
      label: "Lessons completed",
      value: `${doneAll}`,
      detail: `across ${startedCourses} course${startedCourses === 1 ? "" : "s"} started`,
    },
    {
      icon: GraduationCap,
      label: "Degree complete",
      value: `${degreePercent}%`,
      detail: `${totalUniversityLessons} lessons in the catalogue`,
    },
  ];

  return (
    <section aria-label="Your progress" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-serif text-lg font-bold text-slate-100">Progress</h2>
        <Link
          href="/university/transcript"
          className="rounded text-xs font-medium text-slate-400 underline-offset-4 hover:text-gold hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          Transcript
        </Link>
      </div>
      <dl className="mt-4 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-white/5 bg-slate-950/40 px-4 py-3.5">
            <dt className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              <s.icon className="h-3.5 w-3.5 text-gold" aria-hidden />
              {s.label}
            </dt>
            <dd className="mt-2 font-serif text-2xl font-bold text-gold">{s.value}</dd>
            <p className="mt-1 text-[11px] text-slate-500">{s.detail}</p>
          </div>
        ))}
      </dl>
      {!userId && (
        <p className="mt-4 text-xs text-slate-500">
          <Link href="/login" className="rounded text-gold underline-offset-4 hover:underline">Sign in</Link> to track
          your progress and your transcript. {totalUniversityCourses} course{totalUniversityCourses === 1 ? "" : "s"} in
          the catalogue.
        </p>
      )}
    </section>
  );
}
