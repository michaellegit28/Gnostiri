"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  History,
} from "lucide-react";
import StatCard from "@/components/ui/StatCard";

interface TopicSummary {
  topicId: string;
  topicTitle: string;
  subjectTitle?: string;
  examCode?: string;
  accuracy: number;
  status: string;
  lastStudied: string;
}

interface QuizAttemptSummary {
  id: string;
  topicId: string;
  topicTitle: string;
  score: number;
  maxScore: number;
  accuracy: number;
  durationSeconds: number;
  createdAt: string;
}

interface DashboardData {
  weakTopics: TopicSummary[];
  strongTopics: TopicSummary[];
  recentAttempts: QuizAttemptSummary[];
  streak?: number;
  studyPlan?: { id: string; examDate: string | null; items: PlanItem[]; generatedBy: string } | null;
}

interface PlanItem { subject: string; topic: string; duration: number; priority: string }

/**
 * The interactive half of /progress: lane tabs (High School / University /
 * Extras) and the per-lane accuracy detail. The server shell above it owns
 * the header, the stat chips, the league and achievements surfaces — this
 * component only handles the lane-filtered tables.
 */
export default function ProgressDashboard() {
  const [activeTab, setActiveTab] = useState<"highschool" | "university" | "extras">("highschool");

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [fetching, setFetching] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setFetching(true);
    setError(null);

    fetch(`/api/progress/dashboard?domain=${activeTab}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load progress data");
        return res.json();
      })
      .then((data: DashboardData) => {
        if (!cancelled) setDashboardData(data);
      })
      .catch((err) => {
        console.error("Error fetching progress dashboard:", err);
        if (!cancelled) setError("Could not load progress data. Please try again later.");
      })
      .finally(() => {
        if (!cancelled) setFetching(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeTab, retryKey]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-10">
      {/* Domain Switcher Tabs — progress is split per lane */}
      <div role="region" aria-label="Progress sections" tabIndex={0} className="flex border-b border-slate-800 gap-2 overflow-x-auto">
        <button
          type="button"
          aria-pressed={activeTab === "highschool"}
          onClick={() => setActiveTab("highschool")}
          className={`flex min-h-[48px] items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === "highschool"
              ? "border-gold text-gold bg-gold/5"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>High School</span>
        </button>

        <button
          type="button"
          aria-pressed={activeTab === "university"}
          onClick={() => setActiveTab("university")}
          className={`flex min-h-[48px] items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === "university"
              ? "border-gold text-gold bg-gold/5"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>University</span>
        </button>

        <button
          type="button"
          aria-pressed={activeTab === "extras"}
          onClick={() => setActiveTab("extras")}
          className={`flex min-h-[48px] items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === "extras"
              ? "border-gold text-gold bg-gold/5"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Extras</span>
        </button>
      </div>

      {/* Lane dashboard */}
      <div className="space-y-10">
        {fetching ? (
          <div role="status" aria-busy="true" aria-label="Loading performance data" className="space-y-4">
            <div className="h-64 animate-pulse rounded-2xl border border-white/10 bg-white/[0.04]" />
            <p className="sr-only">Loading your {activeTab === "highschool" ? "High School" : activeTab === "university" ? "University" : "Extras"} performance data…</p>
          </div>
        ) : error ? (
          <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 text-sm flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <p role="alert" className="text-red-300">{error}</p>
            <button
              type="button"
              onClick={() => setRetryKey((k) => k + 1)}
              className="inline-flex min-h-[48px] shrink-0 items-center justify-center rounded-lg border border-slate-600 bg-slate-800/30 px-5 py-2.5 font-semibold text-slate-300 transition-colors hover:border-slate-400 hover:text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <dl className="grid gap-4 sm:grid-cols-2">
              <StatCard
                label="Current streak"
                value={`${dashboardData?.streak || 0} days`}
                accent="gold"
              />
              <StatCard label="Today’s plan" value="" accent="teal">
                {dashboardData?.studyPlan ? (
                  <span className="mt-1 block">
                    <span className="block font-sans text-sm font-semibold text-slate-100">
                      {dashboardData.studyPlan.items.length} study items
                    </span>
                    <Link href="/study-plan" className="text-sm text-slate-400 underline">
                      Edit plan
                    </Link>
                  </span>
                ) : (
                  <Link href="/study-plan" className="mt-1 inline-block text-sm text-slate-400 underline">
                    Create a study plan
                  </Link>
                )}
              </StatCard>
            </dl>
            {/* Weak & Strong Topics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Weak Topics Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2.5 text-slate-400">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <h2 className="text-lg font-serif font-semibold text-slate-100">
                    Weak Topics (&lt; 60% Accuracy)
                  </h2>
                </div>

                {!dashboardData?.weakTopics || dashboardData.weakTopics.length === 0 ? (
                  <p className="text-slate-400 text-sm italic py-4">
                    No weak topics yet. Take more quizzes and they will show up here.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {dashboardData.weakTopics.map((item) => (
                      <div
                        key={item.topicId}
                        className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between gap-4"
                      >
                        <div>
                          <h3 className="font-semibold text-slate-200 text-sm">
                            {item.topicTitle}
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {item.subjectTitle || "High School"}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-sm font-bold text-slate-400">
                            {Math.round(item.accuracy * 100)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Strong Topics Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2.5 text-slate-400">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <h2 className="text-lg font-serif font-semibold text-slate-100">
                    Strong Topics (&ge; 85% Accuracy)
                  </h2>
                </div>

                {!dashboardData?.strongTopics || dashboardData.strongTopics.length === 0 ? (
                  <p className="text-slate-400 text-sm italic py-4">
                    No strong topics yet. Score 85% or higher in a quiz and it lands here.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {dashboardData.strongTopics.map((item) => (
                      <div
                        key={item.topicId}
                        className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between gap-4"
                      >
                        <div>
                          <h3 className="font-semibold text-slate-200 text-sm">
                            {item.topicTitle}
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {item.subjectTitle || "High School"}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-sm font-bold text-slate-400">
                            {Math.round(item.accuracy * 100)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Quiz Attempts List */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2.5 text-gold">
                <History className="w-5 h-5 shrink-0" />
                <h2 className="text-lg font-serif font-semibold text-slate-100">
                  Recent Quiz Attempts
                </h2>
              </div>

              {dashboardData?.recentAttempts?.length ? (
                <div aria-hidden="true" className="flex h-36 items-end gap-3 overflow-x-auto border-b border-slate-800 px-2 pb-2">
                  {dashboardData.recentAttempts.slice(0, 7).reverse().map((attempt) => (
                    <div key={attempt.id} className="flex h-full min-w-12 flex-col items-center justify-end gap-1">
                      <span className="text-[11px] text-slate-400">{attempt.accuracy}%</span>
                      <div className="w-8 rounded-t bg-gold" style={{ height: `${Math.max(4, attempt.accuracy)}%` }} title={`${attempt.topicTitle}: ${attempt.accuracy}%`} />
                      <span className="max-w-16 truncate text-[11px] text-slate-400">{attempt.topicTitle}</span>
                    </div>
                  ))}
                </div>
              ) : null}

              {!dashboardData?.recentAttempts || dashboardData.recentAttempts.length === 0 ? (
                <p className="text-slate-400 text-sm italic py-4">
                  No quiz attempts yet. Practice from any topic page to build your history.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        <th className="py-3 px-4">Topic</th>
                        <th className="py-3 px-4">Score</th>
                        <th className="py-3 px-4">Accuracy</th>
                        <th className="py-3 px-4">Duration</th>
                        <th className="py-3 px-4 text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-sm">
                      {dashboardData.recentAttempts.map((attempt) => (
                        <tr key={attempt.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3.5 px-4 font-medium text-slate-200">
                            {attempt.topicTitle}
                          </td>
                          <td className="py-3.5 px-4 text-slate-300">
                            {attempt.score} / {attempt.maxScore}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`font-semibold ${
                                attempt.accuracy >= 70 ? "text-slate-100" : "text-slate-400"
                              }`}
                            >
                              {attempt.accuracy}%
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-400 flex items-center gap-1.5 pt-4">
                            <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <span>{formatDuration(attempt.durationSeconds)}</span>
                          </td>
                          <td className="py-3.5 px-4 text-right text-slate-400 text-xs">
                            {formatDate(attempt.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}