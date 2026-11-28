// Contract tests for /progress as the analytics home (IA rework).
//
// Home answers "what now"; everything merely interesting lives here — stat
// chips, the week timeline, the ranking and achievements. The page is a
// server shell (auth + DB reads server-side) over a client dashboard for the
// lane-filtered tables (AGENTS.md rule 4).

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const ROOT = new URL("..", import.meta.url).pathname;
const q = (p) => readFileSync(ROOT + p, "utf8");

const PAGE = "src/app/progress/page.tsx";
const CLIENT = "src/components/progress/ProgressDashboard.tsx";
const STATS = "src/components/dashboard/StatsRow.tsx";
const HOME = "src/app/page.tsx";

test("Progress is a server component that gates auth server-side", () => {
  const page = q(PAGE);
  assert.doesNotMatch(page, /^["']use client["']/m, "the analytics shell is server-rendered");
  assert.match(page, /getCurrentUser\(\)/, "auth is resolved server-side");
  assert.match(page, /from ["']@\/lib\/db["']/, "DB reads live server-side (rule 4)");
  assert.match(page, /Sign in required/, "an anonymous visitor gets the sign-in card");
});

test("Progress carries the relocated analytics surfaces", () => {
  const page = q(PAGE);
  assert.match(page, /<StatsRow /, "stat chips (streak / accuracy / minutes)");
  assert.match(page, /<WeekTimeline \/>/, "the seven-day plan timeline");
  assert.match(page, /<LeagueStatusWidget \/>/, "the global ranking");
  assert.match(page, /<RecentAchievements /, "recent achievements");
  assert.match(page, /<ProgressDashboard \/>/, "the lane-filtered tables (client half)");
  const home = q(HOME);
  for (const banned of [/StatsRow/, /LeagueStatusWidget/, /RecentAchievements/]) {
    assert.doesNotMatch(home, banned, "Home carries no analytics");
  }
});

test("the lane-filtered tables are the client half and fetch by lane", () => {
  const src = q(CLIENT);
  assert.match(src, /^["']use client["']/m, "tabs and retries need a client component");
  assert.match(src, /api\/progress\/dashboard\?domain=\$\{activeTab\}/, "the lane tab drives the fetch");
  assert.doesNotMatch(src, /@\/lib\/db|from ["']@prisma\/client["']/, "no DB client in the client bundle");
  for (const tab of ["highschool", "university", "extras"]) {
    assert.match(src, new RegExp(`setActiveTab\\("${tab}"\\)`), `the ${tab} lane tab exists`);
  }
});

test("the stat chips are lane-scoped — a High School session never sees University numbers", () => {
  const src = q(STATS);
  assert.match(src, /domain\?: LearningDomain/, "StatsRow accepts the active lane");
  assert.match(src, /quizAttempt\.aggregate\(\{[\s\S]{0,120}domain/, "quiz rows are filtered by lane");
  assert.match(src, /uniOnly/, "university-only surfaces (course sessions, desk tasks) are excluded for High School");
  assert.match(src, /all scored \$\{domainLabel\(domain\)\} sessions/, "the accuracy hint names the lane");
});

test("the stat chips do not self-link when rendered on Progress", () => {
  const src = q(STATS);
  assert.match(src, /linkTo = "\/progress"/, "the chips link out by default");
  assert.match(src, /linkTo \?/, "and degrade to a non-link when already on that page");
  assert.match(q(PAGE), /<StatsRow userId=\{user\.id\} domain=\{domain\} linkTo=\{null\} \/>/, "Progress passes no self-link");
});