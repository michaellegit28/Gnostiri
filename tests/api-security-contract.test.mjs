// Security contract tests for the public API surface.
//
// The defect classes this suite pins down (source-level assertions on the
// shipped routes, no DB/network — same style as qa-tools.test.mjs):
//
//   1. OBJECT-LEVEL AUTHORIZATION: any route that mutates or grades a row
//      keyed by a CLIENT-SUPPLIED id (sessionId / matchId / documentId / ...)
//      must resolve the current user with getCurrentUser() AND compare the
//      record's own userId against it. A missing comparison is an IDOR — a
//      stranger can advance, overwrite or grade another learner's row.
//
//   2. THE ANSWER-KEY ORACLE: no route may hand back correctAnswer to an
//      unauthenticated caller. The whole platform's scoring integrity (the
//      "the answer key NEVER leaves the server" invariant, enforced across
//      CBT, practice and the Global Ranking pods) is void the moment an
//      unauthenticated endpoint will trade a correctAnswer for a questionId.
//
//   3. NO OPEN REDIRECT in the OAuth callback: `next` must be same-site only.
//
//   4. SECRET-GUARDED ADMIN TOOLS stay guarded and FAIL-CLOSED: with the
//      secret unset, `authorized()` must be false, never a bypass.
//
// The failing tests below are the acceptance criteria for the owning lanes;
// the passing ones are regressions we must not reintroduce.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const ROOT = new URL("../", import.meta.url).pathname;
const read = (p) => readFileSync(`${ROOT}${p}`, "utf8");

// ─── 1. object-level authorization on id-keyed mutations ─────────────────────

// Every practice mutation is keyed by a client-supplied sessionId and writes
// (draft / advance / grade+close). None currently resolve the caller.
const PRACTICE_MUTATIONS = [
  "src/app/api/practice/draft/route.ts",
  "src/app/api/practice/section/start/route.ts",
  "src/app/api/practice/submit/route.ts",
];

test("practice mutations must authorize the caller against the session owner (IDOR guard)", () => {
  for (const path of PRACTICE_MUTATIONS) {
    const src = read(path);
    assert.match(
      src,
      /getCurrentUser/,
      `${path} must resolve the signed-in user (getCurrentUser) — it currently trusts a client-supplied sessionId`,
    );
    // The fetched session's own userId is compared to the caller. This is the
    // object-level check: ownership, not merely "a session exists".
    assert.match(
      src,
      /session\.userId\s*!==?\s*user\.id|session\.userId\s*===?\s*user\.id|userId:\s*user\.id/,
      `${path} must verify session.userId belongs to the caller before mutating it`,
    );
  }
});

// ─── 2. the answer-key oracle ─────────────────────────────────────────────────

test("/api/quiz/answer must not answer an unauthenticated caller (answer-key oracle guard)", () => {
  const src = read("src/app/api/quiz/answer/route.ts");
  // It returns correctAnswer today, so the only acceptable fix that keeps the
  // teaching behaviour is to gate the route on a resolved user. If the app
  // later stops returning the key pre-answer, relax this to a rate-limit check.
  assert.match(
    src,
    /getCurrentUser/,
    "/api/quiz/answer returns correctAnswer + explanation but resolves no user — unauthenticated harvest of the whole bank; gate it on getCurrentUser (or stop returning the key)",
  );
});

test("paper-serving routes never expose correctAnswer to the client (only comments may name it)", () => {
  // These routes SERVE a live paper/question set to the browser; grading reads
  // the key separately server-side. Assert none of them returns correctAnswer
  // in actual CODE (comments documenting the invariant are fine).
  const serveRoutes = [
    "src/app/api/questions/route.ts",
    "src/app/api/cbt/session/route.ts",
    "src/app/api/practice/manifest/route.ts",
    "src/app/api/competitions/[id]/session/route.ts",
    "src/app/api/ranking/pods/[matchId]/session/route.ts",
  ];
  for (const path of serveRoutes) {
    const src = readFileSync(`${ROOT}${path}`, "utf8");
    const codeOnly = src
      .split("\n")
      .filter((line) => !/^\s*(\/\/|\*|\/\*)/.test(line))
      .join("\n");
    assert.doesNotMatch(
      codeOnly,
      /correctAnswer/,
      `${path} must not reference correctAnswer in code — only serve safe fields (comments are allowed)`,
    );
  }
});

// ─── 3. OAuth callback: no open redirect ──────────────────────────────────────

test("auth callback only redirects to same-site relative paths (no open redirect)", () => {
  const src = read("src/app/auth/callback/route.ts");
  assert.match(src, /startsWith\("\/"\)/, "next must require a leading slash");
  assert.match(src, /!raw\.startsWith\("\/\/"\)/, "a protocol-relative //host must be rejected");
});

// ─── 4. secret-guarded admin tools stay guarded and fail-closed ───────────────

test("secret-guarded tools fail CLOSED when the secret is unset", () => {
  // `authorized()` requires BOTH a supplied secret AND a configured env secret,
  // so an unset REVALIDATE_SECRET returns false for everyone — never a bypass.
  const guarded = [
    "src/app/api/revalidate/route.ts",
    "src/app/api/admin/launch-tokens/generate/route.ts",
    "src/app/api/ranking/season/close/route.ts",
  ];
  for (const path of guarded) {
    const src = read(path);
    assert.match(
      src,
      /secret\s*&&\s*process\.env\.REVALIDATE_SECRET\s*&&/,
      `${path} must require both a supplied secret and a configured REVALIDATE_SECRET (fail-closed)`,
    );
  }
});

test("payments webhook verifies the provider signature with a constant-time compare", () => {
  const src = read("src/app/api/payments/webhook/[provider]/route.ts");
  assert.match(src, /timingSafeEqual/, "webhook must use timingSafeEqual for HMAC verification");
  assert.match(src, /validHmac|webhooks\.constructEvent/, "webhook must verify the signature before acting");
});

// ─── regressions we must NOT reintroduce: ownership checks that already exist ─

test("already-secure id-keyed routes keep their ownership check (regression guard)", () => {
  // These were verified owner-scoped in the 2026-11-18 audit; a refactor that
  // drops the comparison should fail here.
  const owned = {
    "src/app/api/documents/[id]/route.ts": /document\.userId !== user\.id|document\.userId === user\.id/,
    "src/app/api/documents/[id]/quiz/route.ts": /document\.userId === user\.id/,
    "src/app/api/library/[id]/adopt/route.ts": /document\.userId === user\.id/,
    "src/app/api/competitions/[id]/session/route.ts": /CompetitionMember\.findUnique|competitionId_userId/,
    "src/app/api/competitions/[id]/bracket/submit/route.ts": /CompetitionMember\.findFirst|competitionId_userId|member/,
    "src/app/api/entitlements/prime/route.ts": /getCurrentUser/,
  };
  for (const [path, re] of Object.entries(owned)) {
    const src = read(path);
    assert.match(src, re, `${path} must keep its ownership / membership check`);
  }
});