"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Sparkles } from "lucide-react";

interface AddToRevisionProps {
  conceptId: string;
  conceptTitle: string;
  authenticated: boolean;
}

/**
 * The study-loop handoff: after a student reads a lesson, they add its
 * concept to their spaced-repetition queue so the scheduler begins tracking
 * its forgetting curve. Idempotent on the backend, so re-pressing is safe.
 */
export default function AddToRevision({ conceptId, conceptTitle, authenticated }: AddToRevisionProps) {
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">(authenticated ? "idle" : "error");
  const [message, setMessage] = useState(authenticated ? "" : "Sign in to start tracking this concept.");

  async function subscribe() {
    setState("busy");
    setMessage("");
    try {
      const res = await fetch("/api/mastery/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conceptId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not add to revision queue");
      setState("done");
      setMessage(`Added. We'll schedule ${conceptTitle} to return just before you'd forget it.`);
    } catch (e) {
      setState("error");
      setMessage(e instanceof Error ? e.message : "Could not add to revision queue.");
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-[#D4AF37]" />
        <h2 className="font-serif text-lg font-bold">Make this stick</h2>
      </div>

      {state === "done" ? (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.07] p-4 space-y-3">
          <div className="flex items-center gap-2 text-emerald-300">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm font-medium">In your revision queue</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{message}</p>
          <Link
            href="/university/revision"
            className="inline-flex items-center justify-center min-h-[44px] rounded-xl bg-[#D4AF37] px-5 py-2 font-semibold text-slate-950 text-sm hover:bg-amber-400 transition-colors"
          >
            Go to my revision queue
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-400 leading-relaxed max-w-md">
            Reading is only half of learning. Add this concept to your spaced-repetition queue and
            it&apos;ll resurface exactly when you&apos;re about to forget it — a few minutes now saves
            hours later.
          </p>
          <button
            type="button"
            onClick={() => void subscribe()}
            disabled={state === "busy"}
            className="shrink-0 inline-flex items-center justify-center min-h-[44px] rounded-xl border border-[#D4AF37]/60 px-5 py-2 font-semibold text-[#D4AF37] text-sm hover:bg-[#D4AF37]/10 transition-colors disabled:opacity-50"
          >
            {state === "busy" ? "Adding…" : "Add to revision queue"}
          </button>
        </div>
      )}

      {message && state !== "done" && <p className="text-sm text-slate-400">{message}</p>}
    </div>
  );
}
