"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  GraduationCap,
  BookOpen,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  History,
  ArrowRight,
  LogIn,
  Loader2,
  BarChart3,
} from "lucide-react";

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

export default function ProgressPage() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<"highschool" | "university" | "extras">("highschool");

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFetching(true);
      setError(null);

      fetch(`/api/progress/dashboard?domain=${activeTab}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load progress data");
          return res.json();
        })
        .then((data: DashboardData) => {
          setDashboardData(data);
        })
        .catch((err) => {
          console.error("Error fetching progress dashboard:", err);
          setError("Could not load progress data. Please try again later.");
        })
        .finally(() => {
          setFetching(false);
        });
    }
  }, [user, activeTab]);

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

  // 1. Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-transparent text-slate-50 flex items-center justify-center p-6">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated state
  if (!user) {
    return (
      <div className="min-h-screen bg-transparent text-slate-50 p-6 md:p-12 flex items-center justify-center">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
            <LogIn className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-serif font-bold text-slate-100">Sign in required</h1>
            <p className="text-slate-400 text-sm">
              Please sign in to view your personalized learning progress, weak topics analysis, and quiz attempt history.
            </p>
          </div>
          <div>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition-colors w-full"
            >
              <span>Sign in or create an account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-slate-800 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold mb-3">
            <BarChart3 className="w-4 h-4" />
            <span>Progress Analytics</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-100 tracking-tight">
            Learning Progress
          </h1>
          <p className="mt-2 text-slate-400 text-base max-w-2xl">
            Track your accuracy across topics, target weak areas for review, and inspect recent quiz attempts.
          </p>
        </div>

        {/* Domain Switcher Tabs */}
        <div className="flex border-b border-slate-800 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("highschool")}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "highschool"
                ? "border-amber-500 text-amber-400 bg-amber-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>High School</span>
          </button>

          <button
            onClick={() => setActiveTab("university")}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "university"
                ? "border-amber-500 text-amber-400 bg-amber-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>University</span>
          </button>

          <button
            onClick={() => setActiveTab("extras")}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "extras"
                ? "border-amber-500 text-amber-400 bg-amber-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Extras</span>
          </button>
        </div>

        {/* Domain dashboard */}
        {
          <div className="space-y-10">
            {fetching ? (
              <div className="flex items-center justify-center py-12 text-slate-400 gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                <span>Loading your High School performance data...</span>
              </div>
            ) : error ? (
              <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-300 text-sm">
                {error}
              </div>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-800 bg-slate-900 p-5"><p className="text-sm text-slate-400">Current streak</p><p className="mt-2 text-3xl font-bold text-amber-400">{dashboardData?.streak || 0} days</p></div>
                  <div className="rounded-xl border border-slate-800 bg-slate-900 p-5"><p className="text-sm text-slate-400">Today’s plan</p>{dashboardData?.studyPlan ? <div className="mt-2"><p className="font-semibold">{dashboardData.studyPlan.items.length} study items</p><Link href="/study-plan" className="text-sm text-teal-300 underline">Edit plan</Link></div> : <Link href="/study-plan" className="mt-2 inline-block text-teal-300 underline">Create a study plan</Link>}</div>
                </div>
                {/* Weak & Strong Topics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Weak Topics Card */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center gap-2.5 text-rose-400">
                      <AlertTriangle className="w-5 h-5 shrink-0" />
                      <h2 className="text-lg font-serif font-semibold text-slate-100">
                        Weak Topics (&lt; 60% Accuracy)
                      </h2>
                    </div>

                    {!dashboardData?.weakTopics || dashboardData.weakTopics.length === 0 ? (
                      <p className="text-slate-400 text-sm italic py-4">
                        No weak topics identified yet. Keep taking quizzes to track areas for improvement!
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
                              <span className="text-sm font-bold text-rose-400">
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
                    <div className="flex items-center gap-2.5 text-emerald-400">
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                      <h2 className="text-lg font-serif font-semibold text-slate-100">
                        Strong Topics (&ge; 85% Accuracy)
                      </h2>
                    </div>

                    {!dashboardData?.strongTopics || dashboardData.strongTopics.length === 0 ? (
                      <p className="text-slate-400 text-sm italic py-4">
                        No strong topics identified yet. Complete quizzes with 85%+ accuracy to see your strengths here!
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
                              <span className="text-sm font-bold text-emerald-400">
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
                  <div className="flex items-center gap-2.5 text-amber-400">
                    <History className="w-5 h-5 shrink-0" />
                    <h2 className="text-lg font-serif font-semibold text-slate-100">
                      Recent Quiz Attempts
                    </h2>
                  </div>

                  {dashboardData?.recentAttempts?.length ? (
                    <div aria-label="Recent quiz accuracy chart" className="flex h-36 items-end gap-3 overflow-x-auto border-b border-slate-800 px-2 pb-2">
                      {dashboardData.recentAttempts.slice(0, 7).reverse().map((attempt) => (
                        <div key={attempt.id} className="flex h-full min-w-12 flex-col items-center justify-end gap-1">
                          <span className="text-[10px] text-slate-400">{attempt.accuracy}%</span>
                          <div className="w-8 rounded-t bg-amber-500" style={{ height: `${Math.max(4, attempt.accuracy)}%` }} title={`${attempt.topicTitle}: ${attempt.accuracy}%`} />
                          <span className="max-w-16 truncate text-[10px] text-slate-500">{attempt.topicTitle}</span>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {!dashboardData?.recentAttempts || dashboardData.recentAttempts.length === 0 ? (
                    <p className="text-slate-400 text-sm italic py-4">
                      No quiz attempts recorded yet. Start practicing from any topic page to build your history!
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
                                    attempt.accuracy >= 70 ? "text-emerald-400" : "text-rose-400"
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
        }
      </div>
    </div>
  );
}
