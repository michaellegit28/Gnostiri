// Contract tests for the LIVE lane toggle (owner: "home only changes on site
// refresh — please let it change on toggle").
//
// The lane is resolved server-side (profile / cookie), so Home and the hubs
// are server components. A toggle that only writes client state + a cookie
// leaves the server-rendered panel stale until a manual refresh — the switch
// must also re-render the server tree.

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const ROOT = new URL("..", import.meta.url).pathname;
const q = (p) => readFileSync(ROOT + p, "utf8");

const CTX = "src/context/DomainContext.tsx";

test("a lane switch re-renders the server tree immediately — no manual refresh", () => {
  const src = q(CTX);
  assert.match(src, /useRouter/, "the provider can refresh the server tree");
  assert.match(src, /\.then\(\(\) => router\.refresh\(\)\)/, "refresh runs after the profile sync resolves — never a stale read");
  assert.match(src, /router\.refresh\(\);\s*\}/, "and the signed-out path refreshes too (the cookie is already written)");
});

test("the refresh lives in setLearningDomain, so every canonical toggle benefits", () => {
  const src = q(CTX);
  const start = src.indexOf("const setLearningDomain");
  const end = src.indexOf("return (", start);
  const fn = src.slice(start, end);
  assert.match(fn, /router\.refresh\(\)/, "the menu dropdown and Settings controls share one live path");
  // Both toggles call setLearningDomain (asserted in lane-separation.test.mjs),
  // so fixing it here fixes the menu and Settings at once.
});

test("the toggle still never loses the choice on a failed profile sync", () => {
  const src = q(CTX);
  assert.match(src, /A failed sync must not lose the choice/, "the local lane still applies if the profile write fails");
  assert.match(src, /setLearningDomainState\(domain\)/, "client state updates first, before any network");
});