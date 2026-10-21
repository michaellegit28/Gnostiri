"use client";

/**
 * ExamRunner — board-adaptive examination view.
 * Header (subject tabs · counter · progress · countdown) · question stage
 * (objective radio / theory pad) · footer (grid, mark-for-review, prev/next).
 * Answers live in React state mirrored to sessionStorage; grading happens
 * server-side on submit — this component never sees the answer key.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, ArrowRight, Bookmark, Grid3X3, X } from "lucide-react";
import { CBT } from "@/lib/cbt/ui";
import type { CbtSessionPaper } from "@/lib/cbt/data";
import type { CbtReport } from "@/lib/cbt/scoring";

const ACTIVE_KEY = "gnostiri-cbt-active";
const REPORT_KEY = "gnostiri-cbt-report";

interface StoredState {
  answers: Record<string, { chosen: number | null; text?: string; marked?: boolean }>;
  subjectIdx: number;
  qIdx: number;
  paperTab: "objective" | "theory";
  startedAt: number;
}

function formatClock(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}` : `${m}:${String(r).padStart(2, "0")}`;
}

export default function ExamRunner({ paper }: { paper: CbtSessionPaper }) {
  const router = useRouter();
  const digest = useMemo(() => JSON.stringify(paper.subjects.flatMap((s) => s.questions.map((q) => q.id))), [paper]);

  const [answers, setAnswers] = useState<Record<string, { chosen: number | null; text?: string; marked?: boolean }>>({});
  const [subjectIdx, setSubjectIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [paperTab, setPaperTab] = useState<"objective" | "theory">("objective");
  const [startedAt] = useState<number>(() => {
    try {
      const raw = sessionStorage.getItem(ACTIVE_KEY);
      const parsed = raw ? (JSON.parse(raw) as { digest?: string; state?: StoredState }) : null;
      if (parsed?.digest === digest && parsed.state) {
        setAnswers(parsed.state.answers ?? {});
        setSubjectIdx(parsed.state.subjectIdx ?? 0);
        setQIdx(parsed.state.qIdx ?? 0);
        setPaperTab(parsed.state.paperTab ?? "objective");
        return parsed.state.startedAt ?? Date.now();
      }
    } catch { /* fresh session */ }
    return Date.now();
  });
  const [now, setNow] = useState(() => Date.now());
  const [gridOpen, setGridOpen] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submittedRef = useRef(false);

  const subject = paper.subjects[subjectIdx];
  const flat = subject.questions;
  const current = flat[qIdx];
  const remaining = paper.durationSec - (now - startedAt) / 1000;
  const objectiveQuestions = flat.filter((q) => q.type !== "theory");
  const theoryQuestions = flat.filter((q) => q.type === "theory");
  const showTheoryTab = theoryQuestions.length > 0;
  const activeQuestions = paperTab === "theory" ? theoryQuestions : objectiveQuestions;
  const activeIdx = paperTab === "theory" ? Math.min(qIdx, Math.max(theoryQuestions.length - 1, 0)) : qIdx;
  const activeQ = activeQuestions[Math.min(activeIdx, activeQuestions.length - 1)];

  // 1 s tick, drift-corrected
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // persist
  useEffect(() => {
    const state: StoredState = { answers, subjectIdx, qIdx, paperTab, startedAt };
    try { sessionStorage.setItem(ACTIVE_KEY, JSON.stringify({ digest, state })); } catch { /* quota */ }
  }, [answers, subjectIdx, qIdx, paperTab, startedAt, digest]);

  const submit = useCallback(async () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/cbt/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          boardCode: paper.boardCode,
          mode: paper.mode,
          answers,
          durationUsedSec: Math.min(paper.durationSec, Math.round((Date.now() - startedAt) / 1000)),
          papers: paper.subjects.map((s) => ({ topicId: s.topicId, title: s.title, questionIds: s.questions.map((q) => q.id) })),
        }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? "grading failed");
      const report = (await res.json()) as CbtReport;
      sessionStorage.setItem(REPORT_KEY, JSON.stringify(report));
      sessionStorage.removeItem(ACTIVE_KEY);
      router.push("/cbt/results");
    } catch (e) {
      submittedRef.current = false;
      setSubmitting(false);
      setError(e instanceof Error ? e.message : "Something went wrong while grading");
    }
  }, [answers, paper, router, startedAt]);

  // auto-submit at 0:00
  useEffect(() => {
    if (remaining <= 0 && !submittedRef.current) void submit();
  }, [remaining, submit]);

  const pick = (optionIndex: number) => {
    if (!activeQ) return;
    setAnswers((prev) => ({ ...prev, [activeQ.id]: { ...prev[activeQ.id], chosen: prev[activeQ.id]?.chosen === optionIndex ? null : optionIndex } }));
  };
  const toggleMark = () => {
    if (!activeQ) return;
    setAnswers((prev) => ({ ...prev, [activeQ.id]: { chosen: prev[activeQ.id]?.chosen ?? null, text: prev[activeQ.id]?.text, marked: !prev[activeQ.id]?.marked } }));
  };
  const setTheory = (text: string) => {
    if (!activeQ) return;
    setAnswers((prev) => ({ ...prev, [activeQ.id]: { chosen: prev[activeQ.id]?.chosen ?? null, text } }));
  };

  const step = (delta: number) => {
    const list = paperTab === "theory" ? theoryQuestions : objectiveQuestions;
    const next = activeIdx + delta;
    if (next < 0) {
      if (subjectIdx > 0) { setSubjectIdx(subjectIdx - 1); setQIdx(0); setPaperTab("objective"); }
      return;
    }
    if (next >= list.length) {
      if (subjectIdx < paper.subjects.length - 1) { setSubjectIdx(subjectIdx + 1); setQIdx(0); setPaperTab("objective"); }
      return;
    }
    setQIdx(next);
  };

  const answeredCount = Object.values(answers).filter((a) => a.chosen !== null || (a.text && a.text.trim())).length;
  const markedCount = Object.values(answers).filter((a) => a.marked).length;
  const lowTime = remaining <= 300;

  if (!activeQ && paperTab === "objective") return null;

  return (
    <main className="flex min-h-screen flex-col bg-transparent text-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0d0a24]/95 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 gap-1 overflow-x-auto" role="tablist" aria-label="Subjects">
              {paper.subjects.map((s, i) => (
                <button
                  key={s.topicId}
                  role="tab"
                  aria-selected={i === subjectIdx}
                  onClick={() => { setSubjectIdx(i); setQIdx(0); setPaperTab("objective"); }}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                    i === subjectIdx ? "bg-gold text-slate-950" : "border border-white/10 bg-white/5 text-slate-300"
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </div>
            <span
              role="timer"
              aria-label={`Time remaining ${formatClock(remaining)}`}
              className={`shrink-0 rounded-lg border px-2.5 py-1 font-mono text-sm font-bold tabular-nums ${
                lowTime ? CBT.timerLow : "border-white/10 bg-white/5 text-gold"
              }`}
            >
              {formatClock(remaining)}
            </span>
          </div>

          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-400">
            <span>Question {Math.min(activeIdx + 1, activeQuestions.length)} of {activeQuestions.length}</span>
            <span>{answeredCount} answered{markedCount > 0 ? ` · ${markedCount} flagged` : ""}</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuenow={activeIdx + 1} aria-valuemin={1} aria-valuemax={activeQuestions.length}>
            <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${((activeIdx + 1) / Math.max(activeQuestions.length, 1)) * 100}%` }} />
          </div>

          {showTheoryTab && (
            <div className="mt-2 flex gap-1" role="tablist" aria-label="Paper">
              {(["objective", "theory"] as const).map((tab) => (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={paperTab === tab}
                  onClick={() => setPaperTab(tab)}
                  className={`rounded-lg px-3 py-1 text-xs font-semibold capitalize focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                    paperTab === tab ? "border border-gold/60 bg-gold/15 text-gold" : "border border-white/10 text-slate-400"
                  }`}
                >
                  {tab} paper
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Question stage */}
      <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        {activeQ && (
          <article aria-live="polite">
            {activeQ.hint && (
              <p className={`mb-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 text-xs leading-relaxed ${CBT.muted}`}>
                Hint: {activeQ.hint}
              </p>
            )}
            <h1 className="font-reading text-base leading-relaxed text-slate-100 md:text-lg">{activeQ.questionText}</h1>

            {paperTab === "objective" ? (
              <div role="radiogroup" aria-label="Answer options" className="mt-5 space-y-2.5">
                {activeQ.options.map((option, i) => {
                  const picked = answers[activeQ.id]?.chosen === i;
                  return (
                    <button
                      key={i}
                      type="button"
                      role="radio"
                      aria-checked={picked}
                      onClick={() => pick(i)}
                      className={`${CBT.optionBase} ${picked ? CBT.optionPicked : CBT.optionIdle}`}
                    >
                      <span className={`${CBT.optionLetter} ${picked ? "border-gold bg-gold text-slate-950" : "text-slate-400"}`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="min-w-0">{option}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="mt-5">
                <label htmlFor="theory-pad" className="sr-only">Your theory answer</label>
                <textarea
                  id="theory-pad"
                  value={answers[activeQ.id]?.text ?? ""}
                  onChange={(e) => setTheory(e.target.value)}
                  rows={9}
                  placeholder="Write your full answer — examiners reward structured points, definitions and examples."
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-relaxed text-slate-100 placeholder:text-slate-600 focus:border-gold/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                />
                <p className={`mt-1 text-right text-xs ${CBT.faint}`}>
                  {(answers[activeQ.id]?.text ?? "").trim().split(/\s+/).filter(Boolean).length} words
                </p>
              </div>
            )}
          </article>
        )}
      </div>

      {/* Footer navigation */}
      <footer className={CBT.stickyBar}>
        <div className="mx-auto max-w-2xl">
          <button
            type="button"
            onClick={() => setGridOpen((v) => !v)}
            aria-expanded={gridOpen}
            className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold text-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <span className="flex items-center gap-2"><Grid3X3 className="h-4 w-4 text-gold" aria-hidden /> Question navigator</span>
            <span>{gridOpen ? "Hide" : "Show"}</span>
          </button>

          {gridOpen && (
            <div className="mt-2 grid max-h-28 grid-cols-7 gap-1.5 overflow-y-auto sm:grid-cols-10" role="group" aria-label="Question grid">
              {activeQuestions.map((q, i) => {
                const a = answers[q.id];
                const isCurrent = i === activeIdx;
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setQIdx(i)}
                    aria-label={`Question ${i + 1}${a?.chosen != null ? ", answered" : ""}${a?.marked ? ", flagged" : ""}`}
                    aria-current={isCurrent ? "true" : undefined}
                    className={`${CBT.gridCell} ${
                      isCurrent ? "border-gold text-gold"
                      : a?.marked ? "border-violet-400/60 bg-violet-500/15 text-violet-200"
                      : a?.chosen != null ? "border-transparent bg-gold text-slate-950"
                      : "border-white/10 bg-white/5 text-slate-400"
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-2.5 flex items-center gap-2">
            <button type="button" onClick={() => step(-1)} disabled={subjectIdx === 0 && activeIdx === 0} className={`${CBT.ghostBtn} min-h-[44px] px-3`} aria-label="Previous question">
              <ArrowLeft className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={toggleMark}
              className={`${CBT.ghostBtn} min-h-[44px] flex-1 text-xs ${answers[activeQ.id]?.marked ? "border-violet-400/60 bg-violet-500/15 text-violet-200" : ""}`}
            >
              <Bookmark className="h-4 w-4" aria-hidden />
              {answers[activeQ.id]?.marked ? "Marked" : "Mark for review"}
            </button>
            {activeIdx === activeQuestions.length - 1 && subjectIdx === paper.subjects.length - 1 ? (
              <button type="button" onClick={() => setConfirmOpen(true)} className={`${CBT.primaryBtn} min-h-[44px] w-auto flex-1 text-sm`}>
                Submit Exam
              </button>
            ) : (
              <button type="button" onClick={() => step(1)} className={`${CBT.primaryBtn} min-h-[44px] w-auto flex-1 text-sm`} aria-label="Next question">
                Next <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* Submit confirmation */}
      {confirmOpen && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/70 p-4 sm:items-center" role="dialog" aria-modal="true" aria-labelledby="confirm-h">
          <div className={`${CBT.panel} w-full max-w-md bg-[#0d0a24] p-6`}>
            <div className="flex items-start justify-between gap-3">
              <h2 id="confirm-h" className="flex items-center gap-2 font-serif text-lg font-bold">
                <AlertTriangle className="h-5 w-5 text-gold" aria-hidden /> Submit your paper?
              </h2>
              <button type="button" onClick={() => setConfirmOpen(false)} aria-label="Close" className="rounded p-1 text-slate-400 hover:text-white">
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <p className={`mt-3 text-sm leading-relaxed ${CBT.muted}`}>
              You answered <strong className="text-slate-100">{answeredCount}</strong> of {paper.subjects.reduce((s, x) => s + x.questions.length, 0)} questions
              {markedCount > 0 && <> and flagged <strong className="text-slate-100">{markedCount}</strong> for review</>}.
              Grading is final — the timer keeps running until you confirm.
            </p>
            {error && <p className="mt-2 text-sm text-rose-300">{error}</p>}
            <div className="mt-5 grid gap-2">
              <button type="button" onClick={() => void submit()} disabled={submitting} className={CBT.primaryBtn}>
                {submitting ? "Grading…" : "Yes — submit & grade"}
              </button>
              <button type="button" onClick={() => setConfirmOpen(false)} className={CBT.ghostBtn}>Keep working</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
