"""Detect a lease's jurisdiction, route it to the right ruleset, and judge coverage.

Two jobs, both META-signals — never a legal conclusion (see the "never invent law"
rule). They decide *which* curated ruleset to apply and *whether* it was the right
one, never what the law says:

  * Routing — read the lease's text, pick the state ruleset that governs it
    (detect → select). `route_jurisdiction()` / `detect_jurisdiction()`.
  * Scope — after matching, judge whether we ran the right law. Wrong state, or a
    university / institutional "occupancy agreement" many landlord-tenant statutes
    carve out (e.g. Conn. Gen. Stat. § 47a-2(a)). `assess_scope()`.

Either way, "0 flags" must NOT render as "this lease is clean": build_report()
attaches the scope assessment so the UI can refuse an all-clear it can't back up.

The state registry (JURISDICTIONS) lists every state we can *recognize* — including
ones we don't yet have a ruleset for, so routing can say "this is New York, which we
don't cover yet" rather than silently mis-applying Connecticut law. Which states we
can actually *analyze* comes from engine.rules.available_jurisdictions() (one folder
per ruleset), never from this map.
"""
from __future__ import annotations

import re

from .rules import available_jurisdictions

# Per-state metadata for detection + framing. Keyed by the rules/ folder name (lowercase
# USPS). `markers` are statute fingerprints (regex, weight) — the strongest venue signal.
# `exemption_citation` is the institutional-housing carve-out, only where we can cite a
# primary source (CT today); others stay None until verified rather than invented.
JURISDICTIONS: dict[str, dict] = {
    "ct": {
        "usps": "CT", "label": "Connecticut",
        "markers": [(r"conn(?:ecticut)?\.?\s+gen(?:eral)?\.?\s+stat", 4), (r"§\s*47a-", 4)],
        "exemption_citation": {
            "label": "Conn. Gen. Stat. § 47a-2(a) — arrangements not governed",
            "url": "https://www.cga.ct.gov/current/pub/chap_830.htm#sec_47a-2",
        },
    },
    "ny": {
        "usps": "NY", "label": "New York",
        "markers": [
            (r"new york city administrative code", 4),
            (r"\bRPAPL\b|real property (?:actions and proceedings )?law", 4),
            (r"real property law|\bRPL\b|§\s*235-[bc]", 3),
            (r"multiple dwelling law|general obligations law|§\s*7-103", 3),
        ],
        "exemption_citation": None,
    },
    "ma": {
        "usps": "MA", "label": "Massachusetts",
        "markers": [
            (r"(?:mass(?:achusetts)?\.?\s+gen(?:eral)?\.?\s+laws|M\.?G\.?L\.?)", 4),
            (r"\bc(?:hapter|\.)?\s*186\b", 3),
            (r"\bc(?:hapter|\.)?\s*93A\b", 3),
        ],
        "exemption_citation": None,
    },
    "ri": {
        "usps": "RI", "label": "Rhode Island",
        "markers": [
            (r"§\s*34-18-", 4),
            (r"rhode island.{0,40}landlord.{0,5}tenant", 3),
        ],
        "exemption_citation": None,
    },
    "nh": {
        "usps": "NH", "label": "New Hampshire",
        "markers": [(r"\bRSA\s*540(?:-A|-B|:)?", 4)],
        "exemption_citation": None,
    },
    "vt": {
        "usps": "VT", "label": "Vermont",
        "markers": [(r"9\s*V\.?S\.?A\.?\s*§?\s*44", 4), (r"9\s*V\.?S\.?A\.?", 3)],
        "exemption_citation": None,
    },
    "me": {
        "usps": "ME", "label": "Maine",
        "markers": [(r"14\s*M\.?R\.?S\.?(?:A\.?)?\s*§?\s*60", 4), (r"14\s*M\.?R\.?S\.?", 3)],
        "exemption_citation": None,
    },
}
# USPS code -> folder code, so detection (which works in USPS space) maps back to a ruleset.
_USPS_TO_CODE = {meta["usps"]: code for code, meta in JURISDICTIONS.items()}

# USPS code -> state name, for detecting which state a lease actually belongs to.
US_STATES: dict[str, str] = {
    "AL": "Alabama", "AK": "Alaska", "AZ": "Arizona", "AR": "Arkansas",
    "CA": "California", "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware",
    "FL": "Florida", "GA": "Georgia", "HI": "Hawaii", "ID": "Idaho",
    "IL": "Illinois", "IN": "Indiana", "IA": "Iowa", "KS": "Kansas",
    "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MD": "Maryland",
    "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi",
    "MO": "Missouri", "MT": "Montana", "NE": "Nebraska", "NV": "Nevada",
    "NH": "New Hampshire", "NJ": "New Jersey", "NM": "New Mexico", "NY": "New York",
    "NC": "North Carolina", "ND": "North Dakota", "OH": "Ohio", "OK": "Oklahoma",
    "OR": "Oregon", "PA": "Pennsylvania", "RI": "Rhode Island", "SC": "South Carolina",
    "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah",
    "VT": "Vermont", "VA": "Virginia", "WA": "Washington", "WV": "West Virginia",
    "WI": "Wisconsin", "WY": "Wyoming", "DC": "District of Columbia",
}
_NAME_TO_CODE = {name.lower(): code for code, name in US_STATES.items()}

