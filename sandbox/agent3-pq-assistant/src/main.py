#!/usr/bin/env python3
"""Agent 3: PQ Assistant - Question Preparation Helper & Copyright Attestations"""
import sys
import json
from pathlib import Path

COPYRIGHT_DIR = Path(__file__).resolve().parent.parent / "copyright"


def prepare_question(text, subject, exam):
    """Format question for student review"""
    return f"[{exam}] {subject}: {text}"


def _load_json(filename):
    with open(COPYRIGHT_DIR / filename) as f:
        return json.load(f)


def get_board_attestation(board_id):
    """Return copyright attestation for an official-past-question board, or None."""
    data = _load_json("attestations.json")
    return data.get("boards", {}).get(board_id)


def get_region_legal_tag(region):
    """Return region-legal tag metadata, or the default unevaluated tag."""
    data = _load_json("region-legal-tags.json")
    return data.get("tags", {}).get(region, data.get("defaultTag", {}))


def is_official_track(region):
    """True if the region is cleared for the `official` provenance track."""
    tag = get_region_legal_tag(region)
    return bool(tag.get("officialTrack", False))


def exclusion_reason(board_id):
    """Reason a board is excluded from the official track, if any."""
    data = _load_json("attestations.json")
    for item in data.get("excludedFromOfficialTrack", []):
        if board_id.lower() in item.get("board", "").lower() or board_id.lower() in item.get("reason", "").lower():
            return item
    return None


def format_attestation(board_id):
    """Human-readable attestation summary for a board."""
    att = get_board_attestation(board_id)
    if not att:
        exc = exclusion_reason(board_id)
        if exc:
            return f"EXCLUDED — {exc['board']} ({exc['country']}): {exc['reason']}\nRecommended: {exc['recommendedTrack']}"
        return f"No attestation on file for board: {board_id}"
    lines = [
        f"{att['board']} — {att['country']} (region: {att['region']})",
        f"Authority: {att['authority']} | provenance: {att['provenance']} | publication: {att['publicationStatus']}",
        f"Copyright basis: {att['copyrightBasis']}",
        f"Risk tier: {att['riskTier']} | attribution required: {att['attributionRequired']}",
        f"Source URLs: {', '.join(att['sourceUrls'])}",
        f"Attestation: {att['attestationText']}",
        f"Notes: {att['notes']}",
    ]
    return "\n".join(lines)


def main():
    args = sys.argv[1:]
    if len(args) >= 1 and args[0] == "--attestation" and len(args) >= 2:
        print(format_attestation(args[1]))
        return

    if len(args) < 3:
        print("Usage: python src/main.py <question_text> <subject> <exam>")
        print("       python src/main.py --attestation <board_id>")
        sys.exit(1)

    result = prepare_question(args[0], args[1], args[2])
    print(result)


if __name__ == "__main__":
    main()
