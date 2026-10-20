"use client";

import { useId, useState } from "react";
import { Lightbulb, PenLine } from "lucide-react";

// TheoryPrompt — the discovery twin of the highschool theory wall (TheoryEditor
// + AnswerBooklet). A logical/conceptual question gets real keyboard space:
// a generous <textarea> with a live word/char count, and the model answer
// stays behind a proper disclosure (aria-expanded / aria-controls) until
// asked for. Discovery carries no quizzes and no marks — the writing is the
// thinking, and the model answer is a conversation, not a score.

type TheoryPromptProps = {
  prompt: string;
  modelAnswer: string;
  explanation?: string;
};

function countWords(text: string): number {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).filter(Boolean).length;
}

export default function TheoryPrompt({
  prompt,
  modelAnswer,
  explanation,
}: TheoryPromptProps) {
  const [draft, setDraft] = useState("");
  const [revealed, setRevealed] = useState(false);
  const draftId = useId();
  const answerId = useId();
  const words = countWords(draft);

  return (
    <div className="my-6 rounded-xl border border-gold/30 bg-gold/[0.04] p-5">
      <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gold">
        <PenLine className="h-3.5 w-3.5" />
        Theory — write your answer
      </div>
      <p className="text-slate-200 font-reading leading-relaxed">{prompt}</p>

      <label htmlFor={draftId} className="sr-only">
        {prompt}
      </label>
      <textarea
        id={draftId}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={12}
        spellCheck={true}
        placeholder="Write your answer here — argue it in sentences, the way physics is actually argued…"
        aria-label={`${prompt} You have written ${words} words.`}
        className="mt-3 min-h-[280px] w-full resize-y rounded-xl border border-gold/25 bg-slate-950/60 p-4 text-[15px] leading-relaxed text-slate-100 placeholder:text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      />

      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <p aria-hidden="true" className="text-xs tabular-nums text-slate-500">
          {words} words · {draft.length} chars
        </p>
        <button
          type="button"
          onClick={() => setRevealed((v) => !v)}
          aria-expanded={revealed}
          aria-controls={answerId}
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-gold/40 px-4 py-2 text-sm font-semibold text-gold transition-colors hover:border-gold hover:bg-gold/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <Lightbulb className="h-3.5 w-3.5" />
          {revealed ? "Hide model answer" : "Reveal model answer"}
        </button>
      </div>

      {revealed && (
        <div
          id={answerId}
          className="mt-3 space-y-2 border-t border-gold/20 pt-3"
        >
          <p className="text-slate-300 font-reading leading-relaxed">
            <span className="font-semibold text-gold">Model answer: </span>
            {modelAnswer}
          </p>
          {explanation && (
            <p className="text-sm text-slate-400 leading-relaxed">{explanation}</p>
          )}
        </div>
      )}
    </div>
  );
}
