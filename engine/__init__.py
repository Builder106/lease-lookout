"""LeaseLookout parser engine: extract -> match -> flags.

Pure Python, no web framework. Runs locally for dev and as a Vercel Python
function in prod. The clause matcher is swappable (see ``matchers/``); the
curated ruleset in ``../rules/`` is the only source of truth for what counts
as illegal.
"""
from .extract import OCRUnavailable, extract_best, extract_text, extract_text_ocr, full_text
from .matchers.base import Matcher
from .matchers.deterministic import DeterministicMatcher
from .pipeline import analyze, analyze_spans
from .report import build_report, flag_to_dict
from .types import Citation, Flag, Rule, Severity, TextSpan

__all__ = [
    "analyze",
    "analyze_spans",
    "build_report",
    "flag_to_dict",
    "extract_text",
    "extract_text_ocr",
    "extract_best",
    "full_text",
    "OCRUnavailable",
    "Citation",
    "Flag",
    "Rule",
    "Severity",
    "TextSpan",
    "Matcher",
    "DeterministicMatcher",
]
