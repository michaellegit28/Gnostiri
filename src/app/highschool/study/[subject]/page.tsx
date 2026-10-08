import { notFound, permanentRedirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { subjectBySlug, topicBySlug } from "@/lib/curriculum";
import { ArrowRight, CheckCircle2, Globe2, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

interface TopicRow {
  slug: string;
  title: string;
  subtopics: string[];
  chapterReady: boolean;
  advanced: boolean;
  questions: number;
  completed: boolean;
  needsRetry: boolean;
  coreInRegion: boolean;
}

// Level 2 — subject page. Also serves as the legacy-URL catcher:
// /highschool/study/<topic-slug> lands here and 301s to the subject-scoped path.
export default async function SubjectPage({ params, searchParams }: { params: { subject: string }; searchParams?: { region?: string } }) {
  const subjectParam = params.subject;

  // Legacy: param is a topic slug, not a subject → 301 to the subject-scoped path.
  if (!subjectBySlug(subjectParam)) {
    const legacy = topicBySlug(subjectParam);
    if (legacy) permanentRedirect(`/highschool/study/${legacy.subject.slug}/${subjectParam}`);
    notFound();
  }

  const subject = subjectBySlug(subjectParam)!;
  const regionParam = searchParams?.region || "";

  const topicSlugs = subject.topics.map((t) => t.slug);
  const rows = await prisma.topic.findMany({
    where: { slug: { in: topicSlugs } },
    select: { slug: true, id: true, _count: { select: { lessons: true, questions: true } } },
  });
  const bySlug = new Map(rows.map((r) => [r.slug!, r]));

  const user = await getCurrentUser();
  let completed = new Set<string>();
  let needsRetry = new Set<string>();
  let resume: TopicRow | null = null;
  let coreTopicIds = new Set<string>();

  if (user) {
    const ids = Array.from(bySlug.values()).map((r) => r.id);
    const progress = await prisma.progress.findMany({
      where: { userId: user.id, domain: "highschool", entityType: "topic", entityId: { in: ids } },
      orderBy: { lastStudied: "desc" },
    });
    completed = new Set(progress.filter((p) => p.status === "completed").map((p) => p.entityId));
    const attempts = await prisma.quizAttempt.findMany({
      where: { userId: user.id, domain: "highschool", topicId: { in: ids } },
      orderBy: { createdAt: "desc" },
    });
    const latest = new Map<string, { score: number; maxScore: number }>();
    for (const a of attempts) if (!latest.has(a.topicId)) latest.set(a.topicId, { score: a.score, maxScore: a.maxScore });
    latest.forEach((a, topicId) => {
      if (!completed.has(topicId) && a.maxScore > 0 && a.score / a.maxScore < 0.7) needsRetry.add(topicId);
    });
    const last = progress[0];
    if (last) {
      const found = rows.find((r) => r.id === last.entityId);
      if (found) {
        const meta = subject.topics.find((t) => t.slug === found.slug)!;
        resume = {
          slug: found.slug!, title: meta.title, subtopics: meta.subtopics,
          chapterReady: true, advanced: false, questions: 0,
          completed: completed.has(found.id), needsRetry: false, coreInRegion: false,
        };
      }
    }
  }

  if (regionParam) {
    const aligns = await prisma.topicBoardAlignment.findMany({
      where: { tier: "core", board: { regionId: regionParam }, topic: { slug: { in: topicSlugs } } },
      select: { topicId: true },
    });
    coreTopicIds = new Set(aligns.map((a) => a.topicId));
  }
  const regions = await prisma.region.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } });

  const topics: TopicRow[] = subject.topics.map((t) => {
    const row = bySlug.get(t.slug);
    return {
      slug: t.slug,
      title: t.title,
      subtopics: t.subtopics,
      chapterReady: (row?._count.lessons ?? 0) > 0,
      advanced: (row?._count.lessons ?? 0) > 1,
      questions: row?._count.questions ?? 0,
      completed: !!row && completed.has(row.id),
      needsRetry: !!row && needsRetry.has(row.id),
      coreInRegion: !!row && coreTopicIds.has(row.id),
    };
  });

  const doneCount = topics.filter((t) => t.completed).length;

  return (
    <div className="min-h-screen bg-transparent text-slate-100 p-4 md:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <nav className="text-sm text-slate-400">
          <Link href="/highschool" className="hover:text-amber-400">High School</Link> <span>→</span>{" "}
          <Link href="/highschool/study" className="hover:text-amber-400">Study</Link> <span>→ {subject.name}</span>
        </nav>

        <header className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-serif font-bold">{subject.name}</h1>
          <p className="text-sm text-slate-500">{topics.length} topics · {doneCount} complete</p>
        </header>

        {resume && (
          <Link
            href={`/highschool/study/${subject.slug}/${resume.slug}`}
            className="sticky top-2 z-20 block rounded-xl border border-amber-500/30 bg-slate-950/90 backdrop-blur p-3 hover:border-amber-400/60"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-amber-200">Continue where you left off: <strong>{resume.title}</strong></span>
              <ArrowRight className="w-4 h-4 text-amber-400 shrink-0" />
            </div>
          </Link>
        )}

        <details className="rounded-xl border border-slate-800 bg-slate-900/70">
          <summary className="cursor-pointer select-none p-3 text-sm text-slate-400 flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-teal-400" /> Region filter
            {regionParam && <span className="text-teal-300">· active</span>}
          </summary>
          <form method="get" className="flex flex-wrap items-center gap-2 border-t border-slate-800 p-3 text-sm">
            <select name="region" defaultValue={regionParam} className="rounded bg-slate-900 border border-slate-700 px-2 py-1.5">
              <option value="">All regions</option>
              {regions.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            <button className="rounded bg-amber-500 px-3 py-1.5 font-semibold text-slate-950" type="submit">Apply</button>
            {regionParam && <Link href={`/highschool/study/${subject.slug}`} className="rounded border border-slate-600 px-3 py-1.5">Clear</Link>}
            <span className="text-xs text-slate-500">Highlights topics marked core in that region&apos;s boards.</span>
          </form>
        </details>

        <ol className="space-y-3">
          {topics.map((t, i) => (
            <li key={t.slug}>
              <Link
                href={`/highschool/study/${subject.slug}/${t.slug}`}
                className="block rounded-xl border border-slate-800 bg-slate-900/70 p-4 hover:border-amber-500/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 w-7 h-7 shrink-0 rounded-full border border-slate-700 bg-slate-800/60 flex items-center justify-center text-xs font-bold text-slate-400">{i + 1}</span>
                    <div>
                      <h2 className="font-semibold text-slate-100">
                        {t.completed && <CheckCircle2 className="inline w-4 h-4 mr-1 text-emerald-400" aria-label="Completed" />}
                        {t.title}
                      </h2>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {t.completed ? null : (
                          <>
                            <StatusChip tone={t.chapterReady ? "ready" : "muted"} label={t.chapterReady ? "Chapter ready" : "Chapter coming"} />
                            {t.advanced && <StatusChip tone="gold" label="+ Advanced" />}
                            {t.questions > 0 && (
                              <StatusChip tone={t.needsRetry ? "retry" : "amber"} label={t.needsRetry ? "Quiz: Needs Retry" : `Quiz: ${t.questions} Qs`} />
                            )}
                            {t.coreInRegion && <StatusChip tone="gold" label="Core in region" />}
                          </>
                        )}
                      </div>
                      <SubtopicChips subtopics={t.subtopics} />
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 mt-1 shrink-0" />
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function StatusChip({ tone, label }: { tone: "ready" | "amber" | "gold" | "retry" | "muted"; label: string }) {
  const cls = {
    ready: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    amber: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    gold: "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30",
    retry: "bg-red-500/10 text-red-300 border-red-500/30",
    muted: "bg-slate-800 text-slate-500 border-slate-700",
  }[tone];
  return <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${cls}`}>{label}</span>;
}

// First 3 subtopic chips + "+N more" pill to keep mobile rows tidy.
function SubtopicChips({ subtopics }: { subtopics: string[] }) {
  const first = subtopics.slice(0, 3);
  return (
    <div className="mt-2 flex flex-wrap gap-1 text-[11px] text-slate-500">
      {first.map((s) => (
        <span key={s} className="rounded border border-slate-800 bg-slate-950/60 px-1.5 py-0.5 truncate max-w-[220px]">{s}</span>
      ))}
      {subtopics.length > first.length && (
        <details className="inline">
          <summary className="cursor-pointer list-none rounded border border-slate-700 bg-slate-800/60 px-1.5 py-0.5 text-slate-400">+{subtopics.length - first.length} more</summary>
          <div className="mt-1 flex flex-wrap gap-1">
            {subtopics.slice(3).map((s) => (
              <span key={s} className="rounded border border-slate-800 bg-slate-950/60 px-1.5 py-0.5">{s}</span>
            ))}
          </div>
        </details>
      )}
      {subtopics.length === 0 && <Sparkles className="w-3 h-3 inline text-slate-700" />}
    </div>
  );
}
