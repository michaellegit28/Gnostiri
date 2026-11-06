import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/server-auth";
import prisma from "@/lib/db";
import LessonRenderer from "@/components/university/LessonRenderer";
import DocumentQuiz, { type QuizItem } from "@/components/desk/DocumentQuiz";
import TaskList, { type DeskTask } from "@/components/desk/TaskList";
import StageFlow, { DOCUMENT_STATUS_LABEL, type Stage } from "@/components/desk/StageFlow";
import { ChevronLeft, ShieldCheck } from "lucide-react";
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

  // This document's real pipeline position, read off the same fields the
  // sections below render — a stage is "done" only when its rows exist.
  const statusLabel = DOCUMENT_STATUS_LABEL[document.status] ?? document.status;
  const stages: Stage[] = [
    { key: "upload", label: "Upload", hint: `Uploaded ${document.createdAt.toISOString().slice(0, 10)}.`, state: "done" },
    {
      key: "process",
      label: "Process",
      hint:
        document.status === "processing"
          ? "Text is being extracted — check back in a moment."
          : `Status: ${statusLabel}.`,
      state:
        document.status === "failed"
          ? "failed"
          : document.status === "processing"
            ? "active"
            : "done",
    },
    {
      key: "notes",
      label: "Notes",
      hint:
        sections.length > 0
          ? `${sections.length} section${sections.length === 1 ? "" : "s"} of processed notes.`
          : document.status === "failed"
            ? "Processing failed, so no notes were produced."
            : "No extractable text — nothing was invented to fill the gap.",
      state: sections.length > 0 ? "done" : document.status === "failed" ? "failed" : "pending",
      href: "#desk-notes",
    },
    {
      key: "plans",
      label: "Plans",
      hint:
        taskRows.length > 0
          ? `${taskRows.length} study task${taskRows.length === 1 ? "" : "s"} scheduled.`
          : document.status === "failed"
            ? "Processing failed, so no plan was scheduled."
            : "No plan scheduled for this document.",
      state: taskRows.length > 0 ? "done" : document.status === "failed" ? "skipped" : "pending",
      href: "#desk-plan",
    },
    {
      key: "quizzes",
      label: "Quizzes",
      hint:
        quizRows.length > 0
          ? `${quizRows.length} invariant-checked question${quizRows.length === 1 ? "" : "s"}.`
          : document.status === "needs-ai" && !document.errorNote
            ? "No AI model is configured here, so quiz generation was skipped."
            : "No quiz questions for this document.",
      state: quizRows.length > 0 ? "done" : document.status === "needs-ai" ? "skipped" : "pending",
      href: "#desk-practise",
    },
  ];

  return (
    <div className="min-h-screen bg-transparent text-slate-100 p-6 md:p-12">
      <div className="mx-auto max-w-5xl space-y-10">
        <Link href="/desk" className="gn-motion inline-flex items-center gap-1.5 rounded text-sm text-slate-400 transition-colors hover:text-electric-text focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <ChevronLeft className="h-4 w-4" /> All documents
        </Link>

        <header className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.3em] text-electric-text">Desk</p>
          <h1 className="font-serif text-3xl font-bold">{document.title}</h1>
          <p className="text-sm text-muted">
            {document.pageCount} page{document.pageCount === 1 ? "" : "s"} · {sections.length} notes section
            {sections.length === 1 ? "" : "s"} · {quizRows.length} quiz item{quizRows.length === 1 ? "" : "s"} ·{" "}
            {taskRows.length} task{taskRows.length === 1 ? "" : "s"}
            {document.subjectSlug ? ` · ${document.subjectSlug}` : ""}
            {!owned ? " · shared artifact (same textbook as another student's)" : ""}
          </p>
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/40 px-3 py-1.5 text-xs text-muted">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" aria-hidden />
            {owned
              ? "Your PDF was processed in memory and never stored — only the extracted notes persist."
              : "The source PDF was never stored — only the extracted notes persist, shared without personal data."}
          </p>
          {document.errorNote && (
            <p className="text-sm text-amber-300">{document.errorNote}</p>
          )}
        </header>

        <StageFlow stages={stages} label="This document's pipeline" />

        <section id="desk-notes" className="space-y-4 scroll-mt-24">
          <h2 className="font-serif text-xl font-bold">Notes</h2>
          {sections.length === 0 ? (
            <p className="rounded-xl border border-dashed border-line bg-surface/40 p-6 text-sm text-muted">
              {document.status === "processing"
                ? "Still processing — check back in a moment."
                : document.status === "failed"
                  ? "Processing failed, so there are no notes."
                  : "No extractable text — this looks like a scanned PDF. Nothing was invented to fill the gap."}
            </p>
          ) : (
            <div className="gn-card gn-shadow rounded-xl p-6">
              <LessonRenderer content={{ blocks: sections.flatMap((section) => section.blocks) }} />
            </div>
          )}
        </section>

        <section id="desk-practise" className="space-y-4 scroll-mt-24">
          <h2 className="font-serif text-xl font-bold">Practise</h2>
          {quizRows.length > 0 ? (
            <DocumentQuiz documentId={document.id} items={quizRows} />
          ) : (
            <p className="rounded-xl border border-dashed border-line bg-surface/40 p-6 text-sm text-muted">
              No quiz questions for this document yet.
              {document.status === "needs-ai" && !document.errorNote
                ? " No AI model is configured in this environment, so quiz generation was skipped rather than fabricated."
                : ""}
            </p>
          )}
        </section>

        <section id="desk-plan" className="space-y-4 scroll-mt-24">
          <TaskList tasks={taskRows} heading="This document's plan" uploadHref="/desk" />
        </section>
      </div>
    </div>
  );
}
