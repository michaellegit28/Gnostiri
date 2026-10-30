"use client";

import Link from "next/link";
import { BookOpen, RefreshCw, User } from "lucide-react";
import AdoptButton from "./AdoptButton";

/**
 * ArtifactCard — one shared artifact in the Library grid.
 *
 * Shows only what the public list exposes: title, subject, page/quiz counts, a
 * "reused by N" line, the uploader's handle, a read-preview link and the adopt
 * control. No source file, no quiz answers — the card is metadata only.
 */

export interface ArtifactCardData {
  id: string;
  title: string;
  subjectSlug: string | null;
  pageCount: number;
  quizItemCount: number;
  reuseCount: number;
  uploader: string;
  notesPreview: string[];
}

export default function ArtifactCard({ doc, signedIn }: { doc: ArtifactCardData; signedIn: boolean }) {
  const subject = doc.subjectSlug || "General";
  return (
    <li className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 transition-colors hover:border-gold/40">
      <div className="space-y-1">
        <Link href={`/library/${doc.id}`} className="block">
          <h3 className="font-serif text-lg font-bold leading-snug text-slate-100 transition-colors hover:text-gold">
            {doc.title}
          </h3>
        </Link>
        <p className="text-xs text-slate-500">
          {subject} · {doc.pageCount} page{doc.pageCount === 1 ? "" : "s"} · {doc.quizItemCount} quiz item{doc.quizItemCount === 1 ? "" : "s"}
        </p>
        {doc.notesPreview.length > 0 && (
          <p className="line-clamp-1 text-xs text-slate-400">{doc.notesPreview.join(" · ")}</p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <RefreshCw className="h-3.5 w-3.5 text-gold" />
          {doc.reuseCount > 0 ? `reused by ${doc.reuseCount} classmate${doc.reuseCount === 1 ? "" : "s"}` : "New to the library"}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 text-slate-500" /> {doc.uploader}
        </span>
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
        <AdoptButton documentId={doc.id} signedIn={signedIn} label="Adopt" className="flex-1 sm:flex-none" />
        <Link
          href={`/library/${doc.id}`}
          className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-slate-500 hover:text-slate-100"
        >
          <BookOpen className="h-4 w-4" /> Read preview
        </Link>
      </div>
    </li>
  );
}
