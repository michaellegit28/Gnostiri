"use client";

import { useState } from "react";
import Link from "next/link";
import { Gift, Loader2, LogIn, PartyPopper } from "lucide-react";

/**
 * AdoptButton — the shared "adopt this artifact" control.
 *
 * Anonymous visitors get a sign-in prompt (the library is browsable by anyone;
 * adopting needs an account). A signed-in click POSTs to the adopt endpoint;
 * on success it links to the desk, on a repeat it says the artifact is already
 * there. The uploader's reward happens server-side — this button never learns
 * who the uploader is or what they were paid.
 */

type Status = "idle" | "busy" | "done" | "already" | "error";

export default function AdoptButton({
  documentId,
  signedIn,
  label = "Adopt to my desk",
  className = "",
}: {
  documentId: string;
  signedIn: boolean;
  label?: string;
  className?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  if (!signedIn) {
    return (
      <Link
        href="/login"
        className={`gn-motion inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-lg border border-gold/40 bg-gold/10 px-4 py-2 text-sm font-semibold text-gold-text transition-colors hover:border-gold/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.98] ${className}`}
      >
        <LogIn className="h-4 w-4" /> Sign in to adopt
      </Link>
    );
  }

  if (status === "done") {
    return (
      <Link
        href="/desk"
        className={`gn-motion inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 active:scale-[0.98] ${className}`}
      >
        <PartyPopper className="h-4 w-4" /> On your desk — open it
      </Link>
    );
  }

  if (status === "already") {
    return (
      <Link
        href="/desk"
        className={`inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-lg border border-line-strong px-4 py-2 text-sm font-semibold text-slate-300 transition-colors hover:border-primary/50 ${className}`}
      >
        Already on your desk — open it
      </Link>
    );
  }

  async function adopt() {
    setStatus("busy");
    setMessage(null);
    try {
      const res = await fetch(`/api/library/${documentId}/adopt`, { method: "POST" });
      if (res.ok) {
        setStatus("done");
        return;
      }
      if (res.status === 409) {
        setStatus("already");
        return;
      }
      const data = await res.json().catch(() => ({}));
      setMessage(typeof data.error === "string" ? data.error : "Could not adopt — try again.");
      setStatus("error");
    } catch {
      setMessage("Network error — try again.");
      setStatus("error");
    }
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={adopt}
        disabled={status === "busy"}
        aria-busy={status === "busy"}
        className="gn-motion inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "busy" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Gift className="h-4 w-4" />}
        {status === "busy" ? "Adopting…" : label}
      </button>
      {message && <p className="mt-1.5 text-xs text-rose-300">{message}</p>}
    </div>
  );
}
