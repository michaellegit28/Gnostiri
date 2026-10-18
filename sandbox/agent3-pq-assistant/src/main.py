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


def get_board_decision(board_id):
    """Return the integrate/exclude decision for a board from the copyright manifest."""
    data = _load_json("board-copyright-manifest.json")
    decisions = data.get("integrationDecisions", {})
    return decisions.get(board_id, data.get("defaultDecision", {}))


def get_syllabus_gate(board_id):
    """Return syllabus gate (allowed topic slugs) for a board."""
    data = _load_json("syllabus-gate.json")
    return data.get("gates", {}).get(board_id, data.get("defaultGate", {}))


def should_integrate(board_id):
    """True if the board is cleared to integrate content onto the platform."""
    decision = get_board_decision(board_id)
    return decision.get("action") in ("INTEGRATE_OFFICIAL", "INTEGRATE_ORIGINAL_ONLY")


def is_verbatim_allowed(board_id):
    """True if verbatim past-question text may be used for this board."""
    decision = get_board_decision(board_id)
    return bool(decision.get("verbatimAllowed", False))


def get_attribution(board_id):
    """Return the mandatory attribution line for a board, or None."""
    decision = get_board_decision(board_id)
    return decision.get("attribution")


def get_disclaimer(board_id):
    """Return the disclaimer text for an original-style board, or None."""
    decision = get_board_decision(board_id)
    if decision.get("displayDisclaimer"):
        return decision.get("disclaimerText")
    return None


def get_cross_prep_notice(board_id):
    """Return the cross-board prep notice for an excluded board, or None."""
    decision = get_board_decision(board_id)
    return decision.get("crossPrepNotice")


def can_show_official_badge(board_id, region):
    """True if the Official badge may render for this board on this region."""
    decision = get_board_decision(board_id)
    if not decision.get("displayBadge"):
        return False
    tracks = decision.get("tracks", [])
    return region in tracks


def format_board_decision(board_id):
    """Human-readable integration decision summary for a board."""
    d = get_board_decision(board_id)
    lines = [
        f"{d.get('board', board_id)} — {d.get('country', '')} (region: {d.get('region', '')})",
        f"Action: {d.get('action', 'UNKNOWN')} | provenance: {d.get('provenance', 'none')} | variant: {d.get('variant', 'none')}",
        f"Tracks: {', '.join(d.get('tracks', [])) or 'none'}",
        f"Verbatim allowed: {d.get('verbatimAllowed', False)} | risk tier: {d.get('riskTier', 'unevaluated')}",
        f"Condition: {d.get('condition', 'none')}",
    ]
    if d.get("disclaimerText"):
        lines.append(f"Disclaimer: {d['disclaimerText']}")
    if d.get("crossPrepNotice"):
        lines.append(f"Cross-prep: {d['crossPrepNotice']}")
    return "\n".join(lines)


def main():
    args = sys.argv[1:]
    if len(args) >= 1 and args[0] == "--attestation" and len(args) >= 2:
        print(format_attestation(args[1]))
        return

    if len(args) >= 1 and args[0] == "--decision" and len(args) >= 2:
        print(format_board_decision(args[1]))
        return

    if len(args) < 3:
        print("Usage: python src/main.py <question_text> <subject> <exam>")
        print("       python src/main.py --attestation <board_id>")
        print("       python src/main.py --decision <board_id>")
        sys.exit(1)

    result = prepare_question(args[0], args[1], args[2])
    print(result)


if __name__ == "__main__":
    main()
