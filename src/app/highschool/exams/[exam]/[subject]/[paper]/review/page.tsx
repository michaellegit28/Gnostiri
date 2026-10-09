import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { ChevronRight, Target, ExternalLink, CheckCircle2, XCircle } from "lucide-react";
import { resolvePaper, paperUrl } from "@/lib/papers";

export const dynamic = "force-dynamic";

interface ReviewPageProps {
  params: {
    exam: string;
    subject: string;
    paper: string;
  };
}

// Marking scheme review: every question with the correct answer, mark
// allocation, and explanation. Signed-in learners also see their latest
// attempt answers marked against the scheme.
export default async function PaperReviewPage({ params }: ReviewPageProps) {
  const resolved = await resolvePaper(params.exam, params.subject, params.paper);
  if (!resolved) notFound();

  const { examination, paper } = resolved;
  const questions = await prisma.paperQuestion.findMany({
    where: { paperId: paper.id },
    orderBy: { orderIndex: "asc" },
  });

  const user = await getCurrentUser();
  let latestAttempt: { score: number; maxScore: number; mode: string; answers: unknown } | null = null;
  if (user) {
    const attempt = await prisma.paperAttempt.findFirst({
      where: { userId: user.id, paperId: paper.id },
      orderBy: { createdAt: "desc" },
    });
    if (attempt) {
      latestAttempt = {
        score: attempt.score,
        maxScore: attempt.maxScore,
        mode: attempt.mode,
        answers: attempt.answers,
      };
    }
  }

  const answerByQuestion = new Map<string, string | null>();
  if (latestAttempt && Array.isArray(latestAttempt.answers)) {
    for (const entry of latestAttempt.answers as { questionId?: string; selectedAnswer?: string | null }[]) {
      answerByQuestion.set(String(entry.questionId), entry.selectedAnswer ?? null);
    }
  }

  const base = paperUrl(examination.slug, paper.subject, paper.year, paper.paperNumber);

  return (
    <div className="min-h-screen bg-transparent text-slate-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
          <Link href="/highschool/exams" className="hover:text-amber-400 transition-colors">Exams</Link>
          <ChevronRight className="w-4 h-4 text-slate-600" />
          <Link href={`/highschool/exams/${examination.slug}`} className="hover:text-amber-400 transition-colors">
            {examination.name.toUpperCase()}
          </Link>
          <ChevronRight className="w-4 h-4 text-slate-600" />
          <Link href={base} className="hover:text-amber-400 transition-colors">
            {paper.subject} {paper.year} · {paper.paperNumber}
          </Link>
          <ChevronRight className="w-4 h-4 text-slate-600" />
          <span className="text-slate-100 font-medium">Marking scheme</span>
        </nav>

        {/* Header */}
        <header className="space-y-3">
          <p className="text-teal-300 text-xs font-semibold uppercase tracking-[0.25em]">
            Marking scheme · {examination.name.toUpperCase()}
          </p>
          <h1 className="text-3xl md:text-4xl font-serif font-bold">
            {paper.subject} {paper.year} — {paper.paperNumber}
          </h1>
          {paper.markingSchemeUrl && (
            <a
              href={paper.markingSchemeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-amber-400 hover:underline"
            >
              <ExternalLink className="w-4 h-4" />
              Official marking scheme (PDF)
            </a>
          )}
        </header>

        {/* Latest attempt */}
        {latestAttempt && (
          <section className="rounded-xl border border-[#D4AF37]/30 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 p-6 space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Your latest attempt</p>
            <p className="text-3xl font-serif font-bold text-[#D4AF37]">
              {latestAttempt.score}/{latestAttempt.maxScore} marks
            </p>
            <p className="text-sm text-slate-400 capitalize">{latestAttempt.mode} attempt</p>
          </section>
        )}

        {/* Questions */}
        {questions.length === 0 ? (
          <section className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-center space-y-3">
            <p className="text-slate-400 text-sm">
              Questions for this paper have not been transcribed yet — nothing to review.
            </p>
            <Link href={base} className="inline-flex rounded-lg bg-amber-500 px-5 py-3 font-semibold text-slate-950">
              ← Back to paper
            </Link>
          </section>
        ) : (
          <div className="space-y-6">
            {questions.map((question, index) => {
              const options = Array.isArray(question.options) ? question.options.map(String) : [];
              const userAnswer = answerByQuestion.get(question.id) ?? null;
              const wasCorrect =
                userAnswer != null && userAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
              return (
                <article key={question.id} className="space-y-3 rounded-xl border border-slate-800 bg-slate-900 p-5 md:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-base md:text-lg font-semibold">
                      <span className="text-slate-500 font-serif mr-2">Q{index + 1}.</span>
                      {question.questionText}
                    </h2>
                    <span className="shrink-0 inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/50">
                      <Target className="w-3.5 h-3.5 text-amber-500" />
                      {question.marks} mark{question.marks === 1 ? "" : "s"}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {options.map((option) => (
                      <li
                        key={option}
                        className={`rounded-lg border px-4 py-2.5 min-h-11 flex items-center gap-3 ${
                          option === question.correctAnswer
                            ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-200"
                            : userAnswer === option
                              ? "border-rose-500/60 bg-rose-500/10"
                              : "border-slate-800 text-slate-300"
                        }`}
                      >
                        <span>{option}</span>
                        {option === question.correctAnswer && (
                          <span className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                            <CheckCircle2 className="w-4 h-4" />
                            Correct answer
                          </span>
                        )}
                        {option !== question.correctAnswer && userAnswer === option && (
                          <span className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400">
                            <XCircle className="w-4 h-4" />
                            Your answer
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                  {question.explanation && (
                    <p className="rounded-lg bg-slate-950 border border-slate-800 p-4 text-sm text-slate-300">
                      {question.explanation}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        )}

        {questions.length > 0 && (
          <div className="flex flex-wrap gap-3">
            <Link href={`${base}/take`} className="rounded-lg bg-amber-500 px-5 py-3 font-semibold text-slate-950">
              Sit this paper
            </Link>
            <Link href={`/highschool/exams/${examination.slug}`} className="rounded-lg border border-slate-700 px-5 py-3 font-semibold text-slate-200 hover:border-slate-500">
              More {examination.name.toUpperCase()} papers
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
