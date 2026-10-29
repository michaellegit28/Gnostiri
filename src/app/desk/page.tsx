import Link from "next/link";
import { getCurrentUser } from "@/lib/server-auth";
import prisma from "@/lib/db";
import UploadForm from "@/components/desk/UploadForm";
import TaskList, { type DeskTask } from "@/components/desk/TaskList";
import DocumentList, { type DeskDocument } from "@/components/desk/DocumentList";
import { FolderOpen } from "lucide-react";

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
        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/80 p-8 text-center">
          <FolderOpen className="mx-auto mb-4 h-10 w-10 text-gold" />
          <h1 className="font-serif text-2xl font-bold">Your Desk needs you signed in</h1>
          <p className="mt-2 text-sm text-slate-400">Uploads are private: notes, quizzes and plans stay on your account.</p>
          <Link href="/login" className="mt-6 inline-block rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-slate-950">
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

  return (
    <div className="min-h-screen bg-transparent text-slate-100 p-6 md:p-12">
      <div className="mx-auto max-w-5xl space-y-10">
        <header className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Desk</p>
          <h1 className="font-serif text-3xl font-bold">Turn any PDF into a study plan</h1>
          <p className="text-sm text-slate-400">
            Extracted and summarised on upload; scheduled into a 3- or 7-day plan. The source PDF is never stored.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="font-serif text-xl font-bold">New document</h2>
          <UploadForm />
        </section>

        <section className="space-y-4">
          <TaskList tasks={taskRows} heading="Today's plan" />
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-xl font-bold">Your documents</h2>
          <DocumentList documents={documentRows} />
        </section>
      </div>
    </div>
  );
}
