# LeaseLookout — Maine ruleset for legal review

**Generated:**2026-06-20  ·**Jurisdiction:**Maine (14 M.R.S. ch. 710)  ·**Rules:**14  ·**Status:** every rule is `draft-unverified` pending this review.

Severity mix: **12**illegal/unenforceable ·**2**worth-checking ·**0** informational.

## What LeaseLookout is

LeaseLookout is a free, tenant-side tool that reads a Maine residential lease (PDF) and flags clauses that may be illegal or unenforceable, **each tied to a specific Maine statute**. It presents legal *information*, not legal advice: the product states it is not a law firm, does not create an attorney-client relationship, shows every statute so the tenant can read the law themselves, and directs users to a tenant-rights attorney or a legal-aid clinic. It is invite-only and not public.

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
- **Landlord entry** — 1 rule(s)
- **Security deposits** — 4 rule(s)

**Known gaps / candidate future rules (not yet in the set — flag any you'd prioritize):**

- No curated gap list for Maine yet — please flag any common Maine tenant protections you'd expect a lease-checker to cover that aren't addressed above.

## Rules at a glance

| ID | Title | Statute | Severity |
| --- | --- | --- | --- |
| `me-prohibited-001` | "As-is" / waiver of the warranty of habitability | 14 M.R.S. §6021(5) (Waiver) | illegal |
| `me-prohibited-002` | Landlord exculpation for its own negligence | 14 M.R.S. §6030(2)(A) (Unenforceable provisions) | illegal |
| `me-prohibited-003` | Self-help eviction (lockout, seizing property, cutting utilities) | 14 M.R.S. §6014(1) (Illegal evictions) | illegal |
| `me-prohibited-004` | Tenant must pay the landlord's legal fees (one-way fee clause) | 14 M.R.S. §6030(2)(B) (Unenforceable provisions) | illegal |
| `me-prohibited-005` | Lien on the tenant's property for rent | 14 M.R.S. §6030(2)(C) (Unenforceable provisions) | illegal |
| `me-prohibited-006` | Tenant acknowledges the lease terms are fair and reasonable | 14 M.R.S. §6030(2)(D) (Unenforceable provisions) | illegal |
| `me-fees-001` | Late fee exceeds 4% of one month's rent | 14 M.R.S. §6028(2) (Maximum penalty) | questionable |
| `me-fees-002` | Late fee charged before the 15-day grace period | 14 M.R.S. §6028(1) (Late payment) | illegal |
| `me-fees-003` | Up-front charges beyond first month's rent and the lawful deposit | 14 M.R.S. §6022-A(1) (Limit on amount required to initiate tenancy) | questionable |
| `me-entry-001` | Landlord entry without notice / at any time | 14 M.R.S. §6025(2) (Landlord obligations) | illegal |
| `me-deposit-001` | Security deposit exceeds two months' rent | 14 M.R.S. §6032 (Maximum security deposit) | illegal |
| `me-deposit-002` | Security deposit return deadline missing or too long | 14 M.R.S. §6033(2) (Return; time; retention) | illegal |
| `me-deposit-003` | Security deposit commingled / not held in trust | 14 M.R.S. §6038(1) (Treatment of security deposit) | illegal |
| `me-deposit-004` | Non-refundable security deposit | 14 M.R.S. §6036 (Waiver of provisions) | illegal |

---

## Terms prohibited in a rental agreement

> **Statute context:** Maine statutory bars on residential lease terms, retrieved verbatim from the Maine Legislature statute site (legislature.maine.gov) on 2026-06-20. 14 M.R.S. §6021(5) (waiver of the warranty of fitness for human habitation is void), §6030(2)(A) (provision absolving the landlord from liability for its own negligence is unenforceable), §6030(2)(B) (provision requiring the tenant to pay the landlord's legal fees in enforcing the lease is unenforceable), §6030(2)(C) (provision requiring a lien on the tenant's property for rent is unenforceable), §6030(2)(D) (provision requiring the tenant to acknowledge the lease terms are fair and reasonable is unenforceable), §6014 (evictions effected without resort to court process — including utility shutoffs, lockouts, or seizing the tenant's property — are illegal and against public policy). NOTE: Maine has no statute I could locate that bars a residential jury-trial waiver or a confession-of-judgment clause, so no such rule is authored here — never invent law. ALL rules status=draft-unverified: review by a Maine tenant attorney / Pine Tree Legal before publishing conclusions.

### `me-prohibited-001` — "As-is" / waiver of the warranty of habitability

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per 14 M.R.S. §6021(2), every residential rental carries an implied warranty that the unit is fit for human habitation, and §6021(5) makes any agreement (other than the narrow rent-reduction exception) by which the tenant waives those rights void. An 'as-is' or habitability-waiver clause is unenforceable.

**Tenant-facing wording (shown in the app):** You can't sign away your right to a livable home. 'Tenant accepts the unit as-is' or 'tenant waives the warranty of habitability' is void in Maine — the landlord still owes you a unit fit to live in.

**Example clause this flags (illustrative):** *The Tenant accepts the premises as-is and assumes all responsibility for their condition.*

**Citations:**

- [14 M.R.S. §6021(5) (Waiver)](https://legislature.maine.gov/statutes/14/title14sec6021.html)

  > Any agreement, other than as provided in this subsection, by a tenant to waive any of the rights or benefits provided by this section shall be void.

- [14 M.R.S. §6021(2) (Implied warranty of fitness for human habitation)](https://legislature.maine.gov/statutes/14/title14sec6021.html)

  > In any written or oral agreement for rental of a dwelling unit, the landlord shall be deemed to covenant and warrant that the dwelling unit is fit for human habitation.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `me-prohibited-002` — Landlord exculpation for its own negligence

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per 14 M.R.S. §6030(2)(A), a lease provision that absolves the landlord (or its agent) from liability for its own negligence is specifically declared unenforceable and an unfair trade practice. 'Landlord not liable' / 'hold harmless' / 'indemnify the landlord' clauses are unenforceable.

**Tenant-facing wording (shown in the app):** Your landlord can't use the lease to escape responsibility for harm caused by their own negligence. 'Landlord not liable for any injury', 'hold harmless', and 'indemnify the landlord' clauses are unenforceable in Maine.

**Example clause this flags (illustrative):** *The Tenant agrees to hold the Landlord harmless for any injury or damage occurring on the premises, whatever its cause.*

**Citations:**

- [14 M.R.S. §6030(2)(A) (Unenforceable provisions)](https://legislature.maine.gov/statutes/14/title14sec6030.html)

  > The following lease or tenancy at will agreement or rule provisions for a dwelling unit … are specifically declared to be unenforceable and in violation of Title 5, section 207: A. Any provision that absolves the landlord from liability for the negligence of the landlord or the landlord's agent ….

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `me-prohibited-003` — Self-help eviction (lockout, seizing property, cutting utilities)

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per 14 M.R.S. §6014, an eviction effected without resort to court process is illegal and against public policy; the landlord may not willfully interrupt utility service (§6014(1)(A)), deny the tenant access to or possession of the premises other than through proper judicial process (§6014(1)(B)), or seize the tenant's property other than by proper judicial process (§6014(1)(C)). A lease clause purporting to authorize any of this is unenforceable.

**Tenant-facing wording (shown in the app):** A landlord can't lock you out, shut off your utilities, or seize your belongings to force you out — they have to go to court. In Maine doing so is an illegal eviction, and any lease clause saying otherwise doesn't hold up.

**Example clause this flags (illustrative):** *Upon any default the Landlord may retake possession of the premises without resort to court, by any means the Landlord chooses.*

**Citations:**

- [14 M.R.S. §6014(1) (Illegal evictions)](https://legislature.maine.gov/statutes/14/title14sec6014.html)

  > Except as permitted by Title 15, chapter 517 or Title 17, chapter 91, evictions that are effected without resort to the provisions of this chapter are illegal and against public policy. Illegal evictions include, but are not limited to, the following. A. No landlord may willfully cause, directly or indirectly, the interruption or termination of any utility service being supplied to the tenant including, but not limited to, water, heat, light, electricity, gas, telephone, sewerage, elevator or refrigeration … B. No landlord may willfully seize, hold or otherwise directly or indirectly deny a tenant access to and possession of the tenant's rented or leased premises, other than through proper judicial process. C. No landlord may willfully seize, hold or otherwise directly or indirectly deny a tenant access to and possession of the tenant's property, other than by proper judicial process.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `me-prohibited-004` — Tenant must pay the landlord's legal fees (one-way fee clause)

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per 14 M.R.S. §6030(2)(B), a lease provision requiring the tenant to pay the landlord's legal fees in enforcing the lease is unenforceable and an unfair trade practice. (A narrow exception in §6030(3) allows prevailing-party fees only after a contested hearing in cases of wanton disregard of the lease.) A blanket clause making the tenant pay the landlord's attorney fees is unenforceable.

**Tenant-facing wording (shown in the app):** A clause that makes you cover the landlord's lawyer whenever they enforce the lease isn't enforceable in Maine. The only narrow exception is a prevailing-party fee a court awards after a contested hearing for wanton disregard of the lease.

**Example clause this flags (illustrative):** *In any dispute the Tenant shall pay the Landlord's attorney's fees and costs of enforcing this Lease.*

**Citations:**

- [14 M.R.S. §6030(2)(B) (Unenforceable provisions)](https://legislature.maine.gov/statutes/14/title14sec6030.html)

  > The following lease or tenancy at will agreement or rule provisions for a dwelling unit … are specifically declared to be unenforceable and in violation of Title 5, section 207: … B. Any provision that requires the tenant to pay the landlord's legal fees in enforcing the lease or tenancy at will agreement ….

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `me-prohibited-005` — Lien on the tenant's property for rent

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per 14 M.R.S. §6030(2)(C), a lease provision requiring the tenant to grant a lien on the tenant's property for rent or other sums due the landlord is unenforceable and an unfair trade practice. A clause giving the landlord a lien on, or the right to hold, the tenant's belongings as security is unenforceable.

**Tenant-facing wording (shown in the app):** A clause that puts a lien on your belongings — letting the landlord hold your property as security for rent — isn't enforceable in Maine.

**Example clause this flags (illustrative):** *As security for rent, the Tenant grants the Landlord a lien upon the tenant's property kept on the premises.*

**Citations:**

- [14 M.R.S. §6030(2)(C) (Unenforceable provisions)](https://legislature.maine.gov/statutes/14/title14sec6030.html)

  > The following lease or tenancy at will agreement or rule provisions for a dwelling unit … are specifically declared to be unenforceable and in violation of Title 5, section 207: … C. Any provision that requires the tenant to give a lien upon the tenant's property for the amount of any rent or other sums due the landlord ….

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `me-prohibited-006` — Tenant acknowledges the lease terms are fair and reasonable

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per 14 M.R.S. §6030(2)(D), a lease provision requiring the tenant to acknowledge that the provisions of the lease (including tenant rules) are fair and reasonable is unenforceable and an unfair trade practice. Such a boilerplate acknowledgment is unenforceable.

**Tenant-facing wording (shown in the app):** A clause that makes you sign off that the lease and its rules are 'fair and reasonable' is unenforceable in Maine — you don't waive anything by being made to say so.

**Example clause this flags (illustrative):** *The Tenant acknowledges that the provisions of this Lease, including all tenant rules, are fair and reasonable.*

**Citations:**

- [14 M.R.S. §6030(2)(D) (Unenforceable provisions)](https://legislature.maine.gov/statutes/14/title14sec6030.html)

  > The following lease or tenancy at will agreement or rule provisions for a dwelling unit … are specifically declared to be unenforceable and in violation of Title 5, section 207: … D. Any provision that requires the tenant to acknowledge that the provisions of the lease or tenancy at will agreement, including tenant rules, are fair and reasonable ….

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

## Prohibited / regulated fees

> **Statute context:** Maine fee rules, retrieved verbatim from the Maine Legislature statute site (legislature.maine.gov) on 2026-06-20. 14 M.R.S. §6028 (late-payment penalty: rent is not late until 15 days past due, and the penalty may not exceed 4% of one month's rent, and only if disclosed in writing at signing) and §6022-A (at the start of a tenancy a landlord may not require more than first month's rent + a security deposit capped by §6032 + a properly disclosed mandatory recurring fee). ALL rules status=draft-unverified: review by a Maine tenant attorney / Pine Tree Legal before publishing conclusions.

### `me-fees-001` — Late fee exceeds 4% of one month's rent

**Severity:** questionable (Worth checking (context-dependent))

**What the rule treats as wrong:** Per 14 M.R.S. §6028(2), a landlord may not assess a late-payment penalty that exceeds 4% of the amount due for one month. A late fee stated as a percentage above 4% is unenforceable to that extent. A flat-dollar late fee or a per-day penalty can also exceed the cap, but whether it does depends on the monthly rent, so those are flagged for review rather than asserted illegal.

**Tenant-facing wording (shown in the app):** Maine caps the late fee at 4% of one month's rent. A late fee set higher than 4% isn't allowed. A flat dollar amount or a daily charge might also break the cap depending on your rent — worth checking the math.

**Example clause this flags (illustrative):** *A late fee of 10% of the monthly rent shall be added to any rent payment not timely made.*

**Citations:**

- [14 M.R.S. §6028(2) (Maximum penalty)](https://legislature.maine.gov/statutes/14/title14sec6028.html)

  > A landlord may not assess a penalty for the late payment of rent which exceeds 4% of the amount due for one month.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `me-fees-002` — Late fee charged before the 15-day grace period

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per 14 M.R.S. §6028(1), rent is not 'late' until 15 days past its due date, and §6028(3) requires the late penalty to have been disclosed in writing at signing. A clause imposing a late fee the moment rent is one day (or fewer than 15 days) past due is unenforceable.

**Tenant-facing wording (shown in the app):** In Maine your rent isn't legally 'late' until 15 days after it's due, so a landlord can't charge a late fee on day one — and they can only charge one at all if it was spelled out in writing when you signed.

**Example clause this flags (illustrative):** *Rent is late if not paid by the first day of the month, and the late charge applies at that time.*

**Citations:**

- [14 M.R.S. §6028(1) (Late payment)](https://legislature.maine.gov/statutes/14/title14sec6028.html)

  > A payment of rent is late if it is not made within 15 days from the time the payment is due.

- [14 M.R.S. §6028(3) (Notice in writing)](https://legislature.maine.gov/statutes/14/title14sec6028.html)

  > A landlord may not assess a penalty for the late payment of rent unless the landlord gave the tenant written notice at the time they entered into the rental agreement that a penalty, up to 4% of one month's rent, may be charged for the late payment of rent.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `me-fees-003` — Up-front charges beyond first month's rent and the lawful deposit

**Severity:** questionable (Worth checking (context-dependent))

**What the rule treats as wrong:** Per 14 M.R.S. §6022-A, when a tenancy begins a landlord may not require an initial payment exceeding the first full month's rent, a security deposit capped by §6032, and any properly disclosed mandatory recurring fee. A separate up-front charge labeled 'move-in fee', 'last month's rent' on top of those, 'redecorating fee', or similar is suspect. Flag to check the purpose and total.

**Tenant-facing wording (shown in the app):** At move-in, the most a Maine landlord can require up front is your first month's rent, the security deposit (capped at two months), and any properly disclosed recurring fee. An extra move-in charge, redecorating fee, or 'last month's rent' stacked on top probably isn't allowed — check the total.

**Example clause this flags (illustrative):** *Move-In Charge.*

**Citations:**

- [14 M.R.S. §6022-A(1) (Limit on amount required to initiate tenancy)](https://legislature.maine.gov/statutes/14/title14sec6022-A.html)

  > Upon entering a lease or tenancy at will agreement, a landlord, landlord's agent or real estate broker may not require a tenant to pay an initial amount of money in excess of the total of the rent for the first full month of occupancy, a security deposit as limited by section 6032 and any mandatory recurring fee as defined in section 6000, subsection 1-A that is properly disclosed under section 6030-J.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

## Landlord entry

> **Statute context:** Maine landlord-entry rule, retrieved verbatim from the Maine Legislature statute site (legislature.maine.gov) on 2026-06-20. 14 M.R.S. §6025(2): except in an emergency or where impracticable, the landlord must give reasonable notice of intent to enter and may enter only at reasonable times, and 24 hours is presumed reasonable notice. §6025(4): any agreement by a tenant to waive these rights is against public policy and void. status=draft-unverified: review by a Maine tenant attorney / Pine Tree Legal before publishing conclusions.

### `me-entry-001` — Landlord entry without notice / at any time

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per 14 M.R.S. §6025(2), except in an emergency (or where giving notice is impracticable) the landlord must give reasonable notice of intent to enter and may enter only at reasonable times — 24 hours is presumed reasonable. §6025(4) makes any tenant waiver of these rights void as against public policy. A clause allowing entry 'at any time' or 'without notice' is unenforceable.

**Tenant-facing wording (shown in the app):** Except in an emergency, your landlord has to give you reasonable notice before entering — Maine treats 24 hours as reasonable — and can only come in at reasonable times. A lease letting them enter 'anytime' or 'without notice' is void.

**Example clause this flags (illustrative):** *The Landlord may enter the premises at any time without notice, for any purpose the Landlord considers appropriate.*

**Citations:**

- [14 M.R.S. §6025(2) (Landlord obligations)](https://legislature.maine.gov/statutes/14/title14sec6025.html)

  > Except in the case of emergency or if it is impracticable to do so, the landlord shall give the tenant reasonable notice of the landlord's intent to enter and shall enter only at reasonable times. Twenty-four hours is presumed to be a reasonable notice in the absence of evidence to the contrary.

- [14 M.R.S. §6025(4) (Waiver)](https://legislature.maine.gov/statutes/14/title14sec6025.html)

  > Any agreement by a tenant to waive any of the rights or benefits provided by this section is against public policy and is void.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

## Security deposits

> **Statute context:** Maine security-deposit rules, retrieved verbatim from the Maine Legislature statute site (legislature.maine.gov) on 2026-06-20. 14 M.R.S. ch. 710-A: §6032 (deposit may not exceed 2 months' rent), §6033 (return: 21 days for a tenancy at will / not more than 30 days for a written agreement, with an itemized written statement; otherwise the landlord forfeits the right to withhold), §6038 (deposit may not be commingled with the landlord's assets; held beyond the claim of creditors), §6036 (any waiver of a chapter 710-A tenant protection is against public policy and void). ALL rules status=draft-unverified: review by a Maine tenant attorney / Pine Tree Legal before publishing conclusions.

### `me-deposit-001` — Security deposit exceeds two months' rent

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per 14 M.R.S. §6032, a residential lease or tenancy-at-will agreement may not require a security deposit equivalent to more than two months' rent. A clause demanding three or more months as a deposit is unenforceable as to the excess.

**Tenant-facing wording (shown in the app):** In Maine your security deposit can't be more than two months' rent. If the lease asks for three months — or stacks deposits so the total runs past two months — the extra isn't enforceable.

**Example clause this flags (illustrative):** *The Tenant shall pay a security deposit equal to three months' rent before taking occupancy.*

**Citations:**

- [14 M.R.S. §6032 (Maximum security deposit)](https://legislature.maine.gov/statutes/14/title14sec6032.html)

  > A lease or tenancy at will agreement for a dwelling intended for human habitation may not require a security deposit equivalent to more than the rent for 2 months.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `me-deposit-002` — Security deposit return deadline missing or too long

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per 14 M.R.S. §6033, the landlord must return the deposit — or a written statement itemizing the reasons for any retention, with payment of the balance — within 21 days of a tenancy at will ending, or within the time stated in a written agreement, not to exceed 30 days. A clause giving the landlord more than 30 days (or 'a reasonable time' / no deadline) is unenforceable; missing the deadline forfeits the right to withhold any of the deposit.

**Tenant-facing wording (shown in the app):** After you move out, Maine gives the landlord a hard deadline to return your deposit or send an itemized list of deductions: 21 days for a month-to-month tenancy, and never more than 30 days under a written lease. A clause that stretches it past 30 days — or sets no deadline at all — doesn't hold up, and a landlord who blows the deadline loses the right to keep any of it.

**Example clause this flags (illustrative):** *Upon the end of the tenancy the Landlord shall return the deposit within sixty days, less any amounts the Landlord chooses to retain.*

**Citations:**

- [14 M.R.S. §6033(2) (Return; time; retention)](https://legislature.maine.gov/statutes/14/title14sec6033.html)

  > A landlord shall return to a tenant the full security deposit deposited with the landlord by the tenant or, if there is actual cause for retaining the security deposit or any portion of it, the landlord shall provide the tenant with a written statement itemizing the reasons for the retention of the security deposit or any portion of it: A. In the case of a written rental agreement, within the time, not to exceed 30 days, stated in the agreement; and B. In the case of a tenancy at will, within 21 days after the termination of the tenancy or the surrender and acceptance of the premises, whichever occurs later.

- [14 M.R.S. §6033(3) (Penalty)](https://legislature.maine.gov/statutes/14/title14sec6033.html)

  > If a landlord fails to provide a written statement or to return the security deposit within the time specified in subsection 2, the landlord shall forfeit his right to withhold any portion of the security deposit.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `me-deposit-003` — Security deposit commingled / not held in trust

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per 14 M.R.S. §6038, a security deposit may not be treated as an asset commingled with the landlord's assets; it must be held in a bank or financial-institution account beyond the claim of the landlord's creditors. A clause letting the landlord commingle, spend, or take ownership of the deposit is unenforceable.

**Tenant-facing wording (shown in the app):** Your deposit isn't the landlord's money to mix with their own. Maine requires it kept in a separate account, out of reach of the landlord's creditors. A clause letting them commingle it, spend it, or treat it as theirs isn't allowed.

**Example clause this flags (illustrative):** *The Landlord may commingle the deposit with the Landlord's own operating funds and use it as the Landlord sees fit.*

**Citations:**

- [14 M.R.S. §6038(1) (Treatment of security deposit)](https://legislature.maine.gov/statutes/14/title14sec6038.html)

  > During the term of a tenancy, a security deposit given to a landlord as part of a residential rental agreement may not be treated as an asset to be commingled with the assets of the landlord or any other entity or person. All security deposits received after October 1, 1979 must be held in an account of a bank or other financial institution under terms that place the security deposit beyond the claim of creditors of the landlord or any other entity or person, including a foreclosing mortgagee or trustee in bankruptcy ….

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `me-deposit-004` — Non-refundable security deposit

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Under 14 M.R.S. §6033 a deposit must be returned (less itemized lawful retention) within the statutory deadline, and §6036 makes any waiver of a chapter 710-A tenant protection void as against public policy. Labeling a security deposit 'non-refundable' purports to waive that return scheme and is unenforceable.

**Tenant-facing wording (shown in the app):** A deposit isn't a fee — calling it 'non-refundable' doesn't make it so. Maine law says you're owed it back (minus any itemized, lawful deductions), and a clause trying to waive that protection is void.

**Example clause this flags (illustrative):** *A non-refundable security deposit of $400 shall be retained by the Landlord in all events.*

**Citations:**

- [14 M.R.S. §6036 (Waiver of provisions)](https://legislature.maine.gov/statutes/14/title14sec6036.html)

  > Any provision, whether oral or written, in or pertaining to a lease or tenancy at will agreement whereby any provision of this chapter for the benefit of a tenant or members of the tenant's household is waived is against public policy and is void.

- [14 M.R.S. §6033(2) (Return; time; retention)](https://legislature.maine.gov/statutes/14/title14sec6033.html)

  > A landlord shall return to a tenant the full security deposit deposited with the landlord by the tenant or, if there is actual cause for retaining the security deposit or any portion of it, the landlord shall provide the tenant with a written statement itemizing the reasons for the retention of the security deposit or any portion of it ….

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

*All rules `draft-unverified`. Generated from `rules/me/*.json`by`scripts/build_review_packet.py` — regenerate after any rule change. LeaseLookout is not a law firm and this packet is not a request for legal advice to any individual; it is a request to review curated legal-information content for accuracy.*
