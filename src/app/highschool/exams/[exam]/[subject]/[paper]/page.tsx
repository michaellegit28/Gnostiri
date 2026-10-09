import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/db";
import { ChevronRight, Clock, Target, HelpCircle, Timer, BookOpenCheck, ScrollText } from "lucide-react";
import { resolvePaper, paperUrl } from "@/lib/papers";

export const dynamic = "force-dynamic";

interface PaperPageProps {
  params: {
    exam: string;
    subject: string;
    paper: string;
  };
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

// Paper overview: format, duration, marks, and the two ways to sit the paper.
export default async function PaperOverviewPage({ params }: PaperPageProps) {
  const resolved = await resolvePaper(params.exam, params.subject, params.paper);
  if (!resolved) notFound();

  const { examination, paper } = resolved;
  const questionCount = await prisma.paperQuestion.count({ where: { paperId: paper.id } });
  const base = paperUrl(examination.slug, paper.subject, paper.year, paper.paperNumber);

  return (
    <div className="min-h-screen bg-transparent text-slate-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
          <Link href="/highschool" className="hover:text-amber-400 transition-colors">High School</Link>
          <ChevronRight className="w-4 h-4 text-slate-600" />
          <Link href="/highschool/exams" className="hover:text-amber-400 transition-colors">Exams</Link>
          <ChevronRight className="w-4 h-4 text-slate-600" />
          <Link href={`/highschool/exams/${examination.slug}`} className="hover:text-amber-400 transition-colors">
            {examination.name.toUpperCase()}
          </Link>
          <ChevronRight className="w-4 h-4 text-slate-600" />
          <Link href={`/highschool/exams/${examination.slug}/${params.subject}`} className="hover:text-amber-400 transition-colors">
            {paper.subject}
          </Link>
          <ChevronRight className="w-4 h-4 text-slate-600" />
          <span className="text-slate-100 font-medium">{paper.year} · {paper.paperNumber}</span>
        </nav>

        {/* Header */}
        <header className="relative overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(110%_100%_at_50%_0%,#14213d_0%,#0a0f22_55%,#060814_100%)] p-8 md:p-12 space-y-4">
          <p className="text-teal-300 text-xs font-semibold uppercase tracking-[0.25em]">
            {examination.name.toUpperCase()} · {paper.subject}
          </p>
          <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tight">
            {paper.year} <span className="text-[#D4AF37]">{paper.paperNumber}</span>
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>{formatDuration(paper.durationMinutes)} duration</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-slate-500" />
              <span>{paper.totalMarks} marks</span>
            </div>
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-slate-500" />
              <span>{questionCount} question{questionCount === 1 ? "" : "s"}</span>
            </div>
          </div>
        </header>

        {/* Ways to sit the paper */}
        {questionCount === 0 ? (
          <section className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-center space-y-3">
            <ScrollText className="w-8 h-8 text-slate-500 mx-auto" />
            <h2 className="font-serif text-2xl font-bold">Questions are being transcribed</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              The format and marking scheme for this paper are ready, but its questions have not been
              transcribed yet. Check back soon.
            </p>
          </section>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col justify-between bg-slate-900/80 border border-slate-800 rounded-xl p-6 hover:border-amber-500/40 transition-all">
              <div>
                <Timer className="w-8 h-8 text-amber-400 mb-4" />
                <h2 className="text-2xl font-serif font-bold mb-2">Timed attempt</h2>
                <p className="text-slate-400 text-sm mb-6">
                  Exam conditions: a {formatDuration(paper.durationMinutes)} countdown, answers locked
                  when time runs out. Attempt saved to your account.
                </p>
              </div>
              <Link
                href={`${base}/take`}
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-amber-500 text-slate-950 font-semibold text-sm hover:bg-amber-400 transition-colors"
              >
                Start timed attempt
              </Link>
            </div>
            <div className="flex flex-col justify-between bg-slate-900/80 border border-slate-800 rounded-xl p-6 hover:border-teal-500/40 transition-all">
              <div>
                <BookOpenCheck className="w-8 h-8 text-teal-300 mb-4" />
                <h2 className="text-2xl font-serif font-bold mb-2">Open practice</h2>
                <p className="text-slate-400 text-sm mb-6">
                  No clock. Sit the same paper at your own pace — ideal for first revision passes
                  before testing yourself under time.
                </p>
              </div>
              <Link
                href={`${base}/take?mode=open`}
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-teal-500 text-slate-950 font-semibold text-sm hover:bg-teal-400 transition-colors"
              >
                Start open practice
              </Link>
            </div>
          </div>
        )}

        {/* Marking scheme */}
        <Link
          href={`${base}/review`}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-5 hover:border-slate-600 transition-colors group"
        >
          <div>
            <div className="font-semibold text-slate-100 group-hover:text-amber-400 transition-colors">
              Marking scheme & review
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Correct answers, mark allocations, and explanations for every question
              {paper.markingSchemeUrl ? ", plus the official scheme" : ""}.
            </p>
          </div>
          <span className="text-sm text-slate-400 group-hover:text-amber-400 transition-colors shrink-0">Open →</span>
        </Link>
      </div>
    </div>
  );
}
