"use client";

import { useCallback, useEffect, useState } from "react";
import { ClipboardList, Plus, Trash2 } from "lucide-react";

interface AiAssessment {
  id: string;
  title: string;
  courseId: string | null;
  createdAt: string;
}

/** University AI Studio — assessments. A titled assessment container; adding
 * items and the deterministic scoring attempt land next. */
export default function AiAssessments() {
  const [rows, setRows] = useState<AiAssessment[] | null>(null);
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const res = await fetch("/api/ai/assessments", { cache: "no-store" });
      if (res.status === 401) {
        setRows(null);
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setRows([]);
        setError(typeof data.error === "string" ? data.error : "AI assessments are unavailable right now.");
        return;
      }
      setRows(Array.isArray(data.assessments) ? data.assessments : []);
    } catch {
      setError("Could not load your assessments. Check your connection.");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function create() {
    if (!title.trim()) {
      setError("A title is required.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/ai/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save your assessment");
      setTitle("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save your assessment");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    setDeletingId(id);
    setError("");
    try {
      const res = await fetch(`/api/ai/assessments/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not delete the assessment");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete the assessment");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section aria-labelledby="ai-assessments-heading" className="gn-card rounded-2xl p-6">
      <h3 id="ai-assessments-heading" className="flex items-center gap-2 font-serif text-xl font-bold text-ink">
        <ClipboardList className="h-5 w-5 text-electric-text" aria-hidden />
        AI assessments
      </h3>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="block flex-1 text-sm text-muted">
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Pharmacology mid-term"
            className="mt-1.5 block min-h-[44px] w-full rounded-lg border border-line bg-bg px-3 text-ink placeholder:text-subtle focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </label>
        <button
          type="button"
          onClick={() => void create()}
          disabled={busy}
          className="gn-motion inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Plus className="h-4 w-4" aria-hidden />
          {busy ? "Saving…" : "New assessment"}
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-3 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="mt-6">
        {rows === null ? (
          <div className="space-y-2" aria-hidden>
            <div className="h-12 rounded-xl bg-surface-2/60" />
            <div className="h-12 rounded-xl bg-surface-2/60" />
          </div>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted">No assessments yet — create your first above.</p>
        ) : (
          <ul className="space-y-2">
            {rows.map((row) => (
              <li key={row.id} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface/40 p-4">
                <div className="font-semibold text-ink">{row.title}</div>
                <button
                  type="button"
                  onClick={() => void remove(row.id)}
                  disabled={deletingId === row.id}
                  aria-label={`Delete assessment: ${row.title}`}
                  className="gn-motion flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-lg text-subtle transition-colors hover:text-danger focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}