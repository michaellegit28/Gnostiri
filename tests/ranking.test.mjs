// Pure-logic tests for the Global Ranking engine (Phase 7).
//
// No DB, no Prisma, no network, no clock: every function under test is
// side-effect free and takes its inputs as arguments, so the tier boundaries,
// the seeded paper draw, the promotion plan and the ledger are all tested
// directly. This is the same style as tests/spaced-repetition.test.mjs and
// tests/desk-pipeline.test.mjs — node runs the .ts module with type
// stripping, and the module imports nothing at runtime.
//
// The defect classes this suite kills:
//   - tier thresholds drifting at the exact boundaries (a star count that
//     belongs to two tiers, or to none)
//   - a paper that carries the answer key, or that is not reproducible from
//     its seed (the member's play and the marker's grade drifting apart)
//   - two members of one pod sharing a draw instead of each holding their own
//   - a promotion plan that depends on row order rather than on the season's
//     standings
//   - a ledger whose running total disagrees with its own rows

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  MAX_TIER,
  MIN_TIER,
  PAPER_QUESTIONS,
  POD_WINDOW_SECONDS,
  TIERS,
  buildChampionshipPaper,
  displayHandle,
  groupName,
  isLedgerConsistent,
  nextBalance,
  nextSeasonSlug,
  paperHasNoAnswers,
  podAwardKey,
  podMemberSeed,
  podStars,
  podWindow,
  promotionPlan,
  rankPodMembers,
  seasonDates,
  starsForTier,
  starsToNextTier,
  tierFor,
  tierInfo,
} from "../src/lib/ranking.ts";

/** A pool of fake questions: no answer field anywhere, so no leak is possible. */
function pool(size) {
  return Array.from({ length: size }, (_, i) => ({
    id: `q:${1000 + i}`,
    questionText: `Question ${i + 1}`,
    options: ["alpha", "beta", "gamma", "delta"],
    difficulty: i % 3 === 0 ? "easy" : i % 3 === 1 ? "medium" : "hard",
  }));
}

const DECEMBER = new Date("2026-12-15T10:00:00.000Z");

// ── Tiers ───────────────────────────────────────────────────────────────────

test("the ladder is six tiers with the locked cumulative thresholds", () => {
  assert.deepEqual(
    TIERS.map((t) => t.label),
    ["Initiate", "Scholar", "Adept", "Vanguard", "Luminary", "Paragon"],
    "the owner's tier names, in order",
  );
  assert.deepEqual(
    TIERS.map((t) => t.threshold),
    [0, 50, 150, 400, 900, 2000],
    "cumulative star thresholds",
  );
  assert.equal(MIN_TIER, 1);
  assert.equal(MAX_TIER, 6);
});

test("tierFor lands exactly on every boundary and nowhere in between", () => {
  // Each threshold belongs to the tier it opens, never the one below it.
  assert.equal(tierFor(0), 1, "0 stars is Initiate");
  assert.equal(tierFor(49), 1, "one star short of Scholar is still Initiate");
  assert.equal(tierFor(50), 2, "exactly 50 is Scholar");
  assert.equal(tierFor(149), 2, "one short of Adept is still Scholar");
  assert.equal(tierFor(150), 3, "exactly 150 is Adept");
  assert.equal(tierFor(399), 3, "one short of Vanguard is still Adept");
  assert.equal(tierFor(400), 4, "exactly 400 is Vanguard");
  assert.equal(tierFor(899), 4, "one short of Luminary is still Vanguard");
  assert.equal(tierFor(900), 5, "exactly 900 is Luminary");
  assert.equal(tierFor(1999), 5, "one short of Paragon is still Luminary");
  assert.equal(tierFor(2000), 6, "exactly 2000 is Paragon");
  assert.equal(tierFor(999_999), 6, "above the top threshold stays Paragon");
  assert.equal(tierFor(-5), 1, "a negative total never leaves Initiate");
});

