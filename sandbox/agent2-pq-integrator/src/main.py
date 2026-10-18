#!/usr/bin/env python3
"""Agent 2: PQ Integrator - Past Question Processor (Cloned-Variant Model)

All exam boards — including South Africa (NSC) and Tanzania (NECTA) — receive
cloned-variant questions only: fully rewritten wording, re-seeded numbers and
locale, same coreId / concept / structure / difficulty so the global shuffle
loop stays synchronized.

No board receives verbatim official past-question text (open publication ≠
republication licence; verbatim NSC/NECTA use requires written board permission,
which Agent 3 gates).

Invoked via:
  python orchestrator/scripts/orchestrator.py agent2 <json_file>
  # or directly:
  npm run agent:agent2 -- <json_file>
"""
import json
import sys
import os
from pathlib import Path
from typing import Any, Dict, List, Tuple

REQUIRED_FIELDS = ["id", "coreId", "questionText", "options", "correctAnswer"]


def repo_root() -> Path:
    return Path(__file__).resolve().parents[3]


def load_schema() -> dict:
    schema_path = repo_root() / "shared" / "schemas" / "past-question.schema.json"
    with open(schema_path) as f:
        return json.load(f)


def validate_question(q: dict) -> Tuple[bool, str]:
    for field in REQUIRED_FIELDS:
        if field not in q:
            return False, f"Missing field: {field}"
    return True, "Valid"


def process_question(q: dict) -> dict:
    valid, msg = validate_question(q)
    if not valid:
        return {**q, "_valid": False, "_error": msg}

    # Every board is global / cloned variant. No official past-question text.
    processed: Dict[str, Any] = {
        **q,
        "_valid": True,
        "variant": "B",
        "version": "Cloned Variant",
        "region": "global",
        "track": q.get("track", ["global"]),
    }

    return processed


def process_file(filepath: str) -> dict:
    with open(filepath) as f:
        data = json.load(f)

    if not isinstance(data, list):
        data = [data]

    results = [process_question(q) for q in data]

    by_core: Dict[str, List[dict]] = {}
    for r in results:
        cid = r.get("coreId", "unknown")
        by_core.setdefault(cid, []).append(r)

    return {
        "file": filepath,
        "schema": str(repo_root() / "shared" / "schemas" / "past-question.schema.json"),
        "model": "cloned-variant",
        "total": len(results),
        "valid": sum(1 for r in results if r.get("_valid")),
        "by_variant": {
            "B": sum(1 for r in results if r.get("variant") == "B"),
        },
        "questions": results,
        "core_bindings": {cid: len(qs) for cid, qs in by_core.items()},
    }


def main():
    if len(sys.argv) < 2:
        print("Usage: python src/main.py <json_file>")
        print("  json_file: path to a past-question JSON file to validate & version")
        print("")
        print("Also available via orchestrator:")
        print("  python orchestrator/scripts/orchestrator.py agent2 <json_file>")
        sys.exit(1)

    filepath = sys.argv[1]
    if not os.path.exists(filepath):
        print(f"Error: file not found: {filepath}")
        sys.exit(1)

    result = process_file(filepath)
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
