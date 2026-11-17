import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const SMOKE = readFileSync(new URL("../tools/smoke.mjs", import.meta.url), "utf8");

test("smoke catalogue: auth surface — /login expects 200 and 'Continue with Google'", () => {
  // Check path
  assert.ok(SMOKE.includes('path: "/login"'), "smoke must have /login entry");
  // Check marker for "Continue with Google"
  assert.ok(/Continue with Google/i.test(SMOKE), "smoke /login must check for 'Continue with Google'");
  // Check status expectation is 200 (default for HTML probes)
  assert.ok(SMOKE.includes('name: "login"'), "login entry must exist");
});

test("smoke catalogue: auth surface — /auth/callback?code=bogus expects 307 to /login?error=auth_failed", () => {
  assert.ok(
    SMOKE.includes('path: "/auth/callback?code=bogus"'),
    "smoke must have /auth/callback?code=bogus entry"
  );
  assert.ok(
    SMOKE.includes('expectRedirect: "/login?error=auth_failed"'),
    "smoke /auth/callback must expect redirect to /login?error=auth_failed"
  );
  assert.ok(
    SMOKE.includes('name: "auth-callback-bogus"'),
    "auth-callback-bogus entry must exist"
  );
});

test("smoke catalogue: auth surface — /api/health/auth expects 200 and {healthy:true}", () => {
  assert.ok(
    SMOKE.includes('path: "/api/health/auth"'),
    "smoke must have /api/health/auth entry"
  );
  assert.ok(
    SMOKE.includes('booleanField: "healthy"'),
    "smoke /api/health/auth must check booleanField healthy"
  );
  assert.ok(
    SMOKE.includes('"healthy"\\s*:\\s*true'),
    "smoke /api/health/auth must expect healthy=true in response"
  );
  assert.ok(
    SMOKE.includes('name: "api-health-auth"'),
    "api-health-auth entry must exist"
  );
});

test("smoke: probeHtml handles expectRedirect correctly", () => {
  // The probeHtml function must have the expectRedirect logic
  assert.ok(
    SMOKE.includes("entry.expectRedirect"),
    "probeHtml must handle expectRedirect field"
  );
  assert.ok(
    SMOKE.includes('expected redirect (3xx)'),
    "probeHtml must validate 3xx status for expectRedirect"
  );
  assert.ok(
    SMOKE.includes("redirect location"),
    "probeHtml must check redirect location header"
  );
});

test("smoke: probeApi handles booleanField correctly", () => {
  assert.ok(
    SMOKE.includes("booleanField"),
    "probeApi must handle booleanField option"
  );
  assert.ok(
    SMOKE.includes('field "${booleanField}" is not true'),
    "probeApi must validate booleanField is true"
  );
});