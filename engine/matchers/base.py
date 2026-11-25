"""The swappable matcher seam."""
from __future__ import annotations

from abc import ABC, abstractmethod

from ..types import Flag, Rule, TextSpan


class Matcher(ABC):
    """Decides which curated Rules a lease's text triggers.

    This is the swappable seam in LeaseLookout's design. The deterministic matcher
    ships first (free, predictable). A free *local* semantic matcher (embeddings)
    can be dropped in later WITHOUT touching the rest of the pipeline, so the two
    can be A/B'd on the same leases. We never call a paid API.

    A matcher only decides *whether* a Rule fires. The Rule objects — the curated,
    statute-cited ruleset — are always the source of truth for what counts as
    illegal. A matcher must never invent or reinterpret law.
    """

    name: str = "base"

    @abstractmethod
    def match(self, spans: list[TextSpan], rules: list[Rule]) -> list[Flag]:
        """Return a Flag for each rule that fires against the extracted text."""
        raise NotImplementedError
