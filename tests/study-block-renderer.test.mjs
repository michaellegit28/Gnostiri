// High-school study reader block coverage.
//
// The old StudyReaderClient stopped at `table`: every code block, check
// question, theory prompt and MCQ authored into lesson content rendered as
// nothing on the exam study page. The lesson type has always carried those
// blocks (src/types/lesson.ts); this is the guard that stops a renderer from
// silently dropping them again.
//
// These are source-level contracts, not DOM tests: the repo has no React test
// renderer, and the failure mode we care about is "the component does not
// switch over the block type", which source assertions catch without adding
// jsdom + a test renderer to a project that does not use one.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("../", import.meta.url).pathname;

const renderer = readFileSync(join(ROOT, "src/components/study/StudyBlockRenderer.tsx"), "utf8");
const reader = readFileSync(join(ROOT, "src/app/highschool/[exam]/[subject]/[topic]/study/StudyReaderClient.tsx"), "utf8");

test("the study block renderer covers every authored block type", () => {
  for (const type of ["heading", "paragraph", "definition", "example", "callout", "table", "code", "question", "theory", "mcq", "diagram"]) {
    assert.match(renderer, new RegExp(`case "${type}":`), `StudyBlockRenderer must render the "${type}" block`);
  }
});

test("the exam study reader uses the shared renderer instead of its own block switch", () => {
  assert.match(reader, /import StudyBlockRenderer from "@\/components\/study\/StudyBlockRenderer"/);
  assert.match(reader, /<StudyBlockRenderer content=\{lessonContent!\}/);
  // The old local renderer is gone: if this reappears, the high-school reader
  // can silently drop the block types again.
  assert.doesNotMatch(reader, /const renderBlock\s*=/, "StudyReaderClient must not keep its own block switch");
  assert.doesNotMatch(reader, /case "table":/, "the dropped block switch is still present");
});

test("interactive study blocks stay keyboard- and screen-reader usable", () => {
  // Disclosures are real controls with the required ARIA wiring.
  assert.match(renderer, /aria-expanded=\{open\}/);
  assert.match(renderer, /aria-controls=\{answerId\}/);
  assert.match(renderer, /aria-expanded=\{revealed\}/);
  // The theory textarea has a real associated label, not an aria-label only.
  assert.match(renderer, /<label htmlFor=\{draftId\}/);
  assert.match(renderer, /id=\{draftId\}/);
  // MCQ options are grouped and feedback is announced, not only coloured.
  assert.match(renderer, /role="group"/);
  assert.match(renderer, /aria-labelledby=\{groupId\}/);
  assert.match(renderer, /role="status" aria-live="polite"/);
  // Feedback is not colour-only: the text carries the verdict.
  assert.match(renderer, /Correct\. /);
  assert.match(renderer, /Not quite — the answer is/);
});

test("the paper medium keeps its tokens — no ad-hoc hex or slate text colours", () => {
  // Same paper-token rule as the rest of the study reader (globals.css tokens
  // are theme-locked; hex or text-slate-* would break the printed-sheet model).
  assert.doesNotMatch(renderer, /#[0-9a-fA-F]{3,8}\b/, "the paper medium must use --paper-* tokens");
  assert.doesNotMatch(renderer, /\btext-slate-50(?![0-9])/);
  assert.match(renderer, /font-reading/);
});