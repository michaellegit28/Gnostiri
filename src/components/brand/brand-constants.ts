/**
 * brand-constants.ts — the mark's constants, and the ONE documented exception
 * to the zero-hex bar the audit enforces. globals.css is the APP palette;
 * these are the BRAND values, painted flat rather than read as chrome:
 *
 *   - the WhatsApp win card rasterises to PNG through sharp, so it can never
 *     resolve a custom property;
 *   - the outbound notification email is rendered by mail clients, which
 *     strip custom properties client-side;
 *   - the PWA manifest and the theme-color meta are metadata, not CSS;
 *   - the Google Sign-In "G" is trademark-locked and must never be themed.
 *
 * Every such value lives HERE, one source and one meaning, re-exported by
 * ./Logo.tsx so app code imports the brand constants from the mark's module.
 * The server libs (win-card.ts, notify.ts) import this file directly: the test
 * harness loads those modules under plain Node, which cannot execute a .tsx
 * component file — hence a relative, explicitly-extensioned specifier.
 *
 * Stored as RGB CHANNEL TRIPLES, exactly like the token block, and resolved
 * to hex by the helper below, so the palette is channel-shaped end to end and
 * no literal is duplicated anywhere else in the tree.
 */

type Channels = readonly [number, number, number];

/** `rgb(1 2 3)` channels → the six-digit hex string for that colour. */
const hex = ([r, g, b]: Channels): string =>
  "#" + [r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("");

/** The accent — Solar Gold #F5A623, the flat brand gold. This is --gold-from /
 *  --gold-soft in globals.css; --gold itself is theme-dependent chrome (luminous
 *  in dark, darkened for the 3:1 UI floor in light) and never paints flat art. */
export const BRAND_GOLD = hex([245, 166, 35]);
/** Gradient lift — the mark's bright stop. */
export const BRAND_GOLD_LIGHT = hex([240, 190, 95]);
/** Gradient shade. */
export const BRAND_GOLD_DEEP = hex([156, 122, 30]);
/** Dark navy ground — --bg (dark) #101B33, the win card's sheet. */
export const BRAND_NAVY = hex([16, 27, 51]);
/** Deeper navy — --bg-deep (dark) #081022, the PWA splash ground. */
export const BRAND_BG_DEEP = hex([8, 16, 34]);
/** Light-mode page ground — --bg in light mode #F7F9FF (theme-color light
 *  value). The print medium stays --paper #FDFBF7; the app ground diverged. */
export const BRAND_CREAM = hex([247, 249, 255]);
/** The hero figure. */
export const BRAND_TEXT = hex([241, 245, 249]);
/** The display handle. */
export const BRAND_TEXT_SOFT = hex([226, 232, 240]);
/** The context line. */
export const BRAND_TEXT_MUTED = hex([203, 213, 225]);
/** The card title. */
export const BRAND_TEXT_SUBTLE = hex([148, 163, 184]);
/** The date / footer. */
export const BRAND_TEXT_DIM = hex([100, 116, 139]);
/** --border (dark) #2C3D5C — the soft printed rule in the email. */
export const BRAND_LINE = hex([44, 61, 92]);
/** Google Sign-In "G" — brand-accurate per Google's guidelines; never themed. */
export const GOOGLE_G_BLUE = hex([66, 133, 244]);
export const GOOGLE_G_GREEN = hex([52, 168, 83]);
export const GOOGLE_G_YELLOW = hex([251, 188, 5]);
export const GOOGLE_G_RED = hex([234, 67, 53]);
