import Link from "next/link";
import { BookOpen, Compass, FolderOpen, GraduationCap } from "lucide-react";

/**
 * Study hub — the four ways to study, as cards with real counts.
 * Counts come from the database (never hard-coded) so the page can't lie.
 */

interface StudyCardSpec {
  href: string;
  label: string;
  icon: "BookOpen" | "GraduationCap" | "Compass" | "FolderOpen";
  line: string;
  count: string;
}

export default function StudyGrid({ cards }: { cards: StudyCardSpec[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {cards.map((card) => {
        const ICONS = { BookOpen, GraduationCap, Compass, FolderOpen } as const;
        const Icon = ICONS[card.icon];
        return (
          <Link
            key={card.href}
            href={card.href}
            className="group flex min-h-[132px] flex-col justify-between rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-gold/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-surface-2 text-gold">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="text-subtle transition-colors group-hover:text-gold" aria-hidden>
                →
              </span>
            </div>
            <div className="mt-5">
              <h2 className="font-serif text-xl font-bold text-ink">{card.label}</h2>
              <p className="mt-1 text-sm text-muted">{card.line}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold">{card.count}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}


