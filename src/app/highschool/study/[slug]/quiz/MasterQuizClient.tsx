"use client";

import { useState } from "react";
import Link from "next/link";

interface Q { id: string; questionText: string; options: string[]; }

// Master-topic quiz: uses generic /api/quiz/answer + /api/quiz/attempt (domain highschool).
export default function MasterQuizClient({ topicId, backHref, backLabel, questions }: { topicId: string; backHref: string; backLabel: string; questions: Q[] }) {
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, { ok: boolean; correct: string; why: string | null }>>({});
  const [score, setScore] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (busy) return;
    setBusy(true);
    const res: typeof results = {};
    let correct = 0;
    for (const q of questions) {
      const answer = picked[q.id] || "";
      const r = await fetch("/api/quiz/answer", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ domain: "highschool", topicId, questionId: q.id, answer }) }).then((x) => x.json()).catch(() => null);
      if (r && r.isCorrect) correct++;
      res[q.id] = { ok: !!r?.isCorrect, correct: r?.correctAnswer || "", why: r?.explanation || null };
    }
    setResults(res);
    setScore(correct);
    await fetch("/api/quiz/attempt", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain: "highschool", topicId, score: correct, maxScore: questions.length, answers: questions.map((q) => ({ questionId: q.id, selectedAnswer: picked[q.id] || "" })), durationSeconds: 0 }),
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
              <button key={o} disabled={score !== null} onClick={() => setPicked((p) => ({ ...p, [q.id]: o }))}
                className={`block w-full text-left text-sm px-3 py-2 rounded-lg border transition-colors ${picked[q.id] === o ? "border-amber-500 bg-amber-500/10" : "border-slate-700 hover:border-slate-500"}`}>{o}</button>
            ))}
          </div>
          {results[q.id] && (
            <p className={`mt-2 text-xs ${results[q.id].ok ? "text-emerald-400" : "text-red-400"}`}>
              {results[q.id].ok ? "Correct ✓" : `Answer: ${results[q.id].correct}`} {results[q.id].why && <span className="text-slate-400">— {results[q.id].why}</span>}
            </p>
          )}
        </div>
      ))}
      {score !== null && <p className="font-bold text-amber-400">Score: {score}/{questions.length}</p>}
      <div className="flex gap-3">
        {score === null && <button onClick={submit} disabled={busy} className="px-5 py-2.5 rounded-lg bg-amber-500 text-slate-950 font-semibold text-sm">{busy ? "Marking…" : "Submit"}</button>}
        <Link href={backHref} className="px-5 py-2.5 rounded-lg border border-slate-600 text-sm">Back to {backLabel}</Link>
      </div>
    </div>
  );
}
