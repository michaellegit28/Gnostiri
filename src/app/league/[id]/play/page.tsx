import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { FORMAT_META, type CompetitionFormat } from "@/lib/competition";
import CupPlayClient from "@/components/league/CupPlayClient";

export const dynamic = "force-dynamic";

/**
 * /league/[id]/play — the live Speed Cup surface.
 *
 * Gated here so the paper is only ever handed to a signed-in member of the
 * cup; CupPlayClient then draws the session (and the server-anchored clock)
 * from /api/competitions/[id]/session. Nothing about the questions — least of
 * all an answer key — is rendered on the server: the paper arrives from the
 * session API at play time.
 */
export default async function PlayPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  const competition = await prisma.competition.findUnique({ where: { id: params.id } });
  if (!competition) notFound();

  const hrefBack = `/league/${competition.id}`;
  const meta = FORMAT_META[(competition.format as CompetitionFormat) ?? "speed"] ?? FORMAT_META.speed;

  if (!user) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-20 text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">{meta.label}</p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-slate-100">Sign in to play</h1>
        <p className="mt-3 text-slate-400">Your paper, your score and your ladder position all sit behind your account.</p>
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
            ? "Members get a paper and a ladder position — join, then play."
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

  if (competition.status === "cancelled" || competition.status === "finished" || competition.format !== "speed") {
    return (
      <main className="mx-auto max-w-2xl px-6 py-20 text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">{meta.label}</p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-slate-100">Play is closed for this cup</h1>
        <p className="mt-3 text-slate-400">The ladder is final — see where the field finished.</p>
        <Link
          href={`${hrefBack}/results`}
          className="mt-8 inline-flex min-h-[44px] items-center rounded-xl bg-gold px-6 font-semibold text-slate-950 transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          See results
        </Link>
      </main>
    );
  }

  return (
    <CupPlayClient
      competitionId={competition.id}
      title={competition.title}
      hrefBack={hrefBack}
      hrefResults={`${hrefBack}/results`}
    />
  );
}
