# LeaseLookout — New York ruleset for legal review

**Generated:**2026-06-20  ·**Jurisdiction:**New York (N.Y. RPL · GOL · RPAPL)  ·**Rules:**12  ·**Status:** every rule is `draft-unverified` pending this review.

Severity mix: **9**illegal/unenforceable ·**3**worth-checking ·**0** informational.

## What LeaseLookout is

LeaseLookout is a free, tenant-side tool that reads a New York residential lease (PDF) and flags clauses that may be illegal or unenforceable, **each tied to a specific New York statute**. It presents legal *information*, not legal advice: the product states it is not a law firm, does not create an attorney-client relationship, shows every statute so the tenant can read the law themselves, and directs users to a tenant-rights attorney or a legal-aid clinic. It is invite-only and not public.

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
- **Notice requirements** — 1 rule(s)
- **Security deposits** — 3 rule(s)

**Known gaps / candidate future rules (not yet in the set — flag any you'd prioritize):**

- No curated gap list for New York yet — please flag any common New York tenant protections you'd expect a lease-checker to cover that aren't addressed above.

## Rules at a glance

| ID | Title | Statute | Severity |
| --- | --- | --- | --- |
| `ny-prohibited-001` | "As-is" / waiver of the warranty of habitability | N.Y. Real Property Law § 235-b(1)-(2) | illegal |
| `ny-prohibited-002` | Landlord exculpation for its own negligence | N.Y. General Obligations Law § 5-321 | illegal |
| `ny-prohibited-003` | Waiver of jury trial (personal injury / property damage) | N.Y. Real Property Law § 259-c | illegal |
| `ny-prohibited-004` | Self-help eviction (lockout, seizing property, cutting utilities) | N.Y. Real Property Actions and Proceedings Law § 768 | illegal |
| `ny-prohibited-005` | Tenant owes all remaining rent on early termination (ignores duty to mitigate) | N.Y. Real Property Law § 227-e | illegal |
| `ny-prohibited-006` | Penalty for complaining, or retaliation waiver | N.Y. Real Property Law § 223-b(1), (5-a) | illegal |
| `ny-fees-001` | Application / screening fee over the $20 cap | N.Y. Real Property Law § 238-a(1)(b) | questionable |
| `ny-fees-002` | Late fee before 5 days, or over the statutory cap | N.Y. Real Property Law § 238-a(2) | questionable |
| `ny-notice-001` | Rent increase or non-renewal without statutory notice | N.Y. Real Property Law § 226-c | questionable |
| `ny-deposit-001` | Security deposit exceeds one month's rent | N.Y. General Obligations Law § 7-108(1-a)(a) | illegal |
| `ny-deposit-002` | Security deposit commingled / treated as the landlord's money | N.Y. General Obligations Law § 7-103 | illegal |
| `ny-deposit-003` | Non-refundable security deposit | N.Y. General Obligations Law § 7-108(1-a)(e) | illegal |

---

## Terms prohibited in a rental agreement

> **Statute context:** New York statutory bars on residential lease terms, retrieved verbatim from the NY State Senate legislation site (nysenate.gov) on 2026-06-17. These are non-waivable / void-as-against-public-policy provisions: RPL § 235-b(2) (habitability waiver void), GOL § 5-321 (landlord exculpation void), RPL § 259-c (jury-trial waiver null and void), RPAPL § 768 (self-help eviction is a crime), RPL § 227-e (mitigation-duty waiver void), RPL § 223-b (retaliation; complaint-penalty clause null and void). NY layers local law on top (NYC rent stabilization etc.) — this is the state baseline. ALL rules status=draft-unverified: must be reviewed by a New York tenant attorney / legal-aid clinic before public conclusions.

### `ny-prohibited-001` — "As-is" / waiver of the warranty of habitability

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per RPL § 235-b, every residential lease carries an implied warranty that the premises are fit for human habitation; § 235-b(2) makes any agreement waiving or modifying that warranty void as contrary to public policy. An 'as-is' or habitability-waiver clause is unenforceable.

**Tenant-facing wording (shown in the app):** You can't sign away your right to a livable home. 'Tenant accepts the unit as-is' or 'waives the warranty of habitability' is void in New York — the landlord still owes you a safe, habitable place.

**Example clause this flags (illustrative):** *The Tenant accepts the premises as-is and waives the warranty of habitability.*

**Citations:**

- [N.Y. Real Property Law § 235-b(1)-(2)](https://www.nysenate.gov/legislation/laws/RPP/235-B)

  > In every written or oral lease or rental agreement for residential premises the landlord or lessor shall be deemed to covenant and warrant that the premises so leased or rented … are fit for human habitation … Any agreement by a lessee or tenant of a dwelling waiving or modifying his rights as set forth in this section shall be void as contrary to public policy.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `ny-prohibited-002` — Landlord exculpation for its own negligence

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per GOL § 5-321, a lease covenant exempting the landlord from liability for injury to person or property caused by the landlord's negligence is void as against public policy and wholly unenforceable.

**Tenant-facing wording (shown in the app):** Your landlord can't use the lease to escape responsibility for harm caused by their own negligence. 'Landlord not liable for any injury' / 'hold harmless' clauses are void in New York.

**Example clause this flags (illustrative):** *The Tenant shall hold the Landlord harmless, and the Landlord shall not be liable for any injury caused by the Landlord's negligence.*

**Citations:**

- [N.Y. General Obligations Law § 5-321](https://www.nysenate.gov/legislation/laws/GOB/5-321)

  > Every covenant, agreement or understanding in or in connection with or collateral to any lease of real property exempting the lessor from liability for damages for injuries to person or property caused by or resulting from the negligence of the lessor, his agents, servants or employees, in the operation or maintenance of the demised premises … shall be deemed to be void as against public policy and wholly unenforceable.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `ny-prohibited-003` — Waiver of jury trial (personal injury / property damage)

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per RPL § 259-c, a lease provision waiving trial by jury in any action between landlord and tenant for personal injury or property damage is null and void.

**Tenant-facing wording (shown in the app):** A lease can't make you give up your right to a jury in a case about injury or property damage. That waiver is null and void in New York.

**Example clause this flags (illustrative):** *The Tenant waives the right to a trial by jury in any action for personal injury or property damage.*

**Citations:**

- [N.Y. Real Property Law § 259-c](https://www.nysenate.gov/legislation/laws/RPP/259-C)

  > Any provision in a lease, executed after the effective date of this act, that a trial by jury is waived in any action, proceeding or counterclaim brought by either of the parties thereto against the other in any action for personal injury or property damage, is null and void.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `ny-prohibited-004` — Self-help eviction (lockout, seizing property, cutting utilities)

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per RPAPL § 768, evicting or attempting to evict an occupant who has lawfully occupied a unit 30 days or longer — other than by court process — is unlawful, including by force, by changing/disabling the locks, by removing the occupant's possessions, or by interrupting essential services. It is a class A misdemeanor. A lease clause purporting to authorize any of this is unenforceable.

**Tenant-facing wording (shown in the app):** A landlord can't lock you out, take your belongings, or shut off your utilities to force you out — they have to go to court. In New York doing so is a crime, and any lease clause saying otherwise doesn't hold up.

**Example clause this flags (illustrative):** *Upon default, the Landlord may re-enter and take possession of the premises without resort to court, change the locks, and shut off utilities until the balance is paid.*

**Citations:**

- [N.Y. Real Property Actions and Proceedings Law § 768](https://www.nysenate.gov/legislation/laws/RPA/768)

  > It shall be unlawful for any person to evict or attempt to evict an occupant of a dwelling unit who has lawfully occupied the dwelling unit for thirty consecutive days or longer … by … (a) using or threatening the use of force … (b) … interruption or discontinuance of essential services … (c) removing the occupant's possessions … [or] removing, plugging or otherwise rendering the lock to such dwelling unit inoperable, or changing the lock … without supplying the occupant with a key. Any person who intentionally violates … this section shall be guilty of a class A misdemeanor.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `ny-prohibited-005` — Tenant owes all remaining rent on early termination (ignores duty to mitigate)

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per RPL § 227-e, when a tenant vacates early the landlord must in good faith take reasonable and customary actions to re-rent at fair market value (or the lease rate, whichever is lower); any lease provision exempting that duty is void as contrary to public policy. A clause making the tenant automatically liable for all remaining rent regardless of re-renting is unenforceable to that extent.

**Tenant-facing wording (shown in the app):** If you leave early, your landlord can't just bill you for every remaining month — New York requires them to make a real effort to re-rent the place, and a clause waiving that duty is void.

**Example clause this flags (illustrative):** *Upon early termination, the Tenant shall be liable for all remaining rent for the entire term, immediately due and payable.*

**Citations:**

- [N.Y. Real Property Law § 227-e](https://www.nysenate.gov/legislation/laws/RPP/227-E)

  > … the landlord shall, in good faith and according to the landlord's resources and abilities, take reasonable and customary actions to rent the premises at fair market value or at the rate agreed to during the term of the tenancy, whichever is lower. … Any provision in a lease that exempts a landlord's duty to mitigate damages under this section shall be void as contrary to public policy.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `ny-prohibited-006` — Penalty for complaining, or retaliation waiver

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per RPL § 223-b, a landlord may not retaliate against a tenant for a good-faith habitability complaint, for enforcing tenant rights, or for organizing; § 223-b(5-a) makes any lease provision that assesses a fee, penalty, or charge against a tenant for filing a bona-fide complaint null and void.

**Tenant-facing wording (shown in the app):** Your landlord can't punish you for complaining about conditions or joining a tenants' group. A lease clause that fines you for filing a complaint is null and void in New York.

**Example clause this flags (illustrative):** *The Tenant shall pay a one hundred dollar penalty for filing any complaint with a housing agency, and waives any claim of retaliation.*

**Citations:**

- [N.Y. Real Property Law § 223-b(1), (5-a)](https://www.nysenate.gov/legislation/laws/RPP/223-B)

  > No landlord … shall serve a notice to quit upon any tenant or commence any action to recover real property or summary proceeding to recover possession of real property in retaliation for [a good-faith complaint or enforcement of rights or tenant-organization activity]. … Any lease provision which seeks to assess a fee, penalty or dollar charge … against a tenant because such tenant files a bona fide complaint … shall be null and void.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

## Prohibited / regulated fees

> **Statute context:** New York fee caps (HSTPA 2019), retrieved verbatim from nysenate.gov on 2026-06-17. RPL § 238-a(1)(b): application background/credit-check fees capped at the actual cost or $20, whichever is less (and waived if the applicant supplies a recent report). RPL § 238-a(2): no late fee unless rent is more than 5 days late, and it may not exceed the lesser of $50 or 5% of the monthly rent. status=draft-unverified.

### `ny-fees-001` — Application / screening fee over the $20 cap

**Severity:** questionable (Worth checking (context-dependent))

**What the rule treats as wrong:** Per RPL § 238-a(1)(b), a landlord may charge only the actual cost of a background and credit check, capped at $20 (and not at all if the applicant provides their own recent report). A separate 'application', 'processing', or 'admin' fee, or a screening fee over $20, is not permitted. Flag to check the amount and purpose.

**Tenant-facing wording (shown in the app):** In New York the most a landlord can charge to screen you is $20 (the actual cost of a background + credit check) — and nothing if you hand over a recent report yourself. A bigger 'application' or 'processing' fee isn't allowed.

**Example clause this flags (illustrative):** *The Tenant shall pay a seventy-five dollar application fee.*

**Citations:**

- [N.Y. Real Property Law § 238-a(1)(b)](https://www.nysenate.gov/legislation/laws/RPP/238-A)

  > A landlord, lessor, sub-lessor or grantor may charge a fee or fees to reimburse costs associated with conducting a background check and credit check, provided the cumulative fee or fees for such checks is no more than the actual cost of the background check and credit check or twenty dollars, whichever is less ….

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `ny-fees-002` — Late fee before 5 days, or over the statutory cap

**Severity:** questionable (Worth checking (context-dependent))

**What the rule treats as wrong:** Per RPL § 238-a(2), a landlord may not demand a late fee unless rent is more than 5 days late, and the fee may not exceed the lesser of $50 or 5% of the monthly rent. Flag late-fee clauses to check the timing and amount.

**Tenant-facing wording (shown in the app):** A late fee can't kick in until rent is more than 5 days late, and it can't be more than $50 or 5% of your monthly rent, whichever is smaller. Watch for fees that hit sooner or run higher.

**Example clause this flags (illustrative):** *A late fee applies to rent received after the first of the month.*

**Citations:**

- [N.Y. Real Property Law § 238-a(2)](https://www.nysenate.gov/legislation/laws/RPP/238-A)

  > No landlord, lessor, sub-lessor or grantor may demand any payment, fee, or charge for the late payment of rent unless the payment of rent has not been made within five days of the date it was due, and such payment, fee, or charge shall not exceed fifty dollars or five percent of the monthly rent, whichever is less ….

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

## Notice requirements

> **Statute context:** New York advance-notice requirement for rent increases / non-renewal (HSTPA 2019), retrieved verbatim from nysenate.gov on 2026-06-17. RPL § 226-c: where a landlord will not renew or will raise rent by 5% or more, written notice is required — 30 days (occupancy/lease under 1 year), 60 days (1 to under 2 years), 90 days (2 years or more). status=draft-unverified.

### `ny-notice-001` — Rent increase or non-renewal without statutory notice

**Severity:** questionable (Worth checking (context-dependent))

**What the rule treats as wrong:** Per RPL § 226-c, a landlord who intends to raise rent by 5% or more, or not to renew, must give advance written notice scaled to how long the tenant has lived there: 30 days (under 1 year), 60 days (1 to under 2 years), or 90 days (2 years or more). A clause letting the landlord raise rent 'at any time' or on shorter notice conflicts with this. Flag to check the notice period.

**Tenant-facing wording (shown in the app):** Your landlord has to give you real warning before a rent hike of 5% or more — 30, 60, or 90 days depending on how long you've lived there. A clause saying rent can go up 'at any time' or with only a few days' notice doesn't match the law.

**Example clause this flags (illustrative):** *The Landlord may increase the rent at any time upon ten days notice.*

**Citations:**

- [N.Y. Real Property Law § 226-c](https://www.nysenate.gov/legislation/laws/RPP/226-C)

  > Whenever a landlord intends to offer to renew the tenancy with a rent increase equal to or greater than five percent … or the landlord does not intend to renew the tenancy, the landlord shall provide written notice … [at least] thirty days [if occupancy/lease is less than one year]; sixty days [one year or more but less than two years]; ninety days [two years or more].

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

## Security deposits

> **Statute context:** New York security-deposit rules, retrieved verbatim from nysenate.gov on 2026-06-17. GOL § 7-108(1-a)(a) (HSTPA 2019): deposit/advance may not exceed one month's rent for residential units. GOL § 7-108(1-a)(e): within 14 days of vacating, landlord must give an itemized statement and return the balance, or forfeit the right to retain any of it. GOL § 7-103: the deposit remains the tenant's money, held in trust, not to be commingled. status=draft-unverified.

### `ny-deposit-001` — Security deposit exceeds one month's rent

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per GOL § 7-108(1-a)(a), a residential security deposit or advance may not exceed one month's rent. A clause demanding more (e.g. two months, or first + last + security) is unenforceable as to the excess.

**Tenant-facing wording (shown in the app):** In New York a security deposit can't be more than one month's rent. If the lease asks for two months — or first, last, and a deposit on top — the extra isn't enforceable.

**Example clause this flags (illustrative):** *The Tenant shall pay a security deposit of two months' rent.*

**Citations:**

- [N.Y. General Obligations Law § 7-108(1-a)(a)](https://www.nysenate.gov/legislation/laws/GOB/7-108)

  > No deposit or advance shall exceed the amount of one month's rent, unless the deposit or advance is for a seasonal use dwelling unit … or … an owner-occupied cooperative apartment ….

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `ny-deposit-002` — Security deposit commingled / treated as the landlord's money

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per GOL § 7-103, a security deposit remains the tenant's money, must be held in trust, and may not be commingled with the landlord's funds or treated as the landlord's asset. A clause letting the landlord commingle or take ownership of the deposit is unenforceable.

**Tenant-facing wording (shown in the app):** Your deposit is still your money — the landlord just holds it in trust. A clause letting them mix it with their own funds or treat it as theirs isn't allowed.

**Example clause this flags (illustrative):** *The Landlord may commingle the security deposit with the Landlord's own funds, and the deposit shall become the property of the Landlord.*

**Citations:**

- [N.Y. General Obligations Law § 7-103](https://www.nysenate.gov/legislation/laws/GOB/7-103)

  > … such money … shall continue to be the money of the person making such deposit or advance and shall be held in trust by the person with whom such deposit or advance shall be made and shall not be mingled with the personal moneys or become an asset of the person receiving the same ….

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `ny-deposit-003` — Non-refundable security deposit

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** A security deposit is the tenant's money held in trust (GOL § 7-103) and must be returned, less itemized lawful deductions, within 14 days of vacating (GOL § 7-108(1-a)(e)). Labeling it 'non-refundable' contradicts that scheme and is unenforceable.

**Tenant-facing wording (shown in the app):** A deposit isn't a fee — calling it 'non-refundable' doesn't make it so. You're owed it back within 14 days of moving out, minus an itemized list of any real deductions.

**Example clause this flags (illustrative):** *The security deposit shall be non-refundable.*

**Citations:**

- [N.Y. General Obligations Law § 7-108(1-a)(e)](https://www.nysenate.gov/legislation/laws/GOB/7-108)

  > Within fourteen days after the tenant has vacated the premises, the landlord shall provide the tenant with an itemized statement indicating the basis for the amount of the deposit retained, if any, and shall return any remaining portion of the deposit to the tenant. If a landlord fails to provide the tenant with the statement and deposit within fourteen days, the landlord shall forfeit any right to retain any portion of the deposit.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

*All rules `draft-unverified`. Generated from `rules/ny/*.json`by`scripts/build_review_packet.py` — regenerate after any rule change. LeaseLookout is not a law firm and this packet is not a request for legal advice to any individual; it is a request to review curated legal-information content for accuracy.*
