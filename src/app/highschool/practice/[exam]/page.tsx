import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/db";
import { SUBJECTS, topicBySlug } from "@/lib/curriculum";
import { ChevronRight, ClipboardCheck, HelpCircle, FlaskConical } from "lucide-react";

export const dynamic = "force-dynamic";

interface PickerPageProps {
  params: { exam: string };
}

const EXAM_CODE_PREFIXES = ["waec", "jamb", "neco", "wassce-ghana", "kcse", "nsc-matric"];

function subjectSlugForTopic(id: string, slug: string | null): string | null {
  const bySlug = slug ? topicBySlug(slug) : null;
  if (bySlug) return bySlug.subject.slug;
  for (const subject of SUBJECTS) {
    for (const prefix of EXAM_CODE_PREFIXES) {
      if (id.startsWith(`${prefix}-${subject.slug}-`)) return subject.slug;
    }
  }
  return null;
}

// Board practice picker: every topic that has board-tagged questions for this
// exam board, grouped by subject, with per-type counts.
export default async function BoardPracticePickerPage({ params }: PickerPageProps) {
  const examination = await prisma.examination.findFirst({
    where: {
      domain: "highschool",
      slug: { equals: params.exam.toLowerCase(), mode: "insensitive" },
    },
  });
  if (!examination) notFound();

  const tagged = await prisma.question.findMany({
    where: {
      boardTags: { some: { examinationId: examination.id, tier: { not: "NOT_EXAMINED" } } },
    },
    select: { topicId: true, type: true },
  });

  const countsByTopic = new Map<string, { mcq: number; theory: number; practical: number }>();
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

  const bySubject = new Map<string, { topic: { id: string; title: string }; counts: { mcq: number; theory: number; practical: number } }[]>();
  for (const topic of topics) {
    const subject = subjectSlugForTopic(topic.id, topic.slug);
    if (!subject) continue;
    if (!bySubject.has(subject)) bySubject.set(subject, []);
    bySubject.get(subject)!.push({ topic: { id: topic.id, title: topic.title }, counts: countsByTopic.get(topic.id)! });
  }

  const subjectOrder = SUBJECTS.filter((s) => bySubject.has(s.slug));

  return (
    <div className="min-h-screen bg-transparent text-slate-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <nav className="flex items-center gap-2 text-sm text-slate-400">
          <Link href="/highschool/exams" className="rounded hover:text-amber-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400">Exams</Link>
          <ChevronRight className="w-4 h-4 text-slate-600" />
          <Link href={`/highschool/exams/${examination.slug}`} className="hover:text-amber-400 transition-colors">
            {examination.name.toUpperCase()}
          </Link>
          <ChevronRight className="w-4 h-4 text-slate-600" />
          <span className="text-slate-100 font-medium">Practice</span>
        </nav>

        <header className="space-y-3">
          <p className="text-teal-300 text-xs font-semibold uppercase tracking-[0.25em]">Board-format practice</p>
          <h1 className="text-3xl md:text-4xl font-serif font-bold">
            Practice {examination.name.toUpperCase()} the way the exam is <span className="text-[#D4AF37]">actually set</span>
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl">
            Sessions follow the board&apos;s real paper structure — objectives, theory, practicals — with
            the exact durations and marks of each section.
            {examination.lastVerified ? " Board format verified." : ""}
          </p>
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
          subjectOrder.map((subject) => (
            <section key={subject.slug} className="space-y-3">
              <h2 className="text-xl font-serif font-bold">{subject.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bySubject.get(subject.slug)!.map(({ topic, counts }) => (
                  <Link
                    key={topic.id}
                    href={`/highschool/practice/${examination.slug}/${topic.id}?subject=${subject.slug}`}
                    className="flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/80 p-5 hover:border-amber-500/40 transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                  >
                    <div>
                      <div className="font-semibold text-slate-100 group-hover:text-amber-400 transition-colors">{topic.title}</div>
                      <div className="mt-2 flex items-center gap-4 text-xs text-slate-400">
                        {counts.mcq > 0 && (
                          <span className="flex items-center gap-1"><HelpCircle className="w-3.5 h-3.5 text-teal-400" /> {counts.mcq} objective</span>
                        )}
                        {counts.theory > 0 && (
                          <span className="flex items-center gap-1"><ClipboardCheck className="w-3.5 h-3.5 text-amber-500" /> {counts.theory} theory</span>
                        )}
                        {counts.practical > 0 && (
                          <span className="flex items-center gap-1"><FlaskConical className="w-3.5 h-3.5 text-emerald-400" /> {counts.practical} practical</span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all shrink-0" />
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
