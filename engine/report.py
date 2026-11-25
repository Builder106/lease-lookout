"""Assemble the JSON report the web layer returns.

Shared by the CLI (local) and the Vercel Python function (api/analyze.py) so the
response contract has exactly one definition.
"""
from __future__ import annotations

from pathlib import Path

from .extract import extract_best, full_text
from .pipeline import analyze_spans
from .scope import assess_scope, legal_aid_pointer, route_jurisdiction
from .types import Flag


def disclaimer_for(jurisdiction: str) -> str:
    """The 'not legal advice' line, pointed at the right state's help (see legal_aid_pointer)."""
    return f"This is not legal advice. Verify anything important with {legal_aid_pointer(jurisdiction)}."


def flag_to_dict(f: Flag) -> dict:
    return {
        "rule_id": f.rule.id,
        "title": f.rule.title,
        "severity": f.rule.severity.value,
        "description": f.rule.description,
        "tenant_explainer": f.rule.tenant_explainer,
        "citations": [{"label": c.label, "url": c.url, "quote": c.quote} for c in f.rule.citations],
        "status": f.rule.status,
        "matched_text": f.matched_text,
        "page": f.span.page if f.span else None,
        "confidence": f.confidence,
        "matcher": f.matcher,
    }


def build_report(pdf_path: str | Path, jurisdiction: str = "ct") -> dict:
    """Extract (digital, OCR fallback) + match; return the full JSON-able report.

    `jurisdiction` is a ruleset folder code, or "auto" (or None) to detect the state
    from the lease text and route to its ruleset. The chosen jurisdiction is echoed
    back as `jurisdiction`; `requested_jurisdiction` records what the caller asked for.
    """
    spans, method = extract_best(pdf_path)
    text = full_text(spans)
    needs_ocr = len(text.strip()) < 50
    # Route first: an explicit code is honored, "auto"/None detects from the text.
    chosen = jurisdiction if jurisdiction not in (None, "auto") else route_jurisdiction(text, jurisdiction)
    flags = [] if needs_ocr else analyze_spans(spans, chosen)
    # Whether we even ran the right law against this document. Without it, "0 flags"
    # would read as a clean bill of health on an out-of-jurisdiction / exempt lease.
    scope = None if needs_ocr else assess_scope(text, chosen)
    return {
        "ok": True,
        "jurisdiction": chosen,
        "requested_jurisdiction": jurisdiction,
        "meta": {
            "pages": len(spans),
            "chars": len(text),
            "method": method,
            "needs_ocr": needs_ocr,
        },
        "disclaimer": disclaimer_for(chosen),
        "scope": scope,
        "flags": [flag_to_dict(f) for f in flags],
    }
