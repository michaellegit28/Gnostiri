# Orchestrator - Agent 1

## Role
Workflow management, CI/CD coordination, and build monitoring.

## Scripts
- `scripts/orchestrator.py` - Main CLI for agent coordination
- `scripts/orchestrate.sh` - Build and test runner
- `scripts/commit-and-push.sh` - Secure commit and push for agents

## Usage
```bash
python orchestrator/scripts/orchestrator.py <agent> [args]
```

## Security
- Agents cannot modify each other's work trees
- Environment isolation enforced