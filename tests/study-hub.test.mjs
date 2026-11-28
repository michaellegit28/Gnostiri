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

test("the hub carries NO inline lane switch — the toggle lives only in the menu and Settings", () => {
  const page = q(PAGE);
  assert.doesNotMatch(page, /StudyLaneSwitch|setLearningDomain/, "the study hub must not switch lanes inline");
  assert.match(page, /settings#learning-domain-settings/, "it points at the canonical lane settings instead");
});