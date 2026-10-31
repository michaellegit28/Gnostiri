import Link from "next/link";
import { LogoMark } from "@/components/brand/Logo";

/**
 * Signed-out landing band — what Gnostiri is, in numbers, with one action.
 * No study categories (those live under /study), no adjectives doing a
 * number's job. Everything below is proven in production today.
 */
const PROOF = [
  { figure: "5,997", label: "JAMB questions, machine-verified" },
  { figure: "22", label: "university courses, authored in full" },
  { figure: "4", label: "competition formats, live" },
];

export default function LandingBand() {
  return (
    <section className="w-full rounded-2xl border border-line bg-surface p-8 md:p-12">
      <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <div className="flex items-center gap-3">
            <LogoMark size={40} />
            <span className="font-serif text-2xl font-bold tracking-tight text-ink">Gnostiri</span>
          </div>
          <h1 className="mt-6 font-serif text-3xl font-bold leading-tight text-ink md:text-4xl">
            Study for the exam you&apos;re actually sitting.
          </h1>
          <p className="mt-4 text-base text-muted">
            Real questions, full courses, an assistant that reads your notes, and a league that
            ranks you against students across the country. Free to start.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="inline-flex min-h-[48px] items-center rounded-xl bg-gold px-7 font-semibold text-on-gold transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              Create your free account
            </Link>
            <Link
              href="/league"
              className="inline-flex min-h-[48px] items-center rounded-xl border border-line-strong px-6 text-sm font-semibold text-ink transition-colors hover:border-gold/60 hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              See the League
            </Link>
          </div>
        </div>
        <dl className="grid w-full gap-4 md:w-auto">
          {PROOF.map((item) => (
            <div key={item.label} className="rounded-xl border border-line bg-surface-2 px-6 py-4">
              <dd className="font-serif text-3xl font-bold tabular-nums text-gold">{item.figure}</dd>
              <dt className="mt-1 text-sm text-muted">{item.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
