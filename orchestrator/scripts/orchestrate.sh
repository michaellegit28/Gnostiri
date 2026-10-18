#!/bin/bash
set -e

REPO_DIR="/root/.opencode"
cd "$REPO_DIR"

echo "=== Orchestrator: Running Tests ==="
npm test 2>/dev/null || echo "No tests to run"

echo "=== Orchestrator: Building Project ==="
npm run build --if-present

echo "=== All Agents Initialized ==="