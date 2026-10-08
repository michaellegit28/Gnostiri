import Link from "next/link";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { SUBJECTS, allTopicSlugs, topicBySlug } from "@/lib/curriculum";
import ProgressRing from "@/components/study/ProgressRing";
import StudySearch from "@/components/study/StudySearch";
import { Sigma, Dna, FlaskConical, Atom, Landmark, Briefcase, Globe2, Cpu, Palette, Wrench, HeartPulse, ArrowRight, BookOpen, type LucideIcon } from "lucide-react";

export const dynamic = "force-dynamic";

const ICONS: Record<string, LucideIcon> = {
  Sigma, Dna, FlaskConical, Atom, Landmark, Briefcase, Globe2, Cpu, Palette, Wrench, HeartPulse,
};

// Level 1 — subjects board. Old flat topic URLs (/highschool/study/<topic-slug>)
// land here as [subject] misses and 301-redirect into the subject-scoped hierarchy.
export default async function StudyBoard() {
  // Legacy /highschool/study/<topic-slug> never reaches this page (it hits [subject]).
  const slugs = allTopicSlugs();
  const rows = await prisma.topic.findMany({
    where: { slug: { in: slugs } },
    select: { slug: true, _count: { select: { lessons: true, questions: true } } },
  });
  const bySlug = new Map(rows.map((r) => [r.slug!, r._count]));

  const user = await getCurrentUser();
  let resume: { subjectSlug: string; subjectName: string; topicSlug: string; topicTitle: string; pct: number } | null = null;
  const completed = new Set<string>();
  if (user) {
    const progress = await prisma.progress.findMany({
      where: { userId: user.id, domain: "highschool", entityType: "topic", entityId: { startsWith: "master-" } },
      orderBy: { lastStudied: "desc" },
    });
    for (const p of progress) if (p.status === "completed") completed.add(p.entityId.replace("master-", ""));
    const last = progress[0];
    if (last) {
      const found = topicBySlug(last.entityId.replace("master-", ""));
      if (found) {
        resume = {
          subjectSlug: found.subject.slug,
          subjectName: found.subject.name,
          topicSlug: found.topic.slug,
          topicTitle: found.topic.title,
          pct: Math.round((last.accuracy ?? 0) * 100),
        };
      }
    }
  }

  const statsFor = (subjectSlug: string) => {
    const subject = SUBJECTS.find((s) => s.slug === subjectSlug)!;
    const ready = subject.topics.filter((t) => (bySlug.get(t.slug)?.lessons ?? 0) > 0).length;
    const done = subject.topics.filter((t) => completed.has(t.slug)).length;
    return { total: subject.topics.length, ready, done };
  };

  const groups: { key: "core" | "vocational"; label: string }[] = [
    { key: "core", label: "Core academics" },
    { key: "vocational", label: "Electives & Vocational" },
  ];

  return (
    <div className="min-h-screen bg-transparent text-slate-100 p-4 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <nav className="text-sm text-slate-400">
          <Link href="/highschool" className="hover:text-amber-400">High School</Link> <span>→ Study</span>
        </nav>

        <header className="space-y-4 text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#D4AF37]">Open textbooks</p>
          <h1 className="text-3xl md:text-5xl font-serif font-bold">Pick your subject, open a chapter</h1>
          <StudySearch />
        </header>

        {resume && (
          <Link
            href={`/highschool/study/${resume.subjectSlug}/${resume.topicSlug}`}
            className="block rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 hover:border-amber-400/60 transition-colors"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-amber-200">
                Continue: <strong>{resume.subjectName} → {resume.topicTitle}</strong>
                <span className="ml-2 text-xs text-amber-300/80">{resume.pct}% complete</span>
              </span>
              <ArrowRight className="w-4 h-4 text-amber-400 shrink-0" />
            </div>
          </Link>
        )}

        {groups.map(({ key, label }) => (
          <section key={key} aria-label={label} className="space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">{label}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SUBJECTS.filter((s) => s.group === key).map((subject) => {
                const Icon = ICONS[subject.icon] ?? BookOpen;
                const stats = statsFor(subject.slug);
                return (
                  <Link
                    key={subject.slug}
                    href={`/highschool/study/${subject.slug}`}
                    className="group rounded-xl border border-slate-800 bg-slate-900/70 p-5 hover:border-[#D4AF37]/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="rounded-lg border border-slate-700 bg-slate-800/60 p-2"><Icon className="w-5 h-5 text-[#D4AF37]" /></span>
                        <h3 className="font-semibold text-slate-100 group-hover:text-amber-300">{subject.name}</h3>
                      </div>
                      <ProgressRing value={stats.total ? stats.done / stats.total : 0} />
                    </div>
                    <p className="mt-3 text-xs text-slate-500">
                      {stats.total} topics · {stats.ready} chapters ready · <span className={stats.done ? "text-emerald-400" : ""}>{stats.done}/{stats.total} complete</span>
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
