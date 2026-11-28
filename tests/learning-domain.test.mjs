// Learning-lane separation contracts.
//
// Owner directive: a university session must not see High School content or
// features, a High School session must not see University, and Discovery is
// the only shared study surface. These are source-level contracts because the
// failure mode is a nav list or study card quietly leaking the other lane.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const ROOT = new URL("../", import.meta.url).pathname;
const read = (p) => readFileSync(`${ROOT}${p}`, "utf8");

const NAV = read("src/components/chrome/nav-model.ts");
const SHELL = read("src/components/chrome/AppShell.tsx");
const STUDY_PAGE = read("src/app/study/page.tsx");
const STUDY_GRID = read("src/components/study/StudyGrid.tsx");
const PRACTICE_PAGE = read("src/app/practice/page.tsx");
const PRACTICE_GRID = read("src/components/practice/PracticeGrid.tsx");
const SETTINGS = read("src/app/settings/page.tsx");
const DOMAIN = read("src/context/DomainContext.tsx");
const API = read("src/app/api/learning-domain/route.ts");

test("nav items declare which lane may see them", () => {
  // The lane nav goes straight to the lane's doors (GSE, textbook study, courses),
  // so there is no standalone /highschool or /university hub entry any more.
  for (const href of ["/highschool/exams", "/highschool/study", "/cbt"]) {
    assert.match(NAV, new RegExp(`href: "${href}"[\\s\\S]{0,80}?audience: "highschool"`), `${href} belongs to High School`);
  }
  for (const href of ["/university", "/university/revision"]) {
    assert.match(NAV, new RegExp(`href: "${href}"[\\s\\S]{0,80}?audience: "university"`), `${href} belongs to University`);
  }
  assert.match(NAV, /href: "\/discovery"[\s\S]{0,80}?audience: "shared"/, "discovery is the one shared study surface");
  assert.match(NAV, /href: "\/tutor"[\s\S]{0,80}?audience: "highschool"/, "the AI tutor has a High School entry");
  assert.match(NAV, /href: "\/tutor"[\s\S]{0,80}?audience: "university"/, "and a University entry");
  // Battle Plan is one route with one entry per lane; the lane comes from the session.
  assert.match(NAV, /href: "\/battle-plan"[\s\S]{0,80}?audience: "highschool"/, "the study plan has a High School entry");
  assert.match(NAV, /href: "\/battle-plan"[\s\S]{0,80}?audience: "university"/, "and a University entry");
  assert.match(NAV, /href: "\/study"[\s\S]{0,80}?audience: "shared"/, "the study hub is shared (it filters itself)");
  // The /desk PDF workspace is a University-only feature (owner directive), never High School.
  assert.match(NAV, /href: "\/desk"[\s\S]{0,80}?audience: "university"/, "PDF Desk belongs to University");
});

test("the shell renders a lane-filtered navigation, not the mixed global list", () => {
  assert.match(SHELL, /navZonesForDomain\(activeDomain\)/);
  assert.match(SHELL, /bottomTabsForDomain\(activeDomain\)/);
  // The mixed NAV_ZONES list must not be rendered anywhere in the shell.
  assert.doesNotMatch(SHELL, /\{NAV_ZONES\.map\(/);
  assert.doesNotMatch(SHELL, /\{BOTTOM_TABS\.map\(/);
});

test("the study hub only serves the lane card, and always serves shared surfaces", () => {
  assert.match(STUDY_GRID, /isVisibleForAudience\(card\.audience, domain\)/);
  assert.match(STUDY_GRID, /"use client"/);
  for (const card of ["/highschool", "/university", "/discovery", "/desk"]) {
    assert.match(STUDY_PAGE, new RegExp(`href:\\s*"${card}"`), `the study page carries the ${card} spec in the source`);
  }
  assert.match(STUDY_PAGE, /audience: "highschool"/);
  assert.match(STUDY_PAGE, /audience: "university"/);
  assert.match(STUDY_PAGE, /audience: "shared"/);
});

test("practice is lane-filtered and its CTA follows the lane", () => {
  // The payload is pre-scoped server-side (like /study) and the grid re-applies
  // the audience filter client-side after a lane switch.
  assert.match(PRACTICE_PAGE, /PRACTICE_CARDS\.filter\(\(card\) => isVisibleForAudience\(card\.audience, domain\)\)/, "the practice payload is lane-scoped server-side");
  assert.match(PRACTICE_GRID, /cards\.filter\(\(card\) => isVisibleForAudience\(card\.audience, domain\)\)/);
  assert.match(PRACTICE_GRID, /Open a course exam hall/);
  assert.match(PRACTICE_GRID, /\$\{GSE\}/, "the HS practice CTA uses the GSE exam name");
  assert.match(PRACTICE_PAGE, /<PracticeGrid cards=/, "the page hands the grid the pre-scoped cards");
});

test("the lane choice is explicit, visible and persisted for signed-in users", () => {
  assert.match(SETTINGS, /<LearningDomainControls \/>/);
  assert.match(read("src/components/settings/LearningDomainControls.tsx"), /setLearningDomain/);
  assert.match(DOMAIN, /\/api\/learning-domain/);
  assert.match(DOMAIN, /localStorage/);
  assert.match(DOMAIN, /learningDomain: learningDomain \?\? DEFAULT_LEARNING_DOMAIN/);
  assert.match(API, /prisma\.profile\.upsert/);
  assert.match(API, /z\.enum\(\["highschool", "university"\]\)/);
});

test("discovery + notifications are the only cross-lane surfaces; the lane routes are not shared", () => {
  // The "Your lane" zone carries each lane's own content; cross-lane items live in
  // their own zone. No destination inside the lane zone may be tagged shared,
  // and GSE must be tagged High School (not shared) in its own entry.
  const laneZone = NAV.slice(NAV.indexOf('id: "lane"'), NAV.indexOf('id: "shared"'));
  assert.doesNotMatch(laneZone, /audience: "shared"/, "the lane zone holds no shared destinations");
  assert.match(NAV, /href: "\/highschool\/exams",[\s\S]{0,80}?audience: "highschool"/, "GSE belongs to High School, not shared");
  assert.doesNotMatch(NAV, /href: "\/highschool\/exams",[\s\S]{0,80}?audience: "shared"/, "GSE is never tagged shared");
  // Discovery (extras trails, no lane tag yet) + notifications (one account,
  // one feed) are the ONLY shared destinations — everything else is per lane.
  assert.match(NAV, /href: "\/discovery"[\s\S]{0,80}?audience: "shared"/, "discovery is shared");
  assert.match(NAV, /href: "\/notifications"[\s\S]{0,80}?audience: "shared"/, "notifications are account-level");
  assert.doesNotMatch(NAV, /href: "\/library"[\s\S]{0,80}?audience: "shared"/, "library is per-lane now");
  assert.doesNotMatch(NAV, /href: "\/league"[\s\S]{0,80}?audience: "shared"/, "compete is per-lane now");
  assert.doesNotMatch(NAV, /href: "\/progress"[\s\S]{0,80}?audience: "shared"/, "progress is per-lane now");
  assert.doesNotMatch(NAV, /href: "\/battle-plan"[\s\S]{0,80}?audience: "shared"/, "the study plan is per-lane now");
});