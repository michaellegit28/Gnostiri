import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * TopicCard — one destination card for a topic/field/lesson: title, blurb,
 * optional tier tag + meta line, progress bar, and a Link CTA.
 * The whole card is a Link (keyboard + screen-reader navigable), never an
 * article with an onclick. `tone` keeps domain-specific backdrops.
 * Server-safe.
 */
export default function TopicCard({
  href,
  title,
  blurb,
  tag,
  tagAccent = "gold",
  meta,
  progress,
  cta = "Open",
  tone = "slate",
}: {
  href: string;
  title: string;
  blurb?: string;
  tag?: string;
  tagAccent?: "gold" | "teal" | "violet" | "emerald" | "rose";
  meta?: string;
  /** 0–100; omit to hide the bar. */
  progress?: number;
  cta?: string;
  tone?: "slate" | "violet";
}) {
  const tagColor = {
    gold: "text-gold",
    teal: "text-teal-300",
    violet: "text-violet-300",
    emerald: "text-emerald-300",
    rose: "text-rose-300",
  }[tagAccent];

  return (
    <Link
      href={href}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-xl hover:shadow-gold/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
        tone === "violet"
          ? "bg-gradient-to-b from-violet-950/40 via-slate-900 to-slate-950"
          : "bg-gradient-to-b from-white/[0.04] to-transparent"
      }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent ${
          tone === "violet" ? "via-violet-400/50" : "via-gold/40"
        }`}
      />
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-serif text-xl font-bold text-slate-50 transition-colors group-hover:text-gold">
          {title}
        </h3>
        {tag && (
          <span className={`shrink-0 text-xs font-semibold ${tagColor}`}>{tag}</span>
        )}
      </div>
      {blurb && <p className="mt-2 text-sm text-slate-400">{blurb}</p>}
      {meta && <p className="mt-3 text-xs text-slate-500">{meta}</p>}
      {typeof progress === "number" && (
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gold"
            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
          />
        </div>
      )}
      <span className="mt-5 inline-flex min-h-[44px] items-center gap-2 self-start rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition-colors group-hover:border-transparent group-hover:bg-gold group-hover:text-slate-950">
        {cta}
        <ArrowRight className="w-4 h-4" />
      </span>
    </Link>
  );
}
