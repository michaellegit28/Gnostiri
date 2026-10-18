import { ExamHall } from "@/components/university/ExamHall";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";
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
    select: { id: true, title: true },
  });
  if (!course) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <header className="border-b pb-8">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">Exam Hall</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{course.title}</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          {examMode === "timed"
            ? "A blueprint-balanced paper drawn from published items across this course. Negative marking applies, answers are revealed only on submission, and the clock auto-submits."
            : "An open-book attempt on the same blueprint. No time pressure, and practice sittings do not graduate concepts."}
        </p>
      </header>

      <div className="mt-8 flex gap-2">
        <a
          href={`/university/${slug}/exams?mode=timed`}
          className={`rounded-lg border px-4 py-2 text-sm font-medium ${examMode === "timed" ? "border-primary bg-primary/5 text-primary" : "hover:bg-muted/50"}`}
        >
          Timed
        </a>
        <a
          href={`/university/${slug}/exams?mode=open`}
          className={`rounded-lg border px-4 py-2 text-sm font-medium ${examMode === "open" ? "border-primary bg-primary/5 text-primary" : "hover:bg-muted/50"}`}
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