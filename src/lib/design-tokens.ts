// Design tokens — Batch 3 (A4-4). Single source of truth for brand
// accents. New file only: no existing imports rewritten in this patch,
// so A1 can adopt incrementally without collisions.
//
// Harvested from live tree (2026-10-12): #D4AF37 (gold), #c3a030
// (goldHover), #060a14 (ink page bg), #14B8A6 (teal), #070b16 (menu
// overlay / canvas base). Tracking + radii from arena/error/CTAs.
export const gold = "#D4AF37";
export const goldHover = "#c3a030";
export const ink = "#060a14";
export const overlay = "#070b16";
export const teal = "#14B8A6";

export const radii = {
  sm: "0.5rem", // rounded-lg
  md: "0.75rem", // rounded-xl
  lg: "1rem", // rounded-2xl
} as const;

export const tracking = {
  eyebrow: "0.3em",
  stat: "0.22em",
  label: "0.2em",
} as const;

export const focusRing = {
  gold: "focus-visible:ring-2 focus-visible:ring-[#D4AF37]",
  teal: "focus-visible:ring-2 focus-visible:ring-teal-400",
} as const;

export const designTokens = {
  gold,
  goldHover,
  ink,
  overlay,
  teal,
  radii,
  tracking,
  focusRing,
} as const;

export type DesignTokens = typeof designTokens;
