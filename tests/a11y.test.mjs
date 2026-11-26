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
    surface2: token(block, "surface-2"),
    text: token(block, "text"),
    muted: token(block, "text-muted"),
    subtle: token(block, "text-subtle"),
    placeholder: token(block, "text-placeholder"),
    disabled: token(block, "text-disabled"),
    borderStrong: token(block, "border-strong"),
    inputBorder: token(block, "input-border"),
    link: token(block, "link"),
    gold: token(block, "gold"),
    goldText: token(block, "gold-text"),
    onGold: token(block, "on-gold"),
    success: token(block, "success"),
    error: token(block, "error"),
    warning: token(block, "warning"),
    cyan: token(block, "cyan"),
    mint: token(block, "mint"),
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
    for (const tokenName of ["bg", "surface", "surface-2", "border", "border-strong", "text", "text-muted", "text-subtle", "gold", "gold-hover", "gold-text", "gold-soft", "on-gold", "success", "error", "warning", "focus"]) {
      assert.ok(new RegExp(`--${tokenName}:`).test(block), `${name} theme defines --${tokenName}`);
    }
  }
});

// The defect class this kills: a token referenced by tailwind.config.ts but
// defined in only ONE theme. `rgb(var(--x))` with an undefined custom property
// is invalid, so the declaration is silently dropped — the text keeps its
// inherited colour instead of failing the build. That is exactly how dark mode
// lost `--teal`/`--teal-text` (22 text-teal-200/300 uses rendered colourless)
// while the theme still passed every curated check. Deriving the list from the
// config means the next hole cannot be curated away.
test("every token the tailwind config references exists in BOTH themes", () => {
  // Scope to the `colors` block only. fontFamily references var(--font-display)
  // etc., which next/font sets on <html> at runtime rather than in globals.css,
  // so a whole-config sweep would false-positive on those.
  const colorsBlock = TW.slice(TW.indexOf("colors: {"), TW.indexOf("letterSpacing:"));
  assert.ok(colorsBlock.includes("--primary"), "found the colours block in the config");

  const referenced = new Set();
  for (const m of colorsBlock.matchAll(/var\(--([a-z0-9-]+)\)/g)) {
    if (m[1] === "alpha-value") continue;
    referenced.add(m[1]);
  }
  assert.ok(referenced.size > 40, `parsed a real token set from the config (got ${referenced.size})`);

  for (const [name, block] of [["dark", DARK], ["light", LIGHT]]) {
    for (const tokenName of referenced) {
      assert.ok(
        new RegExp(`--${tokenName}:`).test(block),
        `${name} theme defines --${tokenName} (referenced by tailwind.config.ts) — a missing token silently drops the colour instead of failing the build`
      );
    }
  }
});

