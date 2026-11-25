"""End-to-end: extract a lease, run the ruleset through a matcher, return flags."""
from __future__ import annotations

from pathlib import Path

from .extract import extract_text
from .matchers.base import Matcher
from .matchers.deterministic import DeterministicMatcher
from .rules import load_rules
from .segment import segment_spans
from .types import Flag, TextSpan


def analyze(
    pdf_path: str | Path,
    jurisdiction: str = "ct",
    matcher: Matcher | None = None,
) -> list[Flag]:
    """Analyze a lease PDF (digital extraction); return de-duplicated flags."""
    return analyze_spans(extract_text(pdf_path), jurisdiction, matcher)


def analyze_spans(
    spans: list[TextSpan],
    jurisdiction: str = "ct",
    matcher: Matcher | None = None,
) -> list[Flag]:
    """Run the ruleset over already-extracted spans (digital or OCR'd).

    Spans are segmented into clauses first (see engine/segment.py) so matches are
    judged inside the clause they appear in. De-duplicated: one flag per rule,
    first hit wins.
    """
    rules = load_rules(jurisdiction)
    matcher = matcher or DeterministicMatcher()
    return _dedupe(matcher.match(segment_spans(spans), rules))


def _dedupe(flags: list[Flag]) -> list[Flag]:
    seen: set[str] = set()
    out: list[Flag] = []
    for f in flags:
        if f.rule.id not in seen:
            seen.add(f.rule.id)
            out.append(f)
    return out
