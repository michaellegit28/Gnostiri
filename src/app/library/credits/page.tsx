import Link from "next/link";
import { Coins, Medal, Receipt } from "lucide-react";
import { getCurrentUser } from "@/lib/server-auth";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * /library/credits — the reward ledger for the signed-in learner.
 *
 * Current Prime-day credit balance (the running sum of the LeagueCredit
 * ledger), the badges held, and the last 20 credit events. Redemption is
 * deliberately NOT self-serve: during the founder period Prime days are
 * granted by the team against this balance, so there is no fake redeem button.
 */
export default async function CreditsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="min-h-screen bg-transparent text-slate-100 p-6 md:p-12">
        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/80 p-8 text-center">
          <Coins className="mx-auto mb-4 h-10 w-10 text-gold" />
          <h1 className="font-serif text-2xl font-bold">Sign in to see your rewards</h1>
          <p className="mt-2 text-sm text-slate-400">Your badge shelf and Prime-day credit balance live on your account.</p>
          <Link href="/login" className="mt-6 inline-block rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-slate-950">
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  const [balance, badges, history] = await Promise.all([
    prisma.leagueCredit.aggregate({ where: { userId: user.id }, _sum: { delta: true } }),
    prisma.leagueBadge.findMany({ where: { userId: user.id }, orderBy: { awardedAt: "desc" } }),
    prisma.leagueCredit.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 20 }),
  ]);

  const credits = balance._sum.delta ?? 0;

  return (
    <div className="min-h-screen bg-transparent text-slate-100 p-6 md:p-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-2">
          <p className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-gold">
            <Coins className="h-4 w-4" /> Rewards
          </p>
          <h1 className="font-serif text-3xl font-bold">Badges &amp; Prime-day credits</h1>
          <p className="text-sm text-slate-400">Everything you earned by sharing artifacts your cohort adopted.</p>
        </header>

        <section className="rounded-2xl border border-gold/30 bg-gold/5 p-6">
          <p className="text-[11px] uppercase tracking-[0.2em] text-gold">Credit balance</p>
          <p className="mt-1 font-serif text-4xl font-bold text-gold">{credits}</p>
          <p className="mt-1 text-xs text-slate-400">
            Redeeming credits for Prime days is handled by the team during the founder period — there is no self-serve redeem button yet.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="inline-flex items-center gap-2 font-serif text-xl font-bold">
            <Medal className="h-5 w-5 text-gold" /> Badges held ({badges.length})
          </h2>
          {badges.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-700 p-6 text-sm text-slate-500">
              No badges yet — share a processed document to earn your first one.
            </p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {badges.map((badge) => (
                <li
                  key={badge.id}
                  className="inline-flex flex-col rounded-xl border border-gold/30 bg-slate-900/70 px-3 py-2 text-sm"
                  title={`${badge.key} · ${badge.awardedAt.toISOString().slice(0, 10)}`}
                >
                  <span className="font-semibold text-gold">{badge.label}</span>
                  <span className="text-[11px] text-slate-500">{badge.awardedAt.toISOString().slice(0, 10)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="inline-flex items-center gap-2 font-serif text-xl font-bold">
            <Receipt className="h-5 w-5 text-gold" /> Earn history (last 20)
          </h2>
          {history.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-700 p-6 text-sm text-slate-500">No credit events yet.</p>
          ) : (
            <ul className="divide-y divide-slate-800 overflow-hidden rounded-xl border border-slate-800">
              {history.map((row) => (
                <li key={row.id} className="flex items-center justify-between gap-3 bg-slate-900/60 px-4 py-3 text-sm">
                  <span className="text-slate-200">
                    {row.delta > 0 ? "+" : ""}
                    {row.delta} · <span className="text-slate-400">{row.reason}</span>
                  </span>
                  <span className="whitespace-nowrap text-xs text-slate-500">
                    balance {row.balanceAfter} · {row.createdAt.toISOString().slice(0, 10)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
