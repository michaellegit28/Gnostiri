import Link from "next/link";
import { BookOpen, GraduationCap, Trophy } from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";
import HeroVisual from "@/components/brand/HeroVisual";

/**
 * The signed-out home. One screen, one job: say what this is and offer the
 * door. Bold display type, the brand art, real numbers, one CTA. No category
 * navigation (that lives at /study), no particle effects, no filler sections.
 */

const NUMBERS = [
  { figure: "5,997", label: "JAMB questions, machine-verified" },
  { figure: "22", label: "university courses, authored" },
  { figure: "6", label: "rank tiers, Initiate to Paragon" },
];

const PREVIEW = [
  {
    Icon: BookOpen,
    title: "Practice",
    line: "Real exam questions by topic. Instant marking, explanations after.",
  },
  {
    Icon: GraduationCap,
    title: "Courses",
    line: "Full university courses — lessons, quizzes, mastery tracking.",
  },
  {
    Icon: Trophy,
    title: "Compete",
    line: "Team quizzes and a season ladder. Climb from Initiate to Paragon.",
  },
];

export default function Landing() {
  return (
    <main className="mx-auto w-full max-w-5xl px-5">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="pt-10 md:pt-16">
        <div className="flex items-center gap-3">
          <LogoMark size={36} />
          <span className="font-serif text-xl font-bold tracking-tight text-ink">Gnostiri</span>
        </div>
        <h1 className="mt-8 max-w-3xl font-serif text-5xl font-bold leading-[1.05] tracking-tight text-ink md:text-7xl">
          Study for the exam you&apos;re actually sitting.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted">
          Verified questions, full courses, an assistant that reads your notes, and a league that
          ranks you against students across the country. Free to start.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-4">
          <Link
            href="/login"
            className="inline-flex min-h-[52px] items-center rounded-xl bg-gradient-to-r from-gold-from to-gold-to px-8 text-base font-semibold text-on-gold transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            Create your free account
          </Link>
          <Link
            href="/league"
            className="inline-flex min-h-[52px] items-center rounded-xl border border-line-strong px-6 text-sm font-semibold text-ink transition-colors hover:border-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            See the League
          </Link>
        </div>
        <dl className="mt-12 grid gap-6 sm:grid-cols-3">
          {NUMBERS.map((item) => (
            <div key={item.label}>
              <dd className="font-serif text-4xl font-bold tabular-nums text-gold">{item.figure}</dd>
              <dt className="mt-1 text-sm text-muted">{item.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* ── Brand art band ───────────────────────────────────────────────── */}
      <section className="mt-14 overflow-hidden rounded-2xl border border-line bg-surface px-4 py-8 md:px-10">
        <HeroVisual />
      </section>

      {/* ── What you get ─────────────────────────────────────────────────── */}
      <section className="mt-16">
        <h2 className="font-serif text-3xl font-bold tracking-tight text-ink md:text-4xl">
          Three ways in. One account.
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {PREVIEW.map(({ Icon, title, line }) => (
            <div key={title} className="rounded-2xl border border-line bg-surface p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-surface-2 text-gold">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-5 font-serif text-xl font-bold text-ink">{title}</h3>
              <p className="mt-2 text-sm text-muted">{line}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Closing CTA ──────────────────────────────────────────────────── */}
      <section className="mt-16 rounded-2xl border border-line bg-surface p-8 text-center md:p-12">
        <h2 className="font-serif text-3xl font-bold tracking-tight text-ink md:text-4xl">
          Your first quiz is one tap away.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-muted">
          Free account, no card. Start with 500 questions in your subject.
        </p>
        <Link
          href="/login"
          className="mt-8 inline-flex min-h-[52px] items-center rounded-xl bg-gradient-to-r from-gold-from to-gold-to px-8 text-base font-semibold text-on-gold transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          Create your free account
        </Link>
      </section>
    </main>
  );
}
