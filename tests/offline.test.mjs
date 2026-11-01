// Offline-first play + reading: the sync engine, the SW strategy, the shell
// chip, the /offline fallback and Lite Mode's motion kill.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const ROOT = new URL("../", import.meta.url).pathname;
const read = (p) => readFileSync(ROOT + p, "utf8");

const SW = read("public/sw.js");
const INDICATOR = read("src/components/offline/SyncIndicator.tsx");
const CSS = read("src/app/globals.css");
const LITE_TOGGLE = read("src/components/chrome/LiteModeToggle.tsx");
const QUIZ = read("src/app/highschool/[exam]/[subject]/[topic]/quiz/QuizClient.tsx");
const CUP = read("src/components/league/CupPlayClient.tsx");
const POD = read("src/components/ranking/PodPlayClient.tsx");
const READER = read("src/app/highschool/[exam]/[subject]/[topic]/study/StudyReaderClient.tsx");

const BANNER = "Offline — answers saved, will sync";

const queue = await import(ROOT + "src/lib/offline-queue.ts");

const item = (over = {}) => ({
  id: "q-1",
  endpoint: "/api/quiz/attempt",
  body: { domain: "highschool", answers: [{ questionId: "a", selectedAnswer: "B" }] },
  queuedAt: 1_700_000_000_000,
  attempts: 0,
  state: "pending",
  ...over,
});

test("the queue exports the sync-engine contract", () => {
  for (const fn of ["enqueue", "pending", "markSynced", "flush", "nextAttempt", "shouldRetry", "backoffDelay"]) {
    assert.equal(typeof queue[fn], "function", `${fn} must be exported`);
  }
  assert.equal(queue.MAX_ATTEMPTS, 3, "three attempts before a permanent failure");
  assert.equal(queue.BASE_DELAY_MS, 1_000, "the first retry waits a second");
  assert.equal(queue.BACKOFF_CAP_MS, 30_000, "the backoff is capped");
});

