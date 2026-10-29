"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FileUp, Loader2, Upload, CheckCircle2, AlertTriangle } from "lucide-react";

/**
 * UploadForm — Desk document intake.
 *
 * Sends the PDF as multipart (the file never leaves the browser except to our
 * own API), then shows the honest outcome: ready / needs-ai / failed / deduped
 * (reused existing processed notes — the hash-dedupe cost lever, surfaced to
 * the student rather than hidden).
 */

interface UploadResult {
  status: string;
  deduped: boolean;
  quizCreated: number;
  quizDropped: number;
  tasksCreated: number;
  ai: boolean;
  document: { id: string; title: string; status: string; errorNote?: string | null };
}

const STATUS_COPY: Record<string, string> = {
  ready: "Notes and quiz generated — open it to start studying.",
  "needs-ai": "Notes are ready (extractive). No AI model is configured, so no quiz was generated — nothing was faked.",
  failed: "Processing failed — see the note below.",
};

export default function UploadForm() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [minutesPerDay, setMinutesPerDay] = useState("30");
  const [days, setDays] = useState("7");
  const [subject, setSubject] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<UploadResult | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setError("Choose a PDF first.");
      return;
    }
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const form = new FormData();
      form.set("file", file);
      form.set("minutesPerDay", minutesPerDay);
      form.set("days", days);
      if (subject.trim()) form.set("subjectSlug", subject.trim());
      const response = await fetch("/api/documents", { method: "POST", body: form });
      const payload = await response.json();
      if (!response.ok) {
        setError(payload.error || `Upload rejected (${response.status})`);
        return;
      }
      setResult(payload as UploadResult);
      router.refresh(); // refresh today's tasks + document lists
    } catch {
      setError("Upload failed — check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/80 p-6">
      <div>
        <label htmlFor="desk-file" className="mb-2 block text-sm font-medium text-slate-200">
          PDF (max 120 pages, 8MB)
        </label>
        <input
          id="desk-file"
          ref={fileRef}
          type="file"
          accept="application/pdf,.pdf"
          required
          className="block w-full text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-gold file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-950 hover:file:bg-amber-400"
        />
        <p className="mt-2 text-xs text-slate-500">
          Your PDF is parsed in memory and discarded — only the processed notes and quiz are stored.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="desk-minutes" className="mb-2 block text-sm font-medium text-slate-200">Minutes / day</label>
          <select
            id="desk-minutes"
            value={minutesPerDay}
            onChange={(e) => setMinutesPerDay(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:border-gold focus:outline-none"
          >
            <option value="30">30</option>
            <option value="60">60</option>
            <option value="120">120</option>
          </select>
        </div>
        <div>
          <label htmlFor="desk-days" className="mb-2 block text-sm font-medium text-slate-200">Streak</label>
          <select
            id="desk-days"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:border-gold focus:outline-none"
          >
            <option value="3">3 days</option>
            <option value="7">7 days</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="desk-subject" className="mb-2 block text-sm font-medium text-slate-200">
          Subject slug <span className="text-slate-500">(optional)</span>
        </label>
        <input
          id="desk-subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g. biology"
          maxLength={60}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-gold focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={busy}
        className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-amber-400 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        {busy ? "Processing…" : "Upload & process"}
      </button>

      {error && (
        <p role="alert" className="flex items-start gap-2 rounded-lg border border-amber-600/40 bg-amber-950/20 p-3 text-sm text-amber-300">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </p>
      )}

      {result && (
        <div className="space-y-2 rounded-lg border border-slate-700 bg-slate-950/60 p-4 text-sm" role="status">
          <p className="flex items-center gap-2 font-medium text-slate-100">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            {result.document.title}
          </p>
          {result.deduped ? (
            <p className="text-slate-300">
              Same textbook already processed — your notes and quiz link to the shared artifact{" "}
              <Link href={`/desk/${result.document.id}`} className="text-gold underline">Open desk document</Link>.
            </p>
          ) : (
            <>
              <p className="text-slate-300">{STATUS_COPY[result.document.status] ?? result.document.status}</p>
              <p className="text-slate-400">
                {result.tasksCreated} study task{result.tasksCreated === 1 ? "" : "s"} scheduled
                {result.document.status === "ready" ? ` · ${result.quizCreated} quiz item${result.quizCreated === 1 ? "" : "s"}` : ""}
                {result.quizDropped > 0 ? ` · ${result.quizDropped} generated item${result.quizDropped === 1 ? "" : "s"} dropped (failed invariants)` : ""}
              </p>
              <Link href={`/desk/${result.document.id}`} className="inline-flex items-center gap-1.5 text-gold underline">
                <FileUp className="h-4 w-4" /> Open desk document
              </Link>
            </>
          )}
          {result.document.errorNote && <p className="text-xs text-amber-300/80">Note: {result.document.errorNote}</p>}
        </div>
      )}
    </form>
  );
}
