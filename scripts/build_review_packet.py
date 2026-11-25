#!/usr/bin/env python3
"""Generate the attorney/legal-aid review packet from the curated ruleset.

Reads rules/<jurisdiction>/*.json (the source of truth) and emits a single
Markdown document a reviewer can mark up in one pass — each rule paired with the
statute it maps to, the verbatim statutory text, the plain-English framing, what
triggers it, and a reviewer verdict line.

Jurisdiction-aware: pass any folder code under rules/ (ct, ny, ma, ri, nh, vt, me).
Only CT carries its detailed § 47a section headers; every other state uses generic
category titles and lets each rule's own citation label name the governing statute,
so a packet is never mislabeled with the wrong state's law.

Usage:  python scripts/build_review_packet.py [jurisdiction]   # default: ct
Output: docs/ruleset-review-<jurisdiction>.md
"""
from __future__ import annotations

import json
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from engine.matchers.deterministic import DeterministicMatcher  # noqa: E402
from engine.rules import load_rules  # noqa: E402
from engine.scope import label_for  # noqa: E402
from engine.types import TextSpan  # noqa: E402

SEV_LABEL = {
    "illegal": "Illegal / unenforceable",
    "questionable": "Worth checking (context-dependent)",
    "info": "Informational (legal)",
}
# The statute family named on the cover, per jurisdiction folder code.
STATUTE_FAMILY = {
    "ct": "Conn. Gen. Stat. ch. 830–831, § 47a",
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
# Logical reading order (CT statute number ascending; habitability/notice slotted in).
FILE_ORDER = [
    "prohibited-terms", "payment", "fees", "repairs", "habitability",
    "inspection", "termination", "notice", "utilities", "entry",
    "security-deposit", "deposit-deductions",
]
# Curated known-gap lists, per jurisdiction. States without a list get a generic
# prompt rather than another state's gaps.
GAPS_BY_JUR = {
    "ct": [
        "§ 47a-20 — retaliatory action/eviction (clauses penalizing complaints or organizing)",
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
    """Map each rule id -> a real, plain-English example clause it flags, pulled
    from the kitchen-sink fixture (the sentence the rule actually matches). Lets a
    reviewer judge a rule's aim without reading any regex. Prefers the per-state
    fixture, falling back to the shared CT-era one."""
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


def esc(text: str) -> str:
    return (text or "").replace("|", "\\|")


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

    out: list[str] = []
    w = out.append

    w(f"# LeaseLookout — {label} ruleset for legal review\n")
    w(f"**Generated:** {date.today():%Y-%m-%d}  ·  **Jurisdiction:** {label} ({family})  ·  "
      f"**Rules:** {len(all_rules)}  ·  **Status:** every rule is `draft-unverified` pending this review.\n")
    w(f"Severity mix: **{counts['illegal']}** illegal/unenforceable · **{counts['questionable']}** worth-checking · **{counts['info']}** informational.\n")

    w("## What LeaseLookout is\n")
    w(f"LeaseLookout is a free, tenant-side tool that reads a {label} residential lease (PDF) and flags clauses "
      f"that may be illegal or unenforceable, **each tied to a specific {label} statute**. It presents "
      "legal *information*, not legal advice: the product states it is not a law firm, does not create an "
      "attorney-client relationship, shows every statute so the tenant can read the law themselves, and directs "
      "users to a tenant-rights attorney or a legal-aid clinic. It is invite-only and not public.\n")

    w("## The ask\n")
    w("For each rule below, please check:\n")
    w("1. **Legal accuracy** — does the described clause actually conflict with (or relate to) the cited statute?\n"
      "2. **Severity** — is *illegal / worth-checking / info* the right call?\n"
      "3. **Citation** — is the statute reference and the **verbatim quote** correct and current?\n"
      "4. **Plain-English framing** — is the tenant-facing explanation accurate and not overstated?\n"
      "5. **UPL** — does any wording drift from legal *information* toward individualized legal *advice*?\n")
    w("Mark each rule **✅ accurate** or **✏️ needs change** on its *Reviewer* line, with notes. "
      "Nothing is shown to a tenant as a conclusion until it is signed off. Thank you — this is exactly the "
      "expertise the tool needs to be trustworthy.\n")

    w("## How to read a rule\n")
    w("- **Severity:** *illegal* = the clause violates a statute / is unenforceable; *worth-checking* = likely "
      "problematic but context-dependent (surfaced so the tenant can check); *info* = noteworthy but lawful.\n"
      "- **Example clause this flags:** an illustrative bit of lease language the rule catches — so you can "
      "judge whether it's aimed right and isn't over- or under-inclusive. (No regex; the matching "
      "implementation is reviewed separately.)\n")

    w("## Coverage map\n")
    for s in ordered:
        w(f"- **{title_for(jur, s)}** — {len(files[s].get('rules', []))} rule(s)")
    w("\n**Known gaps / candidate future rules (not yet in the set — flag any you'd prioritize):**\n")
    gaps = GAPS_BY_JUR.get(jur)
    if gaps:
        for g in gaps:
            w(f"- {g}")
    else:
        w(f"- No curated gap list for {label} yet — please flag any common {label} tenant protections you'd "
          "expect a lease-checker to cover that aren't addressed above.")
    w("")

    w("## Rules at a glance\n")
    w("| ID | Title | Statute | Severity |")
    w("|---|---|---|---|")
    for r in all_rules:
        w(f"| `{r['id']}` | {esc(r['title'])} | {esc(statute_of(r))} | {r['severity']} |")
    w("")

    w("---\n")
    for s in ordered:
        data = files[s]
        w(f"## {title_for(jur, s)}\n")
        note = data.get("_note")
        if note:
            w(f"> **Statute context:** {note}\n")
        for r in data.get("rules", []):
            w(f"### `{r['id']}` — {r['title']}\n")
            w(f"**Severity:** {r['severity']} ({SEV_LABEL.get(r['severity'], '')})\n")
            w(f"**What the rule treats as wrong:** {r['description']}\n")
            if r.get("tenant_explainer"):
                w(f"**Tenant-facing wording (shown in the app):** {r['tenant_explainer']}\n")
            ex = examples.get(r["id"])
            if ex:
                w(f"**Example clause this flags (illustrative):** *{ex}*\n")
            w("**Citations:**\n")
            for c in r.get("citations", []):
                w(f"- [{c['label']}]({c['url']})")
                if c.get("quote"):
                    w(f"  > {c['quote']}")
            w("")
            w("**Reviewer:** ☐ Accurate ☐ Needs change — _severity? · citation/quote? · framing? · UPL?_\n")
            w("> Notes: \n")
            w("---\n")

    w(f"*All rules `draft-unverified`. Generated from `rules/{jur}/*.json` by `scripts/build_review_packet.py` — "
      "regenerate after any rule change. LeaseLookout is not a law firm and this packet is not a request for legal "
      "advice to any individual; it is a request to review curated legal-information content for accuracy.*\n")

    dest = ROOT / "docs" / f"ruleset-review-{jur}.md"
    dest.write_text("\n".join(out) + "\n", encoding="utf-8")
    print(f"wrote {dest.relative_to(ROOT)}  ({len(all_rules)} rules, {len(out)} lines)")


if __name__ == "__main__":
    main()
