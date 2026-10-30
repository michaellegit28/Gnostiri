"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Crown } from "lucide-react";

/**
 * PrimeBadge — membership status at a glance (ROADMAP.md §6: Gnostiri Prime).
 * Shows tier + consecutive months for Prime members; a quiet upgrade prompt
 * for everyone else. Tenure is status in the Merit League, so it travels with
 * the member everywhere.
 */
export default function PrimeBadge() {
  const [state, setState] = useState<{ loading: boolean; premium: boolean; months: number }>({
    loading: true,
    premium: false,
    months: 0,
  });

  useEffect(() => {
    let alive = true;
    fetch("/api/entitlements/prime")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (alive && data) setState({ loading: false, premium: !!data.premium, months: data.months ?? 0 });
        if (alive && !data) setState((s) => ({ ...s, loading: false }));
      })
      .catch(() => {
        if (alive) setState((s) => ({ ...s, loading: false }));
      });
    return () => {
      alive = false;
    };
  }, []);

  if (state.loading) {
    return <div className="h-9 w-28 animate-pulse rounded-full border border-white/10 bg-white/5" aria-hidden />;
  }

  if (state.premium) {
    return (
      <Link
        href="/pricing"
        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-gold/50 bg-gold/15 px-3 py-1.5 text-xs font-semibold text-amber-200 transition-colors hover:bg-gold/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        <Crown className="h-3.5 w-3.5" aria-hidden />
        Prime · {state.months} {state.months === 1 ? "month" : "months"}
      </Link>
    );
  }

  return (
    <Link
      href="/pricing"
      className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-slate-300 transition-colors hover:border-gold/50 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
    >
      <Crown className="h-3.5 w-3.5" aria-hidden />
      Go Prime
    </Link>
  );
}
