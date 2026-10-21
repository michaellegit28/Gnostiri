import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { hasPremiumAccess } from "@/lib/entitlements";
import { UNIVERSITY_OPEN } from "@/lib/access";
import { ArrowLeft, ArrowRight, Brain, Clock, Sparkles } from "lucide-react";
import ModuleLessonNav, { type NavLesson, type NavModule } from "@/components/university/ModuleLessonNav";
import ProgressOverview from "@/components/university/ProgressOverview";
import CurriculumAlignmentWidget from "@/components/curriculum/CurriculumAlignmentWidget";
import AlignmentDisclaimer from "@/components/curriculum/AlignmentDisclaimer";
import LiteModeBanner from "@/components/curriculum/LiteModeBanner";

export const dynamic = "force-dynamic";
export const revalidate = 60;

/**
 * Course overview — one page, three things: what the course is, where the
 * learner is in it, and how to get to the next lesson.
 *
 * The module → lesson spine is the primary navigation (ModuleLessonNav), the
 * concept map is a secondary view of how the subject connects, and the
 * assessment routes sit in one compact row at the foot.
 */
export default async function CoursePage({
  params,
  searchParams,
}: {
  params: { course: string };
  searchParams?: { lite?: string };
}) {
  const lite = searchParams?.lite === "1";
  const course = await prisma.course.findFirst({
    where: { slug: params.course, domain: "university", isPublished: true },
    include: {
      lessons: {
        orderBy: { orderIndex: "asc" },
        select: { id: true, title: true, orderIndex: true, estimatedMinutes: true, needsCheck: true },
      },
      modules: {
        orderBy: { orderIndex: "asc" },
        include: {
          concepts: {
            orderBy: { orderIndex: "asc" },
            include: { prerequisites: { select: { prerequisiteId: true } } },
          },
        },
      },
      concepts: {
        orderBy: { orderIndex: "asc" },
        include: { prerequisites: { select: { prerequisiteId: true } } },
      },
      clinicalCases: { where: { isPublished: true }, orderBy: { orderIndex: "asc" } },
      programme: { select: { name: true, degreeAwarded: true, slug: true } },
      faculty: { select: { name: true, accent: true } },
    },
  });
  if (!course) notFound();

  const user = await getCurrentUser();
  const premium = user ? await hasPremiumAccess(user.id) : UNIVERSITY_OPEN;

  const totalMinutes = course.lessons.reduce((s, l) => s + l.estimatedMinutes, 0);
  const authoredCount = course.lessons.filter((l) => !l.needsCheck).length;
  const flatConcepts =
    course.concepts.length > 0
      ? course.concepts
      : course.modules.flatMap((m) => m.concepts);
  const edgeCount = flatConcepts.reduce((s, c) => s + c.prerequisites.length, 0);

  // Lessons are not attached to modules directly — the seed aligns each lesson
  // to the concept at the same orderIndex, and the concept carries its module.
  // That alignment is what groups the module → lesson spine here.
  const lessonModuleId = new Map<string, string>();
  for (const concept of flatConcepts) {
    if (concept.moduleId) lessonModuleId.set(`order-${concept.orderIndex}`, concept.moduleId);
  }
  const moduleIdOfLesson = (lesson: { orderIndex: number }) => lessonModuleId.get(`order-${lesson.orderIndex}`) ?? null;

  const navLessons: NavLesson[] = course.lessons.map((l) => ({
    id: l.id,
    title: l.title,
    orderIndex: l.orderIndex,
    estimatedMinutes: l.estimatedMinutes,
    needsCheck: l.needsCheck,
  }));

  const navModules: NavModule[] = course.modules.map((m) => {
    const lessons = navLessons.filter((l) => moduleIdOfLesson(l) === m.id);
    return {
      id: m.id,
      title: m.title,
      orderIndex: m.orderIndex,
      lessons,
      authoredCount: lessons.filter((l) => !l.needsCheck).length,
    };
  });
  const orphanLessons: NavLesson[] = navLessons.filter((l) => moduleIdOfLesson(l) == null);

  // Progress continues where it stopped: the first lesson not yet complete.
  let completedLessonIds: string[] = [];
  if (user) {
    const rows = await prisma.progress.findMany({
      where: { userId: user.id, domain: "university", entityType: "courseLesson", status: "completed" },
      select: { entityId: true },
    });
    const done = new Set(rows.map((r) => r.entityId));
    completedLessonIds = course.lessons.filter((l) => done.has(l.id)).map((l) => l.id);
  }
  const doneSet = new Set(completedLessonIds);
  const nextLesson = course.lessons.find((l) => !doneSet.has(l.id)) ?? course.lessons[0];
  const nextModule = nextLesson ? navModules.find((m) => m.lessons.some((l) => l.id === nextLesson.id)) : undefined;

  const [catalogueLessons, catalogueCourses] = await Promise.all([
    prisma.courseLesson.count({
      where: { course: { domain: "university", isPublished: true } },
    }),
    prisma.course.count({ where: { domain: "university", isPublished: true } }),
  ]);

  return (
    <main className="min-h-screen bg-transparent text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-10 md:py-14 space-y-10">
        <LiteModeBanner />

        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-400">
          <Link
            href="/university"
            className="inline-flex items-center gap-1.5 rounded transition-colors hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden /> University
          </Link>
          <span className="text-slate-600" aria-hidden>/</span>
          <span className="truncate text-slate-300">{course.title}</span>
        </nav>

        {/* Course header */}
        <header className="relative overflow-hidden rounded-3xl border border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(110%_100%_at_90%_0%,rgba(212,175,55,0.12)_0%,rgba(20,27,44,0.9)_45%,#060814_100%)]" />
          <div className="relative space-y-5 px-6 py-9 md:px-10 md:py-11">
            <div className="flex flex-wrap items-center gap-2">
              {course.code && (
                <span className="rounded-md border border-gold/25 bg-gold/10 px-2.5 py-1 font-mono text-xs tracking-[0.18em] text-gold">
                  {course.code}
                </span>
              )}
              {course.department && (
                <span className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-slate-300">
                  {course.department}
                </span>
              )}
              {course.level != null && (
                <span className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-slate-300">
                  {course.level} level
                </span>
              )}
              {course.credits != null && (
                <span className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-slate-300">
                  {course.credits} credits
                </span>
              )}
              {course.semester && (
                <span className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium capitalize text-slate-300">
                  {course.semester} semester
                </span>
              )}
              <CurriculumAlignmentWidget topicSlug={course.slug} lite={lite} />
            </div>

            <div className="space-y-3">
              {course.programme && (
                <p className="text-sm text-teal-300">
                  {course.programme.degreeAwarded} · {course.programme.name}
                </p>
              )}
              <h1 className="font-serif text-3xl font-bold tracking-tight md:text-5xl">{course.title}</h1>
              {course.description && (
                <p className="max-w-3xl text-base leading-relaxed text-slate-400">{course.description}</p>
              )}
            </div>

            <dl className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <dt className="sr-only">Lessons</dt>
                <Clock className="h-3.5 w-3.5" aria-hidden />
                <dd>
                  {course.lessons.length} lesson{course.lessons.length === 1 ? "" : "s"} · ~
                  {Math.max(1, Math.round(totalMinutes / 60))}h
                </dd>
              </div>
              <div className="flex items-center gap-1.5">
                <dt className="sr-only">Authored lessons</dt>
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                <dd>
                  {authoredCount} fully authored
                  {authoredCount < course.lessons.length && (
                    <span className="text-amber-400/80"> · {course.lessons.length - authoredCount} in preparation</span>
                  )}
                </dd>
              </div>
              {flatConcepts.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <dt className="sr-only">Concepts</dt>
                  <Brain className="h-3.5 w-3.5" aria-hidden />
                  <dd>
                    {flatConcepts.length} concept{flatConcepts.length === 1 ? "" : "s"} · {edgeCount} prerequisite links
                  </dd>
                </div>
              )}
              {course.clinicalCases.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <dt className="sr-only">Clinical cases</dt>
                  <Sparkles className="h-3.5 w-3.5" aria-hidden />
                  <dd>
                    {course.clinicalCases.length} clinical case{course.clinicalCases.length === 1 ? "" : "s"}
                  </dd>
                </div>
              )}
            </dl>

            {nextLesson && authoredCount > 0 && (
              <div className="pt-2">
                <Link
                  href={`/university/${course.slug}/lessons/${nextLesson.id}`}
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-gold px-6 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  {doneSet.size > 0
                    ? `Continue — lesson ${course.lessons.indexOf(nextLesson) + 1} of ${course.lessons.length}`
                    : "Start here — lesson 1"}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <p className="mt-2 text-xs text-slate-500">
                  {nextModule ? `${nextModule.title} · ` : ""}{nextLesson.title} · ~{nextLesson.estimatedMinutes} min
                </p>
              </div>
            )}

            {/* Nothing authored yet: say so plainly — never lead a student into
                a spine where every lesson is a placeholder. */}
            {authoredCount === 0 && (
              <div className="max-w-2xl rounded-xl border border-amber-500/30 bg-amber-500/[0.06] p-5">
                <p className="font-serif text-lg font-bold text-amber-200">This course is being written</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  The full structure is in place — every module, concept and lesson slot is real — but no
                  teaching content has been published yet. We are authoring it now, one reviewed lesson at
                  a time.
                </p>
                <Link
                  href="/university#waitlist"
                  className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-gold/40 bg-gold/10 px-5 py-2.5 text-sm font-semibold text-amber-200 transition-colors hover:bg-gold/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  Get notified when lessons open <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            )}
          </div>
        </header>

        {/* Progress + contents, side by side on wide screens */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <section className="space-y-6">
            <ProgressOverview
              courseId={course.id}
              lessonCount={course.lessons.length}
              totalUniversityLessons={catalogueLessons}
              totalUniversityCourses={catalogueCourses}
              userId={user?.id ?? null}
            />
            {flatConcepts.length > 0 && (
              <details className="group rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <summary className="flex cursor-pointer items-center justify-between gap-3 rounded text-sm font-semibold text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold">
                  <span className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-gold" aria-hidden />
                    Concept spine
                  </span>
                  <Link
                    href={`/university/${course.slug}/concepts`}
                    className="rounded text-xs font-medium text-gold underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    Full map →
                  </Link>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  {flatConcepts.length} connected concepts, held together by {edgeCount} prerequisite
                  links. The spine is the order the lessons are taught in and the map behind the
                  spaced-repetition scheduler.
                </p>
              </details>
            )}
          </section>

          <ModuleLessonNav
            courseSlug={course.slug}
            modules={navModules}
            orphanLessons={orphanLessons}
            completedLessonIds={completedLessonIds}
            nextLessonId={nextLesson?.id ?? null}
            defaultOpenModuleId={nextModule?.id ?? null}
          />
        </div>

        {/* Assessment routes — one compact row */}
        <nav aria-label="Assessments" className="flex flex-wrap gap-3 border-t border-white/5 pt-8">
          <Link
            href={`/university/${course.slug}/quiz`}
            className="inline-flex min-h-[44px] items-center rounded-xl border border-teal-500/40 bg-teal-500/10 px-5 py-2.5 text-sm font-semibold text-teal-200 transition-colors hover:bg-teal-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
          >
            Course quiz
          </Link>
          <Link
            href={`/university/${course.slug}/concepts`}
            className="inline-flex min-h-[44px] items-center rounded-xl border border-white/15 px-5 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:border-gold/50 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            Concept map
          </Link>
          <Link
            href={`/university/${course.slug}/exams`}
            className="inline-flex min-h-[44px] items-center rounded-xl border border-white/15 px-5 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:border-gold/50 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            Exam hall
          </Link>
          {!premium && (
            <Link
              href="/pricing"
              className="inline-flex min-h-[44px] items-center rounded-xl border border-gold/40 px-5 py-2.5 text-sm font-semibold text-gold transition-colors hover:bg-gold/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              Premium — full access
            </Link>
          )}
        </nav>

        <AlignmentDisclaimer />
      </div>
    </main>
  );
}
