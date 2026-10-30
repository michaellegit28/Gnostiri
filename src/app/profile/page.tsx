import Link from "next/link";
import { redirect } from "next/navigation";
import { Coins, Crown, RotateCcw, Settings, Trophy } from "lucide-react";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { hasPremiumAccess } from "@/lib/entitlements";

export const dynamic = "force-dynamic";

/**
 * Profile — the mobile bottom-tab destination and the drawer's "Profile &
 * settings" entry: who you are, what you hold, and every setting in one list.
 */
export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const premium = await hasPremiumAccess(user.id, "highschool");
  const [credits, badges] = await Promise.all([
    prisma.leagueCredit.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.leagueBadge.findMany({ where: { userId: user.id }, orderBy: { awardedAt: "desc" } }),
  ]);
  const balance = credits.reduce((sum, row) => sum + row.delta, 0);

  return (
    <main className="mx-auto max-w-2xl px-5 py-8 md:py-12">
      <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Profile</p>
      <h1 className="mt-3 font-serif text-3xl font-bold text-slate-100 md:text-4xl">
        {user.name ?? user.email ?? "Your account"}
      </h1>
      <p className="mt-2 text-sm text-slate-400">{user.email ?? ""}</p>

      <div className="mt-8 rounded-2xl border border-gold/30 bg-gold/[0.06] p-6">
        <div className="flex items-center gap-2">
          <Crown className="h-4 w-4 text-gold" aria-hidden />
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Membership</h2>
        </div>
        <p className="mt-3 font-serif text-2xl font-bold text-slate-100">
          {premium ? "Gnostiri Prime" : "Free plan"}
        </p>
        <p className="mt-2 text-sm text-slate-400">
          {premium
            ? "Prime is active — paid cups, the full Desk pipeline and premium tutor access are open."
            : "Prime unlocks the full Desk pipeline, premium cups and the complete library."}
        </p>
        <Link
          href="/pricing"
          className="mt-5 inline-flex min-h-[44px] items-center rounded-xl bg-gold px-6 font-semibold text-slate-950 transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          {premium ? "Manage membership" : "See Gnostiri Prime"}
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-gold" aria-hidden />
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted">Credits</h2>
          </div>
          <p className="mt-3 font-serif text-3xl font-bold tabular-nums text-slate-100">{balance}</p>
          <p className="mt-1 text-xs text-muted">Redeemable for Prime days — the team handles redemption during the founder period.</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-gold" aria-hidden />
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted">Badges</h2>
          </div>
          <p className="mt-3 font-serif text-3xl font-bold tabular-nums text-slate-100">{badges.length}</p>
          <p className="mt-1 text-xs text-muted">Earned in the Public Library and the Merit League.</p>
        </div>
      </div>

      {badges.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-2">
          {badges.map((badge) => (
            <li
              key={badge.id}
              className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1.5 text-xs font-semibold text-amber-200"
            >
              🏆 {badge.label}
            </li>
          ))}
        </ul>
      )}

      <nav aria-label="Profile links" className="mt-8 divide-y divide-white/5 border-y border-white/5">
        {[
          { href: "/university/revision", label: "Revision Queue", note: "Concepts due for review", Icon: RotateCcw },
          { href: "/library/credits", label: "Credits & badges", note: "Full reward ledger", Icon: Coins },
          { href: "/notifications", label: "Notifications", note: "Feed and delivery preferences", Icon: Trophy },
          { href: "/settings", label: "Appearance & accessibility", note: "Background, motion, contrast", Icon: Settings },
        ].map(({ href, label, note, Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex min-h-[52px] items-center gap-3 py-3.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <Icon className="h-5 w-5 text-slate-400 group-hover:text-gold" aria-hidden />
            <span>
              <span className="block font-semibold text-slate-100 group-hover:text-gold">{label}</span>
              <span className="block text-xs text-muted">{note}</span>
            </span>
            <span className="ml-auto text-slate-400 group-hover:text-gold" aria-hidden>
              →
            </span>
          </Link>
        ))}
      </nav>
    </main>
  );
}
