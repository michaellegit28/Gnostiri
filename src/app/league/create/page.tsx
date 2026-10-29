import Link from "next/link";
import { getCurrentUser } from "@/lib/server-auth";
import prisma from "@/lib/db";
import { COMPETITION_FORMATS, FORMAT_META, evaluateLeagueEligibility } from "@/lib/competition";
import CreateCupForm, { type FormatOption } from "@/components/league/CreateCupForm";

export const dynamic = "force-dynamic";

export default async function CreateCupPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Merit League</p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-slate-100">Sign in to host a cup</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-slate-400">
          Hosting is gated on Prime tenure and demonstrated performance. Sign in so we can check your eligibility.
        </p>
        <Link
          href="/login"
          className="mt-8 inline-flex min-h-[44px] items-center rounded-xl bg-gold px-6 font-semibold text-slate-950 transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          Sign in
        </Link>
      </main>
    );
  }

  // Real subject roots for the datalist — the highschool, top-level topics.
  const roots = await prisma.topic.findMany({
    where: { domain: "highschool", parentId: null },
    orderBy: { orderIndex: "asc" },
    take: 60,
    select: { slug: true, title: true },
  });
  const subjects = Array.from(
    new Set(roots.map((r) => r.slug ?? r.title).filter((s): s is string => !!s)),
  );

  const eligibility = await evaluateLeagueEligibility(user.id);

  const formats: FormatOption[] = COMPETITION_FORMATS.map((format) => {
    const meta = FORMAT_META[format];
    return { value: format, label: meta.label, blurb: meta.blurb, duration: meta.duration };
  });

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <header>
        <Link href="/league" className="text-sm text-slate-400 hover:text-white">
          ← Merit League
        </Link>
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Host a cup</p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-slate-100">Create a Merit League cup</h1>
        <p className="mt-2 text-sm text-slate-400">
          Four formats, open or invite-only. You join as the host (anonymous by default). Scores are always reconciled server-side.
        </p>
      </header>

      <div className="mt-8">
        <CreateCupForm
          formats={formats}
          subjects={subjects}
          initialEligible={eligibility.eligible}
          initialReasons={eligibility.reasons}
        />
      </div>
    </main>
  );
}
