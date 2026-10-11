"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Clock,
  ExternalLink,
  Lightbulb,
  RefreshCw,
  Sparkles,
  Target,
  XCircle,
} from "lucide-react";

interface Question {
  id: string;
  type: string;
  questionText: string;
  options: string[];
  hint: string | null;
}

interface Section {
  sectionId: string;
  sectionName: string;
  order: number;
  questionType: "MCQ" | "THEORY" | "PRACTICAL" | "ORAL";
  delivery: string;
  durationMinutes: number;
  marks: number;
  required: boolean;
  instructions: string;
  transitionMessage: string | null;
  questions: Question[];
}

interface ScoreSection {
  sectionId: string;
  sectionName: string;
  questionType: string;
  totalQuestions: number;
  answered: number;
  correct: number | null;
  score: number | null;
  maxScore: number;
  modelAnswers?: { questionId: string; modelAnswer: string; markingPoints: { point: string; marks: number }[] | null }[];
}

interface Breakdown {
  sections: ScoreSection[];
  totalScore: number;
  maxTotalScore: number;
  percentage: number;
}

type Phase = "overview" | "section" | "transition" | "results";
type Reveal = { isCorrect: boolean; correctAnswer: string; explanation: string | null };

function formatClock(totalSeconds: number): string {
  const m = Math.max(0, Math.floor(totalSeconds / 60));
  const s = Math.max(0, totalSeconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function PracticeRunner({
  boardName,
  boardSlug,
  topicId,
  topicTitle,
  sections,
}: {
  boardName: string;
  boardSlug: string;
  topicId: string;
  topicTitle: string;
  sections: Section[];
}) {
  const [phase, setPhase] = useState<Phase>("overview");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Record<string, string | null>>>({});
  const [reveals, setReveals] = useState<Record<string, Reveal>>({});
  const [hintsOpen, setHintsOpen] = useState<Record<string, boolean>>({});
  const [explanationsOpen, setExplanationsOpen] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [breakdown, setBreakdown] = useState<Breakdown | null>(null);
  const [selfChecked, setSelfChecked] = useState<Record<string, number[]>>({});
  const [aiMarks, setAiMarks] = useState<
    Record<
      string,
      | "loading"
      | {
          points: { index: number; point: string; maxMarks: number; awarded: number; reason: string }[];
          totalAwarded: number;
          maxTotal: number;
          feedback: string;
        }
    >
  >({});
  const [aiErrors, setAiErrors] = useState<Record<string, string>>({});

  const section = sections[sectionIndex];
  const question = section?.questions[questionIndex];
  const sectionAnswers = section ? answers[section.sectionId] ?? {} : {};

  // Lightweight per-section countdown — informational in practice mode.
  function startSectionClock(minutes: number) {
    setSecondsLeft(minutes * 60);
  }

  useMemo(() => {
    if (secondsLeft === null || phase !== "section") return;
    if (secondsLeft <= 0) return;
    const t = setTimeout(() => setSecondsLeft((s) => (s === null ? null : s - 1)), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft, phase]);

  async function startPractice() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/practice/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ boardId: boardSlug, subjectId: "auto", topicId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not start session");
      setSessionId(data.sessionId);
      const first = sections[0];
      const startRes = await fetch("/api/practice/section/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: data.sessionId, sequence: first.order }),
      });
      if (!startRes.ok) {
        const startData = await startRes.json();
        throw new Error(startData.error || "Could not start section");
      }
      setPhase("section");
      setSectionIndex(0);
      setQuestionIndex(0);
      startSectionClock(first.durationMinutes);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start session");
    } finally {
      setBusy(false);
    }
  }

  async function answerMcq(q: Question, option: string) {
    if (reveals[q.id] || busy) return;
    setBusy(true);
    setError("");
    setAnswers((prev) => ({
      ...prev,
      [section.sectionId]: { ...(prev[section.sectionId] ?? {}), [q.id]: option },
    }));
    try {
      const res = await fetch("/api/quiz/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: "highschool", topicId, questionId: q.id, answer: option }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not check answer");
      setReveals((prev) => ({
        ...prev,
        [q.id]: { isCorrect: data.isCorrect, correctAnswer: data.correctAnswer, explanation: data.explanation ?? null },
      }));
      setHintsOpen((prev) => ({ ...prev, [q.id]: false }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not check answer");
    } finally {
      setBusy(false);
    }
  }

  function setTypedAnswer(qid: string, value: string) {
    setAnswers((prev) => ({
      ...prev,
      [section.sectionId]: { ...(prev[section.sectionId] ?? {}), [qid]: value },
    }));
  }

  async function completeSection() {
    if (!sessionId || !section || busy) return;
    setBusy(true);
    setError("");
    try {
      const payload = section.questions.map((q) => ({
        questionId: q.id,
        selectedAnswer: sectionAnswers[q.id] ?? null,
      }));
      const draftRes = await fetch("/api/practice/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, sectionId: section.sectionId, answers: payload }),
      });
      if (!draftRes.ok) {
        const data = await draftRes.json();
        throw new Error(data.error || "Could not save section");
      }
      const isLast = sectionIndex >= sections.length - 1;
      if (isLast) {
        await submitSession();
      } else {
        const next = sections[sectionIndex + 1];
        const startRes = await fetch("/api/practice/section/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, sequence: next.order }),
        });
        if (!startRes.ok) {
          const data = await startRes.json();
          throw new Error(data.error || "Could not advance section");
        }
        if (section.transitionMessage) {
          setPhase("transition");
        } else {
          advanceToNextSection();
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save section");
    } finally {
      setBusy(false);
    }
  }

  function advanceToNextSection() {
    const next = sections[sectionIndex + 1];
    setSectionIndex((i) => i + 1);
    setQuestionIndex(0);
    setPhase("section");
    startSectionClock(next.durationMinutes);
  }

  async function submitSession() {
    const res = await fetch("/api/practice/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Could not submit");
    setBreakdown(data);
    setSelfChecked({});
    setPhase("results");
  }

  function toggleSelfCheck(questionId: string, pointIndex: number) {
    setSelfChecked((prev) => {
      const current = prev[questionId] ?? [];
      return {
        ...prev,
        [questionId]: current.includes(pointIndex)
          ? current.filter((i) => i !== pointIndex)
          : [...current, pointIndex],
      };
    });
  }

  async function markWithAi(sectionId: string, questionId: string) {
    if (!sessionId || aiMarks[questionId] === "loading") return;
    setAiMarks((prev) => ({ ...prev, [questionId]: "loading" }));
    setAiErrors((prev) => ({ ...prev, [questionId]: "" }));
    try {
      const res = await fetch("/api/practice/ai-mark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, sectionId, questionId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAiErrors((prev) => ({ ...prev, [questionId]: data.error || "AI marking failed" }));
        setAiMarks((prev) => {
          const next = { ...prev };
          delete next[questionId];
          return next;
        });
        return;
      }
      setAiMarks((prev) => ({ ...prev, [questionId]: data.aiMark }));
    } catch {
      setAiErrors((prev) => ({ ...prev, [questionId]: "AI marking failed — check your connection" }));
      setAiMarks((prev) => {
        const next = { ...prev };
        delete next[questionId];
        return next;
      });
    }
  }

  function selfAssessTotal(modelAnswers: NonNullable<ScoreSection["modelAnswers"]>): number {
    let total = 0;
    for (const ma of modelAnswers) {
      const checked = selfChecked[ma.questionId] ?? [];
      for (const idx of checked) {
        total += ma.markingPoints?.[idx]?.marks ?? 0;
      }
    }
    return total;
  }

  const questionProgress = question ? `${questionIndex + 1} of ${section.questions.length}` : "";

  return (
    <div className="space-y-5">
      {error && (
        <p role="alert" className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-4 text-rose-200 text-sm">
          {error}
        </p>
      )}

      {/* ---------- OVERVIEW ---------- */}
      {phase === "overview" && (
        <div className="space-y-4">
          {sections.map((s) => (
            <div key={s.sectionId} className="rounded-xl border border-slate-800 bg-slate-900/80 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-serif font-bold">{s.sectionName}</h2>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-700 bg-slate-800/80 uppercase tracking-wide">
                    {s.questionType}
                  </span>
                  <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {formatClock(s.durationMinutes * 60)}</span>
                  <span className="inline-flex items-center gap-1"><Target className="w-3.5 h-3.5" /> {s.marks} marks</span>
                </div>
              </div>
              <p className="mt-2 text-sm text-slate-400">
                {s.questions.length} question{s.questions.length === 1 ? "" : "s"}
                {s.instructions ? ` · ${s.instructions}` : ""}
              </p>
            </div>
          ))}
          <button
            type="button"
            onClick={() => void startPractice()}
            disabled={busy}
            className="w-full min-h-12 rounded-lg bg-amber-500 px-6 font-semibold text-slate-950 disabled:opacity-50 hover:bg-amber-400 transition-colors"
          >
            {busy ? "Starting…" : "Start practice session"}
          </button>
          <p className="text-xs text-slate-500 text-center">
            Sections advance in board order — once you move on, earlier sections lock (just like the real thing).
          </p>
        </div>
      )}

      {/* ---------- SECTION ---------- */}
      {phase === "section" && section && question && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-teal-300">
                {section.sectionName} · {section.questionType}
              </p>
              <p className="mt-1 text-sm text-slate-400">Question {questionProgress}</p>
            </div>
            {secondsLeft !== null && (
              <span
                className={`font-mono text-lg font-bold px-3 py-1.5 rounded-lg border tabular-nums ${
                  secondsLeft <= 300
                    ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                    : "border-slate-700 bg-slate-950 text-slate-100"
                }`}
              >
                {formatClock(secondsLeft)}
              </span>
            )}
          </div>

          {/* progress dots */}
          <div className="flex items-center gap-1.5" aria-label="Progress">
            {section.questions.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 flex-1 rounded-full ${
                  i < questionIndex ? "bg-emerald-500/70" : i === questionIndex ? "bg-amber-500" : "bg-slate-700"
                }`}
              />
            ))}
          </div>

          <article className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-5 md:p-6">
            <h2 className="text-lg font-semibold whitespace-pre-wrap">{question.questionText}</h2>

            {question.hint && !reveals[question.id] && (
              <div>
                <button
                  type="button"
                  onClick={() => setHintsOpen((p) => ({ ...p, [question.id]: !p[question.id] }))}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 border border-amber-500/30 bg-amber-500/10 rounded-full px-3 py-1.5"
                  aria-expanded={hintsOpen[question.id] ?? false}
                >
                  <Lightbulb className="w-3.5 h-3.5" /> Hint
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${hintsOpen[question.id] ? "rotate-180" : ""}`} />
                </button>
                {hintsOpen[question.id] && (
                  <p className="mt-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-sm text-amber-200">
                    {question.hint}
                  </p>
                )}
              </div>
            )}

            {section.questionType === "MCQ" ? (
              <div className="space-y-2">
                {question.options.map((option) => {
                  const reveal = reveals[question.id];
                  const picked = sectionAnswers[question.id] === option;
                  const isCorrectOption = reveal?.correctAnswer === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      disabled={Boolean(reveal) || busy}
                      onClick={() => void answerMcq(question, option)}
                      className={`flex w-full min-h-12 items-center gap-3 rounded-lg border px-4 text-left transition-colors disabled:cursor-default ${
                        reveal
                          ? isCorrectOption
                            ? "border-emerald-500/60 bg-emerald-500/10"
                            : picked
                              ? "border-rose-500/60 bg-rose-500/10"
                              : "border-slate-800"
                          : picked
                            ? "border-teal-500/60 bg-teal-500/10"
                            : "border-slate-700 hover:border-slate-500"
                      }`}
                    >
                      <span>{option}</span>
                      {reveal && isCorrectOption && <CheckCircle2 className="ml-auto w-5 h-5 text-emerald-400 shrink-0" />}
                      {reveal && picked && !isCorrectOption && <XCircle className="ml-auto w-5 h-5 text-rose-400 shrink-0" />}
                    </button>
                  );
                })}
                <div aria-live="polite">
                  {reveals[question.id] && (
                    <p className={`text-sm font-semibold ${reveals[question.id].isCorrect ? "text-emerald-300" : "text-rose-300"}`}>
                      {reveals[question.id].isCorrect
                        ? "You are right!"
                        : `The correct answer is ${reveals[question.id].correctAnswer}`}
                    </p>
                  )}
                </div>
                {reveals[question.id]?.explanation && (
                  <div>
                    <button
                      type="button"
                      onClick={() => setExplanationsOpen((p) => ({ ...p, [question.id]: !p[question.id] }))}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 border border-slate-700 rounded-full px-3 py-1.5 hover:border-slate-500"
                      aria-expanded={explanationsOpen[question.id] ?? false}
                    >
                      Why? <ChevronDown className={`w-3.5 h-3.5 transition-transform ${explanationsOpen[question.id] ? "rotate-180" : ""}`} />
                    </button>
                    {explanationsOpen[question.id] && (
                      <p className="mt-2 rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-slate-300">
                        {reveals[question.id].explanation}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-xs text-slate-400" htmlFor={`answer-${question.id}`}>
                  Type your answer — structure it the way the marker expects (definitions, lists, explanations).
                </label>
                <textarea
                  id={`answer-${question.id}`}
                  value={sectionAnswers[question.id] ?? ""}
                  onChange={(e) => setTypedAnswer(question.id, e.target.value)}
                  rows={8}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-4 text-sm leading-relaxed text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                  placeholder="Write your answer here…"
                />
                <p className="text-xs text-slate-500">
                  Your typed answers save with the session. The official marking scheme is revealed at the end for self-assessment.
                </p>
              </div>
            )}
          </article>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={questionIndex === 0}
              onClick={() => setQuestionIndex((i) => Math.max(0, i - 1))}
              className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 disabled:opacity-40 hover:border-slate-500"
            >
              Back
            </button>
            {questionIndex < section.questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setQuestionIndex((i) => i + 1)}
                disabled={busy}
                className="inline-flex items-center gap-2 min-h-11 rounded-lg bg-slate-800 border border-slate-700 px-5 font-semibold text-slate-100 hover:bg-slate-700 disabled:opacity-50"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void completeSection()}
                disabled={busy}
                className="inline-flex items-center gap-2 min-h-11 rounded-lg bg-amber-500 px-5 font-semibold text-slate-950 hover:bg-amber-400 disabled:opacity-50"
              >
                {busy ? "Saving…" : sectionIndex < sections.length - 1 ? "Complete section" : "Finish & submit"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* ---------- TRANSITION MODAL ---------- */}
      {phase === "transition" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-8 text-center space-y-5">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h2 className="text-xl font-serif font-bold">{section?.transitionMessage ?? "Section complete."}</h2>
            <p className="text-sm text-slate-400">
              Next up: {sections[sectionIndex + 1]?.sectionName ?? ""} — earlier sections are now locked.
            </p>
            <button
              type="button"
              onClick={advanceToNextSection}
              className="w-full min-h-12 rounded-lg bg-amber-500 px-6 font-semibold text-slate-950 hover:bg-amber-400"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* ---------- RESULTS ---------- */}
      {phase === "results" && breakdown && (
        <div className="space-y-5">
          <div className="rounded-xl border border-[#D4AF37]/30 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 p-6 space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Session complete — {topicTitle}</p>
            <p className="text-3xl font-serif font-bold text-[#D4AF37]">
              {breakdown.totalScore}/{breakdown.maxTotalScore} marks
            </p>
            <p className="text-sm text-slate-300">{breakdown.percentage}% overall (auto-scored sections)</p>
          </div>

          {breakdown.sections.map((s) => {
            const manifestSection = sections.find((x) => x.sectionId === s.sectionId);
            return (
              <div key={s.sectionId} className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-serif font-bold text-lg">{s.sectionName}</h3>
                  {s.score !== null ? (
                    <span className="text-sm text-slate-300">
                      {s.score}/{s.maxScore} correct
                    </span>
                  ) : (
                    <span className="text-xs text-amber-300 border border-amber-500/30 bg-amber-500/10 rounded-full px-2.5 py-1">
                      Self-assessment
                    </span>
                  )}
                </div>

                {s.modelAnswers && s.modelAnswers.length > 0 ? (
                  <div className="space-y-4">
                    {s.modelAnswers.map((ma) => {
                      const mq = manifestSection?.questions.find((q) => q.id === ma.questionId);
                      const yourAnswer = answers[s.sectionId]?.[ma.questionId];
                      const checked = selfChecked[ma.questionId] ?? [];
                      const aiMark = aiMarks[ma.questionId];
                      const aiError = aiErrors[ma.questionId];
                      return (
                        <div key={ma.questionId} className="space-y-3 rounded-lg border border-slate-800 bg-slate-950 p-4">
                          <p className="text-sm font-semibold text-slate-100">{mq?.questionText ?? ma.questionId}</p>
                          <div className="grid gap-2 text-sm">
                            <div className="rounded-lg border border-slate-700 bg-slate-900 p-3">
                              <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Your answer</p>
                              <p className="text-slate-300 whitespace-pre-wrap">{yourAnswer || "— not answered —"}</p>
                            </div>
                            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
                              <p className="text-xs uppercase tracking-wide text-emerald-400 mb-1">Model answer</p>
                              <p className="text-emerald-100/90 whitespace-pre-wrap">{ma.modelAnswer}</p>
                            </div>
                          </div>
                          {ma.markingPoints && ma.markingPoints.length > 0 ? (
                            <div className="space-y-2">
                              <p className="text-xs text-slate-400">Tick the points you covered:</p>
                              {ma.markingPoints.map((mp, idx) => (
                                <label key={idx} className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm cursor-pointer hover:border-slate-600">
                                  <input
                                    type="checkbox"
                                    checked={checked.includes(idx)}
                                    onChange={() => toggleSelfCheck(ma.questionId, idx)}
                                    className="h-4 w-4 accent-emerald-500"
                                  />
                                  <span className="text-slate-200">{mp.point}</span>
                                  <span className="ml-auto text-xs text-amber-400 font-semibold shrink-0">{mp.marks} mk</span>
                                </label>
                              ))}
                            </div>
                          ) : null}

                          {/* AI marking — grades your typed answer against the scheme */}
                          {aiMark === "loading" ? (
                            <p className="flex items-center gap-2 text-sm text-teal-300">
                              <Sparkles className="w-4 h-4 animate-pulse" /> Marking your answer with AI…
                            </p>
                          ) : aiMark ? (
                            <div className="space-y-2 rounded-lg border border-teal-500/30 bg-teal-500/5 p-3">
                              <p className="text-xs font-semibold uppercase tracking-wide text-teal-300">AI marking</p>
                              {aiMark.points.map((p) => (
                                <div key={p.index} className="flex items-start gap-2 text-sm">
                                  {p.awarded > 0 ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                  ) : (
                                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                                  )}
                                  <div>
                                    <span className="text-slate-200">{p.point}</span>
                                    <span className="ml-2 text-xs font-semibold text-amber-400">{p.awarded}/{p.maxMarks}</span>
                                    {p.reason && <p className="text-xs text-slate-400">{p.reason}</p>}
                                  </div>
                                </div>
                              ))}
                              <p className="text-sm font-bold text-emerald-300">
                                AI-awarded: {aiMark.totalAwarded} of {aiMark.maxTotal} marks
                              </p>
                              {aiMark.feedback && (
                                <p className="text-xs text-slate-300 border-t border-teal-500/20 pt-2">{aiMark.feedback}</p>
                              )}
                            </div>
                          ) : (
                            <div>
                              <button
                                type="button"
                                onClick={() => void markWithAi(s.sectionId, ma.questionId)}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-300 border border-teal-500/40 bg-teal-500/10 rounded-full px-3 py-1.5 hover:bg-teal-500/20 transition-colors"
                              >
                                <Sparkles className="w-3.5 h-3.5" /> Mark with AI
                              </button>
                              {aiError && (
                                <p className="mt-1 text-xs text-rose-300">{aiError}</p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <p className="text-sm text-slate-300">
                      Self-assessed marks for this section:{" "}
                      <span className="font-bold text-emerald-300">{selfAssessTotal(s.modelAnswers)}</span>
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">
                    {s.totalQuestions > 0
                      ? `${s.score ?? 0}/${s.maxScore} — answered ${s.answered} of ${s.totalQuestions}.`
                      : "No answers were saved for this section."}
                  </p>
                )}
              </div>
            );
          })}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 min-h-11 rounded-lg bg-amber-500 px-5 font-semibold text-slate-950 hover:bg-amber-400"
            >
              <RefreshCw className="w-4 h-4" /> Practice again
            </button>
            <Link
              href={`/highschool/practice/${boardSlug}`}
              className="inline-flex items-center gap-2 min-h-11 rounded-lg border border-slate-700 px-5 font-semibold text-slate-200 hover:border-slate-500"
            >
              More {boardName} topics <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
