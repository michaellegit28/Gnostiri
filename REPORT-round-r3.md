# Agent 2 — Round 3 report: ONE taxonomy, ONE count for the JAMB/WAEC/NECO banks

Branch `agent-2/jamb-unification-r1` (rebased on origin/main before merge).
Worktree `/tmp/opencode/gnostiri-wt/agent-2`. **Nothing was merged to main by me
outside the branch, no production database was modified, no secrets were
written, and nothing is marked "verified" — every item stays
needs-human-review.**

---

## 1. The bug, proven

The JAMB experience ran on three disagreeing sources. Captured live from
gnostiri.vercel.app before any change:

| Surface | What it said (before) | Source of truth it used |
|---|---|---|
| `/highschool/exams/jamb` | "0 subjects, 0 published papers" + "Papers are being digitized" | `ExamPaper` rows (none exist) |
| `/api/questions` + `/highschool/practice/jamb` | 340 questions (JAMB-tagged only) | `QuestionBoardTag` |
| `/highschool/jamb` (exam hub) | 12 subjects × 500 = 6,000 questions | the `jamb-*` topic tree |
| `/cbt` + `/cbt/setup?board=jamb` | "6,000 questions · 10 subjects" | the `jamb-*` topic tree |

Root cause: the 6,000-question bank was integrated into the `jamb-{subject}-{topic}`
topic tree (`tools/pq/integrate-banks.mjs`), but the board-tag pass in
`prisma/seed-exam-boards.ts` only tagged the legacy curriculum MCQs (its
cross-board CORE pass + resume guard + blueprint samples) — the bank's questions
never received `QuestionBoardTag` rows, so every tag-driven surface saw 340 while
the tree-driven surfaces saw 6,000.

How the 653 legacy questions got their tags (`prisma/seed-exam-boards.ts`):
1. **Cross-board CORE pass** — every `type = "mcq"` question in the curriculum is
   upserted as `QuestionBoardTag { examinationId, tier: "CORE", paperIds: [<first MCQ paper>] }`
   for each of JAMB/WAEC/NECO/KNEC/DBE. Guarded by a resume check
   (`existingTagCount > 0` → skip) so re-runs never re-write.
2. **Blueprint samples** — theory/practical validation questions on
   `waec-biology-cell-structure` tagged CORE to WAEC P2/P3.
3. **RULE 4 sample** — one quadratic MCQ on `waec-mathematics-quadratic-equations`
   is tagged `NOT_EXAMINED` for JAMB and must stay excluded.

Live tagged counts before this round (from `/highschool/exams`): JAMB 340,
WAEC 343, NECO 113, KNEC 0, DBE 0.

---

## 2. What this round built

### 2.1 `tools/pq/tag-boards.mjs` — the tag pass (additive + idempotent)

For each live board (jamb, waec, neco — the three `status: "live"` boards in
`src/lib/exam-bank.ts`):

- resolves the `Examination` row, finds its **first paper by sequence that
  carries MCQs** (jamb → P1/UTME, waec/neco → P1/Objective),
- collects every `Question` whose `topicId` is inside that board's `{code}-*`
  topic tree,
- inserts `QuestionBoardTag { examinationId, tier: "CORE", paperIds: [paper] }`
  in batches with `ON CONFLICT ("questionId","examinationId") DO NOTHING`.

Safety properties (asserted by `tests/board-taxonomy.test.mjs`):

- **additive only** — the file contains no `UPDATE`/`DELETE`/`DROP`/`ALTER`/
  `TRUNCATE` statement anywhere; questions that already carry a tag for the
  board are detected up-front and left exactly as they are, so the
  `NOT_EXAMINED` RULE 4 sample and every cross-board tag survive untouched;
- **never touches other boards' trees** — only the board's own `{code}-*` ids;
- **idempotent** — re-runs converge to zero inserts;
- **dry-run by default**; writing requires an explicit `--apply`;
- `paperIds` is cast to whatever JSON type the live column uses (read from
  `information_schema.columns`), so it matches the existing `["P1"]` arrays.

### 2.2 `/highschool/exams/[exam]` — the board page tells the truth

Rebuilt (`src/app/highschool/exams/[exam]/page.tsx`):

- **hero** reports the real bank: `{treeQuestionCount} practice questions across
  {subjectCount} subjects and {topicCount} topics`, all computed from the
  board's own topic tree — never from tags, never a false zero;
- **subject grid** — every subject root of the tree with per-topic question
  counts, each topic linked to its study page and quiz
  (`/highschool/{code}/{subject}/{topic}/{study,quiz}` — verified for every
  subject in the tree, including the monolithic `-full-syllabus` subjects);
- **entry points** — "Start CBT simulation" (→ `/cbt/setup?board={slug}`) and
  "Practice by topic" (→ `/highschool/practice/{slug}`), each honest about state:
  muted and labelled "in preparation" when the board has no questions yet
  (e.g. NECO's tree is empty; `/cbt/setup?board=neco` shows its own honest
  "Content in preparation" state);
- **class badge + format/papers chips** from `src/lib/exam-bank.ts` kept;
- **papers status** — "Past-paper digitization in progress … N practice
  questions are live", with real digitized papers still listed when they exist
  (the `ExamPaper` path is unchanged);