test("starsForTier returns the tier's floor, and starsToNextTier the gap", () => {
  assert.equal(starsForTier(1), 0);
  assert.equal(starsForTier(4), 400);
  assert.equal(starsForTier(6), 2000);
  assert.equal(starsForTier(0), 0, "an out-of-range tier clamps to the first rung");
  assert.equal(starsForTier(9), 2000, "an out-of-range tier clamps to the last rung");
  assert.equal(starsToNextTier(0), 50);
  assert.equal(starsToNextTier(120), 30, "120 stars → 30 more to reach Adept");
  assert.equal(starsToNextTier(2000), 0, "Paragon has nowhere left to climb");
  assert.equal(tierInfo(4).label, "Vanguard");
});

// ── The championship paper ──────────────────────────────────────────────────

test("a paper is derived from its seed: same seed, same paper", () => {
  const source = pool(60);
  const a = buildChampionshipPaper({ tier: 3, seed: 4242, pool: source });
  const b = buildChampionshipPaper({ tier: 3, seed: 4242, pool: source });
  assert.deepEqual(a, b, "the same seed must deal the same paper, every time");
  assert.equal(a.questions.length, PAPER_QUESTIONS, "a deep pool deals a full paper");
  assert.equal(new Set(a.questions.map((q) => q.id)).size, PAPER_QUESTIONS, "no question repeats");
  for (const q of a.questions) {
    assert.ok(source.some((s) => s.id === q.id), "every question comes from the tier pool");
    assert.equal(new Set(q.options).size, q.options.length, "options are not duplicated");
    assert.equal(q.options.length, 4, "every option survived the shuffle");
  }
});

test("a paper never carries an answer key — even if the pool entry does", () => {
  const poisoned = pool(20).map((entry, i) => (i === 0 ? { ...entry, correctAnswer: "alpha", explanation: "shhh" } : entry));
  const paper = buildChampionshipPaper({ tier: 1, seed: 7, pool: poisoned });
  assert.ok(paperHasNoAnswers(paper), "no question object carries a correct answer");
  assert.equal(paper.questions.length > 0, true, "the draw still ran");
  for (const q of paper.questions) {
    assert.equal("correctAnswer" in q, false, "correctAnswer must never reach a served paper");
    assert.equal("explanation" in q, false, "explanation must never reach a served paper");
    assert.deepEqual(Object.keys(q).sort(), ["difficulty", "id", "options", "questionText"], "the shape is exactly the safe fields");
  }
});

test("two members of one pod hold different draws", () => {
  const source = pool(60);
  const mine = buildChampionshipPaper({ tier: 5, seed: podMemberSeed("match-a", "user-1"), pool: source });
  const theirs = buildChampionshipPaper({ tier: 5, seed: podMemberSeed("match-a", "user-2"), pool: source });

  assert.equal(mine.seed !== theirs.seed, true, "each member's seed differs");
  assert.notDeepEqual(
    mine.questions.map((q) => q.id),
    theirs.questions.map((q) => q.id),
    "the same pool must not deal the same question order to two members",
  );
  assert.notDeepEqual(mine.questions[0].options, source[0].options, "options are re-drawn too");
  // The same member is always reproducible, which is what makes grading honest.
  const again = buildChampionshipPaper({ tier: 5, seed: podMemberSeed("match-a", "user-1"), pool: source });
  assert.deepEqual(mine, again, "re-deriving my paper gives my paper");
});

test("an empty pool yields an empty paper, never an exception", () => {
  const paper = buildChampionshipPaper({ tier: 1, seed: 1, pool: [] });
  assert.deepEqual(paper.questions, []);
  assert.ok(paperHasNoAnswers(paper));
});

// ── Pods: windows, seeds, placements, stars ─────────────────────────────────

test("a pod window is exactly 20 minutes from its opening instant", () => {
  const window = podWindow(DECEMBER);
  assert.equal(window.opensAt.toISOString(), DECEMBER.toISOString());
  assert.equal(window.seconds, POD_WINDOW_SECONDS);
  assert.equal(POD_WINDOW_SECONDS, 20 * 60);
  assert.equal(window.closesAt.getTime() - window.opensAt.getTime(), POD_WINDOW_SECONDS * 1000);
  assert.equal(POD_WINDOW_SECONDS, 1200);
});

