// Battle Plan foundation contract (UX/IA + tiered planner pass).
//
// Tiered architecture check, all static (no DB, no network):
//   - a single shared /battle-plan nav item whose page toggles High School
//     (rules-driven, automated) vs University (AI, premium)
//   - the Prisma schema carries one unified BattlePlan store (goals, dates,
//     generated plan) shared by both lanes
//   - the migration is strictly additive and can never break existing tables
//   - the client page honours rule 4 (no DB client in the browser bundle)

import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const ROOT = new URL("../", import.meta.url).pathname;
const read = (p) => readFileSync(`${ROOT}${p}`, "utf8");
const has = (p) => existsSync(`${ROOT}${p}`);

const SCHEMA = "prisma/schema.prisma";
const PAGE = "src/app/battle-plan/page.tsx";
const MIGRATION_DIR = "prisma/migrations/20261126120000_battle_plan";
const MIGRATION = `${MIGRATION_DIR}/migration.sql`;
const EXTRA_MIGRATION = `${MIGRATION_DIR}/README.md`;

// ─── one nav item, two lanes ──────────────────────────────────────────────────

test("Battle Plan is one shared nav item (the page toggles the lane)", () => {
  const nav = read("src/components/chrome/nav-model.ts");
  assert.match(nav, /href: "\/battle-plan"[\s\S]{0,80}?audience: "shared"/, "single shared nav item");
  const page = has(PAGE) ? read(PAGE) : "";
  // The page carries its own lane switcher with both destinations reachable.
  assert.match(page, /role="group"/, "the lane switch is an labelled group");
  assert.match(page, /aria-label="Battle Plan lane"/, "the lane switch is named for assistive tech");
  assert.match(page, /domainLabel\(domain\)/, "both lanes are labelled");
  assert.match(page, /lane === "university"/, "University AI branch is reachable from the toggle");
});

// ─── the unified store ──────────────────────────────────────────────────────────

test("schema defines one BattlePlan store shared by both lanes", () => {
  const schema = read(SCHEMA);
  assert.match(schema, /enum BattlePlanStatus/, "the plan status enum exists");
  assert.match(schema, /model BattlePlan \{[\s\S]*?domain\s+AppDomain/, "a plan is scoped to a lane via AppDomain");
  assert.match(schema, /inputs\s+Json\?/, "student inputs are JSON (lane-specific shape)");
  assert.match(schema, /plan\s+Json\?/, "the generated plan is JSON (rules or AI)");
  assert.match(schema, /goal\s+String\?/, "the student's goal is stored");
  assert.match(schema, /examDate\s+DateTime\?/, "exam dates are stored");
  assert.match(schema, /@@index\(\[userId, domain, status\]\)/, "indexed for per-user, per-lane lookups");
  assert.match(schema, /user User @relation\(fields: \[userId\], references: \[id\], onDelete: Cascade\)/, "owned by the user with cascade delete");
});

// ─── additive-only migration ────────────────────────────────────────────────────

test("the migration is additive and cannot break existing tables", () => {
  assert.ok(has(MIGRATION), `the migration file exists at ${MIGRATION}`);
  const sql = read(MIGRATION);
  assert.match(sql, /CREATE TABLE IF NOT EXISTS "BattlePlan"/, "the new table is created idempotently");
  assert.match(sql, /CREATE TYPE "BattlePlanStatus" AS ENUM/, "the enum is created");
  assert.match(sql, /EXCEPTION[\s\S]{0,80}duplicate_object/, "enum creation is re-runnable");
  assert.match(sql, /"domain" "AppDomain" NOT NULL/, "the lane column reuses the existing AppDomain enum");
  assert.match(sql, /"userId" TEXT NOT NULL REFERENCES "User"\("id"\) ON DELETE CASCADE/, "the FK is owned by User with cascade");
  assert.doesNotMatch(sql, /DROP TABLE|TRUNCATE|DROP COLUMN|ALTER TABLE "User"/, "no destructive statement touches existing tables");
});

// ─── rule 4 on the client page ────────────────────────────────────────────────

test("the battle-plan page is a client page that never imports the DB client", () => {
  const page = has(PAGE) ? read(PAGE) : "";
  assert.match(page, /^["']use client["']/m, "the interactive planner is a client component");
  assert.doesNotMatch(page, /@\/lib\/db|from ["']@prisma\/client["']/, "no Prisma client in the browser bundle (rule 4)");
  // The University AI path is an honest shell, not a fake "generated" plan.
  const uni = page.slice(page.indexOf("lane === \"university\""));
  assert.match(uni, /is being built|will appear here/, "the University planner shows an honest empty state, not a fabricated plan");
});