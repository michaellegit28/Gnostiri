import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/server-auth";
import prisma from "@/lib/db";
import LessonRenderer from "@/components/university/LessonRenderer";
import DocumentQuiz, { type QuizItem } from "@/components/desk/DocumentQuiz";
import TaskList, { type DeskTask } from "@/components/desk/TaskList";
import { ChevronLeft } from "lucide-react";
import type { LessonContent } from "@/types/lesson";

export const dynamic = "force-dynamic";

/**
 * /desk/[id] — one processed document.
 *
 * Notes render through the EXISTING lesson renderer (the same reader as
 * university lessons) by mapping the stored notes sections straight into its
 * block shape. The Practise panel plays the document quiz via the server-side
 * scoring route — answers are never shipped to the client before submit.
 */
export default async function DeskDocumentPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) notFound();

  const document = await prisma.studyDocument.findUnique({ where: { id: params.id } });
  if (!document) notFound();

  const owned = document.userId === user.id;
  if (!owned) {
    const adopted = await prisma.documentQuizItem.findFirst({
      where: { documentId: document.id, userId: user.id },
      select: { id: true },
    });
    if (!adopted) notFound(); // not yours and not deduped to you — existence stays private
  }

  const [quizItems, tasks] = await Promise.all([
    prisma.documentQuizItem.findMany({ where: { documentId: document.id, userId: user.id }, orderBy: { createdAt: "asc" } }),
    prisma.studyTask.findMany({ where: { documentId: document.id, userId: user.id }, orderBy: { scheduledFor: "asc" } }),
  ]);

  const sections = Array.isArray(document.notes)
    ? (document.notes as unknown as Array<{ title: string; blocks: LessonContent["blocks"] }>)
    : [];

  const quizRows: QuizItem[] = quizItems.map((item) => ({
    id: item.id,
    stem: item.stem,
    options: item.options,
    difficulty: item.difficulty,
  }));

  const taskRows: DeskTask[] = tasks.map((task) => ({
    id: task.id,
    kind: task.kind,
    title: task.title,
    minutes: task.minutes,
    scheduledFor: task.scheduledFor.toISOString(),
    status: task.status,
    documentId: task.documentId,
    documentTitle: document.title,
  }));

  return (
    <div className="min-h-screen bg-transparent text-slate-100 p-6 md:p-12">
      <div className="mx-auto max-w-5xl space-y-10">
        <Link href="/desk" className="inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-gold">
          <ChevronLeft className="h-4 w-4" /> All documents
        </Link>

        <header className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Desk</p>
          <h1 className="font-serif text-3xl font-bold">{document.title}</h1>
          <p className="text-sm text-slate-400">
            {document.pageCount} page{document.pageCount === 1 ? "" : "s"}
            {document.subjectSlug ? ` · ${document.subjectSlug}` : ""}
            {!owned ? " · shared artifact (same textbook as another student's)" : ""}
          </p>
          {document.errorNote && (
            <p className="text-sm text-amber-300">{document.errorNote}</p>
          )}
        </header>

        <section className="space-y-4">
          <h2 className="font-serif text-xl font-bold">Notes</h2>
          {sections.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-700 p-6 text-sm text-slate-500">
              {document.status === "processing"
                ? "Still processing — check back in a moment."
                : document.status === "failed"
                  ? "Processing failed, so there are no notes."
                  : "No extractable text — this looks like a scanned PDF. Nothing was invented to fill the gap."}
            </p>
          ) : (
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
              <LessonRenderer content={{ blocks: sections.flatMap((section) => section.blocks) }} />
            </div>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-xl font-bold">Practise</h2>
          {quizRows.length > 0 ? (
            <DocumentQuiz documentId={document.id} items={quizRows} />
          ) : (
            <p className="rounded-xl border border-dashed border-slate-700 p-6 text-sm text-slate-500">
              No quiz questions for this document yet.
              {document.status === "needs-ai" && !document.errorNote
                ? " No AI model is configured in this environment, so quiz generation was skipped rather than fabricated."
                : ""}
            </p>
          )}
        </section>

        <section className="space-y-4">
          <TaskList tasks={taskRows} heading="This document's plan" />
        </section>
      </div>
    </div>
  );
}
