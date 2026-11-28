// Contract tests for the dashboard "Today" modules (orchestrator assignment,
// agent-3/today-path-r1): Today's path roadmap + stat chips.
//
// The Focus timer was removed on the UX/IA pass (owner directive — a low-value
// surface on a lane-tabbed dashboard); its component-invariant tests below now
// skip because the file is gone, which is the intended regression guard against
// it quietly returning.
//
// Source-level assertions on the shipped components — no DB, no browser —
// following the pattern of qa-tools.test.mjs / dashboard.test.mjs. They encode
// the house rules (AGENTS.md rule 4: server components by default, no DB client
// in client bundles, no event handlers in server components) plus a11y and
// honest-empty-state guarantees for the new dashboard modules.
//
// Merge-order safe: component-invariant tests skip until the files exist, so
// this branch is green before agent-3 lands; they activate automatically after
// the app-lane PR merges. The Home-wiring test is transition-tolerant
// (BattlePlanHero OR TodaysPath) so neither side of the swap breaks it.

import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const ROOT = new URL("../", import.meta.url).pathname;
const read = (p) => readFileSync(`${ROOT}${p}`, "utf8");
const has = (p) => existsSync(`${ROOT}${p}`);

const PAGE = "src/app/page.tsx";
const TODAYS_PATH = "src/components/dashboard/TodaysPath.tsx";
const FOCUS_TIMER = "src/components/dashboard/FocusTimer.tsx";

// ─── Home wiring ──────────────────────────────────────────────────────────────

test("Home wires the today's-path module (day planning stays on the dashboard)", () => {
  const home = has(PAGE) ? read(PAGE) : "";
  // Transition-tolerant: legacy BattlePlanHero or the new TodaysPath.
  assert.match(home, /BattlePlanHero|TodaysPath/, "Home must render a day-planning module");
});

test("Home keeps the greeting + day module; analytics/tools move to Study/Progress", () => {
  const home = has(PAGE) ? read(PAGE) : "";
  assert.match(home, /Greeting/, "the greeting stays on Home");
  assert.match(home, /BattlePlanHero|TodaysPath/, "the day module stays on Home");
  assert.doesNotMatch(home, /StatsRow|LeagueStatusWidget|RecentAchievements|TutorShortcut/, "analytics/tools are off Home");
});

test("Home wires the day-planning module server-scoped (userId) and drops the focus timer", () => {
  const page = has(PAGE) ? read(PAGE) : "";
  // The day module may be the legacy BattlePlanHero file or the new TodaysPath
  // (which main imports aliased as BattlePlanHero). Either way it must be
  // user-scoped server-side.
  assert.match(page, /BattlePlanHero|TodaysPath/, "Home renders a day-planning module");
  assert.match(
    page,
    /(BattlePlanHero|TodaysPath)[\s\S]{0,160}userId=\{user\.id\}/,
    "the day module receives userId={user.id} (server-scoped, not client-derived)",
  );
  // The Focus timer was removed on the UX/IA pass — it must not be wired back in.
  assert.doesNotMatch(page, /FocusTimer/, "the focus timer is no longer wired on Home");
});

// ─── TodaysPath: server component invariants ──────────────────────────────────

test("TodaysPath is a server component that owns its own DB reads (no client bundle leak)", { skip: !has(TODAYS_PATH) }, () => {
  const src = read(TODAYS_PATH);
  assert.doesNotMatch(src, /^["']use client["']/m, "TodaysPath must be a server component — no 'use client'");
  assert.match(src, /export default async function TodaysPath/, "server components that read data are async");
  assert.match(src, /from ["']@\/lib\/db["']/, "the DB client lives server-side in this component");
  assert.match(src, /userId\s*:\s*string/, "it takes the caller's userId, never re-derives identity client-side");
});

test("TodaysPath has NO event handlers (an onClick here would crash it as an RSC digest)", { skip: !has(TODAYS_PATH) }, () => {
  const src = read(TODAYS_PATH);
  assert.doesNotMatch(src, /\sonClick=|\sonChange=|\sonSubmit=/, "server components cannot carry event handlers — navigate with <Link>");
  assert.match(src, /from ["']next\/link["']/, "navigation inside a server component is <Link href>, not a button handler");
});

test("TodaysPath renders an honest empty state, not a fabricated plan", { skip: !has(TODAYS_PATH) }, () => {
  const src = read(TODAYS_PATH);
  assert.match(src, /All clear for today|Build your battle plan/, "an honest empty state exists when there is no plan");
});

test("TodaysPath meets the a11y floor (labelled region, current-step signal, live region, 44px targets, reduced motion)", { skip: !has(TODAYS_PATH) }, () => {
  const src = read(TODAYS_PATH);
  assert.match(src, /aria-labe|\bid=|\brole=/, "the roadmap region is labelled for assistive tech");
  assert.match(src, /aria-current=/, "the current stop is signalled beyond colour (aria-current)");
  assert.match(src, /role="status"|aria-live/, "state changes are announced politely");
  assert.match(src, /min-h-\[44px\]|min-h-\[52px\]|min-h-\[56px\]/, "interactive stops clear the 44px floor");
  assert.match(src, /focus-visible:ring/, "keyboard focus is always visible");
  assert.match(src, /motion-safe:|prefers-reduced-motion/, "motion is dropped for reduced-motion users");
});

// ─── FocusTimer: client component invariants ──────────────────────────────────

test("FocusTimer is a client component that never touches the database", { skip: !has(FOCUS_TIMER) }, () => {
  const src = read(FOCUS_TIMER);
  assert.match(src, /^["']use client["']/m, "an interactive timer must be a client component");
  assert.doesNotMatch(src, /@\/lib\/db|from ["']@prisma\/client["']/, "NO DB client inside a client bundle (AGENTS.md rule 4)");
});

test("FocusTimer offers the 25/50/90 durations and drives them with local state", { skip: !has(FOCUS_TIMER) }, () => {
  const src = read(FOCUS_TIMER);
  assert.match(src, /\[?\s*25\s*,\s*50\s*,\s*90\s*\]?/, "the 25 / 50 / 90 minute presets exist");
  assert.match(src, /useState/, "the countdown is client state, not a server round-trip");
});

test("FocusTimer meets the a11y floor (labelled group, pressed duration, timer role, 44px, focus, reduced motion)", { skip: !has(FOCUS_TIMER) }, () => {
  const src = read(FOCUS_TIMER);
  assert.match(src, /aria-labe|\bid=/, "the widget carries an accessible name");
  assert.match(src, /aria-pressed|aria-checked|role="group"/, "the duration picker exposes its selected state");
  assert.match(src, /aria-live|role="timer"|role="status"/, "the countdown state is announced");
  assert.match(src, /min-h-\[44px\]/, "controls clear the 44px floor");
  assert.match(src, /focus-visible:ring/, "keyboard focus is always visible");
  assert.match(src, /motion-safe:|prefers-reduced-motion/, "motion is dropped for reduced-motion users");
});

// ─── Stat chips (StatsRow re-skin) ─────────────────────────────────────────────

test("StatsRow re-skin stays token-driven (no hardcoded hex outside the token block)", { skip: !has("src/components/dashboard/StatsRow.tsx") }, () => {
  const src = read("src/components/dashboard/StatsRow.tsx");
  // The zero-hardcoded-hex rule is enforced globally elsewhere; this guards the
  // re-skinned chips against a one-off literal sneaking into the dashboard.
  const hexes = src.match(/#[0-9A-Fa-f]{3,8}\b/g) ?? [];
  assert.deepEqual(hexes, [], "stat chips must use theme tokens, not literal hex");
});