"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useDomain } from "@/context/DomainContext";
import { DEFAULT_LEARNING_DOMAIN, type LearningDomain } from "@/lib/learning-domain";
import { SectionMark } from "@/components/logo/GnostiriLogo";
import {
  Swords,
  CalendarDays,
  CheckCircle2,
  Circle,
  BookOpen,
  HelpCircle,
  RotateCcw,
  ChevronRight,
  LogIn,
  GraduationCap,
  Sparkles,
  Crown,
} from "lucide-react";

interface MissionItem {
  subject: string;
  topic: string;
  topicId: string;
  subjectSlug: string;
  topicSlug: string;
  examCode: string;
  date: string;
  duration: number;
  priority: "high" | "medium" | "low";
  kind: "study" | "quiz";
  done: boolean;
}

interface UpcomingDay {
  date: string;
  items: MissionItem[];
}

const EXAMS = [{ code: "jamb", name: "JAMB" }];

const priorityStyle: Record<string, string> = {
  high: "bg-rose-500/10 text-rose-300 border-rose-500/30",
  medium: "bg-gold/10 text-amber-300 border-gold/30",
  low: "bg-teal-500/10 text-teal-300 border-teal-500/30",
};

/**
 * Study plan — one surface, strictly per lane (owner directive: the lane
 * toggles ONLY in the menu and Settings, never inline). High School gets the
 * rules-based countdown the app builds from the exam date and syllabus;
 * University gets the premium AI planner shell. The lane comes from the
 * session, so neither side is reachable from the other lane's UI.
 */