// Accent *-text variants are the ones allowed to carry text. They are checked
// against --surface-2 as well as --bg because that is the ELEVATED surface:
// in light mode --surface-2 (#E9EDFA) is darker than --bg (#F7F9FF), so
// contrast on cards is lower than the headline number and must be measured
// on its own.
test("accent -text variants clear the body floor on bg AND surface-2, both themes", () => {
  const accents = [
    "electric-text", "cyan-text", "violet-text", "pink-text", "gold-text",
    "teal-text", "success-text", "error-text", "warning-text",
  ];
  for (const [name, block] of [["dark", DARK], ["light", LIGHT]]) {
    for (const acc of accents) {
      if (!new RegExp(`--${acc}:`).test(block)) continue; // covered above
      const fg = token(block, acc);
      for (const surface of ["bg", "surface-2"]) {
        const bg = token(block, surface);
        const ratio = contrast(fg, bg).toFixed(2);
        assert.ok(
          contrast(fg, bg) >= BODY_FLOOR,
          `${name} ${acc} on ${surface} = ${ratio}:1 — accent text may not dip below ${BODY_FLOOR}:1`
        );
      }
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
    assert.ok(contrast(p.error, p.bg) >= UI_FLOOR, `${name} error ≥ ${UI_FLOOR}:1 as a UI signal`);
    assert.ok(contrast(p.success, p.bg) >= UI_FLOOR, `${name} success ≥ ${UI_FLOOR}:1 as a UI signal`);
  }
});

// ─── P0 visual pass — the newly enforced pairs ───────────────────────────────

// --text-subtle is the lowest TEXT step (it backs text-slate-500/600/700 and
// text-subtle). The defect class this kills: a subtle value that clears 4.5:1
// on --bg but silently drops below it on the ELEVATED card surface, where most
// of these captions actually sit (light --surface-2 #E9EDFA is darker than the
// #F7F9FF ground).
test(`text-subtle clears the body floor on surface-2 in BOTH themes`, () => {
  for (const [name, p] of [["dark", DARK_P], ["light", LIGHT_P]]) {
    assert.ok(
      contrast(p.subtle, p.surface2) >= BODY_FLOOR,
      `${name} subtle ${p.subtle} on surface-2 ${p.surface2} = ${contrast(p.subtle, p.surface2).toFixed(2)}:1 — the lowest text step must hold ${BODY_FLOOR}:1 on cards`
    );
  }
});

// slate-600/700 USED to alias --border-strong (2.5:1 dark / 1.6:1 light as
// text). The alias now rides --text-subtle, and --border-strong itself is
// banned from text — but it still carries UI edges, so it must hold the 3:1
// non-text floor of WCAG 1.4.11 on both grounds in both themes.
test(`border-strong clears the 3:1 UI floor (bg and surface) in both themes — and is no longer a text alias`, () => {
  for (const [name, p] of [["dark", DARK_P], ["light", LIGHT_P]]) {
    for (const surface of ["bg", "surface"]) {
      assert.ok(
        contrast(p.borderStrong, p[surface]) >= UI_FLOOR,
        `${name} border-strong ${p.borderStrong} on ${surface} = ${contrast(p.borderStrong, p[surface]).toFixed(2)}:1`
      );
    }
  }
  assert.match(TW, /600:\s*"rgb\(var\(--text-subtle\) \/ <alpha-value>\)"/, "slate-600 aliases the subtle-text token");
  assert.match(TW, /700:\s*"rgb\(var\(--text-subtle\) \/ <alpha-value>\)"/, "slate-700 aliases the subtle-text token");
  assert.ok(!TW.includes('600: "rgb(var(--border-strong)'), "slate-600 must not alias a border token");
});

// WCAG 1.4.11 non-text contrast: status dots, badge fills and icons painted
// with the warning/cyan/mint/gold accents must stay ≥3:1 against the ground.
// These shipped at 1.9–2.5:1 in light mode (visible in dark, invisible in
// light) before the pass.
test(`light status fills (warning, cyan, mint, gold) clear the 3:1 UI floor vs bg`, () => {
  for (const fill of ["warning", "cyan", "mint", "gold"]) {
    assert.ok(
      contrast(LIGHT_P[fill], LIGHT_P.bg) >= UI_FLOOR,
      `light ${fill} ${LIGHT_P[fill]} on bg = ${contrast(LIGHT_P[fill], LIGHT_P.bg).toFixed(2)}:1 — non-text UI needs ${UI_FLOOR}:1`
    );
  }
});

// Placeholders are real text the user must read (input hints, the CBT essay
// prompt). They ride their own token so they can be tuned independently of
// subtle, and must clear 4.5:1 wherever an input sits: bg and surface-2.
test(`placeholder text clears the body floor on bg AND surface-2, both themes`, () => {
  for (const [name, p] of [["dark", DARK_P], ["light", LIGHT_P]]) {
    for (const surface of ["bg", "surface2"]) {
      assert.ok(
        contrast(p.placeholder, p[surface]) >= BODY_FLOOR,
        `${name} placeholder ${p.placeholder} on ${surface} = ${contrast(p.placeholder, p[surface]).toFixed(2)}:1`
      );
    }
  }
});

// Links are interactive text: AA on the ground AND on the elevated surface.
test(`link token clears the body floor on bg AND surface-2, both themes`, () => {
  for (const [name, p] of [["dark", DARK_P], ["light", LIGHT_P]]) {
    for (const surface of ["bg", "surface2"]) {
      assert.ok(
        contrast(p.link, p[surface]) >= BODY_FLOOR,
        `${name} link ${p.link} on ${surface} = ${contrast(p.link, p[surface]).toFixed(2)}:1`
      );
    }
  }
});

// Input borders must be visible-but-quiet: ≥3:1 (1.4.11) against both grounds
// without shouting like border-strong.
test(`input-border clears the 3:1 UI floor on bg and surface, both themes`, () => {
  for (const [name, p] of [["dark", DARK_P], ["light", LIGHT_P]]) {
    for (const surface of ["bg", "surface"]) {
      assert.ok(
        contrast(p.inputBorder, p[surface]) >= UI_FLOOR,
        `${name} input-border ${p.inputBorder} on ${surface} = ${contrast(p.inputBorder, p[surface]).toFixed(2)}:1`
      );
    }
  }
});

// Dark mode tracks the [data-theme] attribute, never the OS — an OS-following
// dark: variant flips under a setting the app ignores and half-migrates screens.
test("dark mode is attribute-driven (selector strategy), not OS-following", () => {
  assert.match(TW, /darkMode:\s*\[\s*"selector",\s*'\[data-theme="midnight-scholar"\]'/, "the dark: variant keys off a [data-theme] attribute");
  assert.doesNotMatch(TW, /darkMode:[^\]]*prefers-color-scheme/, "the dark: variant must not follow the OS scheme");
});

// PWA/browser chrome follows the app grounds via two theme-color metas.
test("the layout ships theme-color metas for both colour schemes", () => {
  assert.match(LAYOUT, /themeColor/, "the viewport export carries themeColor");
  assert.match(LAYOUT, /prefers-color-scheme: dark/, "a dark scheme value ships");
  assert.match(LAYOUT, /prefers-color-scheme: light/, "a light scheme value ships");
});

// ─── source contracts carried over from 6d ───────────────────────────────────

test("globals.css ships a global :focus-visible fallback so no element is a keyboard dead zone", () => {
  assert.match(CSS, /:focus-visible\s*\{[^}]*outline:\s*2px solid rgb\(var\(--focus\)\)/, "the fallback ring is the gold token at 2px");
});

test("blur is neutralised globally — the engineered look has no backdrop blur", () => {
  assert.match(CSS, /backdrop-blur[^{]*\{\s*backdrop-filter:\s*none !important/, "every backdrop-blur utility is dead on arrival");
});

test("the layout defaults to the dark theme and applies the stored theme before paint", () => {
  assert.match(LAYOUT, /data-theme="midnight-scholar"/, "Midnight Scholar (dark) is the default");
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
