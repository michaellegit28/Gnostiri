import prisma from "@/lib/db";
import { verificationCode, type CertificateFields } from "@/lib/certificate";
import { tierInfo } from "@/lib/ranking";

export const dynamic = "force-dynamic";

// Public certificate verification — what makes the PDF *verified* rather than
// a pretty picture. A 12-character code is pasted (or linked as ?code=), this
// page recomputes the HMAC of EVERY Hall of Fame entry and reports the one it
// belongs to — season, tier, group and placement — or says plainly that no
// certificate matches.
//
// Nothing is stored: the code is a derived value, so the check is always a
// fresh recomputation over the live hall. A forged code therefore has nothing
// to collide with, and a re-engraved entry invalidates its old code by design.
//
// This page is public by intent: anyone holding a certificate can check it,
// including the member who lost theirs.

/**
 * Bound on the recomputation scan: the whole hall, newest first. A code from
 * an entry beyond this bound (a season long since closed, pushed out by newer
 * engravings) honestly reports "No matching certificate" rather than being
 * checked against a half-read hall.
 */
const MAX_ENTRIES = 2000;

interface VerificationResult {
  code: string;
  entry: { seasonSlug: string; tier: number; rank: number; groupName: string; rosterSize: number };
  seasonName: string;
}

/** Recompute every code in the hall and return the entry this code signs. */
async function findByCode(code: string): Promise<VerificationResult | null> {
  if (!code) return null;
  const entries = await prisma.hallOfFameEntry.findMany({
    orderBy: [{ createdAt: "desc" }],
    take: MAX_ENTRIES,
  });
  if (entries.length === 0) return null;

  const seasons = await prisma.season.findMany({ select: { slug: true, name: true } });
  const nameOf = new Map(seasons.map((s) => [s.slug, s.name]));

  const wanted = code.trim().toLowerCase();
  const match = entries.find(
    (entry) => verificationCode(entry satisfies CertificateFields) === wanted,
  );
  if (!match) return null;

  return {
    code: wanted,
    entry: {
      seasonSlug: match.seasonSlug,
      tier: match.tier,
      rank: match.rank,
      groupName: match.groupName,
      rosterSize: match.rosterJson.length,
    },
    seasonName: nameOf.get(match.seasonSlug) ?? match.seasonSlug,
  };
}

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: { code?: string | string[] };
}) {
  const code = typeof searchParams.code === "string" ? searchParams.code : "";
  const result = code ? await findByCode(code) : null;

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 md:py-20">
      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Verify a certificate</p>
      <h1 className="mt-2 font-serif text-3xl font-bold text-slate-100 md:text-4xl">Check a season certificate</h1>
      <p className="mt-3 text-sm text-slate-400">
        Every season certificate carries a 12-character verification code. Paste it below and we recompute the signature of
        every Hall of Fame entry, live: the code only resolves if a real engraving produced it.
      </p>

      <form action="/verify" method="get" className="mt-8">
        <label htmlFor="code" className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          Verification code
        </label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <input
            id="code"
            name="code"
            defaultValue={code}
            placeholder="e.g. f2d31dbbd9ae"
            spellCheck={false}
            autoComplete="off"
            maxLength={64}
            className="min-h-[44px] flex-1 rounded-xl border border-slate-700 bg-slate-950/60 px-4 font-mono text-sm uppercase tracking-widest text-slate-100 placeholder:text-slate-600 focus:border-gold focus:outline-none"
          />
          <button
            type="submit"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-gold px-6 font-semibold text-slate-950 transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            Verify
          </button>
        </div>
      </form>

      {code && (
        <div className="mt-8" aria-live="polite">
          {result ? (
            <section className="rounded-2xl border border-gold/40 bg-slate-900/70 p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">Certificate verified</p>
              <h2 className="mt-2 font-serif text-2xl font-bold text-slate-100">
                Season {result.seasonName} · {tierInfo(result.entry.tier).label}
              </h2>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-slate-500">Placement</dt>
                  <dd className="font-semibold text-slate-100">
                    {result.entry.rank === 1
                      ? "Champion"
                      : result.entry.rank === 2
                        ? "Runner-up"
                        : result.entry.rank === 3
                          ? "Third"
                          : `Rank ${result.entry.rank}`}{" "}
                    of {tierInfo(result.entry.tier).label}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Group</dt>
                  <dd className="font-semibold text-slate-100">{result.entry.groupName}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Season</dt>
                  <dd className="font-semibold text-slate-100">
                    {result.seasonName} ({result.entry.seasonSlug})
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Group size</dt>
                  <dd className="font-semibold text-slate-100">{result.entry.rosterSize} members</dd>
                </div>
              </dl>
              <p className="mt-4 font-mono text-xs text-slate-500">code {result.code}</p>
            </section>
          ) : (
            <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
              <p className="font-serif text-xl font-bold text-slate-100">No matching certificate</p>
              <p className="mt-2 text-sm text-slate-400">
                No Hall of Fame entry in any season produces this code. Check the characters, or ask the winner for the
                code printed at the bottom of their certificate.
              </p>
            </section>
          )}
        </div>
      )}
    </main>
  );
}
