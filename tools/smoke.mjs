#!/usr/bin/env node
/**
 * tools/smoke.mjs — Gnostiri live smoke suite.
 *
 * Proves pages work LIVE, not just at build time. The JAMB count bug and the
 * university RSC crash both shipped green: `next build` passed, tsc passed, and
 * nobody rendered a page. Every catalogued route is therefore probed over HTTP
 * and checked for:
 *   1. status 200 (a redirect where 200 is expected is a failure)
 *   2. zero RSC error digests — the `"digest":"…"` rows and NEXT_NOT_FOUND /
 *      NEXT_REDIRECT markers that mean a route crashed or vanished in prod
 *      while still shipping a 200-looking shell
 *   3. zero soft-404 bodies — retired empty-state copy ("Papers are being
 *      digitized") on every route, plus per-route `forbid` phrases and, on
 *      routes flagged `expectContent`, any empty-state copy at all
 *   4. REQUIRED content markers (loose-but-real regexes, never exact counts)
 *   5. advertised question counts where a live board must show real content
 *   6. API probes — JSON shape + array length range + the
 *      correctAnswer-never-reaches-the-client invariant
 *
 * Usage:
 *   node tools/smoke.mjs                                  # http://localhost:3000
 *   SMOKE_URL=https://gnostiri.vercel.app node tools/smoke.mjs
 *   node tools/smoke.mjs --url http://localhost:3223 --json
 *
 * Exits 0 when every check passes, 1 when anything fails.
 * Zero dependencies — Node 18+ built-in fetch only.
 *
 * Extending the catalogue (any agent): append an entry to CATALOGUE.
 *   {
 *     path: "/route?query=1",          // required
 *     name: "short-name",              // optional, defaults to path
 *     markers: [/regex/i, ...],        // all must appear in the HTML
 *     forbid: [/regex/i, ...],         // none may appear in the HTML
 *     expectContent: true,              // optional — content is mandatory here
 *     expectCount: {                    // optional — a count printed on the page
 *       pattern: /([\d,]+) questions/,  // capture group 1 = the number
 *       min: 1,                         // inclusive floor
 *     },
 *     api: {                            // optional — JSON probe instead of HTML
 *       field: "questions",             // dotted path to an array
 *       min: 1, max: 100000,            // inclusive length range
 *       method: "POST",                 // optional, default GET
 *       body: { ... },                 // optional JSON body for POST
 *       textMatches: [/regex/i, ...],   // all must appear in the raw response
 *     },
 *   }
 */

import { rscErrorsIn, soft404In, emptyCopyIn } from "./qa/rsc-guard.mjs";
import { stripComments } from "./qa/count-parsers.mjs";
import { pathToFileURL } from "node:url";

const urlFlagIndex = process.argv.indexOf("--url");
const flagUrl = urlFlagIndex > -1 ? process.argv[urlFlagIndex + 1] : null;
const BASE_URL = (flagUrl ?? process.env.SMOKE_URL ?? "http://localhost:3000").replace(/\/+$/, "");
const TIMEOUT_MS = Number(process.env.SMOKE_TIMEOUT_MS ?? 30_000);
const CONCURRENCY = Math.max(1, Number(process.env.SMOKE_CONCURRENCY ?? 8));
const JSON_OUT = process.argv.includes("--json");
const USE_COLOR = process.env.NO_COLOR !== "1" && process.stdout.isTTY;

const c = {
  green: (s) => (USE_COLOR ? `\x1b[32m${s}\x1b[0m` : s),
  red: (s) => (USE_COLOR ? `\x1b[31m${s}\x1b[0m` : s),
  dim: (s) => (USE_COLOR ? `\x1b[2m${s}\x1b[0m` : s),
  bold: (s) => (USE_COLOR ? `\x1b[1m${s}\x1b[0m` : s),
  yellow: (s) => (USE_COLOR ? `\x1b[33m${s}\x1b[0m` : s),
};

