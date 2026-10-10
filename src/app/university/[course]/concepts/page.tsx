import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/db";
import ConceptSpine from "@/components/university/ConceptSpine";
import { ArrowLeft, Brain } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Concept map — Gnostiri University",
  description: "The connected concept spine of this course — how knowledge actually links together.",
};

export default async function ConceptMapPage({ params }: { params: { course: string } }) {
  const course = await prisma.course.findFirst({
    where: { slug: params.course, domain: "university", isPublished: true },
    include: {
      modules: {
        orderBy: { orderIndex: "asc" },
        include: {
          concepts: {
            orderBy: { orderIndex: "asc" },
            include: { prerequisites: { select: { prerequisiteId: true } } },
          },
        },
      },
      concepts: { orderBy: { orderIndex: "asc" } },
    },
  });
  if (!course) notFound();

  const flat = course.concepts.length > 0 ? course.concepts : course.modules.flatMap((m) => m.concepts);
  const edgeCount = course.modules.reduce(
    (s, m) => s + m.concepts.reduce((a, c) => a + c.prerequisites.length, 0),
    0
  );

  return (
    <main className="min-h-screen bg-transparent text-slate-100">
      <div className="mx-auto max-w-4xl px-6 py-10 md:py-14 space-y-8">
        <nav className="flex items-center gap-2 text-sm text-slate-400">
          <Link href={`/university/${course.slug}`} className="hover:text-amber-400 transition-colors inline-flex items-center gap-1.5">
            <ArrowLeft className="w-4 h-4" /> {course.title}
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-slate-300">Concept map</span>
        </nav>

        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 text-xs font-semibold border border-violet-500/30">
            <Brain className="w-4 h-4" />
            <span>How knowledge connects</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight">
            Concept map — {course.title}
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl">
            Every concept is a node; every prerequisite is an edge. Mastery flows along the
            spine — you cannot reach a node before its foundations stand.
          </p>
          <div className="flex items-center gap-5 text-xs text-slate-500 pt-1">
            <span>{flat.length} concepts</span>
            <span>·</span>
            <span>{edgeCount} prerequisite links</span>
            <span>·</span>
            <span>{course.modules.length || 1} module{course.modules.length === 1 ? "" : "s"}</span>
          </div>
        </header>

        <ConceptSpine concepts={flat} modules={course.modules} />

        <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-800/80 pt-6">
          The concept map is the planning backbone for the spaced-repetition scheduler and the
          competency transcript — both arrive with the pedagogy engine in a later phase.
        </p>
      </div>
    </main>
  );
}
