import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/db";
import { SUBJECTS, topicBySlug } from "@/lib/curriculum";
import { ChevronRight, ClipboardCheck, HelpCircle, FlaskConical } from "lucide-react";

export const dynamic = "force-dynamic";

interface PickerPageProps {
  params: { exam: string };
}

const EXAM_CODE_PREFIXES = ["waec", "jamb", "neco", "kcse", "nsc-matric", "necta", "maneb", "cbse", "icse", "cambridge", "aqa", "edexcel", "sat", "ap"];

interface SubjectRoot {
  /** subject slug inside the board tree (id minus the board-code prefix) */
  slug: string;
  title: string;
  id: string;
}

interface TopicCounts {
  mcq: number;
  theory: number;
  practical: number;
}

/** Group a topic under its subject, preferring the board's own topic tree. */
function resolveSubject(
  topicId: string,
  topicSlug: string | null,
  boardCode: string,
  treeRoots: SubjectRoot[]
): { slug: string; title: string } | null {
  // 1. the board's own tree — {code}-{subject}[-{topic}]
  let best: SubjectRoot | null = null;
  for (const root of treeRoots) {
    if (topicId === root.id || topicId.startsWith(`${root.id}-`)) {
      if (!best || root.id.length > best.id.length) best = root;
    }
  }
  if (best) return { slug: best.slug, title: best.title };

  // 2. curriculum registry slug (the master-* curriculum tree)
  const bySlug = topicSlug ? topicBySlug(topicSlug) : null;
  if (bySlug) return { slug: bySlug.subject.slug, title: bySlug.subject.name };

  // 3. constructed-id convention — {board}-{subject}-{topic}
  for (const subject of SUBJECTS) {
    for (const prefix of EXAM_CODE_PREFIXES) {
      if (topicId.startsWith(`${prefix}-${subject.slug}-`)) return { slug: subject.slug, title: subject.name };
    }
  }
  return null;
}

