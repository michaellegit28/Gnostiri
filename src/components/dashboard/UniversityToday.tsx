import Link from "next/link";
import prisma from "@/lib/db";
import { ArrowRight, GraduationCap, RotateCcw, Sparkles } from "lucide-react";

/**
 * University Today — the University half of Home (IA rework: Home is
 * explicitly split per lane; the two lanes never collapse). Strictly
 * lane-separated: no High School surface (no GSE, no battle plan) ever
 * renders here. Reads real rows; degrades honestly on a failed read.
 */
export default async function UniversityToday({ userId }: { userId: string }) {
  const now = new Date();
  let dueCount: number | null = null;

  try {
    dueCount = await prisma.conceptMastery.count({
      where: { userId, nextReviewDue: { lte: now } },
    });
  } catch {
    dueCount = null;
  }

  const due = dueCount ?? 0;

  return (
    <section
      aria-labelledby="uni-today-title"
      className="gn-card rounded-2xl border border-line bg-surface p-5 md:p-7"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-electric-text">
        University roadmap
      </p>
      <h2 id="uni-today-title" className="mt-1 font-serif text-2xl font-bold text-ink md:text-3xl">
        Today&apos;s path
      </h2>

      {dueCount === null ? (
        <p role="status" className="mt-3 max-w-2xl text-sm text-muted">
          Your revision schedule is temporarily unavailable — nothing is inferred after a failed read.
        </p>
      ) : due > 0 ? (
        <>
          <p className="mt-3 max-w-2xl text-sm text-muted">
            {due} concept{due === 1 ? "" : "s"} due for review today — the scheduler keeps them just in time.
          </p>
          <Link
            href="/university/revision"
            className="gn-motion mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            Start revision
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </>
      ) : (
        <>
          <p className="mt-3 max-w-2xl text-sm text-muted">
            Nothing is due right now — pull a lesson forward, or your next review appears here when the scheduler says so.
          </p>
          <Link
            href="/university"
            className="gn-motion mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <GraduationCap className="h-4 w-4" aria-hidden />
            Open your courses
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </>
      )}

      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-4">
        <Link
          href="/university/ai"
          className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-electric-text underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Sparkles className="h-4 w-4" aria-hidden />
          AI Studio
        </Link>
        <Link
          href="/university"
          className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-electric-text underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <GraduationCap className="h-4 w-4" aria-hidden />
          Courses
        </Link>
      </div>
    </section>
  );
}