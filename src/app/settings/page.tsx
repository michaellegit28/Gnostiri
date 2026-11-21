import Link from "next/link";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import AppearanceControls from "@/components/settings/AppearanceControls";
import LearningPreferences from "@/components/settings/LearningPreferences";
import {
  DEFAULT_USER_PREFERENCES,
  PREFERENCE_COUNTRY_CODES,
  type UserPreferenceInput,
} from "@/lib/user-preferences";

export const dynamic = "force-dynamic";

export const metadata = { title: "Learning & accessibility — Gnostiri" };

export default async function SettingsPage() {
  const user = await getCurrentUser();
  let preferences: UserPreferenceInput = { ...DEFAULT_USER_PREFERENCES };

  if (user) {
    try {
      const saved = await prisma.userPreference.findUnique({
        where: { userId: user.id },
        select: {
          country: true,
          examStandard: true,
          dailyGoalMinutes: true,
          srsEnabled: true,
          analyticsOptOut: true,
        },
      });
      if (saved) {
        preferences = {
          country:
            saved.country && PREFERENCE_COUNTRY_CODES.includes(saved.country as (typeof PREFERENCE_COUNTRY_CODES)[number])
              ? (saved.country as (typeof PREFERENCE_COUNTRY_CODES)[number])
              : null,
          examStandard: saved.examStandard === "jamb-standard" || saved.examStandard === "sat-standard" ? saved.examStandard : null,
          dailyGoalMinutes: saved.dailyGoalMinutes,
          srsEnabled: saved.srsEnabled,
          analyticsOptOut: saved.analyticsOptOut,
        };
      } else if (user.country && PREFERENCE_COUNTRY_CODES.includes(user.country as (typeof PREFERENCE_COUNTRY_CODES)[number])) {
        preferences.country = user.country as (typeof PREFERENCE_COUNTRY_CODES)[number];
      }
    } catch {
      preferences = { ...DEFAULT_USER_PREFERENCES };
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-5 py-8 md:py-12">
      <p className="text-[11px] uppercase tracking-[0.3em] text-electric-text">Settings</p>
      <h1 className="mt-3 font-serif text-3xl font-bold text-slate-100 md:text-4xl">Learning & accessibility</h1>
      <p className="mt-3 text-sm text-muted">
        Account preferences travel across devices. Appearance controls stay on this device and apply instantly.
        Gnostiri is built to be usable with a keyboard, a screen reader, or a slow connection.
      </p>
      <div className="mt-8 space-y-8">
        <LearningPreferences initial={preferences} authenticated={Boolean(user)} />
        <section aria-labelledby="appearance-settings">
          <h2 id="appearance-settings" className="font-serif text-xl font-bold text-ink">
            Appearance & accessibility
          </h2>
          <p className="mt-1 text-sm text-muted">Stored only on this device.</p>
          <div className="mt-4">
            <AppearanceControls />
          </div>
        </section>
      </div>
      <div className="gn-shadow mt-8 rounded-2xl border border-line bg-surface/40 p-5 text-sm text-muted">
        <h2 className="font-semibold text-slate-100">Keyboard shortcuts</h2>
        <ul className="mt-3 space-y-1.5">
          <li><kbd className="rounded border border-line-strong bg-surface-2 px-1.5 py-0.5 text-xs text-slate-300">Ctrl</kbd> / <kbd className="rounded border border-line-strong bg-surface-2 px-1.5 py-0.5 text-xs text-slate-300">⌘</kbd> + <kbd className="rounded border border-line-strong bg-surface-2 px-1.5 py-0.5 text-xs text-slate-300">K</kbd> — jump to any part of the app</li>
          <li><kbd className="rounded border border-line-strong bg-surface-2 px-1.5 py-0.5 text-xs text-slate-300">Tab</kbd> — move through the interface; every stop shows a gold focus ring</li>
          <li><kbd className="rounded border border-line-strong bg-surface-2 px-1.5 py-0.5 text-xs text-slate-300">Esc</kbd> — close menus and overlays</li>
        </ul>
      </div>
      <Link href="/profile" className="gn-motion mt-8 inline-block rounded py-2 text-sm text-slate-400 transition-colors hover:text-electric-text focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
        <span aria-hidden="true">← </span>Back to profile
      </Link>
    </main>
  );
}
