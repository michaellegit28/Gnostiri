import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { bracketSubmit } from "@/lib/competition-additions";

export const dynamic = "force-dynamic";

interface SubmittedAnswer {
  questionId: unknown;
  selected: unknown;
}

// POST /api/competitions/[id]/bracket/submit — play your quickfire round.
//
// The paper is RE-DERIVED from (cup, round, matchIndex) — the same five
// questions the bracket GET dealt this player — so nothing has to be stored
// between the deal and the mark, and the answer key is read here, AFTER the
// answers exist. Only ids from THIS match's set, each once, and only a served
// option: a tampered client is rejected, not scored.
//
// The posted score is best-of (a retry can only improve it) until the
// opponent posts too — then the pairing is FROZEN, because re-grinding a
// decided match to flip its result is exactly the client-trust hole the Merit
// League refuses to build. The winner is the higher stored round score; ties
// advance the higher seed.
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const competition = await prisma.competition.findUnique({ where: { id: params.id } });
  if (!competition) return NextResponse.json({ error: "Competition not found" }, { status: 404 });

  const member = await prisma.competitionMember.findUnique({
    where: { competitionId_userId: { competitionId: competition.id, userId: user.id } },
    include: { user: { select: { name: true } } },
  });
  if (!member) return NextResponse.json({ error: "Competition not found" }, { status: 404 });

  if (competition.format !== "bracket") {
    return NextResponse.json({ error: "This endpoint serves Cohort Brackets only" }, { status: 400 });
  }
  if (competition.status === "cancelled" || competition.status === "finished") {
    return NextResponse.json({ error: "This cup is no longer live" }, { status: 400 });
  }

  const body = (await req.json().catch(() => null)) as { answers?: SubmittedAnswer[] } | null;
  const answers = body?.answers;
  if (!Array.isArray(answers) || answers.length === 0) {
    return NextResponse.json({ error: "Answers required" }, { status: 400 });
  }
  const parsed: { questionId: string; selected: string }[] = [];
  for (const entry of answers) {
    const questionId = typeof entry?.questionId === "string" ? entry.questionId : null;
    const selected = typeof entry?.selected === "string" ? entry.selected : null;
    if (!questionId || selected === null) {
      return NextResponse.json({ error: "Each answer needs a questionId and a selected option" }, { status: 400 });
    }
    parsed.push({ questionId, selected });
  }

  const members = await prisma.competitionMember.findMany({
    where: { competitionId: competition.id },
    include: { user: { select: { name: true } } },
    orderBy: [{ joinedAt: "asc" }, { userId: "asc" }],
  });

  try {
    const result = await bracketSubmit(prisma, competition, members, member, parsed);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "This round could not be scored";
    const frozen = message.includes("already decided");
    return NextResponse.json({ error: message, frozen }, { status: frozen ? 409 : 400 });
  }
}
