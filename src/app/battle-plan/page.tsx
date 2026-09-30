"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
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

const EXAMS = [
  { code: "waec", name: "WAEC" },
  { code: "jamb", name: "JAMB" },
  { code: "neco", name: "NECO" },
];

const priorityStyle: Record<string, string> = {
  high: "bg-rose-500/10 text-rose-300 border-rose-500/30",
  medium: "bg-amber-500/10 text-amber-300 border-amber-500/30",
  low: "bg-teal-500/10 text-teal-300 border-teal-500/30",
};

export default function BattlePlanPage() {
  const { user, loading } = useAuth();
  const [exam, setExam] = useState("waec");
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
      setError("Could not load your battle plan. Check your connection.");
    }
  }, []);

  useEffect(() => {
    if (!loading && user) void load(exam);
  }, [loading, user, exam, load]);

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
    <main className="min-h-screen bg-transparent text-slate-100 p-6 md:p-12">
      <div className="mx-auto max-w-4xl space-y-8">
        <nav className="flex items-center gap-2 text-sm text-slate-400">
          <Link href="/highschool" className="hover:text-amber-400 transition-colors">
            High School
          </Link>
          <ChevronRight className="w-4 h-4 text-slate-600" />
          <span className="text-slate-100 font-medium">Battle Plan</span>
        </nav>

        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-semibold border border-[#D4AF37]/30">
            <Swords className="w-4 h-4" />
            <span>Exam Battle Plan</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tight">
            Your mission to {examName}
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl">
            Pick your exam date. We turn the real syllabus into a day-by-day mission —
            weak topics first, everything else in order.
          </p>
        </header>

        {loading ? (
          <p className="text-slate-400">Loading…</p>
        ) : !user ? (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <LogIn className="w-5 h-5 text-amber-400" />
              <p className="text-sm text-slate-200">Sign in to build your personal battle plan.</p>
            </div>
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-lg bg-[#D4AF37] text-slate-950 font-semibold text-sm hover:bg-[#c3a030] transition-colors"
            >
              Sign In
            </Link>
          </div>
        ) : hasPlan === false || hasPlan === null ? (
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8 space-y-5">
            <h2 className="text-xl font-bold">Build my plan</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm text-slate-300">
                Exam
                <select
                  value={exam}
                  onChange={(e) => setExam(e.target.value)}
                  className="mt-2 block min-h-[48px] w-full rounded-lg border border-slate-700 bg-slate-950 px-3"
                >
                  {EXAMS.map((e) => (
                    <option key={e.code} value={e.code}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm text-slate-300">
                Exam date
                <input
                  type="date"
                  value={examDate}
                  min={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="mt-2 block min-h-[48px] w-full rounded-lg border border-slate-700 bg-slate-950 px-3"
                />
              </label>
            </div>
            <button
              type="button"
              onClick={() => void generate()}
              disabled={busy}
              className="inline-flex items-center gap-2 min-h-[48px] px-6 py-3 rounded-lg bg-[#D4AF37] text-slate-950 font-semibold text-sm hover:bg-[#c3a030] transition-colors disabled:opacity-50"
            >
              <Swords className="w-4 h-4" />
              {busy ? "Building your mission…" : "Generate Battle Plan"}
            </button>
            {error && (
              <p role="alert" className="text-sm text-rose-300">
                {error}
              </p>
            )}
          </section>
        ) : (
          <div className="space-y-8">
            {/* Countdown + progress */}
            <section className="relative overflow-hidden rounded-2xl border border-[#D4AF37]/30 bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-900 p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <CalendarDays className="w-8 h-8 text-[#D4AF37]" />
                  <div>
                    <div className="text-3xl font-serif font-bold">
                      {daysLeft === null ? "—" : daysLeft === 0 ? "Today!" : `${daysLeft} days`}
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
                    {doneCount} of {total} missions done
                  </div>
                </div>
              </div>
              <div className="mt-4 h-2.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-[#D4AF37] transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </section>

            {error && (
              <p role="alert" className="text-sm text-rose-300">
                {error}
              </p>
            )}

            {/* Today's mission */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
                Today&apos;s mission
              </h2>
              {today.length === 0 ? (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-sm text-emerald-200 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5" />
                  All clear. Today&apos;s missions are done — rest or revise.
                </div>
              ) : (
                today.map((item) => (
                  <div
                    key={`${item.topicId}-${item.kind}`}
                    className="rounded-xl border border-slate-800 bg-slate-900 p-5 flex flex-col gap-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs text-slate-500">
                          {item.subject} • {item.kind === "quiz" ? "Practice" : "Study"} •{" "}
                          {item.duration} min
                        </div>
                        <div className="font-semibold text-slate-100 mt-1">{item.topic}</div>
                      </div>
                      <span
                        className={`shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${priorityStyle[item.priority]}`}
                      >
                        {item.priority === "high"
                          ? "Weak spot"
                          : item.priority === "medium"
                            ? "New"
                            : "Review"}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Link
                        href={`/highschool/${item.examCode}/${item.subjectSlug}/${item.topicSlug}/study`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm font-semibold transition-colors"
                      >
                        <BookOpen className="w-4 h-4 text-teal-300" />
                        Study
                      </Link>
                      <Link
                        href={`/highschool/${item.examCode}/${item.subjectSlug}/${item.topicSlug}/quiz`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2 rounded-lg bg-[#D4AF37] hover:bg-[#c3a030] text-slate-950 text-sm font-semibold transition-colors"
                      >
                        <HelpCircle className="w-4 h-4" />
                        Quiz
                      </Link>
                      <button
                        type="button"
                        disabled={doneBusy === item.topicId}
                        onClick={() => void markDone(item.topicId)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2 rounded-lg border border-emerald-500/30 text-emerald-300 text-sm font-semibold hover:bg-emerald-500/10 transition-colors disabled:opacity-50"
                      >
                        <Circle className="w-4 h-4" />
                        {doneBusy === item.topicId ? "Saving…" : "Done"}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </section>

            {/* Upcoming */}
            {upcoming.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-bold">Coming up</h2>
                {upcoming.map((day) => (
                  <div
                    key={day.date}
                    className="rounded-xl border border-slate-800 bg-slate-900/60 p-5"
                  >
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                      {day.date}
                    </div>
                    <ul className="space-y-2">
                      {day.items.map((item) => (
                        <li
                          key={`${item.topicId}-${item.kind}`}
                          className="text-sm text-slate-300 flex items-center justify-between gap-3"
                        >
                          <span className="truncate">
                            {item.subject} — {item.topic}
                          </span>
                          <span
                            className={`shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${priorityStyle[item.priority]}`}
                          >
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
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
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
