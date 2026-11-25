# LeaseLookout — Connecticut ruleset for legal review

**Generated:**2026-06-20  ·**Jurisdiction:**Connecticut (Conn. Gen. Stat. ch. 830–831, § 47a)  ·**Rules:**23  ·**Status:** every rule is `draft-unverified` pending this review.

Severity mix: **16**illegal/unenforceable ·**6**worth-checking ·**1** informational.

## What LeaseLookout is

LeaseLookout is a free, tenant-side tool that reads a Connecticut residential lease (PDF) and flags clauses that may be illegal or unenforceable, **each tied to a specific Connecticut statute**. It presents legal *information*, not legal advice: the product states it is not a law firm, does not create an attorney-client relationship, shows every statute so the tenant can read the law themselves, and directs users to a tenant-rights attorney or a legal-aid clinic. It is invite-only and not public.

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

- **§ 47a-4 — Terms prohibited in a rental agreement** — 9 rule(s)
- **§ 47a-4c — Payment method** — 1 rule(s)
- **§ 47a-4d — Prohibited pre-tenancy fees** — 2 rule(s)
- **§ 47a-7 — Habitability & repairs** — 2 rule(s)
- **§ 47a-7c — Pre-occupancy walk-through** — 1 rule(s)
- **§ 47a-11a — Early termination & duty to mitigate** — 1 rule(s)
- **§ 47a-13 — Essential services** — 1 rule(s)
- **§ 47a-16 — Landlord entry** — 1 rule(s)
- **§ 47a-21 — Security deposits** — 4 rule(s)
- **§ 47a-21(d) — Deposit deductions & return** — 1 rule(s)

