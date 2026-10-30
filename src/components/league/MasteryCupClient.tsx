"use client";

import { useCallback, useEffect, useState } from "react";
import { Target } from "lucide-react";

/**
 * MasteryCupClient — the Mastery Cup surface.
 *
 * Progress is the member's live mean ConceptMastery over the cup's subject;
 * the first member past the target takes rank 1. Every number on this screen
 * comes from GET /mastery-progress (server-reconciled) — nothing here is
 * client-reported.
 */

interface Standing {
  handle: string;
  progress: number | null;
  rank: number | null;
  isCaller: boolean;
}

interface MasteryView {
  target: number;
  targetPercent: number;
  targetLabel: string;
  subjectSlug: string | null;
  rows: Standing[];
  me: { progress: number | null; concepts: number; crossed: boolean };
  recorded: { crossed: boolean; score: number; rank: number | null; first: boolean } | null;
}

export default function MasteryCupClient({ competitionId }: { competitionId: string }) {
  const [view, setView] = useState<MasteryView | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/competitions/${competitionId}/mastery-progress`);
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Could not load mastery progress.");
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

  if (error) {
    return (
      <p role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
        {error}
      </p>
    );
  }
  if (!view) {
    return <p className="text-sm text-slate-400">Loading mastery standings…</p>;
  }

  const myPercent = view.me.progress === null ? null : Math.round(view.me.progress * 100);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-6 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-gold" aria-hidden />
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">Your progress</h2>
        </div>
        <p className="mt-4 font-serif text-4xl font-bold tabular-nums text-slate-100">
          {myPercent === null ? "—" : `${myPercent}%`}
          <span className="ml-2 align-middle text-sm font-normal text-slate-500">of {view.targetLabel} target</span>
        </p>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-gold transition-all"
            style={{ width: `${Math.min(100, myPercent ?? 0)}%` }}
          />
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Measured across {view.me.concepts} concept{view.me.concepts === 1 ? "" : "s"}
          {view.subjectSlug ? ` in ${view.subjectSlug}` : ""}. Mastery is earned under exam conditions, not claimed.
        </p>
        {view.recorded?.crossed && (
          <p role="status" className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            Target crossed{view.recorded.first ? " — first across the line. " : ". "}
            {view.recorded.rank ? `Rank ${view.recorded.rank} recorded.` : ""}
          </p>
        )}
        {!view.me.crossed && myPercent !== null && (
          <p className="mt-3 text-xs text-slate-500">
            Keep reviewing — the ladder only moves when mastery is demonstrated, so progress appears after your next assessed session.
          </p>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 backdrop-blur-md">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 text-[11px] uppercase tracking-[0.2em] text-slate-500">
            <tr>
              <th scope="col" className="px-5 py-3 font-semibold">Rank</th>
              <th scope="col" className="px-5 py-3 font-semibold">Racer</th>
              <th scope="col" className="px-5 py-3 text-right font-semibold">Mastery</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {view.rows.map((row, i) => (
              <tr key={`${row.handle}-${i}`} className={row.isCaller ? "bg-gold/5" : undefined}>
                <td className="px-5 py-3.5 tabular-nums text-slate-400">{row.rank ?? "—"}</td>
                <td className="px-5 py-3.5">
                  <span className="font-semibold text-slate-100">{row.handle}</span>
                  {row.isCaller && <span className="ml-2 text-[11px] uppercase tracking-[0.2em] text-gold">You</span>}
                </td>
                <td className="px-5 py-3.5 text-right font-serif text-lg font-bold tabular-nums text-slate-100">
                  {row.progress === null ? "—" : `${Math.round(row.progress * 100)}%`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