test("a member's pod seed is a hash of matchId + userId", () => {
  const seed = podMemberSeed("match-1", "user-1");
  assert.equal(seed, podMemberSeed("match-1", "user-1"), "stable for the same pair");
  assert.notEqual(seed, podMemberSeed("match-2", "user-1"), "a different pod is a different draw");
  assert.notEqual(seed, podMemberSeed("match-1", "user-2"), "a different member is a different draw");
  assert.equal(Number.isInteger(seed), true, "a seed is an integer");
  assert.equal(
    seed >= -2147483648 && seed <= 2147483647,
    true,
    "a seed fits a Postgres INT4 — an unsigned hash tail would be rejected on write",
  );
  // Determinism survives the sign fold: the same inputs fold the same way.
  assert.equal(seed, podMemberSeed("match-1", "user-1"), "the fold is deterministic");
});

test("placements rank by score, then by submit order, then deterministically", () => {
  const standings = rankPodMembers([
    { userId: "u3", score: 2, submittedAt: new Date("2026-10-31T10:19:00Z") },
    { userId: "u1", score: 5, submittedAt: new Date("2026-10-31T10:05:00Z") },
    { userId: "u2", score: 5, submittedAt: new Date("2026-10-31T10:07:00Z") },
    { userId: "u4", score: 5, submittedAt: null },
    { userId: "u5", score: 0, submittedAt: null },
  ]);
  assert.deepEqual(
    standings.map((s) => s.userId),
    ["u1", "u2", "u4", "u3", "u5"],
    "score first, then the earlier submit, then an unanswered paper last",
  );
  assert.deepEqual(
    standings.map((s) => s.placement),
    [1, 2, 3, 4, 5],
    "placement is positional 1..n",
  );
});

test("pod stars pay 3 / 2 / 1 and still pay participation", () => {
  assert.equal(podStars(1), 3, "first takes 3");
  assert.equal(podStars(2), 2, "second takes 2");
  assert.equal(podStars(3), 1, "third takes 1");
  assert.equal(podStars(4), 1, "everyone else still takes 1 for finishing");
  assert.equal(podStars(0), 3, "a malformed placement never pays less than the winner");
});

test("a solo pod still settles: one member, one placement", () => {
  const standings = rankPodMembers([{ userId: "solo", score: 9, submittedAt: new Date() }]);
  assert.equal(standings.length, 1);
  assert.equal(standings[0].placement, 1);
  assert.equal(podStars(standings[0].placement), 3);
});

// ── Groups and promotion ────────────────────────────────────────────────────

test("group names carry the tier label and a roman group index", () => {
  assert.equal(groupName(1, 0), "Initiate I");
  assert.equal(groupName(2, 1), "Scholar II");
  assert.equal(groupName(4, 2), "Vanguard III", "the owner's example");
  assert.equal(groupName(5, 3), "Luminary IV");
  assert.equal(groupName(6, 0), "Paragon I");
  assert.equal(groupName(9, 0), "Paragon I", "a tier above the ladder clamps to Paragon");
  assert.equal(tierInfo(9).label, "Paragon", "tier info clamps upward, so it always has a threshold");
  assert.equal(tierInfo(0).label, "Initiate", "and clamps downward");
});

