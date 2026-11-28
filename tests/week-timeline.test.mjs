// Contract tests for the seven-day plan timeline on /progress (IA rework).
//
// The strip used to live on Home inside TodaysPath (server-rendered). Home is
// now action-only, so the calendar moved to Progress as a client component
// reading /api/battle-plan — no DB client in the client bundle (rule 4).

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const ROOT = new URL("..", import.meta.url).pathname;
const q = (p) => readFileSync(ROOT + p, "utf8");

const TIMELINE = "src/components/progress/WeekTimeline.tsx";
const PROGRESS_PAGE = "src/app/progress/page.tsx";
const API = "src/app/api/battle-plan/route.ts";

test("the week strip renders on /progress, not Home", () => {
  const page = q(PROGRESS_PAGE);
  assert.match(page, /WeekTimeline/, "Progress renders the seven-day timeline");
  const home = q("src/app/page.tsx");
  assert.doesNotMatch(home, /WeekTimeline|Seven-day path/, "Home carries no calendar strip");
});

test("the battle-plan API feeds the timeline a seven-day week array", () => {
  const api = q(API);
  assert.match(api, /const week = Array\.from\(\{ length: 7 \}/, "the API computes a 7-day week");
  assert.match(api, /\bweek,\s*\}/, "and returns it in the GET payload");
});

test("WeekTimeline is a client component that never touches the database", () => {
  const src = q(TIMELINE);
  assert.match(src, /^["']use client["']/m, "interactive fetch state needs a client component");
  assert.doesNotMatch(src, /@\/lib\/db|from ["']@prisma\/client["']/, "no DB client in the client bundle");
  assert.match(src, /fetch\(["']\/api\/battle-plan/, "it reads its data from the battle-plan API");
});

test("WeekTimeline degrades honestly (no fabricated days after a failed read)", () => {
  const src = q(TIMELINE);
  assert.match(src, /failed/, "a failed read is tracked");
  assert.match(src, /nothing is inferred|No plan yet/i, "empty and failed states are honest");
});

test("WeekTimeline meets the a11y floor (labelled days, 44px targets, visible focus, reduced motion)", () => {
  const src = q(TIMELINE);
  assert.match(src, /aria-label=\{[`"]/, "each day carries a descriptive accessible label");
  assert.match(src, /aria-current=/, "today is signalled beyond colour");
  assert.match(src, /min-h-\[52px\]/, "day targets clear the 44px floor");
  assert.match(src, /focus-visible:ring/, "keyboard focus is always visible");
  assert.match(src, /motion-safe:/, "motion is dropped for reduced-motion users");
});