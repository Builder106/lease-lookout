"""Integration regression test over the seeded sample lease.

Runs the full pipeline (extract -> match -> report) against a fixture PDF that
deliberately contains one clause per rule below. A ruleset edit or extraction
change that stops any of these from firing fails here. Uses the fixture PDF, so
pdfplumber is required (the digital-PDF path; no OCR).

Regenerate the PDF from its HTML source with headless Chrome:
    chrome --headless --print-to-pdf=sample-ct-lease.pdf sample-ct-lease.html
"""
from pathlib import Path

from engine.report import build_report

_FIXTURE = Path(__file__).parent / "fixtures" / "sample-ct-lease.pdf"

# Clause seeded in the sample lease -> the rule it must trip, and at what severity.
EXPECTED = {
    "ct-prohibited-001": "illegal",       # waiver of the tenant's rights
    "ct-prohibited-002": "illegal",       # confession of judgment
    "ct-prohibited-003": "illegal",       # hold-harmless / landlord exculpation
    "ct-prohibited-005": "illegal",       # self-help eviction
    "ct-entry-001": "illegal",            # entry without notice / at any time
    "ct-repairs-001": "illegal",          # tenant responsible for all repairs
    "ct-repairs-002": "illegal",          # "as-is" / habitability waiver
    "ct-utilities-001": "illegal",        # utility shutoff
    "ct-fees-001": "illegal",             # move-in fee
    "ct-terminate-001": "illegal",        # rent acceleration on early termination
    "ct-prohibited-008": "questionable",  # late charge before grace / over cap
    "ct-deposit-004": "questionable",     # auto deduction for painting / cleaning
}


def test_fixture_present() -> None:
    assert _FIXTURE.exists(), f"sample lease fixture missing at {_FIXTURE}"


def test_sample_lease_flags_fire() -> None:
    report = build_report(str(_FIXTURE), "ct")

    assert report["ok"] is True
    assert report["meta"]["needs_ocr"] is False, "fixture should be a digital (text) PDF"

    fired = {f["rule_id"]: f["severity"] for f in report["flags"]}

    # Every seeded clause must still fire (subset check — adding new rules is fine).
    missing = sorted(rid for rid in EXPECTED if rid not in fired)
    assert not missing, f"expected rules stopped firing: {missing}"

    # ...and at the expected severity.
    wrong = {rid: fired[rid] for rid, sev in EXPECTED.items() if fired[rid] != sev}
    assert not wrong, f"severity drift: {wrong}"


def test_every_flag_has_a_citation() -> None:
    """No flag may ship without a primary-source citation (the 'never invent law' rule)."""
    report = build_report(str(_FIXTURE), "ct")
    uncited = [f["rule_id"] for f in report["flags"] if not f["citations"]]
    assert not uncited, f"flags fired with no citation: {uncited}"
