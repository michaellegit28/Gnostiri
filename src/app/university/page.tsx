import Link from "next/link";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { hasPremiumAccess } from "@/lib/entitlements";
import { UNIVERSITY_OPEN } from "@/lib/access";
import { ArrowRight, BookOpen, Clock, GraduationCap, Notebook } from "lucide-react";
import WaitlistForm from "@/components/university/WaitlistForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Gnostiri University — the MBBS degree and foundation courses",
  description:
    "A quiet, structured university: the full MBBS degree first, then the foundation courses that feed it. Course, module, lesson — one concept at a time.",
};

/**
 * University index — the course index a student opens first.
 *
 * Simple by design: the MBBS degree is the spine of the catalogue and is
 * listed subject by subject in teaching order (foundations → systems →
 * clinical), then the two foundation courses that do not belong to it. No
 * faculty grids, no marketing stack, no walls of empty cards — a course is
 * either open to study or it is not listed.
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
    <main className="min-h-screen bg-transparent text-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16 space-y-14">
        {/* Hero — one screen, one message */}
        <header className="relative overflow-hidden rounded-3xl border border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_85%_0%,rgba(212,175,55,0.14)_0%,rgba(20,27,44,0.9)_45%,#060814_100%)]" />
          <div className="relative space-y-6 px-7 py-12 md:px-12 md:py-16">
            <p className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold text-amber-300">
              <GraduationCap className="h-4 w-4" aria-hidden />
              Gnostiri University
            </p>
            <h1 className="max-w-3xl font-serif text-4xl font-bold tracking-tight md:text-6xl">
              One degree, studied <span className="text-gold">in order.</span>
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
              The full MBBS degree is the spine of this catalogue — nine subjects, taught
              pre-clinical to clinical, each lesson built on the one before it. Every lesson listed
              here is open to study. Nothing is padded to look finished.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5" aria-hidden /> {totalLessons} lessons
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" aria-hidden /> taught in concept order
              </span>
            </div>
          </div>
        </header>

        {/* The MBBS degree — the catalogue spine */}
        <section aria-labelledby="mbbs-heading" className="space-y-6">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
              {degreeProgramme ? degreeProgramme.degreeAwarded : "The degree"}
            </p>
            <h2 id="mbbs-heading" className="font-serif text-3xl font-bold">
              {degreeProgramme ? degreeProgramme.name : "Medicine & Surgery (MBBS)"}
            </h2>
            <p className="max-w-2xl text-sm text-slate-400">
              Nine subjects in teaching order. The pre-clinical sciences come first, then the
              clinical specialties that use them — the same order a medical school teaches in.
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
                      className="group grid gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-gold/40 hover:bg-white/[0.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold md:grid-cols-[auto_1fr_auto] md:items-center md:gap-6"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-950/60 font-mono text-sm font-semibold text-gold">
                        {course.code?.replace(/\s+\d+$/, "") ?? index + 1}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-serif text-lg font-bold text-slate-100 group-hover:text-amber-100">
                          {course.title}
                        </span>
                        <span className="mt-1 block text-sm leading-relaxed text-slate-400">
                          {course.department}
                        </span>
                        <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
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
                            <span className="mb-1 block text-right text-[11px] text-slate-500">
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
                                className="block h-full rounded-full bg-gold"
                                style={{
                                  width: `${course.lessons.length ? Math.round((done / course.lessons.length) * 100) : 0}%`,
                                }}
                              />
                            </span>
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold">
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

        {/* Foundation courses — the two core courses outside the degree */}
        {foundation.length > 0 && (
          <section aria-labelledby="foundation-heading" className="space-y-6">
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
                Foundation courses
              </p>
              <h2 id="foundation-heading" className="font-serif text-3xl font-bold">
                Skills that feed every degree.
              </h2>
              <p className="max-w-2xl text-sm text-slate-400">
                Standalone courses, not part of the MBBS spine — study them alongside it, or on
                their own.
              </p>
            </div>
            <ul className="grid gap-4 md:grid-cols-2">
              {foundation.map((course) => {
                const done = doneMap.get(course.id) ?? 0;
                return (
                  <li key={course.id}>
                    <Link
                      href={`/university/${course.slug}`}
                      className="group flex h-full flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-gold/40 hover:bg-white/[0.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                    >
                      <span className="space-y-2">
                        <span className="flex items-center gap-2">
                          <Notebook className="h-4 w-4 text-gold" aria-hidden />
                          <span className="font-mono text-xs tracking-[0.15em] text-gold">
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
                      <span className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>
                          {course.lessons.length} lesson{course.lessons.length === 1 ? "" : "s"}
                          {user && done > 0 ? ` · ${done} done` : ""}
                        </span>
                        <span className="font-semibold text-gold">Open →</span>
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
                {premium ? "New lessons, as they open" : "Study the whole degree"}
              </strong>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">
                {premium
                  ? `${totalLessons} catalogue lessons are open to study. Leave an address and hear about each release.`
                  : "Every lesson of the MBBS degree, the concept map behind it, and the competency transcript. Payments are not live yet — reserve your place instead."}
              </p>
            </div>
            <WaitlistForm />
          </aside>
        )}
      </div>
    </main>
  );
}
