import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import LessonRenderer from "@/components/university/LessonRenderer";
import AddToRevision from "@/components/university/AddToRevision";
import { ArrowLeft, BookOpen, ChevronRight, Clock, Sparkles } from "lucide-react";
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
    select: { id: true, slug: true, title: true },
  });
  if (!course) notFound();

  const lesson = await prisma.courseLesson.findFirst({
    where: { id: lessonId, courseId: course.id },
  });
  if (!lesson) notFound();

  // The seed aligns each lesson to the concept at the same orderIndex within
  // the course, so we look up the concept that this lesson teaches.
  const concept = await prisma.conceptNode.findFirst({
    where: { courseId: course.id, orderIndex: lesson.orderIndex },
    select: { id: true, title: true, slug: true, bloomsLevel: true, estMinutes: true },
  });

  // Find the next lesson in the course for the continuation link.
  const nextLesson = await prisma.courseLesson.findFirst({
    where: { courseId: course.id, orderIndex: { gt: lesson.orderIndex } },
    orderBy: { orderIndex: "asc" },
    select: { id: true, title: true, orderIndex: true },
  });

  const prevLesson = await prisma.courseLesson.findFirst({
    where: { courseId: course.id, orderIndex: { lt: lesson.orderIndex } },
    orderBy: { orderIndex: "desc" },
    select: { id: true, title: true, orderIndex: true },
  });

  const user = await getCurrentUser();
  const conceptId = concept?.id;

  return (
    <main className="min-h-screen bg-transparent text-slate-100">
      <div className="mx-auto max-w-3xl px-6 py-10 md:py-14 space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-400 flex-wrap">
          <Link href="/university" className="hover:text-amber-400 transition-colors inline-flex items-center gap-1.5">
            <ArrowLeft className="w-4 h-4" /> University
          </Link>
          <span className="text-slate-600">/</span>
          <Link href={`/university/${course.slug}`} className="hover:text-amber-400 transition-colors">
            {course.title}
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-slate-300 truncate max-w-[40vw]">{lesson.title}</span>
        </nav>

        {/* Header */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 font-semibold border border-teal-500/30">
              <BookOpen className="w-3.5 h-3.5" /> Lesson {lesson.orderIndex + 1}
            </span>
            {concept && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 font-semibold border border-violet-500/30">
                <Sparkles className="w-3.5 h-3.5" /> {concept.title}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 text-slate-500">
              <Clock className="w-3.5 h-3.5" /> ~{lesson.estimatedMinutes} min
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight">{lesson.title}</h1>
          {concept && concept.bloomsLevel && (
            <p className="text-slate-500 text-sm">
              {concept.bloomsLevel} · {concept.estMinutes} min concept
            </p>
          )}
        </header>

        {/* Body */}
        <div className="prose-invert">
          <LessonRenderer content={lesson.content as never} />
        </div>

        {/* Study-loop handoff */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8 space-y-4">
          {concept ? (
            <AddToRevision conceptId={concept.id} conceptTitle={concept.title} authenticated={Boolean(user)} />
          ) : (
            <p className="text-sm text-slate-400">
              This lesson has no linked concept. It can still be read, but there is nothing to add
              to your revision queue.
            </p>
          )}
        </div>

        {/* Prev / Next navigation */}
        <div className="flex items-center justify-between gap-3 border-t border-slate-800/80 pt-6">
          {prevLesson ? (
            <Link
              href={`/university/${course.slug}/lessons/${prevLesson.id}`}
              className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-amber-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> {prevLesson.title}
            </Link>
          ) : (
            <span />
          )}
          {nextLesson ? (
            <Link
              href={`/university/${course.slug}/lessons/${nextLesson.id}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#D4AF37] hover:text-amber-300 transition-colors"
            >
              {nextLesson.title} <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              href={`/university/${course.slug}/concepts`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-300 hover:text-emerald-200 transition-colors"
            >
              Review the concept Map <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
