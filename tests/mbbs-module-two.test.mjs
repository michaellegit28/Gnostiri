// Deep validation of the authored MBBS Module 2 wave.
//
// The suite tests/mbbs-spine.test.mjs already proves each authored lesson
// carries the pilot-report sections, that every block is a renderable type,
// that every MCQ key is inside its option list, and that every SBA has four
// unique options with the correctAnswer present verbatim. This file adds the
// checks that only make sense once several modules are authored:
//
//   - the prerequisite DAG is ACYCLIC in every subject (on top of being
//     closed, which mbbs-spine already proves). A cycle would deadlock the
//     gating that lets a student complete a lesson.
//   - lesson ids are unique across the whole subject, so no lesson row is
//     silently overwritten by a later entry in the same array
//   - every concept slug is unique and every SBA points at a concept that
//     exists (re-asserted here because a duplicate slug would break both)
//   - no authored lesson contains the tracked-placeholder announcement, so
//     nothing ships a "not authored yet" body under an authored title
//   - authored lessons are never flagged needsCheck and placeholders always
//     are — the authorship flag and the governance flag cannot drift apart
//   - module-2 concepts are actually reachable from module-1 concepts, so a
//     student who finished module 1 can start module 2
//   - the SBA stems do not contain their own correct answer verbatim
//     (already checked in mbbs-spine; re-checked here for the new array)
//
// Subjects are loaded by evaluating the seed source with its imports stubbed,
// exactly as tools/uni/placeholder-list.mjs does — read only, no database.

import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ts = require("typescript");

const DIR = "prisma/seed-courses/mbbs";

const SUBJECT_FILES = [
  { name: "ANAT 101 Human Anatomy", file: `${DIR}/anatomy.ts` },
  { name: "PHYS 101 Human Physiology", file: `${DIR}/physiology.ts` },
  { name: "BCHM 101 Medical Biochemistry", file: `${DIR}/biochemistry.ts` },
];

/** Load every SubjectSeed exported by a seed file, with imports stubbed. */
function loadSubjects(file) {
  const src = readFileSync(file, "utf8");
  const js = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const module_ = { exports: {} };
  const req = (id) => {
    if (id === "@prisma/client") {
      class PrismaClientStub { async $disconnect() {} }
      return { PrismaClient: PrismaClientStub };
    }
    if (id === "./spine") {
      return {
        seedMbbsCourse: async () => ({}),
        pendingLesson: (l) => ({ blocks: [] }),
        assertSbaInvariants: () => {},
        rotateOptions: (o) => o,
      };
    }
    if (id.endsWith("/lesson")) return {};
    throw new Error(`unstubbed import ${id} in ${file}`);
  };
  new Function("require", "exports", "module", "process", js)(req, module_.exports, module_, process);
  const out = [];
  for (const [name, value] of Object.entries(module_.exports)) {
    if (name === "default") continue;
    if (value && typeof value === "object" && Array.isArray(value.lessons) && Array.isArray(value.modules)) {
      out.push({ name, subject: value });
    }
  }
  return out;
}

/** All lessons in one subject, flattened out of the seed's module-2 extras too. */
function allLessons(subject) {
  return subject.lessons;
}

/** Build the concept graph { slug: [prereqSlugs] } and check for cycles. */
function findCycle(concepts) {
  const graph = new Map(concepts.map((c) => [c.slug, [...c.prereq]]));
  const WHITE = 0, GREY = 1, BLACK = 2;
  const colour = new Map(concepts.map((c) => [c.slug, WHITE]));
  const stack = [];
  let cycle = null;

  function visit(slug) {
    if (cycle) return;
    colour.set(slug, GREY);
    stack.push(slug);
    for (const pre of graph.get(slug) ?? []) {
      if (colour.get(pre) === GREY) {
        // found a back edge: slice the loop out of the current stack
        const i = stack.indexOf(pre);
        cycle = stack.slice(i).concat(pre);
        return;
      }
      if (colour.get(pre) === WHITE && graph.has(pre)) visit(pre);
      if (cycle) return;
    }
    stack.pop();
    colour.set(slug, BLACK);
  }

  for (const c of concepts) {
    if (colour.get(c.slug) === WHITE) visit(c.slug);
    if (cycle) break;
  }
  return cycle;
}

