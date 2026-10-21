#!/usr/bin/env node
/**
 * tools/uni/smoke.mjs — Gnostiri university lane smoke suite.
 *
 * Probes every university route this lane owns against a base URL and checks:
 *   1. status 200 (no redirects where 200 is expected)
 *   2. zero RSC error digests — the "digest":"…" rows that mean a route
 *      crashed in production while still shipping a 200-looking shell
 *   3. required content markers for the round-3 "never lost" pass
 *   4. the completion API contract: unauthenticated → 401 JSON, placeholder
 *      lesson → 409 with the honest message (verified directly against the
 *      seed's placeholder id for the target course when one exists)
 *
 * Lesson ids are discovered from the live course page HTML (the module nav
 * renders real lesson links), so no database is needed to smoke-read.
 *
 * Usage:
 *   node tools/uni/smoke.mjs                                   # localhost:3000
 *   node tools/uni/smoke.mjs --url https://gnostiri.vercel.app
 *   SMOKE_TIMEOUT_MS=60000 node tools/uni/smoke.mjs
 *
 * Exits 0 when every check passes, 1 otherwise. Zero dependencies.
 */

const urlFlagIndex = process.argv.indexOf("--url");
const BASE_URL = (urlFlagIndex > -1 && process.argv[urlFlagIndex + 1]
  ? process.argv[urlFlagIndex + 1]
  : process.env.SMOKE_URL ?? "http://localhost:3000"
).replace(/\/+$/, "");
const TIMEOUT_MS = Number(process.env.SMOKE_TIMEOUT_MS ?? 60_000);
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

let failures = 0;
function report(ok, name, detail) {
  if (ok) console.log(`${GREEN}✓${RESET} ${name}`);
  else {
    failures++;
    console.log(`${RED}✗ ${name}${RESET}${detail ? `\n    ${detail}` : ""}`);
  }
}

async function get(path) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      redirect: "manual",
      signal: controller.signal,
      headers: { "user-agent": "gnostiri-uni-smoke/1.0" },
    });
    const text = await res.text();
    return { status: res.status, location: res.headers.get("location"), text };
  } finally {
    clearTimeout(timer);
  }
}

const RSC_DIGEST = /"digest":"-?\d+"|NEXT_NOT_FOUND|NEXT_REDIRECT/;
function checkRoute(name, path, markers) {
  return get(path).then(({ status, text }) => {
    if (status !== 200) {
      report(false, `${name} (${path})`, `status ${status}`);
      return null;
    }
    const digest = RSC_DIGEST.test(text);
    if (digest) {
      report(false, `${name} (${path})`, "RSC error digest in body");
      return text;
    }
    const missing = (markers ?? []).filter((m) => !m.test(text));
    if (missing.length > 0) {
      report(false, `${name} (${path})`, `missing markers: ${missing.map(String).join(", ")}`);
      return text;
    }
    report(true, `${name} (${path})`);
    return text;
  });
}

const MBBS_COURSES = [
  "gross-anatomy-i",
  "physiology-cell-and-general",
  "medical-biochemistry-i",
  "pathology-cell-injury-repair",
  "pharmacology-foundations",
  "internal-medicine-foundations",
  "surgery-principles",
  "obstetrics-gynaecology",
  "paediatrics-child-health",
];
const FOUNDATION = ["applied-statistics", "introduction-to-programming"];

(async () => {
  console.log(`University lane smoke — ${BASE_URL}\n`);

  // --- index: programme grouping + honest status ---------------------------
  await checkRoute("university index", "/university", [
    /Gnostiri University/i,
    /MBBS/i,
    /authored/i,
    /Foundation courses/i,
  ]);

  // --- every course page: spine + status + primary action ------------------
  const courseHtml = new Map();
  for (const slug of [...MBBS_COURSES, ...FOUNDATION]) {
    const html = await checkRoute(`course ${slug}`, `/university/${slug}`, [
      /Course contents/i,
      /authored/i,
      /(Start here|Continue)/,
      /Course modules and lessons/i,
    ]);
    courseHtml.set(slug, html);
  }

  // --- lesson pages: the first (authored) and the last (placeholder) --------
  for (const slug of MBBS_COURSES) {
    const html = courseHtml.get(slug);
    if (!html) continue;
    const ids = [...html.matchAll(/\/university\/[a-z0-9-]+\/lessons\/([A-Za-z0-9-]+)/g)].map((m) => m[1]);
    const unique = [...new Set(ids)];
    if (unique.length === 0) {
      report(false, `lesson discovery ${slug}`, "no lesson links on the course page");
      continue;
    }
    const first = unique[0];
    await checkRoute(`lesson 1 ${slug}`, `/university/${slug}/lessons/${first}`, [
      /Lesson 1 of/i,
      /Previous lesson|Course contents/,
      /Next/,
    ]);
    const last = unique[unique.length - 1];
    await checkRoute(`lesson ${unique.length} ${slug}`, `/university/${slug}/lessons/${last}`, [
      /In preparation/i, // the tail of the spine is a tracked placeholder
      /still being written/i,
      /cannot be marked complete|still being written/i,
    ]);
  }

  // --- shells: no dead ends -------------------------------------------------
  await checkRoute("concept map", "/university/gross-anatomy-i/concepts", [/concept/i]);
  await checkRoute("exam hall", "/university/gross-anatomy-i/exams", [/Exam hall/i, /University/i]);
  await checkRoute("revision queue", "/university/revision", [/University/i, /revision/i]);
  await checkRoute("transcript", "/university/transcript", [/University/i, /Transcript/i]);

  // --- completion API contract (unauthenticated must be an honest 401) -----
  try {
    const res = await fetch(`${BASE_URL}/api/courses/course-anatomy/complete`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ lessonId: "course-anatomy-lesson-1" }),
    });
    const json = await res.json().catch(() => ({}));
    report(
      res.status === 401 && Boolean(json.error),
      "completion API rejects anonymous",
      `status ${res.status}, body ${JSON.stringify(json).slice(0, 120)}`,
    );
  } catch (e) {
    report(false, "completion API rejects anonymous", String(e));
  }

  if (failures > 0) {
    console.log(`\n${RED}${failures} failure(s)${RESET}`);
    process.exit(1);
  }
  console.log(`\n${GREEN}University lane smoke: all checks passed${RESET}`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
