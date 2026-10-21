/**
 * tests/qa-tools-e2e.test.mjs — end-to-end proof for the QA tools.
 *
 * The round-4 gate demands both tools proven exit-0 on a green site and exit-1
 * on a planted failure. These tests run the real scripts against a fixture
 * server (no database, no network) and assert the exit codes plus which defect
 * each planted failure produces.
 *
 * The green fixture is deliberately "too good": every surface agrees, so the
 * only thing that can make the tools exit 1 is a genuine planted defect.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { buildSite, DEFAULT_BOARDS, startFixture } from "./qa-fixtures.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SMOKE = path.join(ROOT, "tools", "smoke.mjs");
const AUDIT = path.join(ROOT, "tools", "audit-counts.mjs");

/**
 * Run a tool against a base URL. `spawn` (async) is mandatory: `spawnSync`
 * would block this process's event loop and the in-process fixture server
 * could never answer.
 */
function run(tool, baseUrl, extraArgs = []) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [tool, "--url", baseUrl, ...extraArgs], {
      env: { ...process.env, SMOKE_URL: baseUrl, NO_COLOR: "1", AUDIT_CONCURRENCY: "4" },
    });
    let out = "";
    let err = "";
    child.stdout.on("data", (d) => {
      out += d.toString();
    });
    child.stderr.on("data", (d) => {
      err += d.toString();
    });
    const timer = setTimeout(() => child.kill("SIGKILL"), 120_000);
    child.on("error", (e) => {
      clearTimeout(timer);
      reject(e);
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ code, out, err });
    });
  });
}

/**
 * Patch one rendered route; every other route is untouched. `replace` receives
 * the rendered route (string body or JSON object) and returns the replacement,
 * so both page and API routes can be broken.
 */
function plant(route, replace) {
  return (served, rendered) => {
    if (served !== route || !rendered) return rendered;
    if (typeof rendered === "string") {
      return typeof replace === "function" ? replace(rendered) : rendered.replace(...replace);
    }
    if (typeof replace === "function") return replace(rendered);
    return rendered;
  };
}

test("green fixture: smoke exits 0", async () => {
  const fixture = await startFixture(buildSite());
  try {
    const { code, out } = await run(SMOKE, fixture.baseUrl);
    if (code !== 0) console.log(out);
    assert.equal(code, 0, "every catalogue route must pass on a green fixture");
  } finally {
    await fixture.close();
  }
});

test("green fixture: audit-counts exits 0 when every surface agrees", async () => {
  const fixture = await startFixture(buildSite());
  try {
    const { code, out } = await run(AUDIT, fixture.baseUrl);
    if (code !== 0) console.log(out);
    assert.equal(code, 0, "a fully unified board must audit clean");
    assert.match(out, /AUDIT PASS/);
  } finally {
    await fixture.close();
  }
});

test("planted RSC digest: both tools exit 1", async () => {
  const fixture = await startFixture(
    buildSite(),
    plant("/highschool/exams/jamb", (html) => html.replace("</body>", '<script>self.__next_f.push([1,"{\\"digest\\":\\"1234\\",\\"message\\":\\"boom\\"}"])</script></body>')),
  );
  try {
    assert.equal((await run(SMOKE, fixture.baseUrl)).code, 1, "smoke must catch the swallowed crash");
    const audit = await run(AUDIT, fixture.baseUrl);
    assert.equal(audit.code, 1);
    assert.match(audit.out, /RSC_DIGEST/);
  } finally {
    await fixture.close();
  }
});

test("planted soft-404 copy on a populated board: both tools exit 1", async () => {
  const fixture = await startFixture(
    buildSite(),
    plant("/highschool/exams/jamb", (html) => html.replace("<h2>Past papers</h2>", "<h2>Past papers</h2><p>Papers are being digitized</p>")),
  );
  try {
    const smoke = await run(SMOKE, fixture.baseUrl);
    assert.equal(smoke.code, 1, "soft-404 copy must fail the route");
    assert.match(smoke.out, /soft-404/);
    const audit = await run(AUDIT, fixture.baseUrl);
    assert.equal(audit.code, 1);
    assert.match(audit.out, /SOFT_404/);
  } finally {
    await fixture.close();
  }
});