# A score >= this from any one state is needed before we'll name a jurisdiction at
# all; below it, the document is too thin/ambiguous to claim a venue.
_DETECT_MIN = 2

# "…, NY 10027" — a USPS code wedged before a ZIP is the most reliable venue signal.
_ZIP_STATE = re.compile(r"\b([A-Z]{2})\b\.?\s+\d{5}(?:-\d{4})?")
# "City of New York", "State of Connecticut", "Commonwealth of Massachusetts".
_GOV_OF = re.compile(r"\b(?:City|State|Commonwealth)\s+of\s+([A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+)?)")
# State-specific statute fingerprints (regex, USPS, weight) — the strongest signal of
# governing law. Flattened from JURISDICTIONS so there's one place to add a state.
_STATUTE_MARKERS: list[tuple[str, str, int]] = [
    (pat, meta["usps"], weight)
    for meta in JURISDICTIONS.values()
    for pat, weight in meta["markers"]
]

# Markers that the agreement is institutional / school housing — the arrangement many
# landlord-tenant statutes carve out. (pattern, plain-English reason fragment).
_INSTITUTIONAL: list[tuple[str, str]] = [
    (r"\boccupancy agreement\b", "calls itself an “occupancy agreement,” not a lease"),
    (r"\bfull[-\s]?time student\b", "ties your housing to full-time student status"),
    (r"\bstudent housing\b", "is described as student housing"),
    (r"\buniversity (?:apartment )?housing\b", "is run as university housing"),
    (r"\b(?:residential life|residence life)\b", "is run by a campus residential-life office"),
    (r"\bstudent financial services\b|\bbursar\b", "bills rent through a student account"),
    (r"\b(?:dormitory|residence hall|resident assistant)\b", "is a dorm / residence hall"),
    (r"\broom and board\b", "is a room-and-board arrangement"),
]


def label_for(jurisdiction: str) -> str:
    """Human label for a folder code (e.g. 'ct' -> 'Connecticut')."""
    meta = JURISDICTIONS.get(jurisdiction)
    return meta["label"] if meta else jurisdiction.upper()


def legal_aid_pointer(jurisdiction: str) -> str:
    """Where to send a tenant for real advice — by state when known, else generic.

    Deliberately names no specific org/URL: legal-aid clinics have asked not to be
    referred to as a general lease-Q&A line (see JOURNAL 2026-06-15).
    """
    meta = JURISDICTIONS.get(jurisdiction)
    return f"a {meta['label']} tenant attorney or legal-aid clinic" if meta else "a tenant attorney or legal-aid clinic"


def _score_jurisdictions(text: str) -> dict[str, int]:
    scores: dict[str, int] = {}

    def bump(code: str | None, weight: int) -> None:
        if code in US_STATES:
            scores[code] = scores.get(code, 0) + weight

    for m in _ZIP_STATE.finditer(text):
        bump(m.group(1).upper(), 3)
    for m in _GOV_OF.finditer(text):
        bump(_NAME_TO_CODE.get(m.group(1).strip().lower()), 2)
    for pat, code, weight in _STATUTE_MARKERS:
        if re.search(pat, text, re.I):
            bump(code, weight)

    low = text.lower()
    for code, name in US_STATES.items():
        n = low.count(name.lower())
        if n:
            bump(code, min(n, 4))  # cap incidental name mentions
    return scores


def _match_jurisdiction(text: str, analyzed_code: str) -> tuple[str, str | None]:
    """Return (match, detected_code) where match is match | mismatch | unconfirmed."""
    scores = _score_jurisdictions(text)
    if not scores:
        return "unconfirmed", None
    detected = max(scores, key=lambda c: scores[c])
    if scores[detected] < _DETECT_MIN:
        return "unconfirmed", None
    if detected == analyzed_code:
        return "match", detected
    return "mismatch", detected


def detect_jurisdiction(text: str) -> str | None:
    """Best-guess folder code for the state that governs this lease, or None if unclear.

    Works in USPS space (matches statute fingerprints, addresses, state names) then maps
    back to a ruleset folder code. Returns a code even for states we don't yet cover
    (e.g. 'ny') so the caller can decide whether a ruleset exists.
    """
    scores = _score_jurisdictions(text)
    if not scores:
        return None
    detected = max(scores, key=lambda c: scores[c])
    if scores[detected] < _DETECT_MIN:
        return None
    return _USPS_TO_CODE.get(detected, detected.lower())