export default function BattlePlanPage() {
  const { user, loading } = useAuth();
  const { learningDomain } = useDomain();
  const lane: LearningDomain = learningDomain ?? DEFAULT_LEARNING_DOMAIN;

  // ── High School automated planner state ────────────────────────────────
  const [exam, setExam] = useState("jamb");
  const [examDate, setExamDate] = useState("");
  const [hasPlan, setHasPlan] = useState<boolean | null>(null);
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [total, setTotal] = useState(0);
  const [doneCount, setDoneCount] = useState(0);
  const [today, setToday] = useState<MissionItem[]>([]);
  const [upcoming, setUpcoming] = useState<UpcomingDay[]>([]);
  const [busy, setBusy] = useState(false);
  const [doneBusy, setDoneBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  // ── University AI planner inputs (shell) ─────────────────────────────────
  const [goal, setGoal] = useState("");
  const [uniExamDate, setUniExamDate] = useState("");
  const [courseLoad, setCourseLoad] = useState("");

  const load = useCallback(async (examCode: string) => {
    setError("");
    try {
      const res = await fetch(`/api/battle-plan?exam=${examCode}`);
      if (res.status === 401) {
        setHasPlan(null);
        return;
      }
      const data = await res.json();
      if (!data.plan) {
        setHasPlan(false);
        return;
      }
      setHasPlan(true);
      setDaysLeft(data.daysLeft);
      setTotal(data.total);
      setDoneCount(data.doneCount);
      setToday(data.today);
      setUpcoming(data.upcoming);
      if (data.plan.examDate) setExamDate(data.plan.examDate.slice(0, 10));
    } catch {
      setError("Could not load your study plan. Check your connection.");
    }
  }, []);

  useEffect(() => {
    if (!loading && user && lane === "highschool") void load(exam);
  }, [loading, user, exam, load, lane]);

  async function generate() {
    if (!examDate) {
      setError("Pick your exam date first.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/battle-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examCode: exam, examDate }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not build your plan");
      await load(exam);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not build your plan");
    } finally {
      setBusy(false);
    }
  }

  async function markDone(topicId: string) {
    setDoneBusy(topicId);
    try {
      const res = await fetch("/api/progress/mark-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: "highschool", topicId }),
      });
      if (!res.ok) throw new Error("Could not save");
      setToday((prev) => prev.filter((i) => i.topicId !== topicId));
      setDoneCount((c) => c + 1);
    } catch {
      setError("Could not save. Try again.");
    } finally {
      setDoneBusy(null);
    }
  }

  const examName = EXAMS.find((e) => e.code === exam)?.name ?? exam.toUpperCase();
  const progress = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  return (
    <main className="min-h-screen bg-transparent text-slate-100 px-5 py-8 md:p-10">
      <div className="mx-auto max-w-4xl space-y-8">
        <nav className="flex items-center gap-2 text-sm text-muted">
          <Link href="/" className="hover:text-electric-text transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            Home
          </Link>
          <ChevronRight className="w-4 h-4 text-slate-600" />
          <span className="text-slate-100 font-medium">Study plan</span>
        </nav>

        <header className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
            <SectionMark variant="battle" className="w-4 h-4 text-gold" />
            <span>Study plan</span>
          </div>
          <h1 className="gn-title-gradient font-serif text-3xl font-bold tracking-tight md:text-5xl">
            Study plan
          </h1>
        </header>

        {lane === "university" ? (
          <UniversityPlanner goal={goal} setGoal={setGoal} uniExamDate={uniExamDate} setUniExamDate={setUniExamDate} courseLoad={courseLoad} setCourseLoad={setCourseLoad} />
        ) : loading ? (
          <p className="text-slate-400">Loading…</p>
        ) : !user ? (
          <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-gold/30 bg-gold/10 p-6 sm:flex-row">
            <div className="flex items-center gap-3">
              <LogIn className="w-5 h-5 text-gold" />
              <p className="text-sm text-slate-200">Sign in to build your personal study plan.</p>
            </div>
            <Link
              href="/login"
              className="gn-btn-gold inline-flex min-h-[44px] items-center rounded-lg px-5 py-2.5 font-semibold text-sm transition-colors"
            >
              Sign In
            </Link>
          </div>
        ) : hasPlan === false || hasPlan === null ? (
          <section className="gn-card gn-lift space-y-6 p-6 md:p-8">
            <h2 className="text-xl font-bold">Automated countdown</h2>
            <p className="text-sm text-muted">
              Pick your exam date and we build a day-by-day checklist from the syllabus — automatically.
            </p>
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block text-sm text-muted">
                Exam
                <select
                  value={exam}
                  onChange={(e) => setExam(e.target.value)}
                  className="mt-2 block min-h-[48px] w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-slate-100"
                >
                  {EXAMS.map((e) => (
                    <option key={e.code} value={e.code}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm text-muted">
                Exam date
                <input
                  type="date"
                  value={examDate}
                  min={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="mt-2 block min-h-[48px] w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-slate-100"
                />
              </label>
            </div>
            <button
              type="button"
              onClick={() => void generate()}
              disabled={busy}
              className="gn-btn-gold inline-flex min-h-[48px] items-center gap-2 rounded-lg px-6 py-3 font-semibold text-sm transition-all disabled:opacity-50"
            >
              <Swords className="w-4 h-4" />
              {busy ? "Building your plan…" : "Generate study plan"}
            </button>
            {error && (
              <p role="alert" className="text-sm text-rose-300">
                {error}
              </p>
            )}
          </section>
        ) : (
          <div className="space-y-8">
            <section className="relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-900 p-6 md:p-8">
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <CalendarDays className="w-8 h-8 text-gold" />
                  <div>
                    <div className="font-serif text-3xl font-bold">
                      {daysLeft === null ? "—" : daysLeft === 0 ? "Today" : `${daysLeft} days`}
                    </div>
                    <div className="text-sm text-slate-400">
                      to {examName}
                      {examDate ? ` • ${examDate}` : ""}
                    </div>
                  </div>
                </div>
                <div className="sm:text-right">
                  <div className="text-2xl font-bold text-teal-300">{progress}%</div>
                  <div className="text-xs text-slate-400">
                    {doneCount} of {total} done
                  </div>
                </div>
              </div>
              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full bg-gold transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </section>

            {error && (
              <p role="alert" className="text-sm text-rose-300">
                {error}
              </p>
            )}

            <section className="space-y-4">
              <h2 className="flex items-center gap-2 text-xl font-bold">
                <CheckCircle2 className="w-5 h-5 text-gold" />
                Today&apos;s mission
              </h2>
              {today.length === 0 ? (
                <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-sm text-emerald-200">
                  <CheckCircle2 className="w-5 h-5" />
                  All clear. Today&apos;s missions are done — rest or revise.
                </div>
              ) : (
                today.map((item) => (
                  <div key={`${item.topicId}-${item.kind}`} className="gn-card gn-lift flex flex-col gap-4 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="text-xs text-muted">
                          {item.subject} • {item.kind === "quiz" ? "Practice" : "Study"} • {item.duration} min
                        </div>
                        <div className="font-semibold text-slate-100">{item.topic}</div>
                      </div>
                      <span className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${priorityStyle[item.priority]}`}>
                        {item.priority === "high" ? "Weak spot" : item.priority === "medium" ? "New" : "Review"}
                      </span>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Link
                        href={`/highschool/${item.examCode}/${item.subjectSlug}/${item.topicSlug}/study`}
                        className="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold transition-colors hover:bg-slate-700"
                      >
                        <BookOpen className="w-4 h-4 text-teal-300" />
                        Study
                      </Link>
                      <Link
                        href={`/highschool/${item.examCode}/${item.subjectSlug}/${item.topicSlug}/quiz`}
                        className="gn-btn-gold flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
                      >
                        <HelpCircle className="w-4 h-4" />
                        Quiz
                      </Link>
                      <button
                        type="button"
                        disabled={doneBusy === item.topicId}
                        onClick={() => void markDone(item.topicId)}
                        className="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-lg border border-emerald-500/30 px-4 py-2 text-sm font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/10 disabled:opacity-50"
                      >
                        <Circle className="w-4 h-4" />
                        {doneBusy === item.topicId ? "Saving…" : "Done"}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </section>

            {upcoming.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-bold">Coming up</h2>
                {upcoming.map((day) => (
                  <div key={day.date} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                    <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">{day.date}</div>
                    <ul className="space-y-2">
                      {day.items.map((item) => (
                        <li key={`${item.topicId}-${item.kind}`} className="flex items-center justify-between gap-3 text-sm text-slate-300">
                          <span className="truncate">
                            {item.subject} — {item.topic}
                          </span>
                          <span className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-semibold ${priorityStyle[item.priority]}`}>
                            {item.kind}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>
            )}

            <button
              type="button"
              onClick={() => setHasPlan(false)}
              className="inline-flex min-h-[44px] items-center gap-2 text-sm text-muted transition-colors hover:text-slate-200"
            >
              <RotateCcw className="w-4 h-4" />
              Rebuild with a new exam date
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

/**
 * University planner — the premium AI path. Foundation shell: capture the
 * inputs the AI needs (goal, exam date, course load) with an honest empty state
 * until generation is wired.
 */
function UniversityPlanner({
  goal,
  setGoal,
  uniExamDate,
  setUniExamDate,
  courseLoad,
  setCourseLoad,
}: {
  goal: string;
  setGoal: (v: string) => void;
  uniExamDate: string;
  setUniExamDate: (v: string) => void;
  courseLoad: string;
  setCourseLoad: (v: string) => void;
}) {
  const ready = goal.trim().length > 0 && uniExamDate.length > 0 && courseLoad.trim().length > 0;
  return (
    <div className="space-y-6">
      <section className="gn-card gn-lift space-y-5 p-6 md:p-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
          <Sparkles className="h-4 w-4 text-violet-200" aria-hidden />
          AI planner
        </div>
        <h2 className="font-serif text-xl font-bold">Tell the planner what you are preparing</h2>
        <div className="grid gap-5">
          <label className="block text-sm text-muted">
            Goal
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Cover all Year 1 anatomy before finals"
              className="mt-2 block min-h-[48px] w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-slate-100 placeholder:text-slate-500"
            />
          </label>
          <label className="block text-sm text-muted">
            Exam date
            <input
              type="date"
              value={uniExamDate}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setUniExamDate(e.target.value)}
              className="mt-2 block min-h-[48px] w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-slate-100"
            />
          </label>
          <label className="block text-sm text-muted">
            Course load
            <input
              type="text"
              value={courseLoad}
              onChange={(e) => setCourseLoad(e.target.value)}
              placeholder="e.g. Anatomy, Physiology, Biochemistry"
              className="mt-2 block min-h-[48px] w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-slate-100 placeholder:text-slate-500"
            />
          </label>
        </div>
        <button
          type="button"
          disabled={!ready}
          className="inline-flex min-h-[48px] items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-sm text-on-primary transition-colors hover:bg-primary-hover disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Crown className="w-4 h-4" aria-hidden />
          Generate AI plan
        </button>
      </section>

      <div className="rounded-2xl border border-line bg-surface/40 p-8 text-center">
        <GraduationCap className="mx-auto mb-3 h-8 w-8 text-electric-text" aria-hidden />
        <p className="text-sm text-muted">
          Your AI study plan will appear here. The University planner is being built — this shell captures
          your goals, dates and course load so the plan can be generated from them.
        </p>
      </div>
    </div>
  );
}