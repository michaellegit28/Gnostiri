import Link from "next/link";
import { CalendarCheck, ClipboardList, FolderDown, MonitorPlay } from "lucide-react";

export const metadata = {
  title: "Practice — Gnostiri",
  description: "Exams, timed practice, study plans, and saved study bundles.",
};

const DESTINATIONS = [
  {
    href: "/highschool/exams",
    title: "Exam boards",
    note: "Country boards, verified papers, and blueprint-aligned practice.",
    Icon: ClipboardList,
  },
  {
    href: "/cbt",
    title: "Timed CBT",
    note: "A focused computer-based session with server-side scoring.",
    Icon: MonitorPlay,
  },
  {
    href: "/battle-plan",
    title: "Battle plan",
    note: "Turn your exam date into a realistic day-by-day mission.",
    Icon: CalendarCheck,
  },
  {
    href: "/library",
    title: "Saved downloads",
    note: "Private study and quiz bundles are collected with your library resources.",
    Icon: FolderDown,
  },
];

export default function PracticePage() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-10 md:px-8 md:py-14">
      <header className="max-w-3xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-electric-text">Practice</p>
        <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight text-ink md:text-5xl">
          Turn knowledge into exam-day performance.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted">
          Work through verified questions, sit timed practice, or follow the plan built around your exam date.
        </p>
        <Link
          href="/highschool/exams"
          className="mt-7 inline-flex min-h-[48px] items-center rounded-xl bg-primary px-6 font-semibold text-on-primary transition-colors hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Browse exam boards
        </Link>
      </header>

      <section aria-labelledby="practice-destinations" className="mt-12">
        <h2 id="practice-destinations" className="font-serif text-2xl font-bold text-ink">
          Choose a practice mode
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {DESTINATIONS.map(({ href, title, note, Icon }) => (
            <Link
              key={href}
              href={href}
              className="gn-card group rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-primary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-surface-2 text-electric-text">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-5 font-serif text-xl font-bold text-ink group-hover:text-electric-text">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{note}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
