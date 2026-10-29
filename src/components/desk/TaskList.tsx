"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { BookOpen, CheckCircle2, ListChecks, Clock } from "lucide-react";

/**
 * TaskList — today's scheduled Desk work (or the upcoming plan).
 *
 * Completion is optimistic against the server: the PUT goes to
 * /api/study-tasks, which re-validates ownership server-side, and the list
 * re-renders from the server.
 */

export interface DeskTask {
  id: string;
  kind: string;
  title: string;
  minutes: number;
  scheduledFor: string;
  status: string;
  documentId: string | null;
  documentTitle: string | null;
}

const KIND_ICON: Record<string, typeof BookOpen> = {
  reading: BookOpen,
  quiz: ListChecks,
};

export default function TaskList({ tasks, heading }: { tasks: DeskTask[]; heading: string }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function update(id: string, status: "done" | "skipped") {
    setPendingId(id);
    setError(null);
    try {
      const response = await fetch("/api/study-tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        setError(payload.error || "Could not update the task");
        return;
      }
      router.refresh();
    } catch {
      setError("Could not reach the server — try again.");
    } finally {
      setPendingId(null);
    }
  }

  if (tasks.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-400">
        {heading}: nothing scheduled. Upload a PDF above to build a plan.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">{heading}</h2>
      {error && <p role="alert" className="text-sm text-amber-300">{error}</p>}
      <ul className="space-y-2">
        {tasks.map((task) => {
          const Icon = KIND_ICON[task.kind] ?? Clock;
          const busy = pendingId === task.id;
          const when = new Date(task.scheduledFor).toLocaleDateString(undefined, { month: "short", day: "numeric" });
          const done = task.status !== "pending";
          return (
            <li key={task.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4">
              <Icon className="h-5 w-5 shrink-0 text-gold" />
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-medium ${done ? "text-slate-500 line-through" : "text-slate-100"}`}>{task.title}</p>
                <p className="text-xs text-slate-400">
                  {when} · {task.minutes} min ·{" "}
                  {task.documentId ? (
                    <Link href={`/desk/${task.documentId}`} className="text-gold underline">open document</Link>
                  ) : (
                    "document removed"
                  )}
                </p>
              </div>
              {task.status === "pending" ? (
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => update(task.id, "done")}
                    className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg bg-emerald-700/30 px-3 py-1.5 text-xs font-semibold text-emerald-300 transition-colors hover:bg-emerald-700/50 disabled:opacity-50"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" /> Done
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => update(task.id, "skipped")}
                    className="inline-flex min-h-[36px] items-center rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-400 transition-colors hover:text-slate-200 disabled:opacity-50"
                  >
                    Skip
                  </button>
                </div>
              ) : (
                <span className="shrink-0 text-xs uppercase tracking-wide text-slate-500">{task.status}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
