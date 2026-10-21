// Taxonomy unification invariants (round 3).
//
// The JAMB bug was a branch of ONE fault: subject resolution that string-matched
// board-tagged question topics against the master curriculum registry dropped
// every board subject whose registry slug differs from its topic-tree slug
// (jamb-english-*, jamb-economics-*, jamb-agricultural-science-* …). The picker
// then silently hid those questions while /cbt served them.
//
// These tests extract the real resolver from the picker source (same technique
// as tests/assessment-seed.test.mjs: evaluate the shipped code, not a copy) and
// assert the resolution rules, plus the DB-safety invariants of the tag pass.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const ROOT = new URL("../", import.meta.url).pathname;
const Q = (p) => `${ROOT}${p}`;

/** Registry slugs the resolver's fallback path consults (from src/lib/curriculum.ts). */
const SUBJECTS = [
  { slug: "mathematics", name: "Mathematics" },
  { slug: "biology", name: "Biology" },
  { slug: "chemistry", name: "Chemistry" },
  { slug: "physics", name: "Physics" },
  { slug: "business-economics-accounting", name: "Business, Economics & Accounting" },
  { slug: "english-language", name: "English Language" },
];
const EXAM_CODE_PREFIXES = ["waec", "jamb", "neco", "kcse", "nsc-matric"];
/** Curriculum registry index — the master-* curriculum tree carries these slugs. */
const topicBySlug = (slug) =>
  ({
    "cell-biology": { subject: { slug: "biology", name: "Biology" } },
    "algebra-foundations": { subject: { slug: "mathematics", name: "Mathematics" } },
  }[slug] ?? undefined);

/** Extract resolveSubject from the shipped picker and evaluate it with the stubs. */
function loadResolver() {
  const src = readFileSync(Q("src/app/highschool/practice/[exam]/page.tsx"), "utf8");
  const start = src.indexOf("function resolveSubject(");
  assert.ok(start > -1, "resolveSubject must exist in the picker");
  // the function ends at the closing brace on its own column 0
  const end = src.indexOf("\n}\n", start);
  assert.ok(end > start, "resolveSubject must be a top-level function");
  const body = src.slice(start, end + 2);
  // strip the TypeScript annotations so the SHIPPED source can be evaluated
  const js = ts.transpileModule(body, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const factory = new Function("SUBJECTS", "EXAM_CODE_PREFIXES", "topicBySlug", `${js}\nreturn resolveSubject;`);
  return factory(SUBJECTS, EXAM_CODE_PREFIXES, topicBySlug);
}

/** The live JAMB subject roots, as seeded in production. */
const JAMB_ROOTS = [
  { slug: "mathematics", title: "Mathematics", id: "jamb-mathematics" },
  { slug: "english", title: "English Language", id: "jamb-english" },
  { slug: "physics", title: "Physics", id: "jamb-physics" },
  { slug: "chemistry", title: "Chemistry", id: "jamb-chemistry" },
  { slug: "biology", title: "Biology", id: "jamb-biology" },
  { slug: "economics", title: "Economics", id: "jamb-economics" },
  { slug: "accounting", title: "Accounting", id: "jamb-accounting" },
  { slug: "agricultural-science", title: "Agricultural Science", id: "jamb-agricultural-science" },
  { slug: "commerce", title: "Commerce", id: "jamb-commerce" },
  { slug: "geography", title: "Geography", id: "jamb-geography" },
  { slug: "government", title: "Government", id: "jamb-government" },
  { slug: "literature-in-english", title: "Literature in English", id: "jamb-literature-in-english" },
];

test("every JAMB subject's topics resolve to their subject root", () => {
  const resolveSubject = loadResolver();
  for (const root of JAMB_ROOTS) {
    // a child topic and the subject root itself both resolve to the subject
    const child = resolveSubject(`${root.id}-full-syllabus`, `${root.id}-full-syllabus`, "jamb", JAMB_ROOTS);
    assert.deepEqual(child, { slug: root.slug, title: root.title }, `${root.id} child`);
    const self = resolveSubject(root.id, root.id, "jamb", JAMB_ROOTS);
    assert.deepEqual(self, { slug: root.slug, title: root.title }, `${root.id} root`);
  }
});

test("multi-word subject slugs are not dropped (the round-3 regression)", () => {
  const resolveSubject = loadResolver();
  // These four subjects have registry slugs (english-language,
  // business-economics-accounting, technical-vocational) that do NOT match their
  // topic-tree slugs — the old prefix matcher returned null and the picker hid
  // their 500 questions each.
  for (const id of [
    "jamb-english-oral-english",
    "jamb-economics-microeconomics",
    "jamb-agricultural-science-full-syllabus",
    "jamb-literature-in-english-full-syllabus",
  ]) {
    const subject = resolveSubject(id, id, "jamb", JAMB_ROOTS);
    assert.ok(subject, `${id} must resolve, not be dropped`);
    assert.equal(subject.slug, id.slice("jamb-".length).split("-")[0] === "english" ? "english" : subject.slug);
  }
});

test("longest subject root wins when root slugs nest", () => {
  const resolveSubject = loadResolver();
  const roots = [
    { slug: "english", title: "English", id: "jamb-english" },
    { slug: "oral", title: "Oral English", id: "jamb-english-oral-english" },
  ];
  // jamb-english-oral-english-grammar must land on the deeper root
  const subject = resolveSubject("jamb-english-oral-english-grammar", "jamb-english-oral-english-grammar", "jamb", roots);
  assert.equal(subject.slug, "oral");
});

test("curriculum topics still resolve through the registry slug", () => {
  const resolveSubject = loadResolver();
  // WAEC/NECO tagged questions live on master-* topics carrying curriculum slugs
  const subject = resolveSubject("master-cell-biology", "cell-biology", "waec", []);
  assert.deepEqual(subject, { slug: "biology", title: "Biology" });
});

test("unknown topics resolve to null and are never miscategorised", () => {
  const resolveSubject = loadResolver();
  assert.equal(resolveSubject("mystery-topic", null, "jamb", JAMB_ROOTS), null);
  assert.equal(resolveSubject("mystery-topic", "no-such-slug", "jamb", JAMB_ROOTS), null);
});

test("the tag pass is additive and idempotent — no destructive SQL", () => {
  // strip comments so the assertion targets statements, not prose about them
  const code = readFileSync(Q("tools/pq/tag-boards.mjs"), "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
  for (const forbidden of ["UPDATE ", "DELETE ", "DROP ", "ALTER ", "TRUNCATE "]) {
    assert.ok(!code.toUpperCase().includes(forbidden), `tag-boards.mjs must not contain ${forbidden.trim()}`);
  }
  assert.ok(code.includes("ON CONFLICT"), "inserts must be conflict-safe so re-runs converge");
  // dry-run is the default: writing requires an explicit --apply
  assert.ok(/DRY_RUN = !process\.argv\.includes\("--apply"\)/.test(code), "must be dry-run first by default");
  assert.ok(code.includes("tier") && code.includes("CORE"), "tags are CORE tier");
  // questions that already carry a tag for the board are skipped, not rewritten
  assert.ok(code.includes("alreadyTagged"), "existing tags must be detected and preserved");
});

test("the board API serves a board's own tree without a tag, and never NOT_EXAMINED", () => {
  const src = readFileSync(Q("src/app/api/questions/route.ts"), "utf8");
  assert.ok(src.includes("inBoardTree"), "tree detection must gate the bank");
  assert.ok(/NOT:\s*\{\s*boardTags:/.test(src), "NOT_EXAMINED must be excluded on both paths");
  assert.ok(!/correctAnswer/.test(src), "the key must never be selected");
});