**Known gaps / candidate future rules (not yet in the set — flag any you'd prioritize):**

- § 47a-20 — retaliatory action/eviction (clauses penalizing complaints or organizing)
- § 47a-4e — notice of rent increases
- § 47a-7a / 47a-7b — bed-bug responsibilities; lock changes for protected persons
- Jury-trial waiver framed separately from the general § 47a-4(a)(1) waiver rule
- Automatic-renewal / holdover clauses

## Rules at a glance

| ID | Title | Statute | Severity |
| --- | --- | --- | --- |
| `ct-prohibited-001` | Waiver of the tenant's legal rights or remedies | Conn. Gen. Stat. § 47a-4(a)(1) & (b) | illegal |
| `ct-prohibited-002` | Confession of judgment | Conn. Gen. Stat. § 47a-4(a)(2) & (b) | illegal |
| `ct-prohibited-003` | Landlord exculpation / tenant indemnifies landlord | Conn. Gen. Stat. § 47a-4(a)(3) & (b) | illegal |
| `ct-prohibited-004` | Waiver of interest on the security deposit | Conn. Gen. Stat. § 47a-4(a)(4) & (b) | illegal |
| `ct-prohibited-005` | Self-help eviction (dispossess without a court order) | Conn. Gen. Stat. § 47a-4(a)(5) & (b) | illegal |
| `ct-prohibited-006` | Distraint / landlord's lien on the tenant's property for rent | Conn. Gen. Stat. § 47a-4(a)(6) & (b) | illegal |
| `ct-prohibited-007` | Landlord's attorney's fees over the statutory cap | Conn. Gen. Stat. § 47a-4(a)(7) & (b) | questionable |
| `ct-prohibited-008` | Late charge before the grace period, or over the statutory cap | Conn. Gen. Stat. § 47a-4(a)(8)-(9) & (b) | questionable |
| `ct-prohibited-009` | Heat or utilities surcharge when included in rent | Conn. Gen. Stat. § 47a-4(a)(10) & (b) | questionable |
| `ct-payment-001` | Rent payable only by autopay / electronic funds transfer | Conn. Gen. Stat. § 47a-4c | illegal |
| `ct-fees-001` | Move-in or move-out fee | Conn. Gen. Stat. § 47a-4d(b) | illegal |
| `ct-fees-002` | Application / processing fee (beyond a capped screening fee) | Conn. Gen. Stat. § 47a-4d(b) & (c) | questionable |
| `ct-repairs-001` | Tenant made responsible for all repairs / maintenance | Conn. Gen. Stat. § 47a-7(a) | illegal |
| `ct-repairs-002` | "As-is" / waiver of the warranty of habitability | Conn. Gen. Stat. § 47a-7(a) — landlord must keep premises fit and habitable | illegal |
| `ct-inspection-001` | Pre-occupancy walk-through: your right, and deposit protection | Conn. Gen. Stat. § 47a-7c | info |
| `ct-terminate-001` | Tenant owes all remaining rent on early termination (ignores duty to mitigate) | Conn. Gen. Stat. § 47a-11a | illegal |
| `ct-utilities-001` | Landlord may shut off utilities / essential services | Conn. Gen. Stat. § 47a-13(a) | illegal |
| `ct-entry-001` | Landlord entry without notice / at any time | Conn. Gen. Stat. § 47a-16(c) | illegal |
| `ct-deposit-001` | Security deposit exceeds the legal maximum | Conn. Gen. Stat. § 47a-21(b) | illegal |
| `ct-deposit-002` | Non-refundable security deposit | Conn. Gen. Stat. § 47a-21(c) & (d) | illegal |
| `ct-deposit-003` | Non-refundable cleaning / redecorating / amenity fee (disguised deposit) | Conn. Gen. Stat. § 47a-21(a)(11) & (b) | questionable |
| `ct-deposit-005` | Security deposit automatically forfeited if the tenant breaks the lease | Conn. Gen. Stat. § 47a-21(c) & (d) | illegal |
| `ct-deposit-004` | Automatic deposit deduction for painting / cleaning / ordinary wear | Conn. Gen. Stat. § 47a-21(d) — return of deposit; lawful deductions | questionable |

---

## § 47a-4 — Terms prohibited in a rental agreement

> **Statute context:** Conn. Gen. Stat. § 47a-4 (Terms prohibited in rental agreement), retrieved verbatim from cga.ct.gov on 2026-06-05 (reflects P.A. 23-207, which added the (a)(9) late-charge cap and redesignated the heat/utility surcharge as (a)(10)). § 47a-4(b): 'A provision prohibited by subsection (a) of this section included in a rental agreement is unenforceable.' Citations deep-link to the section anchor on the official CGA chapter page. ALL rules remain status=draft-unverified: regex, severity, and plain-English framing must be reviewed by a CT tenant attorney / legal-aid clinic before public conclusions.

### `ct-prohibited-001` — Waiver of the tenant's legal rights or remedies

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per § 47a-4(a)(1), a lease cannot make the tenant waive or forfeit rights or remedies under the landlord-tenant statutes (or any statute/ordinance) unless that law expressly permits waiver. Such a provision is unenforceable.

**Tenant-facing wording (shown in the app):** A lease can't quietly strip away rights the law gives you. Broad language making you 'waive any and all rights' generally can't be enforced.

**Example clause this flags (illustrative):** *The Tenant waives any and all rights and remedies under the landlord-tenant act.*

**Citations:**

- [Conn. Gen. Stat. § 47a-4(a)(1) & (b)](https://www.cga.ct.gov/current/pub/chap_830.htm#sec_47a-4)

  > A rental agreement shall not provide that the tenant: (1) Agrees to waive or forfeit rights or remedies under this chapter and sections 47a-21, 47a-23 to 47a-23b … or under any section of the general statutes or any municipal ordinance unless such section or ordinance expressly states that such rights may be waived … (b) A provision prohibited by subsection (a) of this section included in a rental agreement is unenforceable.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `ct-prohibited-002` — Confession of judgment

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per § 47a-4(a)(2), a lease cannot authorize the landlord to confess judgment on a claim arising out of the rental agreement. Unenforceable.

**Tenant-facing wording (shown in the app):** You can't sign away your right to defend yourself in court. A clause letting the landlord 'confess judgment' against you isn't enforceable.

**Example clause this flags (illustrative):** *The Tenant authorizes the Landlord to confess judgment on any claim arising out of this Lease.*

**Citations:**

- [Conn. Gen. Stat. § 47a-4(a)(2) & (b)](https://www.cga.ct.gov/current/pub/chap_830.htm#sec_47a-4)

  > A rental agreement shall not provide that the tenant: … (2) authorizes the landlord to confess judgment on a claim arising out of the rental agreement … (b) A provision prohibited by subsection (a) of this section … is unenforceable.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `ct-prohibited-003` — Landlord exculpation / tenant indemnifies landlord

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per § 47a-4(a)(3), a lease cannot make the tenant agree to exculpate or limit the landlord's liability arising under law, or to indemnify the landlord for that liability or related costs. Unenforceable.

**Tenant-facing wording (shown in the app):** Your landlord can't use the lease to escape responsibility for their own negligence, or make you cover their legal costs. 'Hold harmless' / 'not liable for anything' clauses generally don't hold up.

**Example clause this flags (illustrative):** *The Tenant shall hold the Landlord harmless and shall indemnify the Landlord against any and all claims and costs.*

**Citations:**

- [Conn. Gen. Stat. § 47a-4(a)(3) & (b)](https://www.cga.ct.gov/current/pub/chap_830.htm#sec_47a-4)

  > A rental agreement shall not provide that the tenant: … (3) agrees to the exculpation or limitation of any liability of the landlord arising under law or to indemnify the landlord for that liability or the costs connected therewith … (b) A provision prohibited by subsection (a) of this section … is unenforceable.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `ct-prohibited-004` — Waiver of interest on the security deposit

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per § 47a-4(a)(4), a lease cannot make the tenant waive the right to interest on the security deposit owed under § 47a-21. Unenforceable.

**Tenant-facing wording (shown in the app):** Your security deposit earns interest that's owed to you. A clause making you give up that interest can't be enforced.

**Example clause this flags (illustrative):** *The Tenant waives the right to interest on the security deposit.*

**Citations:**

- [Conn. Gen. Stat. § 47a-4(a)(4) & (b)](https://www.cga.ct.gov/current/pub/chap_830.htm#sec_47a-4)

  > A rental agreement shall not provide that the tenant: … (4) agrees to waive his right to the interest on the security deposit pursuant to section 47a-21 … (b) A provision prohibited by subsection (a) of this section … is unenforceable.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `ct-prohibited-005` — Self-help eviction (dispossess without a court order)

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per § 47a-4(a)(5), a lease cannot let the landlord dispossess the tenant without resort to a court order. Unenforceable; Connecticut requires a court eviction (summary process).

**Tenant-facing wording (shown in the app):** A landlord can't legally lock you out or force you out on their own — they have to go to court. Any clause saying otherwise isn't enforceable.

**Example clause this flags (illustrative):** *Upon any default, the Landlord may re-enter and take possession of the premises without resort to court.*

**Citations:**

- [Conn. Gen. Stat. § 47a-4(a)(5) & (b)](https://www.cga.ct.gov/current/pub/chap_830.htm#sec_47a-4)

  > A rental agreement shall not provide that the tenant: … (5) agrees to permit the landlord to dispossess him without resort to court order … (b) A provision prohibited by subsection (a) of this section … is unenforceable.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `ct-prohibited-006` — Distraint / landlord's lien on the tenant's property for rent

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per § 47a-4(a)(6), a lease cannot make the tenant consent to the distraint of their property for rent. Unenforceable.

**Tenant-facing wording (shown in the app):** Your landlord can't seize or hold your belongings to cover unpaid rent. A clause letting them do that isn't enforceable.

**Example clause this flags (illustrative):** *The Tenant consents to the distraint of the Tenant's property for unpaid rent.*

**Citations:**

- [Conn. Gen. Stat. § 47a-4(a)(6) & (b)](https://www.cga.ct.gov/current/pub/chap_830.htm#sec_47a-4)

  > A rental agreement shall not provide that the tenant: … (6) consents to the distraint of his property for rent … (b) A provision prohibited by subsection (a) of this section … is unenforceable.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `ct-prohibited-007` — Landlord's attorney's fees over the statutory cap

**Severity:** questionable (Worth checking (context-dependent))

**What the rule treats as wrong:** Per § 47a-4(a)(7), a lease cannot make the tenant pay the landlord's attorney's fees in excess of fifteen per cent of any money-damages judgment against the tenant. Flag attorney's-fee clauses so the cap can be checked.

**Tenant-facing wording (shown in the app):** If you lose a rent case, the most you can be made to pay toward the landlord's lawyer is 15% of the judgment. Watch for clauses demanding 'all' or 'reasonable' attorney's fees with no cap.

**Example clause this flags (illustrative):** *The Tenant shall pay the Landlord's attorney's fees.*

**Citations:**

- [Conn. Gen. Stat. § 47a-4(a)(7) & (b)](https://www.cga.ct.gov/current/pub/chap_830.htm#sec_47a-4)

  > A rental agreement shall not provide that the tenant: … (7) agrees to pay the landlord's attorney's fees in excess of fifteen per cent of any judgment against the tenant in any action in which money damages are awarded … (b) A provision prohibited by subsection (a) of this section … is unenforceable.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `ct-prohibited-008` — Late charge before the grace period, or over the statutory cap

**Severity:** questionable (Worth checking (context-dependent))

**What the rule treats as wrong:** Per § 47a-4(a)(8)-(9), a lease cannot charge a late fee before the § 47a-15a grace period expires, demand 'reduced rent' only if paid before the grace period, or charge a late fee exceeding the § 47a-15a cap. § 47a-15a(b) caps a late charge at the lesser of $5/day (max $50) or 5% of the delinquent payment, and allows only one late charge. Flag late-fee clauses to check timing and amount.

**Tenant-facing wording (shown in the app):** Connecticut gives you a grace period before rent is 'late' (9 days for a month-to-month tenancy). A late fee charged before that isn't allowed, and once it does apply it can't exceed $5/day up to $50, or 5% of the late rent — only one charge.

**Example clause this flags (illustrative):** *A late fee applies to any rent not received on the first of the month.*

**Citations:**

- [Conn. Gen. Stat. § 47a-4(a)(8)-(9) & (b)](https://www.cga.ct.gov/current/pub/chap_830.htm#sec_47a-4)

  > A rental agreement shall not provide that the tenant: … (8) agrees to pay a late charge prior to the expiration of the grace period set forth in section 47a-15a or to pay rent in a reduced amount if such rent is paid prior to the expiration of such grace period; (9) agrees to pay a late charge on rent payments made subsequent to such grace period in an amount exceeding the amounts set forth in section 47a-15a.

- [Conn. Gen. Stat. § 47a-15a — grace period & late-charge cap](https://www.cga.ct.gov/current/pub/chap_830.htm#sec_47a-15a)

  > If rent is unpaid when due and the tenant fails to pay rent within nine days thereafter or, in the case of a one-week tenancy, within four days thereafter … 'grace period' means the nine-day or four-day time periods … Such late charge may not exceed the lesser of (1) five dollars per day, up to a maximum of fifty dollars, or (2) five per cent of the delinquent rent payment … The landlord may not assess more than one late charge upon a delinquent rent payment.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `ct-prohibited-009` — Heat or utilities surcharge when included in rent

**Severity:** questionable (Worth checking (context-dependent))

**What the rule treats as wrong:** Per § 47a-4(a)(10), if heat or utilities are included in the rental agreement, a lease cannot make the tenant pay a heat or utilities surcharge. Context-dependent on whether utilities are included.

**Tenant-facing wording (shown in the app):** If your rent includes heat or utilities, the landlord can't tack on an extra 'surcharge' for them.

**Example clause this flags (illustrative):** *The Tenant shall also pay a monthly utility surcharge and a $75 application fee.*

**Citations:**

- [Conn. Gen. Stat. § 47a-4(a)(10) & (b)](https://www.cga.ct.gov/current/pub/chap_830.htm#sec_47a-4)

  > A rental agreement shall not provide that the tenant: … (10) agrees to pay a heat or utilities surcharge if heat or utilities is included in the rental agreement … (b) A provision prohibited by subsection (a) of this section … is unenforceable.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

## § 47a-4c — Payment method

> **Statute context:** Conn. Gen. Stat. § 47a-4c (Landlord prohibited from requiring electronic funds transfer as exclusive form of payment), retrieved verbatim from cga.ct.gov on 2026-06-05. status=draft-unverified.

### `ct-payment-001` — Rent payable only by autopay / electronic funds transfer

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per § 47a-4c, for leases executed on or after October 1, 2013, a landlord cannot require electronic funds transfer (autopay/ACH/online-portal debit) as the exclusive form of paying rent or the security deposit. The tenant must be allowed another method (e.g. check).

**Tenant-facing wording (shown in the app):** A landlord can't force you to pay rent only through autopay or an online portal. You have to be allowed at least one non-electronic option, like a check.

**Example clause this flags (illustrative):** *Rent must be paid exclusively by electronic funds transfer through the online tenant portal.*

**Citations:**

- [Conn. Gen. Stat. § 47a-4c](https://www.cga.ct.gov/current/pub/chap_830.htm#sec_47a-4c)

  > For any lease or rental agreement executed on or after October 1, 2013, no landlord of residential real property shall require electronic funds transfer as the exclusive form of payment of rent or a security deposit. … 'electronic funds transfer' means any transfer of funds that is initiated through an electronic terminal, telephone or computer ….

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

## § 47a-4d — Prohibited pre-tenancy fees

> **Statute context:** Conn. Gen. Stat. § 47a-4d (Fees for tenant screening reports; prohibited pre-tenancy fees), retrieved verbatim from cga.ct.gov on 2026-06-05. § 47a-4d(b): the only payments a landlord may demand before/at the beginning of a tenancy are a security deposit, first month's rent, a key/special-equipment deposit, and a tenant-screening fee; move-in and move-out fees are barred. § 47a-4d(c): a screening fee may not exceed $50 (plus a CPI adjustment). status=draft-unverified.

### `ct-fees-001` — Move-in or move-out fee

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per § 47a-4d(b), a landlord may not charge a tenant a move-in or move-out fee. Such a fee is prohibited outright (distinct from a lawful security deposit).

**Tenant-facing wording (shown in the app):** Connecticut flatly bans move-in and move-out fees. The only money a landlord can collect up front is your security deposit, first month's rent, a key/equipment deposit, and (if applicable) a screening fee.

**Example clause this flags (illustrative):** *The Tenant shall also pay a non-refundable move-in fee and a non-refundable cleaning fee.*

**Citations:**

- [Conn. Gen. Stat. § 47a-4d(b)](https://www.cga.ct.gov/current/pub/chap_830.htm#sec_47a-4d)

  > No landlord may demand from a prospective tenant any payment, fee or charge for the processing, review or acceptance of any rental application, or demand any other payment, fee or charge before or at the beginning of the tenancy, except a security deposit … advance payment for the first month's rent or a deposit for a key or any special equipment, or a fee for a tenant screening report …. No landlord may charge a tenant a move-in or move-out fee.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `ct-fees-002` — Application / processing fee (beyond a capped screening fee)

**Severity:** questionable (Worth checking (context-dependent))

**What the rule treats as wrong:** Per § 47a-4d(b)-(c), the only pre-tenancy charge a landlord may demand toward an application is a tenant-screening-report fee, capped at $50 (plus a CPI adjustment). A separate 'application', 'processing', or 'administrative' fee — or a screening fee over the cap — is prohibited. Flag to check the amount and purpose.

**Tenant-facing wording (shown in the app):** A landlord can charge a screening-report fee (capped at about $50) — but not a separate application, processing, or administrative fee. If you're being charged more than ~$50 or an extra application fee, it likely isn't allowed.

**Example clause this flags (illustrative):** *The Tenant shall also pay a monthly utility surcharge and a $75 application fee.*

**Citations:**

- [Conn. Gen. Stat. § 47a-4d(b) & (c)](https://www.cga.ct.gov/current/pub/chap_830.htm#sec_47a-4d)

  > No landlord may demand from a prospective tenant any payment, fee or charge for the processing, review or acceptance of any rental application … except … a fee for a tenant screening report …. (c) … a landlord may charge a fee not exceeding fifty dollars plus an adjustment reflecting any increase in the consumer price index … for a tenant screening report ….

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

## § 47a-7 — Habitability & repairs

> **Statute context:** Conn. Gen. Stat. § 47a-7 (Landlord's responsibilities) read with § 47a-4(a)(1) (the tenant cannot waive statutory rights), retrieved verbatim from cga.ct.gov on 2026-06-05. The landlord's duty to maintain a habitable, code-compliant unit cannot be shifted wholesale onto the tenant or waived. status=draft-unverified.

### `ct-repairs-001` — Tenant made responsible for all repairs / maintenance

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Under § 47a-7 the landlord must keep the premises fit and habitable and make necessary repairs; § 47a-4(a)(1) bars waiving that statutory protection. A clause shifting all repair/maintenance duty onto the tenant is unenforceable as to the landlord's non-waivable obligations. (The tenant remains responsible for damage they cause, § 47a-11.)

**Tenant-facing wording (shown in the app):** Keeping the place livable — heat, hot water, plumbing, structural and code repairs — is your landlord's job, not yours. A lease making you responsible for 'all repairs' can't sign that duty away. You're still on the hook for damage you actually cause.

**Example clause this flags (illustrative):** *The Tenant is responsible for all repairs and maintenance of the premises.*

**Citations:**

- [Conn. Gen. Stat. § 47a-7(a)](https://www.cga.ct.gov/current/pub/chap_830.htm#sec_47a-7)

  > A landlord shall: … (2) make all repairs and do whatever is necessary to put and keep the premises in a fit and habitable condition, except where the premises are intentionally rendered unfit or uninhabitable by the tenant … (4) maintain in good and safe working order … all electrical, plumbing, sanitary, heating, ventilating and other facilities … (6) supply running water and reasonable amounts of hot water at all times and reasonable heat.

- [Conn. Gen. Stat. § 47a-4(a)(1) — waiver of statutory rights prohibited](https://www.cga.ct.gov/current/pub/chap_830.htm#sec_47a-4)

  > A rental agreement shall not provide that the tenant: (1) Agrees to waive or forfeit rights or remedies under this chapter ….

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `ct-repairs-002` — "As-is" / waiver of the warranty of habitability

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Under § 47a-7 the landlord must keep the unit fit and habitable; § 47a-4(a)(1) makes that protection non-waivable. A clause making the tenant accept the unit 'as-is' or waive the (implied) warranty of habitability is unenforceable as to the landlord's statutory duties.

**Tenant-facing wording (shown in the app):** You can't sign away your right to a livable home. 'Tenant accepts the unit as-is' or 'waives the warranty of habitability' doesn't let the landlord off the hook for heat, hot water, and code-level repairs.

**Example clause this flags (illustrative):** *The Tenant accepts the premises as-is and waives the warranty of habitability.*

**Citations:**

- [Conn. Gen. Stat. § 47a-7(a) — landlord must keep premises fit and habitable](https://www.cga.ct.gov/current/pub/chap_830.htm#sec_47a-7)

  > A landlord shall: … (2) make all repairs and do whatever is necessary to put and keep the premises in a fit and habitable condition ….

- [Conn. Gen. Stat. § 47a-4(a)(1) & (b) — waiver prohibited; provision unenforceable](https://www.cga.ct.gov/current/pub/chap_830.htm#sec_47a-4)

  > A rental agreement shall not provide that the tenant: (1) Agrees to waive or forfeit rights or remedies under this chapter … (b) A provision prohibited by subsection (a) of this section … is unenforceable.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

## § 47a-7c — Pre-occupancy walk-through

> **Statute context:** Conn. Gen. Stat. § 47a-7c (Walk-through inspections prior to occupancy), retrieved verbatim from cga.ct.gov on 2026-06-05: on/after Jan 1, 2024 the landlord must OFFER a pre-occupancy walk-through, and may not retain any part of the deposit (or seek payment) for conditions noted on the walk-through checklist. Informational/positive-right rule. status=draft-unverified.

### `ct-inspection-001` — Pre-occupancy walk-through: your right, and deposit protection

**Severity:** info (Informational (legal))

**What the rule treats as wrong:** Per § 47a-7c, the landlord must offer the tenant the opportunity to do a pre-occupancy walk-through and complete a checklist of existing conditions. The landlord may not later keep any part of the deposit, or charge the tenant, for any condition noted on that checklist. This is a tenant protection, surfaced when the lease references move-in condition / inspections.

**Tenant-facing wording (shown in the app):** Before you move in, you have the right to a documented walk-through with the landlord. Anything you note as already damaged can't be taken out of your deposit later — so ask for the walk-through and keep your copy.

**Example clause this flags (illustrative):** *The Landlord and Tenant may complete a move-in walk-through checklist noting the condition of the unit.*

**Citations:**

- [Conn. Gen. Stat. § 47a-7c](https://www.cga.ct.gov/current/pub/chap_830.htm#sec_47a-7c)

  > … prior to the tenant's occupancy of a dwelling unit, a landlord shall offer such tenant the opportunity to conduct a walk-through of the dwelling unit. … Upon the tenant's vacating of the dwelling unit, the landlord may not retain any part of the security deposit … or seek payment from the tenant for any condition, defect or damage that was noted in the preoccupancy walk-through checklist.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

## § 47a-11a — Early termination & duty to mitigate

> **Statute context:** Conn. Gen. Stat. § 47a-11a (Abandonment of unit by tenant), retrieved verbatim from cga.ct.gov on 2026-06-05: if a tenant abandons, the landlord SHALL make reasonable efforts to re-rent at fair rental in mitigation of damages. status=draft-unverified.

### `ct-terminate-001` — Tenant owes all remaining rent on early termination (ignores duty to mitigate)

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per § 47a-11a, if a tenant leaves early the landlord must make reasonable efforts to re-rent the unit at a fair rental to mitigate damages. A clause accelerating all remaining rent — making the tenant automatically liable for the entire balance of the term regardless of re-renting — is unenforceable to that extent.

**Tenant-facing wording (shown in the app):** If you break your lease early, your landlord can't just bill you for every remaining month — they're legally required to try to re-rent the place. A clause demanding the whole remaining rent up front ignores that duty.

**Example clause this flags (illustrative):** *Upon early termination, the Tenant shall be liable for all remaining rent for the entire term, immediately due and payable.*

**Citations:**

- [Conn. Gen. Stat. § 47a-11a](https://www.cga.ct.gov/current/pub/chap_830.htm#sec_47a-11a)

  > (a) If the tenant abandons the dwelling unit, the landlord shall make reasonable efforts to rent it at a fair rental in mitigation of damages. (b) If the landlord fails to use reasonable efforts to rent the dwelling unit at a fair rental, the rental agreement is deemed to be terminated by the landlord as of the date the landlord has notice of the abandonment.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

## § 47a-13 — Essential services

> **Statute context:** Conn. Gen. Stat. § 47a-13 (Failure of landlord to supply essential services; tenant's remedies) read with § 47a-4(a)(5) (no dispossession without court order), retrieved verbatim from cga.ct.gov on 2026-06-05. A landlord required to supply heat/water/electricity/gas must do so; cutting them off to pressure a tenant is unlawful self-help. status=draft-unverified.

### `ct-utilities-001` — Landlord may shut off utilities / essential services

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Where the landlord is required to supply heat, hot water, water, electricity, gas, or other essential services (§ 47a-13), a clause letting the landlord shut them off — e.g. to force payment or move-out — is unlawful self-help; the tenant has statutory remedies instead.

**Tenant-facing wording (shown in the app):** A landlord can't cut off your heat, water, electricity, or gas to pressure you — even over unpaid rent. If essential services stop, the law gives you remedies; a clause saying they can shut them off doesn't hold up.

**Example clause this flags (illustrative):** *If rent is unpaid, the Landlord may shut off heat and hot water until the balance is paid in full.*

**Citations:**

- [Conn. Gen. Stat. § 47a-13(a)](https://www.cga.ct.gov/current/pub/chap_830.htm#sec_47a-13)

  > If the landlord is required to supply heat, running water, hot water, electricity, gas or other essential service, and if the landlord fails to supply such essential service and the failure is not caused by conditions beyond the landlord's control, the tenant may give notice to the landlord specifying the breach and may elect to (1) procure reasonable amounts of [the service] … and deduct the actual and reasonable cost … from the rent; or (2) procure reasonable substitute housing ….

- [Conn. Gen. Stat. § 47a-4(a)(5) — no dispossession without court order](https://www.cga.ct.gov/current/pub/chap_830.htm#sec_47a-4)

  > A rental agreement shall not provide that the tenant: … (5) agrees to permit the landlord to dispossess him without resort to court order.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

## § 47a-16 — Landlord entry

> **Statute context:** Conn. Gen. Stat. § 47a-16 (When landlord may enter rented unit), retrieved verbatim from cga.ct.gov on 2026-06-05. § 47a-16(c): the landlord must give reasonable written or oral notice of intent to enter and may enter only at reasonable times, except in an emergency. status=draft-unverified.

### `ct-entry-001` — Landlord entry without notice / at any time

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per § 47a-16, a landlord must give the tenant reasonable notice of intent to enter and may enter only at reasonable times (except in an emergency, by court order, or if the unit is abandoned). A clause permitting entry 'at any time' or 'without notice' is unenforceable to that extent (§ 47a-4(a)(1)).

**Tenant-facing wording (shown in the app):** Your landlord generally has to give you reasonable notice before coming in, and can only enter at reasonable times — emergencies aside. A lease letting them enter 'anytime, without notice' isn't enforceable.

**Example clause this flags (illustrative):** *The Landlord may enter the premises at any time and without notice.*

**Citations:**

- [Conn. Gen. Stat. § 47a-16(c)](https://www.cga.ct.gov/current/pub/chap_830.htm#sec_47a-16)

  > A landlord shall not abuse the right of entry or use such right of entry to harass the tenant. The landlord shall give the tenant reasonable written or oral notice of his intent to enter and may enter only at reasonable times, except in case of emergency.

- [Conn. Gen. Stat. § 47a-4(a)(1) — waiver of statutory rights prohibited](https://www.cga.ct.gov/current/pub/chap_830.htm#sec_47a-4)

  > A rental agreement shall not provide that the tenant: (1) Agrees to waive or forfeit rights or remedies under this chapter ….

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

## § 47a-21 — Security deposits

> **Statute context:** Conn. Gen. Stat. § 47a-21 (Security deposits), retrieved verbatim from cga.ct.gov on 2026-06-05. § 47a-21(b): max two months' rent (under 62), one month (62+); (a)(11) defines 'security deposit' as any advance rental payment except first month's rent or a key/special-equipment deposit; (c) the deposit remains the tenant's property; (d) returned with accrued interest minus the value of damages from the tenant's failure to meet 'tenant's obligations' ((a)(14)), within 21 days of termination or 15 days after a written forwarding address, whichever is later. status=draft-unverified.

### `ct-deposit-001` — Security deposit exceeds the legal maximum

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per § 47a-21(b), a security deposit may not exceed two months' rent (one month's rent if the tenant is 62 or older). A clause demanding more is unenforceable as to the excess.

**Tenant-facing wording (shown in the app):** Your landlord can't make you pay more than two months' rent as a security deposit — just one month if you're 62 or older. If the lease asks for more, that extra isn't enforceable.

**Example clause this flags (illustrative):** *The Tenant shall pay a non-refundable security deposit equal to three months' rent.*

**Citations:**

- [Conn. Gen. Stat. § 47a-21(b)](https://www.cga.ct.gov/current/pub/chap_831.htm#sec_47a-21)

  > (b) Amount of security deposit. (1) In the case of a tenant under sixty-two years of age, a landlord shall not demand a security deposit in an amount that exceeds two months' rent. (2) In the case of a tenant sixty-two years of age or older, a landlord shall not demand a security deposit in an amount that exceeds one month's rent.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `ct-deposit-002` — Non-refundable security deposit

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Under § 47a-21(c) the deposit remains the tenant's property, and under § 47a-21(d) it must be returned with accrued interest, minus only the value of damages from the tenant's failure to meet their obligations. Labeling a security deposit 'non-refundable' contradicts the statutory return scheme and is unenforceable.

**Tenant-facing wording (shown in the app):** A security deposit isn't a fee — it's your money being held. Calling it 'non-refundable' doesn't make it so; you're owed it back, with interest, minus any real damage or unpaid rent.

**Example clause this flags (illustrative):** *The Tenant shall pay a non-refundable security deposit equal to three months' rent.*

**Citations:**

- [Conn. Gen. Stat. § 47a-21(c) & (d)](https://www.cga.ct.gov/current/pub/chap_831.htm#sec_47a-21)

  > Any security deposit paid by a tenant shall remain the property of such tenant … (d) … the person who is the landlord at the time a tenancy is terminated … shall pay to the tenant … (A) The amount of any security deposit … less the value of any damages … as a result of such tenant's failure to comply with such tenant's obligations; and (B) any accrued interest.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `ct-deposit-003` — Non-refundable cleaning / redecorating / amenity fee (disguised deposit)

**Severity:** questionable (Worth checking (context-dependent))

**What the rule treats as wrong:** A charge that functions as a disguised security deposit may be subject to the § 47a-21(b) cap and return rules; § 47a-21(a)(11) defines a security deposit broadly as 'any advance rental payment' other than first month's rent or a key/equipment deposit. A flat non-refundable cleaning/redecorating/amenity fee is a gray area worth checking. (Move-in/move-out and application fees are separately barred — see ct-fees-001/002.)

**Tenant-facing wording (shown in the app):** Watch for non-refundable 'cleaning' or 'amenity' fees — depending on how they work, they may really be a security deposit in disguise, which has to follow the deposit rules (cap, interest, return).

**Example clause this flags (illustrative):** *The Tenant shall also pay a non-refundable move-in fee and a non-refundable cleaning fee.*

**Citations:**

- [Conn. Gen. Stat. § 47a-21(a)(11) & (b)](https://www.cga.ct.gov/current/pub/chap_831.htm#sec_47a-21)

  > 'Security deposit' means any advance rental payment, or any installment payment collected pursuant to section 47a-22a, except an advance payment for the first month's rent or a deposit for a key or any special equipment.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `ct-deposit-005` — Security deposit automatically forfeited if the tenant breaks the lease

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Under § 47a-21(c) the deposit remains the tenant's property and under § 47a-21(d) is returnable minus only the value of actual damages; under § 47a-11a a landlord must mitigate by re-renting. A clause making the deposit automatically forfeited on early termination — divorced from actual damages — is unenforceable.

**Tenant-facing wording (shown in the app):** Breaking your lease doesn't mean your landlord just keeps your whole deposit. It's still your money; they can only keep what covers actual damage or rent they couldn't recover after trying to re-rent.

**Example clause this flags (illustrative):** *The security deposit shall be forfeited if the Tenant breaks the Lease early.*

**Citations:**

- [Conn. Gen. Stat. § 47a-21(c) & (d)](https://www.cga.ct.gov/current/pub/chap_831.htm#sec_47a-21)

  > Any security deposit paid by a tenant shall remain the property of such tenant … (d) … shall pay to the tenant … the amount of any security deposit … less the value of any damages … as a result of such tenant's failure to comply with such tenant's obligations; and … any accrued interest.

- [Conn. Gen. Stat. § 47a-11a — duty to mitigate](https://www.cga.ct.gov/current/pub/chap_830.htm#sec_47a-11a)

  > If the tenant abandons the dwelling unit, the landlord shall make reasonable efforts to rent it at a fair rental in mitigation of damages.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

## § 47a-21(d) — Deposit deductions & return

> **Statute context:** Conn. Gen. Stat. § 47a-21(d) read with § 47a-21(a)(14) ('tenant's obligations'), retrieved verbatim from cga.ct.gov on 2026-06-05: at termination the landlord returns the deposit plus accrued interest, less the value of damages from the tenant's failure to comply with the tenant's obligations (§ 47a-11) — i.e. NOT ordinary wear and tear. Return window: 21 days after termination, or 15 days after a written forwarding address, whichever is later. status=draft-unverified.

### `ct-deposit-004` — Automatic deposit deduction for painting / cleaning / ordinary wear

**Severity:** questionable (Worth checking (context-dependent))

**What the rule treats as wrong:** Per § 47a-21(d), a landlord may deduct from the deposit only the value of damages caused by the tenant's failure to meet their obligations (plus unpaid rent) — not ordinary wear and tear. A clause auto-deducting for repainting, routine cleaning, or 'normal wear' is suspect; flag it to check the charge reflects actual tenant-caused damage.

**Tenant-facing wording (shown in the app):** Your landlord can take money out of your deposit for damage you caused or unpaid rent — not for normal wear and tear, routine repainting, or standard cleaning. Watch for clauses that auto-charge those to your deposit.

**Example clause this flags (illustrative):** *At move-out, the Landlord may deduct repainting and carpet cleaning costs from the security deposit.*

**Citations:**

- [Conn. Gen. Stat. § 47a-21(d) — return of deposit; lawful deductions](https://www.cga.ct.gov/current/pub/chap_831.htm#sec_47a-21)

  > … shall pay to the tenant … (A) The amount of any security deposit … less the value of any damages … as a result of such tenant's failure to comply with such tenant's obligations; and (B) any accrued interest. … Not later than twenty-one days after termination of a tenancy or fifteen days after receiving written notification of [the tenant's forwarding address], whichever is later.

- [Conn. Gen. Stat. § 47a-21(a)(14) — 'tenant's obligations' (limits deductions)](https://www.cga.ct.gov/current/pub/chap_831.htm#sec_47a-21)

  > 'Tenant's obligations' means (A) the amount of any rental or utility payment due the landlord from a tenant; (B) a tenant's obligations under the provisions of section 47a-11; and (C) the actual reasonable cost of changing the locks … pursuant to section 47a-7b ….

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

*All rules `draft-unverified`. Generated from `rules/ct/*.json`by`scripts/build_review_packet.py` — regenerate after any rule change. LeaseLookout is not a law firm and this packet is not a request for legal advice to any individual; it is a request to review curated legal-information content for accuracy.*
