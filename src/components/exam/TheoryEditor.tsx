"use client";

import { Check } from "lucide-react";

// TheoryEditor — Mode B plain writing surface. No formatting toolbar.
// Values flow into the runner's sectionAnswers record, so the existing draft JSON
// shape ({questionId, selectedAnswer}) is unchanged — completeSection posts them.
// States: empty → drafting (dirty dot) → saving → saved (✓ + timestamp) → submitted.

export type TheorySaveState = "empty" | "drafting" | "saving" | "saved" | "submitted";

type TheoryEditorProps = {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  saveState: TheorySaveState;
  savedAt?: string | null;
  questionLabel?: string;
};

function countWords(text: string): number {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).filter(Boolean).length;
}

export default function TheoryEditor({
  value,
  onChange,
  onSave,
  saveState,
  savedAt = null,
  questionLabel = "Your answer",
}: TheoryEditorProps) {
  const words = countWords(value);
  const chars = value.length;
  const readOnly = saveState === "submitted" || saveState === "saving";
  const dirty = saveState === "drafting";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-300">
          {questionLabel}
          {dirty && (
            <span aria-label="Unsaved changes" className="ml-2 text-amber-300">
              ●
            </span>
          )}
          {saveState === "saved" && (
            <span className="ml-2 inline-flex items-center gap-1 text-emerald-300">
              <Check aria-hidden="true" className="h-3.5 w-3.5" />
              Saved{savedAt != null && savedAt !== "" ? ` · ${savedAt}` : ""}
            </span>
          )}
        </p>
        <p aria-hidden="true" className="text-xs tabular-nums text-slate-400">
          {words} words · {chars} chars
        </p>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        rows={12}
        spellCheck={true}
        aria-label={`${questionLabel}. ${words} words, ${chars} characters.`}
        placeholder="Write your answer here…"
        className="min-h-[280px] w-full resize-y rounded-xl border border-slate-300 bg-white p-4 text-[15px] leading-relaxed text-slate-950 placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      />
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onSave}
          disabled={readOnly || saveState === "empty"}
          className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-gold px-6 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-gold-hover disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          {saveState === "saving" ? "Saving…" : "Save draft"}
        </button>
        <p aria-live="polite" className="sr-only">
          {saveState === "saved" ? `Draft saved. ${words} words.` : ""}
        </p>
      </div>
    </div>
  );
}
