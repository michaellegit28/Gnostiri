// Contract tests for the Study hub (IA rework — Study is the tool hub).
//
// Home is action-only, so the full grid lives here: the current lane's study
// surfaces plus the shared tools, grouped into labelled sections, with an
// inline lane switch that re-scopes the server payload.

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const ROOT = new URL("..", import.meta.url).pathname;
const q = (p) => readFileSync(ROOT + p, "utf8");

const PAGE = "src/app/study/page.tsx";
const GRID = "src/components/study/StudyGrid.tsx";
const SWITCH = "src/components/study/StudyLaneSwitch.tsx";

test("the hub groups its grid into labelled sections, not one flat list of identical cards", () => {
  const page = q(PAGE);
  assert.match(page, /id: "lane"/, "the lane's own surfaces form one section");
  assert.match(page, /id: "tools"/, "the shared tools form their own section");
  const grid = q(GRID);
  assert.match(grid, /sections\.map\(/, "the grid renders by section");
  assert.match(grid, /aria-labelledby=\{`study-section-\$\{section\.id\}`\}/, "sections are labelled for assistive tech");
});

test("the hub carries each lane's full surface set", () => {
  const page = q(PAGE);
  for (const href of ["/highschool/exams", "/highschool/study", "/cbt"]) {
    assert.match(page, new RegExp(`href: "${href}"`), `${href} is a High School hub card`);
  }
  for (const href of ["/university", "/university/ai", "/desk", "/university/revision"]) {
    assert.match(page, new RegExp(`href: "${href}"`), `${href} is a University hub card`);
  }
  for (const href of ["/tutor", "/discovery", "/battle-plan"]) {
    assert.match(page, new RegExp(`href: "${href}"`), `${href} is a shared tool card`);
  }
});

test("the hub ships only the current lane's cards (server-side audience filter)", () => {
  const page = q(PAGE);
  assert.match(page, /isVisibleForAudience\(card\.audience, domain\)/, "the payload is pre-scoped server-side");
  const grid = q(GRID);
  assert.match(grid, /isVisibleForAudience\(card\.audience, domain\)/, "and the client filter re-applies after a lane switch");
});

test("the hub lane switch persists the lane and re-renders the server payload", () => {
  const src = q(SWITCH);
  assert.match(src, /^["']use client["']/m, "an interactive control is a client component");
  assert.match(src, /setLearningDomain\(domain\)/, "picking a lane persists it (context + cookie + profile)");
  assert.match(src, /router\.refresh\(\)/, "and round-trips the server so the grid re-scopes");
  assert.doesNotMatch(src, /@\/lib\/db|from ["']@prisma\/client["']/, "no DB client in the client bundle");
  const page = q(PAGE);
  assert.match(page, /<StudyLaneSwitch \/>/, "the hub renders the switch");
});

test("the lane switch meets the a11y floor (listbox semantics, 44px targets, visible focus)", () => {
  const src = q(SWITCH);
  assert.match(src, /aria-haspopup="listbox"/, "the trigger exposes listbox semantics");
  assert.match(src, /role="option"/, "options are announced as options");
  assert.match(src, /aria-selected=/, "the current lane is exposed beyond colour");
  assert.match(src, /min-h-\[44px\]/, "targets clear the 44px floor");
  assert.match(src, /focus-visible:ring/, "keyboard focus is always visible");
});