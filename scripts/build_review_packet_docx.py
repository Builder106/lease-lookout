#!/usr/bin/env python3
"""Render the attorney/legal-aid review packet as a styled Word .docx.

Same source of truth as build_review_packet.py (rules/<jurisdiction>/*.json), but
emits a clean, track-changes-ready Word document via python-docx — real headings,
a shaded summary table, indented italic statute quotes, and a styled reviewer line
per rule. (python-docx is the same library the Office-Word MCP server wraps; this
just does the whole document in one run.)

Jurisdiction-aware: pass any folder code under rules/ (ct, ny, ma, ri, nh, vt, me).
Titles, the statute column, and the framing copy adapt to the state; only CT carries
its detailed § 47a section headers, every other state uses generic category titles
and lets each rule's own citation label name the governing statute.

Usage:  uv run --group tooling scripts/build_review_packet_docx.py [jurisdiction]
Output: docs/ruleset-review-<jurisdiction>.docx
"""
from __future__ import annotations

import json
import sys
from datetime import date
from pathlib import Path

from docx import Document
from docx.shared import Inches, Pt, RGBColor

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from engine.matchers.deterministic import DeterministicMatcher  # noqa: E402
from engine.rules import load_rules  # noqa: E402
from engine.scope import label_for  # noqa: E402
from engine.types import TextSpan  # noqa: E402

SEV = {
    "illegal": ("ILLEGAL / UNENFORCEABLE", RGBColor(0xB4, 0x2B, 0x2B)),
    "questionable": ("WORTH CHECKING", RGBColor(0xB5, 0x6A, 0x00)),
    "info": ("INFORMATIONAL", RGBColor(0x5F, 0x5F, 0x5F)),
}
GRAY = RGBColor(0x6B, 0x6B, 0x6B)
INK = RGBColor(0x20, 0x20, 0x20)

# The statute family named on the cover, per jurisdiction folder code.
STATUTE_FAMILY = {
    "ct": "Conn. Gen. Stat. § 47a",
    "ny": "N.Y. RPL · GOL · RPAPL",
    "ma": "M.G.L. c. 186 & c. 93A (940 CMR 3.17)",
    "ri": "R.I. Gen. Laws § 34-18",
    "nh": "N.H. RSA 540 & 540-A",
    "vt": "9 V.S.A. ch. 137",
    "me": "14 M.R.S. ch. 710",
}

# Connecticut keeps its richer, statute-numbered section titles. Every other state
# uses the generic category titles below, so a section is never mislabeled with a
# CT statute number.
CT_FILE_TITLES = {
    "prohibited-terms": "§ 47a-4 — Terms prohibited in a rental agreement",
    "payment": "§ 47a-4c — Payment method",
    "fees": "§ 47a-4d — Prohibited pre-tenancy fees",
    "repairs": "§ 47a-7 — Habitability & repairs",
    "inspection": "§ 47a-7c — Pre-occupancy walk-through",
    "termination": "§ 47a-11a — Early termination & duty to mitigate",
    "utilities": "§ 47a-13 — Essential services",
    "entry": "§ 47a-16 — Landlord entry",
    "security-deposit": "§ 47a-21 — Security deposits",
    "deposit-deductions": "§ 47a-21(d) — Deposit deductions & return",
}
CATEGORY_TITLES = {
    "prohibited-terms": "Terms prohibited in a rental agreement",
    "payment": "Payment method",
    "fees": "Prohibited / regulated fees",
    "repairs": "Habitability & repairs",
    "habitability": "Habitability & repairs",
    "inspection": "Pre-occupancy walk-through",
    "termination": "Early termination & duty to mitigate",
    "notice": "Notice requirements",
    "utilities": "Essential services",
    "entry": "Landlord entry",
    "security-deposit": "Security deposits",
    "deposit-deductions": "Deposit deductions & return",
}
FILE_ORDER = [
    "prohibited-terms", "payment", "fees", "repairs", "habitability",
    "inspection", "termination", "notice", "utilities", "entry",
    "security-deposit", "deposit-deductions",
]
# Curated known-gap lists, per jurisdiction. States without a list get a generic
# prompt rather than another state's gaps.
GAPS_BY_JUR = {
    "ct": [
        "§ 47a-20 — retaliatory action / eviction (clauses penalizing complaints or organizing)",
        "§ 47a-4e — notice of rent increases",
        "§ 47a-7a / 47a-7b — bed-bug responsibilities; lock changes for protected persons",
        "Jury-trial waiver framed separately from the general § 47a-4(a)(1) waiver rule",
        "Automatic-renewal / holdover clauses",
    ],
}


def title_for(jur: str, category: str) -> str:
    if jur == "ct":
        return CT_FILE_TITLES.get(category, CATEGORY_TITLES.get(category, category))
    return CATEGORY_TITLES.get(category, category)


