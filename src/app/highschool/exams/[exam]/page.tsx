import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/db";
import { SectionMark } from "@/components/logo/GnostiriLogo";
import { BookOpen, ChevronRight, Clock, FileText, HelpCircle, MonitorPlay, Target } from "lucide-react";
import { boardBySlug, EXAM_CLASSES } from "@/lib/exam-bank";
import { boardTopicQuestionCounts, totalOf } from "@/lib/board-bank";
import { presetFor } from "@/lib/cbt/config";
import { paperUrl, subjectSlugOf } from "@/lib/papers";
import { topicSlugOf } from "./topic-slug";

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

interface TopicCount {
  id: string;
  title: string;
  topicSlug: string;
  questionCount: number;
}

interface SubjectCoverage {
  slug: string;
  title: string;
  href: string;
  topics: TopicCount[];
  questionCount: number;
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

// Board page: ONE taxonomy, ONE count. The subject grid is computed from the
// board's own {code}-* topic tree (the same tree /cbt serves), so this page can
// never disagree with the practice bank. Published past papers — when they
// exist — are listed below the practice bank, never instead of it.
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

  const registryBoard = boardBySlug(examSlug);
  const cbtPreset = presetFor(examination.code);
  const sectionBase = `/highschool/${examination.code.toLowerCase()}`;

  const blueprintPapers = await prisma.examinationPaper.findMany({
    where: { examinationId: examination.id },
    orderBy: { sequence: "asc" },
    select: { paperId: true, paperName: true, questionTypes: true, durationMinutes: true, marks: true },
  });

  // The board's topic tree: {code} -> {code}-{subject} -> {code}-{subject}-{topic}.
  const boardCode = examination.code.toLowerCase();
  const rootTopic = await prisma.topic.findFirst({
    where: { domain: "highschool", id: boardCode },
    select: { id: true },
  });
  const subjectTopics = rootTopic
    ? await prisma.topic.findMany({
        where: { domain: "highschool", parentId: rootTopic.id },
        orderBy: { orderIndex: "asc" },
        select: { id: true, title: true },
      })
    : [];

  const childTopics = subjectTopics.length
    ? await prisma.topic.findMany({
        where: { parentId: { in: subjectTopics.map((s) => s.id) } },
        orderBy: { orderIndex: "asc" },
        select: { id: true, title: true, parentId: true },
      })
    : [];

  const childrenByParent = new Map<string, TopicCount[]>();
  for (const child of childTopics) {
    if (!child.parentId) continue;
    const list = childrenByParent.get(child.parentId) ?? [];
    list.push({
      id: child.id,
      title: child.title,
      topicSlug: topicSlugOf(child.id, child.parentId),
      questionCount: 0,
    });
    childrenByParent.set(child.parentId, list);
  }

  // ONE bank definition (src/lib/board-bank.ts): per-topic counts straight from
  // the shared tree helper, RULE 4 applied. The hero count, every subject and
  // topic card, the practice-engine sentence and the practice picker all read
  // this same map, so no two surfaces can print different numbers again.
  const treeCounts = await boardTopicQuestionCounts(boardCode, examination.id);
  const countsByTopic = new Map<string, number>();
  if (treeCounts) {
    treeCounts.forEach((counts, topicId) => countsByTopic.set(topicId, totalOf(counts)));
  }

  const coverage: SubjectCoverage[] = subjectTopics.map((subject) => {
    const topics = childrenByParent.get(subject.id) ?? [];
    let questionCount = countsByTopic.get(subject.id) ?? 0;
    for (const topic of topics) {
      topic.questionCount = countsByTopic.get(topic.id) ?? 0;
      questionCount += topic.questionCount;
    }
    return {
      slug: subject.id.slice(boardCode.length + 1),
      title: subject.title,
      href: `${sectionBase}/${subject.id.slice(boardCode.length + 1)}`,
      topics,
      questionCount,
    };
  });

  const treeQuestionCount = coverage.reduce((sum, s) => sum + s.questionCount, 0);
  const treeTopicCount = coverage.reduce((sum, s) => sum + s.topics.length, 0);

  // The board-format practice engine's bank IS the topic tree (the blueprint
  // manifest serves it paper by paper). The practice card therefore prints the
  // SAME number as the hero — that agreement is the unification.
  const practiceCount = treeQuestionCount;

