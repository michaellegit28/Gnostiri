#!/usr/bin/env python3
"""Migrate Gnostiri files to sandbox agents"""
import os
import shutil

REPO = "/root/.opencode"

def setup_agents():
    """Copy relevant files from Gnostiri to agents"""
    content_dir = f"{REPO}/content"
    tools_pq = f"{content_dir}/questions"
    
    # Copy PQ samples to agent2
    agent2_src = f"{REPO}/sandbox/agent2-pq-integrator/src"
    
    print("Setting up agents with sample data...")
    print(f"PQ samples location: {tools_pq}")
    
    # Check if content exists
    if os.path.exists(tools_pq):
        for f in os.listdir(tools_pq):
            if f.endswith('.json'):
                src = f"{tools_pq}/{f}"
                print(f"Found: {f}")

if __name__ == "__main__":
    setup_agents()