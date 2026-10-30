"use client";

import { useCallback, useEffect, useState } from "react";
import { Swords } from "lucide-react";

/**
 * BracketCupClient — round-one quickfire for the Cohort Bracket.
 *
 * KNOWN LIMITATION (documented, next iteration): the bracket tree is derived
 * per request from the seeded pairings plus round-one submissions — there is
 * no persistent BracketMatch table, so "advancing" re-derives from the same
 * data rather than a stored bracket. Later rounds render as projected slots.
 * Scoring is otherwise exactly the Speed Cup discipline: the paper is derived
 * server-side, no answer key before submit, accuracy reconciled server-side.
 */

interface QuickfireQuestion {
  id: string;
  questionText: string;
  options: string[];
  hint: string | null;
  difficulty: string;
}

interface Slot {
  handle: string;
  isCaller: boolean;
}

interface Match {
  matchIndex: number;
  a: Slot | null;
  b: Slot | null;
  bye: boolean;
  state: string;
  winner: { handle: string; isCaller: boolean } | null;
}

interface BracketView {
  size: number;
  roundLabels: string[];
  roundOne: { label: string; matches: Match[] };
  projectedRounds: string[];
  reason: string | null;
  me: {
    round: number;
    matchIndex: number;
    seedIndex: number;
    opponent: { handle: string } | null;
    state: string;
    bye: boolean;
    myScore: number | null;
    opponentScore: number | null;
    questions: QuickfireQuestion[];
  } | null;
}

type Phase = "loading" | "briefing" | "playing" | "submitted";

export default function BracketCupClient({ competitionId }: { competitionId: string }) {
  const [view, setView] = useState<BracketView | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<{ accuracy: number | null } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/competitions/${competitionId}/bracket`);
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Could not load the bracket.");
        return;
      }
      setView(data);
      setError(null);
      if (data.me && data.me.state === "live" && !data.me.bye) setPhase("briefing");
      else setPhase("loading");
    } catch {
      setError("Network error — try again.");
    }
  }, [competitionId]);

  useEffect(() => {
    load();
  }, [load]);

  async function submit() {
    if (!view?.me) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/competitions/${competitionId}/bracket/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchIndex: view.me.matchIndex,
          answers: Object.entries(answers).map(([questionId, selected]) => ({ questionId, selected })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Submission failed.");
        return;
      }
      setResult({ accuracy: data.accuracy ?? null });
      setPhase("submitted");
      await load();
    } catch {
      setError("Network error — try again.");
    } finally {
      setBusy(false);
    }
  }

  if (error) {
    return (
      <p role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
        {error}
      </p>
    );
  }
  if (!view) {
    return <p className="text-sm text-slate-400">Drawing the bracket…</p>;
  }

  const me = view.me;
  const questions = me?.questions ?? [];
  const current = questions[index];

  return (
    <div className="space-y-6">
      {me?.bye && (
        <p role="status" className="rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-amber-200">
          You drew a bye — you advance without a quickfire round.
        </p>
      )}

      {phase === "briefing" && me && (
        <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-6 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Swords className="h-4 w-4 text-gold" aria-hidden />
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">Your match</h2>
          </div>
          <p className="mt-4 font-serif text-2xl font-bold text-slate-100">
            You vs {me.opponent?.handle ?? "the field"}
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Five questions, best accuracy advances. The paper is dealt server-side; nothing you select is
            marked until you submit.
          </p>
          <button
            type="button"
            onClick={() => setPhase("playing")}
            className="mt-5 inline-flex min-h-[44px] items-center rounded-xl bg-gold px-6 font-semibold text-slate-950 transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            Start quickfire
          </button>
        </div>
      )}

      {phase === "playing" && current && (
        <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-6 backdrop-blur-md">
          <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">
            Question {index + 1} of {questions.length}
          </p>
          <h3 className="mt-3 font-serif text-xl font-bold text-slate-100">{current.questionText}</h3>
          <div className="mt-5 space-y-2">
            {current.options.map((option) => (
              <label
                key={option}
                className={`flex min-h-[44px] cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${
                  answers[current.id] === option
                    ? "border-gold/60 bg-gold/10 text-slate-100"
                    : "border-white/10 bg-slate-950/40 text-slate-300 hover:border-white/25"
                }`}
              >
                <input
                  type="radio"
                  name={current.id}
                  value={option}
                  checked={answers[current.id] === option}
                  onChange={() => setAnswers((a) => ({ ...a, [current.id]: option }))}
                  className="accent-gold"
                />
                {option}
              </label>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={index === 0}
              className="inline-flex min-h-[44px] items-center rounded-xl border border-white/15 px-5 text-sm font-semibold text-slate-200 disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              Back
            </button>
            {index < questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setIndex((i) => i + 1)}
                disabled={!answers[current.id]}
                className="inline-flex min-h-[44px] items-center rounded-xl bg-gold px-6 font-semibold text-slate-950 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={busy || Object.keys(answers).length < questions.length}
                className="inline-flex min-h-[44px] items-center rounded-xl bg-gold px-6 font-semibold text-slate-950 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                {busy ? "Marking…" : "Submit round"}
              </button>
            )}
          </div>
        </div>
      )}

      {phase === "submitted" && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6">
          <h2 className="font-serif text-xl font-bold text-emerald-100">Round recorded</h2>
          <p className="mt-2 text-sm text-emerald-200">
            Your accuracy: {result?.accuracy === null || result?.accuracy === undefined ? "pending" : `${Math.round(result.accuracy * 100)}%`}.
            The winner shows once both racers have submitted.
          </p>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 backdrop-blur-md">
        <h2 className="border-b border-white/10 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          {view.roundOne.label} — {view.size} teams
        </h2>
        <ul className="divide-y divide-white/5">
          {view.roundOne.matches.map((match) => (
            <li key={match.matchIndex} className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
              <span className="text-slate-300">
                {match.a?.handle ?? "—"} <span className="text-slate-600">vs</span> {match.b?.handle ?? "—"}
              </span>
              <span className="text-xs text-slate-500">
                {match.bye ? "bye" : match.winner ? `won by ${match.winner.handle}` : match.state}
              </span>
            </li>
          ))}
        </ul>
        {view.projectedRounds.length > 0 && (
          <p className="border-t border-white/10 px-5 py-3 text-xs text-slate-500">
            Later rounds render as projected slots until the persistent bracket tree lands (next iteration).
          </p>
        )}
      </div>
    </div>
  );
}
