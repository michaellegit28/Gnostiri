import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { FORMAT_META, type CompetitionFormat } from "@/lib/competition";
import { MASTERY_TARGET_LABEL } from "@/lib/competition-additions";
import MasteryCupClient from "@/components/league/MasteryCupClient";

export const dynamic = "force-dynamic";

/**
 * /league/[id]/mastery — the Mastery Cup surface.
 *
 * Gated exactly like the Speed Cup's play page: the board is only ever handed
 * to a signed-in member of the cup. The target is derived (MASTERY_TARGET —
 * a constant, no schema column), the progress is the member's live mean
 * ConceptMastery.masteryScore over the cup's subject, and the first member
 * past the target takes rank 1. Nothing on this page is client-reported.
 */
export default async function MasteryPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  const competition = await prisma.competition.findUnique({ where: { id: params.id } });
  if (!competition) notFound();

  const meta = FORMAT_META[(competition.format as CompetitionFormat) ?? "speed"] ?? FORMAT_META.speed;
  const hrefBack = `/league/${competition.id}`;

  if (!user) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-20 text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">{meta.label}</p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-slate-100">Sign in to compete</h1>
        <p className="mt-3 text-slate-400">Your mastery, your progress and your ladder position all sit behind your account.</p>
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
        <h1 className="mt-3 font-serif text-3xl font-bold text-slate-100">Join {competition.title} first</h1>
        <p className="mt-3 text-slate-400">
          {competition.visibility === "public"
            ? "Members race to the mastery target — join, then raise yours."
            : "This is an invite cup: ask the host for the invite code, then join."}
        </p>
        <Link
          href="/league/join"
          className="mt-8 inline-flex min-h-[44px] items-center rounded-xl bg-gold px-6 font-semibold text-slate-950 transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          Join cup
        </Link>
      </main>
    );
  }

  if (competition.format !== "mastery") {
    return (
      <main className="mx-auto max-w-2xl px-6 py-20 text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">{meta.label}</p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-slate-100">This is not a Mastery Cup</h1>
        <p className="mt-3 text-slate-400">The Mastery Cup surface only serves cups created in the mastery format.</p>
        <Link
          href={hrefBack}
          className="mt-8 inline-flex min-h-[44px] items-center rounded-xl bg-gold px-6 font-semibold text-slate-950 transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          Back to the cup
        </Link>
      </main>
    );
  }

  return (
    <MasteryCupClient competitionId={competition.id} />
  );
}
