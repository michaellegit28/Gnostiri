import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/db";
import { ChevronRight, Clock, Target, FileText, ArrowRight } from "lucide-react";
import { subjectSlugOf, paperSlugOf, paperUrl } from "@/lib/papers";

export const dynamic = "force-dynamic";

interface SubjectPageProps {
  params: {
    exam: string;
    subject: string;
  };
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

// All published papers for one subject of one board, newest year first.
export default async function ExamSubjectPage({ params }: SubjectPageProps) {
  const examination = await prisma.examination.findFirst({
    where: {
      domain: "highschool",
      slug: { equals: params.exam.toLowerCase(), mode: "insensitive" },
    },
  });
  if (!examination) notFound();

  const papers = await prisma.examPaper.findMany({
    where: { examinationId: examination.id, isPublished: true },
    orderBy: [{ year: "desc" }, { paperNumber: "asc" }],
  });
  const subjectPapers = papers.filter((p) => subjectSlugOf(p.subject) === params.subject.toLowerCase());
  if (subjectPapers.length === 0) notFound();
  const subjectTitle = subjectPapers[0].subject;

  return (
    <div className="min-h-screen bg-transparent text-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-400">
          <Link href="/highschool/exams" className="hover:text-amber-400 transition-colors">Exams</Link>
          <ChevronRight className="w-4 h-4 text-slate-600" />
          <Link href={`/highschool/exams/${examination.slug}`} className="hover:text-amber-400 transition-colors">
            {examination.name.toUpperCase()}
          </Link>
          <ChevronRight className="w-4 h-4 text-slate-600" />
          <span className="text-slate-100 font-medium">{subjectTitle}</span>
        </nav>

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-teal-300" />
            <h1 className="text-3xl md:text-4xl font-serif font-bold">{subjectTitle}</h1>
          </div>
          <span className="text-xs text-slate-500">
            {examination.name.toUpperCase()} · {subjectPapers.length} paper{subjectPapers.length === 1 ? "" : "s"}
          </span>
        </div>

        {/* Papers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjectPapers.map((paper) => (
            <Link
              key={paper.id}
              href={paperUrl(examination.slug, paper.subject, paper.year, paper.paperNumber)}
              className="flex flex-col justify-between bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-lg hover:border-amber-500/40 transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <span className="font-serif text-3xl font-bold text-amber-400 group-hover:text-amber-300">
                    {paper.year}
                  </span>
                  <span className="text-xs font-medium text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/50">
                    {paper.paperNumber}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span>{formatDuration(paper.durationMinutes)} duration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-slate-500" />
                    <span>{paper.totalMarks} marks</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800 text-xs font-semibold text-slate-500 group-hover:text-amber-400 transition-colors">
                Open paper →
              </div>
            </Link>
          ))}
        </div>

        <Link
          href={`/highschool/exams/${examination.slug}`}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          All {examination.name.toUpperCase()} subjects
        </Link>
      </div>
    </div>
  );
}
