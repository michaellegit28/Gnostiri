"use client";

import { useCallback, useEffect, useState } from "react";
import { Flame } from "lucide-react";

/**
 * EnduranceCupClient — daily check-in surface.
 *
 * One check-in per UTC day; the score is days survived. Missing a day freezes
 * the streak (the cup shows the day it was lost) — it never resets to zero.
 * Server is the only writer: the button POSTs, the ladder comes from GET.
 */

interface EnduranceView {
  windowDays: number;
  daysRemaining: number;
  streak: number;
  checkedInToday: boolean;
  alive: boolean;
  lostOn: string | null;
  started: boolean;
  leaderboard: { handle: string; days: number; rank: number | null; isCaller: boolean }[];
}

export default function EnduranceCupClient({ competitionId }: { competitionId: string }) {
  const [view, setView] = useState<EnduranceView | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/competitions/${competitionId}/streak`);
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Could not load the cup.");
        return;
      }
      setView(data);
      setError(null);
    } catch {
      setError("Network error — try again.");
    }
  }, [competitionId]);

  useEffect(() => {
    load();
  }, [load]);

  async function checkIn() {
    setBusy(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch(`/api/competitions/${competitionId}/streak`, { method: "POST" });
      const data = await res.json();
      if (res.status === 201) {
        setMessage(
          data.milestone
            ? `Day ${data.streak} — ${data.milestone.label}. Milestone recorded.`
            : `Day ${data.streak} logged. See you tomorrow.`,
        );
        await load();
      } else if (res.status === 409) {
        setMessage("Already checked in today — rest is part of the training.");
      } else {
        setError(data?.error ?? "Check-in failed.");
      }
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
    return <p className="text-sm text-slate-400">Loading your streak…</p>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-6 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-gold" aria-hidden />
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">Durability</h2>
        </div>
        <p className="mt-4 font-serif text-4xl font-bold tabular-nums text-slate-100">
          {view.streak}
          <span className="ml-2 align-middle text-sm font-normal text-slate-500">
            day{view.streak === 1 ? "" : "s"} survived · {view.daysRemaining} left of {view.windowDays}
          </span>
        </p>
        {!view.alive && view.lostOn && (
          <p className="mt-3 text-xs text-amber-300">
            Streak frozen on {new Date(view.lostOn).toLocaleDateString("en-GB", { dateStyle: "medium" })} — the score is kept, the run is not.
          </p>
        )}
        <div className="mt-5">
          <button
            type="button"
            onClick={checkIn}
            disabled={busy || view.checkedInToday || !view.started}
            className="inline-flex min-h-[44px] items-center rounded-xl bg-gold px-6 font-semibold text-slate-950 transition-colors hover:bg-gold-hover disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            {view.checkedInToday ? "Checked in today" : busy ? "Logging…" : "I practised today"}
          </button>
        </div>
        {message && (
          <p role="status" className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {message}
          </p>
        )}
        <p className="mt-3 text-xs text-slate-500">
          One check-in per UTC day, written server-side. Milestones at 7, 14 and 30 days.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 backdrop-blur-md">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 text-[11px] uppercase tracking-[0.2em] text-slate-500">
            <tr>
              <th scope="col" className="px-5 py-3 font-semibold">Rank</th>
              <th scope="col" className="px-5 py-3 font-semibold">Racer</th>
              <th scope="col" className="px-5 py-3 text-right font-semibold">Days</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {view.leaderboard.map((row, i) => (
              <tr key={`${row.handle}-${i}`} className={row.isCaller ? "bg-gold/5" : undefined}>
                <td className="px-5 py-3.5 tabular-nums text-slate-400">{row.rank ?? "—"}</td>
                <td className="px-5 py-3.5">
                  <span className="font-semibold text-slate-100">{row.handle}</span>
                  {row.isCaller && <span className="ml-2 text-[11px] uppercase tracking-[0.2em] text-gold">You</span>}
                </td>
                <td className="px-5 py-3.5 text-right font-serif text-lg font-bold tabular-nums text-slate-100">{row.days}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
