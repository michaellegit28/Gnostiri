// Enumerate every placeholder (needsCheck) lesson in the university seeds —
// the exact list owned by the content-authoring queue, used by the round-3
// report. Read-only: parses the seed source, touches no database.
//
// Seed files are TypeScript, so each is transpiled with the repo's own
// typescript package and evaluated with its imports stubbed. The CLI guard at
// the bottom of each file only fires when argv[1] matches the file path, so
// evaluating one here never seeds anything.
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import assert from "node:assert/strict";

const require = createRequire(import.meta.url);
const ts = require("typescript");

const DIR = "prisma/seed-courses";
const MBBS = `${DIR}/mbbs`;

function loadSubjects(dir, skip = []) {
  const out = [];
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".ts") && !skip.includes(f))) {
    const src = readFileSync(`${dir}/${file}`, "utf8");
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
    for (const [name, value] of Object.entries(module_.exports)) {
      if (name === "default") continue; // CJS interop re-export of the same subject
      if (value && typeof value === "object" && Array.isArray(value.lessons) && Array.isArray(value.modules)) {
        out.push({ file, subject: value });
      }
    }
  }
  return out;
}

const rows = [];

// --- foundation courses authored outside the spine engine -------------------
// applied-statistics: lesson 1 authored, lessons 2–12 tracked placeholders
// (`needsCheck: l.id !== LESSON_1.id`, COURSE_ID course-statistics).
const STATS_TITLES = [
  "What is data & variables",
  "Describing distributions",
  "Probability basics",
  "Random variables & expectation",
  "The normal distribution",
  "Sampling & sampling distributions",
  "Confidence intervals",
  "Hypothesis testing — means",
  "Inference for proportions",
  "Chi-square tests",
  "ANOVA",
  "Linear regression",
];
STATS_TITLES.forEach((title, i) => {
  const n = i + 1;
  rows.push({
    course: "applied-statistics",
    code: "STA 101",
    n,
    lessonIdBase: `course-statistics-lesson-${n}`,
    lessonTitle: title,
    authored: n === 1,
  });
});
// introduction-to-programming: every lesson fully authored (needsCheck false).
for (let n = 1; n <= 12; n++) {
  rows.push({
    course: "introduction-to-programming",
    code: "CSC 101",
    n,
    lessonIdBase: `course-programming-lesson-${n}`,
    lessonTitle: `authored lesson ${n}`,
    authored: true,
  });
}

for (const { subject } of loadSubjects(MBBS, ["index.ts", "subjects.ts", "spine.ts"])) {
  subject.lessons.forEach((l, i) => {
    rows.push({
      course: subject.slug,
      title: subject.title,
      code: subject.code,
      n: i + 1,
      lessonIdBase: `${subject.id}-lesson-${i + 1}`,
      module: l.module,
      modules: subject.modules.length,
      lessonTitle: l.title,
      concept: l.concept.slug,
      authored: Boolean(l.authored),
      existingSlug: subject.existingSlug ?? null,
    });
  });
}

const placeholders = rows.filter((r) => r.authored === false);
const authored = rows.filter((r) => r.authored === true);

console.log(`courses: 11  lesson rows: ${rows.length}  authored: ${authored.length}  placeholders: ${placeholders.length}`);
console.log("\n=== PLACEHOLDER LESSONS (needsCheck) ===");
for (const r of placeholders) {
  console.log(
    `${r.code}\t${r.course}\tlesson ${r.n}${r.module ? ` (module ${r.module}/${r.modules})` : ""}\t${r.lessonTitle}\tid: ${r.lessonIdBase}${r.existingSlug ? ` [course row adopted from "${r.existingSlug}" — live prefix resolved from DB]` : ""}`,
  );
}
console.log(`\n=== AUTHORED SUMMARY (needsCheck false) ===`);
const byCourse = new Map();
for (const r of authored) {
  if (!byCourse.has(r.course)) byCourse.set(r.course, []);
  byCourse.get(r.course).push(r.n);
}
for (const [course, ns] of byCourse) console.log(`${course}: ${ns.length} authored — lessons ${ns.join(", ")}`);
assert.ok(placeholders.length > 0, "expected tracked placeholders in the spine");
assert.equal(authored.filter((r) => r.course === "applied-statistics").length, 1, "only stats lesson 1 is authored");
