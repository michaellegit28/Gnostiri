/**
 * win-card.ts — the shareable win card (ROADMAP Phase 5).
 *
 * A 9:16 (1080x1920) SVG, sized for WhatsApp Status: the Gnostiri mark, the
 * tier in large type, the star delta, one context line, the date, and a
 * subtle gold gradient. ONE privacy rule, enforced by construction: the only
 * identity ever drawn is `handle`, a DISPLAY NAME. There is no parameter for
 * an email, a user id or a roster, so a caller physically cannot put PII on a
 * card that is about to be posted publicly — the route, the tests and the
 * reviewer can all read that off the single template literal below.
 *
 * The card is a BRAND ARTIFACT, not app chrome: it rasterises to a PNG through
 * sharp, so it cannot read the globals.css token block. Every colour comes
 * from the documented brand constants in components/brand/brand-constants.ts
 * (re-exported by the mark's Logo.tsx) — and the dark navy ground is
 * BRAND_NAVY, the app --bg.
 *
 * The relative, explicitly-extensioned specifier is deliberate: this module is
 * loaded by the test harness under plain Node (tests/rewards.test.mjs), which
 * cannot resolve the "@/..." alias or execute a .tsx component file.
 */

import {
  BRAND_GOLD,
  BRAND_GOLD_DEEP,
  BRAND_GOLD_LIGHT,
  BRAND_NAVY,
  BRAND_TEXT,
  BRAND_TEXT_DIM,
  BRAND_TEXT_MUTED,
  BRAND_TEXT_SOFT,
  BRAND_TEXT_SUBTLE,
} from "../components/brand/brand-constants.ts";

export const WIN_CARD_WIDTH = 1080;
export const WIN_CARD_HEIGHT = 1920;

export interface WinCardInput {
  /** Display name only — never an email, a uid, or a roster. */
  handle: string;
  /** Tier label as it appears on the ladder, e.g. "Vanguard". */
  tierLabel: string;
  /** Star delta for this card, e.g. 3 for "+3 Stars". */
  delta: number;
  /** One short line of context, e.g. "Pod quickfire · Vanguard III". */
  context: string;
  /** Card kind, e.g. "Pod victory" or "Rank up". */
  title: string;
  /** Pre-formatted date label, e.g. "12 Dec 2026". */
  dateLabel: string;
}

/** XML-escape every caller-supplied string before it enters the template. */
function esc(text: string): string {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** The signed delta, exactly as the ledger records it. */
export function deltaLabel(delta: number): string {
  const value = Number.isFinite(delta) ? Math.trunc(delta) : 0;
  return `${value > 0 ? "+" : ""}${value} Stars`;
}

/**
 * The 12-point orbit ring — the same mark language as
 * src/components/logo/GnostiriLogo.tsx, drawn as pure SVG so it rasterises
 * with no font or image dependency.
 */
function mark(): string {
  const dots = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
    return {
      cx: (540 + 96 * Math.cos(angle)).toFixed(1),
      cy: (300 + 96 * Math.sin(angle)).toFixed(1),
      r: i % 3 === 0 ? 10 : 7.5,
      opacity: i % 3 === 0 ? 0.95 : 0.55,
    };
  });
  return dots
    .map(
      (d) =>
        `<circle cx="${d.cx}" cy="${d.cy}" r="${d.r}" fill="url(#goldFill)" opacity="${d.opacity}" />`,
    )
    .join("");
}

/**
 * Render the card as SVG text. The whole document is ONE template literal so
 * a reviewer (or a test) can read the entire thing in one place and confirm
 * no PII field is even reachable from it.
 */
export function winCardSvg(input: WinCardInput): string {
  const handle = input.handle.trim() || "Anonymous Scholar";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIN_CARD_WIDTH}" height="${WIN_CARD_HEIGHT}" viewBox="0 0 ${WIN_CARD_WIDTH} ${WIN_CARD_HEIGHT}">
  <defs>
    <linearGradient id="goldFill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${BRAND_GOLD_LIGHT}" />
      <stop offset="55%" stop-color="${BRAND_GOLD}" />
      <stop offset="100%" stop-color="${BRAND_GOLD_DEEP}" />
    </linearGradient>
    <radialGradient id="warmGlow" cx="50%" cy="26%" r="62%">
      <stop offset="0%" stop-color="${BRAND_GOLD}" stop-opacity="0.22" />
      <stop offset="100%" stop-color="${BRAND_GOLD}" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="${WIN_CARD_WIDTH}" height="${WIN_CARD_HEIGHT}" fill="${BRAND_NAVY}" />
  <rect width="${WIN_CARD_WIDTH}" height="${WIN_CARD_HEIGHT}" fill="url(#warmGlow)" />
  <rect x="24" y="24" width="${WIN_CARD_WIDTH - 48}" height="${WIN_CARD_HEIGHT - 48}" fill="none" stroke="${BRAND_GOLD}" stroke-opacity="0.35" stroke-width="2" />
  ${mark()}
  <circle cx="540" cy="300" r="30" fill="${BRAND_GOLD}" />
  <circle cx="540" cy="300" r="52" fill="none" stroke="${BRAND_GOLD}" stroke-opacity="0.45" stroke-width="2" />
  <text x="540" y="470" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="46" font-weight="700" letter-spacing="16" fill="url(#goldFill)">GNOSTIRI</text>
  <text x="540" y="560" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="30" letter-spacing="10" fill="${BRAND_TEXT_SUBTLE}">${esc(input.title.toUpperCase())}</text>
  <text x="540" y="800" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="150" font-weight="700" fill="url(#goldFill)">${esc(input.tierLabel)}</text>
  <text x="540" y="930" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="76" font-weight="700" fill="${BRAND_TEXT}">${esc(deltaLabel(input.delta))}</text>
  <text x="540" y="1020" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="38" fill="${BRAND_TEXT_MUTED}">${esc(input.context)}</text>
  <text x="540" y="1080" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="30" fill="${BRAND_TEXT_DIM}">${esc(input.dateLabel)}</text>
  <rect x="360" y="1430" width="360" height="3" fill="${BRAND_GOLD}" fill-opacity="0.5" />
  <text x="540" y="1510" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="54" fill="${BRAND_TEXT_SOFT}">${esc(handle)}</text>
  <text x="540" y="1720" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="26" letter-spacing="6" fill="${BRAND_TEXT_DIM}">GNOSTIRI GLOBAL RANKING</text>
</svg>`;
}
