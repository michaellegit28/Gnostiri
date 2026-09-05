"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { LessonContent, LessonBlock } from "@/types/lesson";
import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  BookOpen,
  CheckCircle,
  HelpCircle,
  MessageSquare,
  Info,
  AlertTriangle,
  Sparkles,
  List,
  Check,
} from "lucide-react";

interface TopicItem {
  id: string;
  slug: string;
  title: string;
}

interface StudyReaderClientProps {
  examCode: string;
  examName: string;
  subjectSlug: string;
  subjectTitle: string;
  topicSlug: string;
  topicTitle: string;
  topics: TopicItem[];
  lessonContent: LessonContent | null;
}

export default function StudyReaderClient({
  examCode,
  examName,
  subjectSlug,
  subjectTitle,
  topicSlug,
  topicTitle,
  topics,
  lessonContent,
}: StudyReaderClientProps) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  const [isCompleted, setIsCompleted] = useState(false);
  const [isMarking, setIsMarking] = useState(false);

  const fullTopicId = `${examCode}-${subjectSlug}-${topicSlug}`;

  const handleMarkComplete = async () => {
    if (isCompleted || isMarking) return;
    setIsMarking(true);

    try {
      if (user) {
        const res = await fetch("/api/progress/mark-complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firebaseUid: user.uid,
            domain: "highschool",
            topicId: fullTopicId,
          }),
        });
        if (res.ok) {
          setIsCompleted(true);
        }
      } else {
        // Unauthenticated fallback local state
        setIsCompleted(true);
      }
    } catch (err) {
      console.error("Failed to mark complete:", err);
    } finally {
      setIsMarking(false);
    }
  };

  const renderBlock = (block: LessonBlock, index: number) => {
    switch (block.type) {
      case "heading":
        if (block.level === 2) {
          return (
            <h2
              key={index}
              className="font-serif text-2xl md:text-3xl font-bold text-slate-100 mt-8 mb-4 border-b border-slate-800 pb-2"
            >
              {block.text}
            </h2>
          );
        }
        return (
          <h3
            key={index}
            className="font-serif text-xl md:text-2xl font-semibold text-amber-400 mt-6 mb-3"
          >
            {block.text}
          </h3>
        );

      case "paragraph":
        return (
          <p
            key={index}
            className="text-slate-300 font-sans text-base md:text-lg leading-[1.6] my-4"
          >
            {block.text}
          </p>
        );

      case "definition":
        return (
          <div
            key={index}
            className="border border-amber-500/30 bg-amber-950/20 rounded-xl p-5 my-6 shadow-sm"
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-500 mb-1">
              Definition
            </div>
            <div className="font-bold text-amber-400 text-lg mb-2">{block.term}</div>
            <div className="text-slate-300 leading-relaxed">{block.text}</div>
          </div>
        );

      case "example":
        return (
          <div
            key={index}
            className="border-l-4 border-teal-500 bg-teal-950/20 rounded-r-xl p-5 my-6 shadow-sm"
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-teal-400 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Example</span>
            </div>
            <div className="text-slate-200 leading-relaxed">{block.text}</div>
          </div>
        );

      case "callout":
        if (block.variant === "info") {
          return (
            <div
              key={index}
              className="border border-blue-500/30 bg-blue-950/20 text-blue-200 rounded-xl p-5 my-6 flex items-start gap-3"
            >
              <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1">
                  Info
                </div>
                <div className="leading-relaxed text-slate-200">{block.text}</div>
              </div>
            </div>
          );
        }
        return (
          <div
            key={index}
            className="border border-amber-500/30 bg-amber-950/20 text-amber-200 rounded-xl p-5 my-6 flex items-start gap-3"
          >
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
                Warning
              </div>
              <div className="leading-relaxed text-slate-200">{block.text}</div>
            </div>
          </div>
        );

      case "table":
        return (
          <div key={index} className="overflow-x-auto my-6 rounded-xl border border-slate-800">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-900 border-b border-slate-800">
                <tr>
                  {block.headers.map((header, hIdx) => (
                    <th
                      key={hIdx}
                      className="p-3 text-sm font-semibold text-slate-200 border-r border-slate-800 last:border-r-0"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {block.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-900/50">
                    {row.map((cell, cIdx) => (
                      <td
                        key={cIdx}
                        className="p-3 text-sm text-slate-300 border-r border-slate-800 last:border-r-0"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return null;
    }
  };

  const hasBlocks = lessonContent && Array.isArray(lessonContent.blocks) && lessonContent.blocks.length > 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col pb-24 md:pb-28">
      {/* Top Header / Nav */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 px-4 py-3 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Breadcrumbs: Exam > Subject > Topic */}
          <nav className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-slate-400 overflow-x-auto py-1">
            <Link
              href={`/highschool/${examCode}`}
              className="hover:text-amber-400 transition-colors whitespace-nowrap"
            >
              {examName}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <Link
              href={`/highschool/${examCode}/${subjectSlug}`}
              className="hover:text-amber-400 transition-colors whitespace-nowrap"
            >
              {subjectTitle}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <span className="text-slate-100 font-medium truncate max-w-[150px] sm:max-w-xs">
              {topicTitle}
            </span>
          </nav>

          {/* Sidebar Toggle for Desktop */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden md:flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            <span>{sidebarOpen ? "Hide Syllabus" : "Show Syllabus"}</span>
          </button>
        </div>
      </header>

      {/* Mobile Dropdown TOC */}
      <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-3">
        <button
          onClick={() => setMobileTocOpen(!mobileTocOpen)}
          className="flex items-center justify-between w-full text-sm font-medium text-slate-200 bg-slate-800/80 rounded-lg px-3.5 py-2"
        >
          <div className="flex items-center gap-2">
            <List className="w-4 h-4 text-amber-500" />
            <span>Topic: {topicTitle}</span>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform ${mobileTocOpen ? "rotate-180" : ""}`} />
        </button>

        {mobileTocOpen && (
          <div className="mt-2 py-2 bg-slate-900 rounded-lg border border-slate-800 max-h-60 overflow-y-auto space-y-1">
            {topics.map((t) => {
              const isActive = t.slug === topicSlug;
              return (
                <Link
                  key={t.id}
                  href={`/highschool/${examCode}/${subjectSlug}/${t.slug}/study`}
                  onClick={() => setMobileTocOpen(false)}
                  className={`block px-4 py-2 text-sm rounded-md transition-colors ${
                    isActive
                      ? "bg-amber-500/10 text-amber-400 font-semibold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  {t.title}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 md:px-8 py-6 gap-8">
        {/* Desktop Left Sidebar TOC */}
        {sidebarOpen && (
          <aside className="hidden md:block w-72 shrink-0 border-r border-slate-800 pr-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-500 uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>{subjectTitle} Topics</span>
            </div>
            <nav className="space-y-1">
              {topics.map((t) => {
                const isActive = t.slug === topicSlug;
                return (
                  <Link
                    key={t.id}
                    href={`/highschool/${examCode}/${subjectSlug}/${t.slug}/study`}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all ${
                      isActive
                        ? "bg-amber-500/10 text-amber-400 font-semibold border-l-2 border-amber-500"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                    }`}
                  >
                    <span className="truncate">{t.title}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
        )}

        {/* Content Area */}
        <main className="flex-1 max-w-3xl mx-auto w-full">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-100 tracking-tight">
              {topicTitle}
            </h1>
          </div>

          {hasBlocks ? (
            <div className="space-y-2">
              {lessonContent!.blocks.map((block, idx) => renderBlock(block, idx))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/50 p-8">
              <BookOpen className="w-12 h-12 text-slate-600 mb-4" />
              <h3 className="text-xl font-semibold font-serif text-slate-200 mb-2">
                Content coming soon
              </h3>
              <p className="text-slate-400 max-w-md text-sm">
                Study notes and structured lesson content for &quot;{topicTitle}&quot; are currently being prepared for {examName}.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Floating Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 p-3 md:p-4 z-40">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-2 md:gap-4">
          <button
            type="button"
            onClick={handleMarkComplete}
            disabled={isCompleted || isMarking}
            className={`flex-1 inline-flex items-center justify-center gap-1.5 md:gap-2 px-3 py-2.5 rounded-lg font-semibold text-xs md:text-sm transition-colors ${
              isCompleted
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
            }`}
          >
            {isCompleted ? <Check className="w-4 h-4 shrink-0" /> : <CheckCircle className="w-4 h-4 shrink-0" />}
            <span className="truncate">{isCompleted ? "Completed ✓" : isMarking ? "Saving..." : "Mark Complete"}</span>
          </button>

          <Link
            href={`/highschool/${examCode}/${subjectSlug}/${topicSlug}/quiz`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 md:gap-2 px-3 py-2.5 rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 font-semibold text-xs md:text-sm transition-colors text-center"
          >
            <HelpCircle className="w-4 h-4 shrink-0" />
            <span className="truncate">Practice Questions</span>
          </Link>

          <button
            type="button"
            className="flex-1 inline-flex items-center justify-center gap-1.5 md:gap-2 px-3 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs md:text-sm transition-colors border border-slate-700 opacity-80"
          >
            <MessageSquare className="w-4 h-4 shrink-0 text-teal-400" />
            <span className="truncate">Ask Tutor</span>
          </button>
        </div>
      </div>
    </div>
  );
}