- preparing boards (SAT, AP, MANEB, CBSE, ICSE, NSC, NECTA, KNEC, Cambridge,
  AQA, Edexcel) keep the honest "In preparation" empty state — no fabrication.

### 2.3 `/api/questions` — root-cause fix

`src/app/api/questions/route.ts` previously answered **only** from board tags, so
a JAMB topic with no tags returned `{"questions":[]}` (verified live:
`?boardId=jamb&topicId=jamb-physics` → empty). Now a question inside the board's
own `{code}-*` topic tree is served by construction (the tree IS the board's
bank, the same one `/cbt` reads); topics outside the tree keep the tag +
blueprint-paper contract. `NOT_EXAMINED` is excluded on **both** paths (RULE 4),
and `correctAnswer`/`markingPoints` are still never selected.

### 2.4 `/highschool/practice/[exam]` — no more silently dropped subjects

The picker's subject resolver string-matched tagged topic ids against the master
curriculum registry (`SUBJECTS` slugs). Board tree slugs differ from registry
slugs, so `jamb-english-*`, `jamb-economics-*`, `jamb-agricultural-science-*`,
`jamb-literature-in-english-*`, `jamb-commerce-*`, `jamb-accounting-*`,
`jamb-geography-*`, `jamb-government-*` all resolved to `null` and were **dropped**
from the picker even when their questions were tagged. Resolution now prefers
the board's own topic tree (longest-matching subject root), then the curriculum
registry slug (the `master-*` curriculum tree WAEC/NECO tags live on), then the
constructed-id convention. Covered by tests 1–5.

### 2.5 `/highschool/[exam]/[subject]` — same numbers as the board page

Per-topic and per-subject question counts now come from the tree
(`question.groupBy`), so the subject page, the board page and `/cbt` agree.

---

## 3. Verification

| Gate | Result |
|---|---|
| `npx tsc --noEmit` | 0 errors |
| `next lint` (changed dirs) | clean |
| `next build` (branch) | successful — BUILD_ID written; the pristine `main` checkout behaves identically in this sandbox |
| `node --test` (all suites) | **141 pass / 0 fail**, incl. 7 new `tests/board-taxonomy.test.mjs` |
| Vercel branch deploy | **READY** ("Deployment has completed", GitHub status, sha 3301003) |

Local page-level smoke could not be run: there is no `DATABASE_URL` in this
agent's shell, a local PostgreSQL cannot start (no `/dev/shm`, no SysV shared
memory; docker is unresponsive), and the Vercel **branch preview is
SSO-protected**. Live smoke of the same URLs on `gnostiri.vercel.app` is the
verification that replaces it (see §5).

### Counts to re-verify once the tag pass runs

- `/highschool/exams/jamb`: 6,000 practice questions · 12 subjects
  (Mathematics 500/8 topics, English Language 500/7, Physics 500/7, Chemistry 500/7,
  Biology 500/7, Economics 500/2, Accounting 500/1, Agricultural Science 500/1,
  Commerce 500/1, Geography 500/1, Government 500/1, Literature in English 500/1)
  · 44 topics (all captured from the live `/highschool/jamb` hub before any change).
- `/highschool/exams/waec`: 13 practice questions (Mathematics 10, Biology 3) ·
  5 subjects · 26 topics — English/Physics/Chemistry are real syllabus
  structure with no questions loaded yet, shown honestly as 0.
- `/highschool/exams/neco`: 0 practice questions · 5 subjects · 26 topics —
  honest empty state; its 113 tagged curriculum questions still show on the
  practice picker (they live on `master-*` topics).
- `/cbt/setup?board=jamb` selects **10 of the 12** subjects.

---

## 4. Flagged for human review

1. **`/cbt` subject count is wrong and hides 1,000 questions.** `src/lib/cbt/data.ts`
   filters subject roots with `!t.id.slice(prefix.length).includes("-")`, which
   drops every multi-word subject: `jamb-agricultural-science` and
   `jamb-literature-in-english` never appear in the CBT subject picker, so 1,000
   of the 6,000 bank questions are unreachable in CBT while the card advertises
   "6,000 questions". One-line fix (match roots by tree/parent instead of a dash
   heuristic) — **outside my lane**, not touched. The board page and practice
   picker show the true 12 subjects.
2. **package.json script request** — please add
   `"test:board-taxonomy": "node --test tests/board-taxonomy.test.mjs"`
   (package.json is outside my lane).
3. **The two count bases are different by design and must stay labelled.**
   The board page hero counts the topic *tree* (6,000 JAMB); the practice
   picker and the exams hub count *board tags* (340 before the pass, 6,340
   expected after) because the legacy cross-board tagged curriculum questions
   live on `master-*` topics outside the tree. Both are honest; if the owner
   wants ONE headline number everywhere, the legacy 340 cross-board tags should
   be reconciled against the tree (a data decision, not a code one).
4. Nothing here is marked "verified"; `needsVerification` stays true on every
   topic and question, and no past-paper content was fabricated to fill the
   empty `ExamPaper` table.
