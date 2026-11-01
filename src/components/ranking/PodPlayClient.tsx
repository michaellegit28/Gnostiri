"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import JoinQueueButton from "@/components/ranking/JoinQueueButton";
import { enqueue } from "@/lib/offline-queue";

/**
 * PodPlayClient — the async-simultaneous pod surface.
 *
 * Flow: join (POST /api/ranking/pods/open) → serve the member's derived paper
 * (GET .../session) → play it one question at a time → submit all answers at
 * the end (POST .../submit), graded server-side.
 *
 * The clock is SERVER-ANCHORED to the pod's window closing instant and the
 * server's own Date header, so a tampered browser clock (or a backgrounded
 * tab) cannot buy more time than the pod was given.
 *
 * The paper never contains an answer key — only the question, its options and
 * its difficulty — so nothing on this screen can reveal a correct answer
 * before the submit returns.
 *
 * "Live" standings come from polling GET /api/ranking/state every 15s while
 * the window is open: no websockets, just the truth on a slow refresh.
 */

interface Question {
  id: string;
  questionText: string;
  options: string[];
  difficulty: string;
}

interface PodSession {
  matchId: string;
  groupName: string;
  tier: number;
  startedAt: string;
  windowClosesAt: string;
  windowSeconds: number;
  questions: Question[];
}

interface SubmitResult {
  score: number;
  placement: number;
  starsAwarded: number;
  totalStars: number;
  tier: number;
  tierLabel: string;
  tierUp: boolean;
}

interface LeaderRow {
  position: number;
  handle: string;
  stars: number;
  podScore: number;
  isCaller: boolean;
}

interface RankStatePayload {
  stars: number;
  tier: number;
  tierLabel: string;
  group: { groupName: string; leaderboard: LeaderRow[] } | null;
  openPods: { matchId: string; remainingSeconds: number; submitted: boolean; score: number }[];
}

type Phase = "joining" | "waiting" | "loading" | "playing" | "submitting" | "queued" | "done" | "error";

