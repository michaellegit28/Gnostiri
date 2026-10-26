// Structural validation for the university surface.
//
// What is asserted (all static — no database, no network):
//
//   1. review scaffolding never reaches a student: no student-facing
//      university surface renders needsCheck / placeholder language, and the
//      lesson page mounts the content report affordance instead
//   2. the lesson page walks the module spine (prev/next within a module, the
//      destination named across a boundary) rather than course-wide order
//   3. the course page marks the next uncompleted lesson and links every
//      assessment route (no orphaned exam hall)
//   4. no dead ends: every university shell offers a way back and a next step
//   5. the RSC rule that crashed this page before: no onClick is passed to a
//      Link in a server component
//   6. content governance: no seed row anywhere under prisma/seed-courses is
//      ever written "verified" or "draft" — governance is needs-human-review
//
// The same convention as tests/mbbs-spine.test.mjs: machines check structure,
// humans review content.

import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("../", import.meta.url).pathname;
const Q = (p) => `${ROOT}${p}`;
const read = (p) => readFileSync(p, "utf8");

const COMPLETE_ROUTE = "src/app/api/courses/[courseId]/complete/route.ts";
const LESSON_PAGE = "src/app/university/[course]/lessons/[lesson]/page.tsx";
const COURSE_PAGE = "src/app/university/[course]/page.tsx";
const INDEX_PAGE = "src/app/university/page.tsx";
const NAV = "src/components/university/ModuleLessonNav.tsx";
const TRANSCRIPT = "src/app/university/transcript/page.tsx";
const REVISION = "src/app/university/revision/page.tsx";
const EXAMS = "src/app/university/[course]/exams/page.tsx";

for (const f of [COMPLETE_ROUTE, LESSON_PAGE, COURSE_PAGE, INDEX_PAGE, NAV, TRANSCRIPT, REVISION, EXAMS]) {
  test(`${f} exists`, () => assert.ok(existsSync(f), `${f} missing`));
}

// ---------------------------------------------------------------------------
// 1. Review scaffolding never reaches a student.
// ---------------------------------------------------------------------------
test("no student-facing university surface renders review scaffolding", () => {
  for (const f of [COMPLETE_ROUTE, LESSON_PAGE, COURSE_PAGE, INDEX_PAGE, NAV]) {
    const src = readFileSync(Q(f), "utf8");
    assert.doesNotMatch(src, /needsCheck|In preparation|awaiting human review|being written/);
  }
});

test("the university lesson page mounts the content report affordance", () => {
  assert.match(readFileSync(Q(LESSON_PAGE), "utf8"), /ContentReportTab/);
});

// ---------------------------------------------------------------------------
// 2. Prev / next walk the module spine.
// ---------------------------------------------------------------------------
test("lesson navigation is module-scoped with named boundaries", () => {
  const src = read(LESSON_PAGE);
  assert.match(src, /moduleGroups/, "lessons must be grouped by their module");
  assert.match(src, /nextInModule/, "next must first look inside the module");
  assert.match(src, /nextModuleGroup/, "crossing a module boundary must resolve the next module");
  assert.match(src, /Next module/, "a boundary crossing must announce the destination");
  assert.match(src, /Previous module/, "a boundary crossing backwards must announce the destination");
  // The old course-wide jump by orderIndex must be gone.
  assert.doesNotMatch(src, /orderIndex === \(lesson\.orderIndex \?\? 0\) \+ 1/, "course-wide orderIndex jumps must not remain");
});

// ---------------------------------------------------------------------------
// 3. Course page: obvious next action, no orphaned routes.
// ---------------------------------------------------------------------------
test("course page marks the next uncompleted lesson", () => {
  const src = read(COURSE_PAGE);
  assert.match(src, /nextLessonId=\{nextLesson\?\.id \?\? null\}/, "the next lesson id reaches the nav");
  const nav = read(NAV);
  assert.match(nav, /nextLessonId\?: string \| null/, "the nav accepts the next lesson id");
  assert.match(nav, /Next up/, "the first uncompleted lesson is labelled Next up");
});

// ---------------------------------------------------------------------------
// 4. No dead ends: every university shell offers a way back and a next step.
// ---------------------------------------------------------------------------
test("no university route is orphaned", () => {
  const src = read(COURSE_PAGE);
  assert.match(src, /href=\{`\/university\/\$\{course\.slug\}\/exams`\}/, "the exam hall must be linked from the course page");
  assert.match(read(EXAMS), /href=\{`\/university\/\$\{slug}`\}/, "the exam hall has a way back to the course");
  assert.match(read(EXAMS), /University[\s\S]*?\{course\.title\}/, "the exam hall breadcrumb names the path");
  assert.match(read(TRANSCRIPT), /href="\/login"/, "the transcript sign-in dead end links out");
  assert.match(read(REVISION), /href="\/university"/, "the revision queue links back to university");
  assert.match(read(REVISION), /Browse the courses/, "the revision empty state offers a next step");
});

// ---------------------------------------------------------------------------
// 5. The RSC rule: never pass onClick to Link in a server component.
// ---------------------------------------------------------------------------
test("no onClick is passed to a Link in university server components", () => {
  const files = [
    "src/app/university/page.tsx",
    "src/app/university/transcript/page.tsx",
    "src/app/university/revision/page.tsx",
    "src/app/university/[course]/page.tsx",
    "src/app/university/[course]/lessons/[lesson]/page.tsx",
    "src/app/university/[course]/quiz/page.tsx",
    "src/app/university/[course]/concepts/page.tsx",
    "src/app/university/[course]/exams/page.tsx",
  ];
  for (const file of files) {
    if (!existsSync(file)) continue;
    const src = read(file);
    assert.doesNotMatch(src, /<Link[\s\S]{0,400}?onClick=/, `${file}: an onClick reaches a Link in a server component — RSC digest error`);
  }
});

// ---------------------------------------------------------------------------
// 6. Governance: nothing is ever pre-verified or left as draft, anywhere in
//    the university seeds.
// ---------------------------------------------------------------------------
function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (entry.endsWith(".ts")) out.push(p);
  }
  return out;
}

test("no university seed row is pre-verified or left as draft", () => {
  if (!existsSync("prisma/seed-courses")) return;
  for (const file of walk("prisma/seed-courses")) {
    const src = read(file);
    assert.doesNotMatch(src, /reviewStatus:\s*"verified"/, `${file} writes a verified row`);
    assert.doesNotMatch(src, /reviewStatus:\s*"draft"/, `${file} writes a draft row`);
  }
});

test("placeholder lessons are never written to the student database", () => {
  // Owner directive 2026-10-24 ("show what's real"): the authoring queue lives
  // in the seed source, never in student-facing rows. The engine writes
  // authored lessons only and deletes placeholder rows left by earlier seeds.
  const spine = read("prisma/seed-courses/mbbs/spine.ts");
  assert.match(spine, /subject\.lessons\[i\]\.authored/, "only authored lessons are written");
  assert.match(spine, /notIn: Array\.from\(authoredIds\)/, "leftover placeholder rows are deleted on re-seed");
  assert.doesNotMatch(spine, /needsCheck:\s*!l\.authored/, "needsCheck is not derived from authorship any more");
  // And the shipped UI must not render review scaffolding either.
  const lessonPage = read("src/app/university/[course]/lessons/[lesson]/page.tsx");
  assert.doesNotMatch(lessonPage, /needsCheck|In preparation|awaiting human review|being written/);
});
