"use client";

import { useState } from "react";
import { Check } from "lucide-react";

// Manual completion override with friction: quiz remains the recommended path.
export default function ManualCompleteButton({ topicId, alreadyCompleted }: { topicId: string; alreadyCompleted: boolean }) {
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(alreadyCompleted);
  const [busy, setBusy] = useState(false);

  if (done) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
        <Check aria-hidden="true" className="h-3.5 w-3.5" />
        Marked complete
      </span>
    );
  }

  if (!confirming) {
    return (
      <button onClick={() => setConfirming(true)} className="gn-motion rounded text-xs text-slate-400 underline transition-colors hover:text-electric-text focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
        Skipping the quiz? Mark as complete
      </button>
    );
  }

  return (
    <div className="space-y-2 rounded-lg border border-border/30 bg-surface/10 p-3 text-xs text-slate-400">
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
          className="gn-motion rounded bg-primary px-3 py-1 font-semibold text-on-primary transition-colors hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? "Saving…" : "Mark complete anyway"}
        </button>
        <button onClick={() => setConfirming(false)}           className="rounded border border-border px-3 py-1 text-slate-400">
          Take the quiz instead
        </button>
      </div>
    </div>
  );
}
