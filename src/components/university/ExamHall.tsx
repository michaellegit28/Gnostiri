"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import type { ExamSession, ScoredSession, ExamFormat } from "@/lib/assessment";

const FORMAT_LABEL: Record<ExamFormat, string> = {
  sba: "Single Best Answer",
  emq: "Extended Matching",
  vignette: "Vignette",
  "short-answer": "Short Answer",
};

interface ExamHallProps {
  courseId: string;
  mode: "timed" | "open";
}

/**
 * A timed exam hall: no feedback until submit, a running clock, and a
 * single irreversible submission. This mirrors a real OSCE/written paper —
 * the whole point is performance under time pressure, not instant grading.
 */
export function ExamHall({ courseId, mode }: ExamHallProps) {
  const [session, setSession] = useState<ExamSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ScoredSession | null>(null);
  const [remaining, setRemaining] = useState(mode === "timed" ? 60 * 60 : 0);

  const start = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/assessments/simulate?courseId=${encodeURIComponent(courseId)}&mode=${mode}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to build exam");
      setSession(data.session);
      setRemaining(data.session.durationMinutes * 60);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [courseId, mode]);

  useEffect(() => {
    void start();
  }, [start]);

  // Countdown auto-submits when the clock runs out.
  useEffect(() => {
    if (!session || result || mode !== "timed" || remaining <= 0) return;
    const timer = setInterval(() => setRemaining((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [session, result, mode, remaining]);

  const submit = useCallback(async () => {
    if (!session || submitting || result) return;
    setSubmitting(true);
    setError(null);
    try {
      const payload = session.items.map((it) => ({
        itemId: it.id,
        selected: answers[it.id] ?? "",
      }));
      const res = await fetch("/api/assessments/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session, answers: payload }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to score exam");
      setResult(data.scored as ScoredSession);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setSubmitting(false);
    }
  }, [session, answers, submitting, result]);

  // Auto-submit on timeout.
  useEffect(() => {
    if (mode === "timed" && session && !result && !submitting && remaining === 0) {
      void submit();
    }
  }, [mode, session, result, submitting, remaining, submit]);

  const answered = useMemo(() => (session ? session.items.filter((i) => answers[i.id]?.trim()).length : 0), [session, answers]);

  const clock = useMemo(() => {
    const m = Math.floor(remaining / 60);
    const s = remaining % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, [remaining]);

  if (loading) {
    return (
      <div className="rounded-2xl border bg-card p-10 text-center text-muted-foreground" role="status">
        Building blueprint-balanced exam…
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="rounded-2xl border border-amber-300 bg-amber-50 p-8 dark:border-amber-500/30 dark:bg-amber-500/10">
        <h3 className="font-semibold text-amber-800 dark:text-amber-300">Exam unavailable</h3>
        <p className="mt-2 text-sm text-amber-700 dark:text-amber-200/80">{error}</p>
        <button onClick={() => void start()} className="mt-4 rounded-lg border border-amber-400 px-4 py-2 text-sm font-medium text-amber-800 hover:bg-amber-100 dark:text-amber-200 dark:hover:bg-amber-500/20">
          Try again
        </button>
      </div>
    );
  }

  if (result) {
    const pct = Math.round(result.percentage * 100);
    const pass = pct >= 50;
    return (
      <div className="space-y-6">
        <div className={`rounded-2xl border p-8 text-center ${pass ? "border-emerald-300 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10" : "border-rose-300 bg-rose-50 dark:border-rose-500/30 dark:bg-rose-500/10"}`}>
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">Result</p>
          <p className={`mt-2 text-5xl font-bold ${pass ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>{pct}%</p>
          <p className="mt-3 text-muted-foreground">
            {result.score.toFixed(1)} / {result.maxScore.toFixed(1)} marks{result.negativeApplied > 0 ? ` · −${result.negativeApplied.toFixed(1)} penalty` : ""}
          </p>
          <p className="mt-1 font-semibold" style={undefined}>{pass ? "Pass" : "Below pass mark"}</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Item review</h3>
          {result.answers.map((a) => (
            <div key={a.id} className="rounded-xl border bg-card p-5">
              <div className="flex items-start gap-3">
                <span className={`mt-0.5 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${a.marked ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300" : "bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300"}`}>
                  {a.marked ? "Correct" : "Incorrect"}
                </span>
                <div className="min-w-0">
                  <p className="font-medium leading-snug">{a.stem}</p>
                  {a.options && (
                    <ul className="mt-3 space-y-1.5 text-sm">
                      {a.options.map((opt) => {
                        const isCorrect = opt === a.correctAnswer;
                        const isChosen = opt === a.selected;
                        return (
                          <li key={opt} className={`rounded-lg px-3 py-2 ${isCorrect ? "bg-emerald-50 font-medium text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-200" : isChosen ? "bg-rose-50 text-rose-800 dark:bg-rose-500/10 dark:text-rose-200" : "bg-muted/40"}`}>
                            {opt}
                            {isCorrect ? " — correct answer" : isChosen ? " — your answer" : ""}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                  {a.explanation && <p className="mt-3 text-sm text-muted-foreground">{a.explanation}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={() => void start()} className="rounded-lg bg-primary px-5 py-2.5 font-medium text-primary-foreground hover:bg-primary/90">
            Sit another exam
          </button>
          <a href="/university/transcript" className="rounded-lg border px-5 py-2.5 font-medium hover:bg-muted/50">
            View transcript
          </a>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="space-y-6">
      <div className="sticky top-4 z-10 flex items-center justify-between rounded-2xl border bg-card/95 px-5 py-3 shadow-sm backdrop-blur">
        <span className="text-sm font-medium">
          {answered} / {session.items.length} answered
        </span>
        {mode === "timed" && (
          <span className={`font-mono text-lg font-semibold tabular-nums ${remaining < 300 ? "text-rose-600 dark:text-rose-400" : ""}`}>{clock}</span>
        )}
      </div>

      <ol className="space-y-5">
        {session.items.map((item, idx) => (
          <li key={item.id} className="rounded-2xl border bg-card p-6">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-sm text-muted-foreground">Q{idx + 1}</span>
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">{FORMAT_LABEL[item.format]}</span>
              {session.negativeMarking && item.negativeMarks != null && item.negativeMarks > 0 && (
                <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-medium text-rose-700 dark:bg-rose-500/15 dark:text-rose-300">
                  −{item.negativeMarks} for wrong
                </span>
              )}
            </div>
            <p className="mt-3 font-medium leading-relaxed">{item.stem}</p>
            {item.options ? (
              <div className="mt-4 space-y-2">
                {item.options.map((opt) => {
                  const chosen = answers[item.id] === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setAnswers((prev) => ({ ...prev, [item.id]: opt }))}
                      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                        chosen ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:bg-muted/50"
                      }`}
                      aria-pressed={chosen}
                    >
                      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${chosen ? "border-primary bg-primary text-primary-foreground" : ""}`}>
                        {chosen ? "✓" : ""}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <textarea
                value={answers[item.id] ?? ""}
                onChange={(e) => setAnswers((prev) => ({ ...prev, [item.id]: e.target.value }))}
                rows={4}
                placeholder="Write your answer…"
                className="mt-4 w-full rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            )}
          </li>
        ))}
      </ol>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {mode === "timed" ? "Submission is final. The exam auto-submits when the clock runs out." : "Open book — take your time."}
        </p>
        <button
          onClick={() => void submit()}
          disabled={submitting || answered === 0}
          className="rounded-lg bg-primary px-6 py-2.5 font-semibold text-primary-foreground transition-opacity hover:bg-primary/90 disabled:opacity-50"
        >
          {submitting ? "Scoring…" : "Submit exam"}
        </button>
      </div>
      {error && <p className="text-sm text-rose-600 dark:text-rose-400" role="alert">{error}</p>}
    </div>
  );
}