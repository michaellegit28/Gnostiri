# Work Division — High School PQ Integrator

All agents are Nemotron 3.5 Super VL 120b. Work is split by domain to avoid merge conflicts and duplicated effort.

## Agent Roster & Sandbox Ownership

| Agent | Role | Sandbox (owns) | Entry point (orchestrator) |
|---|---|---|---|
| Agent 1 | Orchestrator / Release Manager | `orchestrator/` | `orchestrator/scripts/orchestrator.py` |
| Agent 2 | PQ Integrator / Past Question Processor | `sandbox/agent2-pq-integrator/` | `agent2` → `src/main.py` |
| Agent 3 | Question Helper / Formatter | `sandbox/agent3-pq-assistant/` | `agent3` → `src/main.py` |
| Agent 4 | Curriculum Builder | `sandbox/agent4-uni-courses-builder/` | `agent4` → `src/main.py` |

All agents share: `shared/schemas/`, `shared/models/`, `shared/utils/`.

## Shared Contracts (do not break)

**Past-question schema** (`shared/schemas/past-question.schema.json`):
Required fields: `id`, `coreId`, `questionText`, `options`, `correctAnswer`.
Optional but used: `provenance` ("original"), `variant` ("B"), `track` (array, e.g. ["global"]), `difficulty`, `sourceExam`, `attribution`, `reviewStatus`.

**Cloned-variant model** (Agent 2 owns):
- Every board — including South Africa (NSC) and Tanzania (NECTA) — receives cloned-variant questions only.
- Fully rewritten wording + re-seeded numbers + locale; same `coreId`, same concept/structure/difficulty so the shuffle loop holds.
- `provenance: "original"`, `variant: "B"`, `track: ["global"]`, `tag: "Cloned Variant"`.
- NO board receives verbatim official past-question text (open publication ≠ republication licence).

**Invariant:** `coreId` must be identical across boards for the same logical question so analytics and shuffle sync work.

## CLI Usage

```bash
# Agent 2 — validate + version a PQ JSON file (cloned-variant model)
npm run agent:agent2 -- content/questions/nsc-official.batch1.json
# or via orchestrator
python orchestrator/scripts/orchestrator.py agent2 <json_file>

# Agent 3 — format a question
npm run agent:agent3 -- "text" "subject" "exam"

# Agent 4 — generate a course
npm run agent:agent4 -- "Course" "lesson1,lesson2"

# Full orchestrate
npm run agent:orchestrate
```

## Node question bank (src/)

`src/boards.js` — 22 exam boards, all region "global".
`src/questions.js` — cloned-variant question bank, each with `coreId`, `text`, `answer`.
`src/integrator.js` — `generateBoardSet(boardId, options)` returns cloned variants for any board.
`src/index.js` — CLI: `boards`, `subjects`, `questions <board> [count]`, `variant <questionId>`, `all [count]`.

## Commit Rules

- No agent pushes directly to `main`. Agent 1 (Orchestrator) is the only one who merges to `main` and tags releases.
- Each agent works on its own branch inside its sandbox.
- Commit message format: `[agent-N] <scope>: <description>`
- Use `orchestrator/scripts/commit-and-push.sh <agent_name> <message>` to commit+push an agent's sandbox.

## Boundaries

- **Agent 2 only:** `sandbox/agent2-pq-integrator/src/main.py` (PQ validation, cloned-variant logic, core binding) + `src/{boards,questions,integrator,index}.js` (Node question bank & CLI).
- **Agent 3 only:** `sandbox/agent3-pq-assistant/src/main.py` (question formatting/normalisation) + copyright gate (no verbatim official text anywhere).
- **Agent 4 only:** `sandbox/agent4-uni-courses-builder/src/main.py` (course/lesson generation).
- **Agent 1 only:** `orchestrator/` scripts, CI/CD, `main` merges, releases.
- **Shared (read-only per-agent unless coordinating):** `shared/schemas/`, `shared/models/`, `shared/utils/`, `content/`.
