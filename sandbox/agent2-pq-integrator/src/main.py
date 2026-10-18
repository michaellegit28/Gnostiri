#!/usr/bin/env python3
"""Agent 2: PQ Integrator - Past Question Processor (Dual-Version Hybrid Model)

Dual-version rules:
- Version A (official, track ZA/TZ): real, unedited past-question text.
  Reserved for South Africa (NSC) and Tanzania (NECTA) only.
- Version B (cloned variant, track global): fully rewritten wording + re-seeded
  numbers; same coreId, same concept/structure/difficulty so the shuffle loop
  holds. Used by all other tracks (JAMB, WAEC, US, UK, ...).

Both versions share one coreId so they are treated as one logical question
with two skins.

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
OFFICIAL_TRACKS = {"ZA", "TZ"}


def repo_root() -> Path:
    """Resolve the repository root from this file's location."""
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


def is_official_track(q: dict) -> bool:
    track = q.get("track", [])
    return any(t in OFFICIAL_TRACKS for t in track)


def variant_for(q: dict) -> str:
    """Return 'A' (official) or 'B' (cloned variant)."""
    if q.get("provenance") == "official" and is_official_track(q):
        return "A"
    return "B"


def process_question(q: dict) -> dict:
    valid, msg = validate_question(q)
    if not valid:
        return {**q, "_valid": False, "_error": msg}

    variant = variant_for(q)
    processed: Dict[str, Any] = {
        **q,
        "_valid": True,
        "variant": variant,
        "version": "Official Past Questions" if variant == "A" else "Cloned Variant",
    }

    if variant == "A":
        processed["region"] = "za-tz"
        processed["attribution"] = q.get(
            "attribution",
            "Official past question — reproduced for educational practice.",
        )
    else:
        processed["region"] = "global"

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
        "total": len(results),
        "valid": sum(1 for r in results if r.get("_valid")),
        "by_variant": {
            "A": sum(1 for r in results if r.get("variant") == "A"),
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
