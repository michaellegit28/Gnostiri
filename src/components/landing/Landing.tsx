import Link from "next/link";
import { BookOpen, GraduationCap, Trophy, Sparkles, FileText, Library, Award } from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";
import HeroVisual from "@/components/brand/HeroVisual";

/**
 * The signed-out home. One job: say what Gnostiri is — a global learning and
 * intelligence platform with six pillars — and offer the door. Real numbers,
 * brand art, honest CTAs. Deep category navigation lives at /study; this is
 * the proposition, not a site map. Pillar cards are informative (not links) so
 * a signed-out visitor is never pushed into an auth-gated route.
 */

const NUMBERS = [
  { figure: "5,997", label: "JAMB questions, machine-verified" },
  { figure: "22", label: "university courses, authored" },
  { figure: "6", label: "rank tiers, Initiate to Paragon" },
];

const PILLARS = [
  { Icon: BookOpen, title: "Study", line: "University courses, high-school syllabuses, discovery trails and your PDF desk." },
  { Icon: Trophy, title: "Competitions", line: "Speed, Endurance, Mastery and Bracket cups — a season league that ranks you." },
  { Icon: Sparkles, title: "AI Studio", line: "A tutor that reads your notes, plus quizzes and study plans generated from them." },
  { Icon: FileText, title: "Examinations", line: "Country-aware boards, timed MCQ, theory papers and AI-assisted marking." },
  { Icon: Library, title: "Public Library", line: "Shared notes and quizzes from students and teachers around the world." },
  { Icon: Award, title: "My Learning", line: "Your dashboard: daily mission, streaks, mastery, revision and achievements." },
];

export default function Landing() {
  return (
    <main className="mx-auto w-full max-w-5xl px-5">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="grid items-center gap-12 pb-2 pt-10 md:grid-cols-[1.08fr_0.92fr] md:gap-16 md:pt-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-electric-text">A global learning ecosystem</p>
          <h1 className="mt-5 max-w-3xl font-serif text-5xl font-bold leading-[1.02] tracking-tight text-ink md:text-7xl">
            Learn anything. Prove everything. One platform.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted">
            Six pillars, one account: study full courses, practise real examinations,
            get help from an AI that reads your notes, compete with students worldwide,
            and share what you know — with your progress tracked end to end. Free to start.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/login"
              className="inline-flex min-h-[52px] items-center rounded-xl bg-primary px-8 text-base font-semibold text-on-primary shadow-[var(--shadow-lift)] transition-colors hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Create your free account
            </Link>
            <Link
              href="/study"
              className="inline-flex min-h-[52px] items-center rounded-xl border border-line-strong px-6 text-sm font-semibold text-ink transition-colors hover:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Explore what&apos;s inside
            </Link>
          </div>
          <dl className="mt-12 grid gap-5 border-t border-line pt-5 sm:grid-cols-3">
            {NUMBERS.map((item) => (
              <div key={item.label}>
                <dd className="font-serif text-4xl font-bold tabular-nums text-electric-text">{item.figure}</dd>
                <dt className="mt-1 text-sm text-muted">{item.label}</dt>
              </div>
            ))}
          </dl>
        </div>
        <div className="rounded-[2rem] border border-line bg-surface p-5 shadow-sm md:p-8">
          <div className="mb-5 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            <span>Progress is built</span>
            <span className="text-electric-text">One level at a time</span>
          </div>
          <HeroVisual />
        </div>
      </section>

      {/* ── The six pillars ──────────────────────────────────────────────── */}
      <section className="mt-16">
        <h2 className="font-serif text-3xl font-bold tracking-tight text-ink md:text-4xl">
          Six pillars, one connected platform.
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map(({ Icon, title, line }) => (
            <div key={title} className="gn-card rounded-2xl border border-line bg-surface p-6 gn-shadow">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-surface-2 text-electric-text">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-5 font-serif text-xl font-bold text-ink">{title}</h3>
              <p className="mt-2 text-sm text-muted">{line}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Closing CTA ──────────────────────────────────────────────────── */}
      <section className="mt-16 rounded-[2rem] bg-ink p-8 text-center text-slate-100 md:p-14">
        <h2 className="font-serif text-3xl font-bold tracking-tight md:text-4xl">
          Your first quiz is one tap away.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-slate-300">
          Free account, no card. Start with real questions in your subject, then grow into courses, AI help and the league.
        </p>
        <Link
          href="/login"
          className="mt-8 inline-flex min-h-[52px] items-center rounded-xl bg-primary px-8 text-base font-semibold text-on-primary shadow-[var(--shadow-lift)] transition-colors hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Create your free account
        </Link>
      </section>
    </main>
  );
}
