import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { FORMAT_META, type CompetitionFormat } from "@/lib/competition";
import EnduranceCupClient from "@/components/league/EnduranceCupClient";

export const dynamic = "force-dynamic";

/**
 * /league/[id]/endurance — the Endurance Cup surface.
 *
 * Gated like every other cup surface: signed-in members only. The streak,
 * the ladder and the check-in all live behind the API (the server is the
 * only writer) — this page only decides who may see it.
 */
export default async function EndurancePage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  const competition = await prisma.competition.findUnique({ where: { id: params.id } });
  if (!competition) notFound();
  if (competition.format !== "endurance") notFound();

  const meta = FORMAT_META[(competition.format as CompetitionFormat) ?? "speed"] ?? FORMAT_META.speed;

  if (!user) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-20 text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">{meta.label}</p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-slate-100">Sign in to compete</h1>
        <p className="mt-3 text-slate-400">Your streak, your ladder position and your milestones all sit behind your account.</p>
        <Link
          href="/login"
          className="mt-8 inline-flex min-h-[44px] items-center rounded-xl bg-gold px-6 font-semibold text-slate-950 transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          Sign in
        </Link>
      </main>
    );
  }

  const member = await prisma.competitionMember.findUnique({
    where: { competitionId_userId: { competitionId: competition.id, userId: user.id } },
  });
  if (!member) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-20 text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">{meta.label}</p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-slate-100">Join the cup first</h1>
        <p className="mt-3 text-slate-400">Endurance is a members-only ladder — take your place, then start the run.</p>
        <Link
          href={`/league/join`}
          className="mt-8 inline-flex min-h-[44px] items-center rounded-xl bg-gold px-6 font-semibold text-slate-950 transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          Join a cup
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <header>
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">{meta.label}</p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-slate-100 md:text-4xl">{competition.title}</h1>
        <p className="mt-3 text-sm text-slate-400">{meta.blurb} — one check-in per day, {meta.duration.toLowerCase()}.</p>
        <Link href={`/league/${competition.id}`} className="mt-4 inline-block text-xs text-slate-500 hover:text-gold">
          ← Back to the cup
        </Link>
      </header>
      <div className="mt-8">
        <EnduranceCupClient competitionId={competition.id} />
      </div>
    </main>
  );
}
