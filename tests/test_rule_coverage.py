"""Coverage tests against synthetic lease fixtures (owned by us; no PII or copyright).

Runs per jurisdiction (every folder under rules/):
- kitchen-sink: every rule for that state must fire (one planted clause each) -> a
  coverage guard, so adding a rule without a positive example fails the suite.
- clean: a legal lease must fire nothing (guards against false positives), and is
  checked against every state's ruleset (a clean lease is clean everywhere).

Fixture resolution prefers a per-state file ({juris}-kitchen-sink-lease.txt /
{juris}-clean-lease.txt) and falls back to the shared CT-era names.
"""
from pathlib import Path

import pytest

from engine.matchers.deterministic import DeterministicMatcher
from engine.rules import available_jurisdictions, load_rules
from engine.types import TextSpan

SYN = Path(__file__).resolve().parent / "fixtures" / "synthetic"
JURISDICTIONS = available_jurisdictions()


def _fixture(juris: str, kind: str) -> Path:
    """kind is 'kitchen-sink' or 'clean'. Prefer {juris}-…, else the shared file."""
    specific = SYN / f"{juris}-{kind}-lease.txt"
    return specific if specific.exists() else SYN / f"{kind}-lease.txt"


def _fired_ids(juris: str, text: str) -> set[str]:
    rules = load_rules(juris)
    spans = [TextSpan(page=1, start=0, end=len(text), text=text)]
    return {f.rule.id for f in DeterministicMatcher().match(spans, rules)}


@pytest.mark.parametrize("juris", JURISDICTIONS)
def test_kitchen_sink_triggers_every_rule(juris: str) -> None:
    fixture = _fixture(juris, "kitchen-sink")
    assert fixture.exists(), f"no kitchen-sink fixture for jurisdiction {juris!r}"
    text = fixture.read_text(encoding="utf-8")
    expected = {r.id for r in load_rules(juris)}
    missing = expected - _fired_ids(juris, text)
    assert not missing, f"[{juris}] kitchen-sink lease failed to trigger: {sorted(missing)}"


@pytest.mark.parametrize("juris", JURISDICTIONS)
def test_clean_lease_triggers_nothing(juris: str) -> None:
    text = _fixture(juris, "clean").read_text(encoding="utf-8")
    fired = _fired_ids(juris, text)
    assert fired == set(), f"[{juris}] clean lease false-positived on: {sorted(fired)}"
