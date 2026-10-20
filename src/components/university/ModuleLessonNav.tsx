"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { BookOpen, CheckCircle2, ChevronDown, Clock, CircleDashed } from "lucide-react";

/**
 * ModuleLessonNav — the course → module → lesson spine of a course page.
 *
 * One disclosure section per module, each lesson a real link (so it is
 * keyboard-navigable by default), with progress and placeholders visible
 * before a lesson is opened. Module headers use a roving tabindex, so Arrow
 * Up/Down/Home/End move between them and Enter or Space toggles the section.
 */

export interface NavLesson {
  id: string;
  title: string;
  orderIndex: number;
  estimatedMinutes: number;
  /** true for a tracked placeholder lesson that has not been authored yet. */
  needsCheck: boolean;
}

export interface NavModule {
  id: string;
  title: string;
  orderIndex: number;
  lessons: NavLesson[];
}

interface ModuleLessonNavProps {
  courseSlug: string;
  modules: NavModule[];
  /** Lessons that belong to no module, kept as a trailing "Further lessons" group. */
  orphanLessons?: NavLesson[];
  completedLessonIds?: string[];
  currentLessonId?: string;
  /** Open this module first (the one holding the current or next lesson). */
  defaultOpenModuleId?: string | null;
}

export default function ModuleLessonNav({
  courseSlug,
  modules,
  orphanLessons = [],
  completedLessonIds = [],
  currentLessonId,
  defaultOpenModuleId,
}: ModuleLessonNavProps) {
  const firstOpen = defaultOpenModuleId ?? modules[0]?.id ?? null;
  const [open, setOpen] = useState<string | null>(firstOpen);
  const headerRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const completed = new Set(completedLessonIds);
  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0) + orphanLessons.length;
  const doneCount = completed.size;
  const groups: NavModule[] = [
    ...modules,
    ...(orphanLessons.length > 0
      ? [{ id: "further", title: "Further lessons", orderIndex: modules.length, lessons: orphanLessons }]
      : []),
  ];

  function focusHeader(index: number) {
    const clamped = Math.max(0, Math.min(groups.length - 1, index));
    headerRefs.current[clamped]?.focus();
  }

  function onHeaderKeyDown(event: React.KeyboardEvent, index: number) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        focusHeader(index + 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        focusHeader(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusHeader(0);
        break;
      case "End":
        event.preventDefault();
        focusHeader(groups.length - 1);
        break;
      default:
        break;
    }
  }

  return (
    <nav aria-label="Course modules and lessons" className="space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-serif text-xl font-bold text-slate-100">Course contents</h2>
        <p className="text-xs text-slate-400">
          {doneCount} of {totalLessons} lesson{totalLessons === 1 ? "" : "s"} complete
        </p>
      </div>

      {groups.map((group, gi) => {
        const isOpen = open === group.id;
        const done = group.lessons.filter((l) => completed.has(l.id)).length;
        return (
          <section
            key={group.id}
            className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]"
          >
            <h3 className="sr-only">{group.title}</h3>
            <button
              ref={(el) => {
                headerRefs.current[gi] = el;
              }}
              type="button"
              onClick={() => setOpen(isOpen ? null : group.id)}
              onKeyDown={(e) => onHeaderKeyDown(e, gi)}
              aria-expanded={isOpen}
              aria-controls={`module-panel-${group.id}`}
              className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors hover:bg-white/[0.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <span className="min-w-0">
                <span className="block font-semibold text-sm text-slate-100">{group.title}</span>
                <span className="mt-0.5 block text-xs text-slate-400">
                  {group.lessons.length} lesson{group.lessons.length === 1 ? "" : "s"}
                  {done > 0 ? ` · ${done} done` : ""}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-3">
                <span className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-slate-800 sm:block">
                  <span
                    className="block h-full rounded-full bg-gold"
                    style={{
                      width: `${group.lessons.length ? Math.round((done / group.lessons.length) * 100) : 0}%`,
                    }}
                  />
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden
                />
              </span>
            </button>

            <div id={`module-panel-${group.id}`} hidden={!isOpen}>
              <ol className="space-y-1 border-t border-white/5 px-2 py-2">
                {group.lessons.map((lesson, li) => {
                  const isDone = completed.has(lesson.id);
                  const isCurrent = lesson.id === currentLessonId;
                  return (
                    <li key={lesson.id}>
                      <Link
                        href={`/university/${courseSlug}/lessons/${lesson.id}`}
                        aria-current={isCurrent ? "page" : undefined}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                          isCurrent ? "bg-gold/10 text-amber-100" : "text-slate-300 hover:bg-white/[0.04] hover:text-white"
                        }`}
                      >
                        <span className="w-5 shrink-0 text-center text-xs font-mono text-slate-500">
                          {li + 1}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate">{lesson.title}</span>
                          <span className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3 w-3" aria-hidden /> {lesson.estimatedMinutes} min
                            </span>
                            {lesson.needsCheck && (
                              <span className="inline-flex items-center gap-1 text-amber-400/80">
                                <CircleDashed className="h-3 w-3" aria-hidden /> In preparation
                              </span>
                            )}
                          </span>
                        </span>
                        {isDone ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" aria-label="Completed" />
                        ) : (
                          <BookOpen className="h-4 w-4 shrink-0 text-slate-600" aria-hidden />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </div>
          </section>
        );
      })}
    </nav>
  );
}
