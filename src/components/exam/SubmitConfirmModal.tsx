"use client";

import { useEffect } from "react";
import useDialogFocus from "@/components/ui/useDialogFocus";

// SubmitConfirmModal — pre-submit gate. Answered / open / flagged counts plus an
// unsaved-draft warning for the theory path. Escape cancels (never submits).

type SubmitConfirmModalProps = {
  answered: number;
  total: number;
  flagged: number;
  unsavedDrafts?: number;
  submitLabel?: string;
  onReview: () => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export default function SubmitConfirmModal({
  answered,
  total,
  flagged,
  unsavedDrafts = 0,
  submitLabel = "Submit anyway",
  onReview,
  onSubmit,
  onCancel,
}: SubmitConfirmModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel]);

  const unanswered = total - answered;
  const panelRef = useDialogFocus<HTMLDivElement>();

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="submit-confirm-heading"
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm focus:outline-none"
    >
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 px-6 py-8 text-center">
        <h2 id="submit-confirm-heading" className="font-serif text-2xl font-bold text-slate-50">
          Submit this section?
        </h2>
        <dl className="mx-auto mt-5 grid max-w-xs grid-cols-3 gap-3 text-center">
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3">
            <dd className="text-2xl font-bold tabular-nums text-emerald-300">{answered}</dd>
            <dt className="mt-1 text-[11px] uppercase tracking-widest text-slate-400">Answered</dt>
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-950 p-3">
            <dd className="text-2xl font-bold tabular-nums text-slate-200">{unanswered}</dd>
            <dt className="mt-1 text-[11px] uppercase tracking-widest text-slate-400">Open</dt>
          </div>
          <div className="rounded-xl border border-gold/40 bg-gold/10 p-3">
            <dd className="text-2xl font-bold tabular-nums text-gold">{flagged}</dd>
            <dt className="mt-1 text-[11px] uppercase tracking-widest text-slate-400">Flagged</dt>
          </div>
        </dl>
        {unsavedDrafts > 0 && (
          <p role="alert" className="mt-4 text-sm font-medium text-amber-300">
            You have {unsavedDrafts} unsaved {unsavedDrafts === 1 ? "draft" : "drafts"}. Save
            before submitting or your latest writing will be lost.
          </p>
        )}
        <div className="mt-7 flex flex-col gap-3">
          {flagged > 0 && (
            <button
              type="button"
              onClick={onReview}
              className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-slate-600 px-6 py-3 text-sm font-semibold text-slate-200 transition-colors hover:border-slate-400 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              Review flagged questions
            </button>
          )}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-300 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
            >
              Keep working
            </button>
            <button
              type="button"
              onClick={onSubmit}
              className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              {submitLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
