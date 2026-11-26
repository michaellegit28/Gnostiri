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
  for (const href of ["/highschool", "/highschool/exams", "/cbt"]) {
    assert.match(NAV, new RegExp(`href: "${href}"[\\s\\S]*?audience: "highschool"`), `${href} belongs to High School`);
  }
  for (const href of ["/university", "/university/revision"]) {
    assert.match(NAV, new RegExp(`href: "${href}"[\\s\\S]*?audience: "university"`), `${href} belongs to University`);
  }
  assert.match(NAV, /href: "\/discovery"[\s\S]*?audience: "shared"/, "discovery is shared");
  assert.match(NAV, /href: "\/study"[\s\S]*?audience: "shared"/, "the study hub is shared (it filters itself)");
  // Battle Plan lives at a shared URL but is the High School plan surface.
  assert.match(NAV, /href: "\/battle-plan"[\s\S]*?audience: "highschool"/);
});

test("the shell renders a lane-filtered navigation, not the mixed global list", () => {
  assert.match(SHELL, /navZonesForDomain\(activeDomain\)/);
  assert.match(SHELL, /bottomTabsForDomain\(activeDomain\)/);
  // The mixed NAV_ZONES list must not be rendered anywhere in the shell.
  assert.doesNotMatch(SHELL, /\{NAV_ZONES\.map\(/);
  assert.doesNotMatch(SHELL, /\{BOTTOM_TABS\.map\(/);
});

test("the study hub only serves the lane card, and always serves shared surfaces", () => {
  assert.match(STUDY_GRID, /isVisibleForLearningDomain\(card\.href, domain\)/);
  assert.match(STUDY_GRID, /"use client"/);
  for (const card of ["/highschool", "/university", "/discovery", "/desk"]) {
    assert.match(STUDY_PAGE, new RegExp(`href:\\s*"${card}"`), `the study page carries the ${card} spec in the source`);
  }
  assert.match(STUDY_PAGE, /audience: "highschool"/);
  assert.match(STUDY_PAGE, /audience: "university"/);
  assert.match(STUDY_PAGE, /audience: "shared"/);
});

test("practice is lane-filtered and its CTA follows the lane", () => {
  assert.match(PRACTICE_GRID, /CARDS\.filter\(\(card\) => isVisibleForLearningDomain\(card\.href, domain\)\)/);
  assert.match(PRACTICE_GRID, /Open a course exam hall/);
  assert.match(PRACTICE_GRID, /Browse exam boards/);
  assert.match(PRACTICE_PAGE, /<PracticeGrid \/>/);
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

test("discovery is the only shared study surface", () => {
  const studyZone = NAV.slice(NAV.indexOf('id: "study"'), NAV.indexOf('id: "compete"'));
  const shared = [...studyZone.matchAll(/audience: "shared"/g)].length;
  assert.ok(shared >= 2, "study + discovery + desk are shared; the lane routes are not");
  assert.doesNotMatch(studyZone, /href: "\/highschool\/exams"[\s\S]*?audience: "shared"/);
  assert.match(studyZone, /href: "\/discovery"[\s\S]*?audience: "shared"/);
});