// ─── CATALOGUE ─────────────────────────────────────────────────────────────
// The priority surface. Order is the report order.
const CATALOGUE = [
  // ── Home + hubs ─────────────────────────────────────────────────────────
  {
    path: "/",
    name: "home",
    markers: [/High School/i, /University/i],
  },
  {
    path: "/highschool",
    name: "highschool-hub",
    markers: [/Textbooks and exams/i, /Open textbooks/i],
  },
  {
    path: "/highschool/exams",
    name: "exams-hub",
    markers: [/Computer-Based Test boards/i, /JAMB \(UTME\)/i, /Open board/i],
  },

  // ── Boards ──────────────────────────────────────────────────────────────
  {
    path: "/highschool/exams/jamb",
    name: "board-jamb",
    markers: [/past papers/i, /Class:\s*CBT/i],
    // A live board must advertise its own bank. "0 practice questions … papers
    // are being digitized" on the flagship board was the round-3 production bug.
    expectCount: { pattern: /([\d,]+) practice questions/, min: 1 },
    forbid: [/In preparation/i],
    expectContent: true,
  },
  {
    path: "/highschool/practice/jamb",
    name: "practice-jamb",
    markers: [/Board-format practice/i, /Practice JAMB/i],
    expectContent: true,
  },

  // ── Study + quiz (JAMB physics topic that carries the 6,000-question tree)
  {
    path: "/highschool/jamb/physics/motion-and-kinematics/study",
    name: "study-jamb-physics-kinematics",
    markers: [/Motion and Kinematics/i, /JAMB/i],
  },
  {
    path: "/highschool/jamb/physics/motion-and-kinematics/quiz",
    name: "quiz-jamb-physics-kinematics",
    // The quiz header prints "Question 1 of N" — N must be a real number, so
    // an empty bank cannot render this page.
    markers: [/Question\s*1\s*of\s*[\d,]+/i, /Motion and Kinematics/i],
  },

  // ── CBT flow ────────────────────────────────────────────────────────────
  {
    path: "/cbt",
    name: "cbt-select",
    markers: [/JAMB \(UTME\)/i, /Sit the exam/i],
  },
  {
    path: "/cbt/setup?board=jamb",
    name: "cbt-setup-jamb",
    markers: [/Session setup/i, /JAMB \(UTME\)/i],
  },
  {
    // No sessionStorage on the server — this is a fresh sitting, so the
    // server must BUILD a simulation paper and mount the runner. "Mark for
    // review" renders on every question; "Submit Exam" only on the last one.
    path: "/cbt/session?board=jamb&mode=simulation",
    name: "cbt-session-sim",
    markers: [/Mark for review/i, /JAMB \(UTME\)/i],
  },
  {
    path: "/cbt/results",
    name: "cbt-results",
    markers: [/Your result/i],
  },
  {
    path: "/cbt/review",
    name: "cbt-review",
    markers: [/Review every question/i],
  },

  // ── University ──────────────────────────────────────────────────────────
  {
    path: "/university",
    name: "university-index",
    markers: [/MBBS/i, /Gnostiri University/i],
  },
  {
    path: "/university/gross-anatomy-i",
    name: "course-gross-anatomy-i",
    markers: [/anatomy/i, /module/i],
  },
  {
    path: "/university/physiology-cell-and-general",
    name: "course-physiology-cell-and-general",
    markers: [/physiolog/i, /module/i],
  },

  // ── Extras + auth (read-only checks — discovery is deprioritized) ────────
  {
    path: "/discovery",
    name: "discovery",
    markers: [/Discovery/i, /deeper/i],
  },
  {
    path: "/login",
    name: "login",
    markers: [/Password/i, /Google/i],
  },

  // ── API probes ──────────────────────────────────────────────────────────
  {
    // Board-tagged questions for the flagship JAMB physics topic. This probe
    // is the alarm for the bug that shipped twice: it must return the full
    // bank, never an empty array.
    path: "/api/questions?boardId=jamb&topicId=jamb-physics-motion-and-kinematics",
    name: "api-questions-jamb-kinematics",
    api: { field: "questions", min: 101, max: 100000 },
  },
  {
    // Registry must agree with the database: every board the registry claims
    // has to be served by /api/boards.
    path: "/api/boards",
    name: "api-boards",
    api: {
      field: "regions",
      min: 1,
      max: 100,
      textMatches: [/"code"\s*:\s*"jamb"/],
    },
  },
  {
    // Builds a real practice paper server-side; also asserts the answer key
    // never crosses the wire.
    path: "/api/cbt/session",
    name: "api-cbt-session-jamb-physics",
    api: {
      method: "POST",
      body: { boardCode: "jamb", mode: "practice", subjects: ["jamb-physics"], count: 10 },
      field: "subjects",
      min: 1,
      max: 8,
    },
  },
];

