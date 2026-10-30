// Source contract for the home-page dashboard (ROADMAP.md Phase 6b).
//
// The defect class this suite kills: a home page that fakes progress. A single
// mistake — an invented streak number, a leaked quiz stem in the library strip,
// a hand-written @keyframes animation that ignores prefers-reduced-motion, or
// the marketing hero quietly disappearing from the signed-out route — breaks
// the roadmap's core promise: every number on the dashboard is earned.
//
// Source-contract assertions on the shipped files (node:test, no DB, no Prisma
// import — the same style as tests/library.test.mjs).

import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const ROOT = new URL("../", import.meta.url).pathname;
const read = (rel) => readFileSync(`${ROOT}${rel}`, "utf8");

const PAGE = read("src/app/page.tsx");
const DIR = "src/components/dashboard/";
const FILES = [
  "Greeting.tsx",
  "BattlePlanHero.tsx",
  "StatsRow.tsx",
  "StudyGrid.tsx",
  "LeagueBanner.tsx",
  "LibraryStrip.tsx",
  "DashboardTeaser.tsx",
];
const sources = FILES.map((f) => [f, read(`${DIR}${f}`)]);

test("the home page renders the dashboard server-rendered from real data", () => {
  for (const name of ["Greeting", "BattlePlanHero", "StatsRow", "StudyGrid", "LeagueBanner", "LibraryStrip"]) {
    assert.match(PAGE, new RegExp(`import ${name} from "@/components/dashboard/${name}"`), `${name} is wired into the home route`);
  }
  assert.match(PAGE, /import \{ getCurrentUser \} from "@\/lib\/server-auth"/, "the signed-in branch comes from the session cookie, not a client fetch");
  assert.match(PAGE, /export const dynamic = "force-dynamic"/, "the dashboard reads per-request data — never a static build");
  assert.match(PAGE, /<BattlePlanHero userId=\{user\.id\} \/>/, "the hero gets the real user id");
});

test("the thin client progress strip is fully replaced, not left behind", () => {
  assert.ok(!existsSync(`${ROOT}src/components/HomeDashboard.tsx`), "the old HomeDashboard strip file is gone");
  assert.doesNotMatch(PAGE, /HomeDashboard(?!\.)/, "nothing imports the deleted strip");
});

test("the signed-out home still ships the original marketing sections", () => {
  assert.match(PAGE, /Make exceptional learning accessible to everyone\./, "the sr-only SEO h1 hero string survives");
  assert.match(PAGE, /Gnostiri — Make exceptional learning accessible to everyone\./, "the hero heading is unchanged");
  assert.match(PAGE, /The three ways/, "the domain-cards marketing section survives below the dashboard");
  assert.match(PAGE, /How It Works/, "the how-it-works marketing section survives below the dashboard");
  assert.match(PAGE, /Curiosity is the <span className="italic text-gold">only<\/span> prerequisite\./, "the manifesto survives");
  assert.match(PAGE, /<DashboardTeaser \/>/, "anonymous visitors get exactly one teaser band");
});

test("no dashboard component invents a streak or accuracy number", () => {
  for (const [name, src] of sources) {
    assert.doesNotMatch(src, /Day 1/i, `${name} never fakes a "Day 1" streak`);
    assert.doesNotMatch(src, /\b\d{1,3}%/, `${name} never hard-codes an accuracy percentage (digits before a % sign)`);
    assert.doesNotMatch(src, /streak[^\n]{0,40}=\s*\d+/i, `${name} never assigns a literal streak value`);
  }
  assert.match(read(`${DIR}StatsRow.tsx`), /appears after your first session/, "an empty accuracy/study-time metric renders the honest em-dash with the waiting line");
  assert.match(read(`${DIR}StatsRow.tsx`), /aggregate\(/, "stats are aggregated from real rows, never seeded");
  assert.match(read(`${DIR}DashboardTeaser.tsx`), /never fakes|only once you have earned them/, "the signed-out teaser says out loud that numbers are earned");
});

test("the battle-plan hero reuses the existing plan query shape, not a new engine", () => {
  const hero = read(`${DIR}BattlePlanHero.tsx`);
  assert.match(hero, /generatedBy: "battle"/, "it queries the same study-plan shape as /api/battle-plan");
  assert.match(hero, /orderBy: \{ updatedAt: "desc" \}/, "the active-plan query matches the battle-plan route");
  assert.match(hero, /prisma\.progress\.findMany\(\{/, "done state comes from the same progress rows the battle-plan route uses");
  assert.match(hero, /href="\/battle-plan"/, "the CTA links to the real battle-plan screen");
  assert.match(hero, /Resume Battle Plan/, "a plan that exists offers the resume CTA");
  assert.match(hero, /Build your battle plan/, "with no plan the hero becomes the build CTA");
});

test("the study grid derives its counts from prisma, never hard-coded strings", () => {
  const grid = read(`${DIR}StudyGrid.tsx`);
  assert.match(grid, /prisma\.question\.count\(/, "question counts come from the database");
  assert.match(grid, /prisma\.topic\.count\(/, "subject counts come from the database");
  assert.match(grid, /prisma\.course\.count\(/, "university course counts come from the database");
  assert.match(grid, /BookOpen[\s\S]*GraduationCap[\s\S]*Compass[\s\S]*FolderOpen/, "the four doorways use the lucide icons the design language specifies");
});

test("the league banner reads the real season calendar and the live-cup count", () => {
  const banner = read(`${DIR}LeagueBanner.tsx`);
  assert.match(banner, /import \{ CURRENT_SEASON, SEASONS \} from "@\/lib\/competition"/, "the banner imports the shared contract (no second season list)");
  assert.match(banner, /Cups open soon — \$\{season\.label\} is live/, "zero live cups still renders the banner with the honest copy");
  assert.match(banner, /visibility: "public"/, "the live-cup count is public cups only");
  assert.match(banner, /href="\/league"/, "the banner links to the league lobby");
});

test("the library strip reuses the public-library select shape — no quiz content leaks", () => {
  const strip = read(`${DIR}LibraryStrip.tsx`);
  assert.match(strip, /visibility: "public", status: "ready"/, "it browses the same published artifacts as /api/library");
  assert.match(strip, /notes: true/, "the exact select field is reused (never wider)");
  assert.match(strip, /_count: \{ select: \{ quizItems: true \} \}/, "quiz exposure stays a count, exactly like the library route");
  assert.ok(!strip.includes("correctAnswer"), "no quiz answer may enter the dashboard strip");
  assert.doesNotMatch(strip, /\bstem\b/, "the strip must not even select quiz stems");
  assert.doesNotMatch(strip, /options:/, "the strip must not select quiz options");
  assert.match(strip, /The library is waiting for its first shared notes — yours could be first\./, "the empty state is honest, not a stock feed");
});

test("prefers-reduced-motion is respected — animate-* classes only, no hand-written keyframes", () => {
  for (const [name, src] of sources) {
    assert.doesNotMatch(src, /@keyframes/, `${name} writes no custom keyframes that would bypass the global reduce-motion CSS`);
    assert.doesNotMatch(src, /transition-\w+.*style=\{/, `${name} drives no motion through inline styles that Tailwind cannot disable`);
  }
  const motionSources = sources.filter(([, src]) => /animate-/.test(src)).map(([name]) => name);
  assert.ok(motionSources.length > 0, "the dashboard glow uses Tailwind animate-* utilities, which the global CSS already neutralises under reduce-motion");
  assert.match(read(`${DIR}BattlePlanHero.tsx`), /animate-pulse/, "the hero glow breathes through a Tailwind animate-* class");
});
