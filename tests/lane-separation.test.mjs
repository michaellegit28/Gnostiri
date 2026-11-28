// Contract tests for strict lane separation (owner directive).
//
// A High School session must never see University content or features and
// vice versa. Discovery (plus account utilities and the shared community
// surfaces) are the ONLY things that cross lanes — everything else is
// lane-scoped, in the nav AND in the payloads that ship to each lane.

import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";

const ROOT = new URL("..", import.meta.url).pathname;
const q = (p) => readFileSync(ROOT + p, "utf8");

const NAV = "src/components/chrome/nav-model.ts";

/**
 * The sanctioned shared list (owner: "nothing should be shared"). Only three
 * kinds of destination may cross lanes, and each must be here:
 *  1. the two self-filtering entry points (/, /study),
 *  2. Discovery — the ONE shared study surface (extras trails carry no lane
 *     tag yet; owner-approved earlier),
 *  3. account utilities — one account, one feed (notifications, Prime,
 *     profile, settings).
 * Everything else (tutor, study plan, progress, compete, certificates,
 * library) is per-lane.
 */
const SHARED_OK = new Set([
  "/", // Home — self-filtering entry point (renders the session lane's panel)
  "/study", // the hub — self-filtering entry point
  "/discovery", // the ONE shared study surface (extras trails, no lane tag yet)
  "/notifications", // account utility (one account, one feed)
  "/pricing", // account utility
  "/profile", // account utility
  "/settings", // account utility
]);

function rawNavItems() {
  return q(NAV)
    .split("\n")
    .filter((line) => line.includes("href:") && line.includes("audience:"))
    .map((line) => ({
      href: line.match(/href: "([^"]+)"/)[1],
      audience: line.match(/audience: "([^"]+)"/)[1],
    }));
}

/** First-declared audience per destination (bottom tabs may repeat a nav entry). */
function navItems() {
  const seen = new Map();
  for (const item of rawNavItems()) if (!seen.has(item.href)) seen.set(item.href, item.audience);
  return [...seen].map(([href, audience]) => ({ href, audience }));
}

test("every nav destination declares its lane, and the shared list is exactly the sanctioned one", () => {
  const items = navItems();
  assert.ok(items.length >= 20, "the nav model is the single source of nav items");
  for (const { href, audience } of items) {
    assert.ok(["highschool", "university", "shared"].includes(audience), `${href} declares a valid audience`);
    if (audience === "shared") {
      assert.ok(SHARED_OK.has(href), `${href} crosses lanes — add it to the sanctioned shared list deliberately`);
    }
  }
});

test("no lane route is shared — the lanes never cross-link in the nav", () => {
  for (const { href, audience } of navItems()) {
    if (href === "/highschool" || href.startsWith("/highschool/") || href === "/cbt") {
      assert.equal(audience, "highschool", `${href} is a High School surface`);
    }
    if (href === "/university" || href.startsWith("/university/") || href === "/desk") {
      assert.equal(audience, "university", `${href} is a University surface`);
    }
  }
});

test("Discovery is the ONLY shared study surface; everything else is per-lane", () => {
  const sharedStudy = navItems().filter(({ audience }) => audience === "shared");
  assert.deepEqual(
    sharedStudy.map((i) => i.href).sort(),
    ["/", "/discovery", "/notifications", "/pricing", "/profile", "/settings", "/study"],
    "only Discovery crosses lanes among study surfaces — the rest are entry points or account utilities",
  );
  // Per-lane surfaces appear once per lane (zone + bottom tab), never shared.
  for (const href of ["/tutor", "/battle-plan", "/progress", "/league", "/library"]) {
    const audiences = rawNavItems().filter((i) => i.href === href).map((i) => i.audience);
    assert.ok(!audiences.includes("shared"), `${href} is never a shared entry`);
    assert.ok(audiences.includes("highschool") && audiences.includes("university"), `${href} carries an entry for each lane`);
  }
  // Course certificates are a University surface only.
  const certAudiences = [...new Set(rawNavItems().filter((i) => i.href === "/certificates").map((i) => i.audience))];
  assert.deepEqual(certAudiences, ["university"], "certificates belong to University only");
});

test("the progress week strip never ships the High School plan to a University session", () => {
  const src = q("src/components/progress/WeekTimeline.tsx");
  assert.match(src, /if \(!isHighSchool\) return;/, "a University session never fetches the HS battle plan");
  assert.match(src, /domain: LearningDomain/, "the timeline takes the active lane");
  assert.match(src, /University revision follows your courses/, "and gets an honest University pointer instead");
  assert.match(q("src/app/progress/page.tsx"), /<WeekTimeline domain=\{domain\} \/>/, "Progress passes the resolved lane");
});

test("the battle plan API is High School only (University revision is the SM-2 schedule)", () => {
  const api = q("src/app/api/battle-plan/route.ts");
  assert.match(api, /const SUPPORTED_EXAMS = \["jamb"\]/, "only the High School exam is planned");
  assert.match(api, /domain: "highschool"/, "and the plan rows are High School rows");
});

test("the tutor API is domain-scoped, so shared URL never means shared content", () => {
  const api = q("src/app/api/tutor/route.ts");
  assert.match(api, /searchParams\.get\("domain"\)/, "the tutor resolves a lane from the request");
  assert.match(api, /Domain not found/, "and refuses a request without one");
});

test("the study hub only ships the active lane's cards (no leak-in-the-payload)", () => {
  const page = q("src/app/study/page.tsx");
  assert.match(page, /isVisibleForAudience\(card\.audience, domain\)/, "the hub payload is lane-scoped server-side");
  assert.match(page, /domain === "university"/, "and the lane branch picks the right surface set");
});

test("the practice hub pre-scopes its payload server-side too (no client-only strip)", () => {
  const page = q("src/app/practice/page.tsx");
  assert.match(page, /export const dynamic = "force-dynamic"/, "the lane must resolve per-request");
  assert.match(page, /getCurrentUser\(\)/, "signed-in lanes come from the profile");
  assert.match(page, /PRACTICE_CARDS\.filter\(\(card\) => isVisibleForAudience\(card\.audience, domain\)\)/, "the other lane's cards never ship");
});

/**
 * The owner directive: the ONLY places that switch the learning lane are the
 * menu and Settings. Scan every source file for callers of setLearningDomain
 * and assert the set is exactly those two — a third switch anywhere in the
 * app fails this suite.
 */
function sourceFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const path = `${dir}/${entry}`;
    if (statSync(path).isDirectory()) out.push(...sourceFiles(path));
    else if (/\.(ts|tsx)$/.test(entry)) out.push(path);
  }
  return out;
}

test("lane switches exist ONLY in the menu and Settings", () => {
  const callers = sourceFiles("src")
    .filter((file) => /setLearningDomain\(/.test(readFileSync(file, "utf8")))
    .map((file) => file.replace(/^src\//, ""));
  assert.deepEqual(
    callers.sort(),
    [
      "components/chrome/LaneDropdown.tsx", // the menu (canonical)
      "components/settings/LearningDomainControls.tsx", // Settings (canonical)
    ],
    "no other surface may switch the learning lane",
  );
});