/** mm:ss (h:mm:ss past an hour) — the member's own clock. */
function clock(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`;
}

export default function PodPlayClient({
  groupName,
  tier,
  hasGroup,
  resumeMatchId,
  requestedMatchId,
}: {
  groupName: string | null;
  tier: number | null;
  hasGroup: boolean;
  resumeMatchId: string | null;
  requestedMatchId: string | null;
}) {
  const [phase, setPhase] = useState<Phase>("joining");
  const [error, setError] = useState("");
  const [matchId, setMatchId] = useState<string | null>(requestedMatchId ?? resumeMatchId);
  const [members, setMembers] = useState<{ handle: string; isCaller: boolean }[]>([]);
  const [session, setSession] = useState<PodSession | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [index, setIndex] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [confirming, setConfirming] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [standings, setStandings] = useState<RankStatePayload | null>(null);

  const submittedRef = useRef(false);
  const [offline, setOffline] = useState(false);

  const windowMs = session ? session.windowSeconds * 1000 : 0;

  useEffect(() => {
    const sync = () => setOffline(typeof navigator !== "undefined" && navigator.onLine === false);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  const submitPaper = useCallback(async () => {
    if (submittedRef.current || !session || !matchId) return;
    submittedRef.current = true;
    setConfirming(false);
    setPhase("submitting");
    try {
      const res = await fetch(`/api/ranking/pods/${matchId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: Object.entries(answers).map(([questionId, selected]) => ({ questionId, selected })),
        }),
      });
      const data = (await res.json().catch(() => null)) as (SubmitResult & { error?: string }) | null;
      if (!res.ok || !data || !("score" in data)) {
        throw new Error(data?.error ?? "Submit failed");
      }
      setResult(data);
      setPhase("done");
    } catch (e) {
      if (offline || e instanceof TypeError) {
        const elapsedSeconds = Math.max(0, Math.round((windowMs - remaining) / 1000));
        const queued = await enqueue({
          endpoint: `/api/ranking/pods/${matchId}/submit`,
          body: {
            answers: Object.entries(answers).map(([questionId, selected]) => ({ questionId, selected })),
            startedAt: session.startedAt,
            elapsedSeconds,
          },
        });
        if (queued) {
          setPhase("queued");
          return;
        }
      }
      submittedRef.current = false;
      setPhase("playing");
      setError(e instanceof Error ? e.message : "Submit failed");
    }
  }, [answers, matchId, offline, remaining, session, windowMs]);

  // Join (or resume), then serve the paper for the resulting pod.
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (!matchId) {
          const res = await fetch("/api/ranking/pods/open", { method: "POST" });
          const data = (await res.json().catch(() => null)) as
            | { matchId: string; members: { handle: string; isCaller: boolean }[]; error?: string }
            | null;
          if (!alive) return;
          if (res.status === 409 || !data?.matchId) {
            setPhase("waiting");
            setError(data?.error ?? "Not enough ready members yet.");
            return;
          }
          if (!res.ok) throw new Error(data?.error ?? "Could not open a pod");
          setMatchId(data.matchId);
          setMembers(data.members ?? []);
        }

        const res = await fetch(`/api/ranking/pods/${matchId}/session`, { cache: "no-store" });
        const data = (await res.json().catch(() => null)) as (PodSession & { error?: string }) | null;
        if (!alive) return;
        if (!res.ok || !data?.questions) {
          setPhase("error");
          setError(data?.error ?? "This pod's paper is unavailable");
          return;
        }
        // The response Date header is the server's clock; elapsed time is
        // measured against the window it opened, never the browser's.
        const serverNow = Date.parse(res.headers.get("Date") ?? "") || Date.now();
        const leftMs = Math.max(0, Date.parse(data.windowClosesAt) - serverNow);
        setRemaining(leftMs);
        setSession(data);
        setPhase("playing");
      } catch (e) {
        if (!alive) return;
        setPhase("error");
        setError(e instanceof Error ? e.message : "Could not reach the ranking server");
      }
    })();
    return () => {
      alive = false;
    };
  }, [matchId]);

  // Local tick on top of the server anchor.
  useEffect(() => {
    if (phase !== "playing") return;
    const timer = setInterval(() => setRemaining((ms) => Math.max(0, ms - 1000)), 1000);
    return () => clearInterval(timer);
  }, [phase]);

  // Clock out → submit immediately, no confirmation: the window is over.
  useEffect(() => {
    if (phase !== "playing" || remaining > 0) return;
    void submitPaper();
  }, [phase, remaining, submitPaper]);

  // Live standings while a window is open — the async scoreboard.
  useEffect(() => {
    if (phase !== "playing") return;
    let alive = true;
    const poll = async () => {
      try {
        const res = await fetch("/api/ranking/state", { cache: "no-store" });
        const data = (await res.json().catch(() => null)) as RankStatePayload | null;
        if (alive && res.ok && data) setStandings(data);
      } catch {
        // A dropped poll is a dropped poll: the next one lands in 15s.
      }
    };
    void poll();
    const timer = setInterval(() => void poll(), 15_000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [phase]);

  const question = session?.questions[index];
  const answeredCount = useMemo(
    () => (session ? session.questions.filter((q) => answers[q.id]).length : 0),
    [answers, session],
  );
  const unanswered = session ? session.questions.length - answeredCount : 0;

  if (phase === "joining" || phase === "loading" || phase === "submitting") {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Pod play</p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-slate-100">
          {phase === "submitting" ? "Marking your paper…" : "Seating your pod…"}
        </h1>
        <p className="mt-3 text-sm text-slate-400">The draw is server-side: every member gets their own question order.</p>
      </main>
    );
  }

  if (phase === "waiting" || phase === "error") {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Pod play</p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-slate-100">
          {phase === "waiting" ? "Not enough ready members" : "This pod cannot start"}
        </h1>
        <p className="mt-3 text-sm text-slate-400">{error}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {hasGroup ? (
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex min-h-[44px] items-center rounded-xl bg-gold px-6 font-semibold text-slate-950 transition-colors hover:bg-gold-hover"
            >
              Try again
            </button>
          ) : (
            <JoinQueueButton label="Join the queue" />
          )}
          <Link
            href="/league/ladder"
            className="inline-flex min-h-[44px] items-center rounded-xl border border-slate-700 px-5 font-semibold text-slate-200 transition-colors hover:border-slate-500"
          >
            Back to the ladder
          </Link>
        </div>
      </main>
    );
  }

  if (phase === "queued") {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Pod play · saved</p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-slate-100">Offline — answers saved, will sync</h1>
        <p className="mt-3 text-sm text-slate-400">
          This paper is queued on the device. It is submitted the moment the connection returns and
          graded against the pod window the server opened — if that window closed before the sync,
          the submit endpoint&apos;s rejection stands and the submission stays queued for a manual
          retry.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/league/ladder"
            className="inline-flex min-h-[44px] items-center rounded-xl bg-gold px-6 font-semibold text-slate-950 hover:bg-gold-hover"
          >
            Back to the ladder
          </Link>
          <Link
            href="/offline"
            className="inline-flex min-h-[44px] items-center rounded-xl border border-slate-700 px-5 font-semibold text-slate-200 hover:border-slate-500"
          >
            See what is saved
          </Link>
        </div>
      </main>
    );
  }

  if (phase === "done" && result) {
    const medal = result.placement === 1 ? "1st" : result.placement === 2 ? "2nd" : result.placement === 3 ? "3rd" : `${result.placement}th`;
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Pod result</p>
        <h1 className="mt-3 font-serif text-4xl font-bold text-slate-100">
          {medal} <span className="text-gold">· {result.score} correct</span>
        </h1>
        <dl className="mt-8 grid grid-cols-2 gap-4 text-left">
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">Stars awarded</dt>
            <dd className="mt-1 font-serif text-2xl font-bold tabular-nums text-gold">+{result.starsAwarded}</dd>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">Total stars</dt>
            <dd className="mt-1 font-serif text-2xl font-bold tabular-nums text-slate-100">{result.totalStars.toLocaleString()}</dd>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">Tier</dt>
            <dd className="mt-1 font-serif text-2xl font-bold text-slate-100">{result.tierLabel}</dd>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">Placement</dt>
            <dd className="mt-1 font-serif text-2xl font-bold text-slate-100">{medal}</dd>
          </div>
        </dl>
        {result.tierUp && (
          <p className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-300">
            Tier up — you are now {result.tierLabel}.
          </p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/league/ladder"
            className="inline-flex min-h-[44px] items-center rounded-xl bg-gold px-6 font-semibold text-slate-950 transition-colors hover:bg-gold-hover"
          >
            Back to the ladder
          </Link>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex min-h-[44px] items-center rounded-xl border border-slate-700 px-5 font-semibold text-slate-200 transition-colors hover:border-slate-500"
          >
            Play the next pod
          </button>
        </div>
      </main>
    );
  }

  if (!session || !question) return null;

  const elapsedRatio = windowMs > 0 ? Math.min(1, Math.max(0, 1 - remaining / windowMs)) : 0;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 md:py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Pod play</p>
          <h1 className="mt-2 font-serif text-2xl font-bold text-slate-100">
            {session.groupName ?? groupName ?? "Your group"} · tier {session.tier}
          </h1>
          {members.length > 0 && (
            <p className="mt-1 text-sm text-slate-400">
              {members.map((m, i) => (
                <span key={`${m.handle}-${i}`} className={m.isCaller ? "text-gold" : undefined}>
                  {m.handle}
                  {m.isCaller ? " (you)" : ""}
                  {i < members.length - 1 ? " · " : ""}
                </span>
              ))}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Time left</p>
          <p className="font-serif text-3xl font-bold tabular-nums text-gold">{clock(remaining)}</p>
        </div>
      </div>

      {offline && (
        <p className="mt-4 rounded-xl border border-amber-400/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Offline — answers saved, will sync
        </p>
      )}

      <div
        className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-800"
        role="progressbar"
        aria-label="Pod window"
        aria-valuenow={Math.round(elapsedRatio * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="h-full bg-gold" style={{ width: `${elapsedRatio * 100}%` }} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <section>
          <p className="text-xs text-slate-500">
            Question {index + 1} of {session.questions.length} · {answeredCount} answered
          </p>
          <h2 className="mt-3 font-serif text-xl font-bold text-slate-100">{question.questionText}</h2>

          <div className="mt-5 space-y-3" role="radiogroup" aria-label="Answers">
            {question.options.map((option, i) => {
              const selected = answers[question.id] === option;
              return (
                <button
                  key={`${question.id}-${i}`}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: option }))}
                  className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                    selected ? "border-gold/60 bg-gold/10 text-slate-100" : "border-slate-800 bg-slate-900/70 text-slate-300 hover:border-slate-600"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${
                      selected ? "border-gold bg-gold text-slate-950" : "border-slate-600 text-slate-500"
                    }`}
                    aria-hidden
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-sm">{option}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={index === 0}
              className="inline-flex min-h-[44px] items-center rounded-xl border border-slate-700 px-5 font-semibold text-slate-200 transition-colors hover:border-slate-500 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setIndex((i) => Math.min(session.questions.length - 1, i + 1))}
              disabled={index >= session.questions.length - 1}
              className="inline-flex min-h-[44px] items-center rounded-xl border border-slate-700 px-5 font-semibold text-slate-200 transition-colors hover:border-slate-500 disabled:opacity-40"
            >
              Next
            </button>

            {confirming ? (
              <span className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-amber-300">{unanswered} unanswered — submit anyway?</span>
                <button
                  type="button"
                  onClick={() => void submitPaper()}
                  className="inline-flex min-h-[44px] items-center rounded-xl bg-gold px-5 font-semibold text-slate-950 transition-colors hover:bg-gold-hover"
                >
                  Yes, submit
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="inline-flex min-h-[44px] items-center rounded-xl border border-slate-700 px-4 text-sm font-semibold text-slate-300"
                >
                  Keep playing
                </button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => (unanswered > 0 ? setConfirming(true) : void submitPaper())}
                className="inline-flex min-h-[44px] items-center rounded-xl bg-gold px-6 font-semibold text-slate-950 transition-colors hover:bg-gold-hover"
              >
                Submit paper
              </button>
            )}
          </div>

          {error && (
            <p className="mt-4 text-sm text-rose-300" role="alert">
              {error}
            </p>
          )}
        </section>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <h2 className="font-serif text-lg font-bold text-slate-100">Standings</h2>
            <p className="mt-1 text-xs text-slate-500">Polls every 15s while the window is open.</p>
            {standings?.group ? (
              <ul className="mt-4 space-y-2">
                {standings.group.leaderboard.map((row) => (
                  <li key={`${row.handle}-${row.position}`} className="flex items-center justify-between gap-3 text-sm">
                    <span className={row.isCaller ? "text-gold" : "text-slate-300"}>
                      {row.position}. {row.handle}
                      {row.isCaller && " (you)"}
                    </span>
                    <span className="tabular-nums text-slate-400">
                      {row.podScore} <span className="text-gold">· {row.stars} ★</span>
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-slate-400">No group standings yet.</p>
            )}
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 text-sm text-slate-400">
            <h2 className="font-serif text-lg font-bold text-slate-100">How a pod scores</h2>
            <ul className="mt-3 space-y-2">
              <li>1st takes 3 stars, 2nd takes 2, 3rd takes 1, and everyone else still takes 1 for finishing.</li>
              <li>+1 per correct answer, 0 per wrong — no negative marking.</li>
              <li>Placements are recomputed as members submit, so the scoreboard is never stale.</li>
            </ul>
          </section>
        </aside>
      </div>
    </main>
  );
}
