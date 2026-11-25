"""Load the curated ruleset from rules/<jurisdiction>/*.json."""
from __future__ import annotations

import json
from pathlib import Path

from .types import Citation, Rule, Severity

# rules/ lives at the repo root, one level up from engine/.
DEFAULT_RULES_DIR = Path(__file__).resolve().parent.parent / "rules"


def available_jurisdictions(rules_dir: Path | None = None) -> list[str]:
    """The jurisdictions we can actually analyze — one folder per ruleset under rules/.

    A folder counts only if it holds at least one *.json ruleset (so an empty
    scaffold dir doesn't claim coverage). Sorted for stable ordering in the UI
    picker / API validation. This is the single source of truth for "which states
    do we cover," reused by scope routing and api/analyze.
    """
    base = rules_dir or DEFAULT_RULES_DIR
    if not base.is_dir():
        return []
    return sorted(
        d.name
        for d in base.iterdir()
        if d.is_dir() and any(d.glob("*.json"))
    )


def load_rules(jurisdiction: str = "ct", rules_dir: Path | None = None) -> list[Rule]:
    """Load every rule for a jurisdiction (a folder name under rules/).

    A jurisdiction with no folder (or no rules) loads to an empty list rather than
    raising — routing to a not-yet-covered state yields zero flags, and the scope
    signal explains why (see engine/scope.py).
    """
    base = (rules_dir or DEFAULT_RULES_DIR) / jurisdiction
    rules: list[Rule] = []
    for path in sorted(base.glob("*.json")):
        data = json.loads(path.read_text(encoding="utf-8"))
        for raw in data.get("rules", []):
            rules.append(_parse_rule(raw))
    return rules


def _parse_rule(raw: dict) -> Rule:
    citations = [Citation(**c) for c in raw.get("citations", [])]
    if not citations:
        # Enforce the grounding rule in code: a rule with no primary source is
        # not shippable. See rules/README.md.
        raise ValueError(f"rule {raw.get('id')!r} has no citations — not shippable")
    return Rule(
        id=raw["id"],
        jurisdiction=raw["jurisdiction"],
        title=raw["title"],
        severity=Severity(raw["severity"]),
        description=raw["description"],
        citations=citations,
        tenant_explainer=raw.get("tenant_explainer", ""),
        patterns=raw.get("patterns", []),
        keywords=raw.get("keywords", []),
        status=raw.get("status", "draft-unverified"),
    )
