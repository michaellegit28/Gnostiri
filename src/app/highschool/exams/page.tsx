import Link from "next/link";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { ArrowRight, BookOpen, FileText, History, BellPlus, MonitorPlay, HelpCircle } from "lucide-react";
import { EXAM_BANK, EXAM_CLASSES, EXAM_CLASS_ORDER, type ExamBankBoard } from "@/lib/exam-bank";
import { countBoardQuestions } from "@/lib/board-bank";

export const dynamic = "force-dynamic";

/**
 * Open Exam Bank — grouped by FORMAT CLASS (CBT · Objective+Theory · Written),
 * exactly as the owner's global board registry defines it. Coverage counts are
 * honest and derive from the ONE bank definition (src/lib/board-bank.ts):
 * subjects from the topic tree, papers from the paper bank, practice questions
 * from the board's own topic tree. The hub chip, the board page's
 * practice-engine sentence and the practice picker therefore always print the
 * same number — the old hub counted board tags with no tier filter while the
 * picker excluded NOT_EXAMINED rows, which is how the 340-vs-339 defect was
 * born.
 */
export default async function HighSchoolHubPage() {
  const examinations = await prisma.examination.findMany({
    where: { domain: "highschool" },
    select: { id: true, slug: true, code: true, name: true, country: true },
  });
  const bySlug = new Map(examinations.map((e) => [e.slug, e]));

  // Honest coverage per registry board.
  const coverage = new Map<string, { subjects: number; papers: number; questions: number }>();
  for (const board of EXAM_BANK) {
    const exam = bySlug.get(board.slug);
    if (!exam) { coverage.set(board.slug, { subjects: 0, papers: 0, questions: 0 }); continue; }
    const [subjects, papers, questions] = await Promise.all([
      prisma.topic.count({ where: { domain: "highschool", parentId: board.code.toLowerCase() } }),
      prisma.examPaper.count({ where: { examinationId: exam.id, isPublished: true } }),
      // The board's bank is its own topic tree — the same helper the board page
      // and the practice picker use, so no two surfaces can disagree.
      countBoardQuestions(board.code.toLowerCase(), exam.id),
    ]);
    coverage.set(board.slug, { subjects, papers, questions });
  }

  // Resume banner for returning learners.
  let recentActivity: { link: string; label: string } | null = null;
  const user = await getCurrentUser();
  if (user) {
    const lastProgress = await prisma.progress.findFirst({
      where: { userId: user.id, domain: "highschool" },
      orderBy: { lastStudied: "desc" },
    });
    if (lastProgress) {
      const topic: {
        id: string;
        title: string;
        parentId: string | null;
        parent?: { id: string; title: string; parentId: string | null; parent?: { title: string } | null } | null;
      } | null = await prisma.topic.findFirst({
        where: { id: lastProgress.entityId, domain: "highschool" },
        include: { parent: { include: { parent: true } } },
      });
      if (topic?.parent) {
        const subjectTopic = topic.parent;
        const examCode = subjectTopic.parentId || "";
        const subjectSlug = subjectTopic.id.replace(`${examCode}-`, "");
        const topicSlug = topic.id.replace(`${subjectTopic.id}-`, "");
        if (examCode && subjectSlug && topicSlug) {
          recentActivity = {
            link: `/highschool/${examCode.toLowerCase()}/${subjectSlug.toLowerCase()}/${topicSlug.toLowerCase()}/study`,
            label: `Continue: ${subjectTopic.parent?.title || examCode.toUpperCase()} ${subjectTopic.title} — ${topic.title}`,
          };
        }
      }
    }
  }

  return (
    <div className="min-h-screen bg-transparent text-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Hero */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-8 md:p-10 text-center space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-300">
            <BookOpen className="h-3.5 w-3.5" aria-hidden /> High School · Exam Bank
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tight">
            The open exam bank, <span className="text-gold">classified</span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">
            Every board is classified by how it actually examines — full CBT
            simulations, objective-plus-theory pairs, or written theory with short
            answers. Pick your class, then your board.
          </p>
        </div>

        {/* Resume banner */}
        {recentActivity && (
          <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-amber-300">
              <History className="w-5 h-5 shrink-0 text-gold" />
              <span className="text-sm font-medium">{recentActivity.label}</span>
            </div>
            <Link
              href={recentActivity.link}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg bg-gold hover:bg-gold-hover text-slate-950 transition-colors shrink-0"
            >
              <span>Resume</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Class sections — fixed order: CBT, Objective+Theory, Written */}
        {EXAM_CLASS_ORDER.map((classId, ci) => {
          const meta = EXAM_CLASSES[classId];
          const boards = EXAM_BANK.filter((b) => b.examClass === classId);
          return (
            <section key={classId} className="space-y-5" aria-labelledby={`class-${classId}`}>
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-xs tracking-[0.25em] text-slate-400">
                  {String(ci + 1).padStart(2, "0")}
                </span>
                {classId === "cbt" ? (
                  <MonitorPlay className="w-5 h-5 text-teal-300" aria-hidden />
                ) : classId === "objective-theory" ? (
                  <BookOpen className="w-5 h-5 text-teal-300" aria-hidden />
                ) : (
                  <HelpCircle className="w-5 h-5 text-teal-300" aria-hidden />
                )}
                <h2 id={`class-${classId}`} className="text-xl md:text-2xl font-serif font-bold">{meta.label}</h2>
                <span className="text-xs text-slate-400">· {boards.length} boards</span>
              </div>
              <p className="text-sm text-slate-400 max-w-3xl">{meta.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {boards.map((board) => (
                  <BoardCard key={board.slug} board={board} stats={coverage.get(board.slug) ?? { subjects: 0, papers: 0, questions: 0 }} />
                ))}
              </div>
            </section>
          );
        })}

        {/* Your system isn't here yet */}
        <section className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-center space-y-4">
          <BellPlus className="w-8 h-8 text-slate-500 mx-auto" />
          <h2 className="font-serif text-2xl font-bold">Your board isn&#39;t classified yet?</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            New examination systems open every term. Create a free account and yours
            will be among the first we unlock — members shape what comes next.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center min-h-[48px] px-6 py-3 rounded-lg bg-gold text-slate-950 font-semibold text-sm hover:bg-gold-hover transition-colors"
          >
            Get notified — it&#39;s free
          </Link>
        </section>
      </div>
    </div>
  );
}

function BoardCard({ board, stats }: { board: ExamBankBoard; stats: { subjects: number; papers: number; questions: number } }) {
  const live = board.status === "live";
  return (
    <div className="flex flex-col justify-between bg-slate-900/80 border border-slate-800 rounded-xl p-6 hover:border-gold/40 transition-all duration-200 group shadow-lg">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h3 className="text-xl md:text-2xl font-serif font-bold text-slate-100 group-hover:text-gold transition-colors">
            {board.name}
          </h3>
          {!live && (
            <span className="text-[11px] font-medium text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/50">
              In preparation
            </span>
          )}
        </div>
        <p className="text-xs font-medium text-slate-400 mb-3">{board.country}</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {board.formats.map((f) => (
            <span key={f} className="text-[11px] font-medium text-teal-200 bg-teal-500/10 px-2 py-0.5 rounded-md border border-teal-500/20">
              {f}
            </span>
          ))}
        </div>
        <p className="text-slate-400 text-sm leading-relaxed mb-4">{board.note}</p>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-md border border-slate-700/50">
            <BookOpen className="w-3.5 h-3.5 text-gold" aria-hidden /> {stats.questions} practice Qs
          </span>
          <span className="flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-md border border-slate-700/50">
            <FileText className="w-3.5 h-3.5 text-gold" aria-hidden /> {stats.papers} papers
          </span>
        </div>
        <div className={board.cbtReady ? "grid grid-cols-2 gap-2" : ""}>
          {board.cbtReady && live && (
            <Link
              href={`/cbt/setup?board=${board.code}`}
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-gold text-slate-950 font-semibold text-sm hover:bg-gold-hover transition-colors"
            >
              <MonitorPlay className="w-4 h-4" aria-hidden /> Start CBT
            </Link>
          )}
          <Link
            href={`/highschool/exams/${board.slug}`}
            className={`inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-semibold text-sm transition-colors ${
              board.cbtReady && live
                ? "border border-white/15 text-slate-200 hover:border-gold/50"
                : "bg-gold text-slate-950 hover:bg-gold-hover"
            }`}
          >
            <span>Open board</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