def route_jurisdiction(
    text: str,
    requested: str | None = None,
    default: str = "ct",
    available: list[str] | None = None,
) -> str:
    """Pick which ruleset to actually run against this lease.

    Explicit `requested` (anything but None/"auto") always wins — the caller/user gets
    what they asked for, and assess_scope still warns if the text disagrees. Otherwise
    auto-detect: use the detected state if we have a ruleset for it, else fall back to
    `default` (and scope will flag the mismatch). Never silently mis-routes.
    """
    if requested and requested != "auto":
        return requested
    avail = available if available is not None else available_jurisdictions()
    detected = detect_jurisdiction(text)
    if detected and detected in avail:
        return detected
    return default


def _institutional(text: str) -> tuple[bool, list[str]]:
    reasons = [reason for pat, reason in _INSTITUTIONAL if re.search(pat, text, re.I)]
    # One marker can be incidental ("student" anything); two distinct ones is a pattern.
    return len(reasons) >= 2, reasons


def _join(items: list[str]) -> str:
    if not items:
        return ""
    if len(items) == 1:
        return items[0]
    return ", ".join(items[:-1]) + ", and " + items[-1]


def _notice(
    coverage: str,
    analyzed_label: str,
    detected_label: str | None,
    ruleset_available: bool,
    reasons: list[str],
) -> tuple[str, str]:
    if coverage == "covered":
        return "", ""
    if coverage == "out_of_jurisdiction":
        where = detected_label or "another state"
        headline = f"This looks like a {where} lease — we only check {analyzed_label} law."
        body = (
            f"LeaseLookout matched it against {analyzed_label} landlord–tenant law, which "
            f"doesn’t govern a {where} lease. "
            + ("We don’t have a ruleset for that state yet, so " if not ruleset_available else "")
            + "treat anything below as not applicable — zero flags here is not a clean bill of health."
        )
        if reasons:
            body += " It also " + _join(reasons) + ", which many landlord–tenant laws exempt entirely."
        return headline, body
    if coverage == "possibly_exempt":
        headline = "This looks like university / institutional housing."
        carveout = (
            f"Many states — including {analyzed_label} (Conn. Gen. Stat. § 47a-2(a)) — carve"
            if analyzed_label == "Connecticut"
            else "Many states carve"
        )
        body = (
            f"It {_join(reasons)}. {carveout} housing tied to school enrollment out of the "
            "landlord–tenant statutes our ruleset is built on, so those rules may not apply here. "
            "A clean result below wouldn’t mean the agreement is fair — it may mean we read it "
            "against the wrong law."
        )
        return headline, body
    # unconfirmed
    headline = "We couldn’t confirm which state’s law governs this lease."
    body = (
        f"We matched it against {analyzed_label} law, but the document doesn’t clearly say where the "
        f"property is. If it isn’t a {analyzed_label} lease, nothing below applies."
    )
    return headline, body


def assess_scope(text: str, analyzed_jurisdiction: str = "ct") -> dict:
    """Assess whether the ruleset we ran is even the right law for this document.

    Returns a JSON-able dict attached to the report as `scope`. `coverage` is the
    field the UI keys off: anything other than "covered" must suppress the all-clear.
    """
    meta = JURISDICTIONS.get(analyzed_jurisdiction, {})
    analyzed_code = meta.get("usps", analyzed_jurisdiction.upper())
    analyzed_label = meta.get("label", analyzed_jurisdiction.upper())
    match, detected_code = _match_jurisdiction(text, analyzed_code)
    detected_label = US_STATES.get(detected_code) if detected_code else None
    detected_folder = _USPS_TO_CODE.get(detected_code, detected_code.lower()) if detected_code else None
    ruleset_available = bool(detected_folder) and detected_folder in available_jurisdictions()
    institutional, reasons = _institutional(text)

    if match == "mismatch":
        coverage = "out_of_jurisdiction"
    elif institutional:
        coverage = "possibly_exempt"
    elif match == "unconfirmed":
        coverage = "unconfirmed"
    else:
        coverage = "covered"

    headline, body = _notice(coverage, analyzed_label, detected_label, ruleset_available, reasons)
    citation = meta.get("exemption_citation") if coverage == "possibly_exempt" else None

    return {
        "coverage": coverage,
        "analyzed_jurisdiction": analyzed_jurisdiction,
        "analyzed_label": analyzed_label,
        "detected_jurisdiction": detected_code,
        "detected_label": detected_label,
        "jurisdiction_match": match,
        "ruleset_available_for_detected": ruleset_available,
        "institutional_housing": institutional,
        "institutional_signals": reasons,
        "headline": headline,
        "body": body,
        "citation": citation,
    }
