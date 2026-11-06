import Link from "next/link";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { ArrowRight, BookOpen, FileText, History, BellPlus, MonitorPlay, HelpCircle } from "lucide-react";
import { EXAM_BANK, EXAM_CLASSES, EXAM_CLASS_ORDER, type ExamBankBoard } from "@/lib/exam-bank";
import { countBoardQuestions } from "@/lib/board-bank";

export const dynamic = "force-dynamic";

/**
 * Open Exam Bank — the Examination Centre landing: a board selector grouped by
 * FORMAT CLASS (CBT · Objective+Theory · Written), exactly as the owner's
 * global board registry defines it. Coverage counts are honest and derive from
 * the ONE bank definition (src/lib/board-bank.ts): subjects from the topic
 * tree, papers from the paper bank, practice questions from the board's own
 * topic tree. The hub chip, the board page's practice-engine sentence and the
 * practice picker therefore always print the same number — the old hub counted
 * board tags with no tier filter while the picker excluded NOT_EXAMINED rows,
 * which is how the 340-vs-339 defect was born.
 *
 * The page also spells out the path a student actually walks — Country →
 * Board → Subject → Paper → (MCQ or Theory) — against the routes that already
 * exist (/highschool/exams/[exam], [exam]/[subject], [subject]/[paper]/take,
 * /review, /cbt). Nothing is listed for a country or board that has no bank.
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

  // Live coverage across the registry — the honest totals the landing prints.
  const liveBoards = EXAM_BANK.filter((b) => b.status === "live");
  const liveCountries = Array.from(new Set(liveBoards.map((b) => b.country)));
  const totals = Array.from(coverage.values()).reduce(
    (sum, c) => ({ subjects: sum.subjects + c.subjects, papers: sum.papers + c.papers, questions: sum.questions + c.questions }),
    { subjects: 0, papers: 0, questions: 0 },
  );

  // The path a student walks, against routes that already exist. Each step
  // names a real route; only steps with a concrete destination are links.
  const firstLiveBoard = liveBoards[0];
  const cbtBoard = liveBoards.find((b) => b.cbtReady);
  const pathSteps: { key: string; step: string; label: string; hint: string; route: string; href?: string }[] = [
    {
      key: "country",
      step: "1",
      label: "Country",
      hint:
        liveCountries.length > 0
          ? `Boards are grouped by the country that sets them — ${liveCountries.join(", ")} today.`
          : "Boards are grouped by the country that sets them.",
      route: "/highschool/exams",
    },
    {
      key: "board",
      step: "2",
      label: "Board",
      hint: firstLiveBoard
        ? `Open a board to see its subjects — ${firstLiveBoard.name} is live.`
        : "A board lists its subjects once its bank lands.",
      route: "/highschool/exams/{board}",
      href: firstLiveBoard ? `/highschool/exams/${firstLiveBoard.slug}` : undefined,
    },
    {
      key: "subject",
      step: "3",
      label: "Subject",
      hint: "Every subject in the board's syllabus tree, with its topics and question counts.",
      route: "/highschool/exams/{board}/{subject}",
    },
    {
      key: "paper",
      step: "4",
      label: "Paper",
      hint: "Papers by year, newest first, each with duration, marks and question count.",
      route: "/highschool/exams/{board}/{subject}/{paper}",
    },
    {
      key: "sit",
      step: "5",
      label: "MCQ or theory",
      hint: "Sit the paper timed or open, then study the marking scheme — and run the full CBT simulation where the board supports it.",
      route: "…/{paper}/take · …/{paper}/review · /cbt",
      href: cbtBoard ? `/cbt/setup?board=${cbtBoard.code}` : undefined,
    },
  ];

  return (
    <div className="min-h-screen bg-transparent text-slate-100 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Hero */}
        <div className="gn-shadow rounded-2xl border border-line bg-gradient-to-b from-surface/60 to-transparent p-8 md:p-10 text-center space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3 py-1 text-xs font-semibold text-electric-text">
            <BookOpen className="h-3.5 w-3.5" aria-hidden /> High School · Examination Centre
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tight">
            The examination centre, <span className="text-electric-text">board by board</span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">
            Every board is classified by how it actually examines — full CBT simulations,
            objective-plus-theory pairs, or written theory with short answers. Pick your country,
            then your board.
          </p>
          <p className="text-sm text-muted">
            {liveBoards.length === 0 ? (
              <>No board is live right now — new systems are added as their banks are transcribed and verified.</>
            ) : (
              <>
                Live today: {liveBoards.map((b) => b.name).join(", ")}
                {liveCountries.length > 0 ? ` (${liveCountries.join(", ")})` : ""} ·{" "}
                {totals.questions.toLocaleString()} practice question{totals.questions === 1 ? "" : "s"} across{" "}
                {totals.subjects} subject{totals.subjects === 1 ? "" : "s"} and {totals.papers} published paper
                {totals.papers === 1 ? "" : "s"}.
              </>
            )}
          </p>
        </div>

        {/* The path — Country → Board → Subject → Paper → (MCQ or theory) */}
        <section aria-labelledby="path-heading" className="gn-shadow rounded-2xl border border-line bg-surface/40 p-5 md:p-6">
          <h2 id="path-heading" className="text-[11px] font-semibold uppercase tracking-[0.3em] text-electric-text">
            How you reach a paper
          </h2>
          <ol className="mt-4 grid gap-3 md:grid-cols-3 lg:grid-cols-5">
            {pathSteps.map((step) => (
              <li key={step.key}>
                {step.href ? (
                  <Link
                    href={step.href}
                    className="gn-motion gn-lift flex h-full flex-col gap-1.5 rounded-xl border border-line bg-surface p-4 hover:border-electric/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <span className="flex items-center gap-2 text-sm font-bold text-slate-100">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full border border-electric/30 bg-electric/10 font-mono text-[11px] text-electric-text">
                        {step.step}
                      </span>
                      {step.label}
                    </span>
                    <span className="text-xs leading-relaxed text-muted">{step.hint}</span>
                    <span className="mt-auto font-mono text-[11px] text-cyan-300">{step.route}</span>
                  </Link>
                ) : (
                  <div className="flex h-full flex-col gap-1.5 rounded-xl border border-line bg-surface p-4">
                    <span className="flex items-center gap-2 text-sm font-bold text-slate-100">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full border border-line bg-surface-2 font-mono text-[11px] text-muted">
                        {step.step}
                      </span>
                      {step.label}
                    </span>
                    <span className="text-xs leading-relaxed text-muted">{step.hint}</span>
                    <span className="mt-auto font-mono text-[11px] text-muted">{step.route}</span>
                  </div>
                )}
              </li>
            ))}
          </ol>
          <p className="mt-4 text-xs text-muted">
            The exam hub also keeps each board&apos;s topic tree for study and quizzes — the same bank the practice engine
            draws from, so the counts never disagree.
          </p>
        </section>

        {/* Resume banner */}
        {recentActivity && (
          <div className="gn-shadow bg-electric/10 border border-electric/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-electric-text">
              <History className="w-5 h-5 shrink-0 text-electric-text" />
              <span className="text-sm font-medium">{recentActivity.label}</span>
            </div>
            <Link
              href={recentActivity.link}
              className="gn-motion inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-hover transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.98]"
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
                <span className="font-mono text-xs tracking-[0.25em] text-muted">
                  {String(ci + 1).padStart(2, "0")}
                </span>
                {classId === "cbt" ? (
                  <MonitorPlay className="w-5 h-5 text-electric-text" aria-hidden />
                ) : classId === "objective-theory" ? (
                  <BookOpen className="w-5 h-5 text-cyan-300" aria-hidden />
                ) : (
                  <HelpCircle className="w-5 h-5 text-violet-300" aria-hidden />
                )}
                <h2 id={`class-${classId}`} className="text-xl md:text-2xl font-serif font-bold">{meta.label}</h2>
                {boards.length > 0 ? (
                  <span className="text-xs text-muted">· {boards.length} board{boards.length === 1 ? "" : "s"}</span>
                ) : (
                  <span className="text-xs text-muted">· awaiting classification</span>
                )}
              </div>
              <p className="text-sm text-muted max-w-3xl">{meta.description}</p>

              {boards.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-line bg-surface/40 p-6 text-sm text-muted">
                  No board is classified under this format yet. Boards return here once their papers are transcribed and
                  verified against official marking schemes — a format with no bank is never listed as if it works.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {boards.map((board) => (
                    <BoardCard key={board.slug} board={board} stats={coverage.get(board.slug) ?? { subjects: 0, papers: 0, questions: 0 }} />
                  ))}
                </div>
              )}
            </section>
          );
        })}

        {/* Your system isn't here yet */}
        <section className="gn-shadow rounded-2xl border border-dashed border-line bg-surface/40 p-8 text-center space-y-4">
          <BellPlus className="w-8 h-8 text-muted mx-auto" aria-hidden />
          <h2 className="font-serif text-2xl font-bold">Your board isn&#39;t classified yet?</h2>
          <p className="text-muted text-sm max-w-xl mx-auto">
            New examination systems are added every term. Create a free account and we&apos;ll
            notify you the moment yours is available.
          </p>
          <Link
            href="/login"
            className="gn-motion inline-flex items-center justify-center min-h-[48px] px-6 py-3 rounded-lg bg-primary text-on-primary font-semibold text-sm hover:bg-primary-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.98]"
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
    <div className="gn-shadow flex flex-col justify-between rounded-xl border border-line bg-surface p-6 transition-all duration-200 group hover:border-electric/40 gn-motion">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h3 className="text-xl md:text-2xl font-serif font-bold text-slate-100 group-hover:text-electric-text transition-colors">
            {board.name}
          </h3>
          {!live && (
            <span className="text-[11px] font-medium text-muted bg-surface-2 px-2.5 py-1 rounded-md border border-line">
              In preparation
            </span>
          )}
        </div>
        <p className="text-xs font-medium text-muted mb-3">{board.country}</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {board.formats.map((f) => (
            <span key={f} className="text-[11px] font-medium text-electric-text bg-electric/10 px-2 py-0.5 rounded-md border border-electric/30">
              {f}
            </span>
          ))}
        </div>
        <p className="text-muted text-sm leading-relaxed mb-4">{board.note}</p>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 text-xs text-muted">
          <span className="flex items-center gap-1 bg-surface-2 px-2 py-1 rounded-md border border-line">
            <BookOpen className="w-3.5 h-3.5 text-electric-text" aria-hidden /> {stats.questions} practice Qs
          </span>
          <span className="flex items-center gap-1 bg-surface-2 px-2 py-1 rounded-md border border-line">
            <FileText className="w-3.5 h-3.5 text-electric-text" aria-hidden /> {stats.papers} papers
          </span>
        </div>
        <div className={board.cbtReady ? "grid grid-cols-2 gap-2" : ""}>
          {board.cbtReady && live && (
            <Link
              href={`/cbt/setup?board=${board.code}`}
              className="gn-motion inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-primary text-on-primary font-semibold text-sm hover:bg-primary-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.98]"
            >
              <MonitorPlay className="w-4 h-4" aria-hidden /> Start CBT
            </Link>
          )}
          <Link
            href={`/highschool/exams/${board.slug}`}
            className={`gn-motion inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-semibold text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.98] ${
              board.cbtReady && live
                ? "border border-line text-slate-200 hover:border-electric/50"
                : "bg-primary text-on-primary hover:bg-primary-hover"
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