test("the queue is dependency-free: no imports at all", () => {
  const source = read("src/lib/offline-queue.ts");
  assert.doesNotMatch(source, /^import\s/m, "the idb wrapper ships with the engine, no dependency");
  assert.match(source, /indexedDB\.open\(/, "the wrapper talks to IndexedDB directly");
});

test("a queued item carries the documented shape", () => {
  const built = queue.nextAttempt(item(), { ok: false, error: "window closed" });
  assert.deepEqual(
    Object.keys(built).sort(),
    ["attempts", "body", "endpoint", "id", "lastError", "queuedAt", "state"],
    "the item is {id, endpoint, body, queuedAt, attempts, state} (+ reason)",
  );
});

test("attempts accumulate and the third failure becomes permanent", () => {
  const first = queue.nextAttempt(item(), { ok: false, error: "network down" });
  assert.equal(first.attempts, 1);
  assert.equal(first.state, "pending", "attempt 1 is still retryable");

  const second = queue.nextAttempt(first, { ok: false, error: "network down" });
  assert.equal(second.attempts, 2);
  assert.equal(second.state, "pending", "attempt 2 is still retryable");
  assert.equal(queue.shouldRetry(second), true);

  const third = queue.nextAttempt(second, { ok: false, error: "window closed" });
  assert.equal(third.attempts, 3);
  assert.equal(third.state, "failed", "attempt 3 is the permanent failure");
  assert.equal(queue.shouldRetry(third), false, "a failed item is not re-sent automatically");
  assert.match(third.lastError ?? "", /window closed/, "the failure reason is kept");
});

test("the failed state keeps the payload for a manual retry", () => {
  let failing = item();
  for (let i = 0; i < queue.MAX_ATTEMPTS; i += 1) failing = queue.nextAttempt(failing, { ok: false, error: "The window has closed" });
  assert.equal(failing.state, "failed");
  assert.deepEqual(failing.body, item().body, "the answers are untouched by every retry");
  assert.equal(failing.endpoint, "/api/quiz/attempt", "the endpoint is kept");
  assert.equal(typeof failing.queuedAt, "number", "the queue time is kept");
});

test("the backoff grows exponentially and the cap holds", () => {
  const steps = [1, 2, 3, 4].map((n) => queue.backoffDelay(n));
  assert.equal(steps[0], 1_000);
  assert.ok(steps[1] > steps[0] && steps[2] > steps[1] && steps[3] > steps[2], `backoff must grow: ${steps.join(" < ")}`);
  assert.equal(queue.backoffDelay(3), 4_000, "attempt 3 waits four seconds");
  assert.equal(queue.backoffDelay(50), queue.BACKOFF_CAP_MS, "the backoff never passes the cap");
});

test("flushable() sends pending items oldest first and skips the failed ones", () => {
  const fresh = item({ id: "fresh", queuedAt: 30, attempts: 0, state: "pending" });
  const older = item({ id: "older", queuedAt: 10, attempts: 1, state: "pending" });
  const refused = item({ id: "refused", queuedAt: 5, attempts: 3, state: "failed" });
  const sent = queue.flushable([fresh, refused, older]);
  assert.deepEqual(sent.map((i) => i.id), ["older", "fresh"], "oldest pending first, failures never resent");
});

test("the service worker caches the reading surfaces, stale-while-revalidate", () => {
  assert.ok(SW.includes('\\/highschool'), "highschool study pages are in the cache list");
  assert.ok(SW.includes('\\/study$'), "the study route is matched per segment");
  assert.ok(SW.includes('\\/lessons\\/'), "university lesson pages are in the cache list");
  assert.ok(SW.includes('\\/desk\\/'), "desk posts are in the cache list");
  assert.match(SW, /cache\.match\(request\)/, "a cached copy is served first");
  assert.match(SW, /onLine === false/, "offline there is no revalidation: cache-first");
  assert.match(SW, /cache\.put\(request/, "the fresh copy is written back behind the reader");
  assert.ok(SW.includes("/discovery/"), "the pre-existing network-first surfaces survive");
});

test("the service worker serves the /offline fallback", () => {
  assert.match(SW, /OFFLINE_URL = "\/offline"/, "the fallback page is named");
  assert.match(SW, /mode === "navigate"/, "navigations fall back when nothing is cached");
  assert.match(SW, /cache\.add\(OFFLINE_URL\)/, "the fallback page itself is pre-cached at install");
});

test("the offline shelf records the last-viewed surfaces", () => {
  assert.match(SW, /VIEWS_STORE = "views"/, "the SW writes a views store");
  assert.match(SW, /objectStore\(VIEWS_STORE\)\.put/, "a viewed path is recorded for the fallback page");
});

test("the SyncIndicator carries the three states and flushes on reconnect", () => {
  for (const label of ["Offline", "Syncing…", "Synced"]) {
    assert.ok(INDICATOR.includes(label), `the chip must render "${label}"`);
  }
  assert.match(INDICATOR, /addEventListener\("offline"/, "the chip listens for offline");
  assert.match(INDICATOR, /addEventListener\("online"/, "the chip listens for online");
  assert.match(INDICATOR, /void sync\(\)/, "a reconnect flushes the queue");
  assert.match(INDICATOR, /from "@\/lib\/offline-queue"/, "the chip reads the shared queue");
  const shell = read("src/components/chrome/AppShell.tsx");
  assert.match(shell, /<SyncIndicator \/>/, "the chip is mounted in the top bar");
  assert.match(shell, /<ThemeToggle \/>/, "the ThemeToggle is still mounted");
});

test("the /offline fallback page exists and lists what is cached", () => {
  const page = read("src/app/offline/page.tsx");
  assert.match(page, /Available offline/, "the page lists the cached surfaces");
  assert.match(page, /recentViews\(/, "the list comes from IndexedDB");
  assert.match(page, /outstanding\(\)/, "the queue is shown for a manual retry");
  assert.match(page, /Sync now/, "a queued paper can be retried by hand");
  assert.match(page, /stays for a manual retry/, "a refused submission is explained, not hidden");
});

test("lite mode strips animation", () => {
  assert.match(
    CSS,
    /html\.lite-mode \*,[\s\S]*?animation-duration: 0\.001ms !important/,
    "animation is neutralised under html.lite-mode",
  );
  assert.match(
    CSS,
    /html\.lite-mode \*,[\s\S]*?transition-duration: 0\.001ms !important/,
    "transitions are neutralised under html.lite-mode",
  );
  assert.match(LITE_TOGGLE, /classList\.toggle\("lite-mode"/, "the toggle writes the class");
  assert.match(LITE_TOGGLE, /classList\.toggle\("lite"/, "the toggle keeps its existing data behaviour");
});

test("every play surface queues its submission when the connection is gone", () => {
  for (const [name, src] of [["quiz", QUIZ], ["cup", CUP], ["pod", POD], ["reader", READER]]) {
    assert.match(src, /from "@\/lib\/offline-queue"/, `${name} imports the sync engine`);
    assert.match(src, /await enqueue\(/, `${name} queues its submission`);
    assert.match(src, /navigator\.onLine/, `${name} checks the connection first`);
  }
  for (const [name, src] of [["quiz", QUIZ], ["cup", CUP], ["pod", POD], ["reader", READER]]) {
    assert.ok(src.includes(BANNER), `${name} shows the offline banner copy`);
  }
  assert.match(QUIZ, /startedAt: new Date\(startTime\)\.toISOString\(\)/, "the quiz keeps its start time");
  assert.match(CUP, /startedAt: session\.startedAt/, "the cup keeps the server-anchored start");
  assert.match(POD, /startedAt: session\.startedAt/, "the pod keeps the server-anchored start");
  assert.match(CUP, /elapsedSeconds/, "the cup keeps the elapsed time at queue time");
  assert.match(POD, /elapsedSeconds/, "the pod keeps the elapsed time at queue time");
});
