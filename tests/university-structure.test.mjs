// Structural validation for the round-3 university "never lost" pass.
//
// What is asserted (all static — no database, no network):
//
//   1. placeholder lessons cannot be completed: the API route rejects a
//      needsCheck lesson, and the lesson page locks the completion action on
//      placeholders with an honest explanation instead
//   2. the lesson page walks the module spine (prev/next within a module, the
//      destination named across a boundary) rather than course-wide order
//   3. the course page shows per-module authored progress, marks the next
//      uncompleted lesson, offers a plain being-written state when nothing is
//      published, and links every assessment route (no orphaned exam hall)
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
// 1. A placeholder is never completable.
// ---------------------------------------------------------------------------
test("completion API refuses placeholder lessons", () => {
  const src = read(COMPLETE_ROUTE);
  assert.match(src, /target\.needsCheck/, "the route must look at the lesson's needsCheck flag");
  assert.match(src, /status:\s*409/, "the refusal must be an honest 409, not a silent success");
  assert.match(src, /still being written/, "the refusal message must say the lesson is unwritten");
  // The guard must sit before the progress upsert — nothing is written first.
  const guardAt = src.indexOf("target.needsCheck");
  const writeAt = src.indexOf("prisma.progress.upsert");
  assert.ok(guardAt !== -1 && writeAt !== -1 && guardAt < writeAt, "the guard must run before any progress write");
});

test("lesson page locks completion on placeholders and explains why", () => {
  const src = read(LESSON_PAGE);
  assert.match(src, /lesson\.needsCheck \?/, "the completion action must branch on needsCheck");
  // The placeholder branch must explain when completion opens and must not
  // render the completion button at all.
  const start = src.indexOf("lesson.needsCheck ?");
  const branchEnd = src.indexOf(") : user ?", start);
  assert.ok(start !== -1 && branchEnd !== -1, "the placeholder branch must be a distinct render branch");
  const branch = src.slice(start, branchEnd);
  assert.match(branch, /Marking a lesson complete opens once its teaching\s*\n?\s*content is published/, "the locked state must explain when completion opens");
  assert.doesNotMatch(branch, /CourseCompletionButton/, "a placeholder must never render the completion button");
  // Anonymous visitors are sent to sign in, not into a 401.
  assert.match(src, /Sign in/, "anonymous visitors get a sign-in CTA");
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
// 3. Course page: honest progress, obvious next action, no orphaned routes.
// ---------------------------------------------------------------------------
test("course page reports per-module authored progress", () => {
  const src = read(COURSE_PAGE);
  assert.match(src, /authoredCount: lessons\.filter\(\(l\) => !l\.needsCheck\)\.length/, "each module carries its authored count");
  const nav = read(NAV);
  assert.match(nav, /authoredCount\?: number/, "the nav type carries the count");
  assert.match(nav, /of \$\{group\.lessons\.length\} authored/, "the module header prints X of Y authored");
});

test("course page marks the next uncompleted lesson", () => {
  const src = read(COURSE_PAGE);
  assert.match(src, /nextLessonId=\{nextLesson\?\.id \?\? null\}/, "the next lesson id reaches the nav");
  const nav = read(NAV);
  assert.match(nav, /nextLessonId\?: string \| null/, "the nav accepts the next lesson id");
  assert.match(nav, /Next up/, "the first uncompleted lesson is labelled Next up");
});

test("course page states plainly when nothing is published", () => {
  const src = read(COURSE_PAGE);
  assert.match(src, /authoredCount === 0/, "a course with no published content must be detected");
  assert.match(src, /This course is being written/, "it must say so in plain words");
  assert.match(src, /Get notified when lessons open/, "and offer the notify action, not a broken spine");
  // The start action must not dangle into an unwritten course.
  assert.match(src, /nextLesson && authoredCount > 0/, "the start CTA is gated on published content");
});

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
// 4. The index keeps the notify anchor reachable while lessons are pending.
// ---------------------------------------------------------------------------
test("index keeps the waitlist anchor while lessons are in preparation", () => {
  const src = read(INDEX_PAGE);
  assert.match(src, /inPreparation = totalLessons > authoredLessons/, "in-preparation state is computed");
  assert.match(src, /!premium \|\| inPreparation/, "the aside shows for non-premium or pending content");
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

test("placeholder lessons are honest in seed content", () => {
  const spine = read("prisma/seed-courses/mbbs/spine.ts");
  assert.match(spine, /text: "In preparation"/, "placeholder lessons announce themselves in their body");
  assert.match(spine, /needsCheck:\s*!l\.authored/, "needsCheck follows authorship, never a hard-coded true");
});
