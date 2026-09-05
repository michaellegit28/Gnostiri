"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  ChevronRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  RotateCcw,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  LogIn,
  Check,
} from "lucide-react";

export interface QuestionItem {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty: string;
}

interface UserAnswerRecord {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  correctAnswer: string;
}

interface QuizClientProps {
  examCode: string;
  examName: string;
  subjectSlug: string;
  subjectTitle: string;
  topicSlug: string;
  topicTitle: string;
  topicId: string;
  initialQuestions: QuestionItem[];
}

export default function QuizClient({
  examCode,
  examName,
  subjectSlug,
  subjectTitle,
  topicSlug,
  topicTitle,
  topicId,
  initialQuestions,
}: QuizClientProps) {
  const { user } = useAuth();

  const [activeQuestions, setActiveQuestions] = useState<QuestionItem[]>(initialQuestions);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<UserAnswerRecord[]>([]);

  const [startTime, setStartTime] = useState<number>(() => Date.now());
  const [endTime, setEndTime] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const isSavingAttemptRef = useRef(false);

  // Restart/reset timer when starting quiz
  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  // Empty state if no questions
  if (initialQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
            <HelpCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-serif font-bold text-slate-100">No questions available yet</h2>
            <p className="text-slate-400 text-sm">
              Practice questions for &quot;{topicTitle}&quot; in {examName} {subjectTitle} are currently being added. Check back soon!
            </p>
          </div>
          <div>
            <Link
              href={`/highschool/${examCode}/${subjectSlug}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition-colors w-full"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to {subjectTitle}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = activeQuestions[currentIndex];
  const totalQuestions = activeQuestions.length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const handleSelectOption = (option: string) => {
    if (isSubmitted) return;
    setSelectedOption(option);
  };

  const handleSubmitQuestion = () => {
    if (!selectedOption || !currentQuestion || isSubmitted) return;

    const isCorrect = selectedOption.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase();
    const record: UserAnswerRecord = {
      questionId: currentQuestion.id,
      selectedAnswer: selectedOption,
      isCorrect,
      correctAnswer: currentQuestion.correctAnswer,
    };

    setUserAnswers((prev) => [...prev, record]);
    setIsSubmitted(true);
  };

  const persistAttempt = async (finalAnswers: UserAnswerRecord[], durationSec: number) => {
    if (isSavingAttemptRef.current) return;
    isSavingAttemptRef.current = true;
    setIsSaving(true);

    try {
      const correctCount = finalAnswers.filter((a) => a.isCorrect).length;
      const res = await fetch("/api/quiz/attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseUid: user?.uid,
          domain: "highschool",
          topicId,
          score: correctCount,
          maxScore: finalAnswers.length,
          answers: finalAnswers,
          durationSeconds: durationSec,
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
      }
    } catch (err) {
      console.error("Failed to persist quiz attempt:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      // Quiz finished
      const finishTime = Date.now();
      setEndTime(finishTime);
      setIsFinished(true);

      const durationSec = Math.max(1, Math.round((finishTime - startTime) / 1000));
      if (user) {
        persistAttempt(userAnswers, durationSec);
      }
    }
  };

  const handleRetryMissed = () => {
    // Find questions where the last attempt was wrong
    const wrongQuestionIds = new Set(
      userAnswers.filter((a) => !a.isCorrect).map((a) => a.questionId)
    );

    const missed = initialQuestions.filter((q) => wrongQuestionIds.has(q.id));
    if (missed.length > 0) {
      setActiveQuestions(missed);
      setCurrentIndex(0);
      setSelectedOption(null);
      setIsSubmitted(false);
      setUserAnswers([]);
      setStartTime(Date.now());
      setEndTime(null);
      setIsFinished(false);
      setIsSaving(false);
      setSaveSuccess(false);
      isSavingAttemptRef.current = false;
    }
  };

  // Format time (seconds to string)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  // Render End Screen if quiz is finished
  if (isFinished) {
    const score = userAnswers.filter((a) => a.isCorrect).length;
    const durationSeconds = endTime ? Math.max(1, Math.round((endTime - startTime) / 1000)) : 0;
    const accuracy = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    const isWeakTopic = accuracy < 60;

    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 p-6 md:p-12 flex flex-col items-center justify-center">
        <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-10 space-y-8 shadow-xl">
          {/* Header */}
          <div className="text-center space-y-3 border-b border-slate-800 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Quiz Completed</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-100">
              {topicTitle}
            </h1>
            <p className="text-slate-400 text-sm">{examName} • {subjectTitle}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 text-center">
              <div className="text-slate-400 text-xs uppercase font-semibold tracking-wider mb-1">
                Score
              </div>
              <div className="text-3xl font-bold text-amber-400">
                {score} / {totalQuestions}
              </div>
              <div className="text-xs text-slate-500 mt-1">{accuracy}% Accuracy</div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 text-center">
              <div className="text-slate-400 text-xs uppercase font-semibold tracking-wider mb-1">
                Time Taken
              </div>
              <div className="text-2xl font-bold text-slate-100 flex items-center justify-center gap-1.5 mt-1">
                <Clock className="w-5 h-5 text-teal-400" />
                <span>{formatTime(durationSeconds)}</span>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 text-center">
              <div className="text-slate-400 text-xs uppercase font-semibold tracking-wider mb-1">
                Status
              </div>
              <div className={`text-xl font-bold mt-1 ${accuracy >= 70 ? "text-emerald-400" : "text-rose-400"}`}>
                {accuracy >= 70 ? "Passed" : "Needs Review"}
              </div>
            </div>
          </div>

          {/* Weak Topics Analysis */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Topic Analysis
            </h2>
            {isWeakTopic ? (
              <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-4 flex items-start gap-3 text-rose-200">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-rose-300 text-sm">Weak Topic Identified</div>
                  <p className="text-xs text-rose-200/80 mt-1">
                    Your score on &quot;{topicTitle}&quot; is {accuracy}%. Review the lesson notes and try practice questions again to strengthen this topic.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 flex items-start gap-3 text-emerald-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-emerald-300 text-sm">Strong Performance</div>
                  <p className="text-xs text-emerald-200/80 mt-1">
                    Great job! You showed strong understanding of &quot;{topicTitle}&quot; with an accuracy of {accuracy}%.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* User Sign-In Banner / Save Status */}
          {!user ? (
            <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-amber-200">
              <div className="flex items-center gap-3">
                <LogIn className="w-5 h-5 text-amber-400 shrink-0" />
                <div className="text-xs md:text-sm text-slate-200">
                  <span className="font-semibold text-amber-400">Sign in to save your progress</span>
                  <p className="text-slate-400 text-xs">Track your accuracy and weak topics across all subjects.</p>
                </div>
              </div>
              <Link
                href="/highschool"
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors shrink-0"
              >
                Sign In
              </Link>
            </div>
          ) : (
            <div className="text-xs text-center text-slate-400 flex items-center justify-center gap-2">
              {isSaving ? (
                <span>Saving quiz results...</span>
              ) : saveSuccess ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <Check className="w-4 h-4" /> Progress saved to profile
                </span>
              ) : null}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-800">
            {score < totalQuestions && (
              <button
                onClick={handleRetryMissed}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retry Missed ({totalQuestions - score})</span>
              </button>
            )}

            <Link
              href={`/highschool/${examCode}/${subjectSlug}`}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition-colors"
            >
              <span>Back to {subjectTitle}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Active Question UI
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-4 md:p-8 flex flex-col justify-between max-w-4xl mx-auto">
      {/* Top Bar Navigation & Progress */}
      <div className="space-y-4">
        <nav className="flex items-center gap-2 text-xs md:text-sm text-slate-400">
          <Link href={`/highschool/${examCode}`} className="hover:text-amber-400 transition-colors">
            {examName}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <Link
            href={`/highschool/${examCode}/${subjectSlug}`}
            className="hover:text-amber-400 transition-colors"
          >
            {subjectTitle}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-200 font-medium truncate">{topicTitle}</span>
        </nav>

        {/* Progress Bar Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center justify-between sm:justify-start gap-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Question {currentIndex + 1} of {totalQuestions}
            </span>
            <span className="text-xs text-slate-500 bg-slate-800 px-2.5 py-1 rounded-md uppercase font-mono">
              {currentQuestion.difficulty}
            </span>
          </div>

          {/* Visual Progress Bar */}
          <div className="w-full sm:w-48 bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-amber-500 h-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <main className="my-6 space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-lg">
          <h2 className="text-xl md:text-2xl font-serif font-semibold text-slate-100 leading-relaxed">
            {currentQuestion.questionText}
          </h2>

          {/* Options Vertical Stack */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === option;

              let optionStyle =
                "bg-slate-950/80 border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-900";

              if (isSubmitted) {
                const isCorrectOpt = option.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase();
                const isUserChoice = isSelected;

                if (isCorrectOpt) {
                  optionStyle = "bg-emerald-500/15 border-emerald-500 text-emerald-300 font-semibold";
                } else if (isUserChoice && !isCorrectOpt) {
                  optionStyle = "bg-rose-500/15 border-rose-500 text-rose-300 font-semibold";
                } else {
                  optionStyle = "bg-slate-950/30 border-slate-800 text-slate-500 opacity-50";
                }
              } else if (isSelected) {
                optionStyle = "bg-amber-500/15 border-amber-500 text-amber-300 font-semibold";
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(option)}
                  disabled={isSubmitted}
                  className={`w-full min-h-[48px] py-3.5 px-5 rounded-xl border flex items-center justify-between text-left text-sm md:text-base transition-all duration-150 ${optionStyle}`}
                >
                  <span className="flex-1 pr-4">{option}</span>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected
                        ? "border-amber-400 bg-amber-400/20"
                        : "border-slate-700"
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-amber-400" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation Box (Visible after submit) */}
          {isSubmitted && (
            <div className="space-y-4 pt-4 border-t border-slate-800 animate-fadeIn">
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  selectedOption?.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase()
                    ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-200"
                    : "bg-rose-950/30 border-rose-500/40 text-rose-200"
                }`}
              >
                {selectedOption?.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase() ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-semibold text-sm">
                    {selectedOption?.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase()
                      ? "Correct!"
                      : "Incorrect"}
                  </div>
                  {currentQuestion.explanation && (
                    <p className="mt-1 text-xs md:text-sm text-slate-300 leading-relaxed">
                      {currentQuestion.explanation}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Action Navigation Footer */}
      <footer className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        {!isSubmitted ? (
          <div className="w-full flex justify-end">
            <button
              type="button"
              onClick={handleSubmitQuestion}
              disabled={!selectedOption}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-slate-950 font-semibold text-sm transition-colors"
            >
              Submit Answer
            </button>
          </div>
        ) : (
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Inert "Similar Question" button (Sprint 4 Tutor placeholder) */}
            <button
              type="button"
              disabled
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 text-slate-500 text-xs font-semibold cursor-not-allowed border border-slate-700/50 flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Similar Question (AI Tutor)</span>
            </button>

            <button
              type="button"
              onClick={handleNextQuestion}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>{currentIndex < totalQuestions - 1 ? "Next Question" : "View Results"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </footer>
    </div>
  );
}
