import type { LucideIcon } from "lucide-react";

export type StatAccent = "gold" | "teal" | "violet" | "emerald" | "rose";

const ACCENT_TEXT: Record<StatAccent, string> = {
  gold: "text-gold",
  teal: "text-teal-300",
  violet: "text-violet-300",
  emerald: "text-emerald-300",
  rose: "text-rose-300",
};

/**
 * StatCard — label + big serif value + optional note, in a bordered panel with
 * a soft accent glow. Mirrors the pattern used across dashboards/overviews.
 * Render inside a <dl> so label/value keep definition-list semantics.
 * Server-safe (no state, no events).
 */
export default function StatCard({
  label,
  value,
  note,
  icon: Icon,
  accent = "gold",
  children,
}: {
  label: string;
  value?: string | number;
  note?: string;
  icon?: LucideIcon;
  accent?: StatAccent;
  children?: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-5">
      {Icon && (
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute -right-5 -top-6 opacity-10 ${ACCENT_TEXT[accent]}`}
        >
          <Icon className="h-20 w-20" />
        </span>
      )}
      <dt className="relative text-xs font-semibold uppercase tracking-label text-slate-400">
        {label}
      </dt>
      <dd className="relative mt-1 font-serif text-3xl font-bold text-slate-50">
        {value != null && value !== "" && <span className="block">{value}</span>}
        {note && <span className="mt-1 block text-xs font-normal text-slate-500">{note}</span>}
        {children}
      </dd>
    </div>
  );
}