// Board practice picker: every topic with board-tagged questions for this exam
// board, grouped by subject, with per-type counts. Subjects come from the
// board's topic tree first, so the picker agrees with /cbt and the board page.
export default async function BoardPracticePickerPage({ params }: PickerPageProps) {
  const examination = await prisma.examination.findFirst({
    where: {
      domain: "highschool",
      slug: { equals: params.exam.toLowerCase(), mode: "insensitive" },
    },
  });
  if (!examination) notFound();

  const boardCode = examination.code.toLowerCase();

  const tagged = await prisma.question.findMany({
    where: {
      boardTags: { some: { examinationId: examination.id, tier: { not: "NOT_EXAMINED" } } },
    },
    select: { topicId: true, type: true },
  });

  const countsByTopic = new Map<string, TopicCounts>();
  for (const q of tagged) {
    const entry = countsByTopic.get(q.topicId) ?? { mcq: 0, theory: 0, practical: 0 };
    if (q.type === "theory") entry.theory += 1;
    else if (q.type === "practical") entry.practical += 1;
    else entry.mcq += 1;
    countsByTopic.set(q.topicId, entry);
  }

  const topics = await prisma.topic.findMany({
    where: { id: { in: Array.from(countsByTopic.keys()) } },
    select: { id: true, title: true, slug: true },
  });

  // The board's own topic tree: {code} root -> {code}-{subject} subjects.
  const rootTopic = await prisma.topic.findFirst({
    where: { domain: "highschool", id: boardCode },
    select: { id: true },
  });
  const subjectRoots: SubjectRoot[] = rootTopic
    ? (
        await prisma.topic.findMany({
          where: { domain: "highschool", parentId: rootTopic.id },
          orderBy: { orderIndex: "asc" },
          select: { id: true, title: true },
        })
      ).map((t) => ({ slug: t.id.slice(boardCode.length + 1), title: t.title, id: t.id }))
    : [];

  const groups = new Map<string, { title: string; topics: { id: string; title: string; counts: TopicCounts }[] }>();
  const order: string[] = [];
  for (const root of subjectRoots) {
    if (!groups.has(root.slug)) {
      groups.set(root.slug, { title: root.title, topics: [] });
      order.push(root.slug);
    }
  }
  for (const subject of SUBJECTS) {
    if (!groups.has(subject.slug)) {
      groups.set(subject.slug, { title: subject.name, topics: [] });
      order.push(subject.slug);
    }
  }

  for (const topic of topics) {
    const subject = resolveSubject(topic.id, topic.slug, boardCode, subjectRoots);
    if (!subject) continue;
    let group = groups.get(subject.slug);
    if (!group) {
      group = { title: subject.title, topics: [] };
      groups.set(subject.slug, group);
      order.push(subject.slug);
    }
    group.topics.push({ id: topic.id, title: topic.title, counts: countsByTopic.get(topic.id)! });
  }

  const subjectOrder = order.filter((slug) => (groups.get(slug)?.topics.length ?? 0) > 0);

  const totalTagged = tagged.length;

  return (
    <div className="min-h-screen bg-transparent text-slate-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <nav className="flex items-center gap-2 text-sm text-slate-400">
          <Link href="/highschool/exams" className="rounded hover:text-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold">Exams</Link>
          <ChevronRight className="w-4 h-4 text-slate-600" />
          <Link href={`/highschool/exams/${examination.slug}`} className="hover:text-gold transition-colors">
            {examination.name.toUpperCase()}
          </Link>
          <ChevronRight className="w-4 h-4 text-slate-600" />
          <span className="text-slate-100 font-medium">Practice</span>
        </nav>

        <header className="space-y-3">
          <p className="text-teal-300 text-xs font-semibold uppercase tracking-[0.25em]">Board-format practice</p>
          <h1 className="text-3xl md:text-4xl font-serif font-bold">
            Practice {examination.name.toUpperCase()} the way the exam is <span className="text-gold">actually set</span>
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl">
            Sessions follow the board&apos;s real paper structure — objectives, theory, practicals — with
            the exact durations and marks of each section.
            {examination.lastVerified ? " Board format verified." : ""}
          </p>
          {totalTagged > 0 && (
            <p className="text-xs text-slate-500">
              {totalTagged.toLocaleString()} question{totalTagged === 1 ? "" : "s"} tagged to this board&apos;s papers across{" "}
              {subjectOrder.length} subject{subjectOrder.length === 1 ? "" : "s"}.
            </p>
          )}
        </header>

        {subjectOrder.length === 0 ? (
          <section className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-center space-y-3">
            <ClipboardCheck className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-slate-400 text-sm">
              No topics are tagged for {examination.name.toUpperCase()} practice yet. Content lands here as
              topics are rebuilt and tagged.
            </p>
          </section>
        ) : (
          subjectOrder.map((subjectSlug) => {
            const group = groups.get(subjectSlug)!;
            return (
              <section key={subjectSlug} className="space-y-3">
                <h2 className="text-xl font-serif font-bold">{group.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {group.topics.map((topic) => (
                    <Link
                      key={topic.id}
                      href={`/highschool/practice/${examination.slug}/${topic.id}?subject=${subjectSlug}`}
                      className="flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/80 p-5 hover:border-gold/40 transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                    >
                      <div>
                        <div className="font-semibold text-slate-100 group-hover:text-gold transition-colors">{topic.title}</div>
                        <div className="mt-2 flex items-center gap-4 text-xs text-slate-400">
                          {topic.counts.mcq > 0 && (
                            <span className="flex items-center gap-1"><HelpCircle className="w-3.5 h-3.5 text-teal-400" /> {topic.counts.mcq} objective</span>
                          )}
                          {topic.counts.theory > 0 && (
                            <span className="flex items-center gap-1"><ClipboardCheck className="w-3.5 h-3.5 text-gold" /> {topic.counts.theory} theory</span>
                          )}
                          {topic.counts.practical > 0 && (
                            <span className="flex items-center gap-1"><FlaskConical className="w-3.5 h-3.5 text-emerald-400" /> {topic.counts.practical} practical</span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-gold group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  ))}
                </div>
              </section>
            );
          })
        )}
      </div>
    </div>
  );
}
