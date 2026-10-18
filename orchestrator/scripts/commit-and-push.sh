#!/bin/bash
# Commit and push for all agents - prevents cross-contamination
# Usage: ./commit.sh <agent_name> <commit_message>

set -e

if [ $# -lt 2 ]; then
    echo "Usage: $0 <agent_name> <commit_message>"
    echo "Agents: agent2, agent3, agent4, orchestrator"
    exit 1
fi

AGENT=$1
MSG=$2

case $AGENT in
    agent2) DIR="sandbox/agent2-pq-integrator" ;;
    agent3) DIR="sandbox/agent3-pq-assistant" ;;
    agent4) DIR="sandbox/agent4-uni-courses-builder" ;;
    orchestrator) DIR="orchestrator" ;;
    *) echo "Unknown agent: $AGENT"; exit 1 ;;
esac

echo "Committing to $AGENT at $(date)"
cd "$DIR"
git add .
git commit -m "$MSG"
git push origin main
echo "Done."