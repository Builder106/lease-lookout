"""Core data types for the parser engine."""
from __future__ import annotations

from dataclasses import dataclass, field
from enum import StrEnum


class Severity(StrEnum):
    ILLEGAL = "illegal"            # clause violates statute / is unenforceable
    QUESTIONABLE = "questionable"  # likely problematic, context-dependent
    INFO = "info"                  # noteworthy but legal


@dataclass(frozen=True)
class Citation:
    """A pointer to the primary source backing a rule. Mandatory on every rule."""

    label: str        # e.g. "Conn. Gen. Stat. § 47a-21 — Security deposits"
    url: str          # a link a tenant can open and read
    quote: str = ""   # optional excerpt of the statute text


@dataclass(frozen=True)
class Rule:
    """A curated description of an illegal/abusive clause. Defined in rules/*.json.

    A Rule is the source of truth for *what the law says*. Matchers only decide
    whether a Rule fires against a lease; they never create or reinterpret law.
    """

    id: str
    jurisdiction: str             # e.g. "US-CT", "US-CT-Middletown"
    title: str
    severity: Severity
    description: str              # plain-language: what is wrong with the clause
    citations: list[Citation]
    tenant_explainer: str = ""    # reassuring, "what this means for you"
    patterns: list[str] = field(default_factory=list)  # regex (case-insensitive)
    keywords: list[str] = field(default_factory=list)  # literal substrings
    status: str = "draft-unverified"  # draft-unverified | attorney-reviewed


@dataclass(frozen=True)
class TextSpan:
    """A chunk of extracted lease text and where it came from."""

    page: int
    start: int
    end: int
    text: str


@dataclass
class Flag:
    """A rule that fired against a lease, with the text that triggered it."""

    rule: Rule
    matched_text: str
    span: TextSpan | None
    confidence: float   # 0..1 (deterministic = 1.0 on a pattern/keyword hit)
    matcher: str        # which matcher produced it ("deterministic", ...)
