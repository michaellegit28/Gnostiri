"use client";

import { Check, X } from "lucide-react";

// OptionCard — one MCQ option as a large CBT button. `state` covers both the
// pre-reveal pick (selected, brand gold) and post-reveal marking (correct emerald,
// incorrect rose) driven by /api/quiz/answer reveals in the practice runner.

export type OptionState = "idle" | "selected" | "correct" | "incorrect";

type OptionCardProps = {
  letter: string; // "A" | "B" | "C" | "D" (parent derives from option index)
  text: string;
  state: OptionState;
  disabled?: boolean;
  onSelect: () => void;
};

const TONE: Record<OptionState, string> = {
  idle: "border-slate-700 bg-slate-900/60 text-slate-100 hover:border-slate-500",
  selected: "border-[#D4AF37] bg-[#D4AF37]/15 text-slate-50",
  correct: "border-emerald-500/60 bg-emerald-500/10 text-slate-50",
  incorrect: "border-rose-500/60 bg-rose-500/10 text-slate-50",
};

const STATE_LABEL: Record<OptionState, string> = {
  idle: "",
  selected: " (selected)",
  correct: " (correct answer)",
  incorrect: " (not correct)",
};

export default function OptionCard({
  letter,
  text,
  state,
  disabled = false,
  onSelect,
}: OptionCardProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      aria-pressed={state === "selected"}
      aria-label={`Option ${letter}${STATE_LABEL[state]}: ${text}`}
      className={`flex min-h-[56px] w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-[15px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] disabled:cursor-default disabled:opacity-90 ${TONE[state]}`}
    >
      <span
        aria-hidden="true"
        className={`inline-flex h-7 min-w-7 items-center justify-center rounded-md px-1.5 text-sm font-extrabold ${
          state === "selected"
            ? "bg-[#D4AF37] text-slate-950"
            : state === "correct"
              ? "bg-emerald-500 text-slate-950"
              : state === "incorrect"
                ? "bg-rose-500 text-slate-950"
                : "bg-slate-800 text-[#D4AF37]"
        }`}
      >
        {letter}
      </span>
      <span className="flex-1">{text}</span>
      {(state === "selected" || state === "correct") && (
        <Check aria-hidden="true" className="h-5 w-5 text-emerald-400" />
      )}
      {state === "incorrect" && (
        <X aria-hidden="true" className="h-5 w-5 text-rose-400" />
      )}
    </button>
  );
}
