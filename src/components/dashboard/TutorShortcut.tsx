import Link from "next/link";
import { Sparkles } from "lucide-react";

/** TutorShortcut — the tutor is one tap from the dashboard (the FAB persists everywhere). */
export default function TutorShortcut() {
  return (
    <Link
      href="/tutor"
      className="group flex min-h-[64px] items-center gap-4 rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-gold/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold text-on-gold">
        <Sparkles className="h-5 w-5" aria-hidden />
      </span>
      <span className="flex-1">
        <span className="block font-serif text-lg font-bold text-ink">Ask the AI study assistant</span>
        <span className="block text-sm text-muted">
          Stuck on a concept? Upload a note to your Desk and ask it directly.
        </span>
      </span>
      <span className="text-subtle transition-colors group-hover:text-gold" aria-hidden>
        →
      </span>
    </Link>
  );
}
