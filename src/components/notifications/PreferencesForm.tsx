"use client";

import { useEffect, useState } from "react";
import { NOTIFICATION_TYPES } from "@/lib/notify";

const TYPE_LABELS: Record<string, string> = {
  cup_starting: "Cup starting (1h before)",
  streak_risk: "Streak at risk",
  overtaken: "Position overtaken",
  bracket_invite: "Bracket invites",
  milestone: "Milestones reached",
  artifact_reward: "Artifact rewards",
  season_result: "Season results",
  report_resolved: "Report resolutions",
};

interface Preferences {
  emailOptIn: boolean;
  quietHours: string | null;
  mutedTypes: string[];
}

/**
 * PreferencesForm — the only interactive piece of /notifications. Reads and
 * writes the caller's own NotificationPreference row through
 * /api/notifications/preferences (validated server-side; 400 on malformed).
 */
export default function PreferencesForm() {
  const [prefs, setPrefs] = useState<Preferences>({ emailOptIn: false, quietHours: null, mutedTypes: [] });
  const [quietEnabled, setQuietEnabled] = useState(false);
  const [quietStart, setQuietStart] = useState("22:00");
  const [quietEnd, setQuietEnd] = useState("07:00");
  const [state, setState] = useState<"loading" | "idle" | "saving" | "saved" | "error">("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    fetch("/api/notifications/preferences", { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) throw new Error("load failed");
        const data = (await res.json()) as { preferences: Preferences };
        if (!alive) return;
        const p = data.preferences;
        setPrefs(p);
        if (p.quietHours) {
          setQuietEnabled(true);
          const [start, end] = p.quietHours.split("-");
          setQuietStart(start);
          setQuietEnd(end);
        }
        setState("idle");
      })
      .catch(() => alive && setState("error"));
    return () => {
      alive = false;
    };
  }, []);

  const toggleMuted = (type: string) => {
    setPrefs((prev) => ({
      ...prev,
      mutedTypes: prev.mutedTypes.includes(type)
        ? prev.mutedTypes.filter((t) => t !== type)
        : [...prev.mutedTypes, type],
    }));
    setState("idle");
  };

  const save = async () => {
    setState("saving");
    setError("");
    const payload = {
      emailOptIn: prefs.emailOptIn,
      quietHours: quietEnabled ? `${quietStart}-${quietEnd}` : null,
      mutedTypes: prefs.mutedTypes,
    };
    try {
      const res = await fetch("/api/notifications/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "save failed");
      }
      const data = (await res.json()) as { preferences: Preferences };
      setPrefs(data.preferences);
      setState("saved");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save preferences");
      setState("error");
    }
  };

  if (state === "loading") {
    return <p className="text-sm text-slate-400">Loading your preferences…</p>;
  }

  return (
    <div className="space-y-6">
      <label className="flex items-start gap-3 text-sm text-slate-200">
        <input
          type="checkbox"
          checked={prefs.emailOptIn}
          onChange={(e) => {
            setPrefs((prev) => ({ ...prev, emailOptIn: e.target.checked }));
            setState("idle");
          }}
          className="mt-0.5 h-4 w-4 rounded border-white/20 bg-slate-900 accent-[#D4AF37] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        />
        <span>
          Email backup
          <span className="mt-0.5 block text-xs text-slate-400">
            In-app is always on. Email is an optional copy for the moment you are away — nothing else leaves Gnostiri.
          </span>
        </span>
      </label>

      <div className="space-y-3">
        <label className="flex items-center gap-3 text-sm text-slate-200">
          <input
            type="checkbox"
            checked={quietEnabled}
            onChange={(e) => {
              setQuietEnabled(e.target.checked);
              setState("idle");
            }}
            className="h-4 w-4 rounded border-white/20 bg-slate-900 accent-[#D4AF37] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          />
          Quiet hours
        </label>
        {quietEnabled && (
          <div className="flex flex-wrap items-center gap-3 pl-7 text-sm text-slate-300">
            <span>No email between</span>
            <input
              type="time"
              value={quietStart}
              onChange={(e) => {
                setQuietStart(e.target.value);
                setState("idle");
              }}
              aria-label="Quiet hours start"
              className="rounded-lg border border-white/15 bg-slate-900 px-3 py-1.5 text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            />
            <span>and</span>
            <input
              type="time"
              value={quietEnd}
              onChange={(e) => {
                setQuietEnd(e.target.value);
                setState("idle");
              }}
              aria-label="Quiet hours end"
              className="rounded-lg border border-white/15 bg-slate-900 px-3 py-1.5 text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            />
            <span className="text-xs text-slate-500">The in-app row is still written; only the email waits.</span>
          </div>
        )}
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm text-slate-200">Mute a type</legend>
        <p className="text-xs text-slate-400">A muted type writes nothing — no bell entry, no email.</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {NOTIFICATION_TYPES.map((type) => (
            <label key={type} className="flex items-center gap-3 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={prefs.mutedTypes.includes(type)}
                onChange={() => toggleMuted(type)}
                className="h-4 w-4 rounded border-white/20 bg-slate-900 accent-[#D4AF37] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              />
              {TYPE_LABELS[type] ?? type}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={save}
          disabled={state === "saving"}
          className="flex min-h-[44px] items-center rounded-xl bg-gold px-5 font-semibold text-slate-950 transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:opacity-60"
        >
          {state === "saving" ? "Saving…" : "Save preferences"}
        </button>
        {state === "saved" && <span className="text-sm text-emerald-300">Saved.</span>}
        {state === "error" && <span className="text-sm text-red-300">{error}</span>}
      </div>
    </div>
  );
}
