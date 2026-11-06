import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Gift, ShieldCheck, Trophy } from "lucide-react";
import { getCurrentUser } from "@/lib/server-auth";
import prisma from "@/lib/db";
import LessonRenderer from "@/components/university/LessonRenderer";
import AdoptButton from "@/components/library/AdoptButton";
import type { LessonContent } from "@/types/lesson";

export const dynamic = "force-dynamic";

/**
 * /library/[id] — one shared artifact.
 *
 * The notes render through the SAME lesson renderer the Desk document page
 * uses (src/components/university/LessonRenderer), mapping the stored sections
 * straight into its block shape — no second renderer. The adopt CTA posts to
 * the adopt endpoint and then links to the desk. Anonymous readers can read
 * the shared notes; adopting needs an account.
 */
export default async function LibraryArtifactPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();

  const document = await prisma.studyDocument.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      title: true,
      subjectSlug: true,
      pageCount: true,
      status: true,
      reuseCount: true,
      sharedAt: true,
      visibility: true,
      createdAt: true,
      notes: true,
      user: { select: { name: true } },
      _count: { select: { quizItems: true } },
    },
  });
  if (!document || document.visibility !== "public") notFound();

  const sections = Array.isArray(document.notes)
    ? (document.notes as unknown as Array<{ title: string; blocks: LessonContent["blocks"] }>)
    : [];
  const blocks = sections.flatMap((section) => section.blocks);
  const uploader = document.user?.name?.trim()?.split(/\s+/)[0] || "A Gnostiri student";

  return (
    <div className="min-h-screen bg-transparent text-slate-100 p-6 md:p-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <Link href="/library" className="inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-cyan-300">
          <ChevronLeft className="h-4 w-4" /> Library
        </Link>

        <header className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-300">Shared artifact</p>
          <h1 className="font-serif text-3xl font-bold">{document.title}</h1>
          <p className="text-sm text-muted">
            {document.pageCount} page{document.pageCount === 1 ? "" : "s"}
            {document.subjectSlug ? ` · ${document.subjectSlug}` : ""} · {document._count.quizItems} quiz item
            {document._count.quizItems === 1 ? "" : "s"} · shared by {uploader}
            {document.reuseCount > 0 ? ` · reused by ${document.reuseCount} classmate${document.reuseCount === 1 ? "" : "s"}` : ""}
          </p>
          <p className="text-xs text-muted">
            The notes below are the shared preview — the full artifact lands on your desk when you adopt
            {document.sharedAt ? ` · published ${document.sharedAt.toISOString().slice(0, 10)}` : ""}.
          </p>
        </header>

        <section className="gn-card gn-shadow space-y-4 rounded-2xl p-6">
          <h2 className="font-serif text-xl font-bold">Notes</h2>
          {blocks.length === 0 ? (
            <p className="text-sm text-muted">This artifact has no extractable notes.</p>
          ) : (
            <LessonRenderer content={{ blocks }} />
          )}
          {document._count.quizItems > 0 && (
            <p className="border-t border-line pt-4 text-xs text-muted">
              The {document._count.quizItems} quiz item{document._count.quizItems === 1 ? "" : "s"} for this artifact stay
              answer-safe until you adopt it — answers are scored on the server, never shown here.
            </p>
          )}
        </section>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="gn-shadow rounded-xl border border-gold/30 bg-gold/5 p-4 text-sm text-slate-100">
            <p className="mb-1 inline-flex items-center gap-1.5 font-semibold text-gold">
              <Trophy className="h-4 w-4" /> Rewards flow to the sharer
            </p>
            <p className="text-slate-300">
              <span className="text-gold">{uploader}</span> earns badges and Prime-day credits each time a classmate adopts this
              artifact. Adopting is always free for you.
            </p>
          </div>
          <div className="gn-shadow rounded-xl border border-line bg-surface/40 p-4 text-sm text-slate-300">
            <p className="mb-1 inline-flex items-center gap-1.5 font-semibold text-slate-100">
              <ShieldCheck className="h-4 w-4 text-cyan-300" /> Artifacts, never files
            </p>
            <p className="text-muted">The source PDF is never stored or shared — only these processed notes and the quiz items exist.</p>
          </div>
        </div>

        <section className="gn-shadow flex flex-col items-start gap-2 rounded-2xl border border-electric/30 bg-electric/5 p-6">
          <h2 className="inline-flex items-center gap-2 font-serif text-xl font-bold text-electric-text">
            <Gift className="h-5 w-5" /> Put it on your desk
          </h2>
          <p className="text-sm text-slate-300">
            Adopt adds the notes, the full quiz and a study plan to your desk — you study it as your own, and the sharer is rewarded.
          </p>
          <AdoptButton documentId={document.id} signedIn={!!user} label="Adopt to my desk" className="mt-1" />
        </section>
      </div>
    </div>
  );
}