// ─── helpers ───────────────────────────────────────────────────────────────

/**
 * React SSR delimits adjacent text/expression nodes with `<!-- -->` and the
 * RSC payload embeds JSON inside JS string literals (`\"digest\":\"x\"`).
 * Marker regexes must survive both, so every marker is tested against the raw
 * HTML and this normalized copy.
 */
function normalizeFlight(html) {
  return html.replace(/\\"/g, '"').replace(/<!--[\s\S]*?-->/g, "");
}

function dig(obj, path) {
  return path.split(".").reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

async function fetchWithTimeout(url, init) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal, redirect: "manual" });
  } finally {
    clearTimeout(timer);
  }
}

function fmtMs(ms) {
  return c.dim(`${Math.round(ms)}ms`);
}

function parseCountValue(text) {
  const m = String(text ?? "").replace(/[\s,]/g, "").match(/^(\d+)/);
  return m ? Number(m[1]) : null;
}

// ─── probe runners ─────────────────────────────────────────────────────────

async function probeHtml(entry) {
  const failures = [];
  const notes = [];
  const started = Date.now();
  let res;
  try {
    res = await fetchWithTimeout(`${BASE_URL}${entry.path}`, {
      headers: { "user-agent": "gnostiri-smoke/1.0", accept: "text/html" },
    });
  } catch (err) {
    return {
      entry,
      failures: [`request failed — ${err.name ?? "Error"}: ${err.message}`],
      notes,
      ms: Date.now() - started,
    };
  }
  const ms = Date.now() - started;

  if (res.status >= 300 && res.status < 400) {
    failures.push(`status ${res.status} redirect → ${res.headers.get("location") ?? "?"} (expected 200)`);
    return { entry, failures, notes, ms };
  }
  if (res.status !== 200) {
    failures.push(`status ${res.status} (expected 200)`);
  }

  const html = await res.text();

  // 1. crash / vanished-route guard
  failures.push(...rscErrorsIn(html));

  // 2. soft-404 guard — retired empty-state copy must never render
  failures.push(...soft404In(html));

  // 3. empty-state copy is only a defect where content is mandatory
  if (entry.expectContent) failures.push(...emptyCopyIn(html));

  // 4. per-route forbidden phrases (e.g. "In preparation" on a live board)
  for (const re of entry.forbid ?? []) {
    const flat = stripComments(html);
    if (re.test(html) || re.test(flat)) failures.push(`forbidden content present: ${re}`);
  }

  // 5. required content markers
  const flat = normalizeFlight(html);
  const missing = (entry.markers ?? []).filter((re) => !re.test(html) && !re.test(flat));
  for (const re of missing) failures.push(`missing content marker ${re}`);
  if ((entry.markers ?? []).length > 0) {
    notes.push(`markers ${(entry.markers ?? []).length - missing.length}/${(entry.markers ?? []).length}`);
  }

  // 6. an advertised question count where content is mandatory
  if (entry.expectCount) {
    const probe = entry.expectCount.pattern.exec(html) ?? entry.expectCount.pattern.exec(flat);
    const value = probe ? parseCountValue(probe[1]) : null;
    if (value == null) {
      failures.push(`no advertised count matching ${entry.expectCount.pattern}`);
    } else if (value < entry.expectCount.min) {
      failures.push(`advertised count ${value} below floor ${entry.expectCount.min}`);
    } else {
      notes.push(`advertised ${value.toLocaleString("en-US")}`);
    }
  }

  return { entry, failures, notes, ms };
}