def example_clauses(jur: str) -> dict[str, str]:
    """Map rule id -> a real, plain-English example clause it flags, pulled from
    the kitchen-sink fixture (the sentence the rule actually matches). Prefers the
    per-state fixture, falling back to the shared CT-era one."""
    out: dict[str, str] = {}
    syn = ROOT / "tests" / "fixtures" / "synthetic"
    ks_path = syn / f"{jur}-kitchen-sink-lease.txt"
    if not ks_path.exists():
        ks_path = syn / "kitchen-sink-lease.txt"
    if not ks_path.exists():
        return out
    text = ks_path.read_text(encoding="utf-8")
    spans = [TextSpan(page=1, start=0, end=len(text), text=text)]
    for f in DeterministicMatcher().match(spans, load_rules(jur)):
        if f.rule.id in out:
            continue
        snip = f.matched_text
        i = text.find(snip)
        if i == -1:
            out[f.rule.id] = " ".join(snip.split())
            continue
        start = text.rfind(".", 0, i) + 1
        end = text.find(".", i + len(snip))
        out[f.rule.id] = " ".join(text[start:(end + 1 if end != -1 else len(text))].split())
    return out


def statute_of(rule: dict) -> str:
    """The governing statute for a rule = the label of its first citation
    (e.g. 'M.G.L. c. 186, § 15B', 'N.H. RSA 540-A:6, I(a)')."""
    cites = rule.get("citations") or [{}]
    return cites[0].get("label") or "—"


def run(p, text, *, bold=False, italic=False, size=None, color=None):
    r = p.add_run(text)
    r.bold = bold
    r.italic = italic
    if size:
        r.font.size = Pt(size)
    if color:
        r.font.color.rgb = color
    return r


