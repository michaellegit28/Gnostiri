#!/usr/bin/env python3
"""Orchestrator CLI - Agent Coordination"""
import subprocess
import sys
import os

AGENTS = {
    "agent2": "/root/.opencode/sandbox/agent2-pq-integrator/src",
    "agent3": "/root/.opencode/sandbox/agent3-pq-assistant/src",
    "agent4": "/root/.opencode/sandbox/agent4-uni-courses-builder/src"
}

def run_agent(name, args):
    if name not in AGENTS:
        print(f"Unknown agent: {name}")
        return 1
    
    os.chdir(AGENTS[name])
    cmd = ["python", "main.py"] + args
    result = subprocess.run(cmd, capture_output=True, text=True)
    print(result.stdout)
    if result.stderr:
        print(result.stderr, file=sys.stderr)
    return result.returncode

def main():
    if len(sys.argv) < 2:
        print("Orchestrator CLI")
        print("Usage: orchestrator <agent2|agent3|agent4> [args...]")
        return 1
    
    return run_agent(sys.argv[1], sys.argv[2:])

if __name__ == "__main__":
    sys.exit(main())