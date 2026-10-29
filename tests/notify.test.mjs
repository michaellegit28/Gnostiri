// Source contract for the notification writer (ROADMAP §2).
//
// The defect class this test kills: drift between the surfaces. The roadmap
// names ONE writer — createNotification — every feature calls, and ONE
// outbound channel — notifyEmail — env-gated on Resend credentials. If a
// feature starts calling a provider directly, or if the quiet-hours/muted-type
// policy stops living in the writer, the promise "in-app is primary, email is
// an opt-in backup, nothing else leaves" quietly breaks.
//
// This suite asserts the CONTRACT on the shipped source (node:test, no DB,
// no Prisma import — the same source-contract style as tests/mbbs-spine.test.mjs):
//
//   - the two exported entry points exist: createNotification + notifyEmail
//   - email backup is env-gated: RESEND_API_KEY + NOTIFY_FROM_EMAIL
//   - the only fetch( in the file lives inside notifyEmail — split the source
//     on "notifyEmail" and the head (the in-app writer) must be network-free
//   - the provider call is wrapped so a failed send never breaks the caller
//   - muted types and quiet hours are honoured by the writer itself
//   - the eight known notification types are the closed list

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const ROOT = new URL("../", import.meta.url).pathname;
const SRC = readFileSync(`${ROOT}src/lib/notify.ts`, "utf8");

const NOTIFICATION_TYPES = [
  "cup_starting",
  "streak_risk",
  "overtaken",
  "bracket_invite",
  "milestone",
  "artifact_reward",
  "season_result",
  "report_resolved",
];

test("the single writer and the email backup are both exported", () => {
  assert.match(SRC, /export async function createNotification\(/, "every feature writes through createNotification");
  assert.match(SRC, /export async function notifyEmail\(/, "the email backup has exactly one home");
});

test("email backup is env-gated on Resend", () => {
  assert.match(SRC, /RESEND_API_KEY/, "no credentials → no send (no-op)");
  assert.match(SRC, /NOTIFY_FROM_EMAIL/);
  assert.match(SRC, /https:\/\/api\.resend\.com\/emails/, "the provider is Resend");
});

test("no network call outside the email function", () => {
  const [inAppWriter, emailWriter] = SRC.split("export async function notifyEmail");
  assert.ok(emailWriter !== undefined, "notifyEmail must be defined");
  assert.ok(
    !inAppWriter.includes("fetch("),
    "only notifyEmail may reach the network — features must not call providers themselves"
  );
  const calls = (emailWriter.match(/fetch\(/g) ?? []).length;
  assert.equal(calls, 1, "exactly one provider call, inside notifyEmail");
  assert.equal((SRC.match(/fetch\(/g) ?? []).length, 1, "the file may not reach the network anywhere else");
});

test("a failed send never breaks the caller", () => {
  const [, emailWriter] = SRC.split("export async function notifyEmail");
  assert.match(emailWriter, /try \{/, "the provider call is wrapped");
  assert.match(emailWriter, /catch \{/, "and swallowed");
  assert.match(emailWriter, /return false/, "failure degrades to 'not emailed', never a throw");
});

test("the writer honours muted types and quiet hours itself", () => {
  const [inAppWriter] = SRC.split("export async function notifyEmail");
  assert.match(inAppWriter, /mutedTypes/, "a muted type writes nothing");
  assert.match(inAppWriter, /return null/, "muted → the caller gets null, no row");
  assert.match(inAppWriter, /isWithinQuietHours/, "quiet hours defer the email, not the in-app row");
  assert.match(inAppWriter, /emailOptIn/, "email backup is opt-in");
});

test("the eight known types are the closed list", () => {
  for (const type of NOTIFICATION_TYPES) {
    assert.ok(SRC.includes(`"${type}"`), `type ${type} must be a known type`);
  }
});
