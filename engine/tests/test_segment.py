"""Phase B accuracy tests: clause segmentation + the negation guard.

The driving requirement: a flag should be judged inside the clause it appears in,
so a negated obligation ("Tenant is NOT responsible for repairs") does not fire a
rule written for the affirmative one — while legitimate illegal clauses that happen
to contain inner negatives ("without resort to court", "shall not be liable") still do.
"""
from engine.pipeline import analyze_spans
from engine.segment import segment_spans
from engine.types import TextSpan


def _span(text: str) -> TextSpan:
    return TextSpan(page=1, start=0, end=len(text), text=text)


def _ids(text: str) -> set[str]:
    return {f.rule.id for f in analyze_spans([_span(text)], "ct")}


PAGE = """1. The Tenant is responsible for all repairs to the premises.

2. Landlord may enter the unit at any time without notice.

3. Tenant agrees to hold harmless the Landlord for any injury."""


def test_segment_splits_numbered_clauses() -> None:
    clauses = segment_spans([_span(PAGE)])
    assert len(clauses) == 3
    assert all(c.page == 1 for c in clauses)


def test_segment_preserves_page_on_multipage() -> None:
    spans = [_span("1. Clause one.\n\n2. Clause two."), TextSpan(page=2, start=0, end=10, text="3. On page two.")]
    clauses = segment_spans(spans)
    assert {c.page for c in clauses} == {1, 2}


def test_unstructured_page_falls_back_to_one_span() -> None:
    flat = "The tenant shall pay rent on the first of each month and keep the unit tidy."
    assert len(segment_spans([_span(flat)])) == 1


def test_negated_obligation_does_not_fire() -> None:
    assert "ct-repairs-001" not in _ids(
        "The Tenant is NOT responsible for any repairs or maintenance to the premises."
    )


def test_affirmative_obligation_still_fires() -> None:
    assert "ct-repairs-001" in _ids(
        "The Tenant is responsible for all repairs and maintenance to the premises."
    )


def test_negation_guard_does_not_oversuppress() -> None:
    # Illegal clauses that contain inner negatives must still fire.
    assert "ct-prohibited-005" in _ids(
        "Landlord may re-enter and take possession of the premises without resort to court order."
    )
    assert "ct-prohibited-003" in _ids(
        "In no event shall the Landlord be liable; Tenant agrees to hold harmless the Landlord."
    )


def test_matched_text_is_clause_scoped() -> None:
    # A short clause shows whole in the report rather than a bare keyword fragment.
    flags = analyze_spans([_span(PAGE)], "ct")
    entry = next(f for f in flags if f.rule.id == "ct-entry-001")
    assert "Landlord may enter the unit at any time" in entry.matched_text
