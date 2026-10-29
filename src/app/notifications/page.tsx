import Link from "next/link";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import PreferencesForm from "@/components/notifications/PreferencesForm";

export const dynamic = "force-dynamic";

const TYPE_LABELS: Record<string, string> = {
  cup_starting: "Cup starting",
  streak_risk: "Streak at risk",
  overtaken: "Overtaken",
  bracket_invite: "Bracket invite",
  milestone: "Milestone",
  artifact_reward: "Artifact reward",
  season_result: "Season result",
  report_resolved: "Report resolved",
};

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function dayLabel(d: Date, now: Date): string {
  const days = Math.round(
    (new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() -
      new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()) /
      86_400_000
  );
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

function relativeTime(iso: Date | string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const seconds = Math.round((Date.now() - then) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

async function markAllRead() {
  "use server";
  const user = await getCurrentUser();
  if (!user) return;
  await prisma.notification.updateMany({
    where: { userId: user.id, read: false },
    data: { read: true },
  });
  revalidatePath("/notifications");
}

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-20 text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Notifications</p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-slate-100">Enter Gnostiri first</h1>
        <p className="mt-3 text-slate-400">Your notification feed lives behind your account — cups, streaks and results, one place.</p>
        <Link
          href="/login"
          className="mt-8 inline-flex min-h-[44px] items-center rounded-xl bg-gold px-6 font-semibold text-slate-950 transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          Sign in
        </Link>
      </main>
    );
  }

  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 200 }),
    prisma.notification.count({ where: { userId: user.id, read: false } }),
  ]);

  const now = new Date();
  const groups: { key: string; label: string; items: typeof notifications }[] = [];
  for (const n of notifications) {
    const key = dayKey(n.createdAt);
    let group = groups.find((g) => g.key === key);
    if (!group) {
      group = { key, label: dayLabel(n.createdAt, now), items: [] };
      groups.push(group);
    }
    group.items.push(n);
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12 md:py-16">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Notification centre</p>
          <h1 className="mt-2 font-serif text-3xl font-bold text-slate-100">Everything that needs you</h1>
          <p className="mt-2 text-sm text-slate-400">
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"} · in-app is primary, email is an opt-in backup
          </p>
        </div>
        {unreadCount > 0 && (
          <form action={markAllRead}>
            <button
              type="submit"
              className="flex min-h-[44px] items-center gap-2 rounded-xl border border-white/15 bg-slate-950/80 px-4 text-sm font-semibold text-slate-200 backdrop-blur-md transition-colors hover:border-gold/60 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              Mark all read
            </button>
          </form>
        )}
      </header>

      <div className="mt-10 space-y-10">
        {groups.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-slate-950/60 px-6 py-10 text-center text-sm text-slate-400">
            Nothing yet. We&apos;ll nudge you when a cup starts or a streak needs a freeze.
          </p>
        ) : (
          groups.map((group) => (
            <section key={group.key} className="space-y-3">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">{group.label}</h2>
              <ul className="divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 backdrop-blur-md">
                {group.items.map((n) => (
                  <li key={n.id}>
                    <Link
                      href={n.href ?? "/notifications"}
                      className={`group flex items-start justify-between gap-4 px-5 py-4 transition-colors hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                        n.read ? "" : "bg-gold/5"
                      }`}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          {!n.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />}
                          <span className="font-semibold text-slate-100 group-hover:text-gold">{n.title}</span>
                        </span>
                        <span className="mt-1 block text-sm text-slate-400">{n.body}</span>
                        <span className="mt-1.5 flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-slate-500">
                          <span>{TYPE_LABELS[n.type] ?? n.type}</span>
                          <span>{relativeTime(n.createdAt)}</span>
                        </span>
                      </span>
                      {n.href && (
                        <span className="mt-1 shrink-0 text-slate-600 transition-all group-hover:translate-x-1 group-hover:text-gold" aria-hidden="true">
                          →
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>

      <section className="mt-14 rounded-2xl border border-white/10 bg-slate-950/60 p-6 backdrop-blur-md">
        <h2 className="font-serif text-xl font-bold text-slate-100">Delivery preferences</h2>
        <p className="mt-1 text-sm text-slate-400">
          Email backup is opt-in and respects quiet hours. A muted type writes nothing at all.
        </p>
        <div className="mt-6">
          <PreferencesForm />
        </div>
      </section>
    </main>
  );
}
