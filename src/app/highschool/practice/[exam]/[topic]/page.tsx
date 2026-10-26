import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/db";
import { buildRenderManifest } from "@/lib/exam-manifest";
import { SUBJECTS, topicBySlug } from "@/lib/curriculum";
import { ChevronRight, Clock, Target, BadgeCheck, ExternalLink } from "lucide-react";
import PracticeRunner from "./PracticeRunner";

export const dynamic = "force-dynamic";

interface PracticePageProps {
  params: { exam: string; topic: string };
  searchParams?: { subject?: string };
}

const EXAM_CODE_PREFIXES = ["jamb"];

function fallbackSubject(topicId: string): string | null {
  for (const subject of SUBJECTS) {
    for (const prefix of EXAM_CODE_PREFIXES) {
      if (topicId.startsWith(`${prefix}-${subject.slug}-`)) return subject.slug;
    }
  }
  return null;
}

// Practice session page: the manifest is the single source of truth. The
// server renders the section overview + verification badge (RULE 5); the
// client runner walks sections in sequence order behind the bridge lock.
export default async function BoardPracticePage({ params, searchParams }: PracticePageProps) {
  const boardSlug = params.exam.toLowerCase();
  const topicParam = params.topic;

  const topicRow = await prisma.topic.findFirst({
    where: { OR: [{ id: topicParam }, { slug: topicParam }] },
    select: { id: true, slug: true },
  });
  if (!topicRow) notFound();

  const subjectSlug =
    searchParams?.subject?.toLowerCase() ??
    (topicRow.slug ? topicBySlug(topicRow.slug)?.subject.slug ?? null : null) ??
    fallbackSubject(topicRow.id);

  const manifest = await buildRenderManifest(boardSlug, subjectSlug ?? "all", topicRow.id);
  if (!manifest) notFound();

  return (
    <div className="min-h-screen bg-transparent text-slate-50 p-4 md:p-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
          <Link href="/highschool/exams" className="hover:text-gold transition-colors">Exams</Link>
          <ChevronRight className="w-4 h-4 text-slate-600" />
          <Link href={`/highschool/practice/${manifest.boardId}`} className="hover:text-gold transition-colors">
            {manifest.board} practice
          </Link>
          <ChevronRight className="w-4 h-4 text-slate-600" />
          <span className="text-slate-100 font-medium">{manifest.topic}</span>
        </nav>

        {/* RULE 5 — verification badge fields travel with every manifest surface */}
        <header className="relative overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(110%_100%_at_50%_0%,#14213d_0%,#0a0f22_55%,#060814_100%)] p-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-teal-300 text-xs font-semibold uppercase tracking-[0.25em]">
              {manifest.board} · Board-format practice
            </p>
            {manifest.lastVerified && (
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-300 border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                <BadgeCheck className="w-3.5 h-3.5" />
                Format verified {new Date(manifest.lastVerified).toLocaleDateString()}
                {manifest.syllabusUrl && (
                  <a href={manifest.syllabusUrl} target="_blank" rel="noopener noreferrer" className="ml-1 underline decoration-dotted">
                    syllabus
                  </a>
                )}
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold">
            {manifest.topic} <span className="text-gold">— {manifest.board} format</span>
          </h1>
          {manifest.notes && <p className="text-amber-300/90 text-sm">{manifest.notes}</p>}
        </header>

        {manifest.sections.length === 0 ? (
          <section className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-center space-y-3">
            <Clock className="w-8 h-8 text-slate-500 mx-auto" />
            <h2 className="font-serif text-2xl font-bold">No sections for this topic yet</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              {manifest.board} has not examined this topic in its current format, or its questions are
              still being tagged. Try another topic.
            </p>
            <Link href={`/highschool/practice/${manifest.boardId}`} className="inline-flex rounded-lg bg-gold px-5 py-3 font-semibold text-slate-950">
              More {manifest.board} topics
            </Link>
          </section>
        ) : (
          <PracticeRunner
            boardName={manifest.board}
            boardSlug={manifest.boardId}
            topicId={manifest.topicId}
            topicTitle={manifest.topic}
            sections={manifest.sections}
          />
        )}
      </div>
    </div>
  );
}
