// Contract tests for strict lane separation (owner directive).
//
// A High School session must never see University content or features and
// vice versa. Discovery (plus account utilities and the shared community
// surfaces) are the ONLY things that cross lanes — everything else is
// lane-scoped, in the nav AND in the payloads that ship to each lane.

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const ROOT = new URL("..", import.meta.url).pathname;
const q = (p) => readFileSync(ROOT + p, "utf8");

const NAV = "src/components/chrome/nav-model.ts";

/**
 * The sanctioned shared list. Anything that crosses lanes must be here and
 * ONLY here: account utilities (one account, both lanes), the two lanes'
 * shared entry points (/, /study), the shared study surfaces the owner
 * approved (Discovery, Tutor, Library, Compete) and the shared plan/analytics
 * shells that toggle their own lane internally.
 */
const SHARED_OK = new Set([
  "/", // Home — action-only, account-scoped
  "/study", // the hub (filters itself by lane)
  "/tutor", // AI tutor (domain-scoped in content)
  "/discovery", // the ONLY shared study content surface
  "/notifications", // account utility
  "/battle-plan", // plan shell (toggles HS/University internally)
  "/progress", // analytics (split by lane tabs)
  "/league", // community surface (flagged to owner, default shared)
  "/certificates", // earned records
  "/library", // community surface (flagged to owner, default shared)
  "/pricing", // account utility
  "/profile", // account utility
  "/settings", // account utility
]);

function navItems() {
  return q(NAV)
    .split("\n")
    .filter((line) => line.includes("href:") && line.includes("audience:"))
    .map((line) => ({
      href: line.match(/href: "([^"]+)"/)[1],
      audience: line.match(/audience: "([^"]+)"/)[1],
    }));
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

test("the shared study surface is discovery; the shared study tools are the approved few", () => {
  const sharedStudy = navItems().filter(({ href, audience }) => audience === "shared" && ["/tutor", "/discovery", "/battle-plan"].includes(href));
  assert.deepEqual(
    sharedStudy.map((i) => i.href).sort(),
    ["/battle-plan", "/discovery", "/tutor"],
    "only discovery, the tutor and the lane-aware plan shell cross lanes among study surfaces",
  );
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