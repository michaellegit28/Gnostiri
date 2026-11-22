"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";

type DemoQuestion = {
  id: string;
  prompt: string;
  options: string[];
  difficulty: string;
};

type DemoResult = {
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string | null;
};

export default function MiniQuizDemo() {
  const [question, setQuestion] = useState<DemoQuestion | null>(null);
  const [token, setToken] = useState("");
  const [picked, setPicked] = useState<string | null>(null);
  const [result, setResult] = useState<DemoResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setPicked(null);
    setResult(null);
    setError("");
    try {
      const response = await fetch("/api/demo-quiz", { cache: "no-store" });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.question || !data?.token) {
        throw new Error(data?.error || "Quiz demo is not available");
      }
      setQuestion(data.question);
      setToken(data.token);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Quiz demo is not available");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function checkAnswer() {
    if (!question || !token || !picked || busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/demo-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, answer: picked }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || typeof data?.isCorrect !== "boolean") {
        throw new Error(data?.error || "Could not check the answer");
      }
      setResult(data);
    } catch (checkError) {
      setError(checkError instanceof Error ? checkError.message : "Could not check the answer");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-labelledby="mini-quiz-title" className="gn-card rounded-[2rem] border border-line bg-surface p-5 shadow-sm md:p-8">
      <div className="mb-5 flex items-center justify-between gap-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
        <span id="mini-quiz-title">Try one verified question</span>
        <span className="text-electric-text">Live sample</span>
      </div>

      {loading ? (
        <div className="space-y-3" aria-live="polite">
          <div className="gn-skel h-6 w-full rounded" />
          <div className="gn-skel h-12 w-full rounded" />
          <div className="gn-skel h-12 w-full rounded" />
        </div>
      ) : error && !question ? (
        <div role="alert" className="rounded-xl border border-warning/40 bg-warning/10 p-5 text-sm text-amber-200">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => void load()}
            className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-warning/40 px-4 font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            Try again
          </button>
        </div>
      ) : question ? (
        <div>
          <p className="text-sm font-semibold leading-relaxed text-ink">{question.prompt}</p>
          <div className="mt-5 space-y-2" role="radiogroup" aria-label="Quiz answers">
            {question.options.map((option) => {
              const selected = picked === option;
              const correct = result ? option === result.correctAnswer : false;
              return (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  disabled={Boolean(result)}
                  onClick={() => setPicked(option)}
                  className={`min-h-[44px] w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-default ${
                    result && correct
                      ? "border-success bg-success/10 text-emerald-200"
                      : result && selected
                        ? "border-error bg-error/10 text-rose-200"
                        : selected
                          ? "border-primary bg-primary/10 text-ink"
                          : "border-line bg-bg text-slate-300 hover:border-primary/50"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {result ? (
            <div role="status" className="mt-5 flex items-start gap-3 rounded-xl border border-line bg-bg p-4 text-sm">
              {result.isCorrect ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" aria-hidden />
              ) : (
                <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-300" aria-hidden />
              )}
              <div>
                <p className="font-semibold text-ink">{result.isCorrect ? "Correct" : `Answer: ${result.correctAnswer}`}</p>
                {result.explanation ? <p className="mt-1 text-muted">{result.explanation}</p> : null}
              </div>
            </div>
          ) : null}

          {error ? (
            <p role="alert" className="mt-4 text-sm text-rose-300">
              {error}
            </p>
          ) : null}

          <div className="mt-5 flex flex-wrap gap-3">
            {result ? (
              <button
                type="button"
                onClick={() => void load()}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-line-strong px-4 text-sm font-semibold text-muted transition-colors hover:border-primary/50 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <RotateCcw className="h-4 w-4" aria-hidden />
                Another question
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void checkAnswer()}
                disabled={!picked || busy}
                className="inline-flex min-h-[44px] items-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy ? "Checking…" : "Check answer"}
              </button>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}
