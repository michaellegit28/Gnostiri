import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/db";
import { ChevronRight } from "lucide-react";
import { resolvePaper, paperUrl } from "@/lib/papers";
import AttemptClient from "./AttemptClient";

export const dynamic = "force-dynamic";

interface TakePageProps {
  params: {
    exam: string;
    subject: string;
    paper: string;
  };
  searchParams?: { mode?: string };
}

// Attempt player: questions without answers go to the client; grading and
// attempt-saving happen server-side via /api/papers/[paperId]/attempt.
export default async function TakePaperPage({ params, searchParams }: TakePageProps) {
  const resolved = await resolvePaper(params.exam, params.subject, params.paper);
  if (!resolved) notFound();

  const { examination, paper } = resolved;
  const mode = searchParams?.mode === "open" ? "open" : "timed";

  const questions = await prisma.paperQuestion.findMany({
    where: { paperId: paper.id },
    orderBy: { orderIndex: "asc" },
    select: { id: true, questionText: true, options: true },
  });

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-transparent text-slate-50 p-6 md:p-12">
        <div className="max-w-3xl mx-auto space-y-6 text-center py-20">
          <h1 className="font-serif text-3xl font-bold">This paper has no questions transcribed yet</h1>
          <Link
            href={paperUrl(examination.slug, paper.subject, paper.year, paper.paperNumber)}
            className="inline-flex rounded-lg bg-amber-500 px-5 py-3 font-semibold text-slate-950"
          >
            ← Back to paper
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-slate-50 p-4 md:p-10">
      <div className="max-w-3xl mx-auto space-y-4">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
          <Link href="/highschool/exams" className="hover:text-amber-400 transition-colors">Exams</Link>
          <ChevronRight className="w-4 h-4 text-slate-600" />
          <Link href={`/highschool/exams/${examination.slug}`} className="hover:text-amber-400 transition-colors">
            {examination.name.toUpperCase()}
          </Link>
          <ChevronRight className="w-4 h-4 text-slate-600" />
          <Link href={paperUrl(examination.slug, paper.subject, paper.year, paper.paperNumber)} className="hover:text-amber-400 transition-colors">
            {paper.subject} {paper.year}
          </Link>
          <ChevronRight className="w-4 h-4 text-slate-600" />
          <span className="text-slate-100 font-medium">{mode === "timed" ? "Timed attempt" : "Open practice"}</span>
        </nav>

        <AttemptClient
          paperId={paper.id}
          backUrl={paperUrl(examination.slug, paper.subject, paper.year, paper.paperNumber)}
          examName={examination.name.toUpperCase()}
          subjectTitle={paper.subject}
          year={paper.year}
          paperNumber={paper.paperNumber}
          durationMinutes={paper.durationMinutes}
          mode={mode}
          questions={questions.map((q) => ({
            id: q.id,
            questionText: q.questionText,
            options: Array.isArray(q.options) ? q.options.map(String) : [],
          }))}
        />
      </div>
    </div>
  );
}
