# Gnostiri - Exam Prep Platform

## Architecture

### Agents (Sandbox Isolation)
- **Agent 1**: Orchestrator - Workflow management, CI/CD, monitoring
- **Agent 2**: PQ Integrator - Past Question processor and validator
- **Agent 3**: PQ Assistant - Question preparation helper  
- **Agent 4**: University Courses Builder - Curriculum structure generator

### Isolated Work Trees
Each agent has its own sandboxed environment:
- `sandbox/agent2-pq-integrator/`
- `sandbox/agent3-pq-assistant/`
- `sandbox/agent4-uni-courses-builder/`

### Shared Resources (Read-only for agents)
- `shared/schemas/` - JSON schemas for question validation
- `shared/utils/` - Common helper functions
- `shared/models/` - Database models

## Usage

### Running Agents
```bash
# Agent 2 - Validate PQ JSON
npm run agent:agent2 -- content/questions/example.json

# Agent 3 - Format question for student
npm run agent:agent3 -- "Question text" "Subject" "Exam"

# Agent 4 - Generate course outline
npm run agent:agent4 -- "Course Name" "lesson1, lesson2, lesson3"

# Orchestrate all
npm run agent:orchestrate
```

### Development
```bash
npm run dev      # Start dev server
npm run build    # Build production
npm run lint     # Lint code
```

## Security

- Agents cannot modify each other's work trees
- `.env` files are gitignored
- CI/CD requires GitHub token for commits

## Adding Agents

1. Create sandbox directory: `sandbox/agent-new/`
2. Add Dockerfile, requirements.txt, src/main.py
3. Add to package.json scripts
4. Add to orchestrator.py AGENTS dict