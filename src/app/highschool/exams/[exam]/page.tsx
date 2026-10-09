import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/db";
import { SectionMark } from "@/components/logo/GnostiriLogo";
import { BellPlus, ChevronRight, Clock, FileText, Target } from "lucide-react";
import { paperUrl, subjectSlugOf } from "@/lib/papers";

export const dynamic = "force-dynamic";

interface PaperSummary {
  id: string;
  subject: string;
  year: number;
  paperNumber: string;
  durationMinutes: number;
  totalMarks: number;
}

interface SubjectGroup {
  subject: string;
  papers: PaperSummary[];
}

interface BoardPageProps {
  params: {
    exam: string;
  };
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
  if (hours > 0) return `${hours}h`;
  return `${mins}m`;
}

// Board page: published past papers for one examination, grouped by subject.
// Papers are display-only in this phase; timed attempts (/take) and marking
// scheme review (/review) arrive in later steps.
export default async function ExamBoardPage({ params }: BoardPageProps) {
  const examSlug = params.exam.toLowerCase();

  const examination = await prisma.examination.findFirst({
    where: {
      domain: "highschool",
      slug: {
        equals: examSlug,
        mode: "insensitive",
      },
    },
    include: {
      papers: {
        where: { isPublished: true },
        orderBy: [{ subject: "asc" }, { year: "desc" }, { paperNumber: "asc" }],
      },
    },
  });

  if (!examination) {
    notFound();
  }

  // Group papers by subject, newest year first — the board grows by data, never redesign.
  const bySubject = new Map<string, PaperSummary[]>();
  for (const paper of examination.papers) {
    const summary: PaperSummary = {
      id: paper.id,
      subject: paper.subject,
      year: paper.year,
      paperNumber: paper.paperNumber,
      durationMinutes: paper.durationMinutes,
      totalMarks: paper.totalMarks,
    };
    if (!bySubject.has(paper.subject)) bySubject.set(paper.subject, []);
    bySubject.get(paper.subject)!.push(summary);
  }
  const groups: SubjectGroup[] = Array.from(bySubject, ([subject, papers]) => ({
    subject,
    papers,
  }));

  return (
    <div className="min-h-screen bg-transparent text-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-400">
          <Link href="/highschool" className="hover:text-amber-400 transition-colors">High School</Link>
          <ChevronRight className="w-4 h-4 text-slate-600" />
          <Link href="/highschool/exams" className="hover:text-amber-400 transition-colors">Exams</Link>
          <ChevronRight className="w-4 h-4 text-slate-600" />
          <span className="text-slate-100 font-medium">{examination.name.toUpperCase()}</span>
        </nav>

        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(110%_100%_at_50%_0%,#14213d_0%,#0a0f22_55%,#060814_100%)] px-6 py-12 md:px-12 md:py-16 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 text-xs font-semibold border border-teal-500/30">
            <SectionMark variant="school" className="w-4 h-4" accent="#14B8A6" />
            <span>High School · Exams</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tight">
            {examination.name.toUpperCase()} <span className="text-[#D4AF37]">past papers</span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">
            {examination.country ? `${examination.country} — ` : ""}
            {groups.length} subject{groups.length === 1 ? "" : "s"}, {examination.papers.length} published paper{examination.papers.length === 1 ? "" : "s"}.
          </p>
        </div>

        {/* Subject sections or empty state */}
        {groups.length === 0 ? (
          <section className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-center space-y-4">
            <BellPlus className="w-8 h-8 text-slate-500 mx-auto" />
            <h2 className="font-serif text-2xl font-bold">Papers are being digitized</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              No past papers for {examination.name.toUpperCase()} have been published yet. Papers land here
              as they are scanned, transcribed, and verified against official marking schemes.
            </p>
          </section>
        ) : (
          groups.map((group, gi) => (
            <section key={group.subject} className="space-y-5">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs tracking-[0.25em] text-slate-500">
                  {String(gi + 1).padStart(2, "0")}
                </span>
                <FileText className="w-5 h-5 text-teal-300" />
                <Link
                  href={`/highschool/exams/${examination.slug}/${subjectSlugOf(group.subject)}`}
                  className="text-xl md:text-2xl font-serif font-bold hover:text-amber-400 transition-colors"
                >
                  {group.subject}
                </Link>
                <span className="text-xs text-slate-500">
                  · {group.papers.length} paper{group.papers.length === 1 ? "" : "s"}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.papers.map((paper) => (
                  <Link
                    key={paper.id}
                    href={paperUrl(examination.slug, paper.subject, paper.year, paper.paperNumber)}
                    className="flex flex-col justify-between bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-lg hover:border-amber-500/40 transition-all group"
                  >
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
                    <div className="mt-6 pt-4 border-t border-slate-800 text-xs font-semibold text-slate-500 group-hover:text-amber-400 transition-colors">
                      Open paper →
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
