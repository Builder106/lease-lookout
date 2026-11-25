"""Unit tests for the scope assessment — "did we even run the right law here?"

Text-based (no PDF fixtures) so they're fast and don't depend on any one document.
The driving requirement: a wrong-jurisdiction or institutional-housing lease must
NOT come back as "covered," because 0 flags on such a doc reads as a false all-clear.
"""
from engine.report import build_report, disclaimer_for
from engine.rules import available_jurisdictions
from engine.scope import assess_scope, detect_jurisdiction, route_jurisdiction

# Trimmed from the real Columbia University renewal (NY student housing) that exposed
# the false all-clear: New York address, "occupancy agreement," full-time-student tie.
COLUMBIA_NY = """
COLUMBIA UNIVERSITY IN THE CITY OF NEW YORK
419 West 119th Street, #6A2  New York, NY 10027
EXTENSION OF OCCUPANCY AGREEMENT
If for any reason Occupant ceases to be a full-time student at Columbia University,
the Occupancy Agreement will end immediately. Billed to your Student Financial Services
(SFS) statement. This is student housing under New York City Administrative Code.
"""

# A plain private-market Connecticut lease (the wedge case) should be "covered."
PRIVATE_CT = """
RESIDENTIAL LEASE AGREEMENT
Premises: 100 Main Street, Middletown, CT 06457
This lease is governed by the laws of the State of Connecticut, Conn. Gen. Stat. § 47a et seq.
Landlord and Tenant agree to the following terms for the dwelling unit.
"""

# No venue and no statute fingerprints — too thin to claim a jurisdiction.
AMBIGUOUS = "Lease Agreement. The tenant agrees to pay rent on the first of each month."


def test_out_of_state_lease_is_not_covered() -> None:
    # Analyzing a NY lease under the CT ruleset must never read as "covered".
    s = assess_scope(COLUMBIA_NY, "ct")
    assert s["coverage"] == "out_of_jurisdiction"
    assert s["jurisdiction_match"] == "mismatch"
    assert s["detected_jurisdiction"] == "NY"
    assert s["headline"]  # user-facing copy is populated


def test_out_of_state_lease_also_flags_institutional() -> None:
    s = assess_scope(COLUMBIA_NY, "ct")
    assert s["institutional_housing"] is True
    assert len(s["institutional_signals"]) >= 2


def test_private_ct_lease_is_covered() -> None:
    s = assess_scope(PRIVATE_CT, "ct")
    assert s["coverage"] == "covered"
    assert s["jurisdiction_match"] == "match"
    assert s["detected_jurisdiction"] == "CT"
    assert s["headline"] == "" and s["body"] == ""


def test_institutional_ct_lease_is_possibly_exempt() -> None:
    text = PRIVATE_CT + "\nThis is an Occupancy Agreement for full-time student housing."
    s = assess_scope(text, "ct")
    assert s["coverage"] == "possibly_exempt"
    assert s["jurisdiction_match"] == "match"  # still a CT venue
    assert s["citation"] is not None
    assert "47a-2" in s["citation"]["url"]


def test_ambiguous_lease_is_unconfirmed() -> None:
    s = assess_scope(AMBIGUOUS, "ct")
    assert s["coverage"] == "unconfirmed"
    assert s["detected_jurisdiction"] is None


def test_fixture_report_stays_covered() -> None:
    """The seeded CT fixture (private-market Middletown lease) must not regress to a banner."""
    from pathlib import Path

    fixture = Path(__file__).parent / "fixtures" / "sample-ct-lease.pdf"
    report = build_report(str(fixture), "ct")
    assert report["scope"]["coverage"] == "covered"


# --- Phase A: jurisdiction routing ---

def test_detect_jurisdiction_identifies_states() -> None:
    assert detect_jurisdiction(COLUMBIA_NY) == "ny"   # recognized even with no NY ruleset
    assert detect_jurisdiction(PRIVATE_CT) == "ct"
    assert detect_jurisdiction(AMBIGUOUS) is None


def test_route_honors_explicit_request() -> None:
    # An explicit code wins even if the text says another state (scope still warns).
    assert route_jurisdiction(COLUMBIA_NY, requested="ct") == "ct"


def test_route_auto_falls_back_when_no_ruleset() -> None:
    # A detected state we don't cover (available overridden to CT-only) -> default.
    assert route_jurisdiction(COLUMBIA_NY, requested="auto", default="ct", available=["ct"]) == "ct"


def test_route_auto_uses_detected_when_covered() -> None:
    assert route_jurisdiction(PRIVATE_CT, requested="auto", default="ct") == "ct"
    # NY now has a ruleset, so an NY lease routes to ny under auto-detect.
    assert "ny" in available_jurisdictions()
    assert route_jurisdiction(COLUMBIA_NY, requested="auto", default="ct") == "ny"


def test_available_jurisdictions_lists_ct() -> None:
    assert "ct" in available_jurisdictions()


def test_disclaimer_is_jurisdiction_aware() -> None:
    assert "Connecticut" in disclaimer_for("ct")
    assert "New York" in disclaimer_for("ny")


def test_auto_report_routes_and_echoes_choice() -> None:
    from pathlib import Path

    fixture = Path(__file__).parent / "fixtures" / "sample-ct-lease.pdf"
    report = build_report(str(fixture), "auto")
    assert report["jurisdiction"] == "ct"
    assert report["requested_jurisdiction"] == "auto"
    assert report["scope"]["coverage"] == "covered"
