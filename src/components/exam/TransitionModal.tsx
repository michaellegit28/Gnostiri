"use client";

import { useEffect } from "react";
import useDialogFocus from "@/components/ui/useDialogFocus";

// TransitionModal — the section bridge. Copy source: RenderManifest
// section.transitionMessage (non-last sections; null on last → counts fallback).
// onReviewFlagged is OPTIONAL: the practice runner's forward-only lock admits no
// return, so it renders a single CTA there; exam-mode flows pass both actions.

type TransitionModalProps = {
  answered: number;
  total: number;
  flagged: number;
  sectionBTitle: string;
  sectionBMinutes: number;
  transitionMessage?: string | null;
  primaryLabel?: string;
  onReviewFlagged?: () => void;
  onStartTheory: () => void;
};

export default function TransitionModal({
  answered,
  total,
  flagged,
  sectionBTitle,
  sectionBMinutes,
  transitionMessage,
  primaryLabel = "Start theory section",
  onReviewFlagged,
  onStartTheory,
}: TransitionModalProps) {
  useEffect(() => {
    if (!onReviewFlagged) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onReviewFlagged();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onReviewFlagged]);

  const panelRef = useDialogFocus<HTMLDivElement>();

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="bridge-heading"
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#070b16]/95 p-4 backdrop-blur focus:outline-none"
    >
      <div className="w-full max-w-xl rounded-2xl border border-gold/40 bg-slate-950 px-6 py-10 text-center md:px-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
          Section complete
        </p>
        <h2 id="bridge-heading" className="mt-3 font-serif text-3xl font-bold text-slate-50">
          Take a breath. New section ahead.
        </h2>
        <p className="mt-4 text-slate-300">
          {transitionMessage ??
            `You answered ${answered} of ${total} questions. You flagged ${flagged} for review.`}
        </p>
        <p className="mt-2 text-sm text-slate-400">
          You are now moving to {sectionBTitle}. You have {sectionBMinutes} minutes. Read
          all instructions carefully.
        </p>
        <p className="mt-3 text-[13px] font-medium text-amber-300">
          Once you continue, earlier sections lock — as with handing in Paper 1 before
          receiving Paper 2.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {onReviewFlagged && (
            <button
              type="button"
              onClick={onReviewFlagged}
              className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-slate-600 px-6 py-3 text-sm font-semibold text-slate-200 transition-colors hover:border-slate-400 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              Review flagged questions
            </button>
          )}
          <button
            type="button"
            onClick={onStartTheory}
            className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            {primaryLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
