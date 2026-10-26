"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Flag, Loader2 } from "lucide-react";
import { REPORT_CATEGORIES } from "@/lib/content-reports";

interface ContentReportTabProps {
  domain: "highschool" | "university" | "extras";
  targetType: "lesson" | "question" | "topic" | "assessmentItem";
  targetId: string;
  targetUrl: string;
  targetTitle?: string;
  authenticated: boolean;
}

const CATEGORY_LABELS: Record<(typeof REPORT_CATEGORIES)[number], string> = {
  incorrect: "The answer or statement is wrong",
  unclear: "Hard to follow or ambiguous",
  typo: "Typo or formatting slip",
  missing: "Information is missing",
  inappropriate: "Inappropriate content",
  other: "Something else",
};

/**
 * The discreet "report a problem" tab that sits at the bottom of lesson, study
 * and item pages. The page must read as finished by default: the form stays
 * behind a low-contrast text trigger until a learner chooses to open it.
 */
export default function ContentReportTab({
  domain,
  targetType,
  targetId,
  targetUrl,
  targetTitle,
  authenticated,
}: ContentReportTabProps) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState<string>(REPORT_CATEGORIES[0]);
  const [detail, setDetail] = useState("");

  if (!authenticated) {
    return (
      <section className="border-t border-slate-800/60 pt-4">
        <p className="text-xs text-slate-500">
          Spotted a problem with this content?{" "}
          <Link
            href="/login"
            className="rounded underline hover:text-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            Sign in
          </Link>{" "}
          to send it to our editors.
        </p>
      </section>
    );
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!detail.trim()) {
      setState("error");
      setMessage("Tell us what is wrong so we can fix it.");
      return;
    }
    setState("busy");
    setMessage("");
    try {
      const payload: Record<string, string> = {
        domain,
        targetType,
        targetId,
        targetUrl,
        category,
        detail: detail.trim(),
      };
      if (targetTitle) payload.targetTitle = targetTitle;
      const res = await fetch("/api/content-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? "Could not send this report.");
      setState("done");
      setMessage("Thanks — this has been sent to our editors.");
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Could not send this report.");
    }
  }

  return (
    <section className="border-t border-slate-800/60 pt-4">
      {state === "done" ? (
        <p role="status" className="flex min-h-[44px] items-center gap-2 text-sm text-emerald-300">
          <CheckCircle2 aria-hidden="true" className="h-4 w-4 shrink-0" />
          {message}
        </p>
      ) : !open ? (
        <button
          type="button"
          aria-expanded={false}
          onClick={() => {
            setOpen(true);
            setState("idle");
            setMessage("");
          }}
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded text-xs text-slate-500 transition-colors hover:text-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <Flag aria-hidden="true" className="h-3.5 w-3.5" />
          Spotted a problem with this content?
        </button>
      ) : (
        <form onSubmit={submit} className="space-y-3 rounded-xl border border-gold/30 bg-gold/[0.04] p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold">
            <Flag aria-hidden="true" className="h-3.5 w-3.5" />
            Report a problem
          </div>
          <label className="block text-xs text-slate-400">
            What kind of problem?
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gold/25 bg-slate-950/60 p-2 text-sm text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              {REPORT_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </label>
          <textarea
            maxLength={2000}
            aria-label="Describe the problem"
            rows={4}
            required
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder="What did you see, and what should it say instead?"
            className="w-full resize-y rounded-lg border border-gold/25 bg-slate-950/60 p-3 text-sm leading-relaxed text-slate-100 placeholder:text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={state === "busy"}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:opacity-50"
            >
              {state === "busy" && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
              {state === "busy" ? "Sending…" : "Send report"}
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setState("idle");
                setMessage("");
              }}
              className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-800/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              Cancel
            </button>
          </div>
          {state === "error" && (
            <p role="alert" className="text-sm text-red-300">
              {message}
            </p>
          )}
        </form>
      )}
    </section>
  );
}
