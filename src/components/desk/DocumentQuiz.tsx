"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

/**
 * DocumentQuiz — plays a document's quiz, one question at a time.
 *
 * The league's integrity rule: options carry NO answer before submit, so the
 * client only holds the learner's selections until the whole set is POSTed to
 * /api/documents/[id]/quiz, which scores against the stored correctAnswers
 * and returns per-item correctness plus explanations.
 */

export interface QuizItem {
  id: string;
  stem: string;
  options: unknown;
  difficulty: string;
}

interface ItemResult {
  itemId: string;
  stem: string;
  selected: string;
  correctAnswer: string;
  correct: boolean;
  explanation: string;
}

export default function DocumentQuiz({ documentId, items }: { documentId: string; items: QuizItem[] }) {
  const [index, setIndex] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [results, setResults] = useState<ItemResult[] | null>(null);
  const [score, setScore] = useState<{ correct: number; total: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const item = items[index];
  const options = Array.isArray(item?.options) ? item.options.map((o) => String(o)) : [];
  const selected = item ? selections[item.id] : undefined;
  const answeredCount = items.filter((i) => selections[i.id]).length;

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`/api/documents/${documentId}/quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: items.filter((i) => selections[i.id]).map((i) => ({ itemId: i.id, selected: selections[i.id] })) }),
      });
      const payload = await response.json();
      if (!response.ok) {
        setError(payload.error || "Could not score the quiz");
        return;
      }
      setResults(payload.results ?? []);
      setScore({ correct: payload.correct ?? 0, total: payload.total ?? items.length });
    } catch {
      setError("Could not reach the server — try again.");
    } finally {
      setBusy(false);
    }
  }

  if (results) {
    return (
      <div className="space-y-3" role="status">
        <p className="text-lg font-semibold text-slate-100">
          Scored {score?.correct ?? 0} / {score?.total ?? items.length}
        </p>
        <ul className="space-y-3">
          {results.map((r) => (
            <li key={r.itemId} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="flex items-start gap-2 text-sm font-medium text-slate-100">
                {r.correct ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" /> : <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />}
                {r.stem}
              </p>
              <p className="mt-2 text-sm text-slate-300">
                <span className="text-slate-500">Your answer: </span>
                {r.selected || <span className="italic text-slate-500">not answered</span>}
              </p>
              {!r.correct && (
                <p className="mt-1 text-sm text-slate-300">
                  <span className="text-slate-500">Correct answer: </span>
                  {r.correctAnswer}
                </p>
              )}
              <p className="mt-2 text-sm text-slate-400">{r.explanation}</p>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => { setResults(null); setScore(null); setSelections({}); setIndex(0); }}
          className="min-h-[40px] rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-gold/50"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>Question {index + 1} of {items.length}</span>
        <span>{answeredCount} answered</span>
      </div>
      <div className="h-1 w-full rounded-full bg-slate-800">
        <div className="h-1 rounded-full bg-gold transition-all" style={{ width: `${(answeredCount / items.length) * 100}%` }} />
      </div>

      <p className="font-medium text-slate-100">{item.stem}</p>
      <div className="space-y-2">
        {options.map((option, oi) => (
          <button
            key={oi}
            type="button"
            aria-pressed={selected === option}
            onClick={() => setSelections((s) => ({ ...s, [item.id]: option }))}
            className={`flex w-full items-start gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 ${
              selected === option ? "border-gold/60 bg-gold/10 text-amber-100" : "border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-600"
            }`}
          >
            <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
              selected === option ? "bg-gold text-slate-950" : "bg-slate-800 text-slate-400"
            }`}>
              {String.fromCharCode(65 + oi)}
            </span>
            {option}
          </button>
        ))}
      </div>

      {error && <p role="alert" className="text-sm text-amber-300">{error}</p>}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          className="min-h-[40px] rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 disabled:opacity-40"
        >
          Previous
        </button>
        {index < items.length - 1 ? (
          <button
            type="button"
            onClick={() => setIndex((i) => Math.min(items.length - 1, i + 1))}
            className="min-h-[40px] rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-gold/50"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            disabled={busy}
            onClick={submit}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-gold px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-400 disabled:opacity-60"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            Submit & score
          </button>
        )}
      </div>
      <p className="text-xs text-slate-500">
        Answers are scored on the server when you submit — nothing is marked as you choose.
      </p>
    </div>
  );
}
