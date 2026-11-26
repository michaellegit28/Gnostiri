import { ExamHall } from "@/components/university/ExamHall";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exam Hall — Gnostiri University",
  description: "Timed, blueprint-balanced examinations with negative marking.",
};

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ course: string }>;
  searchParams: Promise<{ mode?: string }>;
}

export default async function ExamPage({ params, searchParams }: PageProps) {
  const { course: slug } = await params;
  const { mode } = await searchParams;
  const examMode = mode === "open" ? "open" : "timed";

  const course = await prisma.course.findFirst({
    where: { domain: "university", slug, isPublished: true },
    select: { id: true, title: true, code: true },
  });
  if (!course) notFound();
  // University course examinations are named GC-(course name & code).
  const examTitle = course.code ? `GC-${course.title} (${course.code})` : `GC-${course.title}`;

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-slate-400">
        <Link
          href="/university"
          className="inline-flex items-center rounded transition-colors hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          University
        </Link>
        <span className="text-slate-600" aria-hidden>/</span>
        <Link
          href={`/university/${slug}`}
          className="rounded transition-colors hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          {course.title}
        </Link>
        <span className="text-slate-600" aria-hidden>/</span>
        <span className="text-slate-300">Exam hall</span>
      </nav>
      <header className="border-b pb-8">
        <p className="text-sm font-medium uppercase tracking-widest text-slate-400">Course exam hall</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{examTitle}</h1>
      </header>

      <div className="mt-8 flex gap-2">
        <a
          href={`/university/${slug}/exams?mode=timed`}
          className={`rounded-lg border border-line px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-100 ${examMode === "timed" ? "border-gold bg-gold text-on-gold" : "hover:bg-slate-500/10"}`}
        >
          Timed
        </a>
        <a
          href={`/university/${slug}/exams?mode=open`}
          className={`rounded-lg border border-line px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-100 ${examMode === "open" ? "border-gold bg-gold text-on-gold" : "hover:bg-slate-500/10"}`}
        >
          Open book
        </a>
      </div>

      <div className="mt-8">
        <ExamHall courseId={course.id} mode={examMode} />
      </div>
    </main>
  );
}