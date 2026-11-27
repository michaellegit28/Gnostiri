// Overhaul v1 PR-B — University AI lane contracts (static; no DB, no network).
// Guards: additive-only schema/migration, server-owned API (no DB in client),
// and the AI Studio is a University-only surface.

import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const ROOT = new URL("../", import.meta.url).pathname;
const read = (p) => readFileSync(`${ROOT}${p}`, "utf8");
const has = (p) => existsSync(`${ROOT}${p}`);

const SCHEMA = "prisma/schema.prisma";
const MIG = "prisma/migrations/20261127120000_university_ai_lane/migration.sql";
const NOTES_API = "src/app/api/ai/notes/route.ts";
const NOTES_CLIENT = "src/components/university/AiNotes.tsx";
const NAV = "src/components/chrome/nav-model.ts";

test("the University AI lane models exist and are User-owned", () => {
  const schema = read(SCHEMA);
  for (const model of ["AiNote", "AiTranscriptionSession", "AiAssessment", "AiAssessmentAttempt", "AiCorrection"]) {
    assert.match(schema, new RegExp(`model ${model} \\{`), `${model} exists`);
  }
  // Generated payloads are JSON; course/lesson refs are plain (no FK churn).
  assert.match(schema, /model AiNote \{[\s\S]*?source\s+Json\?/, "AI note source is JSON");
  assert.match(schema, /model AiAssessment \{[\s\S]*?config\s+Json/, "AI assessment config is JSON");
  assert.match(schema, /attempts\s+AiAssessmentAttempt\[\]/, "an assessment owns its attempts");
});

test("the AI-lane migration is strictly additive", () => {
  assert.ok(has(MIG), `migration exists at ${MIG}`);
  const sql = read(MIG);
  for (const t of ["AiNote", "AiTranscriptionSession", "AiAssessment", "AiAssessmentAttempt", "AiCorrection"]) {
    assert.match(sql, new RegExp(`CREATE TABLE IF NOT EXISTS "${t}"`), `${t} created idempotently`);
  }
  assert.doesNotMatch(sql, /DROP TABLE|TRUNCATE|ALTER TABLE "User"|ALTER TABLE "Profile"|DROP COLUMN/, "no destructive statement touches existing tables");
  assert.match(sql, /REFERENCES "User"\("id"\) ON DELETE CASCADE/, "rows cascade from the user");
});

test("AI notes are read/written server-side (no DB client in the browser bundle)", () => {
  const api = read(NOTES_API);
  assert.doesNotMatch(api, /^["']use client["']/m, "the notes API is a server route");
  assert.match(api, /getCurrentUser/, "identity comes from the session, not the client");
  assert.match(api, /from ["']@\/lib\/db["']/, "reads/writes go through Prisma server-side");
  const client = read(NOTES_CLIENT);
  assert.match(client, /^["']use client["']/m, "the notes widget is a client component");
  assert.doesNotMatch(client, /@\/lib\/db|from ["']@prisma\/client["']/, "no Prisma client in the client bundle (rule 4)");
});

test("the AI Studio is a University-only nav destination", () => {
  assert.match(read(NAV), /href: "\/university\/ai",[\s\S]{0,80}?audience: "university"/, "AI Studio belongs to University");
});