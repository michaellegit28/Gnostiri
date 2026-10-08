"use client";

import { useState } from "react";

// Manual completion override with friction: quiz remains the recommended path.
export default function ManualCompleteButton({ topicId, alreadyCompleted }: { topicId: string; alreadyCompleted: boolean }) {
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(alreadyCompleted);
  const [busy, setBusy] = useState(false);

  if (done) {
    return <span className="text-xs font-semibold text-emerald-400">✓ Marked complete</span>;
  }

  if (!confirming) {
    return (
      <button onClick={() => setConfirming(true)} className="text-xs underline text-slate-400 hover:text-slate-200">
        Skipping the quiz? Mark as complete
      </button>
    );
  }

  return (
    <div className="space-y-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-200">
      <p>You can mark this complete, but taking the quiz locks in your progress and identifies gaps.</p>
      <div className="flex gap-2">
        <button
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              const res = await fetch("/api/progress/mark-complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ domain: "highschool", topicId }),
              });
              if (res.ok) setDone(true);
            } finally {
              setBusy(false);
            }
          }}
          className="rounded bg-amber-500 px-3 py-1 font-semibold text-slate-950 disabled:opacity-50"
        >
          {busy ? "Saving…" : "Mark complete anyway"}
        </button>
        <button onClick={() => setConfirming(false)} className="rounded border border-slate-600 px-3 py-1 text-slate-300">
          Take the quiz instead
        </button>
      </div>
    </div>
  );
}
