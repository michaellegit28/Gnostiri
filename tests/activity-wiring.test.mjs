// Every learning-completion endpoint must advance the daily streak.
//
// The defect this kills: `recordLearningActivity` was called from exactly two
// routes out of fourteen completion endpoints. The dashboard therefore showed
// "Current streak: 0 days" to anyone who studied through the MBBS exam hall, a
// CBT simulation, a practice run, a course quiz, a mastery review, a cup or a
// pod -- i.e. to most students, forever. Nothing failed, because nothing
// checked: the two wired routes worked perfectly and the twelve unwired ones
// simply never mentioned the helper.
//
// The rule is expressed as an EXCLUDE list, so the default for a new endpoint is
// "you must advance the streak". Adding a completion route without wiring it
// fails this test until someone consciously adds it to EXCLUDE.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const API = new URL("../src/app/api/", import.meta.url).pathname;

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (entry === "route.ts") out.push(full);
  }
  return out;
}

const POST_ROUTES = walk(API)
  .filter((f) => /export\s+async\s+function\s+POST/.test(readFileSync(f, "utf8")))
  .map((f) => f.replace(API, "").replace(/\/route\.ts$/, ""));

// Routes that complete no learning and so have no streak to advance.
// Each entry is a deliberate decision, not a gap.
const NOT_LEARNING = [
  "admin/alignments/import",       // admin CSV import
  "admin/launch-tokens/generate",  // ops token mint
  "alignments/flag",               // content flag
  "analytics",                     // telemetry
  "auth/country",                  // profile preference
  "battle-plan",                   // plan generation, not study
  "cbt/session",                   // start a sitting
  "competitions/[id]/streak",      // streak claim, not learning
  "competitions",                  // create a cup
  "competitions/join",             // join a cup
  "content-reports",               // report content
  "demo-quiz",                     // anonymous trial, no account to advance
  "documents",                     // upload
  "downloads",                     // download artifact
  "launch/redeem",                 // token redemption
  "library",                       // publish artifact
  "library/[id]/adopt",            // adopt artifact
  "mastery/subscribe",             // opt into mastery
  "notifications",                 // mark read
  "payments/checkout",
  "payments/webhook/[provider]",
  "practice/ai-mark",              // marking helper, no attempt row
  "practice/draft",                // draft save
  "practice/section/start",        // section start
  "practice/session",              // create a session
  "quiz/answer",                   // one answer check, not a completion
  "quiz/session",                  // start a session
  "ranking/pods/open",             // matchmaking
  "ranking/queue",                 // queue toggle
  "ranking/season/close",          // ops
  "revalidate",                    // cache
  "study-plans",                   // notepad write
  "tutor",                         // chat turn
];

const REQUIRED = POST_ROUTES.filter((r) => !NOT_LEARNING.includes(r));

test("the completion-endpoint set is recognised", () => {
  // Guards against the discovery regex silently matching nothing.
  assert.ok(POST_ROUTES.length > 30, `discovered ${POST_ROUTES.length} POST routes`);
  assert.ok(REQUIRED.length >= 13, `expected at least 13 completion routes, got ${REQUIRED.length}`);
});

test("every learning-completion endpoint advances the daily streak", () => {
  const unwired = REQUIRED.filter((route) => {
    const file = join(API, route, "route.ts");
    if (!existsSync(file)) return true;
    const src = readFileSync(file, "utf8");
    return !/recordLearningActivity\s*\(/.test(src);
  });
  assert.deepEqual(
    unwired,
    [],
    "these endpoints finish a student's learning but never advance their streak:\n" +
      unwired.map((r) => "  " + r).join("\n") +
      "\n\nAdd recordLearningActivity(user.id) on the success path (it swallows its own\n" +
      "errors, so it can never fail a finished submission), or add the route to the\n" +
      "NOT_LEARNING list in this test with a reason."
  );
});

test("no POST route is silently unclassified", () => {
  // Every discovered route is either classified as not-learning or required to
  // advance the streak. A path in neither means a completion route slipped in.
  const classified = new Set([...NOT_LEARNING, ...REQUIRED]);
  const orphans = POST_ROUTES.filter((r) => !classified.has(r));
  assert.deepEqual(orphans, [], `unclassified POST routes:\n${orphans.join("\n")}`);
});
