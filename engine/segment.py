"""Split page text into clause-sized spans before matching.

Leases are structured — numbered paragraphs, lettered sub-clauses, ALL-CAPS
headings. Matching whole pages lets a rule fire on text that spans unrelated
clauses and makes the negation guard (in the deterministic matcher) unreliable,
because a "not" three sentences away looks local. Segmenting first means each
match is judged inside the clause it actually appears in, and a flag's matched
text / page point at the real clause.

Best-effort and non-destructive: when a page has no structure we can detect, it
falls back to one span for the whole page (the old behavior). Offsets are
approximate — only `page` is load-bearing downstream (engine/report.flag_to_dict).
"""
from __future__ import annotations

import re

from .types import TextSpan

# Where one clause ends and the next begins:
#   - a blank line (paragraph break)
#   - a line that starts a numbered / lettered item or a heading
#   - an inline numbered item right after sentence punctuation ("…done. 12. The…")
_BOUNDARY = re.compile(
    r"\n\s*\n"
    r"|\n(?=\s*(?:\d{1,3}[.)]|\([a-zA-Z0-9]{1,3}\)|ARTICLE\b|SECTION\b|§)\s)"
    r"|(?<=[.;:])\s+(?=\d{1,3}[.)]\s)",
    re.IGNORECASE,
)

# A clause longer than this is kept whole anyway (matching handles it); shorter
# fragments that are just a number/heading stub are dropped as noise.
_MIN_CLAUSE_CHARS = 3


def segment_spans(spans: list[TextSpan]) -> list[TextSpan]:
    """Break each page span into clause spans, preserving the source page."""
    out: list[TextSpan] = []
    for span in spans:
        for chunk, offset in _split(span.text):
            if len(chunk.strip()) < _MIN_CLAUSE_CHARS:
                continue
            out.append(
                TextSpan(
                    page=span.page,
                    start=span.start + offset,
                    end=span.start + offset + len(chunk),
                    text=chunk,
                )
            )
    return out


def _split(text: str):
    """Yield (clause_text, offset_within_text) for each clause boundary."""
    parts = _BOUNDARY.split(text)
    cursor = 0
    for part in parts:
        if not part:
            continue
        idx = text.find(part, cursor)
        if idx == -1:
            idx = cursor
        yield part, idx
        cursor = idx + len(part)
