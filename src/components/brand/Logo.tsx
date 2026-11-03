/**
 * LogoMark — the Gnostiri mark: a geometric "G" whose upper terminal fires
 * upward. Knowledge ascending. Two elements only: a 290° ring (the book's
 * curve) and a solid arrowhead — solid, not stroked, so it stays crisp at 16px.
 * The primary CTA, the favicon and the hero all draw from the same refined
 * brass-gold scale (see globals.css: 60/30/10).
 */

import { BRAND_GOLD, BRAND_GOLD_LIGHT } from "./brand-constants";

/* ── Brand constants ────────────────────────────────────────────────────────
   The mark's constants — the ONE documented exception to the zero-hex bar,
   standing next to the LogoMark's own strokes below. globals.css is the APP
   palette; a brand artifact is painted as flat colour rather than app chrome
   (the WhatsApp win card rasterises to PNG, an outbound email cannot read
   custom properties, a PWA manifest is metadata, a provider's mark is
   trademark-locked), so every value an artifact needs lives in ./brand-constants
   and is re-exported from HERE: app code imports the brand constants from
   Logo.tsx, the mark's home — one source, one meaning, no colour scattered
   across libs and routes. */
export {
  BRAND_BG_DEEP,
  BRAND_CREAM,
  BRAND_GOLD,
  BRAND_GOLD_DEEP,
  BRAND_GOLD_LIGHT,
  BRAND_LINE,
  BRAND_NAVY,
  BRAND_TEXT,
  BRAND_TEXT_DIM,
  BRAND_TEXT_MUTED,
  BRAND_TEXT_SOFT,
  BRAND_TEXT_SUBTLE,
  GOOGLE_G_BLUE,
  GOOGLE_G_GREEN,
  GOOGLE_G_RED,
  GOOGLE_G_YELLOW,
} from "./brand-constants";

const RING = "M34.5 17A14 14 0 1 0 34.5 33";
const BAR = "M34.5 33L26.5 33";
const SHAFT = "M34.5 17L40 11.5";
const HEAD = "M40 9.2L34.6 14.6L41.6 15.4Z";
const GOLD = BRAND_GOLD;

export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      role="img"
      aria-label="Gnostiri"
      className={`shrink-0 ${className ?? ""}`}
    >
      <defs>
        <linearGradient id="gnostiri-mark" x1="0" y1="48" x2="48" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={GOLD} />
          <stop offset="100%" stopColor={BRAND_GOLD_LIGHT} />
        </linearGradient>
      </defs>
      <path d={RING} stroke="url(#gnostiri-mark)" strokeWidth="5" strokeLinecap="round" />
      <path d={BAR} stroke="url(#gnostiri-mark)" strokeWidth="5" strokeLinecap="round" />
      <path d={SHAFT} stroke="url(#gnostiri-mark)" strokeWidth="5" strokeLinecap="round" />
      <path d={HEAD} fill="url(#gnostiri-mark)" />
    </svg>
  );
}

export default function Logo({
  size = 32,
  withWordmark = false,
  className,
}: {
  size?: number;
  withWordmark?: boolean;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <LogoMark size={size} />
      {withWordmark && (
        <span className="font-serif text-lg font-bold tracking-tight text-ink">Gnostiri</span>
      )}
    </span>
  );
}
