"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

interface Q { id: string; questionText: string; options: string[]; }

// Master-topic quiz: uses generic /api/quiz/answer + /api/quiz/attempt (domain highschool).
export default function MasterQuizClient({ topicId, sessionId, backHref, backLabel, questions }: { topicId: string; sessionId: string | null; backHref: string; backLabel: string; questions: Q[] }) {
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, { ok: boolean; correct: string; why: string | null }>>({});
  const [score, setScore] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (busy) return;
    if (!sessionId) {
      setError("Sign in to submit this quiz.");
      return;
    }
    setError("");
    setBusy(true);
    const res: typeof results = {};
    let correct = 0;
    for (const q of questions) {
      const answer = picked[q.id] || "";
      if (!answer) continue;
      const r = await fetch("/api/quiz/answer", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ domain: "highschool", topicId, questionId: q.id, answer, sessionId }) }).then((x) => x.json()).catch(() => null);
      if (!r || r.error) {
        setError(r?.error || "Could not check this answer");
        setBusy(false);
        return;
      }
      if (r.isCorrect) correct++;
      res[q.id] = { ok: !!r?.isCorrect, correct: r?.correctAnswer || "", why: r?.explanation || null };
    }
    setResults(res);
    setScore(correct);
    await fetch("/api/quiz/attempt", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain: "highschool", topicId, sessionId, score: correct, maxScore: questions.length, answers: questions.filter((question) => picked[question.id]).map((question) => ({ questionId: question.id, selectedAnswer: picked[question.id] })), durationSeconds: 0 }),
    }).catch(() => null);
    setBusy(false);
  }

  return (
    <div className="space-y-4">
      {questions.map((q, i) => (
        <div key={q.id} className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="font-semibold text-sm">Q{i + 1}. {q.questionText}</p>
          <div className="mt-2 space-y-1">
            {q.options.map((o) => (
              <button type="button" key={o} disabled={score !== null} onClick={() => setPicked((p) => ({ ...p, [q.id]: o }))}
                className={`block w-full text-left text-sm px-3 py-2 rounded-lg border transition-colors ${picked[q.id] === o ? "border-gold bg-gold/10" : "border-slate-700 hover:border-slate-500"}`}>{o}</button>
            ))}
          </div>
          {results[q.id] && (
            <p aria-live="polite" className={`mt-2 flex items-center gap-1 text-xs ${results[q.id].ok ? "text-emerald-400" : "text-red-400"}`}>
              {results[q.id].ok && <Check aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />}
              {results[q.id].ok ? "Correct" : `Answer: ${results[q.id].correct}`} {results[q.id].why && <span className="text-slate-400">— {results[q.id].why}</span>}
            </p>
          )}
        </div>
      ))}
      {error && <p role="alert" className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p>}
      {score !== null && <p aria-live="polite" className="font-bold text-gold">Score: {score}/{questions.length}</p>}
      <div className="flex flex-wrap gap-3">
        {score === null && <button type="button" onClick={submit} disabled={busy || !sessionId} className="px-5 py-2.5 rounded-lg bg-gold text-on-gold font-semibold text-sm disabled:opacity-50">{busy ? "Marking…" : sessionId ? "Submit" : "Sign in to submit"}</button>}
        {!sessionId && score === null && <Link href="/login" className="px-5 py-2.5 rounded-lg border border-slate-600 text-sm">Sign in</Link>}
        <Link href={backHref} className="px-5 py-2.5 rounded-lg border border-slate-600 text-sm">Back to {backLabel}</Link>
      </div>
    </div>
  );
}
