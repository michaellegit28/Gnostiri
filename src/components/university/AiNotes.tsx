"use client";

import { useCallback, useEffect, useState } from "react";
import { NotebookPen, Plus, Trash2 } from "lucide-react";

interface AiNote {
  id: string;
  title: string;
  body: string;
  courseId: string | null;
  lessonId: string | null;
  createdAt: string;
}

/** University AI Studio — study notes. The rest of the AI lane (transcription,
 * auto-correction, assessments) is provisioned in the schema and lands next. */
export default function AiNotes() {
  const [notes, setNotes] = useState<AiNote[] | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const res = await fetch("/api/ai/notes", { cache: "no-store" });
      if (res.status === 401) {
        setNotes(null);
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setNotes([]);
        setError(typeof data.error === "string" ? data.error : "AI notes are unavailable right now.");
        return;
      }
      setNotes(Array.isArray(data.notes) ? data.notes : []);
    } catch {
      setError("Could not load your notes. Check your connection.");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function create() {
    if (!title.trim() || !body.trim()) {
      setError("A title and a note are required.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/ai/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save your note");
      setTitle("");
      setBody("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save your note");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    setDeletingId(id);
    setError("");
    try {
      const res = await fetch(`/api/ai/notes/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not delete the note");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete the note");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section aria-labelledby="ai-notes-heading" className="gn-card rounded-2xl p-6">
      <h3 id="ai-notes-heading" className="flex items-center gap-2 font-serif text-xl font-bold text-ink">
        <NotebookPen className="h-5 w-5 text-electric-text" aria-hidden />
        AI notes
      </h3>

      <div className="mt-4 space-y-3">
        <label className="block text-sm text-muted">
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Cardiac cycle summary"
            className="mt-1.5 block min-h-[44px] w-full rounded-lg border border-line bg-bg px-3 text-ink placeholder:text-subtle focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </label>
        <label className="block text-sm text-muted">
          Note
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            placeholder="Your distilled note…"
            className="mt-1.5 block w-full rounded-lg border border-line bg-bg px-3 py-2 text-ink placeholder:text-subtle focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </label>
        <button
          type="button"
          onClick={() => void create()}
          disabled={busy}
          className="gn-motion inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Plus className="h-4 w-4" aria-hidden />
          {busy ? "Saving…" : "Save note"}
        </button>
        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}
      </div>

      <div className="mt-6">
        {notes === null ? (
          <div className="space-y-2" aria-hidden>
            <div className="h-12 rounded-xl bg-surface-2/60" />
            <div className="h-12 rounded-xl bg-surface-2/60" />
          </div>
        ) : notes.length === 0 ? (
          <p className="text-sm text-muted">No notes yet — save your first one above.</p>
        ) : (
          <ul className="space-y-2">
            {notes.map((note) => (
              <li key={note.id} className="rounded-xl border border-line bg-surface/40 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="font-semibold text-ink">{note.title}</div>
                  <button
                    type="button"
                    onClick={() => void remove(note.id)}
                    disabled={deletingId === note.id}
                    aria-label={`Delete note: ${note.title}`}
                    className="gn-motion flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-lg text-subtle transition-colors hover:text-danger focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </button>
                </div>
                <p className="mt-1 whitespace-pre-wrap text-sm text-muted">{note.body}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}