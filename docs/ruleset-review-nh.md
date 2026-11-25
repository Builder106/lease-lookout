# LeaseLookout — New Hampshire ruleset for legal review

**Generated:**2026-06-20  ·**Jurisdiction:**New Hampshire (N.H. RSA 540 & 540-A)  ·**Rules:**13  ·**Status:** every rule is `draft-unverified` pending this review.

Severity mix: **11**illegal/unenforceable ·**2**worth-checking ·**0** informational.

## What LeaseLookout is

LeaseLookout is a free, tenant-side tool that reads a New Hampshire residential lease (PDF) and flags clauses that may be illegal or unenforceable, **each tied to a specific New Hampshire statute**. It presents legal *information*, not legal advice: the product states it is not a law firm, does not create an attorney-client relationship, shows every statute so the tenant can read the law themselves, and directs users to a tenant-rights attorney or a legal-aid clinic. It is invite-only and not public.

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

- **Terms prohibited in a rental agreement** — 4 rule(s)
- **Prohibited / regulated fees** — 2 rule(s)
- **Habitability & repairs** — 1 rule(s)
- **Landlord entry** — 1 rule(s)
- **Security deposits** — 5 rule(s)

**Known gaps / candidate future rules (not yet in the set — flag any you'd prioritize):**

- No curated gap list for New Hampshire yet — please flag any common New Hampshire tenant protections you'd expect a lease-checker to cover that aren't addressed above.

## Rules at a glance

| ID | Title | Statute | Severity |
| --- | --- | --- | --- |
| `nh-prohibited-001` | Self-help eviction / lockout (retaking possession without court process) | N.H. RSA 540-A:3, II | illegal |
| `nh-prohibited-002` | Shutting off utilities or essential services | N.H. RSA 540-A:3, I | illegal |
| `nh-prohibited-003` | Seizing the tenant's property without court process | N.H. RSA 540-A:3, III | illegal |
| `nh-prohibited-004` | Penalty for complaining or for meeting with other tenants (retaliation) | N.H. RSA 540:13-a | questionable |
| `nh-fees-001` | Application / screening fee not refunded when the unit is not rented | N.H. RSA 540-A:3, VIII | illegal |
| `nh-fees-002` | Rent payable only by electronic funds transfer | N.H. RSA 540-A:3, X | illegal |
| `nh-habitability-001` | "As-is" / waiver of habitability or of the duty to repair | N.H. RSA 540:13-d, I | questionable |
| `nh-entry-001` | Landlord may enter without notice or consent (non-emergency) | N.H. RSA 540-A:3, IV | illegal |
| `nh-deposit-001` | Security deposit exceeds one month's rent (or $100, whichever is greater) | N.H. RSA 540-A:6, I(a) | illegal |
| `nh-deposit-002` | Security deposit commingled / treated as the landlord's money | N.H. RSA 540-A:6, II(a) | illegal |
| `nh-deposit-003` | Non-refundable security deposit | N.H. RSA 540-A:5, II | illegal |
| `nh-deposit-004` | Deposit not returned / no itemized list within 30 days of termination | N.H. RSA 540-A:7, I | illegal |
| `nh-deposit-005` | Tenant waives interest on a deposit held one year or longer | N.H. RSA 540-A:6, IV(a) | illegal |

---

## Terms prohibited in a rental agreement

> **Statute context:** New Hampshire statutory bars on landlord conduct that leases sometimes purport to authorize, retrieved verbatim from the NH General Court statute site on 2026-06-20; citations use the canonical gc.nh.gov host (the legacy gencourt.state.nh.us URLs 301-redirect there). RSA 540-A:3, I: no landlord shall willfully cause interruption or termination of utility service (water, heat, light, electricity, gas, etc.), except for temporary repairs/emergencies. RSA 540-A:3, II: no landlord shall willfully seize, hold, or deny a tenant access to and possession of the leased premises other than through proper judicial process (self-help eviction / lockout). RSA 540-A:3, III: same bar for the tenant's property. RSA 540:13-a: retaliatory eviction is a defense where the tenant reported a violation, used RSA 540-A / 540:13-d, or met/gathered with other tenants. IMPORTANT SCOPE NOTE — New Hampshire has NO statute that voids a residential lease's jury-trial-waiver, confession-of-judgment, landlord-exculpation/hold-harmless, or one-way-attorney-fee clause (RSA 540-A:8, III voids waivers only within the security-deposit subdivision, RSA 540-A:5-8); rules for those terms are deliberately omitted rather than invented. Habitability waiver is handled in habitability.json. status=draft-unverified: must be reviewed by a NH tenant attorney / legal-aid clinic before public conclusions.

### `nh-prohibited-001` — Self-help eviction / lockout (retaking possession without court process)

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per RSA 540-A:3, II, a landlord may not willfully seize, hold, or otherwise deny a tenant access to and possession of the leased premises other than through proper judicial process. A clause letting the landlord re-enter, retake possession, change the locks, or remove the tenant 'without resort to legal process' is unenforceable.

**Tenant-facing wording (shown in the app):** A landlord can't lock you out or retake the unit to force you out — they have to go through the courts. A lease clause letting them re-enter and take possession 'without legal process' doesn't hold up in New Hampshire.

**Example clause this flags (illustrative):** *Upon any default, the Landlord may retake possession and lock out the Tenant without resort to legal process.*

**Citations:**

- [N.H. RSA 540-A:3, II](https://gc.nh.gov/rsa/html/LV/540-A/540-A-3.htm)

  > No landlord shall willfully seize, hold, or otherwise directly or indirectly deny a tenant access to and possession of such tenant's rented or leased premises, other than through proper judicial process.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `nh-prohibited-002` — Shutting off utilities or essential services

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per RSA 540-A:3, I, a landlord may not willfully cause, directly or indirectly, the interruption or termination of any utility service supplied to the tenant — water, heat, light, electricity, gas, telephone, sewerage, elevator, or refrigeration — except for temporary interruptions necessary while repairs are in process or during temporary emergencies. A clause letting the landlord cut off utilities or services (e.g. to enforce the lease or force a move-out) is unenforceable.

**Tenant-facing wording (shown in the app):** Your landlord can't shut off your heat, water, electricity, or other utilities to pressure you — even if the lease says they can. In New Hampshire the only allowed interruptions are short ones for actual repairs or emergencies.

**Example clause this flags (illustrative):** *The Landlord may shut off utilities, including heat, water, and electricity, upon any default by the Tenant.*

**Citations:**

- [N.H. RSA 540-A:3, I](https://gc.nh.gov/rsa/html/LV/540-A/540-A-3.htm)

  > No landlord shall willfully cause, directly or indirectly, the interruption or termination of any utility service being supplied to the tenant including, but not limited to water, heat, light, electricity, gas, telephone, sewerage, elevator or refrigeration, whether or not the utility service is under the control of the landlord, except for such temporary interruption as may be necessary while actual repairs are in process or during temporary emergencies.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `nh-prohibited-003` — Seizing the tenant's property without court process

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per RSA 540-A:3, III, a landlord may not willfully seize, hold, or otherwise deny a tenant access to and possession of the tenant's property other than by proper judicial process. A clause giving the landlord a lien on, or the right to seize or hold, the tenant's personal belongings for unpaid rent or other claims — outside of court — is unenforceable.

**Tenant-facing wording (shown in the app):** Your landlord can't grab or hold onto your belongings to cover what you owe — they need a court order. A lease clause claiming a 'lien' on your property or a right to seize it for back rent doesn't hold up in New Hampshire.

**Example clause this flags (illustrative):** *The Landlord shall have a lien on the tenant's personal property and may hold those belongings for any unpaid rent.*

**Citations:**

- [N.H. RSA 540-A:3, III](https://gc.nh.gov/rsa/html/LV/540-A/540-A-3.htm)

  > No landlord shall willfully seize, hold, or otherwise directly or indirectly deny a tenant access to and possession of such tenant's property, other than by proper judicial process.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `nh-prohibited-004` — Penalty for complaining or for meeting with other tenants (retaliation)

**Severity:** questionable (Worth checking (context-dependent))

**What the rule treats as wrong:** Per RSA 540:13-a, it is a defense to a possessory action that the eviction was in retaliation for the tenant reporting a suspected health/safety or RSA 540-A violation, using the procedures of RSA 540-A or RSA 540:13-d, or meeting or gathering with other tenants for any lawful purpose. A lease clause that purports to penalize, fine, or forbid a tenant for complaining about conditions or for joining/meeting with other tenants runs against this protection and is likely unenforceable; flagged as questionable because RSA 540:13-a frames the protection as an eviction defense rather than expressly voiding the clause.

**Tenant-facing wording (shown in the app):** New Hampshire protects you from being evicted in retaliation for reporting bad conditions, using the tenant-protection laws, or meeting with other tenants. A lease that tries to fine you for complaining — or forbids you from organizing with neighbors — pushes against that protection and likely won't hold up.

**Example clause this flags (illustrative):** *The Tenant shall pay a $250 fine for filing a complaint with any housing or code authority, and the Tenant shall not gather with other tenants for any purpose.*

**Citations:**

- [N.H. RSA 540:13-a](https://gc.nh.gov/rsa/html/LV/540/540-13-a.htm)

  > Except in cases in which the tenant owes the landlord the equivalent of one week's rent or more, it shall be a defense to any possessory action, as to residential property, that such possessory action was in retaliation for the tenant: I. Reporting a violation or reporting in good faith what the tenant reasonably believes to be a violation of RSA 540-A or an unreasonable and substantial violation of a regulation or housing code … II. Initiating an action in good faith pursuant to RSA 540-A or availing himself of the procedures of RSA 540:13-d; or III. Meeting or gathering with other tenants for any lawful purpose.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

## Prohibited / regulated fees

> **Statute context:** New Hampshire fee / up-front-charge rules, retrieved verbatim from the NH General Court statute site (gencourt.state.nh.us / gc.nh.gov) on 2026-06-20. NOTE on late fees: New Hampshire has NO statutory cap on residential late fees — the only RSA late-fee provision (RSA 451-C:7) governs self-service storage facilities, not residential leases — so this file deliberately contains NO late-fee rule (writing one would invent law). RSA 540-A:3, VIII requires written disclosure of any rental-application fee and refund of any amount beyond the actual documented background/credit-check and reasonable administrative cost within 30 days when the unit is not rented to the applicant. RSA 540-A:3, X bars requiring rent to be paid solely by electronic funds transfer. Enforcement: a violation of RSA 540-A:3, VIII is remediable under RSA 540-A:4 (return of the application monies). status=draft-unverified: must be reviewed by a NH tenant attorney / legal-aid clinic before public conclusions.

### `nh-fees-001` — Application / screening fee not refunded when the unit is not rented

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per RSA 540-A:3, VIII, before collecting any rental-application fee a landlord must disclose its amount in writing, and if the fee is collected but the unit is not rented to that applicant, the landlord must refund any amount beyond the actual documented cost of the background check, credit check, and/or reasonable administrative costs within 30 days. A clause making an application or screening fee flatly non-refundable contradicts that.

**Tenant-facing wording (shown in the app):** If you pay an application or screening fee and don't get the unit, New Hampshire makes the landlord refund whatever was left over after the real cost of running your background and credit check — within 30 days. A lease line calling the application fee 'non-refundable' overstates what they can keep.

**Example clause this flags (illustrative):** *The Tenant paid a non-refundable application fee, which the Landlord shall retain in full whether or not the unit is rented to the Tenant.*

**Citations:**

- [N.H. RSA 540-A:3, VIII](https://gc.nh.gov/rsa/html/LV/540-A/540-A-3.htm)

  > Prior to collecting any fee as part of the rental application or renewal process, the landlord shall clearly disclose, in writing to prospective tenants, the amount of the fee and the requirement for a satisfactory criminal background and credit check, if any. If such fee is collected from an applicant, but the unit is not rented to that applicant, the landlord shall return any amount beyond the actual cost of the documented background check, credit check, and/or reasonable administrative costs to the applicant within 30 days of receipt.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `nh-fees-002` — Rent payable only by electronic funds transfer

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per RSA 540-A:3, X, a landlord may not require a tenant or prospective tenant to pay any amount due under a residential lease solely via electronic funds transfer (including automatic recurring transfers) and must allow at least one other non-electronic form of payment. A clause requiring rent to be paid only by autopay / ACH / electronic transfer is unlawful.

**Tenant-facing wording (shown in the app):** Your landlord can't force you to pay rent only through autopay or an electronic transfer — New Hampshire requires them to accept at least one non-electronic option too. A lease that says rent must be paid solely by electronic transfer isn't allowed.

**Example clause this flags (illustrative):** *Rent must be paid solely by electronic funds transfer through the Landlord's automatic recurring autopay portal, and no other form of payment will be accepted.*

**Citations:**

- [N.H. RSA 540-A:3, X](https://gc.nh.gov/rsa/html/LV/540-A/540-A-3.htm)

  > A landlord shall not require a tenant or prospective tenant to pay any amount due under a residential lease, renewal, or extension agreement solely via electronic funds transfer, including, but not limited to, any automatic, recurring electronic funds transfers. The landlord shall allow at least one other non-electronic form of payment for the purposes of this section.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

## Habitability & repairs

> **Statute context:** New Hampshire habitability rules, retrieved verbatim from the NH General Court statute site (gencourt.state.nh.us / gc.nh.gov) on 2026-06-20. RSA 540:13-d establishes a statutory defense to a nonpayment eviction where the premises are in substantial violation of the standards of fitness for health and safety in RSA 48-A (or local codes) and that violation materially affects habitability. RSA 540-A:4, VII(b) recognizes a damages claim for 'breach of warranty of habitability' and 'breach of the covenant of quiet enjoyment.' IMPORTANT — unlike New York's RPL 235-b(2), New Hampshire has NO statute that expressly declares a habitability-waiver / 'as-is' clause VOID; the protection is framed as an eviction defense and a damages claim. The habitability-waiver rule below is therefore severity 'questionable,' not 'illegal,' and its description does not overstate the statute. status=draft-unverified: must be reviewed by a NH tenant attorney / legal-aid clinic before public conclusions.

### `nh-habitability-001` — "As-is" / waiver of habitability or of the duty to repair

**Severity:** questionable (Worth checking (context-dependent))

**What the rule treats as wrong:** New Hampshire law gives a tenant a statutory defense to a nonpayment eviction when the premises substantially violate the health-and-safety fitness standards and that materially affects habitability (RSA 540:13-d), and recognizes a damages claim for breach of the warranty of habitability (RSA 540-A:4, VII(b)). A clause in which the tenant accepts the unit 'as-is' or waives habitability / the landlord's duty to repair attempts to contract around those protections. Flagged as questionable because no New Hampshire statute expressly declares such a waiver void (contrast NY RPL 235-b), so a court — not this tool — decides enforceability.

**Tenant-facing wording (shown in the app):** New Hampshire lets you withhold rent or claim damages when a home is unfit for health and safety, and recognizes a warranty of habitability. A lease line saying you accept the place 'as-is' or give up your right to a habitable home tries to sidestep that — it's worth questioning, though a court has the final say.

**Example clause this flags (illustrative):** *The Tenant accepts the premises as-is and waives the implied warranty of habitability and any duty of the Landlord to make repairs.*

**Citations:**

- [N.H. RSA 540:13-d, I](https://gc.nh.gov/rsa/html/LV/540/540-13-d.htm)

  > No action for possession based on nonpayment of rent shall be maintained in regard to any premises leased or rented for residential purposes, other than for vacation or recreation, if such premises are in substantial violation of the standards of fitness for health and safety set forth in RSA 48-A or in local codes, ordinances or bylaws established pursuant thereto, and such violation materially affects the habitability of said premises

- [N.H. RSA 540-A:4, VII(b)](https://gc.nh.gov/rsa/html/LV/540-A/540-A-4.htm)

  > An award of damages to the plaintiff for the violations of RSA 540-A, breach of warranty of habitability, breach of the covenant of quiet enjoyment or any other claim arising out of the facts alleged in the plaintiff's petition.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

## Landlord entry

> **Statute context:** New Hampshire landlord-entry rules, retrieved verbatim from the NH General Court statute site (gc.nh.gov; the legacy gencourt.state.nh.us host now 301-redirects here) on 2026-06-20. RSA 540-A:3, IV: no landlord shall willfully enter the tenant's premises without prior consent, other than to make emergency repairs. RSA 540-A:3, V-d: a landlord may enter without consent ONLY to make emergency repairs (paragraphs IV and IV-a) or under a court order obtained pursuant to RSA 540-A:4. Enforcement: a violation of RSA 540-A:3 is actionable under RSA 540-A:4 and carries the consumer-protection remedies of RSA 358-A:10. status=draft-unverified: must be reviewed by a NH tenant attorney / legal-aid clinic before public conclusions.

### `nh-entry-001` — Landlord may enter without notice or consent (non-emergency)

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per RSA 540-A:3, IV, a landlord may not willfully enter the tenant's premises without prior consent, except to make emergency repairs. A clause giving the landlord a right to enter at will, at any time, or without notice or consent for ordinary (non-emergency) purposes — inspections, showings, maintenance — contradicts the statute.

**Tenant-facing wording (shown in the app):** Outside a real emergency, your landlord can't just let themselves in — New Hampshire requires your prior consent. A lease line saying they may enter 'at any time' or 'without notice' for inspections or showings doesn't hold up.

**Example clause this flags (illustrative):** *The Landlord may enter the premises at any time without prior notice or consent to inspect, show, or maintain the unit.*

**Citations:**

- [N.H. RSA 540-A:3, IV](https://gc.nh.gov/rsa/html/LV/540-A/540-A-3.htm)

  > No landlord shall willfully enter into the premises of the tenant without prior consent, other than to make emergency repairs.

- [N.H. RSA 540-A:3, V-d](https://gc.nh.gov/rsa/html/LV/540-A/540-A-3.htm)

  > Notwithstanding any other provision of this chapter, a landlord may only enter a tenant's dwelling unit without the consent of the tenant: (a) To make emergency repairs pursuant to paragraphs IV and IV-a; or (b) If the landlord has obtained an order authorizing the entry from a court of competent jurisdiction pursuant to RSA 540-A:4.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

## Security deposits

> **Statute context:** New Hampshire security-deposit rules, retrieved verbatim from the NH General Court statute site (gc.nh.gov; the legacy gencourt.state.nh.us host now 301-redirects here) on 2026-06-20. RSA 540-A:6, I(a): a landlord shall not demand or receive a security deposit exceeding one month's rent or $100, whichever is greater. RSA 540-A:5, II: 'security deposit' means ALL funds in excess of monthly rent transferred to the landlord for any purpose (so a 'non-refundable' deposit is still a deposit). RSA 540-A:6, II(a): the deposit continues to be the tenant's money, held in trust, and shall not be mingled with the landlord's money or become his asset. RSA 540-A:6, IV(a): deposit held one year or longer accrues interest. RSA 540-A:7, I: return + written itemized list of damages within 30 days of termination. RSA 540-A:8, III: any lease provision purporting to waive these rights is void. status=draft-unverified: must be reviewed by a NH tenant attorney / legal-aid clinic before public conclusions.

### `nh-deposit-001` — Security deposit exceeds one month's rent (or $100, whichever is greater)

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per RSA 540-A:6, I(a), a landlord may not demand or receive a security deposit greater than one month's rent or $100, whichever is greater. A clause requiring two months' rent, or first + last + a security deposit on top, exceeds the cap.

**Tenant-facing wording (shown in the app):** In New Hampshire your security deposit can't be more than one month's rent (or $100, if that's higher). If the lease asks for two months — or first, last, and a deposit on top — that's over the legal limit.

**Example clause this flags (illustrative):** *The Tenant shall pay a security deposit equal to two months' rent before taking occupancy.*

**Citations:**

- [N.H. RSA 540-A:6, I(a)](https://gc.nh.gov/rsa/html/LV/540-A/540-A-6.htm)

  > A landlord shall not demand or receive any security deposit in an amount or value in excess of one month's rent or $100, whichever is greater.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `nh-deposit-002` — Security deposit commingled / treated as the landlord's money

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per RSA 540-A:6, II(a), a security deposit continues to be the tenant's money, must be held in trust, and shall not be mingled with the landlord's personal money or become an asset of the landlord. A clause letting the landlord commingle the deposit or treat it as his own funds contradicts the statute.

**Tenant-facing wording (shown in the app):** Your deposit is still your money — the landlord just holds it in trust. A clause letting them mix it with their own funds or treat it as theirs isn't allowed in New Hampshire.

**Example clause this flags (illustrative):** *The Landlord may commingle the deposit with the Landlord's own operating funds and treat it as the Landlord's property.*

**Citations:**

- [N.H. RSA 540-A:6, II(a)](https://gc.nh.gov/rsa/html/LV/540-A/540-A-6.htm)

  > Security deposits held by a landlord continue to be the money of the tenant and shall be held in trust by the person with whom such deposit is made and shall not be mingled with the personal moneys or become an asset of the landlord until the provisions of RSA 540-A:7 are complied with

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `nh-deposit-003` — Non-refundable security deposit

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per RSA 540-A:5, II, a 'security deposit' is ALL funds in excess of the monthly rent transferred to the landlord for any purpose. Such funds remain the tenant's money held in trust (RSA 540-A:6, II(a)) and must be returned, less an itemized list of lawful deductions, within 30 days of termination (RSA 540-A:7, I); RSA 540-A:8, III voids any waiver. Labeling a deposit 'non-refundable' purports to waive that return right and is void.

**Tenant-facing wording (shown in the app):** Calling a deposit 'non-refundable' doesn't make it a fee. Any money beyond your monthly rent is treated as a deposit you're owed back within 30 days of moving out, minus an itemized list of real damage — and the lease can't sign that right away.

**Example clause this flags (illustrative):** *This is a non-refundable security deposit and no portion of it will be returned at the end of the tenancy.*

**Citations:**

- [N.H. RSA 540-A:5, II](https://gc.nh.gov/rsa/html/LV/540-A/540-A-5.htm)

  > "Security deposit" means all funds in excess of the monthly rent which are transferred from the tenant to the landlord for any purpose.

- [N.H. RSA 540-A:8, III](https://gc.nh.gov/rsa/html/LV/540-A/540-A-8.htm)

  > Any provision in any lease or rental agreement by which the tenant is purported to waive any of his rights under this subdivision, except as provided in RSA 540-A:6, III(d), shall be void.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `nh-deposit-004` — Deposit not returned / no itemized list within 30 days of termination

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per RSA 540-A:7, I, a landlord must return the security deposit and pay any interest due within 30 days of the termination of the tenancy, and where damages are claimed must give the tenant a written, itemized list. A clause setting a longer return window, or letting the landlord keep the deposit without an itemized accounting, conflicts with the statute (and RSA 540-A:8, III voids the waiver).

**Tenant-facing wording (shown in the app):** Your landlord has 30 days after the tenancy ends to return your deposit, and if they keep any of it they have to give you an itemized written list of the damages. A lease that gives them 60 days, or lets them keep it with no breakdown, doesn't override that.

**Example clause this flags (illustrative):** *The Landlord shall return any remaining deposit within sixty (60) days after the tenancy ends.*

**Citations:**

- [N.H. RSA 540-A:7, I](https://gc.nh.gov/rsa/html/LV/540-A/540-A-7.htm)

  > a landlord shall return a security deposit to a tenant and pay the interest due, if any, within 30 days from the termination of the tenancy. If there are any damages to the premises, excluding reasonable wear and tear, the landlord may deduct the costs of repair from the security deposit. The landlord shall provide the tenant with a written, itemized list of any damages for which the landlord claims the tenant is liable

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `nh-deposit-005` — Tenant waives interest on a deposit held one year or longer

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per RSA 540-A:6, IV(a), a landlord holding a security deposit for one year or longer must pay the tenant interest at the rate paid on regular savings accounts at the bank where it is held. RSA 540-A:8, III voids any lease provision purporting to waive that right. A clause stating the deposit earns no interest, or that the tenant waives interest, is void.

**Tenant-facing wording (shown in the app):** If your landlord holds your deposit for a year or more, they owe you interest on it. A lease line saying 'the deposit bears no interest' or 'tenant waives any interest' doesn't hold up in New Hampshire.

**Example clause this flags (illustrative):** *The deposit shall bear no interest regardless of how long the Landlord holds it.*

**Citations:**

- [N.H. RSA 540-A:6, IV(a)](https://gc.nh.gov/rsa/html/LV/540-A/540-A-6.htm)

  > A landlord who holds a security deposit for a period of one year or longer shall pay to the tenant interest on the deposit at a rate equal to the interest rate paid on regular savings accounts in the New Hampshire bank, savings and loan association, or credit union in which it is deposited

- [N.H. RSA 540-A:8, III](https://gc.nh.gov/rsa/html/LV/540-A/540-A-8.htm)

  > Any provision in any lease or rental agreement by which the tenant is purported to waive any of his rights under this subdivision, except as provided in RSA 540-A:6, III(d), shall be void.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

*All rules `draft-unverified`. Generated from `rules/nh/*.json`by`scripts/build_review_packet.py` — regenerate after any rule change. LeaseLookout is not a law firm and this packet is not a request for legal advice to any individual; it is a request to review curated legal-information content for accuracy.*
