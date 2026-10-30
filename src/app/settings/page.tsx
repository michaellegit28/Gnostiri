import Link from "next/link";
import AppearanceControls from "@/components/settings/AppearanceControls";

export const dynamic = "force-dynamic";

export const metadata = { title: "Appearance & accessibility — Gnostiri" };

export default function SettingsPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-8 md:py-12">
      <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Settings</p>
      <h1 className="mt-3 font-serif text-3xl font-bold text-slate-100 md:text-4xl">Appearance & accessibility</h1>
      <p className="mt-3 text-sm text-slate-400">
        Every preference below is stored on your device and applies instantly. Gnostiri is built to be usable
        with a keyboard, a screen reader, or a slow connection — if anything blocks you, report it from the
        bottom of any lesson or question page.
      </p>
      <div className="mt-8">
        <AppearanceControls />
      </div>
      <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950/60 p-5 text-sm text-slate-400">
        <h2 className="font-semibold text-slate-100">Keyboard shortcuts</h2>
        <ul className="mt-3 space-y-1.5">
          <li><kbd className="rounded border border-white/15 px-1.5 py-0.5 text-xs text-slate-300">Ctrl</kbd> / <kbd className="rounded border border-white/15 px-1.5 py-0.5 text-xs text-slate-300">⌘</kbd> + <kbd className="rounded border border-white/15 px-1.5 py-0.5 text-xs text-slate-300">K</kbd> — jump to any part of the app</li>
          <li><kbd className="rounded border border-white/15 px-1.5 py-0.5 text-xs text-slate-300">Tab</kbd> — move through the interface; every stop shows a gold focus ring</li>
          <li><kbd className="rounded border border-white/15 px-1.5 py-0.5 text-xs text-slate-300">Esc</kbd> — close menus and overlays</li>
        </ul>
      </div>
      <Link href="/profile" className="mt-8 inline-block py-2 text-sm text-slate-400 hover:text-gold">
        <span aria-hidden="true">← </span>Back to profile
      </Link>
    </main>
  );
}
