// Contract tests for the lane-split Home (owner directive).
//
// "Both uni & HS have the same home — explicitly separate them; they should
// never collapse." Home resolves the session lane server-side and renders
// exactly one lane's "what now" panel: High School → the study-plan path;
// University → the spaced-repetition revision path. Neither panel can ever
// render the other lane's surfaces.

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const ROOT = new URL("..", import.meta.url).pathname;
const q = (p) => readFileSync(ROOT + p, "utf8");

const PAGE = "src/app/page.tsx";
const UNI = "src/components/dashboard/UniversityToday.tsx";

test("Home resolves the lane server-side and renders exactly one lane's panel", () => {
  const page = q(PAGE);
  assert.match(page, /prisma\.profile\.findUnique/, "the lane is resolved from the signed-in profile");
  assert.match(page, /currentDomain/, "via Profile.currentDomain");
  assert.match(page, /domain === "university" \? \(/, "and branches on it — not one shared panel");
  assert.match(page, /<UniversityToday userId=\{user\.id\} \/>/, "University gets its own panel");
  assert.match(page, /<BattlePlanHero userId=\{user\.id\} \/>/, "High School keeps the study-plan path panel");
});

test("the two Home panels are mutually exclusive branches", () => {
  const page = q(PAGE);
  const uniBranch = page.slice(page.indexOf("domain === \"university\""));
  assert.match(uniBranch, /<UniversityToday/, "the university branch renders only the university panel");
  assert.doesNotMatch(uniBranch.slice(0, uniBranch.indexOf("BattlePlanHero")), /LeagueStatusWidget|StatsRow/, "no analytics on Home in either lane");
});

test("the University Home panel carries no High School surface", () => {
  const src = q(UNI);
  // Scope to the rendered JSX (the doc comment names the rule, not the UI).
  const jsx = src.slice(src.indexOf("return ("));
  assert.doesNotMatch(jsx, /battle-plan|GSE|highschool/i, "no HS plan, GSE or High School copy on University Home");
  for (const href of ["/university/revision", "/university", "/university/ai"]) {
    assert.match(src, new RegExp(`href="${href}"`), `${href} is reachable from University Home`);
  }
});

test("the High School Home panel carries no University surface", () => {
  const page = q(PAGE);
  const render = page.slice(page.indexOf("<main"));
  const hsBranch = render.slice(render.indexOf("<BattlePlanHero"), render.indexOf("<BattlePlanHero") + 400);
  assert.doesNotMatch(hsBranch, /university|AI Studio/i, "no University copy in the High School Home branch");
  assert.match(render, /View full plan/, "its secondary action stays 'View full plan'");
});

test("UniversityToday is a server component reading real rows, degrading honestly", () => {
  const src = q(UNI);
  assert.doesNotMatch(src, /^["']use client["']/m, "the panel is server-rendered");
  assert.match(src, /from ["']@\/lib\/db["']/, "DB reads live server-side (rule 4)");
  assert.match(src, /conceptMastery\.count/, "the due count is a real query");
  assert.match(src, /nextReviewDue/, "over the SM-2 schedule");
  assert.match(src, /temporarily unavailable/, "a failed read degrades honestly");
  assert.match(src, /min-h-\[44px\]/, "interactive targets clear the 44px floor");
  assert.match(src, /focus-visible:ring/, "keyboard focus is always visible");
});

test("Home metadata is lane-neutral (one Home, two lanes)", () => {
  const page = q(PAGE);
  assert.match(page, /high school and university, kept separate/, "the shared Home copy names both lanes, not one");
  assert.doesNotMatch(page, /GSE past papers, university/, "the old HS-only description is gone");
});