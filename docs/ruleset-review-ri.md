# LeaseLookout — Rhode Island ruleset for legal review

**Generated:**2026-06-20  ·**Jurisdiction:**Rhode Island (R.I. Gen. Laws § 34-18)  ·**Rules:**14  ·**Status:** every rule is `draft-unverified` pending this review.

Severity mix: **12**illegal/unenforceable ·**2**worth-checking ·**0** informational.

## What LeaseLookout is

LeaseLookout is a free, tenant-side tool that reads a Rhode Island residential lease (PDF) and flags clauses that may be illegal or unenforceable, **each tied to a specific Rhode Island statute**. It presents legal *information*, not legal advice: the product states it is not a law firm, does not create an attorney-client relationship, shows every statute so the tenant can read the law themselves, and directs users to a tenant-rights attorney or a legal-aid clinic. It is invite-only and not public.

## The ask

For each rule below, please check:

1. **Legal accuracy** — does the described clause actually conflict with (or relate to) the cited statute?
2. **Severity** — is *illegal / worth-checking / info* the right call?
3. **Citation**— is the statute reference and the**verbatim quote** correct and current?
4. **Plain-English framing** — is the tenant-facing explanation accurate and not overstated?
5. **UPL** — does any wording drift from legal *information*toward individualized legal*advice*?

Mark each rule **✅ accurate**or**✏️ needs change** on its *Reviewer* line, with notes. Nothing is shown to a tenant as a conclusion until it is signed off. Thank you — this is exactly the expertise the tool needs to be trustworthy.

## How to read a rule

- **Severity:** *illegal*= the clause violates a statute / is unenforceable;*worth-checking*= likely problematic but context-dependent (surfaced so the tenant can check);*info* = noteworthy but lawful.
- **Example clause this flags:** an illustrative bit of lease language the rule catches — so you can judge whether it's aimed right and isn't over- or under-inclusive. (No regex; the matching implementation is reviewed separately.)

## Coverage map

- **Terms prohibited in a rental agreement** — 6 rule(s)
- **Prohibited / regulated fees** — 3 rule(s)
- **Habitability & repairs** — 1 rule(s)
- **Landlord entry** — 1 rule(s)
- **Security deposits** — 3 rule(s)