test("promotionPlan is deterministic: the same season always produces the same moves", () => {
  const groups = [
    { tier: 1, groupId: "g1", groupName: "Initiate I", avgStars: 10 },
    { tier: 1, groupId: "g2", groupName: "Initiate II", avgStars: 5 },
    { tier: 1, groupId: "g3", groupName: "Initiate III", avgStars: 2 },
    { tier: 1, groupId: "g4", groupName: "Initiate IV", avgStars: 0 },
    { tier: 2, groupId: "h1", groupName: "Scholar I", avgStars: 60 },
    { tier: 2, groupId: "h2", groupName: "Scholar II", avgStars: 55 },
    { tier: 2, groupId: "h3", groupName: "Scholar III", avgStars: 51 },
    { tier: 2, groupId: "h4", groupName: "Scholar IV", avgStars: 50 },
  ];

  const first = promotionPlan(groups);
  const second = promotionPlan(groups);
  assert.deepEqual(first, second, "identically-ordered input gives identical moves");

  const shuffled = promotionPlan([...groups].reverse());
  assert.deepEqual(shuffled, first, "row order must never change the plan");

  const promoted = first.filter((m) => m.direction === "promote");
  const relegated = first.filter((m) => m.direction === "relegate");
  assert.equal(promoted.length, 4, "the top two groups of both tiers promote");
  assert.equal(relegated.length, 2, "the bottom two groups relegate — except in Initiate, where there is nothing below");
  assert.deepEqual(
    promoted.map((m) => m.groupId).sort(),
    ["g1", "g2", "h1", "h2"],
    "promotion takes the two strongest groups per tier",
  );
  assert.deepEqual(
    relegated.map((m) => m.groupId).sort(),
    ["h3", "h4"],
    "relegation takes the two weakest groups of a tier that has a tier below it",
  );
  assert.equal(
    first.some((m) => m.fromTier === MIN_TIER && m.direction === "relegate"),
    false,
    "no Initiate group is ever relegated",
  );
  for (const move of first) {
    assert.equal(move.toTier, move.fromTier + (move.direction === "promote" ? 1 : -1), "a move goes exactly one tier");
    assert.ok(move.toTier >= MIN_TIER && move.toTier <= MAX_TIER, "no move leaves the ladder");
    // A group can never be promoted and relegated in the same season.
    assert.equal(
      first.filter((m) => m.groupId === move.groupId).length,
      1,
      "one move per group",
    );
  }
});

test("the ladder is closed at both ends", () => {
  // Initiates cannot relegate; Paragons cannot promote further.
  const bottom = promotionPlan([
    { tier: 1, groupId: "a", groupName: "Initiate I", avgStars: 5 },
    { tier: 1, groupId: "b", groupName: "Initiate II", avgStars: 4 },
    { tier: 1, groupId: "c", groupName: "Initiate III", avgStars: 1 },
    { tier: 1, groupId: "d", groupName: "Initiate IV", avgStars: 0 },
  ]);
  assert.equal(bottom.filter((m) => m.direction === "relegate").length, 0, "nothing falls out of Initiate");
  assert.equal(bottom.filter((m) => m.direction === "promote").length, 2);

  const top = promotionPlan([
    { tier: 6, groupId: "p1", groupName: "Paragon I", avgStars: 5000 },
    { tier: 6, groupId: "p2", groupName: "Paragon II", avgStars: 3000 },
    { tier: 6, groupId: "p3", groupName: "Paragon III", avgStars: 100 },
    { tier: 6, groupId: "p4", groupName: "Paragon IV", avgStars: 0 },
  ]);
  assert.equal(top.filter((m) => m.direction === "promote").length, 0, "nothing is promoted out of Paragon");
  assert.equal(top.filter((m) => m.direction === "relegate").length, 2, "Paragon still relegates into Luminary");
});

test("ties break on the group name, so a tied season is still ordered", () => {
  const tied = promotionPlan([
    { tier: 3, groupId: "z", groupName: "Adept Zed", avgStars: 7 },
    { tier: 3, groupId: "a", groupName: "Adept Alpha", avgStars: 7 },
    { tier: 3, groupId: "m", groupName: "Adept Mid", avgStars: 7 },
    { tier: 3, groupId: "b", groupName: "Adept Beta", avgStars: 7 },
  ]);
  const promoted = tied.filter((m) => m.direction === "promote").map((m) => m.groupName);
  assert.deepEqual(promoted, ["Adept Alpha", "Adept Beta"], "a tie is broken alphabetically, never by row order");
});

// ── The ledger ──────────────────────────────────────────────────────────────

