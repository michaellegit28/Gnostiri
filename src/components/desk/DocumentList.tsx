"use client";

import Link from "next/link";
import { FileText, FileCheck2, Sparkles, AlertTriangle, ListChecks } from "lucide-react";

/**
 * DocumentList — the user's Desk documents with honest status chips.
 *
 * needs-ai is shown as a real state, never an error: it means extractive
 * notes exist but no AI model produced a quiz — the student knows exactly
 * what they are getting.
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
  processing: { label: "Processing", icon: Sparkles, classes: "border-sky-500/40 bg-sky-500/10 text-sky-300" },
  ready: { label: "Ready", icon: FileCheck2, classes: "border-emerald-600/40 bg-emerald-500/10 text-emerald-300" },
  "needs-ai": { label: "Notes only (no AI quiz)", icon: ListChecks, classes: "border-amber-600/40 bg-amber-500/10 text-amber-300" },
  failed: { label: "Failed", icon: AlertTriangle, classes: "border-rose-600/40 bg-rose-500/10 text-rose-300" },
};

export default function DocumentList({ documents }: { documents: DeskDocument[] }) {
  if (documents.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-700 p-6 text-sm text-slate-500">
        No documents yet. Upload a textbook or lecture note above.
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {documents.map((doc) => {
        const meta = STATUS_META[doc.status] ?? STATUS_META.processing;
        const Icon = meta.icon;
        return (
          <li key={doc.id}>
            <Link
              href={`/desk/${doc.id}`}
              className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4 transition-colors hover:border-gold/40"
            >
              <FileText className="h-5 w-5 shrink-0 text-slate-400" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-100">{doc.title}</p>
                <p className="text-xs text-slate-500">
                  {doc.pageCount} page{doc.pageCount === 1 ? "" : "s"} · {doc.quizCount} quiz item{doc.quizCount === 1 ? "" : "s"} · {doc.taskCount} task{doc.taskCount === 1 ? "" : "s"}
                  {!doc.owned ? " · shared artifact" : ""}
                </p>
                {doc.errorNote && <p className="mt-1 text-xs text-amber-300/80">{doc.errorNote}</p>}
              </div>
              <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${meta.classes}`}>
                <Icon className="h-3.5 w-3.5" /> {meta.label}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
