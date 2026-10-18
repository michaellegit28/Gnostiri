# Curriculum Alignment — Introduction to Programming (Python)

## The anchor

This course is anchored to **Python for Everybody (PY4E): Exploring Data Using
Python 3, 3rd ed.**, by Dr. Charles R. Severance, University of Michigan —
a named public curriculum (Creative Commons BY 4.0, available free at
https://www.py4e.com). The 12-lesson structure maps to PY4E's chapter sequence
so a student who is following PY4E — or being taught from it — can see exactly
where each lesson sits. Alignment is **stated, not claimed**: every lesson cites
the PY4E chapter (and the specific topic) it covers, so it can be audited.

This is an *Informatics-oriented* introduction (greater focus on using Python to
solve real data problems), which suits the "what students actually need"
goal: they learn to handle text, files and data, not just toy algorithms.

PY4E is CC BY 4.0. Our lessons are original writing in our own words, but the
**topic sequence is the curriculum** we are deliberately following, and the
chapter citations below make that explicit.

## Lesson → PY4E chapter mapping

| Lesson | Title | PY4E chapter | Topic |
|---|---|---|---|
| 1 | What a program is | 1: Introduction | Program, interpreter/compiler, hardware, debugging, 4Rs |
| 2 | Variables & types | 2: Variables | Variables, expressions, statements, types |
| 3 | Input, output & operators | 2: Variables | input(), print(), string ops, numeric operators, precedence |
| 4 | Conditions | 3: Conditionals | if/elif/else, boolean expressions, comparison & logical ops |
| 5 | Loops | 5: Iteration | while, for, break/continue, infinite loops, the iterate-loop pattern |
| 6 | Logic & debugging basics | 1: Introduction (debugging) + 3,5 | Syntax vs logic vs semantic errors, reading/tracing, the 4Rs |
| 7 | Functions | 4: Functions | def, parameters, return, the relationship "story" metaphor |
| 8 | Lists & dictionaries | 8, 9: Lists; Dictionaries | list ops, iteration, dict get()/keys() pattern, word-count idiom |
| 9 | Strings & files | 6, 7: Strings; Files | slicing, methods, split, open/read, line-by-line pattern |
| 10 | Decomposition | 4: Functions (reuse) | Breaking a problem into functions; the "story" composed of pieces |
| 11 | Testing & debugging | 1: Introduction (debugging) | Hypothesis-driven debugging, print-instrumentation, reducing cases |
| 12 | Mini project | 10: Tuples + capstone | The word-count capstone pattern applied to a real text file |

## Module structure

| Module | Lessons | PY4E domain |
|---|---|---|
| M1 — Thinking like a programmer | 1, 2, 3 | Ch 1-2 (foundations) |
| M2 — Control flow | 4, 5, 6 | Ch 3, 5 (decisions + repetition) |
| M3 — Organizing code | 7, 8, 9 | Ch 4, 6, 7, 8, 9 (functions + data structures) |
| M4 — Building | 10, 11, 12 | Reuse, debugging, and the py4e capstone idea |

## Prerequisite DAG (already seeded)

The 12 ConceptNodes form a strict chain (each concept's lesson builds on the
previous): what-is-a-program → variables-and-types → input-output-operators →
conditionals → loops → logic-debugging-basics → functions → lists-dictionaries
→ strings-files → decomposition → testing-debugging → mini-project. This is
linear and deliberately mirrors how PY4E builds. It's a chain rather than a
branching tree because each lesson genuinely needs the one before it.

## How each lesson is authored

Every lesson follows the same format, so a student gets a consistent learning
ritual: **learning outcomes → prerequisites → big idea → concept explanation
(why before how) → worked examples with runnable code and its exact output →
common mistakes (callout) → 3 inline check questions → 8 MCQs with
explanations → summary & next.**

Every code example is executed against Python 3.11 and the output shown is the
**actual** output, verified by `tests/lesson-python.test.mjs` (never typed from
memory). This is the single most important discipline: a student who copies the
example gets exactly what the lesson says they will.

## Status

**COMPLETE — all 12 lessons authored** (commits 3e51fb6 → final, branch
`agent-3/content-1`). `tests/lesson-python.test.mjs` has **78 passing
cases**, one per worked example and per MCQ claim, all run against real
Python 3.11. `tsc` 0 errors, `next lint` clean.

| Lesson | Status | PY4E chapter |
|---|---|---|
| 1 What a program is | ✅ authored | 1 |
| 2 Variables & types | ✅ authored | 2 |
| 3 Input, output & operators | ✅ authored | 2 |
| 4 Conditions | ✅ authored | 3 |
| 5 Loops | ✅ authored | 5 |
| 6 Logic & debugging basics | ✅ authored | 1 (debugging) |
| 7 Functions | ✅ authored | 4 |
| 8 Lists & dictionaries | ✅ authored | 8, 9 |
| 9 Strings & files | ✅ authored | 6, 7 |
| 10 Decomposition | ✅ authored | 4 (reuse) |
| 11 Testing & debugging | ✅ authored | 1 (debugging) |
| 12 Mini project | ✅ authored | 1, 10 (capstone) |

Every lesson ships with `reviewStatus: "needs-human-review"` — none are
marked verified by the seeder. A human sign-off is the remaining step before
they are trusted as final.


## Governance

- Every row is `reviewStatus: "needs-human-review"`.
- The seeding script never marks anything `verified`.
- `needsCheck: true` marks anything the author was not certain of.
- This curriculum alignment document is the audit trail for "what are we
  actually teaching and why".
