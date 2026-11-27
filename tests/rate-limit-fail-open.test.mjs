// Guard: the edge rate limiter must FAIL OPEN. A Redis/Upstash outage or a bad
// token took the ENTIRE site 503 once; the limiter is protection, not a
// dependency. This test fails if a 503-on-outage path is ever reintroduced.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const ROOT = new URL("../", import.meta.url).pathname;
const MW = readFileSync(`${ROOT}src/middleware.ts`, "utf8");

test("the rate limiter fails open — no 503-on-Redis-outage path remains", () => {
  assert.doesNotMatch(MW, /Rate limiting unavailable/, "no 503 when Redis is unreachable");
  assert.doesNotMatch(MW, /Rate limiting is not configured/, "no 503 when the limiter is unconfigured");
  assert.match(MW, /fail open|FAIL OPEN|fail-open|Redis unreachable/, "the outage path is documented as fail-open");
  // The happy path still falls through to the session response (allow).
  assert.match(MW, /return sessionResponse;/, "an unblocked request is allowed through");
});

test("the limiter still enforces a live over-limit (429)", () => {
  assert.match(MW, /ip-limit:/, "the per-IP window key is intact");
  assert.match(MW, /count > 100/, "the over-limit threshold stays");
  assert.match(MW, /status: 429/, "a live over-limit still returns 429");
});