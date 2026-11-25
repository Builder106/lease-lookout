"""Deterministic regex/keyword matcher — ships first."""
from __future__ import annotations

import re

from ..types import Flag, Rule, TextSpan
from .base import Matcher

# When a clause is short enough to show whole, the matched text IS the clause (better
# context in the report); longer clauses fall back to the matched fragment.
_CLAUSE_DISPLAY_CAP = 280

# Negation cues immediately before a hit that flip its meaning ("Tenant is NOT
# responsible for repairs"). Deliberately tight — "without" / "no" are excluded
# because they appear *inside* legitimate illegal clauses ("without resort to court").
_NEGATION = re.compile(r"\b(?:not|never|cannot|can\s?not|except|excluding|neither)\b|n['’]t\b", re.IGNORECASE)
_NEGATION_WINDOW = 30


class DeterministicMatcher(Matcher):
    """A rule fires if any of its regex ``patterns`` or literal ``keywords`` appear
    in the lease text — unless the hit is locally negated. Predictable and free;
    brittle on heavily paraphrased clauses, which a semantic matcher improves on.
    """

    name = "deterministic"

    def match(self, spans: list[TextSpan], rules: list[Rule]) -> list[Flag]:
        flags: list[Flag] = []
        for span in spans:
            low = span.text.lower()
            clause = span.text.strip()
            for rule in rules:
                hit = self._first_hit(span.text, low, rule)
                if hit is not None:
                    flags.append(
                        Flag(
                            rule=rule,
                            # Show the whole clause when it's short; else the fragment.
                            matched_text=clause if len(clause) <= _CLAUSE_DISPLAY_CAP else hit,
                            span=span,
                            confidence=1.0,
                            matcher=self.name,
                        )
                    )
        return flags

    @classmethod
    def _first_hit(cls, text: str, low: str, rule: Rule) -> str | None:
        for pat in rule.patterns:
            for m in re.finditer(pat, text, flags=re.IGNORECASE | re.DOTALL):
                if not cls._negated(text, m.start()):
                    return m.group(0)[:240]
        for kw in rule.keywords:
            start = 0
            while True:
                idx = low.find(kw.lower(), start)
                if idx == -1:
                    break
                if not cls._negated(text, idx):
                    return text[idx : idx + len(kw)]
                start = idx + 1
        return None

    @staticmethod
    def _negated(text: str, match_start: int) -> bool:
        """True if a negation cue sits just before the match (same clause)."""
        window = text[max(0, match_start - _NEGATION_WINDOW) : match_start]
        return bool(_NEGATION.search(window))
