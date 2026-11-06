/**
 * CBT design tokens — every visual role used by the CBT flow, in ONE place.
 * Values reference the app's global Tailwind tokens (gold, slate, font-serif),
 * so re-skinning the CBT screens is a change to this file + tailwind.config,
 * never to the components.
 */
export const CBT = {
  card: "gn-shadow rounded-2xl border border-line bg-surface",
  cardHover: "gn-motion gn-lift hover:border-primary/40 transition-colors hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]",
  cardActive: "border-primary/60 bg-primary/10",
  panel: "gn-shadow rounded-2xl border border-line bg-surface",
  primaryBtn:
    "gn-motion inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 font-semibold text-on-primary transition-colors hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40",
  ghostBtn:
    "gn-motion inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-line px-4 font-semibold text-slate-200 transition-colors hover:border-primary/50 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40",
  chip: "inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-2.5 py-1 text-xs font-medium text-slate-300",
  eyebrow: "text-[11px] font-semibold uppercase tracking-[0.3em] text-electric-text",
  heading: "font-serif font-bold tracking-tight text-slate-50",
  muted: "text-slate-400",
  faint: "text-slate-500",
  optionBase:
    "gn-motion flex min-h-[52px] w-full items-center gap-3 rounded-xl border px-4 text-left text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.98]",
  optionIdle: "border-line bg-surface-2 text-slate-200 hover:border-primary/50",
  optionPicked: "border-primary bg-primary/15 text-slate-50",
  optionLetter:
    "gn-motion flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-xs font-bold",
  gridCell:
    "flex h-10 w-full items-center justify-center rounded-lg border text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
  stickyBar: "sticky bottom-0 z-20 border-t border-line bg-bg/95 backdrop-blur px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]",
  timerLow: "border-rose-500/40 bg-rose-950/40 text-rose-200",
} as const;