test("planted board-page under-count: audit exits 1 with BOARD_SELF_TOTAL", async () => {
  // The hero claims 500 while the topic cards under it sum to 600.
  const fixture = await startFixture(
    buildSite(),
    plant("/highschool/exams/jamb", (html) => html.replace("600<!-- --> practice question", "500<!-- --> practice question")),
  );
  try {
    const { code, out } = await run(AUDIT, fixture.baseUrl);
    assert.equal(code, 1);
    assert.match(out, /BOARD_SELF_TOTAL/);
    assert.match(out, /hero count disagrees with the topic cards/);
  } finally {
    await fixture.close();
  }
});

test("planted tree-vs-tag gap: audit exits 1 with TREE_VS_TAG", async () => {
  // The production bug, reproduced exactly: the board page keeps its 600-question
  // topic tree while every tag-scoped surface drops to 10.
  const boards = JSON.parse(JSON.stringify(DEFAULT_BOARDS));
  const jamb = boards.find((b) => b.slug === "jamb");
  jamb.tagTotal = 10;
  jamb.hubTagTotal = 10;
  jamb.tagTopics = [jamb.tagTopics[0]].map((t) => ({ ...t, mcq: 10, theory: 0, practical: 0 }));
  const fixture = await startFixture(buildSite(boards));
  try {
    const { code, out } = await run(AUDIT, fixture.baseUrl);
    assert.equal(code, 1);
    assert.match(out, /TREE_VS_TAG/);
    assert.match(out, /unreachable from the practice picker/);
  } finally {
    await fixture.close();
  }
});

test("planted api/questions under-report: audit exits 1 with API_TOPIC", async () => {
  const fixture = await startFixture(
    buildSite(),
    plant("/api/questions?boardId=jamb&topicId=jamb-physics-motion-and-kinematics", (rendered) => ({
      ...rendered,
      body: JSON.stringify({ questions: [] }),
    })),
  );
  try {
    const { code, out } = await run(AUDIT, fixture.baseUrl);
    assert.equal(code, 1);
    assert.match(out, /API_TOPIC/);
    assert.match(out, /jamb-physics-motion-and-kinematics/);
  } finally {
    await fixture.close();
  }
});

test("planted tag-family disagreement: audit exits 1 with TAG_FAMILY", async () => {
  // The exams hub chip says 700 while the practice picker states 600.
  const fixture = await startFixture(
    buildSite(),
    plant("/highschool/exams", (html) => html.replace("600 practice Qs", "700 practice Qs")),
  );
  try {
    const { code, out } = await run(AUDIT, fixture.baseUrl);
    assert.equal(code, 1);
    assert.match(out, /TAG_FAMILY/);
    assert.match(out, /two tag-scoped surfaces disagree/);
  } finally {
    await fixture.close();
  }
});

test("planted 500 on a catalogue route: smoke exits 1", async () => {
  const fixture = await startFixture(
    buildSite(),
    plant("/university", (rendered) => ({ ...rendered, status: 500 })),
  );
  try {
    const { code, out } = await run(SMOKE, fixture.baseUrl);
    assert.equal(code, 1);
    assert.match(out, /status 500/);
  } finally {
    await fixture.close();
  }
});

test("planted redirect where 200 is expected: smoke exits 1", async () => {
  const fixture = await startFixture(
    buildSite(),
    plant("/login", (rendered) => ({ ...rendered, status: 302 })),
  );
  try {
    const { code, out } = await run(SMOKE, fixture.baseUrl);
    assert.equal(code, 1);
    assert.match(out, /redirect/);
  } finally {
    await fixture.close();
  }
});

test("dead host: smoke exits 1", () => {
  const result = spawnSync(process.execPath, [SMOKE, "--url", "http://127.0.0.1:1"], {
    encoding: "utf8",
    env: { ...process.env, NO_COLOR: "1" },
    timeout: 120_000,
  });
  assert.equal(result.status, 1);
});

test("empty-state copy on a board with content is a soft-404", async () => {
  const fixture = await startFixture(
    buildSite(),
    plant("/highschool/exams/jamb", (html) =>
      html.replace("<section>", '<section><h2>In preparation</h2>'),
    ),
  );
  try {
    const audit = await run(AUDIT, fixture.baseUrl);
    assert.equal(audit.code, 1);
    assert.match(audit.out, /SOFT_404/);
    assert.match(audit.out, /In preparation/);
  } finally {
    await fixture.close();
  }
});
