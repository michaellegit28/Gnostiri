import Link from "next/link";
import { FileBadge, Medal } from "lucide-react";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { TIERS, displayHandle, tierInfo } from "@/lib/ranking";

export const dynamic = "force-dynamic";

// The Hall of Fame (Phase 7): every season's top three groups per tier.
//
// rosterJson holds DISPLAY NAMES ONLY — never an email, never a user id — so
// this page can be public without exposing who was beaten by whom. An empty
// hall is not a failure state: the first season close is what fills it.
//
// Phase 5 adds the reward itself: a member engraved here downloads their
// VERIFIED certificate (the button is rendered only when the signed-in
// member's own display name sits on that roster — the API re-checks), and
// anyone can check a certificate's code on /verify.

const RANK_LABEL = ["Champion", "Runner-up", "Third"];

export default async function HallOfFamePage() {
  const user = await getCurrentUser();
  // Server-checked entitlement: the download button only appears when the
  // signed-in member's DISPLAY NAME is engraved on that roster. The route
  // re-checks this against the row — this is the UI half of that gate.
  const myHandle = user ? displayHandle(user.name) : null;
  const canDownload = (roster: string[]) => Boolean(myHandle && roster.includes(myHandle));

  const entries = await prisma.hallOfFameEntry.findMany({
    orderBy: [{ seasonSlug: "desc" }, { tier: "asc" }, { rank: "asc" }],
    take: 400,
  });

  if (entries.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center md:py-24">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Hall of Fame</p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-slate-100 md:text-4xl">The first hall is empty</h1>
        <p className="mt-4 text-slate-400">
          The first hall is empty — Season 3 winners go here first. Top the ladder in your tier and your group&apos;s
          names are engraved with your season.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/league/ladder"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-primary px-6 font-semibold text-on-primary transition-colors hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Climb the ladder
          </Link>
          {!user && (
            <Link
              href="/login"
              className="inline-flex min-h-[44px] items-center rounded-xl border border-slate-700 px-5 font-semibold text-slate-200 transition-colors hover:border-slate-500"
            >
              Sign in
            </Link>
          )}
        </div>
      </main>
    );
  }

  const seasons = Array.from(new Set(entries.map((e) => e.seasonSlug)));

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:py-14">
      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Hall of Fame</p>
      <h1 className="mt-2 font-serif text-3xl font-bold text-slate-100 md:text-4xl">Engraved by season</h1>
      <p className="mt-3 max-w-2xl text-sm text-slate-400">
        Every season close engraves the top three groups of each tier. Rosters carry display names only — never an
        email, never an id. If your name is engraved here, your verified certificate is one click away.
      </p>

      {seasons.map((slug) => {
        const seasonEntries = entries.filter((e) => e.seasonSlug === slug);
        const closedAt = seasonEntries[0]?.createdAt;
        return (
          <section key={slug} className="mt-10">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="font-serif text-2xl font-bold text-slate-100">
                {slug === "s3-2026" ? "Season 3" : slug.replace(/^s(\d)-(\d{4})$/, "Season $1 ($2)")}
              </h2>
              {closedAt && (
                <span className="text-xs text-slate-500">
                  closed {closedAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              )}
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {TIERS.map((tier) => {
                const tierEntries = seasonEntries.filter((e) => e.tier === tier.tier);
                if (tierEntries.length === 0) return null;
                return (
                  <div key={tier.tier} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                    <h3 className="flex items-center gap-2 font-serif text-lg font-bold text-gold">
                      <Medal className="h-4 w-4" aria-hidden />
                      {tierInfo(tier.tier).label}
                    </h3>
                    <ol className="mt-4 space-y-4">
                      {tierEntries.map((entry) => (
                        <li key={entry.id}>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                            {RANK_LABEL[entry.rank - 1] ?? `Rank ${entry.rank}`} · {entry.groupName}
                          </p>
                          <p className="mt-1 text-sm text-slate-300">{entry.rosterJson.join(" · ") || "No roster recorded"}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            {Math.round(entry.avgStars).toLocaleString()} average stars
                          </p>
                          {canDownload(entry.rosterJson) && (
                            <a
                              href={`/api/ranking/certificate?season=${encodeURIComponent(entry.seasonSlug)}&member=${encodeURIComponent(user!.id)}`}
                              className="mt-3 inline-flex min-h-[36px] items-center gap-2 rounded-lg border border-gold/40 px-4 text-xs font-semibold text-gold transition-colors hover:bg-gold/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                            >
                              <FileBadge className="h-3.5 w-3.5" aria-hidden />
                              Download certificate
                            </a>
                          )}
                        </li>
                      ))}
                    </ol>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      <div className="mt-12 flex flex-wrap gap-3">
        <Link
          href="/league/ladder"
          className="inline-flex min-h-[44px] items-center rounded-xl border border-slate-700 px-6 font-semibold text-slate-200 transition-colors hover:border-slate-500"
        >
          Back to the ladder
        </Link>
        <Link
          href="/verify"
          className="inline-flex min-h-[44px] items-center rounded-xl border border-slate-700 px-6 font-semibold text-slate-200 transition-colors hover:border-slate-500"
        >
          Verify a certificate
        </Link>
      </div>
    </main>
  );
}