def main() -> None:
    jur = sys.argv[1] if len(sys.argv) > 1 else "ct"
    label = label_for(jur)
    family = STATUTE_FAMILY.get(jur, "state landlord–tenant law")
    base = ROOT / "rules" / jur
    files = {p.stem: json.loads(p.read_text(encoding="utf-8")) for p in base.glob("*.json")}
    if not files:
        sys.exit(f"no rules found under rules/{jur}/ — nothing to render")
    ordered = [s for s in FILE_ORDER if s in files] + [s for s in sorted(files) if s not in FILE_ORDER]
    all_rules = [r for s in ordered for r in files[s].get("rules", [])]
    counts = {k: sum(1 for r in all_rules if r["severity"] == k) for k in ("illegal", "questionable", "info")}
    examples = example_clauses(jur)

    doc = Document()
    doc.core_properties.title = f"LeaseLookout — {label} Ruleset for Legal Review"
    doc.core_properties.author = "LeaseLookout"
    normal = doc.styles["Normal"].font
    normal.name = "Calibri"
    normal.size = Pt(10.5)

    doc.add_heading(f"LeaseLookout — {label} ruleset for legal review", level=0)
    meta = doc.add_paragraph()
    run(meta, f"Generated {date.today():%Y-%m-%d}  ·  {label} ({family})  ·  "
              f"{len(all_rules)} rules  ·  all draft-unverified pending this review.", italic=True, color=GRAY, size=9.5)
    mix = doc.add_paragraph()
    run(mix, f"Severity mix: {counts['illegal']} illegal/unenforceable · "
             f"{counts['questionable']} worth-checking · {counts['info']} informational.", size=9.5, color=GRAY)

    doc.add_heading("What LeaseLookout is", level=1)
    doc.add_paragraph(
        f"LeaseLookout is a free, tenant-side tool that reads a {label} residential lease (PDF) and flags "
        f"clauses that may be illegal or unenforceable, each tied to a specific {label} statute. It "
        "presents legal information, not legal advice: the product states it is not a law firm, does not create "
        "an attorney-client relationship, shows every statute so the tenant can read the law themselves, and "
        "directs users to a tenant-rights attorney or a legal-aid clinic. It is invite-only and "
        "not public."
    )

    doc.add_heading("The ask", level=1)
    doc.add_paragraph("For each rule below, please check:")
    for item in [
        "Legal accuracy — does the described clause actually conflict with (or relate to) the cited statute?",
        "Severity — is illegal / worth-checking / info the right call?",
        "Citation — is the statute reference and the verbatim quote correct and current?",
        "Plain-English framing — is the tenant-facing wording accurate and not overstated?",
        "UPL — does any wording drift from legal information toward individualized legal advice?",
    ]:
        doc.add_paragraph(item, style="List Number")
    p = doc.add_paragraph()
    run(p, "Mark each rule on its Reviewer line (Accurate / Needs change) with notes. Nothing is shown to a "
           "tenant as a conclusion until it is signed off. Thank you — this is exactly the expertise the tool "
           "needs to be trustworthy.", italic=True)

    doc.add_heading("How to read a rule", level=1)
    doc.add_paragraph(
        "Severity: illegal = the clause violates a statute / is unenforceable; worth-checking = likely "
        "problematic but context-dependent (surfaced so the tenant can check); info = noteworthy but lawful.",
        style="List Bullet")
    doc.add_paragraph(
        "Example clause this flags: an illustrative bit of lease language the rule catches, so you can judge "
        "whether it's aimed right and isn't over- or under-inclusive. (No regex here — the matching "
        "implementation is reviewed separately.)", style="List Bullet")

    doc.add_heading("Coverage map", level=1)
    for s in ordered:
        doc.add_paragraph(f"{title_for(jur, s)} — {len(files[s].get('rules', []))} rule(s)", style="List Bullet")
    p = doc.add_paragraph()
    run(p, "Known gaps / candidate future rules (not yet in the set — flag any you'd prioritize):", bold=True)
    gaps = GAPS_BY_JUR.get(jur)
    if gaps:
        for g in gaps:
            doc.add_paragraph(g, style="List Bullet")
    else:
        doc.add_paragraph(
            f"No curated gap list for {label} yet — please flag any common {label} tenant protections you'd "
            "expect a lease-checker to cover that aren't addressed above.", style="List Bullet")

    doc.add_heading("Rules at a glance", level=1)
    table = doc.add_table(rows=1, cols=4)
    try:
        table.style = "Light Grid Accent 1"
    except KeyError:
        table.style = "Table Grid"
    for c, head in zip(table.rows[0].cells, ("ID", "Title", "Statute", "Severity")):
        c.paragraphs[0].add_run(head).bold = True
    for r in all_rules:
        cells = table.add_row().cells
        cells[0].text = r["id"]
        cells[1].text = r["title"]
        cells[2].text = statute_of(r)
        cells[3].text = SEV[r["severity"]][0].title()

    doc.add_page_break()

    for s in ordered:
        data = files[s]
        doc.add_heading(title_for(jur, s), level=1)
        if data.get("_note"):
            p = doc.add_paragraph()
            run(p, "Statute context — ", bold=True, size=9, color=GRAY)
            run(p, data["_note"], italic=True, size=9, color=GRAY)
        for r in data.get("rules", []):
            doc.add_heading(f"{r['id']} — {r['title']}", level=2)
            tag = doc.add_paragraph()
            label_text, color = SEV[r["severity"]]
            run(tag, label_text, bold=True, size=9, color=color)

            p = doc.add_paragraph()
            run(p, "What the rule treats as wrong:  ", bold=True)
            run(p, r["description"])
            if r.get("tenant_explainer"):
                p = doc.add_paragraph()
                run(p, "In-app wording shown to the tenant:  ", bold=True)
                run(p, r["tenant_explainer"], italic=True)
            ex = examples.get(r["id"])
            if ex:
                p = doc.add_paragraph()
                run(p, "Example clause this flags (illustrative):  ", bold=True, size=9, color=GRAY)
                run(p, ex, italic=True, size=9, color=GRAY)

            for c in r.get("citations", []):
                p = doc.add_paragraph()
                run(p, c["label"], bold=True, color=INK)
                if c.get("url"):
                    run(p, f"   {c['url']}", size=8.5, color=GRAY)
                if c.get("quote"):
                    q = doc.add_paragraph()
                    q.paragraph_format.left_indent = Inches(0.3)
                    q.paragraph_format.space_before = Pt(2)
                    run(q, c["quote"], italic=True, size=9.5)

            rv = doc.add_paragraph()
            rv.paragraph_format.space_before = Pt(4)
            run(rv, "REVIEWER:  ☐ Accurate    ☐ Needs change", bold=True, size=9.5, color=INK)
            run(rv, "   — severity? · citation/quote? · framing? · UPL?", size=9, color=GRAY)
            notes = doc.add_paragraph()
            run(notes, "Notes: ", bold=True, size=9.5, color=GRAY)
            run(notes, "_______________________________________________________________", color=GRAY)

    foot = doc.add_paragraph()
    run(foot, "All rules draft-unverified. Generated from rules/" + jur + "/*.json by "
              "scripts/build_review_packet_docx.py — regenerate after any rule change. LeaseLookout is not a law "
              "firm and this packet is not a request for legal advice to any individual; it is a request to "
              "review curated legal-information content for accuracy.", italic=True, size=8.5, color=GRAY)

    dest = ROOT / "docs" / f"ruleset-review-{jur}.docx"
    doc.save(str(dest))
    print(f"wrote {dest.relative_to(ROOT)}  ({len(all_rules)} rules)")


if __name__ == "__main__":
    main()
