"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, RefreshCw, WifiOff } from "lucide-react";
import {
  flush,
  outstanding,
  recentViews,
  MAX_ATTEMPTS,
  type QueueItem,
  type ViewRecord,
} from "@/lib/offline-queue";

export default function OfflinePage() {
  const [views, setViews] = useState<ViewRecord[]>([]);
  const [items, setItems] = useState<QueueItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");

  const reload = useCallback(async () => {
    const [nextViews, nextItems] = await Promise.all([recentViews(12), outstanding()]);
    setViews(nextViews);
    setItems(nextItems);
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const retry = useCallback(async () => {
    setBusy(true);
    setNote("");
    try {
      const report = await flush();
      setNote(
        report.sent === 0
          ? "Nothing left to send."
          : `${report.synced} synced${report.failed ? `, ${report.failed} refused by the server` : ""}.`,
      );
      await reload();
    } catch {
      setNote("The sync could not run. Try again when the connection is back.");
    } finally {
      setBusy(false);
    }
  }, [reload]);

  const pendingCount = items.filter((item) => item.state === "pending").length;
  const failedCount = items.filter((item) => item.state === "failed").length;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-electric-text">Offline</p>
      <h1 className="mt-3 flex items-center gap-3 font-serif text-3xl font-bold text-slate-100">
        <WifiOff className="h-7 w-7 text-electric-text" aria-hidden />
        No connection right now
      </h1>
      <p className="mt-3 text-sm text-muted">
        Reading still works: every study page, university lesson and desk post you opened while
        online is on this device. Submissions wait in the queue and go out the moment the
        connection returns.
      </p>

      <section className="gn-shadow mt-10 rounded-2xl border border-line bg-surface/40 p-6">
        <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-slate-100">
          <BookOpen className="h-5 w-5 text-electric-text" aria-hidden />
          Available offline
        </h2>
        {views.length > 0 ? (
          <ul className="mt-4 divide-y divide-line">
            {views.map((view) => (
              <li key={view.path} className="py-2.5">
                <Link href={view.path} className="gn-motion rounded text-sm font-semibold text-slate-100 transition-colors hover:text-electric-text focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  {view.title}
                </Link>
                <p className="mt-0.5 text-xs text-muted">{view.path}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-slate-400">
            Nothing saved on this device yet. Open a study page or a lesson while online and it
            lands here for the next offline session.
          </p>
        )}
      </section>

      <section className="gn-shadow mt-6 rounded-2xl border border-line bg-surface/40 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-serif text-xl font-bold text-slate-100">Saved submissions</h2>
          <button
            type="button"
            onClick={() => void retry()}
            disabled={busy}
            aria-busy={busy}
            className="gn-motion inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-line-strong bg-surface/80 px-4 text-sm font-semibold text-slate-200 transition-colors hover:border-primary/60 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <RefreshCw className={`h-4 w-4 ${busy ? "animate-spin" : ""}`} aria-hidden />
            {busy ? "Syncing…" : "Sync now"}
          </button>
        </div>

        <p className="mt-2 text-sm text-muted">
          {items.length === 0
            ? "The queue is empty."
            : `${pendingCount} waiting${failedCount ? `, ${failedCount} refused by the server` : ""}.`}
        </p>

        {items.length > 0 && (
          <ul className="mt-4 space-y-3">
            {items.map((item) => (
              <li key={item.id} className="rounded-xl border border-line bg-bg p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-slate-100">{item.endpoint}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      item.state === "failed" ? "bg-rose-500/15 text-rose-200" : "bg-amber-500/15 text-amber-200"
                    }`}
                  >
                    {item.state === "failed" ? "Needs a manual retry" : `Waiting · ${item.attempts}/${MAX_ATTEMPTS} attempts`}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Queued {new Date(item.queuedAt).toLocaleString()}
                </p>
                {item.lastError && (
                  <p className="mt-2 text-xs text-rose-200" role="status">
                    {item.lastError}
                  </p>
                )}
                {item.state === "failed" && (
                  <p className="mt-2 text-xs text-slate-400">
                    The answers are still here, untouched. If the cup window or the pod window
                    closed before the connection came back, the server keeps that decision and this
                    row stays for a manual retry.
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}

        {note && <p className="mt-4 text-sm text-emerald-300">{note}</p>}
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/study"
          className="gn-motion inline-flex min-h-[44px] items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.98]"
        >
          Back to study
        </Link>
        <Link
          href="/highschool/study"
          className="inline-flex min-h-[44px] items-center rounded-xl border border-line-strong px-5 text-sm font-semibold text-slate-200 hover:border-primary/60 hover:text-white"
        >
          High school topics
        </Link>
      </div>
    </div>
  );
}