**Known gaps / candidate future rules (not yet in the set — flag any you'd prioritize):**

- No curated gap list for Rhode Island yet — please flag any common Rhode Island tenant protections you'd expect a lease-checker to cover that aren't addressed above.

## Rules at a glance

| ID | Title | Statute | Severity |
| --- | --- | --- | --- |
| `ri-prohibited-001` | Waiver of the tenant's rights or remedies under the Act | R.I. Gen. Laws § 34-18-17(a)(1) | illegal |
| `ri-prohibited-002` | Confession of judgment | R.I. Gen. Laws § 34-18-17(a)(2) | illegal |
| `ri-prohibited-003` | Tenant agrees to pay the landlord's attorney's fees | R.I. Gen. Laws § 34-18-17(a)(3) | questionable |
| `ri-prohibited-004` | Landlord exculpation / hold-harmless / indemnification | R.I. Gen. Laws § 34-18-17(a)(4) | illegal |
| `ri-prohibited-005` | Self-help eviction (lockout, seizing possession, cutting utilities) | R.I. Gen. Laws § 34-18-44 | illegal |
| `ri-prohibited-006` | Retaliation for complaints or tenant organizing | R.I. Gen. Laws § 34-18-46(a) | illegal |
| `ri-fees-001` | Rental application fee charged to a prospective tenant | R.I. Gen. Laws § 34-18-59(a) | illegal |
| `ri-fees-002` | Convenience fee added to a rent payment | R.I. Gen. Laws § 34-18-61(a) | illegal |
| `ri-fees-003` | Undisclosed fees beyond rent | R.I. Gen. Laws § 34-18-15(a)(1) | questionable |
| `ri-habitability-001` | "As-is" / waiver of the landlord's duty to keep the premises habitable | R.I. Gen. Laws § 34-18-22(a)(1)-(2) | illegal |
| `ri-entry-001` | Landlord entry without notice or at will | R.I. Gen. Laws § 34-18-26(c) | illegal |
| `ri-deposit-001` | Security deposit exceeds one month's rent | R.I. Gen. Laws § 34-18-19(a) | illegal |
| `ri-deposit-002` | No itemized return of the deposit within 20 days | R.I. Gen. Laws § 34-18-19(b) | illegal |
| `ri-deposit-003` | Non-refundable security deposit | R.I. Gen. Laws § 34-18-19(c) | illegal |

---

## Terms prohibited in a rental agreement

> **Statute context:** Rhode Island statutory bars on residential lease terms, retrieved verbatim from the R.I. Legislature statute server (webserver.rilegislature.gov) on 2026-06-20, Title 34 Ch. 18 (Residential Landlord and Tenant Act). § 34-18-17 lists provisions a rental agreement 'may not' contain — waiver of chapter rights/remedies (a)(1), confession of judgment (a)(2), one-sided landlord attorney's fees (a)(3), and landlord exculpation/indemnity (a)(4); § 34-18-17(b) makes any such provision unenforceable and exposes a deliberate landlord to up to three months' rent plus attorney's fees. § 34-18-44 prohibits self-help recovery of possession, including willful interruption of essential services. § 34-18-34 gives the tenant remedies (up to three months' rent or treble damages plus attorney's fees) for unlawful ouster, exclusion, or diminution of service. § 34-18-46 prohibits retaliatory conduct. NOTE: RI has no statute specifically voiding a jury-trial-waiver clause; such a clause would instead fall under the § 34-18-17(a)(1) bar on waiving chapter rights, so it is not asserted as its own statute here. ALL rules status=draft-unverified: must be reviewed by a Rhode Island tenant attorney / legal-aid clinic before public conclusions.

### `ri-prohibited-001` — Waiver of the tenant's rights or remedies under the Act

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per R.I. Gen. Laws § 34-18-17(a)(1), a rental agreement may not provide that the tenant agrees to waive or forego rights or remedies under the Residential Landlord and Tenant Act. Any such provision is unenforceable (§ 34-18-17(b)). This covers blanket 'tenant waives all rights/defenses under Chapter 34-18' clauses.

**Tenant-facing wording (shown in the app):** A lease can't make you sign away the rights or remedies the Rhode Island tenant law gives you. A clause that says 'tenant waives all rights and remedies under the Residential Landlord and Tenant Act' doesn't hold up.

**Example clause this flags (illustrative):** *The Tenant agrees to waive and forego any rights and remedies under this chapter and the Residential Landlord and Tenant Act.*

**Citations:**

- [R.I. Gen. Laws § 34-18-17(a)(1)](https://webserver.rilegislature.gov/Statutes/TITLE34/34-18/34-18-17.htm)

  > A rental agreement may not provide that the tenant: (1) Agrees to waive or forego rights or remedies under this chapter;

- [R.I. Gen. Laws § 34-18-17(b)](https://webserver.rilegislature.gov/Statutes/TITLE34/34-18/34-18-17.htm)

  > A provision prohibited by subsection (a) included in a rental agreement is unenforceable. If a landlord deliberately uses a rental agreement containing provisions known to be prohibited, the tenant may recover, in addition to his or her actual damages, an amount up to three (3) months periodic rent and reasonable attorney’s fees.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `ri-prohibited-002` — Confession of judgment

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per R.I. Gen. Laws § 34-18-17(a)(2), a rental agreement may not authorize any person to confess judgment on a claim arising out of the rental agreement. Such a 'cognovit' / confession-of-judgment clause is unenforceable (§ 34-18-17(b)).

**Tenant-facing wording (shown in the app):** A lease can't make you pre-authorize the landlord (or anyone) to enter a court judgment against you without a hearing. That 'confession of judgment' clause is unenforceable in Rhode Island.

**Example clause this flags (illustrative):** *Confession of Judgment.*

**Citations:**

- [R.I. Gen. Laws § 34-18-17(a)(2)](https://webserver.rilegislature.gov/Statutes/TITLE34/34-18/34-18-17.htm)

  > A rental agreement may not provide that the tenant: … (2) Authorizes any person to confess judgment on a claim arising out of the rental agreement;

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `ri-prohibited-003` — Tenant agrees to pay the landlord's attorney's fees

**Severity:** questionable (Worth checking (context-dependent))

**What the rule treats as wrong:** Per R.I. Gen. Laws § 34-18-17(a)(3), a rental agreement may not provide that the tenant agrees to pay the landlord's attorney's fees inconsistent with the Act. Only fees 'inconsistent with this chapter' are barred — a one-way clause making the tenant pay the landlord's legal fees regardless of who wins is unenforceable (§ 34-18-17(b)), but a mutual prevailing-party fee clause can be lawful, so a flagged clause must be read in full.

**Tenant-facing wording (shown in the app):** A lease can't make you cover the landlord's lawyer bills in a way the law doesn't allow. A one-sided 'tenant pays landlord's attorney's fees' clause is unenforceable in Rhode Island.

**Example clause this flags (illustrative):** *In any dispute, the Tenant agrees to pay the Landlord's reasonable attorney's fees, win or lose.*

**Citations:**

- [R.I. Gen. Laws § 34-18-17(a)(3)](https://webserver.rilegislature.gov/Statutes/TITLE34/34-18/34-18-17.htm)

  > A rental agreement may not provide that the tenant: … (3) Agrees to pay the landlord’s attorney’s fees inconsistent with this chapter; or

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `ri-prohibited-004` — Landlord exculpation / hold-harmless / indemnification

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per R.I. Gen. Laws § 34-18-17(a)(4), a rental agreement may not provide that the tenant agrees to the exculpation or limitation of any landlord liability arising under law, or to indemnify the landlord for that liability or its costs. 'Landlord not liable', 'hold harmless', and 'tenant shall indemnify the landlord' clauses are unenforceable (§ 34-18-17(b)).

**Tenant-facing wording (shown in the app):** Your landlord can't use the lease to escape responsibility for harm they're liable for, or push that liability onto you. 'Landlord not liable for any injury', 'hold harmless', and 'tenant indemnifies the landlord' clauses are unenforceable in Rhode Island.

**Example clause this flags (illustrative):** *The Tenant agrees to indemnify the Landlord and to hold the Landlord harmless from any and all liability for injury to person or property.*

**Citations:**

- [R.I. Gen. Laws § 34-18-17(a)(4)](https://webserver.rilegislature.gov/Statutes/TITLE34/34-18/34-18-17.htm)

  > A rental agreement may not provide that the tenant: … (4) Agrees to the exculpation or limitation of any liability of the landlord arising under law or to indemnify the landlord for that liability or the costs connected with the liability.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `ri-prohibited-005` — Self-help eviction (lockout, seizing possession, cutting utilities)

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per R.I. Gen. Laws § 34-18-44, a landlord may not recover or take possession of the dwelling unit by action or otherwise — including by willfully diminishing services through interrupting heat, running water, hot water, electric, gas, or other essential service — except on abandonment, surrender, or as the chapter permits. Under § 34-18-34 a tenant unlawfully ousted or cut off from essential services may recover up to three months' rent or treble damages plus attorney's fees. A clause authorizing the landlord to lock the tenant out, retake possession, or shut off utilities without court process is unenforceable.

**Tenant-facing wording (shown in the app):** A landlord can't lock you out, retake the apartment, or shut off your heat, water, gas, or electricity to force you out — they have to go through the court eviction process. A lease clause saying they can do any of that doesn't hold up, and doing it can cost the landlord up to three months' rent or treble damages plus your attorney's fees.

**Example clause this flags (illustrative):** *Upon default, the Landlord may re-enter and take possession of the premises and may shut off the Tenant's utilities, without resort to any court or eviction process.*

**Citations:**

- [R.I. Gen. Laws § 34-18-44](https://webserver.rilegislature.gov/Statutes/TITLE34/34-18/34-18-44.htm)

  > A landlord may not recover or take possession of the dwelling unit by action or otherwise, including willful diminution of services to the tenant by interrupting or causing the interruption of heat, running water, hot water, electric, gas, or other essential service to the tenant, except in case of abandonment, surrender, or as permitted in this chapter.

- [R.I. Gen. Laws § 34-18-34](https://webserver.rilegislature.gov/Statutes/TITLE34/34-18/34-18-34.htm)

  > If a landlord unlawfully removes or excludes the tenant from the premises or willfully diminishes services to the tenant by interrupting or causing the interruption of heat, running water, hot water, electric, gas, or other essential service, the tenant may recover possession or terminate the rental agreement and, in either case, recover an amount not more than three (3) months periodic rent or threefold the actual damages sustained by him or her, whichever is greater, and reasonable attorney’s fees.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `ri-prohibited-006` — Retaliation for complaints or tenant organizing

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per R.I. Gen. Laws § 34-18-46(a), a landlord may not retaliate — by raising rent, cutting services, or bringing/threatening an eviction — because the tenant complained to a code-enforcement agency, complained to the landlord of a § 34-18-22 violation, joined a tenants' union, or exercised other lawful rights. A lease clause that penalizes, fines, or threatens eviction for complaining or organizing is contrary to this section.

**Tenant-facing wording (shown in the app):** Your landlord can't punish you — with a rent hike, fewer services, or an eviction threat — for reporting bad conditions, complaining about repairs, or joining a tenants' group. A lease clause that fines or threatens you for doing so runs against Rhode Island's anti-retaliation law.

**Example clause this flags (illustrative):** *The Landlord may evict the Tenant in retaliation for any complaint the Tenant makes to a housing code agency or for joining a tenants' union.*

**Citations:**

- [R.I. Gen. Laws § 34-18-46(a)](https://webserver.rilegislature.gov/Statutes/TITLE34/34-18/34-18-46.htm)

  > Except as provided in this section, a landlord may not retaliate by increasing rent or decreasing services or by bringing or threatening to bring an action for possession because: (1) The tenant has complained to a governmental agency charged with responsibility for enforcement of a building or housing code of a violation applicable to the premises materially affecting health and safety; or (2) The tenant has complained to the landlord of a violation under § 34-18-22; or (3) The tenant has organized or become a member of a tenants’ union or similar organization ….

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

## Prohibited / regulated fees

> **Statute context:** Rhode Island fee rules, retrieved verbatim from the R.I. Legislature statute server (webserver.rilegislature.gov) on 2026-06-20. Sources (Title 34 Ch. 18): § 34-18-59 (Fair limitation on rental application fees — a landlord may not require a prospective tenant to pay a rental application fee; background/credit checks are limited to actual cost and only when the tenant has not supplied a recent one); § 34-18-61 (Convenience fees prohibited — no convenience fee may be charged on a rent payment, unless a no-fee payment method is also accepted); § 34-18-15(a)(1) (fees beyond rent must be disclosed in the lease in the same section as the rent disclosure). IMPORTANT: Rhode Island has NO statutory cap or prohibition on late fees (confirmed against the Ch. 18 index — there is no late-fee section), so NO late-fee 'illegal' rule is written here; doing so would invent law. ALL rules status=draft-unverified: must be reviewed by a Rhode Island tenant attorney / legal-aid clinic before public conclusions.

### `ri-fees-001` — Rental application fee charged to a prospective tenant

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per R.I. Gen. Laws § 34-18-59(a), a landlord, lessor, sub-lessor, real estate broker, property management company, or designee may not require or demand that a prospective tenant pay a rental application fee. (A background or credit check may be charged at no more than actual cost, and only when the applicant has not supplied a recent one — § 34-18-59(b).) A flat 'application fee' or 'processing fee' charged to apply is prohibited.

**Tenant-facing wording (shown in the app):** In Rhode Island a landlord can't charge you a fee just to apply for an apartment. They can pass on the actual cost of a background or credit check (and only if you didn't already give them a recent one) — but a flat application or processing fee isn't allowed.

**Example clause this flags (illustrative):** *Application Fee.*

**Citations:**

- [R.I. Gen. Laws § 34-18-59(a)](https://webserver.rilegislature.gov/Statutes/TITLE34/34-18/34-18-59.htm)

  > A landlord, lessor, sub-lessor, real estate broker, property management company, or designee shall not be allowed to require or demand any prospective tenant to pay for a rental application fee.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `ri-fees-002` — Convenience fee added to a rent payment

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per R.I. Gen. Laws § 34-18-61(a), a landlord may not charge a convenience fee on a tenant's rent payment. The only exception (§ 34-18-61(b)) is when the landlord also accepts a payment method that carries no such fee. A clause adding a surcharge, 'convenience fee', or processing fee to online/card rent payments without a free alternative is prohibited.

**Tenant-facing wording (shown in the app):** Your landlord can't tack a 'convenience fee' onto your rent — for example a surcharge for paying online or by card — unless they also give you a way to pay that has no fee.

**Example clause this flags (illustrative):** *A convenience fee of three percent (3%) shall be added to any rent payment made online or by card.*

**Citations:**

- [R.I. Gen. Laws § 34-18-61(a)](https://webserver.rilegislature.gov/Statutes/TITLE34/34-18/34-18-61.htm)

  > A landlord shall not charge a convenience fee to a tenant’s rental payment.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `ri-fees-003` — Undisclosed fees beyond rent

**Severity:** questionable (Worth checking (context-dependent))

**What the rule treats as wrong:** Per R.I. Gen. Laws § 34-18-15(a)(1), if fees beyond the rent apply to the unit, the lease must disclose them in the same section as the rent disclosure and indicate that additional fees may apply. A clause reserving the landlord's right to impose unspecified or undisclosed fees later runs against this disclosure requirement; under § 34-18-15(a)(5) a tenant may recover any fees that were not disclosed as required.

**Tenant-facing wording (shown in the app):** Any fees on top of rent have to be spelled out in the lease, right next to the rent. A clause that lets the landlord add 'such other fees as the landlord may impose' later, without listing them, isn't how Rhode Island requires fees to be disclosed — and you can claw back fees that weren't disclosed.

**Example clause this flags (illustrative):** *The Landlord reserves the right to impose additional fees from time to time as the Landlord may determine in its sole discretion.*

**Citations:**

- [R.I. Gen. Laws § 34-18-15(a)(1)](https://webserver.rilegislature.gov/Statutes/TITLE34/34-18/34-18-15.htm)

  > If there are fees beyond the rent that apply to the rental of a unit, the lease shall disclose those fees in the same section as the rent disclosure and shall indicate that additional fees may apply.

- [R.I. Gen. Laws § 34-18-15(a)(5)](https://webserver.rilegislature.gov/Statutes/TITLE34/34-18/34-18-15.htm)

  > If a landlord fails to comply with subsections (a)(1) — (a)(4) of this section, the tenant may recover any fees paid for the unit that were not disclosed as required.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

## Habitability & repairs

> **Statute context:** Rhode Island habitability rule, retrieved verbatim from the R.I. Legislature statute server (webserver.rilegislature.gov) on 2026-06-20, Title 34 Ch. 18 (Residential Landlord and Tenant Act). § 34-18-22(a)(2) makes it a mandatory landlord duty to make all repairs and do whatever is necessary to put and keep the premises in a fit and habitable condition; § 34-18-22(a)(1) requires compliance with building and housing codes affecting health and safety. § 34-18-17(a)(1) separately bars any rental-agreement provision by which the tenant waives or foregoes rights or remedies under the chapter, and § 34-18-17(b) makes such a provision unenforceable. Together these make an 'as-is' / habitability-waiver clause unenforceable in RI. status=draft-unverified: must be reviewed by a Rhode Island tenant attorney / legal-aid clinic before public conclusions.

### `ri-habitability-001` — "As-is" / waiver of the landlord's duty to keep the premises habitable

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per R.I. Gen. Laws § 34-18-22(a), the landlord must comply with health-and-safety building/housing codes and make all repairs necessary to put and keep the premises in a fit and habitable condition — a non-discretionary statutory duty. Because § 34-18-17(a)(1) bars (and § 34-18-17(b) makes unenforceable) any clause by which the tenant waives rights or remedies under the chapter, an 'as-is' clause or a waiver of the landlord's repair/habitability duty does not hold up.

**Tenant-facing wording (shown in the app):** You can't sign away your right to a livable home. Rhode Island makes it the landlord's job to keep the place up to code and in fit, habitable condition — so 'tenant accepts the unit as-is' or 'landlord has no duty to repair' clauses don't hold up.

**Example clause this flags (illustrative):** *The Tenant accepts the premises in its present condition as-is, and the Landlord shall have no duty to repair or maintain the premises.*

**Citations:**

- [R.I. Gen. Laws § 34-18-22(a)(1)-(2)](https://webserver.rilegislature.gov/Statutes/TITLE34/34-18/34-18-22.htm)

  > A landlord shall: (1) Comply with the requirements of applicable building and housing codes affecting health and safety; (2) Make all repairs and do whatever is necessary to put and keep the premises in a fit and habitable condition;

- [R.I. Gen. Laws § 34-18-17(a)(1)](https://webserver.rilegislature.gov/Statutes/TITLE34/34-18/34-18-17.htm)

  > A rental agreement may not provide that the tenant: (1) Agrees to waive or forego rights or remedies under this chapter;

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

## Landlord entry

> **Statute context:** Rhode Island landlord-access rules, retrieved verbatim from the R.I. Legislature statute server (webserver.rilegislature.gov) on 2026-06-20, Title 34 Ch. 18 (Residential Landlord and Tenant Act), § 34-18-26 (Access). § 34-18-26(c): except in an emergency or where impracticable, the landlord must give the tenant at least two (2) days' notice of intent to enter and may enter only at reasonable times. § 34-18-26(b): no-notice entry is allowed only in an emergency, or during a tenant absence over seven (7) days when reasonably necessary to protect the property. A lease clause letting the landlord enter at will / without notice, or with less than two days' notice for ordinary entries, conflicts with § 34-18-26. ALL rules status=draft-unverified: must be reviewed by a Rhode Island tenant attorney / legal-aid clinic before public conclusions.

### `ri-entry-001` — Landlord entry without notice or at will

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per R.I. Gen. Laws § 34-18-26(c), except in an emergency (or where giving notice is impracticable), the landlord must give the tenant at least two days' notice before entering and may enter only at reasonable times. A clause letting the landlord enter 'at any time', 'without notice', or 'at the landlord's discretion' for ordinary inspections, repairs, or showings conflicts with the two-day-notice requirement.

**Tenant-facing wording (shown in the app):** Outside of a real emergency, your landlord has to give you at least two days' notice before entering, and only at reasonable times. A lease that lets them come in 'at any time' or 'without notice' isn't what Rhode Island law allows.

**Example clause this flags (illustrative):** *The Landlord may enter the premises at any time and without notice for any purpose the Landlord deems appropriate.*

**Citations:**

- [R.I. Gen. Laws § 34-18-26(c)](https://webserver.rilegislature.gov/Statutes/TITLE34/34-18/34-18-26.htm)

  > A landlord shall not abuse the right of access or use it to harass the tenant. Except in case of emergency or unless it is impracticable to do so, the landlord shall give the tenant at least two (2) days’ notice of his or her intent to enter and may enter only at reasonable times.

- [R.I. Gen. Laws § 34-18-26(b)](https://webserver.rilegislature.gov/Statutes/TITLE34/34-18/34-18-26.htm)

  > A landlord may enter the dwelling unit without consent of the tenant in case of emergency, or, during any absence of the tenant in excess of seven (7) days, if reasonably necessary for the protection of the property.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

## Security deposits

> **Statute context:** Rhode Island security-deposit rules, retrieved verbatim from the R.I. General Assembly statute server (webserver.rilegislature.gov), R.I. Gen. Laws Title 34 Chapter 18 (Residential Landlord and Tenant Act), § 34-18-19 (Security deposits), retrieved 2026-06-20. § 34-18-19(a): a deposit may not exceed one month's periodic rent. § 34-18-19(b): within 20 days of the later of termination / delivery of possession / forwarding address, the landlord must deliver an itemized notice and the balance. § 34-18-19(c): wrongful withholding exposes the landlord to twice the amount withheld plus attorney fees. RI has no statutory interest-on-deposit requirement in § 34-18-19, so no interest rule is asserted. ALL rules status=draft-unverified: must be reviewed by a Rhode Island tenant attorney / legal-aid clinic before public conclusions.

### `ri-deposit-001` — Security deposit exceeds one month's rent

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per R.I. Gen. Laws § 34-18-19(a), a landlord may not demand or receive a security deposit (however it is labeled) greater than one month's periodic rent. A clause demanding two months, or first + last + a deposit on top, exceeds the statutory cap as to the excess.

**Tenant-facing wording (shown in the app):** In Rhode Island your security deposit can't be more than one month's rent, no matter what the lease calls it. If it asks for two months — or first, last, and a deposit on top — the extra isn't allowed.

**Example clause this flags (illustrative):** *The Tenant shall pay a security deposit of two months rent before taking possession.*

**Citations:**

- [R.I. Gen. Laws § 34-18-19(a)](https://webserver.rilegislature.gov/Statutes/TITLE34/34-18/34-18-19.htm)

  > A landlord may not demand or receive a security deposit, however denominated, in an amount or value in excess of one month’s periodic rent.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `ri-deposit-002` — No itemized return of the deposit within 20 days

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per R.I. Gen. Laws § 34-18-19(b), within 20 days after the later of termination, delivery of possession, or the tenant's giving a forwarding address, the landlord must deliver an itemized written notice of any deductions and return the balance. A clause setting a longer return window, or waiving itemization, conflicts with the statute.

**Tenant-facing wording (shown in the app):** After you move out and give a forwarding address, the landlord has 20 days to send you an itemized list of any deductions and return the rest. A lease that says they get 30, 45, or 60 days — or that they don't have to itemize — isn't enforceable.

**Example clause this flags (illustrative):** *The Landlord shall return the security deposit within sixty (60) days after the Tenant vacates the premises.*

**Citations:**

- [R.I. Gen. Laws § 34-18-19(b)](https://webserver.rilegislature.gov/Statutes/TITLE34/34-18/34-18-19.htm)

  > The landlord shall deliver the notice, together with the amount of the security deposit due to the tenant, within twenty (20) days after the later of either termination of the tenancy, delivery of possession, or the tenant’s providing the landlord with a forwarding address for the purpose of receiving the security deposit.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `ri-deposit-003` — Non-refundable security deposit

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Under R.I. Gen. Laws § 34-18-19 a security deposit must be returned, less itemized lawful deductions, within 20 days (§ 34-18-19(b)); wrongful withholding exposes the landlord to twice the amount withheld plus attorney fees (§ 34-18-19(c)). Labeling the deposit 'non-refundable' contradicts that scheme and is unenforceable.

**Tenant-facing wording (shown in the app):** A deposit isn't a fee — calling it 'non-refundable' doesn't make it so. You're owed it back (minus any itemized real deductions), and if the landlord wrongfully keeps it you can recover twice the amount plus attorney fees.

**Example clause this flags (illustrative):** *The security deposit is non-refundable and shall be retained by the Landlord as a condition of tenancy.*

**Citations:**

- [R.I. Gen. Laws § 34-18-19(c)](https://webserver.rilegislature.gov/Statutes/TITLE34/34-18/34-18-19.htm)

  > the tenant may recover the amount due him or her, together with damages in an amount equal to twice the amount wrongfully withheld, and reasonable attorney fees.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

*All rules `draft-unverified`. Generated from `rules/ri/*.json`by`scripts/build_review_packet.py` — regenerate after any rule change. LeaseLookout is not a law firm and this packet is not a request for legal advice to any individual; it is a request to review curated legal-information content for accuracy.*