  // Group published papers by subject, newest year first.
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

  const cbtReady = treeQuestionCount > 0;
  const hasPractice = practiceCount > 0 || treeQuestionCount > 0;

  return (
    <div className="min-h-screen bg-transparent text-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-400">
          <Link href="/highschool" className="rounded hover:text-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold">High School</Link>
          <ChevronRight className="w-4 h-4 text-slate-600" />
          <Link href="/highschool/exams" className="rounded hover:text-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold">Exams</Link>
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
            {examination.name.toUpperCase()} <span className="text-gold">practice bank</span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">
            {examination.country ? `${examination.country} — ` : ""}
            {treeQuestionCount.toLocaleString()} practice question{treeQuestionCount === 1 ? "" : "s"}
            {coverage.length > 0 && <> across {coverage.length} subject{coverage.length === 1 ? "" : "s"} and {treeTopicCount} topic{treeTopicCount === 1 ? "" : "s"}</>}.
          </p>
          {registryBoard && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-300 bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
                Class: {EXAM_CLASSES[registryBoard.examClass].short}
              </span>
              {registryBoard.formats.map((f) => (
                <span key={f} className="text-[11px] font-medium text-teal-200 bg-teal-500/10 px-2 py-0.5 rounded-md border border-teal-500/20">
                  {f}
                </span>
              ))}
              {registryBoard.paperTypes.length > 0 && (
                <span className="text-[11px] font-medium text-slate-300 bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
                  Papers: {registryBoard.paperTypes.join(" · ")}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Entry points — the two ways in, always visible */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cbtPreset && (
            <Link
              href={`/cbt/setup?board=${examination.slug}`}
              className={`flex flex-col justify-between gap-3 rounded-xl border p-6 transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                cbtReady
                  ? "border-gold/40 bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 hover:border-gold"
                  : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <MonitorPlay className={`w-6 h-6 ${cbtReady ? "text-gold" : "text-slate-500"}`} />
                <div>
                  <div className="font-serif font-bold text-lg text-slate-100 group-hover:text-gold transition-colors">
                    Start CBT simulation
                  </div>
                  <p className="text-sm text-slate-400 mt-1">
                    {cbtReady
                      ? `Timed, shuffled, graded on our servers — ${cbtPreset.name} format.`
                      : `${cbtPreset.name} CBT is in preparation — the setup page shows what is live.`}
                  </p>
                </div>
              </div>
              <span className={`text-sm font-semibold ${cbtReady ? "text-gold" : "text-slate-400"}`}>
                {cbtReady ? "Open CBT setup →" : "Check CBT status →"}
              </span>
            </Link>
          )}

          <Link
            href={`/highschool/practice/${examination.slug}`}
            className={`flex flex-col justify-between gap-3 rounded-xl border p-6 transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${
              hasPractice
                ? "border-teal-500/30 bg-gradient-to-br from-teal-950/40 via-slate-900 to-slate-900 hover:border-teal-400/60"
                : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center gap-3">
              <HelpCircle className={`w-6 h-6 ${hasPractice ? "text-teal-300" : "text-slate-500"}`} />
              <div>
                <div className="font-serif font-bold text-lg text-slate-100 group-hover:text-teal-300 transition-colors">
                  Practice by topic
                </div>
                <p className="text-sm text-slate-400 mt-1">
                  {`Board-format sessions on this board's topics — ${practiceCount.toLocaleString()} question${practiceCount === 1 ? "" : "s"} in the practice engine.`}
                </p>
              </div>
            </div>
            <span className={`text-sm font-semibold ${hasPractice ? "text-teal-300" : "text-slate-400"}`}>
              Open topic practice →
            </span>
          </Link>
        </div>

        {/* Paper structure — verified blueprint only */}
        {blueprintPapers.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
              Paper structure in the practice engine
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {blueprintPapers.map((paper) => (
                <div key={paper.paperId} className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-serif font-bold text-slate-100">{paper.paperName}</span>
                    <span className="text-xs font-mono text-slate-400">{paper.paperId}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-500" />{formatDuration(paper.durationMinutes)}</span>
                    <span className="flex items-center gap-1"><Target className="w-3.5 h-3.5 text-slate-500" />{paper.marks} marks</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {(Array.isArray(paper.questionTypes) ? paper.questionTypes.map(String) : []).join(" · ")}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Subject grid — computed from the board's topic tree */}
        {coverage.length === 0 ? (
          <section className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-center space-y-4">
            <BookOpen className="w-8 h-8 text-slate-500 mx-auto" />
            <h2 className="font-serif text-2xl font-bold">In preparation</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              {examination.name.toUpperCase()} is not live yet. The syllabus structure, paper
              blueprint and question bank land here together — we never show an empty grid as if
              it were content.
            </p>
          </section>
        ) : (
          <section className="space-y-6">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-xl font-serif font-bold">Subjects</h2>
              <span className="text-xs text-slate-400">Counts computed from the topic tree</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {coverage.map((subject) => (
                <div key={subject.slug} className="flex flex-col bg-slate-900/80 border border-slate-800 rounded-xl p-6 hover:border-gold/40 transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xl font-serif font-bold text-slate-100">
                      <Link href={subject.href} className="rounded hover:text-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold">
                        {subject.title}
                      </Link>
                    </h3>
                    <span className="shrink-0 text-xs font-semibold text-teal-200 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-md">
                      {subject.questionCount.toLocaleString()} question{subject.questionCount === 1 ? "" : "s"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    {subject.topics.length} topic{subject.topics.length === 1 ? "" : "s"} in the {boardCode.toUpperCase()} syllabus tree
                  </p>
                  <ul className="mt-4 space-y-1.5">
                    {subject.topics.map((topic) => (
                      <li key={topic.id} className="flex items-center justify-between gap-3 text-sm">
                        <Link
                          href={`${sectionBase}/${subject.slug}/${topic.topicSlug}/study`}
                          className="rounded text-slate-300 hover:text-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                        >
                          {topic.title}
                        </Link>
                        <span className="flex items-center gap-3 shrink-0 text-xs text-slate-400">
                          <span>{topic.questionCount.toLocaleString()} q</span>
                          <Link
                            href={`${sectionBase}/${subject.slug}/${topic.topicSlug}/quiz`}
                            className="rounded font-semibold text-gold/80 hover:text-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                          >
                            Quiz
                          </Link>
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 pt-4 border-t border-slate-800">
                    <Link
                      href={subject.href}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-teal-300 hover:text-teal-200 transition-colors"
                    >
                      Open {subject.title} <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Past papers — honest status, never a false zero */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-teal-300" />
            <h2 className="text-xl font-serif font-bold">Past papers</h2>
          </div>
          {groups.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-center space-y-3">
              <p className="font-serif text-xl font-bold">Past-paper digitization in progress</p>
              <p className="text-slate-400 text-sm max-w-2xl mx-auto">
                {treeQuestionCount > 0 ? (
                  <>
                    {treeQuestionCount.toLocaleString()} practice question{treeQuestionCount === 1 ? "" : "s"} are
                    live across {coverage.length} subject{coverage.length === 1 ? "" : "s"} — every topic above is
                    drillable now. Scanned past papers land here as they are transcribed and checked
                    against official marking schemes; the CBT simulation and topic practice do not wait for them.
                  </>
                ) : (
                  <>
                    No past papers for {examination.name.toUpperCase()} have been published yet. Papers land
                    here as they are scanned, transcribed, and verified against official marking schemes.
                  </>
                )}
              </p>
            </div>
          ) : (
            groups.map((group, gi) => (
              <div key={group.subject} className="space-y-5">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs tracking-[0.25em] text-slate-400">
                    {String(gi + 1).padStart(2, "0")}
                  </span>
                  <Link
                    href={`/highschool/exams/${examination.slug}/${subjectSlugOf(group.subject)}`}
                    className="rounded text-xl md:text-2xl font-serif font-bold hover:text-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    {group.subject}
                  </Link>
                  <span className="text-xs text-slate-400">
                    · {group.papers.length} paper{group.papers.length === 1 ? "" : "s"}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.papers.map((paper) => (
                    <Link
                      key={paper.id}
                      href={paperUrl(examination.slug, paper.subject, paper.year, paper.paperNumber)}
                      className="flex flex-col justify-between bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-lg hover:border-gold/40 transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                    >
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <span className="font-serif text-3xl font-bold text-gold group-hover:text-amber-300">
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
                      <div className="mt-6 pt-4 border-t border-slate-800 text-xs font-semibold text-slate-400 group-hover:text-gold transition-colors">
                        Open paper →
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
