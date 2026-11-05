import { getCurrentUser } from "@/lib/server-auth";
import { buildTranscript } from "@/lib/assessment";
import prisma from "@/lib/db";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Competency transcript — Gnostiri University",
  description: "Live competency record across every concept you have demonstrated.",
};

export const dynamic = "force-dynamic";

const LEVELS: Record<string, { label: string; classes: string }> = {
  mastery: { label: "Mastery", classes: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300" },
  proficient: { label: "Proficient", classes: "bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300" },
  developing: { label: "Developing", classes: "bg-amber-100 text-amber-800 dark:bg-gold/15 dark:text-amber-300" },
};

export default async function TranscriptPage() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-400">
          <Link href="/university" className="inline-flex items-center gap-1.5 rounded transition-colors hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold">
            <ArrowLeft className="h-4 w-4" aria-hidden /> University
          </Link>
          <span className="mx-2 text-slate-600" aria-hidden>/</span>
          <span className="text-slate-300">Transcript</span>
        </nav>
        <h1 className="text-2xl font-bold">Competency transcript</h1>
        <p className="mt-4 text-slate-400">Sign in to view your competency record.</p>
        <Link
          href="/login"
          className="mt-5 inline-flex min-h-[44px] items-center rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-on-gold transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          Sign in to continue
        </Link>
      </main>
    );
  }

  const programmeId = null;
  const { lines } = await buildTranscript(user.id, programmeId ?? undefined);
  const stats = {
    mastery: lines.filter((l) => l.level === "mastery").length,
    proficient: lines.filter((l) => l.level === "proficient").length,
    developing: lines.filter((l) => l.level === "developing").length,
  };

  const programmes = await prisma.programme.findMany({
    where: { isPublished: true },
    select: { id: true, name: true, degreeAwarded: true },
  });

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <header className="border-b pb-8">
        <p className="text-sm font-medium uppercase tracking-widest text-slate-400">Gnostiri University</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Competency transcript</h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          A live record of every concept you have demonstrated, drawn from your mastery data. Levels update the moment an exam or review is scored.
        </p>
      </header>

      <section className="mt-8 grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-line bg-surface p-5">
          <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{stats.mastery}</div>
          <div className="text-sm text-slate-400">At mastery</div>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-5">
          <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">{stats.proficient}</div>
          <div className="text-sm text-slate-400">Proficient</div>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-5">
          <div className="text-3xl font-bold text-amber-600 dark:text-gold">{stats.developing}</div>
          <div className="text-sm text-slate-400">Developing</div>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-semibold">Concept record</h2>
          <span className="text-sm text-slate-400">{lines.length} concepts</span>
        </div>

        <ul className="mt-4 divide-y rounded-2xl border border-line bg-surface">
          {lines.length === 0 ? (
            <li className="p-8 text-center text-slate-400">
              No concepts attempted yet. Visit a course and start a revision queue or exam.
            </li>
          ) : (
            lines.map((line) => {
              const level = LEVELS[line.level] ?? LEVELS.developing;
              return (
                <li key={`${line.code}-${line.title}`} className="flex items-start gap-4 p-5">
                  <span className="mt-0.5 w-16 shrink-0 font-mono text-xs text-slate-400">{line.code}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium leading-snug">{line.title}</p>
                    <p className="mt-1 text-sm text-slate-400">{line.evidence}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${level.classes}`}>{level.label}</span>
                </li>
              );
            })
          )}
        </ul>
      </section>

      <section className="mt-12 rounded-2xl border border-line bg-slate-500/10 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Programmes</h2>
        <p className="mt-2 text-sm text-slate-400">
          Transcripts are issued per programme once you are enrolled. The following programmes are open:
        </p>
        <ul className="mt-4 space-y-2">
          {programmes.map((p) => (
            <li key={p.id} className="flex items-center justify-between rounded-lg border border-line bg-surface px-4 py-3">
              <span className="font-medium">{p.name}</span>
              <span className="text-sm text-slate-400">{p.degreeAwarded}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}