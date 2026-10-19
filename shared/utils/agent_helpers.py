"""Shared utilities for all agents"""

class AgentError(Exception):
    pass

def validate_path(path):
    """Ensure path is within sandbox"""
    import os
    sandbox_dirs = [
        "sandbox/agent2-pq-integrator",
        "sandbox/agent3-pq-assistant", 
        "sandbox/agent4-uni-courses-builder"
    ]
    abs_path = os.path.abspath(path)
    for sandbox_dir in sandbox_dirs:
        if abs_path.startswith(os.path.abspath(sandbox_dir)):
            return True
    return False