"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DEFAULT_USER_PREFERENCES,
  PREFERENCE_COUNTRIES,
  userPreferenceSchema,
  type UserPreferenceInput,
} from "@/lib/user-preferences";

export default function LearningPreferences({
  initial,
  authenticated,
  available,
}: {
  initial: UserPreferenceInput;
  authenticated: boolean;
  available: boolean;
}) {
  const [preferences, setPreferences] = useState(initial);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function update(next: UserPreferenceInput) {
    setPreferences(next);
    setDirty(true);
    setMessage("");
    setError("");
  }

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
        const issues = Array.isArray(data?.issues)
          ? data.issues
              .map((issue: { path?: string; message?: string }) =>
                issue.path ? `${issue.path}: ${issue.message}` : issue.message
              )
              .filter(Boolean)
              .join(" ")
          : "";
        throw new Error(issues || data?.error || "Could not save preferences");
      }
      const parsed = userPreferenceSchema.safeParse(data.preferences);
      if (!parsed.success) throw new Error("The server returned invalid preferences");
      setPreferences(parsed.data);
      setDirty(false);
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
          Sign in to keep your country and review-queue choice in sync across devices. Appearance controls
          below always remain available on this device.
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
          onClick={() => update({ ...DEFAULT_USER_PREFERENCES })}
          disabled={busy || !available}
          className="min-h-[44px] rounded-xl border border-line-strong px-4 text-sm font-semibold text-muted transition-colors hover:border-primary/50 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          Reset defaults
        </button>
      </div>

      {!available ? (
        <p role="alert" className="mt-5 rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-amber-200">
          Synced preferences are temporarily unavailable. Your existing account data is unchanged.
        </p>
      ) : null}

      <fieldset disabled={busy || !available} className="mt-6 space-y-5 disabled:opacity-60">
        <label className="block text-sm font-semibold text-slate-200">
          Study country
          <select
            value={preferences.country ?? ""}
            onChange={(event) =>
              update({
                ...preferences,
                country: event.target.value
                  ? (event.target.value as UserPreferenceInput["country"])
                  : null,
              })
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
          <span className="mt-2 block text-xs font-normal text-muted">
            This also selects the country used for localized billing.
          </span>
        </label>

        <PreferenceToggle
          label="Spaced-repetition review queue"
          note="When off, concepts that are due for review stay out of the revision queue."
          checked={preferences.srsEnabled}
          onChange={(checked) => update({ ...preferences, srsEnabled: checked })}
        />
      </fieldset>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void save()}
          disabled={busy || !available || !dirty}
          className="gn-motion inline-flex min-h-[44px] items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
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
