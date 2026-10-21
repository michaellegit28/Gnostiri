"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, CheckCircle2, XCircle } from "lucide-react";
import { CBT } from "@/lib/cbt/ui";
import type { CbtReport } from "@/lib/cbt/scoring";

const REPORT_KEY = "gnostiri-cbt-report";

export default function ReviewClient() {
  const [report, setReport] = useState<CbtReport | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(REPORT_KEY);
      const parsed = raw ? (JSON.parse(raw) as CbtReport) : null;
      if (parsed?.review?.length) setReport(parsed);
    } catch { /* no report */ }
    setChecked(true);
  }, []);

  if (!checked) return null;
  if (!report) {
    return (
      <div className={`${CBT.panel} mt-6 p-8 text-center`}>
        <p className="text-sm text-slate-300">Nothing to review yet — finish a sitting first.</p>
        <Link href="/cbt" className={`${CBT.primaryBtn} mt-5 max-w-xs`}>Start a sitting</Link>
      </div>
    );
  }

  const bySubject = new Map<string, CbtReport["review"]>();
  for (const item of report.review) {
    const list = bySubject.get(item.subject) ?? [];
    list.push(item);
    bySubject.set(item.subject, list);
  }

  return (
    <div className="mt-6 space-y-8">
      {Array.from(bySubject.entries()).map(([subject, items]) => (
        <section key={subject} aria-labelledby={`rev-${subject}`}>
          <h2 id={`rev-${subject}`} className="font-serif text-lg font-bold text-slate-50">{subject}</h2>
          <ol className="mt-3 space-y-4">
            {items.map((item, i) => (
              <li key={item.questionId} className={`${CBT.card} p-4`}>
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-xs font-bold ${item.correct ? "text-emerald-300" : "text-rose-300"}`}>
                    Q{i + 1} · {item.correct ? "Correct" : item.chosenIndex == null ? "Not answered" : "Incorrect"}
                  </span>
                  {item.marked && (
                    <span className={`${CBT.chip} shrink-0`}><Bookmark className="h-3 w-3 text-violet-300" aria-hidden /> was flagged</span>
                  )}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-100">{item.questionText}</p>
                <ul className="mt-3 space-y-1.5">
                  {item.options.map((opt, oi) => {
                    const isKey = oi === item.correctIndex;
                    const isChosen = oi === item.chosenIndex;
                    return (
                      <li
                        key={oi}
                        className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-sm ${
                          isKey ? "border-emerald-500/40 bg-emerald-950/20 text-emerald-100"
                          : isChosen ? "border-rose-500/40 bg-rose-950/20 text-rose-100"
                          : "border-white/5 text-slate-400"
                        }`}
                      >
                        <span className="mt-0.5 shrink-0 font-bold">{String.fromCharCode(65 + oi)}.</span>
                        <span className="min-w-0">{opt}</span>
                        {isKey && <CheckCircle2 className="ml-auto h-4 w-4 shrink-0 text-emerald-400" aria-label="Correct answer" />}
                        {isChosen && !isKey && <XCircle className="ml-auto h-4 w-4 shrink-0 text-rose-400" aria-label="Your answer" />}
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ol>
        </section>
      ))}

      <div className={CBT.stickyBar}>
        <div className="mx-auto max-w-2xl grid gap-2">
          <Link href="/cbt/results" className={CBT.ghostBtn}>Back to results</Link>
          <Link href="/cbt" className={CBT.primaryBtn}>New sitting</Link>
        </div>
      </div>
    </div>
  );
}
