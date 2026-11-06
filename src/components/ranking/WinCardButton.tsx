"use client";

import { useState } from "react";

/**
 * WinCardButton — the ladder's "Share win card" call to action (Phase 5).
 *
 * Hits /api/ranking/win-card and saves the 1080x1920 PNG it returns. Two
 * shapes, decided by which prop is given:
 *
 *   - matchId   — a pod the caller played; the server derives the delta from
 *                 their placement in it.
 *   - tier+delta — a rank-up; the server refuses a delta that is not the
 *                 caller's own most recent star award.
 *
 * The card is a display name and nothing else (src/lib/win-card.ts), so a
 * card posted to WhatsApp Status leaks no email, id or roster.
 */
export default function WinCardButton({
  matchId,
  tier,
  delta,
  context,
  label = "Share win card",
  className = "inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-gold/40 px-5 font-semibold text-slate-400 gn-motion transition-colors hover:bg-gold/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60",
}: {
  matchId?: string;
  tier?: number;
  delta?: number;
  context?: string;
  label?: string;
  className?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function share() {
    setBusy(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (matchId) params.set("match", matchId);
      else {
        if (tier === undefined || delta === undefined) throw new Error("Nothing to share yet");
        params.set("tier", String(tier));
        params.set("delta", String(delta));
        if (context) params.set("context", context);
      }
      const res = await fetch(`/api/ranking/win-card?${params.toString()}`);
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Could not build your win card");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = matchId ? `win-card-pod-${matchId}.png` : `win-card-tier${tier}.png`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not build your win card");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <button type="button" onClick={() => void share()} disabled={busy} className={className}>
        {busy ? "Rendering your card…" : label}
      </button>
      <p className="mt-1.5 text-[11px] text-muted">Sized for WhatsApp Status</p>
      {error && (
        <p className="mt-2 text-sm text-rose-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
