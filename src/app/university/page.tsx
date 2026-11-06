import Link from "next/link";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { hasPremiumAccess } from "@/lib/entitlements";
import { UNIVERSITY_OPEN } from "@/lib/access";
import { ArrowRight, BookOpen, Clock, GraduationCap, Notebook } from "lucide-react";
import WaitlistForm from "@/components/university/WaitlistForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Gnostiri University — courses, degrees and mastery",
  description:
    "Courses, degrees and mastery across programmes — one concept and lesson at a time, in teaching order.",
};

/**
 * University index — the course index a student opens first.
 *
 * Simple by design: a degree is the spine of the catalogue and is listed
 * subject by subject in teaching order (foundations → systems → clinical),
 * then the standalone foundation courses that do not belong to it. No
 * faculty grids, no marketing stack, no walls of empty cards — a course is
 * either open to study or it is not listed. Every count printed here is the
 * Prisma count computed above, never a remembered figure.
 */
export default async function UniversityIndexPage() {
  const user = await getCurrentUser();
  const premium = user ? await hasPremiumAccess(user.id) : UNIVERSITY_OPEN;

  const courses = await prisma.course.findMany({
    where: { domain: "university", isPublished: true },
    include: {
      lessons: { select: { id: true, estimatedMinutes: true } },
      programme: { select: { name: true, degreeAwarded: true, slug: true } },
      faculty: { select: { name: true, accent: true } },
    },
    orderBy: [{ level: "asc" }, { code: "asc" }, { title: "asc" }],
  });

  // The MBBS degree is the catalogue spine: every subject seeded by the MBBS
  // spine is attached to the MBBS programme. Anything else is a foundation
  // course, listed after it.
  const mbbs = courses.filter((c) => c.programmeId != null);
  const foundation = courses.filter((c) => c.programmeId == null);

  const doneMap = new Map<string, number>();
  if (user) {
    const done = await prisma.progress.findMany({
      where: { userId: user.id, domain: "university", entityType: "courseLesson", status: "completed" },
      select: { entityId: true },
    });
    const ids = new Set(done.map((d) => d.entityId));
    for (const course of courses) {
      doneMap.set(course.id, course.lessons.filter((l) => ids.has(l.id)).length);
    }
  }

  const totalLessons = courses.reduce((sum, c) => sum + c.lessons.length, 0);
  const degreeProgramme = mbbs[0]?.programme;

  return (
    <main className="min-h-screen bg-transparent text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16 space-y-14">
        {/* Hero — one screen, one message */}
        <header className="gn-aurora relative overflow-hidden rounded-3xl border border-white/10">
          <div aria-hidden="true" className="gn-aurora-bar absolute inset-x-0 top-0 h-1.5" />
          <div className="relative space-y-6 px-7 py-12 md:px-12 md:py-16">
            <p className="inline-flex items-center gap-2 rounded-full border border-mod-uni-a/40 bg-mod-uni-a/10 px-3 py-1 text-xs font-semibold text-electric-text">
              <GraduationCap className="h-4 w-4" aria-hidden />
              Gnostiri University
            </p>
            <h1 className="max-w-3xl font-serif text-4xl font-bold tracking-tight md:text-6xl">
              Courses and degrees, studied <span className="gn-aurora-text">in order.</span>
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
              A full degree is the spine of this catalogue — {mbbs.length} subject
              {mbbs.length === 1 ? "" : "s"}, taught pre-clinical to clinical, each lesson built on the one
              before it — with {foundation.length} standalone foundation course{foundation.length === 1 ? "" : "s"} around it. Every
              lesson listed here is open to study. Nothing is padded to look finished.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5" aria-hidden /> {courses.length} course
                {courses.length === 1 ? "" : "s"}
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5" aria-hidden /> {totalLessons} lessons
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" aria-hidden /> taught in concept order
              </span>
            </div>
          </div>
        </header>

        {/* The degree — the catalogue spine */}
        <section aria-labelledby="mbbs-heading" className="space-y-6">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-electric-text">
              {degreeProgramme ? degreeProgramme.degreeAwarded : "The degree"}
            </p>
            <h2 id="mbbs-heading" className="font-serif text-3xl font-bold">
              {degreeProgramme ? degreeProgramme.name : "Medicine & Surgery (MBBS)"}
            </h2>
            <p className="max-w-2xl text-sm text-slate-400">
              {mbbs.length} subject{mbbs.length === 1 ? "" : "s"} in teaching order. Foundations come
              first, then the specialties that build on them — the same order the programme teaches
              them in.
            </p>
          </div>

          {mbbs.length === 0 ? (
            <p className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-sm text-slate-400">
              The degree catalogue is being prepared. Check back shortly.
            </p>
          ) : (
            <ol className="space-y-3">
              {mbbs.map((course, index) => {
                const done = doneMap.get(course.id) ?? 0;
                const minutes = course.lessons.reduce((s, l) => s + l.estimatedMinutes, 0);
                return (
                  <li key={course.id}>
                    <Link
                      href={`/university/${course.slug}`}
                      className="group gn-motion gn-shadow gn-lift grid gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 hover:border-mod-uni-a/40 hover:bg-white/[0.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary md:grid-cols-[auto_1fr_auto] md:items-center md:gap-6"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-mod-uni-a/30 bg-mod-uni-a/10 font-mono text-sm font-semibold text-electric-text">
                        {course.code?.replace(/\s+\d+$/, "") ?? index + 1}
                      </span>
                      <span className="min-w-0">
                          <span className="block font-serif text-lg font-bold text-slate-100 group-hover:text-electric-text">
                          {course.title}
                        </span>
                        <span className="mt-1 block text-sm leading-relaxed text-slate-400">
                          {course.department}
                        </span>
                        <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
                          <span>{course.lessons.length} lessons</span>
                          <span aria-hidden>·</span>
                          <span>~{Math.max(1, Math.round(minutes / 60))}h</span>
                          {course.credits != null && (
                            <>
                              <span aria-hidden>·</span>
                              <span>{course.credits} credits</span>
                            </>
                          )}
                        </span>
                      </span>
                      <span className="flex items-center gap-4">
                        {user && (
                          <span className="hidden w-28 sm:block">
                            <span className="mb-1 block text-right text-[11px] text-slate-400">
                              {done === 0 ? "Not started" : `${done} of ${course.lessons.length} done`}
                            </span>
                            <span
                              className="block h-1.5 overflow-hidden rounded-full bg-slate-800"
                              role="progressbar"
                              aria-valuenow={course.lessons.length ? Math.round((done / course.lessons.length) * 100) : 0}
                              aria-valuemin={0}
                              aria-valuemax={100}
                              aria-label={`${course.title} progress`}
                            >
                              <span
                                className="block h-full rounded-full bg-mod-uni-a"
                                style={{
                                  width: `${course.lessons.length ? Math.round((done / course.lessons.length) * 100) : 0}%`,
                                }}
                              />
                            </span>
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-electric-text">
                          {premium ? "Open" : "Preview"}
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          )}
        </section>

        {/* Foundation courses — the standalone courses outside the degree */}
        {foundation.length > 0 && (
          <section aria-labelledby="foundation-heading" className="space-y-6">
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-violet-200">
                Foundation courses
              </p>
              <h2 id="foundation-heading" className="font-serif text-3xl font-bold">
                Skills that feed every degree.
              </h2>
              <p className="max-w-2xl text-sm text-slate-400">
                {foundation.length} standalone course{foundation.length === 1 ? "" : "s"} outside the
                degree spine — study them alongside it, or entirely on their own.
              </p>
            </div>
            <ul className="grid gap-4 md:grid-cols-2">
              {foundation.map((course) => {
                const done = doneMap.get(course.id) ?? 0;
                return (
                  <li key={course.id}>
                    <Link
                      href={`/university/${course.slug}`}
                      className="group gn-motion gn-shadow gn-lift flex h-full flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-mod-uni-b/40 hover:bg-white/[0.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <span className="space-y-2">
                        <span className="flex items-center gap-2">
                          <Notebook className="h-4 w-4 text-violet-200" aria-hidden />
                          <span className="font-mono text-xs tracking-[0.15em] text-violet-200">
                            {course.code || course.department}
                          </span>
                        </span>
                        <span className="block font-serif text-xl font-bold text-slate-100">
                          {course.title}
                        </span>
                        {course.description && (
                          <span className="block text-sm leading-relaxed text-slate-400 line-clamp-2">
                            {course.description}
                          </span>
                        )}
                      </span>
                      <span className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>
                          {course.lessons.length} lesson{course.lessons.length === 1 ? "" : "s"}
                          {user && done > 0 ? ` · ${done} done` : ""}
                        </span>
                        <span className="font-semibold text-violet-200">Open →</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {!premium && (
          <aside
            id="waitlist"
            className="space-y-5 rounded-2xl border border-gold/30 bg-gold/[0.07] p-6 scroll-mt-24 md:p-8"
          >
            <div>
              <strong className="font-serif text-xl text-amber-300">
                {premium ? "New lessons, as they open" : "Study the whole catalogue"}
              </strong>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">
                {premium
                  ? `${totalLessons} catalogue lessons are open to study. Leave an address and hear about each release.`
                  : `Every lesson of the degree, the concept map behind it, and the competency transcript. Payments are not live yet — reserve your place instead.`}
              </p>
            </div>
            <WaitlistForm />
          </aside>
        )}
      </div>
    </main>
  );
}
