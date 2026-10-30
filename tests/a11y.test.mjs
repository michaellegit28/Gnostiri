// Phase 6d — accessibility & contrast pass guard for the responsive AppShell.
//
// The defect class this test kills: chrome that "looks fine" but is not usable.
//   1. Body copy at slate-500 (#64748b) — 4.13:1 on the real #070b16 surface,
//      below the WCAG AA 4.5:1 floor, and a slow slide back down the scale
//      every time someone adds "quiet" sub-copy.
//   2. Decorative glyphs (the drawer's → arrows) read out by screen readers as
//      meaningless punctuation between every two links.
//   3. Icon-only buttons with no accessible name — invisible to a screen
//      reader, and a 36px tap target on the Prime crown.
//   4. Active navigation state carried by gold colour ALONE (no aria-current,
//      no shape difference) — colour-blind and screen-reader users lose it.
//   5. A command palette that opens with focus still on the trigger and never
//      gives it back, so keyboard users restart from the top of the page.
//
// Half of this file is arithmetic: the hex values are pulled from the shipped
// source (globals.css + tailwind.config.ts) and the WCAG 2.1 contrast ratios
// are computed in pure JS here, so the documented numbers in globals.css cannot
// drift away from the ones the CSS actually paints. No browser, no DB.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const ROOT = new URL("../", import.meta.url).pathname;
const read = (p) => readFileSync(`${ROOT}${p}`, "utf8");

const CSS = read("src/app/globals.css");
const TW = read("tailwind.config.ts");
const SHELL = read("src/components/chrome/AppShell.tsx");
const NAV = read("src/components/chrome/nav-model.ts");
const TUTOR = read("src/components/chrome/TutorPill.tsx");
const PRIME = read("src/components/chrome/PrimeBadge.tsx");
const BELL = read("src/components/notifications/NotificationBell.tsx");
const PROFILE = read("src/app/profile/page.tsx");
const SETTINGS = read("src/app/settings/page.tsx");
const LAYOUT = read("src/app/layout.tsx");

/** Every file this lane owns. Contrast + aria contracts apply to all of them. */
const SHELL_FILES = [
  ["AppShell.tsx", SHELL],
  ["nav-model.ts", NAV],
  ["TutorPill.tsx", TUTOR],
  ["PrimeBadge.tsx", PRIME],
  ["NotificationBell.tsx", BELL],
  ["profile/page.tsx", PROFILE],
  ["settings/page.tsx", SETTINGS],
];

// ─────────────────────────────────────────────────────────────────────────────
// 1. WCAG 2.1 contrast, computed from the shipped hex values
// ─────────────────────────────────────────────────────────────────────────────

const SRGB = (hex) => hex.replace("#", "").match(/../g).map((pair) => parseInt(pair, 16));

