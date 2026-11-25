# LeaseLookout — Vermont ruleset for legal review

**Generated:**2026-06-20  ·**Jurisdiction:**Vermont (9 V.S.A. ch. 137)  ·**Rules:**13  ·**Status:** every rule is `draft-unverified` pending this review.

Severity mix: **12**illegal/unenforceable ·**1**worth-checking ·**0** informational.

## What LeaseLookout is

LeaseLookout is a free, tenant-side tool that reads a Vermont residential lease (PDF) and flags clauses that may be illegal or unenforceable, **each tied to a specific Vermont statute**. It presents legal *information*, not legal advice: the product states it is not a law firm, does not create an attorney-client relationship, shows every statute so the tenant can read the law themselves, and directs users to a tenant-rights attorney or a legal-aid clinic. It is invite-only and not public.

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
- **Prohibited / regulated fees** — 2 rule(s)
- **Habitability & repairs** — 1 rule(s)
- **Landlord entry** — 1 rule(s)
- **Security deposits** — 3 rule(s)

**Known gaps / candidate future rules (not yet in the set — flag any you'd prioritize):**

- No curated gap list for Vermont yet — please flag any common Vermont tenant protections you'd expect a lease-checker to cover that aren't addressed above.

## Rules at a glance

| ID | Title | Statute | Severity |
| --- | --- | --- | --- |
| `vt-prohibited-001` | "As-is" / waiver of the warranty of habitability | 9 V.S.A. § 4457(a)-(b) | illegal |
| `vt-prohibited-002` | Landlord exculpation / hold-harmless for unsafe conditions | 9 V.S.A. § 4457(a) | questionable |
| `vt-prohibited-003` | Self-help eviction / lockout (denying access except by court) | 9 V.S.A. § 4463(b)-(c) | illegal |
| `vt-prohibited-004` | Shutting off utilities to force the tenant out | 9 V.S.A. § 4463(a) | illegal |
| `vt-prohibited-005` | Penalty for complaining / waiver of the retaliation defense | 9 V.S.A. § 4465(a) | illegal |
| `vt-prohibited-006` | Blanket waiver of statutory tenant rights | 9 V.S.A. § 4454 | illegal |
| `vt-fees-001` | Application / screening fee to apply for a residential unit | 9 V.S.A. § 4456a(a) | illegal |
| `vt-fees-002` | Social Security number required to apply | 9 V.S.A. § 4456a(b) | illegal |
| `vt-habitability-001` | Disclaimer of the landlord's heat / hot-water duty | 9 V.S.A. § 4457(c) | illegal |
| `vt-entry-001` | Landlord entry without 48 hours' notice / at any time | 9 V.S.A. § 4460(b)-(c) | illegal |
| `vt-deposit-001` | Deposit-return deadline longer than 14 days | 9 V.S.A. § 4461(c) | illegal |
| `vt-deposit-002` | Non-refundable security deposit | 9 V.S.A. § 4461(a) | illegal |
| `vt-deposit-003` | Deposit automatically forfeited / kept as liquidated damages | 9 V.S.A. § 4461(b) | illegal |

---

## Terms prohibited in a rental agreement

> **Statute context:** Vermont statutory bars on residential lease terms (9 V.S.A. Chapter 137), retrieved verbatim from legislature.vermont.gov on 2026-06-20. § 4457(b): any provision waiving the implied warranty of habitability is contrary to public policy, unenforceable, and void. § 4463(a): no landlord may willfully cause interruption/termination of utility service (except temporary emergency repairs). § 4463(b)-(c): no landlord may deny a tenant access to the premises or to the tenant's property except through proper judicial process. § 4465: retaliation by changing lease terms or bringing/threatening an action against a tenant for complaining or organizing is prohibited. § 4454: any clause that circumvents the chapter's obligations and remedies is unenforceable and void. NOTE: Vermont's Chapter 137 contains NO express statutory bar on jury-trial waivers, confession-of-judgment, or one-way attorney-fee clauses in residential leases, so this file does NOT flag those (no Vermont primary source). All rules status=draft-unverified: review by a Vermont tenant attorney / legal-aid clinic before public conclusions.

### `vt-prohibited-001` — "As-is" / waiver of the warranty of habitability

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per 9 V.S.A. § 4457(a) every residential rental agreement carries an implied warranty that the premises are safe, clean, and fit for human habitation; § 4457(b) makes any provision by which the tenant waives that warranty contrary to public policy, unenforceable, and void. An 'as-is' or habitability-waiver clause does not hold up in Vermont.

**Tenant-facing wording (shown in the app):** You can't sign away your right to a livable home. In Vermont a clause saying you take the place 'as-is' or 'waive the warranty of habitability' is void — the landlord still owes you safe, clean, code-compliant housing.

**Example clause this flags (illustrative):** *The Tenant accepts the premises as-is and waives the warranty of habitability.*

**Citations:**

- [9 V.S.A. § 4457(a)-(b)](https://legislature.vermont.gov/statutes/section/09/137/04457)

  > In any residential rental agreement, the landlord shall be deemed to covenant and warrant to deliver over and maintain, throughout the period of the tenancy, premises that are safe, clean, and fit for human habitation … No rental agreement shall contain any provision by which the tenant waives the protections of the implied warranty of habitability. Any such waiver shall be deemed contrary to public policy and shall be unenforceable and void.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `vt-prohibited-002` — Landlord exculpation / hold-harmless for unsafe conditions

**Severity:** questionable (Worth checking (context-dependent))

**What the rule treats as wrong:** Vermont's implied warranty of habitability (9 V.S.A. § 4457(a)) obligates the landlord to deliver and maintain safe premises throughout the tenancy. A clause exculpating the landlord from liability for injury caused by unsafe conditions, or requiring the tenant to 'hold the landlord harmless,' tends to circumvent that obligation and may be unenforceable and void under § 4454. Flag for review of scope.

**Tenant-facing wording (shown in the app):** Your landlord has to keep the place safe. A clause saying they're 'not liable for any injury' or that you'll 'hold the landlord harmless' tries to sidestep that duty — in Vermont that may not hold up.

**Example clause this flags (illustrative):** *The Tenant shall hold the Landlord harmless, and the Landlord shall not be liable for any injury arising on the premises.*

**Citations:**

- [9 V.S.A. § 4457(a)](https://legislature.vermont.gov/statutes/section/09/137/04457)

  > In any residential rental agreement, the landlord shall be deemed to covenant and warrant to deliver over and maintain, throughout the period of the tenancy, premises that are safe, clean, and fit for human habitation and that comply with the requirements of applicable building, housing, and health regulations.

- [9 V.S.A. § 4454](https://legislature.vermont.gov/statutes/section/09/137/04454)

  > No rental agreement shall contain any provision that attempts to circumvent or circumvents obligations and remedies established by this chapter and any such provision shall be unenforceable and void.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `vt-prohibited-003` — Self-help eviction / lockout (denying access except by court)

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per 9 V.S.A. § 4463(b)-(c), no landlord may directly or indirectly deny a tenant access to and possession of the rented premises, or of the tenant's property, except through proper judicial process. A clause letting the landlord re-enter, retake possession, change the locks, or seize belongings 'without resort to court' is unenforceable.

**Tenant-facing wording (shown in the app):** A landlord can't lock you out, retake the unit, or grab your belongings to force you out — they have to go through court. A lease clause that says otherwise doesn't hold up in Vermont.

**Example clause this flags (illustrative):** *Upon default, the Landlord may re-enter and take possession of the premises without resort to court and may change the locks.*

**Citations:**

- [9 V.S.A. § 4463(b)-(c)](https://legislature.vermont.gov/statutes/section/09/137/04463)

  > No landlord may directly or indirectly deny a tenant access to and possession of the tenant’s rented or leased premises, except through proper judicial process. No landlord may directly or indirectly deny a tenant access to and possession of the tenant’s property, except through proper judicial process.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `vt-prohibited-004` — Shutting off utilities to force the tenant out

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per 9 V.S.A. § 4463(a), no landlord may willfully cause, directly or indirectly, the interruption or termination of any utility service being supplied to the tenant, except for temporary interruptions for emergency repairs. A clause letting the landlord shut off heat, water, or electricity over unpaid rent or any other dispute is unenforceable.

**Tenant-facing wording (shown in the app):** Your landlord can't cut off your heat, water, or power to pressure you — the only exception is a brief shut-off for emergency repairs. A lease clause allowing utility shut-offs is not enforceable in Vermont.

**Example clause this flags (illustrative):** *If rent is unpaid, the Landlord may shut off the utilities supplied to the Tenant until the balance is paid.*

**Citations:**

- [9 V.S.A. § 4463(a)](https://legislature.vermont.gov/statutes/section/09/137/04463)

  > No landlord may willfully cause, directly or indirectly, the interruption or termination of any utility service being supplied to the tenant, except for temporary interruptions for emergency repairs.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `vt-prohibited-005` — Penalty for complaining / waiver of the retaliation defense

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per 9 V.S.A. § 4465, a landlord may not retaliate — by changing lease terms or by bringing or threatening an action — against a tenant who complains to a housing/health agency, complains to the landlord of a chapter violation, or joins a tenants' union. A clause that fines a tenant for complaining, or makes the tenant waive the retaliation protections, circumvents § 4465 and is void under § 4454.

**Tenant-facing wording (shown in the app):** Your landlord can't punish you for reporting bad conditions or joining a tenants' group. A lease clause that charges you a penalty for complaining, or makes you give up your protection against retaliation, isn't allowed in Vermont.

**Example clause this flags (illustrative):** *The Tenant shall pay a one hundred dollar ($100) penalty for filing any complaint with a housing agency.*

**Citations:**

- [9 V.S.A. § 4465(a)](https://legislature.vermont.gov/statutes/section/09/137/04465)

  > A landlord of a residential dwelling unit may not retaliate by establishing or changing terms of a rental agreement or by bringing or threatening to bring an action against a tenant who: (1) has complained to a governmental agency charged with responsibility for enforcement of a building, housing, or health regulation … (2) has complained to the landlord of a violation of this chapter; or (3) has organized or become a member of a tenant’s union or similar organization.

- [9 V.S.A. § 4454](https://legislature.vermont.gov/statutes/section/09/137/04454)

  > No rental agreement shall contain any provision that attempts to circumvent or circumvents obligations and remedies established by this chapter and any such provision shall be unenforceable and void.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `vt-prohibited-006` — Blanket waiver of statutory tenant rights

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per 9 V.S.A. § 4454, no rental agreement may contain any provision that circumvents the obligations and remedies established by Chapter 137; any such provision is unenforceable and void. A clause in which the tenant 'waives all rights and remedies' under the residential rental statute is void on its face.

**Tenant-facing wording (shown in the app):** A lease can't make you sign away the protections Vermont's rental law gives you. A clause that says you 'waive all rights and remedies' under the landlord-tenant statute is void.

**Example clause this flags (illustrative):** *The Tenant waives all rights and remedies under the Vermont Residential Rental Agreements Act.*

**Citations:**

- [9 V.S.A. § 4454](https://legislature.vermont.gov/statutes/section/09/137/04454)

  > No rental agreement shall contain any provision that attempts to circumvent or circumvents obligations and remedies established by this chapter and any such provision shall be unenforceable and void.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

## Prohibited / regulated fees

> **Statute context:** Vermont up-front rental-charge rules under 9 V.S.A. § 4456a (Residential rental application), retrieved verbatim from legislature.vermont.gov on 2026-06-20 (amended 2025, No. 69, § 10, eff. July 1, 2025). § 4456a(a): a landlord may NOT charge any application fee to apply for a residential dwelling unit. § 4456a(b)(2): a landlord may not require a Social Security number to complete a residential rental application or refuse an application for lack of one. NOTE: Vermont's residential rental statute (Chapter 137) sets NO statutory cap or limit on late fees — § 4455 (payment of rent) is silent on late charges — so this file does NOT flag late fees; a separate Vermont primary source would be required before doing so. All rules status=draft-unverified: review by a Vermont tenant attorney / legal-aid clinic before public conclusions.

### `vt-fees-001` — Application / screening fee to apply for a residential unit

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per 9 V.S.A. § 4456a(a), a landlord or a landlord's agent may not charge any application fee to apply to enter into a rental agreement for a residential dwelling unit. A lease or application that demands an 'application fee', 'screening fee', or 'processing fee' to apply for a residential rental is unenforceable as to that charge.

**Tenant-facing wording (shown in the app):** In Vermont a landlord can't charge you anything just to apply for an apartment — application, screening, and processing fees for a residential rental are not allowed.

**Example clause this flags (illustrative):** *The Tenant shall pay a seventy-five dollar ($75) application fee before this application will be considered.*

**Citations:**

- [9 V.S.A. § 4456a(a)](https://legislature.vermont.gov/statutes/section/09/137/04456a)

  > A landlord or a landlord’s agent shall not charge an application fee to any individual in order to apply to enter into a rental agreement for a residential dwelling unit. This subsection shall not be construed to prohibit a person from charging a fee to a person in order to apply to rent commercial or nonresidential property.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `vt-fees-002` — Social Security number required to apply

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per 9 V.S.A. § 4456a(b)(2), a landlord or a landlord's agent may not require a Social Security number to complete a residential rental application or refuse an application because the applicant lacks one; the landlord must accept any unexpired government-issued ID, an Individual Taxpayer Identification Number, or a Social Security number (§ 4456a(b)(1)). A clause demanding a Social Security number as a condition of applying or renting is unenforceable.

**Tenant-facing wording (shown in the app):** A Vermont landlord can't make you give a Social Security number to apply, and can't turn you down for not having one. A government ID or an ITIN has to be accepted instead.

**Example clause this flags (illustrative):** *The Tenant must provide a Social Security number to complete the rental application.*

**Citations:**

- [9 V.S.A. § 4456a(b)](https://legislature.vermont.gov/statutes/section/09/137/04456a)

  > (1) In order to conduct a background or credit check, a landlord shall accept any of the following: (A) an original or a copy of any unexpired form of government-issued identification; (B) an Individual Taxpayer Identification Number; or (C) a Social Security number. (2) A landlord or a landlord’s agent shall not require a Social Security number for the completion of a residential rental application or refuse to accept an application due to the lack of a Social Security number.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

## Habitability & repairs

> **Statute context:** Vermont heat-and-water obligation under 9 V.S.A. § 4457(c) (Landlord obligations; habitability), retrieved verbatim from legislature.vermont.gov on 2026-06-20. § 4457(c) makes a reasonable amount of heat and an adequate connected supply of hot and cold water part of the implied warranty of habitability (except for summer-occupancy units and hunting camps). § 4457(b) makes any waiver of that warranty contrary to public policy, unenforceable, and void. status=draft-unverified: review by a Vermont tenant attorney / legal-aid clinic before public conclusions.

### `vt-habitability-001` — Disclaimer of the landlord's heat / hot-water duty

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per 9 V.S.A. § 4457(c), as part of the implied warranty of habitability the landlord must ensure heating facilities capable of safely providing a reasonable amount of heat and an adequate, connected supply of hot and cold water (the exception is summer-occupancy units and hunting camps). Under § 4457(b) any waiver of the warranty is void. A clause disclaiming responsibility for heat or hot water in a year-round home is unenforceable.

**Tenant-facing wording (shown in the app):** Heat and hot water are part of what your landlord must provide in Vermont for a year-round home. A lease clause saying the landlord 'is not responsible for heat or hot water' isn't enforceable.

**Example clause this flags (illustrative):** *The Landlord shall not be responsible for heat or hot water, which the Tenant shall arrange at the Tenant's sole expense.*

**Citations:**

- [9 V.S.A. § 4457(c)](https://legislature.vermont.gov/statutes/section/09/137/04457)

  > As part of the implied warranty of habitability, the landlord shall ensure that the dwelling unit has heating facilities that are capable of safely providing a reasonable amount of heat. … The landlord shall provide an adequate amount of water to each dwelling unit properly connected with hot and cold water lines.

- [9 V.S.A. § 4457(b)](https://legislature.vermont.gov/statutes/section/09/137/04457)

  > No rental agreement shall contain any provision by which the tenant waives the protections of the implied warranty of habitability. Any such waiver shall be deemed contrary to public policy and shall be unenforceable and void.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

## Landlord entry

> **Statute context:** Vermont landlord-access rules under 9 V.S.A. § 4460 (Access), retrieved verbatim from legislature.vermont.gov on 2026-06-20. § 4460(a): a landlord may enter with the tenant's consent, which shall not be unreasonably withheld. § 4460(b): for inspection, repairs, agreed services, or to show the unit, the landlord may enter only between 9:00 A.M. and 9:00 P.M. on no less than 48 hours' notice. § 4460(c): entry without consent or notice is allowed only on a reasonable belief of imminent danger to person or property. § 4454 voids clauses that circumvent the chapter. status=draft-unverified: review by a Vermont tenant attorney / legal-aid clinic before public conclusions.

### `vt-entry-001` — Landlord entry without 48 hours' notice / at any time

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per 9 V.S.A. § 4460, to inspect, make repairs, supply agreed services, or show the unit, a landlord may enter only between 9:00 A.M. and 9:00 P.M. on no less than 48 hours' notice; entry without notice is allowed only on a reasonable belief of imminent danger. A clause permitting entry 'at any time' or 'without notice' is unenforceable to that extent and void under § 4454.

**Tenant-facing wording (shown in the app):** Except in a real emergency, your Vermont landlord has to give at least 48 hours' notice and can only come in between 9 a.m. and 9 p.m. A lease letting them enter 'at any time' or 'without notice' doesn't hold up.

**Example clause this flags (illustrative):** *The Landlord may enter the premises at any time and without notice.*

**Citations:**

- [9 V.S.A. § 4460(b)-(c)](https://legislature.vermont.gov/statutes/section/09/137/04460)

  > A landlord may also enter the dwelling unit for the following purposes between the hours of 9:00 A.M. and 9:00 P.M. on no less than 48 hours’ notice: (1) when necessary to inspect the premises; (2) to make necessary or agreed repairs, alterations, or improvements; (3) to supply agreed services; or (4) to exhibit the dwelling unit to prospective or actual purchasers, mortgagees, tenants, workers, or contractors. … A landlord may only enter the dwelling unit without consent or notice when the landlord has a reasonable belief that there is imminent danger to any person or to property.

- [9 V.S.A. § 4454](https://legislature.vermont.gov/statutes/section/09/137/04454)

  > No rental agreement shall contain any provision that attempts to circumvent or circumvents obligations and remedies established by this chapter and any such provision shall be unenforceable and void.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

## Security deposits

> **Statute context:** Vermont security-deposit rules under 9 V.S.A. § 4461 (Security deposits), retrieved verbatim from legislature.vermont.gov on 2026-06-20. § 4461(a) defines a security deposit as money 'refundable to the tenant.' § 4461(b) lists the ONLY permissible deductions (unpaid rent; damage beyond normal wear and tear; unpaid utility/other charges owed the landlord; cost to remove abandoned articles). § 4461(c) requires the deposit plus a written itemized statement within 14 days of the landlord learning the tenant vacated (60 days for seasonal). § 4461(e): a landlord who misses the 14-day deadline forfeits the right to withhold any portion, and a willful failure is liable for double the amount wrongfully withheld plus attorney's fees. NOTE: Vermont has NO statutory cap on the deposit amount and NO statewide interest requirement — § 4461(g) lets a town authorize interest and bars an ordinance from limiting how a deposit is held — so this file does NOT flag deposit size, commingling, or absence of interest. § 4454 voids any clause that circumvents chapter obligations and remedies. All rules status=draft-unverified: review by a Vermont tenant attorney / legal-aid clinic before public conclusions.

### `vt-deposit-001` — Deposit-return deadline longer than 14 days

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per 9 V.S.A. § 4461(c), the landlord must return the security deposit together with a written itemized statement of any deductions within 14 days of learning the tenant vacated (60 days for a seasonal, non-primary-residence unit). A clause setting a longer window (e.g. 30, 45, or 60 days for a year-round home) is unenforceable to that extent, and under § 4461(e) a late landlord forfeits the right to withhold anything.

**Tenant-facing wording (shown in the app):** In Vermont your landlord has 14 days after you move out to send back your deposit with an itemized list of any deductions. A lease that gives them 30, 45, or 60 days for a regular home doesn't override the law — and if they blow the 14-day deadline, they lose the right to keep any of it.

**Example clause this flags (illustrative):** *The Landlord shall return the security deposit within sixty (60) days after the Tenant vacates the dwelling unit.*

**Citations:**

- [9 V.S.A. § 4461(c)](https://legislature.vermont.gov/statutes/section/09/137/04461)

  > A landlord shall return the security deposit along with a written statement itemizing any deductions to a tenant within 14 days from the date on which the landlord discovers that the tenant vacated or abandoned the dwelling unit or the date the tenant vacated the dwelling unit, provided the landlord received notice from the tenant of that date.

- [9 V.S.A. § 4461(e)](https://legislature.vermont.gov/statutes/section/09/137/04461)

  > If a landlord fails to return the security deposit with a statement within 14 days, the landlord forfeits the right to withhold any portion of the security deposit. If the failure is willful, the landlord shall be liable for double the amount wrongfully withheld, plus reasonable attorney’s fees and costs.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `vt-deposit-002` — Non-refundable security deposit

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per 9 V.S.A. § 4461(a) a security deposit is by definition money that is 'refundable to the tenant at the termination or expiration of the tenancy.' Labeling a deposit 'non-refundable' contradicts that definition and the itemized-return scheme of § 4461(c); under § 4454 any clause that circumvents the chapter's obligations is unenforceable and void.

**Tenant-facing wording (shown in the app):** A deposit isn't a fee. Vermont law defines it as money that comes back to you when the tenancy ends, minus any itemized deductions — so calling it 'non-refundable' doesn't make it so.

**Example clause this flags (illustrative):** *The security deposit shall be non-refundable.*

**Citations:**

- [9 V.S.A. § 4461(a)](https://legislature.vermont.gov/statutes/section/09/137/04461)

  > A security deposit is any advance, deposit, or prepaid rent, however named, which is refundable to the tenant at the termination or expiration of the tenancy.

- [9 V.S.A. § 4454](https://legislature.vermont.gov/statutes/section/09/137/04454)

  > No rental agreement shall contain any provision that attempts to circumvent or circumvents obligations and remedies established by this chapter and any such provision shall be unenforceable and void.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `vt-deposit-003` — Deposit automatically forfeited / kept as liquidated damages

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per 9 V.S.A. § 4461(b) a landlord may retain the deposit only for specific, itemizable reasons — unpaid rent, damage beyond normal wear and tear, unpaid utility or other charges owed the landlord, and the cost of removing abandoned articles — and must itemize them in writing under § 4461(c). A clause that automatically forfeits the deposit on early termination or any breach, or treats it as pre-set 'liquidated damages' regardless of actual loss, bypasses that scheme and is void under § 4454.

**Tenant-facing wording (shown in the app):** Your landlord can only keep your deposit for real, itemized reasons like unpaid rent or actual damage beyond ordinary wear. A clause that says the whole deposit is forfeited if you leave early or break a rule — no matter the actual cost — isn't allowed.

**Example clause this flags (illustrative):** *Security Deposit — Forfeiture.*

**Citations:**

- [9 V.S.A. § 4461(b)](https://legislature.vermont.gov/statutes/section/09/137/04461)

  > The landlord may retain all or a portion of the security deposit for: (1) nonpayment of rent; (2) damage to property of the landlord, unless the damage is the result of normal wear and tear or the result of actions or events beyond the control of the tenant; (3) nonpayment of utility or other charges that the tenant was required to pay directly to the landlord or to a utility; and (4) expenses required to remove from the rental unit articles abandoned by the tenant.

- [9 V.S.A. § 4454](https://legislature.vermont.gov/statutes/section/09/137/04454)

  > No rental agreement shall contain any provision that attempts to circumvent or circumvents obligations and remedies established by this chapter and any such provision shall be unenforceable and void.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

*All rules `draft-unverified`. Generated from `rules/vt/*.json`by`scripts/build_review_packet.py` — regenerate after any rule change. LeaseLookout is not a law firm and this packet is not a request for legal advice to any individual; it is a request to review curated legal-information content for accuracy.*
