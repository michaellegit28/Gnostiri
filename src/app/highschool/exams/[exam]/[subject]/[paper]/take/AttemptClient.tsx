"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Mode = "timed" | "open";
type Question = { id: string; questionText: string; options: string[] };
type Result = {
  questionId: string;
  selectedAnswer: string | null;
  correctAnswer: string;
  earnedMarks: number;
  marks: number;
  explanation: string | null;
  isCorrect: boolean;
};

interface AttemptClientProps {
  paperId: string;
  backUrl: string;
  examName: string;
  subjectTitle: string;
  year: number;
  paperNumber: string;
  durationMinutes: number;
  mode: Mode;
  questions: Question[];
}

function formatClock(totalSeconds: number): string {
  const m = Math.max(0, Math.floor(totalSeconds / 60));
  const s = Math.max(0, totalSeconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function AttemptClient({
  paperId,
  backUrl,
  examName,
  subjectTitle,
  year,
  paperNumber,
  durationMinutes,
  mode,
  questions,
}: AttemptClientProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Result[] | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [maxScore, setMaxScore] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [remaining, setRemaining] = useState(durationMinutes * 60);
  const [timeUp, setTimeUp] = useState(false);

  const startedAt = useRef(Date.now());
  const submitted = useRef(false);

  const allAnswered = Object.keys(answers).length === questions.length;

  async function submitAnswers(auto = false) {
    if (submitted.current || busy) return;
    if (!auto && !allAnswered) return;
    submitted.current = true;
    setBusy(true);
    setError("");
    const durationSeconds = Math.round((Date.now() - startedAt.current) / 1000);
    try {
      const response = await fetch(`/api/papers/${paperId}/attempt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          durationSeconds,
          answers: questions.map((q) => ({ questionId: q.id, selectedAnswer: answers[q.id] ?? null })),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Could not submit attempt");
        return;
      }
      setResults(data.results);
      setScore(data.score);
      setMaxScore(data.maxScore);
      setSaved(Boolean(data.saved));
    } catch {
      setError("Could not submit attempt — check your connection");
    } finally {
      setBusy(false);
    }
  }

  // Countdown for timed attempts; auto-submits when time runs out.
  useEffect(() => {
    if (mode !== "timed" || results) return;
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimeUp(true);
          void submitAnswers(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, results]);

  const headerTitle = `${examName} · ${subjectTitle} ${year} — ${paperNumber}`;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/80 p-5">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-teal-300">{mode === "timed" ? "Timed attempt" : "Open practice"}</p>
          <h1 className="mt-1 font-serif text-2xl font-bold">{headerTitle}</h1>
        </div>
        {mode === "timed" && !results && (
          <div
            className={`px-5 py-3 rounded-xl border font-mono text-2xl font-bold tabular-nums ${
              timeUp
                ? "border-rose-500/40 bg-rose-500/10 text-rose-300"
                : remaining <= 300
                  ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                  : "border-slate-700 bg-slate-950 text-slate-100"
            }`}
            aria-label="Time remaining"
          >
            {timeUp ? "Time's up" : formatClock(remaining)}
          </div>
        )}
      </header>

      {questions.map((question, index) => {
        const result = results?.find((r) => r.questionId === question.id);
        const selected = answers[question.id];
        return (
          <section key={question.id} className="space-y-3 rounded-xl border border-slate-800 bg-slate-900 p-5 md:p-6">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-base md:text-lg font-semibold">
                <span className="text-slate-500 font-serif mr-2">Q{index + 1}.</span>
                {question.questionText}
              </h2>
              {result && (
                <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-md border ${
                  result.isCorrect
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                    : "border-rose-500/40 bg-rose-500/10 text-rose-300"
                }`}>
                  {result.isCorrect ? `${result.earnedMarks}/${result.marks}` : `0/${result.marks}`}
                </span>
              )}
            </div>
            {question.options.map((option) => {
              const isCorrectOption = result?.correctAnswer === option;
              return (
                <label
                  key={option}
                  className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border px-4 transition-colors ${
                    results
                      ? isCorrectOption
                        ? "border-emerald-500/60 bg-emerald-500/10"
                        : selected === option
                          ? "border-rose-500/60 bg-rose-500/10"
                          : "border-slate-800"
                      : selected === option
                        ? "border-teal-500/60 bg-teal-500/10"
                        : "border-slate-700 hover:border-slate-600"
                  }`}
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    checked={selected === option}
                    disabled={results !== null}
                    onChange={() => setAnswers({ ...answers, [question.id]: option })}
                  />
                  <span>{option}</span>
                  {results && isCorrectOption && <span className="ml-auto text-emerald-400 text-xs font-semibold">Correct answer</span>}
                </label>
              );
            })}
            {result && result.explanation && (
              <p className={`rounded-lg p-4 text-sm ${result.isCorrect ? "bg-emerald-500/10 text-emerald-200" : "bg-rose-500/10 text-rose-200"}`}>
                {result.explanation}
              </p>
            )}
          </section>
        );
      })}

      {error && <p role="alert" className="text-red-300">{error}</p>}

      {!results ? (
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            disabled={!allAnswered || busy}
            onClick={() => void submitAnswers()}
            className="min-h-12 w-full sm:w-auto rounded-lg bg-amber-500 px-6 font-semibold text-slate-950 disabled:opacity-50"
          >
            {busy ? "Marking…" : "Submit attempt"}
          </button>
          <p className="text-sm text-slate-400">
            {allAnswered ? "All questions answered." : `${Object.keys(answers).length}/${questions.length} answered — answer every question to submit.`}
          </p>
        </div>
      ) : (
        <div className="space-y-5 rounded-xl border border-[#D4AF37]/30 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 p-6">
          <div className="text-3xl font-serif font-bold text-[#D4AF37]">
            {score}/{maxScore} marks
          </div>
          <p className="text-sm text-slate-300">
            {score !== null && maxScore !== null && maxScore > 0
              ? `${Math.round((score / maxScore) * 100)}% · ${mode === "timed" ? "timed attempt" : "open practice"}`
              : ""}
          </p>
          <p className="text-sm text-slate-400">
            {saved
              ? "Attempt saved to your account — visible in the marking scheme review."
              : "Sign in to save attempts and track your progress over time."}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href={`${backUrl}/review`} className="rounded-lg bg-amber-500 px-5 py-3 font-semibold text-slate-950">
              Review marking scheme
            </Link>
            <Link href={backUrl} className="rounded-lg border border-slate-700 px-5 py-3 font-semibold text-slate-200 hover:border-slate-500">
              Back to paper
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
