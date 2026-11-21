"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DEFAULT_USER_PREFERENCES,
  EXAM_STANDARDS,
  PREFERENCE_COUNTRIES,
  type UserPreferenceInput,
} from "@/lib/user-preferences";

export default function LearningPreferences({
  initial,
  authenticated,
}: {
  initial: UserPreferenceInput;
  authenticated: boolean;
}) {
  const [preferences, setPreferences] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function save() {
    setBusy(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.preferences) {
        throw new Error(data?.error || "Could not save preferences");
      }
      setPreferences(data.preferences);
      setMessage("Saved. These settings now follow you across devices.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save preferences");
    } finally {
      setBusy(false);
    }
  }

  if (!authenticated) {
    return (
      <section className="gn-shadow rounded-2xl border border-line bg-surface/40 p-5 md:p-6">
        <h2 className="font-semibold text-ink">Learning preferences</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Sign in to keep your country, exam standard, daily goal, review queue, and analytics choice in sync
          across devices. Appearance controls below always remain available on this device.
        </p>
        <Link
          href="/login"
          className="gn-motion mt-5 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Sign in to sync preferences
        </Link>
      </section>
    );
  }

  return (
    <section className="gn-shadow rounded-2xl border border-line bg-surface/40 p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold text-ink">Learning preferences</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            These settings travel with your account. Appearance controls remain device-specific.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setPreferences(DEFAULT_USER_PREFERENCES)}
          className="min-h-[44px] rounded-xl border border-line-strong px-4 text-sm font-semibold text-muted transition-colors hover:border-primary/50 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Reset defaults
        </button>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-semibold text-slate-200">
          Study country
          <select
            value={preferences.country ?? ""}
            onChange={(event) =>
              setPreferences((current) => ({
                ...current,
                country: event.target.value ? (event.target.value as UserPreferenceInput["country"]) : null,
              }))
            }
            className="mt-2 min-h-[44px] w-full rounded-xl border border-line bg-bg px-3 font-normal text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <option value="">Not set</option>
            {PREFERENCE_COUNTRIES.map((option) => (
              <option key={option.code} value={option.code}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-semibold text-slate-200">
          Exam standard
          <select
            value={preferences.examStandard ?? ""}
            onChange={(event) =>
              setPreferences((current) => ({
                ...current,
                examStandard: event.target.value
                  ? (event.target.value as UserPreferenceInput["examStandard"])
                  : null,
              }))
            }
            className="mt-2 min-h-[44px] w-full rounded-xl border border-line bg-bg px-3 font-normal text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <option value="">Not set</option>
            {EXAM_STANDARDS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-5 block text-sm font-semibold text-slate-200">
        Daily study goal
        <span className="ml-2 font-normal text-muted">minutes per day</span>
        <input
          type="number"
          min={10}
          max={180}
          step={5}
          value={preferences.dailyGoalMinutes}
          onChange={(event) => {
            const value = Number(event.target.value);
            setPreferences((current) => ({
              ...current,
              dailyGoalMinutes: Number.isFinite(value) ? Math.min(180, Math.max(10, value)) : 10,
            }));
          }}
          className="mt-2 min-h-[44px] w-full rounded-xl border border-line bg-bg px-3 font-normal text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      </label>

      <div className="mt-5 space-y-3">
        <PreferenceToggle
          label="Spaced-repetition review queue"
          note="Use scheduled concept reviews to choose what comes next."
          checked={preferences.srsEnabled}
          onChange={(checked) =>
            setPreferences((current) => ({ ...current, srsEnabled: checked }))
          }
        />
        <PreferenceToggle
          label="Product analytics"
          note="Turn off collection of product usage events. Learning progress still works."
          checked={!preferences.analyticsOptOut}
          onChange={(checked) =>
            setPreferences((current) => ({ ...current, analyticsOptOut: !checked }))
          }
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void save()}
          disabled={busy}
          className="gn-motion inline-flex min-h-[44px] items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-wait disabled:opacity-60"
        >
          {busy ? "Saving…" : "Save preferences"}
        </button>
        {message ? (
          <p role="status" className="text-sm text-emerald-300">
            {message}
          </p>
        ) : null}
        {error ? (
          <p role="alert" className="text-sm text-rose-300">
            {error}
          </p>
        ) : null}
      </div>
    </section>
  );
}

function PreferenceToggle({
  label,
  note,
  checked,
  onChange,
}: {
  label: string;
  note: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-line bg-bg p-4">
      <div>
        <p className="text-sm font-semibold text-slate-200">{label}</p>
        <p className="mt-1 max-w-xl text-xs text-muted">{note}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`gn-motion relative mt-1 h-7 w-12 shrink-0 rounded-full border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
          checked ? "border-primary/60 bg-primary/30" : "border-line-strong bg-surface-2"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full transition-all ${
            checked ? "left-6 bg-primary" : "left-0.5 bg-line-strong"
          }`}
        />
      </button>
    </div>
  );
}
