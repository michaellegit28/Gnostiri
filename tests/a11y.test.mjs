// Phase 6e — design-token contrast guard (dark + light themes).
//
// The defect class this test kills: a palette that "looks fine" in one theme
// and fails WCAG in the other, or a themeable token that quietly drifts from
// the documented value. The hex values are COMPUTED from the shipped CSS
// channel tokens (both themes) and the tailwind alias map — nothing is
// hand-copied — so the numbers in the test cannot disagree with the paint.

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

const SHELL_FILES = [
  ["AppShell.tsx", SHELL],
  ["nav-model.ts", NAV],
  ["TutorPill.tsx", TUTOR],
  ["PrimeBadge.tsx", PRIME],
  ["NotificationBell.tsx", BELL],
  ["profile/page.tsx", PROFILE],
  ["settings/page.tsx", SETTINGS],
];

// ─── token plumbing ──────────────────────────────────────────────────────────

/** `--name: 1 2 3` channels from a theme block → "#010203". */
function token(themeBlock, name) {
  const m = new RegExp(`--${name}:\\s*(\\d+)\\s+(\\d+)\\s+(\\d+)`).exec(themeBlock);
  if (!m) throw new Error(`token --${name} not found`);
  return (
    "#" +
    [m[1], m[2], m[3]].map((c) => Number(c).toString(16).padStart(2, "0")).join("")
  );
}

