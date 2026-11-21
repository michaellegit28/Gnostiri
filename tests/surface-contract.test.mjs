// Surface contract tests for the app-shell routes (orchestrator assignment,
// 2026-11-17 00:20): /league /library /notifications /profile /settings /offline.
//
// Source-level assertions (no DB, no browser — the qa-tools.test.mjs pattern):
//   - each page file exists and renders (is referenced by the nav model or the
//     shell, so it is not an orphaned route)
//   - server-component pages carry NO event handlers (an onClick there is the
//     "Event handlers cannot be passed to Client Component props" RSC-digest
//     crash that shipped once on /university/[course])
//   - client-component pages never import the Prisma client (AGENTS.md rule 4)
//   - every one of these surfaces is in the smoke catalogue, so a live deploy
//     proves it renders without an RSC digest / soft-404 (AGENTS.md rule 5)

import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const ROOT = new URL("../", import.meta.url).pathname;
const read = (p) => readFileSync(`${ROOT}${p}`, "utf8");
const has = (p) => existsSync(`${ROOT}${p}`);

const SMOKE = read("tools/smoke.mjs");
const NAV = has("src/components/chrome/nav-model.ts") ? read("src/components/chrome/nav-model.ts") : "";

// route path -> page file
const SURFACES = {
  "/league": "src/app/league/page.tsx",
  "/library": "src/app/library/page.tsx",
  "/notifications": "src/app/notifications/page.tsx",
  "/profile": "src/app/profile/page.tsx",
  "/settings": "src/app/settings/page.tsx",
  "/offline": "src/app/offline/page.tsx",
};

// Surfaces that must appear in the nav model (reachable from the shell).
// /notifications is reached via the bell (NotificationBell), /offline is the
// service-worker fallback — neither is a nav item, so they are exempt here.
const NAV_REQUIRED = ["/league", "/library", "/profile", "/settings"];

for (const [route, file] of Object.entries(SURFACES)) {
  test(`surface ${route}: page exists`, () => {
    assert.ok(has(file), `${file} must exist for ${route}`);
  });

  test(`surface ${route}: smoke catalogue covers it (live render is proven)`, () => {
    assert.ok(
      SMOKE.includes(`path: "${route}"`),
      `tools/smoke.mjs must probe ${route} so a deploy proves it renders (no RSC digest)`,
    );
  });

  test(`surface ${route}: server/client split is correct (rule 4)`, () => {
    const src = read(file);
    const isClient = /^["']use client["']/m.test(src);
    if (isClient) {
      // A client page must never pull the DB client into the browser bundle.
      assert.doesNotMatch(src, /@\/lib\/db|@prisma\/client/, `${route} is a client page — it must not import prisma`);
    } else {
      // A server page must not carry event handlers (RSC digest crash).
      assert.doesNotMatch(src, /\sonClick=|\sonChange=|\sonSubmit=/, `${route} is a server page — no event handlers allowed`);
    }
  });
}

for (const route of NAV_REQUIRED) {
  test(`nav model links ${route} (reachable from the shell, not orphaned)`, () => {
    assert.ok(NAV.includes(`"${route}"`), `nav-model.ts must link ${route}`);
  });
}

test("/notifications is reachable via the notification bell (not a nav item, by design)", () => {
  const bell = has("src/components/notifications/NotificationBell.tsx")
    ? read("src/components/notifications/NotificationBell.tsx")
    : "";
  assert.match(bell, /\/notifications/, "the bell links to /notifications");
});

test("/offline is the service-worker fallback (registered in the SW, not a nav item)", () => {
  const sw = has("public/sw.js") ? read("public/sw.js") : "";
  assert.match(sw, /\/offline/, "the service worker must cache/serve the /offline fallback");
});