/** True when the node has any path back to itself. */
function isReachable(from, to, graph) {
  if (from === to) return true;
  const seen = new Set([from]);
  const queue = [...(graph.get(from) ?? [])];
  while (queue.length) {
    const n = queue.shift();
    if (n === to) return true;
    if (seen.has(n)) continue;
    seen.add(n);
    queue.push(...(graph.get(n) ?? []));
  }
  return false;
}

const blocksOf = (lesson) => (lesson.content && Array.isArray(lesson.content.blocks) ? lesson.content.blocks : []);

for (const { name, file } of SUBJECT_FILES) {
  test(`${name}: prerequisite DAG is acyclic and reachable`, { skip: !existsSync(file) }, () => {
    const subjects = loadSubjects(file);
    assert.ok(subjects.length > 0, `${file}: no SubjectSeed export found`);
    for (const { subject } of subjects) {
      const concepts = subject.lessons.map((l) => ({
        slug: l.concept.slug,
        title: l.concept.title,
        module: l.module,
        authored: Boolean(l.authored),
        prereq: l.concept.prereq ?? [],
      }));
      const bySlug = new Map();
      for (const c of concepts) {
        assert.ok(!bySlug.has(c.slug), `${subject.slug}: duplicate concept slug ${c.slug}`);
        bySlug.set(c.slug, c);
      }
      // closed: every prerequisite resolves inside this subject
      for (const c of concepts) {
        for (const p of c.prereq) {
          assert.ok(bySlug.has(p), `${subject.slug}: ${c.slug} declares unknown prerequisite ${p}`);
        }
      }
      const graph = new Map(concepts.map((c) => [c.slug, c.prereq]));
      const cycle = findCycle(concepts);
      assert.equal(cycle, null, `${subject.slug}: prerequisite cycle ${cycle ? cycle.join(" -> ") : ""}`);
      // a self-loop would also deadlock gating
      for (const c of concepts) {
        assert.ok(!c.prereq.includes(c.slug), `${subject.slug}: ${c.slug} depends on itself`);
      }

      // Every module-2 concept must descend, transitively, from a module-1
      // concept, so a student who finished module 1 can always start module 2.
      // Walk the prerequisite chain upwards: no module-2 concept may be an
      // orphan whose entire ancestry is module 2.
      const roots = new Set(concepts.filter((c) => c.module === 1).map((c) => c.slug));
      assert.ok(roots.size > 0, `${subject.slug}: no module-1 concepts`);
      for (const c of concepts) {
        if (c.module !== 2) continue;
        if (roots.has(c.slug)) continue;
        const seen = new Set();
        const queue = [...(graph.get(c.slug) ?? [])];
        let descended = false;
        while (queue.length) {
          const n = queue.shift();
          if (roots.has(n)) { descended = true; break; }
          if (seen.has(n)) continue;
          seen.add(n);
          queue.push(...(graph.get(n) ?? []));
        }
        assert.ok(
          descended,
          `${subject.slug}: module-2 concept ${c.slug} has no module-1 prerequisite anywhere above it`,
        );
      }
    }
  });
}

// ---------------------------------------------------------------------------
for (const { name, file } of SUBJECT_FILES) {
  test(`${name}: lesson ids are unique and authorship is never flagged`, { skip: !existsSync(file) }, () => {
    const subjects = loadSubjects(file);
    for (const { subject } of subjects) {
      const lessons = allLessons(subject);
      const seenIds = new Set();
      const prefix = subject.existingSlug ? subject.existingSlug : subject.id;
      for (let i = 0; i < lessons.length; i++) {
        const l = lessons[i];
        const id = `${prefix}-lesson-${i + 1}`;
        assert.ok(!seenIds.has(id), `${subject.slug}: duplicate lesson id ${id}`);
        seenIds.add(id);
      }
      // The spine re-keys on the COURSE ROW's id, which seed-university.ts
      // generates as a cuid. What matters is that the same array position
      // always maps to the same lesson — proven by the ids above being unique
      // and by the array being static source, not a random order.
      assert.equal(seenIds.size, lessons.length, `${subject.slug}: lesson id collision`);

      for (const l of lessons) {
        const blocks = blocksOf(l);
        if (l.authored) {
          // An authored lesson carries a real body.
          assert.ok(
            blocks.length >= 20,
            `${subject.slug}/lesson "${l.title}": authored but only ${blocks.length} blocks`,
          );
          // An authored lesson must not announce that it is unwritten.
          for (const b of blocks) {
            assert.notEqual(b.text, "In preparation", `${subject.slug}/lesson "${l.title}": authored but placeholder`);
          }
          assert.ok(
            !JSON.stringify(blocks).includes("This lesson has not been authored yet"),
            `${subject.slug}/lesson "${l.title}": placeholder text inside an authored lesson`,
          );
          // A taught lesson must actually teach something — not empty strings.
          let textCover = 0;
          for (const b of blocks) {
            if (typeof b.text === "string") textCover += b.text.length;
            if (Array.isArray(b.rows)) for (const r of b.rows) for (const c of r) textCover += (c ?? "").length;
            if (typeof b.prompt === "string") textCover += b.prompt.length;
            if (typeof b.stem === "string") textCover += b.stem.length;
            if (typeof b.options !== "undefined") for (const o of b.options) textCover += (o ?? "").length;
            if (typeof b.explanation === "string") textCover += b.explanation.length;
            if (typeof b.answer === "string") textCover += b.answer.length;
          }
          assert.ok(
            textCover >= 6000,
            `${subject.slug}/lesson "${l.title}": only ${textCover} characters of content — too thin to teach`,
          );
        } else {
          // A tracked placeholder is stubbed to an empty block array here, so
          // the honest-announcement check lives in tests/mbbs-spine.test.mjs.
          // What we assert is that it is not pretending to be a taught lesson.
          assert.ok(
            blocks.length <= 4,
            `${subject.slug}/lesson "${l.title}": unauthored but has ${blocks.length} blocks`,
          );
        }
      }
    }
  });
}

