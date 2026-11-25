"""Tests covering all edge cases across engine modules to reach 100% test coverage."""
import importlib
import os
from pathlib import Path
import sys
from unittest.mock import patch
import pytest

import api.analyze
from engine.matchers.base import Matcher
from engine.matchers.deterministic import DeterministicMatcher
from engine.pipeline import analyze, _dedupe
from engine.report import build_report, flag_to_dict
from engine.rules import available_jurisdictions, load_rules, _parse_rule
from engine.scope import (
    assess_scope,
    detect_jurisdiction,
    label_for,
    legal_aid_pointer,
    _join,
    _match_jurisdiction,
    _notice,
)
from engine.segment import segment_spans, _split
from engine.types import Citation, Flag, Rule, Severity, TextSpan

FIXTURE_PDF = Path(__file__).parent / "fixtures" / "sample-ct-lease.pdf"
_CITE = [Citation(label="Statute", url="https://example.com")]


def test_api_analyze_root_not_in_sys_path() -> None:
    root = os.path.dirname(os.path.dirname(os.path.abspath(api.analyze.__file__)))
    mock_sys_path = [p for p in sys.path if p != root]
    with patch.object(sys, "path", mock_sys_path):
        assert root not in sys.path
        importlib.reload(api.analyze)
        assert root in sys.path


def test_base_matcher_not_implemented() -> None:
    with pytest.raises(NotImplementedError):
        Matcher.match(None, [], [])  # type: ignore


def test_pipeline_analyze_direct() -> None:
    flags = analyze(FIXTURE_PDF, "ct")
    assert len(flags) > 0


def test_pipeline_dedupe() -> None:
    rule1 = Rule("r1", "US-CT", "Rule 1", Severity.ILLEGAL, "desc", _CITE)
    flag1 = Flag(rule1, "text1", None, 1.0, "deterministic")
    flag2 = Flag(rule1, "text2", None, 1.0, "deterministic")
    assert len(_dedupe([flag1, flag2])) == 1


def test_flag_to_dict_none_span() -> None:
    rule = Rule("r1", "US-CT", "Rule 1", Severity.ILLEGAL, "desc", _CITE)
    flag = Flag(rule, "matched text", None, 1.0, "deterministic")
    d = flag_to_dict(flag)
    assert d["page"] is None
    assert d["rule_id"] == "r1"


def test_build_report_needs_ocr_branch(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(
        "engine.report.extract_best",
        lambda _path: ([TextSpan(page=1, start=0, end=5, text="Short")], "none"),
    )
    rep = build_report("dummy.pdf", "ct")
    assert rep["ok"] is True
    assert rep["meta"]["needs_ocr"] is True
    assert rep["flags"] == []
    assert rep["scope"] is None


def test_build_report_jurisdiction_none(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(
        "engine.report.extract_best",
        lambda _path: (
            [
                TextSpan(
                    page=1,
                    start=0,
                    end=100,
                    text="RESIDENTIAL LEASE in Middletown, CT 06457 governed by Conn. Gen. Stat. 47a.",
                )
            ],
            "digital",
        ),
    )
    rep = build_report("dummy.pdf", jurisdiction=None)  # type: ignore
    assert rep["ok"] is True
    assert rep["jurisdiction"] == "ct"


def test_rules_available_jurisdictions_invalid_dir() -> None:
    assert available_jurisdictions(Path("/nonexistent/rules/dir")) == []


def test_rules_load_rules_nonexistent() -> None:
    assert load_rules("nonexistent_state") == []


def test_parse_rule_without_citations() -> None:
    raw = {
        "id": "bad-rule",
        "jurisdiction": "US-CT",
        "title": "Bad Rule",
        "severity": "illegal",
        "description": "No citations",
        "citations": [],
    }
    with pytest.raises(ValueError, match="has no citations — not shippable"):
        _parse_rule(raw)


def test_scope_label_for_unknown() -> None:
    assert label_for("xyz") == "XYZ"


def test_scope_legal_aid_pointer_unknown() -> None:
    assert legal_aid_pointer("xyz") == "a tenant attorney or legal-aid clinic"


def test_scope_join_helper() -> None:
    assert _join([]) == ""
    assert _join(["one"]) == "one"
    assert _join(["one", "two"]) == "one, and two"
    assert _join(["one", "two", "three"]) == "one, two, and three"


def test_scope_notice_coverage_cases() -> None:
    # covered
    h, b = _notice("covered", "Connecticut", "Connecticut", True, [])
    assert h == "" and b == ""

    # out_of_jurisdiction without detected_label, without reasons, with ruleset_available
    h, b = _notice("out_of_jurisdiction", "Connecticut", None, True, [])
    assert "another state" in h
    assert "We don’t have a ruleset" not in b

    # out_of_jurisdiction with reasons and without ruleset_available
    h, b = _notice("out_of_jurisdiction", "Connecticut", "Ohio", False, ["reason one"])
    assert "Ohio" in h
    assert "We don’t have a ruleset" in b
    assert "reason one" in b

    # possibly_exempt with non-CT state
    h, b = _notice("possibly_exempt", "Massachusetts", "Massachusetts", True, ["reason one"])
    assert "university / institutional" in h
    assert "Many states carve" in b
    assert "Conn. Gen. Stat." not in b

    # unconfirmed
    h, b = _notice("unconfirmed", "Connecticut", None, False, [])
    assert "couldn’t confirm" in h


def test_scope_detect_and_match_below_threshold() -> None:
    # Incidental single mention of a state name gets score 1 (< _DETECT_MIN of 2)
    assert detect_jurisdiction("This was signed in Alaska.") is None
    match, detected = _match_jurisdiction("This was signed in Alaska.", "CT")
    assert match == "unconfirmed"
    assert detected is None


def test_segment_split_edge_cases() -> None:
    # Text with part length < 3
    spans = [TextSpan(page=1, start=0, end=10, text="1.\n\n2.")]
    # Both "1." and "2." are 2 chars, so chunk < 3 is skipped
    clauses = segment_spans(spans)
    assert len(clauses) == 0

    # Test _split with empty parts
    parts = list(_split("\n\n\n\n"))
    assert len(parts) == 0


def test_segment_split_find_fallback() -> None:
    class MockCustomStr(str):
        def find(self, sub: str, start: int = 0, end: int | None = None) -> int:
            return -1

    custom_text = MockCustomStr("Some text clause.")
    chunks = list(_split(custom_text))
    assert len(chunks) == 1
    assert chunks[0] == ("Some text clause.", 0)


def test_deterministic_matcher_long_clause_and_repeating_keyword() -> None:
    long_clause = "This is a very long clause that repeats " + ("word " * 60) + "non-refundable deposit at the end."
    rule = Rule(
        id="long-kw",
        jurisdiction="US-CT",
        title="Non-refundable deposit",
        severity=Severity.ILLEGAL,
        description="desc",
        citations=_CITE,
        keywords=["non-refundable deposit"],
    )
    span = TextSpan(page=1, start=0, end=len(long_clause), text=long_clause)
    flags = DeterministicMatcher().match([span], [rule])
    assert len(flags) == 1
    # When clause is longer than 280 chars, matched_text should be the keyword hit itself rather than the entire clause
    assert flags[0].matched_text == "non-refundable deposit"

    # Test negated first keyword occurrence followed by non-negated second keyword occurrence
    multi_kw_text = "The deposit is NOT non-refundable deposit. However this other fee is a non-refundable deposit."
    span2 = TextSpan(page=1, start=0, end=len(multi_kw_text), text=multi_kw_text)
    flags2 = DeterministicMatcher().match([span2], [rule])
    assert len(flags2) == 1
