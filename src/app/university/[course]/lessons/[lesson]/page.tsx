import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import LessonRenderer from "@/components/university/LessonRenderer";
import AddToRevision from "@/components/university/AddToRevision";
import ContentReportTab from "@/components/ContentReportTab";
import CourseCompletionButton from "@/components/CourseCompletionButton";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, ChevronRight, Clock, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Lesson — Gnostiri University",
  description: "A focused lesson study page — read the material, then add its concept to your revision queue.",
};

interface PageProps {
  params: Promise<{ course: string; lesson: string }>;
}

export default async function LessonPage({ params }: PageProps) {
  const { course: courseSlug, lesson: lessonId } = await params;

  const course = await prisma.course.findFirst({
    where: { slug: courseSlug, domain: "university", isPublished: true },
    select: {
      id: true,
      slug: true,
      title: true,
      code: true,
      lessons: {
        orderBy: { orderIndex: "asc" },
        select: { id: true, title: true, orderIndex: true },
      },
      modules: { orderBy: { orderIndex: "asc" }, select: { id: true, title: true, slug: true } },
      concepts: { orderBy: { orderIndex: "asc" }, select: { id: true, title: true, slug: true, moduleId: true, orderIndex: true, bloomsLevel: true, estMinutes: true } },
    },
  });
  if (!course) notFound();

  const lesson = await prisma.courseLesson.findFirst({
    where: { id: lessonId, courseId: course.id },
  });
  if (!lesson) notFound();

  // The seed aligns each lesson to the concept at the same orderIndex within
  // the course, so we look up the concept that this lesson teaches — and,
  // through it, the module this lesson belongs to.
  const concept = course.concepts.find((c) => c.orderIndex === lesson.orderIndex);
  const parentModule = concept?.moduleId ? course.modules.find((m) => m.id === concept.moduleId) : undefined;
  const moduleOfLesson = (l: { orderIndex: number }) =>
    course.concepts.find((x) => x.orderIndex === l.orderIndex)?.moduleId ?? null;

  // The module → lesson spine, in teaching order. Lessons whose concept has no
  // module are kept as a trailing group, so every lesson stays reachable.
  const moduleGroups = course.modules
    .map((m) => ({ id: m.id, title: m.title, lessons: course.lessons.filter((l) => moduleOfLesson(l) === m.id) }))
    .filter((g) => g.lessons.length > 0);
  const ungrouped = course.lessons.filter((l) => moduleOfLesson(l) == null);
  if (ungrouped.length > 0) moduleGroups.push({ id: "ungrouped", title: "Further lessons", lessons: ungrouped });
  const groupIndex = moduleGroups.findIndex((g) => g.lessons.some((l) => l.id === lesson.id));
  const group = moduleGroups[groupIndex];
  const groupLessons = group?.lessons ?? course.lessons;
  const positionInModule = groupLessons.findIndex((l) => l.id === lesson.id);
  const positionInCourse = course.lessons.findIndex((l) => l.id === lesson.id);

  // Prev / next walk the spine: within the module first, then across a module
  // boundary with the destination named, so the student always knows where the
  // link goes before taking it.
  const nextInModule = groupLessons[positionInModule + 1];
  const nextModuleGroup = moduleGroups[groupIndex + 1];
  const nextLesson = nextInModule ?? nextModuleGroup?.lessons[0];
  const nextLabel = nextInModule ? "Next lesson" : nextModuleGroup ? "Next module" : null;
  const nextSub = nextInModule ? nextInModule.title : nextModuleGroup ? nextModuleGroup.title : null;
  const prevInModule = groupLessons[positionInModule - 1];
  const prevModuleGroup = moduleGroups[groupIndex - 1];
  const prevLesson = prevInModule ?? prevModuleGroup?.lessons[prevModuleGroup.lessons.length - 1];
  const prevLabel = prevInModule ? "Previous lesson" : prevModuleGroup ? "Previous module" : null;
  const prevSub = prevInModule ? prevInModule.title : prevModuleGroup ? prevModuleGroup.title : null;

  const user = await getCurrentUser();
  const conceptId = concept?.id;
  const completed = user
    ? await prisma.progress.findMany({
        where: { userId: user.id, domain: "university", entityType: "courseLesson", status: "completed" },
        select: { entityId: true },
      })
    : [];
  const doneIds = new Set(completed.map((c) => c.entityId));
  const isDone = doneIds.has(lesson.id);

  return (
    <main className="min-h-screen bg-transparent text-slate-100">
      <div className="mx-auto max-w-3xl px-6 py-10 md:py-14 space-y-8">
        {/* Breadcrumb: university → course → module → lesson */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
          <Link
            href="/university"
            className="inline-flex items-center gap-1.5 rounded transition-colors hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden /> University
          </Link>
          <span className="text-slate-600" aria-hidden>/</span>
          <Link
            href={`/university/${course.slug}`}
            className="rounded transition-colors hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            {course.title}
          </Link>
          {parentModule && (
            <>
              <span className="text-slate-600" aria-hidden>/</span>
              <span className="text-slate-400">{parentModule.title}</span>
            </>
          )}
          <span className="text-slate-600" aria-hidden>/</span>
          <span className="truncate text-slate-300">{lesson.title}</span>
        </nav>

        {/* Header */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 font-semibold text-teal-200">
              <BookOpen className="h-3.5 w-3.5" aria-hidden />
              Lesson {positionInCourse + 1} of {course.lessons.length}
            </span>
            {parentModule && (
              <span className="text-slate-400">
                {parentModule.title}
                {positionInModule >= 0 && ` · lesson ${positionInModule + 1} of ${groupLessons.length}`}
              </span>
            )}
            {concept && (
              <Link
                href={`/university/${course.slug}/concepts`}
                className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 font-semibold text-violet-200 transition-colors hover:border-violet-400/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <Sparkles className="h-3.5 w-3.5" aria-hidden /> {concept.title}
              </Link>
            )}
            <span className="inline-flex items-center gap-1.5 text-slate-500">
              <Clock className="h-3.5 w-3.5" aria-hidden /> ~{lesson.estimatedMinutes} min
            </span>
            {isDone && (
              <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-300">
                <CheckCircle2 className="h-3.5 h-3.5" aria-hidden /> Completed
              </span>
            )}
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight md:text-4xl">{lesson.title}</h1>
          {concept && concept.bloomsLevel && (
            <p className="text-sm text-slate-500">
              {concept.bloomsLevel} · {concept.estMinutes} min concept
            </p>
          )}
        </header>

        {/* Body — the renderer covers every block type, so nothing is dropped */}
        <article>
          <LessonRenderer content={lesson.content as never} />
        </article>

        {/* Study-loop handoff */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
          {concept ? (
            <AddToRevision conceptId={concept.id} conceptTitle={concept.title} authenticated={Boolean(user)} />
          ) : (
            <p className="text-sm text-slate-400">
              This lesson has no linked concept. It can still be read, but there is nothing to add to
              your revision queue.
            </p>
          )}
          <div className="mt-6 border-t border-white/5 pt-5">
            {user ? (
              <CourseCompletionButton courseId={course.id} lessonId={lesson.id} locked={false} />
            ) : (
              <p className="text-sm text-slate-400">
                <Link
                  href="/login"
                  className="rounded font-semibold text-gold underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  Sign in
                </Link>{" "}
                to mark this lesson complete and track it on your transcript.
              </p>
            )}
          </div>
        </div>

        <ContentReportTab
          domain="university"
          targetType="lesson"
          targetId={lesson.id}
          targetUrl={`/university/${course.slug}/lessons/${lesson.id}`}
          targetTitle={lesson.title}
          authenticated={Boolean(user)}
        />

        {/* Prev / Next — the plain keyboard path: Tab, then Enter. Within the
            module first; across a module boundary the destination is named. */}
        <nav aria-label="Lesson navigation" className="flex items-center justify-between gap-3 border-t border-white/5 pt-6">
          {prevLesson && prevLabel ? (
            <Link
              href={`/university/${course.slug}/lessons/${prevLesson.id}`}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg text-sm text-slate-400 transition-colors hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              <span className="text-left">
                <span className="block">{prevLabel}</span>
                {prevSub && <span className="block text-[11px] text-slate-500">{prevSub}</span>}
              </span>
            </Link>
          ) : (
            <Link
              href={`/university/${course.slug}`}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg text-sm text-slate-400 transition-colors hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden /> Course contents
            </Link>
          )}
          {nextLesson && nextLabel ? (
            <Link
              href={`/university/${course.slug}/lessons/${nextLesson.id}`}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg text-right text-sm font-semibold text-gold transition-colors hover:text-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <span>
                <span className="block">{nextLabel}</span>
                {nextSub && <span className="block text-[11px] font-normal text-slate-400">{nextSub}</span>}
              </span>
              <ChevronRight className="h-4 w-4" aria-hidden />
            </Link>
          ) : (
            <Link
              href={`/university/${course.slug}/concepts`}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg text-sm font-semibold text-gold transition-colors hover:text-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              Concept map <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          )}
        </nav>
      </div>
    </main>
  );
}
