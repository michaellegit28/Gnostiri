"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * JoinQueueButton — the ladder's "Join the queue" call to action.
 *
 * A member self-assigns by tier: POST /api/ranking/queue creates their
 * RankState on a first visit, takes the tier from their stars and drops them
 * into a group of their tier with room. The button then re-renders the
 * server component, so the ladder shows the group, the roster and the open
 * pods without a manual reload.
 */
export default function JoinQueueButton({ label = "Join the queue" }: { label?: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function join() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/ranking/queue", { method: "POST" });
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) throw new Error(data?.error ?? "Could not join the queue");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not join the queue");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => void join()}
        disabled={busy}
        className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-gold px-6 font-semibold text-slate-950 transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:opacity-60"
      >
        {busy ? "Finding your group…" : label}
      </button>
      {error && (
        <p className="mt-2 text-sm text-rose-300" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
