// Copy guard — the de-AI pass (lane/copy).
//
// Kills the defect class the owner banned: AI-sounding marketing copy and
// shaky placeholders creeping back into the app. Everything below is
// statically extracted from the shipped source, so the assertions can't drift
// from what renders. The ranking lane (src/**/ranking, *competition) and the
// brand Home are owned elsewhere and are excluded from the global sweeps.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("../", import.meta.url).pathname;
const read = (p) => readFileSync(ROOT + p, "utf8");

/** Every .ts/.tsx under src/, skipping the parallel ranking lane + tests. */
function sourceFiles(dir = "src", out = []) {
  for (const entry of readdirSync(join(ROOT, dir))) {
    if (entry === "ranking" || entry.includes("competition")) continue;
    const rel = join(dir, entry);
    const abs = join(ROOT, rel);
    if (statSync(abs).isDirectory()) sourceFiles(rel, out);
    else if (/\.tsx?$/.test(entry) && !/\.test\./.test(entry)) out.push(rel);
  }
  return out;
}

// The ban list — same terms the owner shipped, plus their obvious cousins.
const BAN = /\b(unlock\w*|unleash\w*|embark\w*|seamless(ly)?|elevate\w*|cutting-edge|your potential|next level|fast-paced|we believe)\b/i;

// The pages whose metadata this lane owns — every file with a `description:`.
const METADATA_PAGES = [
  "src/app/highschool/layout.tsx",
  "src/app/university/page.tsx",
  "src/app/university/[course]/concepts/page.tsx",
  "src/app/university/[course]/exams/page.tsx",
  "src/app/university/[course]/lessons/[lesson]/page.tsx",
  "src/app/university/revision/page.tsx",
  "src/app/university/transcript/page.tsx",
  "src/app/discovery/layout.tsx",
  "src/app/pricing/layout.tsx",
  "src/app/cbt/page.tsx",
  "src/app/progress/layout.tsx",
  "src/app/battle-plan/layout.tsx",
  "src/app/study-plan/layout.tsx",
  "src/app/manifest.ts",
];

/** Pull the string value out of a `description:` field (single or multi-line). */
function descriptionOf(source) {
  const m = /description:\s*(?:\r?\n\s*)?["'`]([\s\S]*?)["'`]/.exec(source);
  return m ? m[1] : null;
}

test("no banned marketing copy anywhere in src", () => {
  const offenders = [];
  for (const file of sourceFiles()) {
    const src = read(file);
    const hit = src.match(BAN);
    if (hit) offenders.push(`${file} → ${hit[0]}`);
  }
  assert.equal(offenders.length, 0, `ban-list hits remain:\n${offenders.join("\n")}`);
});

test("no UI string ends in an exclamation mark", () => {
  const offenders = [];
  for (const file of sourceFiles()) {
    const lines = read(file).split("\n");
    lines.forEach((line, i) => {
      // a string literal whose content ends in "!" (e.g. "Correct!")
      if (/[A-Za-z0-9]!["'`]/.test(line)) offenders.push(`${file}:${i + 1} ${line.trim()}`);
      // a JSX text line that ends in "!"
      else if (/[A-Za-z]!$/.test(line)) offenders.push(`${file}:${i + 1} ${line.trim()}`);
    });
  }
  assert.equal(offenders.length, 0, `trailing "!" remains:\n${offenders.join("\n")}`);
});

test("metadata descriptions are under 120 characters", () => {
  const tooLong = [];
  for (const file of METADATA_PAGES) {
    const desc = descriptionOf(read(file));
    if (desc == null) { tooLong.push(`${file} → no description found`); continue; }
    if (desc.length >= 120) tooLong.push(`${file} → ${desc.length} chars: ${desc}`);
  }
  assert.equal(tooLong.length, 0, `descriptions over the limit:\n${tooLong.join("\n")}`);
});

test("the pricing page names real prices", () => {
  const pricing = read("src/app/pricing/page.tsx");
  assert.match(pricing, /\$3\.99 \/ month/, "names the $3.99 monthly price");
  assert.match(pricing, /\$39\.90 \/ year/, "names the $39.90 annual price");
});

test("headings are sentence case, not Title Case Everywhere", () => {
  // Spot-check the copy that was Title Case before the pass.
  const notFound = read("src/app/not-found.tsx");
  assert.doesNotMatch(notFound, /Textbooks and exam banks|Degree-depth courses|Follow curiosity/, "404 doorways are concrete");
  const transcript = read("src/app/university/transcript/page.tsx");
  assert.doesNotMatch(transcript, /Competency Transcript</, "transcript heading is sentence case");
});
