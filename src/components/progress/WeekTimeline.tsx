"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { LearningDomain } from "@/lib/learning-domain";

interface WeekDay {
  date: string;
  label: string;
  count: number;
  complete: boolean;
  current: boolean;
}

/**
 * Seven-day plan timeline — relocated off Home in the IA rework (Home answers
 * "what now" only; the calendar strip is analytics). Reads /api/battle-plan,
 * so it stays a client component with no DB access (AGENTS.md rule 4).
 *
 * Lane-separated: the battle plan is a High School surface, so a University
 * session never fetches or renders the HS strip — it gets an honest pointer
 * to its own revision schedule instead.
 */
export default function WeekTimeline({ domain }: { domain: LearningDomain }) {
  const [week, setWeek] = useState<WeekDay[] | null>(null);
  const [failed, setFailed] = useState(false);
  const isHighSchool = domain === "highschool";

  useEffect(() => {
    if (!isHighSchool) return;
    let cancelled = false;
    fetch("/api/battle-plan?exam=jamb")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("failed"))))
      .then((data: { week?: WeekDay[] }) => {
        if (!cancelled) setWeek(Array.isArray(data.week) ? data.week : []);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [isHighSchool]);

  if (!isHighSchool) {
    return (
      <section
        aria-labelledby="week-timeline-title"
        className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
      >
        <h2 id="week-timeline-title" className="text-lg font-serif font-semibold text-slate-100">
          This week&apos;s revision
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          University revision follows your courses&apos; spaced-repetition schedule — no exam countdown plan here.
        </p>
        <Link
          href="/university/revision"
          className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-gold underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          Open revision →
        </Link>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="week-timeline-title"
      className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="week-timeline-title" className="text-lg font-serif font-semibold text-slate-100">
          This week&apos;s plan
        </h2>
        <Link
          href="/battle-plan"
          className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-gold underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          View full plan →
        </Link>
      </div>

      {failed ? (
        <p role="status" className="mt-4 text-sm text-slate-400">
          Your week is unavailable right now — nothing is inferred after a failed read.
        </p>
      ) : week === null ? (
        <p role="status" aria-busy="true" className="mt-4 text-sm text-slate-400">
          Loading your week…
        </p>
      ) : week.length === 0 ? (
        <p className="mt-4 text-sm text-slate-400">
          No plan yet — build one and your week fills in here.
        </p>
      ) : (
        <ol className="mt-4 grid grid-cols-7 gap-1">
          {week.map((day, index) => (
            <li key={day.date}>
              <Link
                href="/battle-plan"
                aria-current={index === 0 ? "date" : undefined}
                aria-label={`${day.label}: ${
                  day.complete ? "complete" : day.current ? "current stop" : day.count ? `${day.count} planned` : "no stop"
                }`}
                className="flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-lg text-[10px] font-semibold text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <span
                  aria-hidden="true"
                  className={`h-3 w-3 rounded-full border-2 ${
                    day.complete
                      ? "border-emerald-400 bg-emerald-400"
                      : day.current
                        ? "border-gold bg-gold motion-safe:animate-pulse"
                        : day.count
                          ? "border-gold/60 bg-slate-950"
                          : "border-slate-600 bg-slate-950"
                  }`}
                />
                <span>{day.label}</span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}