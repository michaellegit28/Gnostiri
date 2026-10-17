"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, Clock, ChevronRight, RotateCcw } from "lucide-react";

interface DueConcept {
  id: string;
  conceptId: string;
  title: string;
  slug: string;
  bloomsLevel: string;
  estMinutes: number;
  courseSlug: string;
  courseTitle: string;
  overdueDays: number;
}

interface RevisionQueueProps {
  due: DueConcept[];
}

type Confidence = "low" | "medium" | "high";

export default function RevisionQueue({ due }: RevisionQueueProps) {
  const [index, setIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [result, setResult] = useState<{ correct: boolean; interval: number } | null>(null);
  const [done, setDone] = useState<DueConcept[]>([]);

  const current = due[index];

  if (!current) {
    return (
      <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/[0.07] p-10 text-center space-y-4">
        <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
        <h2 className="font-serif text-2xl font-bold">Queue cleared</h2>
        <p className="text-slate-300 text-sm max-w-xl mx-auto">
          You reviewed all {done.length} concept{done.length === 1 ? "" : "s"} due today. The next one returns
          on its schedule — come back tomorrow.
        </p>
      </div>
    );
  }

  async function record(correct: boolean, confidence: Confidence) {
    setRecording(true);
    try {
      const res = await fetch("/api/mastery/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conceptId: current.conceptId,
          correct,
          confidence,
          examCondition: false,
        }),
      });
      const data = await res.json();
      setResult({ correct, interval: data.mastery?.intervalDays ?? 1 });
      setDone((d) => [...d, current]);
    } catch {
      setResult({ correct, interval: 1 });
    } finally {
      setRecording(false);
    }
  }

  function next() {
    setResult(null);
    setIndex((i) => i + 1);
  }

  const overdueLabel =
    current.overdueDays > 1
      ? `${current.overdueDays} days overdue`
      : current.overdueDays === 1
        ? "Due yesterday"
        : "Due now";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          Card {index + 1} of {due.length}
        </span>
        <span>{done.length} reviewed</span>
      </div>

      <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-teal-500 to-gold transition-all duration-300"
          style={{ width: `${(index / due.length) * 100}%` }}
        />
      </div>

      <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/80 to-slate-950 overflow-hidden">
        <div className="px-7 py-8 md:px-10 md:py-10 space-y-5">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span className="font-mono text-[11px] tracking-[0.15em] text-violet-300 px-2.5 py-1 rounded-md border border-violet-500/25 bg-violet-500/10 uppercase">
              {current.bloomsLevel}
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-amber-300/80">
              <Clock className="w-3.5 h-3.5" /> {overdueLabel}
            </span>
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              {current.courseTitle}
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-bold leading-snug">
              {current.title}
            </h2>
            <p className="text-slate-500 text-sm">~{current.estMinutes} min · recall and apply</p>
          </div>

          {result ? (
            <div className="space-y-5 pt-2">
              <div
                className={`rounded-2xl border p-5 space-y-2 ${
                  result.correct
                    ? "border-emerald-500/30 bg-emerald-500/[0.07]"
                    : "border-rose-500/30 bg-rose-500/[0.07]"
                }`}
              >
                <div className="flex items-center gap-2">
                  {result.correct ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400" />
                  )}
                  <strong className={result.correct ? "text-emerald-300" : "text-rose-300"}>
                    {result.correct ? "Correct" : "Not yet"}
                  </strong>
                </div>
                <p className="text-sm text-slate-300">
                  {result.correct
                    ? `This concept returns in ${result.interval} day${result.interval === 1 ? "" : "s"}.`
                    : "The interval collapsed to tomorrow — we rebuild it together, right away."}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={next}
                  disabled={index >= due.length - 1}
                  className="inline-flex items-center justify-center min-h-[48px] rounded-xl bg-gold px-6 py-3 font-semibold text-slate-950 text-sm disabled:opacity-40"
                >
                  Next concept <ChevronRight className="w-4 h-4 ml-1" />
                </button>
                <Link
                  href={`/university/${current.courseSlug}/concepts`}
                  className="inline-flex items-center justify-center min-h-[48px] rounded-xl border border-slate-600 px-6 py-3 font-semibold text-slate-200 text-sm hover:border-gold/60 transition-colors"
                >
                  Revisit the concept map
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              <p className="text-slate-400 text-sm leading-relaxed">
                Recall this concept from memory, then rate your confidence. Honest self-rating
                makes the schedule accurate — a guessed correct answer should not stretch the gap.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => record(true, "high")}
                  disabled={recording}
                  className="inline-flex items-center justify-center min-h-[48px] gap-2 rounded-xl bg-emerald-500/15 border border-emerald-500/40 px-4 py-3 font-semibold text-emerald-300 text-sm hover:bg-emerald-500/25 transition-colors disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" /> Knew it well
                </button>
                <button
                  type="button"
                  onClick={() => record(false, "low")}
                  disabled={recording}
                  className="inline-flex items-center justify-center min-h-[48px] gap-2 rounded-xl bg-rose-500/15 border border-rose-500/40 px-4 py-3 font-semibold text-rose-300 text-sm hover:bg-rose-500/25 transition-colors disabled:opacity-50"
                >
                  <RotateCcw className="w-4 h-4" /> Need a refresher
                </button>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => record(true, "medium")}
                  disabled={recording}
                  className="flex-1 inline-flex items-center justify-center min-h-[44px] rounded-xl border border-slate-700 px-4 py-2 font-medium text-slate-300 text-xs hover:border-slate-500 transition-colors disabled:opacity-50"
                >
                  Correct, but unsure
                </button>
                <button
                  type="button"
                  onClick={() => record(false, "medium")}
                  disabled={recording}
                  className="flex-1 inline-flex items-center justify-center min-h-[44px] rounded-xl border border-slate-700 px-4 py-2 font-medium text-slate-300 text-xs hover:border-slate-500 transition-colors disabled:opacity-50"
                >
                  Wrong, but close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
