"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

interface CupQuestion {
  id: string;
  questionText: string;
  options: string[];
  hint: string | null;
  difficulty: string;
}

interface Session {
  startedAt: string;
  durationMinutes: number;
  questions: CupQuestion[];
}

interface BreakdownRow {
  questionId: string;
  selected: string | null;
  correct: boolean;
  correctAnswer: string | null;
  explanation: string | null;
}

interface SubmitResult {
  score: number;
  rank: number | null;
  breakdown: BreakdownRow[];
}

type Phase = "loading" | "playing" | "submitting" | "done" | "error";

/** mm:ss (h:mm:ss past an hour) — the racer's clock. */
function clock(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`;
}

/**
 * CupPlayClient — the live Speed Cup surface.
 *
 * The timer is SERVER-ANCHORED: the session hands back the server's own
 * startedAt, and the remaining time is computed as
 * duration - (serverNow - startedAt) using the clock in the response headers,
 * so a racer's browser clock (or a paused tab) cannot stretch the window. The
 * paper is rendered one question at a time from that same response — it never
 * contains the answer key, so nothing on this screen reveals a correct answer
 * before the submit returns.
 */
export default function CupPlayClient({
  competitionId,
  title,
  hrefBack,
  hrefResults,
}: {
  competitionId: string;
  title: string;
  hrefBack: string;
  hrefResults: string;
}) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [error, setError] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [index, setIndex] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [confirming, setConfirming] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);

  // Guards against a double submit (timer expiry + a click in the same tick).
  const submittedRef = useRef(false);

  const submit = useCallback(
    async (skipConfirm: boolean) => {
      if (submittedRef.current || !session) return;
      if (!skipConfirm && session.questions.some((q) => !answers[q.id])) {
        setConfirming(true);
        return;
      }
      submittedRef.current = true;
      setConfirming(false);
      setPhase("submitting");
      try {
        const res = await fetch(`/api/competitions/${competitionId}/submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: Object.entries(answers).map(([questionId, selected]) => ({ questionId, selected })) }),
        });
        const data = (await res.json().catch(() => null)) as SubmitResult & { error?: string };
        if (!res.ok || !data?.breakdown) {
          throw new Error(data?.error ?? "Submit failed");
        }
        setResult(data);
        setPhase("done");
      } catch (e) {
        submittedRef.current = false;
        setPhase("playing");
        setError(e instanceof Error ? e.message : "Submit failed");
      }
    },
    [answers, competitionId, session],
  );

  // Session fetch: the paper, and the server's own start time for the clock.
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`/api/competitions/${competitionId}/session`, { cache: "no-store" });
        const data = (await res.json().catch(() => null)) as (Session & { error?: string }) | null;
        if (!alive) return;
        if (!res.ok || !data?.questions) {
          setPhase("error");
          setError(data?.error ?? "This cup is not available for play");
          return;
        }
        // The response Date header is the server clock at this instant; the
        // elapsed time is measured against the server's startedAt, never the
        // browser's. (HTTP dates carry second precision — sub-second skew
        // between the two reads is absorbed by the tick below.)
        const serverNow = Date.parse(res.headers.get("Date") ?? "") || Date.now();
        const elapsed = Math.max(0, serverNow - Date.parse(data.startedAt));
        setRemaining(Math.max(0, data.durationMinutes * 60_000 - elapsed));
        setSession(data);
        setPhase("playing");
      } catch {
        if (alive) {
          setPhase("error");
          setError("Could not reach the cup server");
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, [competitionId]);

  // The local tick on top of the server anchor.
  useEffect(() => {
    if (phase !== "playing") return;
    const timer = setInterval(() => setRemaining((ms) => Math.max(0, ms - 1000)), 1000);
    return () => clearInterval(timer);
  }, [phase]);

  // Clock out → submit immediately, no confirmation (the racer's time is up).
  useEffect(() => {
    if (phase !== "playing" || remaining > 0) return;
    void submit(true);
  }, [phase, remaining, submit]);

  const question = session?.questions[index];
  const answered = useMemo(
    () => (session ? session.questions.filter((q) => answers[q.id]).length : 0),
    [answers, session],
  );
  const total = session?.questions.length ?? 0;
  const timeElapsed = session ? Math.min(1, Math.max(0, 1 - remaining / (session.durationMinutes * 60_000))) : 0;

  if (phase === "loading") {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-center text-sm text-slate-400">Dealing the paper…</p>
      </main>
    );
  }

  if (phase === "error") {
    return (
      <main className="mx-auto max-w-3xl px-6 py-20 text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Speed Cup</p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-slate-100">This run cannot start</h1>
        <p className="mt-3 text-slate-400">{error}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={hrefResults}
            className="inline-flex min-h-[44px] items-center rounded-xl border border-white/15 bg-slate-950/80 px-5 text-sm font-semibold text-slate-200 transition-colors hover:border-gold/60 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            See the leaderboard
          </Link>
          <Link
            href={hrefBack}
            className="inline-flex min-h-[44px] items-center rounded-xl bg-gold px-5 text-sm font-semibold text-slate-950 transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            Back to the cup
          </Link>
        </div>
      </main>
    );
  }

  if (phase === "done" && result && session) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <header className="text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Speed Cup · results</p>
          <h1 className="mt-2 font-serif text-3xl font-bold text-slate-100">{title}</h1>
          <p className="mt-3 text-slate-400">
            {result.score} of {total} correct
            {result.rank ? ` · ladder position #${result.rank}` : " · not yet ranked"}
          </p>
        </header>

        <section className="mt-8 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 text-center backdrop-blur-md">
            <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Score</p>
            <p className="mt-2 font-serif text-3xl font-bold text-gold">
              {result.score}
              <span className="text-lg text-slate-500">/{total}</span>
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 text-center backdrop-blur-md">
            <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Ladder rank</p>
            <p className="mt-2 font-serif text-3xl font-bold text-slate-100">{result.rank ? `#${result.rank}` : "—"}</p>
          </div>
        </section>

        <section className="mt-10 space-y-3">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">Per-question breakdown</h2>
          <ul className="divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 backdrop-blur-md">
            {result.breakdown.map((row, i) => (
              <li key={row.questionId} className="px-5 py-4">
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      row.correct ? "bg-teal-500/15 text-teal-300" : "bg-rose-500/15 text-rose-300"
                    }`}
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-100">
                      {session.questions.find((q) => q.id === row.questionId)?.questionText ?? "Question"}
                    </p>
                    <p className="mt-2 text-xs text-slate-400">
                      You answered: <span className="font-semibold text-slate-200">{row.selected ?? "—"}</span>
                      {row.correct ? " · correct" : ` · answer: ${row.correctAnswer ?? "—"}`}
                    </p>
                    {row.explanation && <p className="mt-2 text-xs leading-relaxed text-slate-400">{row.explanation}</p>}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={hrefResults}
            className="inline-flex min-h-[44px] items-center rounded-xl bg-gold px-6 text-sm font-semibold text-slate-950 transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            See the final leaderboard
          </Link>
          <Link
            href={`${hrefBack}/play`}
            className="inline-flex min-h-[44px] items-center rounded-xl border border-white/15 bg-slate-950/80 px-5 text-sm font-semibold text-slate-200 transition-colors hover:border-gold/60 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            Play again — best score kept
          </Link>
        </div>
      </main>
    );
  }

  if (!session || !question) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-20 text-center">
        <p className="text-sm text-slate-400">This cup has no questions.</p>
      </main>
    );
  }

  const isLast = index === total - 1;

  return (
    <main className="mx-auto max-w-3xl px-6 py-8 md:py-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Speed Cup · live</p>
          <h1 className="mt-1 font-serif text-2xl font-bold text-slate-100">{title}</h1>
        </div>
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Time left</p>
          <p
            className={`font-serif text-2xl font-bold tabular-nums ${remaining < 60_000 ? "text-rose-300" : "text-slate-100"}`}
            aria-live="off"
          >
            {clock(remaining)}
          </p>
        </div>
      </header>

      {/* Time bar: the remaining clock, server-anchored. */}
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full transition-[width] duration-1000 ease-linear ${remaining < 60_000 ? "bg-rose-400" : "bg-gold"}`}
          style={{ width: `${(1 - timeElapsed) * 100}%` }}
        />
      </div>

      <div className="mt-6 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-slate-500">
        <span>
          Question {index + 1} of {total}
        </span>
        <span>
          {answered} answered · {total - answered} open
        </span>
      </div>
      {/* Question progress: a dot per question, filled once answered. */}
      <div className="mt-2 flex flex-wrap gap-1" aria-hidden="true">
        {session.questions.map((q, i) => (
          <span
            key={q.id}
            className={`h-1.5 flex-1 rounded-full ${
              answers[q.id] ? "bg-gold" : i === index ? "bg-slate-500" : "bg-white/10"
            }`}
          />
        ))}
      </div>

      <section className="mt-6 rounded-2xl border border-white/10 bg-slate-950/60 p-6 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-slate-400">
            {question.difficulty}
          </span>
          {question.hint && <span className="text-[11px] text-slate-500">Hint available</span>}
        </div>
        <h2 className="mt-3 font-serif text-xl font-bold leading-snug text-slate-100">{question.questionText}</h2>
        {question.hint && <p className="mt-2 text-sm italic text-slate-400">Hint: {question.hint}</p>}

        <div className="mt-6 space-y-3">
          {question.options.map((option) => {
            const active = answers[question.id] === option;
            return (
              <label
                key={option}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold ${
                  active
                    ? "border-gold/70 bg-gold/10 text-slate-100"
                    : "border-white/10 bg-slate-950/40 text-slate-300 hover:border-white/25 hover:bg-white/5"
                }`}
              >
                <input
                  type="radio"
                  name={`cup-${question.id}`}
                  value={option}
                  checked={active}
                  onChange={() => setAnswers((prev) => ({ ...prev, [question.id]: option }))}
                  className="sr-only"
                />
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                    active ? "border-gold bg-gold" : "border-white/25"
                  }`}
                  aria-hidden="true"
                >
                  {active && <span className="h-1.5 w-1.5 rounded-full bg-slate-950" />}
                </span>
                <span className="font-medium">{option}</span>
              </label>
            );
          })}
        </div>
      </section>

      {error && phase === "playing" && (
        <p className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p>
      )}

      <nav className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          className="inline-flex min-h-[44px] items-center rounded-xl border border-white/15 bg-slate-950/80 px-5 text-sm font-semibold text-slate-200 transition-colors hover:border-gold/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          Previous
        </button>
        <div className="flex items-center gap-3">
          {!isLast && (
            <button
              type="button"
              onClick={() => setIndex((i) => Math.min(total - 1, i + 1))}
              className="inline-flex min-h-[44px] items-center rounded-xl border border-white/15 bg-slate-950/80 px-5 text-sm font-semibold text-slate-200 transition-colors hover:border-gold/60 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              Next
            </button>
          )}
          <button
            type="button"
            onClick={() => void submit(false)}
            disabled={phase === "submitting" || answered === 0}
            className="inline-flex min-h-[44px] items-center rounded-xl bg-gold px-6 text-sm font-semibold text-slate-950 transition-colors hover:bg-gold-hover disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            {phase === "submitting" ? "Scoring…" : "Submit answers"}
          </button>
        </div>
      </nav>

      {confirming && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-overlay/80 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cup-confirm-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-950/95 p-6 shadow-2xl shadow-black/50">
            <h2 id="cup-confirm-title" className="font-serif text-xl font-bold text-slate-100">
              Submit now?
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              {total - answered} question{total - answered === 1 ? "" : "s"} still open — they score 0. Your best score is
              always kept, so a later run can only improve your ladder position.
            </p>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="inline-flex min-h-[44px] items-center rounded-xl border border-white/15 bg-slate-950/80 px-5 text-sm font-semibold text-slate-200 transition-colors hover:border-gold/60 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                Keep playing
              </button>
              <button
                type="button"
                onClick={() => void submit(true)}
                disabled={phase === "submitting"}
                className="inline-flex min-h-[44px] items-center rounded-xl bg-gold px-5 text-sm font-semibold text-slate-950 transition-colors hover:bg-gold-hover disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                {phase === "submitting" ? "Scoring…" : "Submit now"}
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-10 text-center text-[11px] uppercase tracking-[0.2em] text-slate-600">
        The clock is server-anchored · answers are graded once, on submit
      </footer>
    </main>
  );
}