const DARK = CSS.match(/:root,[\s\S]*?color-scheme: dark;/)[0];
const LIGHT = CSS.match(/\[data-theme="light"\]\s*\{[\s\S]*?color-scheme: light;/)[0];

function palette(block) {
  return {
    bg: token(block, "bg"),
    surface: token(block, "surface"),
    text: token(block, "text"),
    muted: token(block, "text-muted"),
    subtle: token(block, "text-subtle"),
    gold: token(block, "gold"),
    goldText: token(block, "gold-text"),
    onGold: token(block, "on-gold"),
    success: token(block, "success"),
    danger: token(block, "danger"),
  };
}

const DARK_P = palette(DARK);
const LIGHT_P = palette(LIGHT);

// ─── WCAG 2.1 arithmetic ─────────────────────────────────────────────────────

const SRGB = (hex) => hex.replace("#", "").match(/../g).map((pair) => parseInt(pair, 16));
function channelLin(v) {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
function relativeLuminance(hex) {
  const [r, g, b] = SRGB(hex);
  return 0.2126 * channelLin(r) + 0.7152 * channelLin(g) + 0.0722 * channelLin(b);
}
function contrast(a, b) {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

const BODY_FLOOR = 4.5;
const UI_FLOOR = 3.0;

// ─── token + alias plumbing contracts ────────────────────────────────────────

test("both themes ship the full token set", () => {
  for (const [name, block] of [["dark", DARK], ["light", LIGHT]]) {
    for (const tokenName of ["bg", "surface", "surface-2", "border", "border-strong", "text", "text-muted", "text-subtle", "gold", "gold-hover", "gold-text", "gold-soft", "on-gold", "success", "danger", "warning", "focus"]) {
      assert.ok(new RegExp(`--${tokenName}:`).test(block), `${name} theme defines --${tokenName}`);
    }
  }
});

test("tokens are channel triples so Tailwind opacity modifiers work", () => {
  assert.match(DARK, /--bg:\s*\d+\s+\d+\s+\d+/, "channels, not hex");
  assert.ok(!/--bg:\s*#/.test(CSS), "no hex token — alpha utilities would break");
});

test("slate/white utilities are aliased onto the theme tokens", () => {
  assert.match(TW, /slate:\s*\{/, "the slate scale is remapped");
  assert.match(TW, /950:\s*"rgb\(var\(--bg\) \/ <alpha-value>\)"/, "slate-950 is the theme background");
  assert.match(TW, /400:\s*"rgb\(var\(--text-muted\) \/ <alpha-value>\)"/, "slate-400 is the muted token");
  assert.match(TW, /white:\s*"rgb\(var\(--text\) \/ <alpha-value>\)"/, "white is the ink token");
  assert.match(TW, /DEFAULT:\s*"rgb\(var\(--gold\) \/ <alpha-value>\)"/, "gold is the token");
});

test("the tailwind gold hover is theme-aware, not a fixed hex", () => {
  assert.match(TW, /hover:\s*"rgb\(var\(--gold-hover\) \/ <alpha-value>\)"/, "hover comes from the token");
  assert.ok(!/hover:\s*"#/.test(TW), "no hard-coded hover hex");
});

// ─── contrast, both themes ───────────────────────────────────────────────────

test(`dark body text ${DARK_P.text} on ${DARK_P.bg} = ${contrast(DARK_P.text, DARK_P.bg).toFixed(1)}:1 (AA body ${BODY_FLOOR}:1)`, () => {
  assert.ok(contrast(DARK_P.text, DARK_P.bg) >= BODY_FLOOR);
});

test(`dark muted ${DARK_P.muted} on ${DARK_P.bg} = ${contrast(DARK_P.muted, DARK_P.bg).toFixed(1)}:1 — the body-copy floor`, () => {
  assert.ok(contrast(DARK_P.muted, DARK_P.bg) >= BODY_FLOOR);
});

test(`dark subtle ${DARK_P.subtle} on ${DARK_P.bg} = ${contrast(DARK_P.subtle, DARK_P.bg).toFixed(1)}:1 — decorative/UI only`, () => {
  assert.ok(contrast(DARK_P.subtle, DARK_P.bg) >= UI_FLOOR);
});

test(`dark gold ${DARK_P.gold} on ${DARK_P.bg} = ${contrast(DARK_P.gold, DARK_P.bg).toFixed(1)}:1 (AA text)`, () => {
  assert.ok(contrast(DARK_P.gold, DARK_P.bg) >= BODY_FLOOR);
});

test(`dark CTA ${DARK_P.onGold} on ${DARK_P.gold} = ${contrast(DARK_P.onGold, DARK_P.gold).toFixed(1)}:1 (AA body)`, () => {
  assert.ok(contrast(DARK_P.onGold, DARK_P.gold) >= BODY_FLOOR);
});

test(`light body text ${LIGHT_P.text} on ${LIGHT_P.bg} = ${contrast(LIGHT_P.text, LIGHT_P.bg).toFixed(1)}:1 (AA body ${BODY_FLOOR}:1)`, () => {
  assert.ok(contrast(LIGHT_P.text, LIGHT_P.bg) >= BODY_FLOOR);
});

test(`light muted ${LIGHT_P.muted} on ${LIGHT_P.bg} = ${contrast(LIGHT_P.muted, LIGHT_P.bg).toFixed(1)}:1 — the body-copy floor`, () => {
  assert.ok(contrast(LIGHT_P.muted, LIGHT_P.bg) >= BODY_FLOOR);
});

test(`light subtle ${LIGHT_P.subtle} on ${LIGHT_P.bg} = ${contrast(LIGHT_P.subtle, LIGHT_P.bg).toFixed(1)}:1 — decorative/UI only`, () => {
  assert.ok(contrast(LIGHT_P.subtle, LIGHT_P.bg) >= UI_FLOOR);
});

test(`light gold-as-TEXT ${LIGHT_P.goldText} on ${LIGHT_P.bg} = ${contrast(LIGHT_P.goldText, LIGHT_P.bg).toFixed(1)}:1 — raw gold would be ${contrast(LIGHT_P.gold, LIGHT_P.bg).toFixed(1)}:1 and must never carry text`, () => {
  assert.ok(contrast(LIGHT_P.goldText, LIGHT_P.bg) >= BODY_FLOOR);
  assert.ok(contrast(LIGHT_P.gold, LIGHT_P.bg) < BODY_FLOOR, "the test is meaningful only because raw gold fails");
});

test("light-mode gold text uses the darkened token, not raw gold", () => {
  assert.match(CSS, /\[data-theme="light"\] \.text-gold\s*\{\s*color:\s*rgb\(var\(--gold-text\)\)/, ".text-gold is recoloured in light mode");
});

test(`light CTA ${LIGHT_P.onGold} on ${LIGHT_P.gold} = ${contrast(LIGHT_P.onGold, LIGHT_P.gold).toFixed(1)}:1 (AA body)`, () => {
  assert.ok(contrast(LIGHT_P.onGold, LIGHT_P.gold) >= BODY_FLOOR);
});

test(`state colours clear their floors in both themes (danger, success)`, () => {
  for (const [name, p] of [["dark", DARK_P], ["light", LIGHT_P]]) {
    assert.ok(contrast(p.danger, p.bg) >= UI_FLOOR, `${name} danger ≥ ${UI_FLOOR}:1 as a UI signal`);
    assert.ok(contrast(p.success, p.bg) >= UI_FLOOR, `${name} success ≥ ${UI_FLOOR}:1 as a UI signal`);
  }
});

// ─── source contracts carried over from 6d ───────────────────────────────────

test("globals.css ships a global :focus-visible fallback so no element is a keyboard dead zone", () => {
  assert.match(CSS, /:focus-visible\s*\{[^}]*outline:\s*2px solid rgb\(var\(--focus\)\)/, "the fallback ring is the gold token at 2px");
});

test("blur is neutralised globally — the engineered look has no backdrop blur", () => {
  assert.match(CSS, /backdrop-blur[^{]*\{\s*backdrop-filter:\s*none !important/, "every backdrop-blur utility is dead on arrival");
});

test("the layout defaults to dark and applies the stored theme before paint", () => {
  assert.match(LAYOUT, /data-theme="dark"/, "dark is the default");
  assert.match(LAYOUT, /localStorage\.getItem\("gnostiri\.theme"\)/, "no flash: the stored theme is applied pre-paint");
});

test("no shell file reintroduces the below-floor text steps", () => {
  for (const [name, src] of SHELL_FILES) {
    assert.doesNotMatch(src, /text-slate-600/, `${name} must not use slate-600 for text`);
  }
});

test("decorative glyphs are hidden from assistive technology", () => {
  assert.match(SHELL, /aria-hidden/, "the shell hides its decorative arrows");
  assert.match(SETTINGS, /aria-hidden/, "settings hides its back arrow");
});

test("icon-only controls carry accessible names", () => {
  for (const [name, src] of SHELL_FILES) {
    const buttons = src.match(/<button[\s\S]*?<\/button>/g) ?? [];
    for (const button of buttons) {
      const iconOnly = /^\s*<button[^>]*>\s*<(?:svg|span)[\s\S]*?<\/button>/m.test(button);
      if (iconOnly) {
        assert.match(button, /aria-label=/, `${name}: an icon-only button without an accessible name`);
      }
    }
  }
});
