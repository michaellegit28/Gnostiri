"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpenCheck, CheckCircle2, Info, TrendingUp, XCircle } from "lucide-react";
import { CBT } from "@/lib/cbt/ui";
import { scoringExplainer } from "@/lib/cbt/config";
import type { CbtReport } from "@/lib/cbt/scoring";
import { readAttemptHistory, type AttemptRecord } from "@/components/cbt/Step1Client";

const REPORT_KEY = "gnostiri-cbt-report";
const HISTORY_KEY = "gnostiri-cbt-history";

function ScoreRing({ percent, label, sub }: { percent: number; label: string; sub: string }) {
  const R = 70;
  const C = 2 * Math.PI * R;
  return (
    <div className="relative mx-auto h-44 w-44" role="img" aria-label={`Overall score ${label}, ${percent} percent`}>
      <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
        <circle cx="80" cy="80" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
        <circle
          cx="80" cy="80" r={R} fill="none" stroke="#d4af37" strokeWidth="10" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={C - (C * Math.min(percent, 100)) / 100}
          style={{ transition: "stroke-dashoffset 900ms ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-serif text-3xl font-bold text-slate-50">{label}</span>
        <span className={`text-xs ${CBT.muted}`}>{sub}</span>
      </div>
    </div>
  );
}

export default function ResultsClient() {
  const [report, setReport] = useState<CbtReport | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(REPORT_KEY);
      const parsed = raw ? (JSON.parse(raw) as CbtReport) : null;
      if (parsed?.subjects?.length) {
        setReport(parsed);
        const history: AttemptRecord[] = [
          { boardCode: parsed.boardCode, percent: parsed.percent, score: parsed.totalScore, max: parsed.maxTotal, at: Date.now() },
          ...readAttemptHistory(),
        ].slice(0, 50);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
      }
    } catch { /* no report */ }
    setChecked(true);
  }, []);

  if (!checked) return null;

  if (!report) {
    return (
      <div className={`${CBT.panel} mt-6 p-8 text-center`}>
        <BookOpenCheck className="mx-auto h-8 w-8 text-slate-600" aria-hidden />
        <p className="mt-3 text-sm text-slate-300">No recent result on this device.</p>
        <Link href="/cbt" className={`${CBT.primaryBtn} mt-5 max-w-xs`}>Start a new sitting</Link>
      </div>
    );
  }

  const explainer = scoringExplainer(report.model);
  const sorted = [...report.subjects].sort((a, b) => b.rawPercent - a.rawPercent);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];
  const minutes = Math.round(report.durationUsedSec / 60);

  return (
    <div className="mt-6 space-y-6">
      {/* Overall */}
      <section className={`${CBT.panel} p-6 text-center`}>
        <ScoreRing
          percent={report.percent}
          label={`${report.totalScore}/${report.maxTotal}`}
          sub={`${report.percent}% overall`}
        />
        {report.passMark != null && (
          <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold">
            {report.passed ? (
              <><CheckCircle2 className="h-4 w-4 text-emerald-400" aria-hidden /><span className="text-emerald-300">Above the {report.passMark}-mark pass line</span></>
            ) : (
              <><XCircle className="h-4 w-4 text-rose-400" aria-hidden /><span className="text-rose-300">Below the {report.passMark}-mark pass line</span></>
            )}
          </p>
        )}
        {report.grade && <p className="mt-2 text-sm font-semibold text-gold">Grade: {report.grade}</p>}
        <p className={`mt-1 text-xs ${CBT.faint}`}>
          {report.boardName} · {report.mode === "simulation" ? "Complete simulation" : "Practice"} · {report.answeredCount}/{report.questionCount} answered · {minutes} min
        </p>
      </section>

      {/* Per-subject breakdown */}
      <section className={`${CBT.panel} p-5`} aria-labelledby="breakdown-h">
        <h2 id="breakdown-h" className="flex items-center gap-2 font-serif text-lg font-bold">
          <TrendingUp className="h-4 w-4 text-gold" aria-hidden /> Score breakdown
        </h2>
        <ul className="mt-3 space-y-2.5">
          {report.subjects.map((s) => (
            <li key={s.topicId} className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <span className="truncate text-sm font-semibold text-slate-100">{s.title}</span>
                <span className="shrink-0 font-mono text-sm font-bold text-gold">{s.scaled} marks</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gold" style={{ width: `${s.rawPercent}%` }} />
              </div>
              <p className={`mt-1.5 text-xs ${CBT.muted}`}>
                {s.correct}/{s.total} correct · {s.rawPercent}% accuracy
                {s.grade ? ` · grade ${s.grade}` : ""}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Scoring model explainer */}
      <section className={`${CBT.panel} p-5`} aria-labelledby="model-h">
        <h2 id="model-h" className="flex items-center gap-2 font-serif text-lg font-bold">
          <Info className="h-4 w-4 text-gold" aria-hidden /> How this score was calculated
        </h2>
        <ul className="mt-3 space-y-2">
          {explainer.map((line, i) => (
            <li key={i} className={`text-sm leading-relaxed ${CBT.muted}`}>{line}</li>
          ))}
        </ul>
      </section>

      {/* Analysis */}
      <section className={`${CBT.panel} p-5`} aria-labelledby="analysis-h">
        <h2 id="analysis-h" className="font-serif text-lg font-bold">Analysis</h2>
        <p className={`mt-2 text-sm leading-relaxed ${CBT.muted}`}>
          You were strongest in <strong className="text-slate-100">{strongest.title}</strong> ({strongest.rawPercent}%)
          {weakest !== strongest && (
            <> and should prioritise <strong className="text-slate-100">{weakest.title}</strong> ({weakest.rawPercent}%) before your next sitting</>
          )}.
          {" "}Review every key below — each explanation is one re-read away.
        </p>
      </section>

      {/* Primary sticky action */}
      <div className={CBT.stickyBar}>
        <div className="mx-auto max-w-2xl grid gap-2">
          <Link href="/cbt/review" className={CBT.primaryBtn}>Review Answers</Link>
          <Link href="/cbt" className={`${CBT.ghostBtn} justify-center`}>New sitting</Link>
        </div>
      </div>
    </div>
  );
}
