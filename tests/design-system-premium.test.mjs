// Premium/tactile design-system contracts.
//
// The owner directive was not "add glass and gradients everywhere": cards are
// layered paper, glassmorphism is reserved for the navbar and modals, and every
// motion effect is silenced by OS/motion/Lite preferences. These are source
// contracts so the system cannot quietly regress into either direction.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const ROOT = new URL("../", import.meta.url).pathname;
const read = (p) => readFileSync(`${ROOT}${p}`, "utf8");

const CSS = read("src/app/globals.css");
const SHELL = read("src/components/chrome/AppShell.tsx");
const STUDY_GRID = read("src/components/study/StudyGrid.tsx");
const PRACTICE_GRID = read("src/components/practice/PracticeGrid.tsx");
const STUDY_PAGE = read("src/app/study/page.tsx");
const PRACTICE_PAGE = read("src/app/practice/page.tsx");

test("the background is a dark mesh ground with a faint grain overlay", () => {
  assert.match(CSS, /body::before/, "the second mesh layer exists");
  assert.match(CSS, /body::after/, "the grain overlay exists");
  assert.match(CSS, /mix-blend-mode: soft-light/);
  assert.match(CSS, /data:image\/svg\+xml/, "grain is an inline SVG, not a bitmap");
  assert.match(CSS, /html\.solid-bg body::before[\s\S]*?display: none !important/, "solid background still clears the ground");
});

test("cards use a top-light 1px edge and multi-layered shadows — not glass", () => {
  assert.match(CSS, /\.gn-card\s*\{[\s\S]*?position: relative/);
  assert.match(CSS, /\.gn-card::before\s*\{[\s\S]*?padding: 1px/);
  assert.match(CSS, /\.gn-card::before\s*\{[\s\S]*?mask-composite: exclude/);
  assert.match(CSS, /--card-shadow: 0 1px 1px[^;]*0 8px 20px[^;]*0 22px 60px/, "dark card shadows are layered");
  // Cards must NOT get glass: the study/practice card recipes use gn-card.
  assert.match(STUDY_GRID, /gn-card/);
  assert.match(PRACTICE_GRID, /gn-card/);
  assert.doesNotMatch(STUDY_GRID, /gn-glass/);
  assert.doesNotMatch(PRACTICE_GRID, /gn-glass/);
});

test("glassmorphism is reserved for the navbar and modals", () => {
  // The header, desktop sidebar, mobile drawer, command palette and bottom nav
  // are the only gn-glass consumers in the shell.
  const glassCount = [...SHELL.matchAll(/gn-glass/g)].length;
  assert.ok(glassCount >= 5, `expected the shell chrome to use gn-glass (got ${glassCount})`);
  // The shell must not use ad-hoc backdrop-blur on ordinary cards.
  assert.doesNotMatch(SHELL, /bg-surface\/95 backdrop-blur/);
});

test("buttons are tactile and motion is silenced for every preference", () => {
  assert.match(CSS, /button:not\(:disabled\):active[\s\S]*?transform: scale\(0\.97\)/);
  assert.match(CSS, /@media \(prefers-reduced-motion: no-preference\)/);
  assert.match(CSS, /html\.reduce-motion button:not\(:disabled\):active[\s\S]*?transform: none !important/);
  assert.match(CSS, /html\.lite-mode button:not\(:disabled\):active[\s\S]*?transform: none !important/);
});

test("lists and hero titles carry the requested motion and type", () => {
  assert.match(CSS, /@keyframes gn-fade-up/);
  assert.match(CSS, /\.gn-stagger > \* \{\s*animation: gn-fade-up/);
  assert.match(STUDY_GRID, /gn-stagger/);
  assert.match(PRACTICE_GRID, /gn-stagger/);
  assert.match(CSS, /\.gn-title-gradient/);
  assert.match(STUDY_PAGE, /gn-title-gradient/);
  assert.match(PRACTICE_PAGE, /gn-title-gradient/);
});