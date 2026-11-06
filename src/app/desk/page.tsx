import Link from "next/link";
import { getCurrentUser } from "@/lib/server-auth";
import prisma from "@/lib/db";
import { isAiConfigured } from "@/lib/desk-ai";
import UploadForm from "@/components/desk/UploadForm";
import TaskList, { type DeskTask } from "@/components/desk/TaskList";
import DocumentList, { type DeskDocument } from "@/components/desk/DocumentList";
import StageFlow, { DOCUMENT_STATUS_LABEL, type Stage } from "@/components/desk/StageFlow";
import { FolderOpen, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

/**
 * /desk — the Desk hub: upload a PDF, today's plan, your documents.
 *
 * Server-rendered straight from Prisma (no API round-trip for the shell), the
 * upload/plan interactions live in the client components below. Documents a
 * user adopted through hash dedupe appear here too — shared processed
 * artifacts, marked as such.
 */
export default async function DeskPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="min-h-screen bg-transparent text-slate-100 p-6 md:p-12">
        <div className="gn-shadow mx-auto max-w-2xl rounded-2xl border border-line bg-surface p-8 text-center">
          <FolderOpen className="mx-auto mb-4 h-10 w-10 text-gold" />
          <h1 className="font-serif text-2xl font-bold">Your Desk needs you signed in</h1>
          <p className="mt-2 text-sm text-slate-400">Uploads are private: notes, quizzes and plans stay on your account.</p>
          <Link href="/login" className="gn-motion mt-6 inline-flex min-h-12 items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.98]">
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  const startOfToday = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate()));

  const [tasks, owned, adopted] = await Promise.all([
    prisma.studyTask.findMany({
      where: { userId: user.id, scheduledFor: { gte: startOfToday, lt: new Date(startOfToday.getTime() + 86_400_000) } },
      orderBy: { scheduledFor: "asc" },
      include: { document: { select: { id: true, title: true } } },
    }),
    prisma.studyDocument.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { quizItems: { where: { userId: user.id } }, tasks: { where: { userId: user.id } } } } },
      take: 50,
    }),
    prisma.studyDocument.findMany({
      where: { userId: { not: user.id }, quizItems: { some: { userId: user.id } } },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { quizItems: { where: { userId: user.id } }, tasks: { where: { userId: user.id } } } } },
      take: 50,
    }),
  ]);

  const taskRows: DeskTask[] = tasks.map((t) => ({
    id: t.id,
    kind: t.kind,
    title: t.title,
    minutes: t.minutes,
    scheduledFor: t.scheduledFor.toISOString(),
    status: t.status,
    documentId: t.documentId,
    documentTitle: t.document?.title ?? null,
  }));

  const documentRows: DeskDocument[] = [...owned, ...adopted].map((d) => ({
    id: d.id,
    title: d.title,
    status: d.status,
    pageCount: d.pageCount,
    errorNote: d.errorNote,
    createdAt: d.createdAt.toISOString(),
    owned: d.userId === user.id,
    quizCount: d._count.quizItems,
    taskCount: d._count.tasks,
  }));

  // The pipeline explainer — every stage below is a step the upload route
  // really performs, read off the same fields the document pages render. The
  // quiz stage reports this environment's real AI state rather than promising
  // a quiz that the pipeline will skip.
  const aiConfigured = isAiConfigured();
  const pipelineStages: Stage[] = [
    { key: "upload", label: "Upload", hint: "Choose a PDF — up to 120 pages, 8 MB.", state: "pending", href: "#desk-upload" },
    { key: "process", label: "Process", hint: "Text is extracted in memory; a content hash keeps the same textbook from processing twice.", state: "pending" },
    { key: "notes", label: "Notes", hint: "Extracted sections become the document's notes — the only artifact that persists.", state: "pending" },
    { key: "plans", label: "Plans", hint: "Your minutes-per-day and streak length schedule reading and quiz tasks.", state: "pending" },
    {
      key: "quizzes",
      label: "Quizzes",
      hint: aiConfigured
        ? "Practice questions are generated and invariant-checked before they are stored."
        : "No AI model is configured in this environment, so quizzes are skipped — the notes still stand alone.",
      state: aiConfigured ? "pending" : "skipped",
    },
  ];

  // Document organisation — the real status mix, counted from the rows.
  const statusBuckets = new Map<string, number>();
  for (const doc of documentRows) statusBuckets.set(doc.status, (statusBuckets.get(doc.status) ?? 0) + 1);
  const statusSummary = Array.from(statusBuckets.entries())
    .map(([status, count]) => `${count} ${DOCUMENT_STATUS_LABEL[status] ?? status}`)
    .join(" · ");

  return (
    <div className="min-h-screen bg-transparent text-slate-100 p-6 md:p-12">
      <div className="mx-auto max-w-5xl space-y-10">
        <header className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.3em] text-electric-text">Desk</p>
          <h1 className="font-serif text-3xl font-bold">Turn any PDF into a study plan</h1>
          <p className="text-sm text-slate-400">
            Extracted and summarised on upload, then scheduled into a 3- or 7-day plan.
          </p>
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/40 px-3 py-1.5 text-xs text-muted">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" aria-hidden />
            Your PDF is processed in memory and never stored — only the extracted notes persist.
          </p>
        </header>

        <StageFlow stages={pipelineStages} label="How a document moves through the Desk" />

        <section id="desk-upload" className="space-y-4 scroll-mt-24">
          <h2 className="font-serif text-xl font-bold">New document</h2>
          <UploadForm />
        </section>

        <section className="space-y-4">
          <TaskList tasks={taskRows} heading="Today's plan" uploadHref="#desk-upload" />
        </section>

        <section className="space-y-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-serif text-xl font-bold">Your documents</h2>
            {documentRows.length > 0 && (
              <p className="text-xs text-muted">
                {documentRows.length} document{documentRows.length === 1 ? "" : "s"}
                {statusSummary ? ` · ${statusSummary}` : ""}
              </p>
            )}
          </div>
          <DocumentList documents={documentRows} />
        </section>
      </div>
    </div>
  );
}
