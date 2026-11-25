"""Smoke tests for the deterministic matcher.

These exercise matcher logic directly (no PDF, no pdfplumber needed), so they run
fast and prove the swappable seam works end to end.
"""
from engine.matchers.deterministic import DeterministicMatcher
from engine.types import Citation, Rule, Severity, TextSpan

_CITE = [Citation(label="placeholder", url="https://example.com")]


def _span(text: str) -> TextSpan:
    return TextSpan(page=1, start=0, end=len(text), text=text)


def test_pattern_fires() -> None:
    rule = Rule(
        id="ct-test-001",
        jurisdiction="US-CT",
        title="Tenant responsible for all repairs",
        severity=Severity.ILLEGAL,
        description="Shifts the landlord's repair duty onto the tenant.",
        citations=_CITE,
        patterns=[r"tenant\s+(?:is\s+)?responsible\s+for\s+all\s+repairs"],
    )
    spans = [_span("The Tenant is responsible for all repairs to the premises.")]
    flags = DeterministicMatcher().match(spans, [rule])
    assert len(flags) == 1
    assert flags[0].rule.id == "ct-test-001"
    assert flags[0].matcher == "deterministic"
    assert flags[0].confidence == 1.0


def test_keyword_fires() -> None:
    rule = Rule(
        id="ct-test-002",
        jurisdiction="US-CT",
        title="Non-refundable deposit",
        severity=Severity.ILLEGAL,
        description="A deposit cannot be made non-refundable.",
        citations=_CITE,
        keywords=["non-refundable deposit"],
    )
    spans = [_span("This is a non-refundable deposit of $500.")]
    assert len(DeterministicMatcher().match(spans, [rule])) == 1


def test_no_false_positive() -> None:
    rule = Rule(
        id="ct-test-003",
        jurisdiction="US-CT",
        title="Non-refundable deposit",
        severity=Severity.ILLEGAL,
        description="",
        citations=_CITE,
        patterns=[r"non-?refundable\s+deposit"],
    )
    spans = [_span("The security deposit is fully refundable at move-out.")]
    assert DeterministicMatcher().match(spans, [rule]) == []
