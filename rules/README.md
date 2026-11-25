# Ruleset — the source of truth

Each file under `rules/<jurisdiction>/` is a curated set of rules describing a
clause that is illegal, unenforceable, or abusive under that jurisdiction's law.
**This is the only place "what's illegal" is defined.** A matcher (see
`../engine/matchers/`) only decides *whether* a rule's text appears in a lease —
it never decides what the law is.

## Hard rules for authoring

1. **Every rule cites a primary source.** A rule with no `citations` is not

   shippable — the loader (`engine/rules.py`) raises on it. Cite the
   statute/ordinance with a link a tenant can open.

2. **`status`starts at`draft-unverified`.** Only set it to `attorney-reviewed`

   after a Connecticut tenant attorney or legal-aid clinic has signed off on the
   rule's legal accuracy.

3. **Plain language.** `tenant_explainer` is written for a stressed 20-year-old,

   not a lawyer.

See `schema.json` for the field-by-field format.

## Jurisdictions

- `ct/` — Connecticut (Conn. Gen. Stat. Title 47a). **Draft, unverified.**
  - `prohibited-terms.json` — § 47a-4 prohibited lease terms (waiver of rights, confession of judgment, exculpation/indemnify, waiving deposit interest, self-help eviction, distraint, attorney's-fee cap, late-fee/grace-period, utility surcharge).
  - `security-deposit.json` — § 47a-21 (Ch. 831): deposit cap (2 mo / 1 mo if 62+), non-refundable deposit, disguised fees.
  - `repairs.json` — § 47a-7 + § 47a-4(a)(1): tenant can't be made responsible for all repairs.
