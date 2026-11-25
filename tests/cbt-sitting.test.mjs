// Sitting-identity rules for the CBT simulator.
//
// Kills the defect where a browser refresh silently destroyed a live exam: the
// paper is re-shuffled on every render of the force-dynamic session page, so the
// runner received a different paper for the same setup. The old resume check
// compared the stored question-id digest against the new one, never matched,
// and fell through to a fresh sitting — dropping every answer and resetting
// startedAt, which also reset the clock (data loss and a timer cheat, one cause).

import { test } from "node:test";
import assert from "node:assert/strict";

import { signatureOf, shouldResume } from "../src/lib/cbt/sitting.ts";

const paper = (over = {}) => ({
  boardCode: "jamb",
  boardName: "JAMB",
  mode: "simulation",
  durationSec: 3600,
  subjects: [
    { topicId: "jamb-english", title: "English", questions: [{ id: "q1" }, { id: "q2" }] },
  ],
  ...over,
});

const sitting = (over = {}) => ({
  digest: "irrelevant — the signature decides",
  signature: signatureOf(paper()),
  state: {
    answers: { q1: { chosen: 2 } },
    subjectIdx: 0,
    qIdx: 1,
    paperTab: "objective",
    startedAt: Date.now() - 600_000, // ten minutes in
  },
  paper: paper(),
  ...over,
});

test("a reload mid-exam resumes the same sitting", () => {
  // Same setup, different random order — exactly what a refresh produces.
  const redealt = paper({
    subjects: [
      { topicId: "jamb-english", title: "English", questions: [{ id: "q2" }, { id: "q1" }] },
    ],
  });
  assert.equal(signatureOf(redealt), signatureOf(paper()), "signature ignores question order");
  assert.equal(shouldResume(sitting(), redealt), true, "answers and clock survive the reload");
});

test("a new sitting is not resumed on top of an old one", () => {
  assert.equal(shouldResume(sitting(), paper({ mode: "practice" })), false, "mode change starts fresh");
  assert.equal(shouldResume(sitting(), paper({ boardCode: "waec" })), false, "board change starts fresh");
  assert.equal(
    shouldResume(sitting(), paper({ subjects: [{ topicId: "jamb-maths", title: "Maths", questions: [] }] })),
    false,
    "different subjects start fresh"
  );
});

test("an expired sitting is discarded, never resumed", () => {
  const stale = sitting({
    state: { ...sitting().state, startedAt: Date.now() - 7_200_000 }, // 2h ago, 1h paper
  });
  assert.equal(shouldResume(stale, paper()), false, "the student is not marked into overtime");
});

test("a missing or corrupt sitting never blocks a fresh exam", () => {
  assert.equal(shouldResume(null, paper()), false);
  assert.equal(shouldResume(undefined, paper()), false);
  assert.equal(shouldResume({}, paper()), false, "a stored row with no paper");
  assert.equal(
    shouldResume({ signature: "x", state: null, paper: null }, paper()),
    false,
    "a stored row with no state"
  );
});

test("the signature covers every field that defines a sitting", () => {
  const base = signatureOf(paper());
  assert.notEqual(base, signatureOf(paper({ mode: "practice" })));
  assert.notEqual(base, signatureOf(paper({ durationSec: 7200 })));
  assert.notEqual(base, signatureOf(paper({ boardCode: "waec" })));
});

test("a sitting one second before the deadline still resumes", () => {
  const edge = sitting({ state: { ...sitting().state, startedAt: Date.now() - 3_599_000 } });
  assert.equal(shouldResume(edge, paper()), true, "the clock is the student's, not the tab's");
});
