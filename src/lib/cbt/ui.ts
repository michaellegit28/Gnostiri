/**
 * CBT design tokens — every visual role used by the CBT flow, in ONE place.
 * Values reference the app's global Tailwind tokens (gold, slate, font-serif),
 * so re-skinning the CBT screens is a change to this file + tailwind.config,
 * never to the components.
 */
export const CBT = {
  card: "rounded-2xl border border-white/10 bg-white/[0.03]",
  cardHover: "hover:border-gold/40 transition-colors",
  cardActive: "border-gold/60 bg-gold/10",
  panel: "rounded-2xl border border-white/10 bg-slate-950/40",
  primaryBtn:
    "inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-gold px-6 font-semibold text-slate-950 hover:bg-gold-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:cursor-not-allowed disabled:opacity-40",
  ghostBtn:
    "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-white/15 px-4 font-semibold text-slate-200 hover:border-gold/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:opacity-40",
  chip: "inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-300",
  eyebrow: "text-[11px] font-semibold uppercase tracking-[0.3em] text-gold",
  heading: "font-serif font-bold tracking-tight text-slate-50",
  muted: "text-slate-400",
  faint: "text-slate-500",
  optionBase:
    "flex min-h-[52px] w-full items-center gap-3 rounded-xl border px-4 text-left text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold",
  optionIdle: "border-white/10 bg-white/[0.03] text-slate-200 hover:border-gold/40",
  optionPicked: "border-gold bg-gold/15 text-slate-50",
  optionLetter:
    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 text-xs font-bold",
  gridCell:
    "flex h-10 w-full items-center justify-center rounded-lg border text-xs font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold",
  stickyBar: "sticky bottom-0 z-20 border-t border-white/10 bg-[#0d0a24]/95 backdrop-blur px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]",
  timerLow: "border-rose-500/40 bg-rose-950/40 text-rose-200",
} as const;