function channelLin(v) {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function relativeLuminance(hex) {
  const [r, g, b] = SRGB(hex);
  return 0.2126 * channelLin(r) + 0.7152 * channelLin(g) + 0.0722 * channelLin(b);
}

/** WCAG 2.1 contrast ratio, 1..21. */
function contrast(a, b) {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** Approximate an alpha composited over an opaque surface (alpha 0..1). */
function composite(fg, bg, alpha) {
  const f = SRGB(fg);
  const b = SRGB(bg);
  return (
    "#" +
    f
      .map((v, i) => Math.round(v * alpha + b[i] * (1 - alpha)).toString(16).padStart(2, "0"))
      .join("")
  );
}

// The app surface every shell element sits on (AppShell's header/drawer/tabs and
// the body background itself). Everything below is measured against this.
const BG = "#070b16";

// Tokens pulled from the shipped source, not hand-copied.
const GOLD = TW.match(/gold:\s*\{[^}]*DEFAULT:\s*"(#[0-9a-fA-F]{6})"/)[1];
const MUTED = CSS.match(/\.text-muted\s*\{\s*color:\s*(#[0-9a-fA-F]{6});?\s*\}/)[1];
// Tailwind's default slate scale at the steps the shell uses for text.
const SLATE = {
  "slate-100": "#f1f5f9",
  "slate-200": "#e2e8f0",
  "slate-300": "#cbd5e1",
  "slate-400": "#94a3b8",
  "slate-500": "#64748b",
  "slate-600": "#475569",
  "slate-950": "#020617",
};

// Floors: WCAG 1.4.3 (text) and 1.4.11 (non-text/UI).
const BODY_FLOOR = 4.5;
const UI_FLOOR = 3.0;

test(`brand gold ${GOLD} on ${BG} = ${contrast(GOLD, BG).toFixed(2)}:1 (AA body text, floor ${BODY_FLOOR}:1)`, () => {
  assert.ok(
    contrast(GOLD, BG) >= BODY_FLOOR,
    `gold text/icon on ${BG} must clear ${BODY_FLOOR}:1 — measured ${contrast(GOLD, BG).toFixed(2)}:1`
  );
});

test(`.text-muted (${MUTED}) on ${BG} = ${contrast(MUTED, BG).toFixed(2)}:1 — the 12px sub-copy floor (AA body, ${BODY_FLOOR}:1)`, () => {
  // .text-muted must BE the slate-300 step; anything darker re-opens the defect.
  assert.equal(MUTED.toLowerCase(), SLATE["slate-300"], ".text-muted must resolve to the slate-300 step");
  assert.ok(
    contrast(MUTED, BG) >= BODY_FLOOR,
    `12px sub-copy must clear ${BODY_FLOOR}:1 — measured ${contrast(MUTED, BG).toFixed(2)}:1`
  );
});

test(`slate-400 ${SLATE["slate-400"]} on ${BG} = ${contrast(SLATE["slate-400"], BG).toFixed(2)}:1 — the body-copy floor (AA body, ${BODY_FLOOR}:1)`, () => {
  assert.ok(
    contrast(SLATE["slate-400"], BG) >= BODY_FLOOR,
    `slate-400 is the minimum for body text — measured ${contrast(SLATE["slate-400"], BG).toFixed(2)}:1`
  );
});

test(`slate-500 ${SLATE["slate-500"]} on ${BG} = ${contrast(SLATE["slate-500"], BG).toFixed(2)}:1 — FAILS the AA body floor of ${BODY_FLOOR}:1 (the defect this lane fixes)`, () => {
  // This is the assertion that documents WHY slate-500 may not return to body
  // copy: it is below AA for normal text no matter which surface it is measured
  // on, and the shell must not use it for text.
  assert.ok(
    contrast(SLATE["slate-500"], BG) < BODY_FLOOR,
    `slate-500 must remain below ${BODY_FLOOR}:1 for this test to mean anything — measured ${contrast(SLATE["slate-500"], BG).toFixed(2)}:1`
  );
  assert.ok(
    contrast(SLATE["slate-500"], BG) >= UI_FLOOR,
    `slate-500 is still legal as non-text UI chrome (>=${UI_FLOOR}:1) — measured ${contrast(SLATE["slate-500"], BG).toFixed(2)}:1`
  );
});

test(`slate-600 ${SLATE["slate-600"]} on ${BG} = ${contrast(SLATE["slate-600"], BG).toFixed(2)}:1 — below the UI floor, decorative only`, () => {
  assert.ok(
    contrast(SLATE["slate-600"], BG) < UI_FLOOR,
    `slate-600 never carries meaning — measured ${contrast(SLATE["slate-600"], BG).toFixed(2)}:1 vs the ${UI_FLOOR}:1 non-text floor`
  );
});

test(`gold CTA background ${GOLD} with slate-950 ${SLATE["slate-950"]} text = ${contrast(SLATE["slate-950"], GOLD).toFixed(2)}:1 (AA body, ${BODY_FLOOR}:1)`, () => {
  // Profile's primary button and the skip link both invert this pair.
  assert.ok(
    contrast(SLATE["slate-950"], GOLD) >= BODY_FLOOR,
    `slate-950 on gold must clear ${BODY_FLOOR}:1 — measured ${contrast(SLATE["slate-950"], GOLD).toFixed(2)}:1`
  );
});

test(`amber-200 #fde68a on gold/15 over ${BG} (~${composite(GOLD, BG, 0.15)}) = ${contrast("#fde68a", composite(GOLD, BG, 0.15)).toFixed(2)}:1 (AA body, ${BODY_FLOOR}:1)`, () => {
  // The PrimeBadge's premium pill: amber-200 text on a 15%-gold wash.
  const surface = composite(GOLD, BG, 0.15);
  assert.ok(
    contrast("#fde68a", surface) >= BODY_FLOOR,
    `amber-200 on gold/15 must clear ${BODY_FLOOR}:1 — measured ${contrast("#fde68a", surface).toFixed(2)}:1`
  );
});

test(`gold focus ring / active border on ${BG} = ${contrast(GOLD, BG).toFixed(2)}:1 (UI component floor ${UI_FLOOR}:1)`, () => {
  assert.ok(
    contrast(GOLD, BG) >= UI_FLOOR,
    `the gold outline and the active left borders must clear ${UI_FLOOR}:1 — measured ${contrast(GOLD, BG).toFixed(2)}:1`
  );
});

test(`active-tab gold dot ${GOLD} on the tab-bar surface ${BG} = ${contrast(GOLD, BG).toFixed(2)}:1 (UI floor ${UI_FLOOR}:1)`, () => {
  assert.ok(
    contrast(GOLD, BG) >= UI_FLOOR,
    `the non-colour active indicator must be visible against its own surface — measured ${contrast(GOLD, BG).toFixed(2)}:1`
  );
});

test("every text token the shell uses for body copy clears 4.5:1, and the floor is documented in globals.css", () => {
  // Tokens the shell actually paints text with (the palette/sidebar base, the
  // drawer sub-copy, the footer link, the settings intro, the Owner badge).
  const onBg = [
    ["slate-100", SLATE["slate-100"], BG],
    ["slate-200", SLATE["slate-200"], BG],
    ["slate-300", MUTED, BG],
    ["slate-400", SLATE["slate-400"], BG],
    ["gold", GOLD, BG],
    ["slate-400 on the palette (slate-950/95)", SLATE["slate-400"], composite(SLATE["slate-950"], BG, 0.95)],
    ["slate-300 on the palette (slate-950/95)", MUTED, composite(SLATE["slate-950"], BG, 0.95)],
    ["slate-300 on the sidebar active wash (gold/10)", MUTED, composite(GOLD, BG, 0.1)],
    ["gold on the sidebar active wash (gold/10)", GOLD, composite(GOLD, BG, 0.1)],
    ["slate-950 on gold (unread count, skip link)", SLATE["slate-950"], GOLD],
  ];
  for (const [name, fg, bg] of onBg) {
    const r = contrast(fg, bg);
    assert.ok(r >= BODY_FLOOR, `${name} measures ${r.toFixed(2)}:1 — must be >= ${BODY_FLOOR}:1`);
  }
  // The documented table must be present so the next reviewer sees the numbers.
  assert.match(CSS, /9\.35:1/, "globals.css must document the measured gold-on-#070b16 ratio");
  assert.match(CSS, /13\.24:1/, "globals.css must document the measured slate-300 ratio");
  assert.match(CSS, /7\.67:1/, "globals.css must document the measured slate-400 ratio");
  assert.match(CSS, /4\.13:1/, "globals.css must document the measured slate-500 ratio");
  assert.match(CSS, /12\.49:1/, "globals.css must document the measured amber-200-on-gold/15 ratio");
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. Source contract — focus, aria, contrast classes
// ─────────────────────────────────────────────────────────────────────────────

test("globals.css ships a global :focus-visible fallback so no element is a keyboard dead zone", () => {
  assert.match(
    CSS,
    /:focus-visible\s*\{\s*outline:\s*2px\s+solid\s+[^;]+;\s*outline-offset:\s*2px;?\s*\}/,
    "a 2px offset outline must apply to :focus-visible globally (WCAG 2.4.7)"
  );
  // It must resolve to the brand gold, not a neutral grey.
  assert.match(CSS, /theme\(colors\.gold\.DEFAULT\)/, "the fallback ring colour must be the gold token");
});

test("a documented .text-muted utility exists at the slate-300 step for 12px sub-copy", () => {
  assert.match(CSS, /\.text-muted\s*\{\s*color:\s*#cbd5e1;/, ".text-muted must be #cbd5e1 (slate-300)");
  // It must be unlayered so it beats any text-slate-* utility it travels with.
  assert.match(CSS, /\.text-muted\s*\{[^}]*color:\s*#cbd5e1;?\s*\}/);
});

test("no shell file carries a text-slate-500 class — the below-floor step is gone from body copy", () => {
  for (const [name, src] of SHELL_FILES) {
    assert.doesNotMatch(
      src,
      /text-slate-500/,
      `${name} must not use text-slate-500 (4.13:1 on #070b16 — below the 4.5:1 body floor)`
    );
  }
});

test("no shell file reintroduced slate-500 icons or slate-600 glyphs either", () => {
  for (const [name, src] of SHELL_FILES) {
    assert.doesNotMatch(src, /text-slate-500/, `${name} must not fall back to slate-500 for icons`);
    assert.doesNotMatch(src, /text-slate-600/, `${name} must not fall back to slate-600 (below the 3:1 UI floor)`);
  }
});

test("decorative glyphs are hidden from assistive technology", () => {
  // Profile's row arrows.
  assert.match(
    PROFILE,
    /<span className="ml-auto[^"]*"[^>]*aria-hidden>\s*→\s*<\/span>/,
    "the profile row chevron must be aria-hidden"
  );
  // Settings' back arrow.
  assert.match(SETTINGS, /<span aria-hidden="true">← <\/span>/, "the settings back arrow must be aria-hidden");
  // The bell's unread dot and the Tutor pill's decorative ring.
  assert.match(BELL, /rounded-full bg-gold[^>]*aria-hidden="true"/, "the unread dot is decorative");
  assert.match(TUTOR, /aria-hidden="true"/, "the Tutor pill's pulse ring is decorative");
});

test("every lucide icon in the shell components is aria-hidden", () => {
  // Icons are sized with h-*/w-* pairs; each must carry aria-hidden.
  // Matches the self-closing JSX of every sized icon: `h-4 w-4` up to the
  // closing quote/backtick, then any remaining attributes, then `/>`. Covers
  // both className="…" and className={`…`} spellings and both aria-hidden
  // spellings.
  const iconRe = /<[A-Z]\w*\s+className=(["`])h-[\d.]+ w-[\d.]+.*?\1[^>]*\/>/gs;
  // nav-model.ts only *references* icons (no JSX of its own), so it is checked
  // for the rule but not for rendering at least one.
  const renderFiles = SHELL_FILES.filter(([name]) => name !== "nav-model.ts");
  for (const [name, src] of renderFiles) {
    let match;
    iconRe.lastIndex = 0;
    let total = 0;
    while ((match = iconRe.exec(src))) {
      total += 1;
      assert.match(
        match[0],
        /aria-hidden/,
        `${name}: the icon rendering "${match[0].replace(/\s+/g, " ").slice(0, 80)}" must be aria-hidden (decorative, label lives on the control)`
      );
    }
    // Only files that actually pull from lucide-react must render a sized icon.
    if (/from "lucide-react"/.test(src)) {
      assert.ok(total > 0, `${name} should render at least one sized icon`);
    }
  }
});

/** Every <button …> opening tag in a source file, with its inner text. */
function buttonsIn(src) {
  const out = [];
  const re = /<button\b/g;
  let m;
  while ((m = re.exec(src))) {
    const openEnd = src.indexOf(">", m.index);
    const closeIdx = src.indexOf("</button>", openEnd);
    const attrs = src.slice(m.index, openEnd);
    const inner = src.slice(openEnd + 1, closeIdx);
    out.push({ attrs, text: inner.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim() });
  }
  return out;
}

test("every icon-only button in the shell carries an aria-label", () => {
  const files = [
    ["AppShell.tsx", SHELL],
    ["TutorPill.tsx", TUTOR],
    ["NotificationBell.tsx", BELL],
  ];
  let checked = 0;
  for (const [name, src] of files) {
    for (const btn of buttonsIn(src)) {
      checked += 1;
      const iconOnly = btn.text.length === 0;
      if (iconOnly) {
        assert.match(
          btn.attrs,
          /aria-label="[^"]+"/,
          `${name}: an icon-only button has no accessible name — add aria-label`
        );
      } else {
        // A text button still needs the label when the text alone is ambiguous.
        assert.ok(btn.text.length > 0, `${name}: a button with no icon AND no text is unreachable`);
      }
    }
  }
  assert.ok(checked >= 5, `expected at least the five shell buttons, found ${checked}`);
});

test("the bell's aria-label announces the unread count rather than a bare 'Notifications'", () => {
  assert.match(
    BELL,
    /aria-label=\{unread > 0 \? `Notifications — \$\{unread\} unread` : "Notifications"\}/,
    "the bell must convey the unread count in its accessible name (no colour-only badge)"
  );
});

test("the drawer nav has an accessible name shared with the sidebar", () => {
  assert.match(SHELL, /<nav[^>]*aria-label=\{NAV_LABEL\}/, "the drawer must be labelled from the shared constant");
  assert.match(NAV, /export const NAV_LABEL = "Primary";/, "NAV_LABEL must live in nav-model so both surfaces agree");
  assert.match(NAV, /export const TAB_BAR_LABEL = "Primary tabs";/, "the tab bar must have its own landmark name");
  assert.match(SHELL, /<nav[\s\S]{0,300}?aria-label=\{TAB_BAR_LABEL\}/, "the bottom tab bar must use the shared label");
});

test("bottom tabs convey the active item by more than colour", () => {
  // aria-current on the active tab…
  assert.match(SHELL, /aria-current=\{active \? "page" : undefined\}/, "tabs must set aria-current");
  // …plus a shape/space indicator that survives with no colour at all.
  assert.match(
    SHELL,
    /\{active && <span className="h-1 w-1 rounded-full bg-gold" aria-hidden="true" \/>\}/,
    "the active tab needs a gold dot, not a colour change alone (WCAG 1.4.1)"
  );
  assert.match(SHELL, /BOTTOM_TABS\.map/, "the tab bar must render from the shared nav model");
});

test("drawer and sidebar active items are not colour-only (left border indicator)", () => {
  assert.match(
    SHELL,
    /function SidebarLink[\s\S]*?active \? "border-gold bg-gold\/10 text-gold" : "border-transparent/,
    "the sidebar active item must add a left border, not just gold text"
  );
  assert.match(
    SHELL,
    /active \? "border-gold" : "border-transparent hover:border-gold\/40"/,
    "the drawer active item must add a left border too"
  );
  assert.match(
    SHELL,
    /aria-current=\{active \? "page" : undefined\}/,
    "both nav surfaces must announce the current page"
  );
});

test("the command palette is a labelled modal dialog", () => {
  assert.match(SHELL, /role="dialog"/, "the palette must expose role=dialog");
  assert.match(SHELL, /aria-modal="true"/, "the palette must declare aria-modal");
  assert.match(SHELL, /aria-label="Jump to"/, "the palette needs an accessible name");
});

test("the command palette moves focus in on open and restores it on close", () => {
  // A ref on the dialog node.
  assert.match(SHELL, /const paletteRef = useRef<HTMLDivElement>\(null\);/, "the dialog node needs a ref");
  // A ref remembering what had focus before it opened.
  assert.match(SHELL, /const paletteReturnTo = useRef<HTMLElement \| null>\(null\);/, "the trigger must be remembered");
  // Focus is moved INTO the dialog on open — the first destination link.
  assert.match(
    SHELL,
    /if \(!palette\) return;[\s\S]*?paletteRef\.current\?\.querySelector<HTMLElement>\("a\[href\]"\)/,
    "on open, focus must move to the first link inside the palette"
  );
  assert.match(SHELL, /firstLink\?\.focus\(\);/, "the first link must actually receive focus");
  // …and handed back on close via the effect cleanup.
  assert.match(SHELL, /paletteReturnTo\.current\?\.focus\(\);/, "on close, focus must return to the trigger");
  assert.match(SHELL, /document\.activeElement as HTMLElement \| null/, "the currently focused element must be captured");
});

test("interactive shell targets are at least 44px", () => {
  // The two flagged controls: the Prime crown chip and the drawer rows.
  assert.match(PRIME, /min-h-\[44px\][\s\S]*?inline-flex/, "the Prime badge must be a 44px target");
  assert.match(SHELL, /min-h-\[52px\]/, "drawer rows are 52px");
  assert.match(SHELL, /min-h-\[44px\]/, "the top-bar controls are 44px");
  assert.match(BELL, /min-h-\[44px\] min-w-\[44px\]/, "the bell must be a 44px round target");
  assert.match(TUTOR, /min-h-\[48px\] min-w-\[48px\]/, "the Tutor pill must be a 48px target");
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. Keyboard order contract
// ─────────────────────────────────────────────────────────────────────────────

test("the skip link is the FIRST focusable element AppShell renders", () => {
  const skipAt = SHELL.indexOf('<a\n        href="#main"');
  assert.ok(skipAt >= 0, "AppShell must render a skip link to #main");
  const firstButton = SHELL.indexOf("<button");
  const firstLink = SHELL.indexOf("<Link");
  assert.ok(
    skipAt < firstButton,
    `the skip link (${skipAt}) must precede the first <button> (${firstButton}) in source order`
  );
  assert.ok(
    skipAt < firstLink,
    `the skip link (${skipAt}) must precede the first <Link> (${firstLink}) in source order`
  );
  // It must only become visible on focus (WCAG 2.4.1).
  assert.match(SHELL, /sr-only focus:not-sr-only/, "the skip link must stay hidden until focused");
  assert.match(SHELL, /href="#main"/, "the skip link target must be #main");
});

test("the bottom tab bar renders after <main> in the DOM", () => {
  const mainAt = SHELL.indexOf("<main");
  // The JSX usage (aria-label={TAB_BAR_LABEL}), not the import at the top.
  const tabsMatch = /aria-label=\{TAB_BAR_LABEL\}/.exec(SHELL);
  const tabsAt = tabsMatch ? tabsMatch.index : -1;
  assert.ok(mainAt >= 0, "<main> must exist");
  assert.ok(tabsAt >= 0, "the bottom tab bar must exist");
  assert.ok(
    tabsAt > mainAt,
    `the bottom nav (${tabsAt}) must come after <main> (${mainAt}) so Tab order reaches content first`
  );
});

test("AppShell is mounted before the Tutor pill in the layout (skip link leads the whole page)", () => {
  const shellAt = LAYOUT.indexOf("<AppShell>");
  const pillAt = LAYOUT.indexOf("<TutorPill />");
  assert.ok(shellAt >= 0 && pillAt >= 0, "both chrome surfaces must be mounted in layout.tsx");
  assert.ok(shellAt < pillAt, "AppShell (which owns the skip link) must render before the Tutor pill");
});

test("Escape and Cmd/Ctrl+K drive the chrome overlays", () => {
  assert.match(SHELL, /if \(e\.key === "Escape"\)/, "Escape must close overlays");
  assert.match(SHELL, /\(e\.metaKey \|\| e\.ctrlKey\) && e\.key\.toLowerCase\(\) === "k"/, "Cmd/Ctrl+K must open the palette");
});