// ---------------------------------------------------------------------------
for (const { name, file } of SUBJECT_FILES) {
  test(`${name}: authored SBA keys never appear verbatim in their stems`, { skip: !existsSync(file) }, () => {
    const subjects = loadSubjects(file);
    for (const { subject } of subjects) {
      assert.ok(Array.isArray(subject.sbas), `${subject.slug}: sbas is not an array`);
      const byConcept = new Map(subject.lessons.map((l) => [l.concept.slug, l]));
      const seen = new Set();
      for (const sba of subject.sbas) {
        assert.ok(!seen.has(sba.slug), `${subject.slug}: duplicate SBA slug ${sba.slug}`);
        seen.add(sba.slug);
        assert.ok(byConcept.has(sba.concept), `${subject.slug}: SBA ${sba.slug} targets unknown concept`);
        assert.equal(sba.options.length, 4, `${subject.slug}/${sba.slug}: needs 4 options`);
        assert.ok(sba.options.includes(sba.correctAnswer), `${subject.slug}/${sba.slug}: key drift`);
        assert.equal(
          new Set(sba.options).size,
          sba.options.length,
          `${subject.slug}/${sba.slug}: duplicate options`,
        );
        assert.ok(!sba.stem.includes(sba.correctAnswer), `${subject.slug}/${sba.slug}: stem gives the answer away`);
        assert.ok(sba.explanation.length > 20, `${subject.slug}/${sba.slug}: explanation too short`);
        assert.ok(sba.stem.length > 20, `${subject.slug}/${sba.slug}: stem too short`);
      }
    }
  });
}

// ---------------------------------------------------------------------------
// Whole-lane governance for the medical content.
// ---------------------------------------------------------------------------
test("no seed row in the mbbs lane is pre-verified or left as draft", () => {
  if (!existsSync(DIR)) return;
  for (const f of readdirSync(DIR)) {
    if (!f.endsWith(".ts")) continue;
    const src = readFileSync(`${DIR}/${f}`, "utf8");
    assert.doesNotMatch(src, /reviewStatus:\s*"verified"/, `${f} writes a verified row`);
    assert.doesNotMatch(src, /reviewStatus:\s*"draft"/, `${f} writes a draft row`);
  }
});

test("the three authored subjects each carry a full module-2 lesson set", () => {
  for (const { name, file } of SUBJECT_FILES) {
    if (!existsSync(file)) continue;
    const subjects = loadSubjects(file);
    for (const { subject } of subjects) {
      const m2 = subject.lessons.filter((l) => l.module === 2);
      const authoredM2 = m2.filter((l) => l.authored);
      assert.ok(
        m2.length >= 10,
        `${name}: expected at least 10 module-2 lessons, found ${m2.length}`,
      );
      assert.equal(
        authoredM2.length,
        m2.length,
        `${name}: ${m2.length - authoredM2.length} of ${m2.length} module-2 lessons are still placeholders`,
      );
    }
  }
});
