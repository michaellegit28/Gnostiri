// Source contract for the Public Library (ROADMAP.md Phase 4).
//
// The defect class this suite kills: reward and integrity drift in the new
// library surfaces. A single mistake — leaking a quiz answer into the public
// list, making a "ready"-only rule cheerfully share a failed document, or
// dropping the credit/badge writes on adoption — silently breaks the roadmap's
// core promises ("artifacts only", "dual rewards", "integrity before submit").
//
// These are source-contract assertions on the shipped files (node:test, no DB,
// no Prisma import — the same style as tests/notify.test.mjs):
//
//   - the adopt route writes the credit/badge ledger and bumps reuseCount
//   - the library LIST never selects/exposes quiz stems, options or answers
//   - publishing is gated on status "ready"
//   - the "the source file is never stored" invariant comment is present in
//     both the library and adopt surfaces
//   - unpublish does NOT reverse the reward ledger

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const ROOT = new URL("../", import.meta.url).pathname;
const read = (rel) => readFileSync(`${ROOT}${rel}`, "utf8");

const LIST = read("src/app/api/library/route.ts"); // browse + publish
const DETAIL = read("src/app/api/library/[id]/route.ts"); // read + unpublish
const ADOPT = read("src/app/api/library/[id]/adopt/route.ts"); // adopt + dual reward

test("adoption grants the dual reward to the uploader (credits + badges + reuseCount)", () => {
  assert.match(ADOPT, /leagueCredit\.create\(/, "the adopter path writes the credit ledger");
  assert.match(ADOPT, /reason:\s*"artifact-adopted"/, "and it is the adoption reason");
  assert.match(ADOPT, /leagueBadge\.upsert\(/, "badges are upserted (deterministic keys)");
  assert.match(ADOPT, /"artifact-first-adoption"/, "the first-adoption badge key exists");
  assert.match(ADOPT, /artifact-reused-\$\{reuseCount\}/, "every tenth adoption is keyed by the count reached");
  assert.match(ADOPT, /reuseCount:\s*\{\s*increment:\s*1\s*\}/, "the uploader's reuseCount is bumped server-side");
});

test("adoption copies the cohort quiz as the caller's own rows and notifies the uploader", () => {
  assert.match(ADOPT, /documentQuizItem\.createMany\(/, "adoption reuses the dedupe path — copies quiz items");
  assert.match(ADOPT, /userId:\s*user\.id/, "the copied rows belong to the adopter, not the uploader (no PII transfer)");
  assert.match(ADOPT, /type:\s*"artifact_reward"/, "the uploader is notified on adoption");
  assert.match(ADOPT, /status:\s*409|Already on your desk/, "a repeat adoption is a 409, never a reward");
});

test("the library LIST never exposes quiz stems, options or answers", () => {
  assert.ok(!LIST.includes("correctAnswer"), "no quiz answer may enter the public list payload");
  assert.ok(!/\bstem\b/.test(LIST), "the list must not even select quiz stems");
  assert.ok(!/options:/.test(LIST), "the list must not select quiz options");
  // A preview is headings only — the field proves it.
  assert.match(LIST, /notesPreviewOf\(/, "list previews are notes headings, never quiz content");
  assert.match(LIST, /_count:\s*\{\s*select:\s*\{\s*quizItems:\s*true\s*\}\s*\}/, "quiz exposure is a count, not rows");
});

test("publishing is gated on status ready and awards the first-share bundle", () => {
  assert.match(LIST, /status\s*!==\s*"ready"/, "needs-ai / failed documents cannot be shared");
  assert.match(LIST, /"artifact-published"/, "publishing writes the publish credit");
  assert.match(LIST, /"first-artifact"/, "publishing awards the first-platform badge");
  assert.doesNotMatch(LIST, /createNotification/, "publishing is not a notification event");
});

test("the list browse is capped and ordered most-reused first", () => {
  assert.match(LIST, /TAKE_CAP\s*=\s*24/, "take is capped at 24");
  assert.match(LIST, /reuseCount:\s*"desc"/, "order by reuseCount desc");
  assert.match(LIST, /Math\.min\(/, "the cap is actually applied to take");
});

test("unpublish removes visibility but does NOT reverse the reward ledger", () => {
  assert.match(DETAIL, /visibility:\s*"private"/, "DELETE flips back to private");
  assert.match(DETAIL, /sharedAt:\s*null/, "and clears sharedAt");
  assert.match(DETAIL, /NOT reversed|not reversed/i, "the ledger-kept rationale is documented (append-only honour)");
  assert.doesNotMatch(DETAIL, /leagueCredit\.delete/, "prices already earned are never clawed back");
});

test("the 'source file is never stored' invariant is present in the library and adopt surfaces", () => {
  for (const [name, src] of [["library", LIST], ["adopt", ADOPT], ["detail", DETAIL]]) {
    assert.match(src, /source file/i, `${name} names the source-file rule`);
    assert.match(src, /never stored/i, `${name} carries the never-stored invariant`);
  }
});