async function probeApi(entry) {
  const failures = [];
  const notes = [];
  const {
    field,
    min = 0,
    max = Number.MAX_SAFE_INTEGER,
    method = "GET",
    body,
    textMatches = [],
  } = entry.api;
  const started = Date.now();
  let res;
  try {
    res = await fetchWithTimeout(`${BASE_URL}${entry.path}`, {
      method,
      headers: body ? { "content-type": "application/json" } : {},
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    return {
      entry,
      failures: [`request failed — ${err.name ?? "Error"}: ${err.message}`],
      notes,
      ms: Date.now() - started,
    };
  }
  const ms = Date.now() - started;
  if (res.status !== 200) {
    failures.push(`status ${res.status} (expected 200)`);
    return { entry, failures, notes, ms };
  }

  const text = await res.text();
  if (/correctAnswer/i.test(text)) {
    failures.push("correctAnswer leaked to the client (server-side grading invariant broken)");
  }
  for (const re of textMatches) {
    if (!re.test(text)) failures.push(`response missing required text ${re}`);
  }

  let json;
  try {
    json = JSON.parse(text);
  } catch {
    failures.push("response is not JSON");
    return { entry, failures, notes, ms };
  }

  const value = dig(json, field);
  if (!Array.isArray(value)) {
    failures.push(`field "${field}" is not an array`);
    return { entry, failures, notes, ms };
  }
  if (value.length < min || value.length > max) {
    failures.push(`field "${field}" length ${value.length} outside [${min}, ${max}]`);
  }
  notes.push(`${field}.length=${value.length}`);
  return { entry, failures, notes, ms };
}

// ─── runner ────────────────────────────────────────────────────────────────

async function runOne(entry) {
  return entry.api ? probeApi(entry) : probeHtml(entry);
}

async function main() {
  console.log(c.bold(`\nsmoke — ${BASE_URL} — ${CATALOGUE.length} routes\n`));

  const results = [];
  const queue = [...CATALOGUE];
  const workers = Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
    while (queue.length) {
      const entry = queue.shift();
      try {
        results.push(await runOne(entry));
      } catch (err) {
        results.push({ entry, failures: [`probe crashed: ${err.message}`], notes: [], ms: 0 });
      }
    }
  });
  await Promise.all(workers);
  results.sort((a, b) => CATALOGUE.indexOf(a.entry) - CATALOGUE.indexOf(b.entry));

  let failed = 0;
  for (const r of results) {
    const label = `${r.entry.api ? `${r.entry.api.method ?? "GET"} ` : "GET "}${r.entry.path}`;
    if (r.failures.length === 0) {
      console.log(
        `${c.green("PASS")}  ${label.padEnd(64)} ${(r.notes.join(" · ") || "ok").padEnd(28)} ${fmtMs(r.ms)}`,
      );
    } else {
      failed += 1;
      console.log(`${c.red("FAIL")}  ${label.padEnd(64)} ${fmtMs(r.ms)}`);
      for (const f of r.failures) console.log(c.red(`        → ${f}`));
    }
  }

  const passed = results.length - failed;
  const summary = failed === 0
    ? `${passed}/${results.length} routes pass`
    : `${passed}/${results.length} pass — ${failed} FAILING`;

  if (JSON_OUT) {
    console.log(
      JSON.stringify(
        {
          baseUrl: BASE_URL,
          total: results.length,
          passed,
          failed,
          results: results.map((r) => ({
            name: r.entry.name ?? r.entry.path,
            path: r.entry.path,
            ok: r.failures.length === 0,
            notes: r.notes,
            failures: r.failures,
            ms: r.ms,
          })),
        },
        null,
        2,
      ),
    );
  } else {
    console.log(
      `\n${failed === 0 ? c.green(c.bold(summary)) : c.red(c.bold(summary))}`,
    );
    if (failed > 0) {
      console.log(c.dim("report the failing routes above to the lane owners (mailbox agent-N)"));
      console.log(c.dim("cross-surface count disagreements: node tools/audit-counts.mjs"));
    }
  }
  process.exit(failed === 0 ? 0 : 1);
}

// Run only when invoked as a script, so tests can import the catalogue.
const invokedDirectly =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invokedDirectly) main();

export { CATALOGUE };
