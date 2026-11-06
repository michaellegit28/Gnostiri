"use client";

import Link from "next/link";
import { FileText, FileCheck2, Sparkles, AlertTriangle, ListChecks } from "lucide-react";
import { DOCUMENT_STATUS_LABEL } from "./StageFlow";

/**
 * DocumentList — the user's Desk documents with honest status chips.
 *
 * needs-ai is shown as a real state, never an error: it means extractive
 * notes exist but no AI model produced a quiz — the student knows exactly
 * what they are getting. The empty state points at the real upload control
 * on the Desk page (#desk-upload) rather than promising anything else.
 */

export interface DeskDocument {
  id: string;
  title: string;
  status: string;
  pageCount: number;
  errorNote: string | null;
  createdAt: string;
  owned: boolean;
  quizCount: number;
  taskCount: number;
}

const STATUS_META: Record<string, { label: string; icon: typeof FileText; classes: string }> = {
  processing: { label: DOCUMENT_STATUS_LABEL.processing, icon: Sparkles, classes: "border-cyan-400/40 bg-cyan-400/10 text-cyan-300" },
  ready: { label: DOCUMENT_STATUS_LABEL.ready, icon: FileCheck2, classes: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" },
  "needs-ai": { label: DOCUMENT_STATUS_LABEL["needs-ai"], icon: ListChecks, classes: "border-amber-500/40 bg-amber-500/10 text-amber-300" },
  failed: { label: DOCUMENT_STATUS_LABEL.failed, icon: AlertTriangle, classes: "border-rose-500/40 bg-rose-500/10 text-rose-300" },
};

export default function DocumentList({ documents }: { documents: DeskDocument[] }) {
  if (documents.length === 0) {
    return (
      <div className="gn-shadow rounded-2xl border border-dashed border-line bg-surface/40 p-8 text-center">
        <FileText className="mx-auto mb-3 h-8 w-8 text-muted" aria-hidden />
        <p className="text-sm font-medium text-slate-100">No documents yet — upload a PDF to get started.</p>
        <p className="mx-auto mt-1 max-w-md text-xs text-muted">
          A document becomes notes, a scheduled plan and (where an AI model is configured) a quiz. Adopted artifacts from
          the Public Library land here too.
        </p>
        <Link
          href="#desk-upload"
          className="gn-motion mt-4 inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.98]"
        >
          <FileText className="h-4 w-4" aria-hidden /> Go to the upload form
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {documents.map((doc) => {
        const meta = STATUS_META[doc.status] ?? STATUS_META.processing;
        const Icon = meta.icon;
        const added = new Date(doc.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" });
        return (
          <li key={doc.id}>
            <Link
              href={`/desk/${doc.id}`}
              className="gn-motion gn-shadow gn-lift flex flex-wrap items-center gap-3 rounded-xl border border-line bg-surface p-4 hover:border-primary/40"
            >
              <FileText className="h-5 w-5 shrink-0 text-muted" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-100">{doc.title}</p>
                <p className="text-xs text-muted">
                  Added {added} · {doc.pageCount} page{doc.pageCount === 1 ? "" : "s"} · {doc.quizCount} quiz item{doc.quizCount === 1 ? "" : "s"} · {doc.taskCount} task{doc.taskCount === 1 ? "" : "s"}
                  {!doc.owned ? " · shared artifact" : ""}
                </p>
                {doc.errorNote && <p className="mt-1 text-xs text-amber-300/80">{doc.errorNote}</p>}
              </div>
              <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${meta.classes}`}>
                <Icon className="h-3.5 w-3.5" aria-hidden /> {meta.label}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
