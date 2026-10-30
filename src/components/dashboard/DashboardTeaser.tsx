import Link from "next/link";
import { ArrowRight, BookOpen, Compass, Flame, FolderOpen, GraduationCap, Swords } from "lucide-react";

function StatTile({ icon: Icon, label, note }: { icon: typeof Flame; label: string; note: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 backdrop-blur">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
        <Icon className="h-4 w-4 text-gold" aria-hidden />
        {label}
      </div>
      <div className="mt-3 font-serif text-2xl font-bold text-slate-500">—</div>
      <p className="mt-1 text-xs text-slate-500">{note}</p>
    </div>
  );
}

function PreviewTile({ icon: Icon, title, note }: { icon: typeof BookOpen; title: string; note: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 backdrop-blur">
      <div className="inline-flex rounded-xl border border-white/10 bg-white/5 p-2.5">
        <Icon className="h-5 w-5 text-gold" aria-hidden />
      </div>
      <h3 className="mt-3 font-serif text-lg font-bold text-slate-100">{title}</h3>
      <p className="mt-1 text-sm text-slate-400">{note}</p>
    </div>
  );
}

export default function DashboardTeaser() {
  return (
    <section
      aria-label="Your dashboard preview"
      className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-950/90 to-slate-950/95 p-6 shadow-lg shadow-black/20 md:p-8"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.12),transparent_55%)]"
      />
      <div className="relative flex flex-col gap-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
              Your dashboard
            </p>
            <h2 className="mt-2 font-serif text-2xl font-bold text-slate-100 md:text-3xl">
              One place for your streak, your plan and your subjects
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              This is the dashboard every student gets: today&apos;s mission, honest progress, and
              every doorway back into your work. Numbers appear here only once you have earned them.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            Create your free account
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 p-5">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-gold/20 blur-2xl animate-pulse"
            />
            <div className="relative">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
                <Swords className="h-4 w-4" aria-hidden />
                Battle plan
              </div>
              <h3 className="mt-3 font-serif text-lg font-bold text-slate-100">
                Today&apos;s mission
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                Your plan puts the weakest topic first, every single day.
              </p>
              <p className="mt-3 text-xs text-slate-500">Enabled after you set an exam date.</p>
            </div>
          </div>

          <StatTile icon={Flame} label="Current streak" note="Counted from your real sessions." />
          <StatTile icon={GraduationCap} label="Accuracy" note="Scored from your own attempts." />

          <PreviewTile icon={BookOpen} title="Study grid" note="High School, University, Discovery and Desk." />
        </div>

        <ul className="grid grid-cols-2 gap-3 text-xs text-slate-400 sm:grid-cols-4">
          <li className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-teal-300" aria-hidden />
            High School
          </li>
          <li className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-gold" aria-hidden />
            University
          </li>
          <li className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-teal-300" aria-hidden />
            Discovery
          </li>
          <li className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4 text-gold" aria-hidden />
            Desk
          </li>
        </ul>
      </div>
    </section>
  );
}