test("nextBalance is the running total of the ledger's deltas", () => {
  assert.equal(nextBalance([]), 0, "an empty ledger balances at zero");
  assert.equal(nextBalance([{ delta: 3 }]), 3);
  assert.equal(nextBalance([{ delta: 3 }, { delta: -1 }, { delta: 1 }]), 3, "the sum is the balance");
});

test("the ledger's rows agree with their own running total", () => {
  const rows = [
    { delta: 3, balanceAfter: 3 },
    { delta: 2, balanceAfter: 5 },
    { delta: -1, balanceAfter: 4 },
    { delta: 1, balanceAfter: 5 },
  ];
  assert.equal(nextBalance(rows), 5);
  assert.equal(isLedgerConsistent(rows), true, "each balanceAfter matches its total");
  assert.equal(isLedgerConsistent([{ delta: 3, balanceAfter: 4 }]), false, "a drifting row is caught");
  assert.equal(
    isLedgerConsistent([{ delta: 3, balanceAfter: null }, { delta: 2 }]),
    true,
    "a row with no recorded balance does not fail the audit",
  );
});

test("a pod award is idempotent under its key: recomputing pays only the difference", () => {
  // The contract the submit route holds: sum(deltas for
  // <matchId>:<userId>) IS the member's award for that pod.
  const key = podAwardKey("m1", "u1");
  assert.equal(key, "m1:u1", "the idempotency key is exactly matchId:userId, as locked");
  assert.notEqual(key, podAwardKey("m1", "u2"));
  assert.notEqual(key, podAwardKey("m2", "u1"), "each pod has its own key space");

  const ledger = [{ delta: 3, reason: key, balanceAfter: 3 }];
  assert.equal(nextBalance(ledger.filter((r) => r.reason === key)), 3, "3 stars already paid");

  // A re-run that computes the same placement must pay nothing further.
  const paid = nextBalance(ledger.filter((r) => r.reason === key));
  const again = podStars(1) - paid;
  assert.equal(again, 0, "a settled placement writes no new ledger row");

  // A later submit that drops the member to second pays the difference only.
  const adjusted = podStars(2) - paid;
  assert.equal(adjusted, -1, "moving from 1st to 2nd takes one star back");
});

// ── Handles and the season calendar ─────────────────────────────────────────

test("handles are display names, never a fallback that leaks identity", () => {
  assert.equal(displayHandle("  Ada  "), "Ada", "a name is trimmed");
  assert.equal(displayHandle(""), "Anonymous Scholar", "an empty name stays anonymous");
  assert.equal(displayHandle(null), "Anonymous Scholar");
  assert.equal(displayHandle(undefined), "Anonymous Scholar");
  assert.equal(displayHandle("ada@example.com").includes("@"), true, "a supplied name is never rewritten into an email");
});

test("the season calendar follows the owner's numbering", () => {
  const s1 = seasonDates("s1-2027");
  assert.equal(s1.name, "Season 1");
  assert.equal(s1.startsAt.toISOString(), "2027-01-01T00:00:00.000Z", "Season 1 opens in January");
  assert.equal(s1.endsAt.getUTCMonth(), 3, "and closes in April");

  const s2 = seasonDates("s2-2027");
  assert.equal(s2.startsAt.getUTCMonth(), 4, "Season 2 opens in May");
  assert.equal(s2.endsAt.getUTCMonth(), 7, "and closes in August");

  const s3 = seasonDates("s3-2026");
  assert.equal(s3.startsAt.getUTCMonth(), 8, "Season 3 opens in September");
  assert.equal(s3.endsAt.getUTCMonth(), 11, "and closes in December");

  assert.equal(nextSeasonSlug("s3-2026"), "s1-2027", "December closes into the next year's Season 1");
  assert.equal(nextSeasonSlug("s1-2027"), "s2-2027");
  assert.equal(nextSeasonSlug("s2-2027"), "s3-2027");
  assert.equal(nextSeasonSlug("unknown"), "unknown", "an unknown slug is passed through untouched");
});
