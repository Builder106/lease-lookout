# LeaseLookout — Massachusetts ruleset for legal review

**Generated:**2026-06-20  ·**Jurisdiction:**Massachusetts (M.G.L. c. 186 & c. 93A (940 CMR 3.17))  ·**Rules:**16  ·**Status:** every rule is `draft-unverified` pending this review.

Severity mix: **13**illegal/unenforceable ·**3**worth-checking ·**0** informational.

## What LeaseLookout is

LeaseLookout is a free, tenant-side tool that reads a Massachusetts residential lease (PDF) and flags clauses that may be illegal or unenforceable, **each tied to a specific Massachusetts statute**. It presents legal *information*, not legal advice: the product states it is not a law firm, does not create an attorney-client relationship, shows every statute so the tenant can read the law themselves, and directs users to a tenant-rights attorney or a legal-aid clinic. It is invite-only and not public.

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
- **Early termination & duty to mitigate** — 1 rule(s)
- **Landlord entry** — 1 rule(s)
- **Security deposits** — 5 rule(s)

**Known gaps / candidate future rules (not yet in the set — flag any you'd prioritize):**

- No curated gap list for Massachusetts yet — please flag any common Massachusetts tenant protections you'd expect a lease-checker to cover that aren't addressed above.

## Rules at a glance

| ID | Title | Statute | Severity |
| --- | --- | --- | --- |
| `ma-prohibited-001` | "As-is" / waiver of habitability | 940 CMR 3.17(1) | illegal |
| `ma-prohibited-002` | Landlord exculpation / indemnity / hold-harmless for its own negligence | M.G.L. c. 186, § 15 | illegal |
| `ma-prohibited-003` | Waiver of jury trial | M.G.L. c. 186, § 15F | illegal |
| `ma-prohibited-004` | Waiver of constructive eviction | M.G.L. c. 186, § 15F | illegal |
| `ma-prohibited-005` | Self-help eviction / lockout / utility shutoff | M.G.L. c. 186, § 14 | illegal |
| `ma-prohibited-006` | Penalty for complaining, or retaliation against the tenant | M.G.L. c. 186, § 18 | illegal |
| `ma-fees-001` | Late fee charged before rent is 30 days overdue | M.G.L. c. 186, § 15B(1)(c) | illegal |
| `ma-fees-002` | Application or tenant-screening fee charged up front | M.G.L. c. 186, § 15B(1)(b) | illegal |
| `ma-fees-003` | Move-in, amenity, pet, or other up-front fee not allowed by statute | M.G.L. c. 186, § 15B(1)(b)(iv) | questionable |
| `ma-termination-001` | Early-termination penalty exceeding the landlord's actual damages | 940 CMR 3.17(6)(c) | questionable |
| `ma-entry-001` | Landlord may enter at any time / for any reason / without notice | M.G.L. c. 186, § 15B(1)(a) | illegal |
| `ma-deposit-001` | Security deposit exceeds one month's rent | M.G.L. c. 186, § 15B(1)(b) | illegal |
| `ma-deposit-002` | Security deposit commingled / treated as the landlord's money | M.G.L. c. 186, § 15B(1)(e) | illegal |
| `ma-deposit-003` | No interest paid on the security deposit | M.G.L. c. 186, § 15B(3)(b) | illegal |
| `ma-deposit-004` | Security deposit not returned within 30 days / no itemized list | M.G.L. c. 186, § 15B(4) | illegal |
| `ma-deposit-005` | Non-refundable security deposit | M.G.L. c. 186, § 15B(1)(e) | questionable |

---

## Terms prohibited in a rental agreement

> **Statute context:** Massachusetts statutory/regulatory bars on residential lease terms, quoted verbatim from malegislature.gov and from 940 CMR 3.17 (the Attorney General's c. 93A landlord-tenant regulation) on mass.gov, both retrieved 2026-06-20. M.G.L. c. 186, § 15 voids any indemnify/hold-harmless/exculpation clause for the landlord's own negligence. § 15F voids jury-trial waivers and constructive-eviction waivers, and gives the ouster (lockout) remedy. § 14 makes utility shutoff, interference with quiet enjoyment, and self-help (force) repossession a punishable offense and voids any waiver. § 18 bars reprisal for reporting violations or tenant-union activity and voids any waiver. 940 CMR 3.17(3)(a)1 makes a lease term that violates any law an unfair/deceptive practice, and 3.17(1) makes renting/keeping an uninhabitable unit unlawful (so an 'as-is'/habitability-waiver term is unenforceable). NOTE ON SCOPE: Massachusetts has no clean primary-source statute squarely voiding 'confession of judgment' or 'one-way attorney-fee' lease clauses, so — per the never-invent-law rule — those are intentionally NOT included here. status=draft-unverified: must be reviewed by a Massachusetts tenant attorney / legal-aid clinic before public conclusions.

### `ma-prohibited-001` — "As-is" / waiver of habitability

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Under 940 CMR 3.17(1) it is an unfair or deceptive act for an owner to rent or keep a dwelling that is unfit for human habitation or contains a code violation that may endanger health or safety, and 940 CMR 3.17(3)(a)1 makes any lease term that violates any law an unfair or deceptive practice. A lease clause having the tenant accept the unit 'as-is' or waive the implied warranty of habitability cannot relieve the owner of that duty and is unenforceable.

**Tenant-facing wording (shown in the app):** You can't sign away your right to a livable home. 'Tenant accepts the unit as-is' or 'waives the warranty of habitability' doesn't hold up in Massachusetts — the landlord still owes you a safe, code-compliant place.

**Example clause this flags (illustrative):** *The Tenant accepts the premises in its present condition and waives the implied warranty of habitability.*

**Citations:**

- [940 CMR 3.17(1)](https://www.law.cornell.edu/regulations/massachusetts/940-CMR-3-17)

  > Conditions and Maintenance of a Dwelling Unit. It shall be an unfair or deceptive act or practice for an owner to: (a) Rent a dwelling unit which, at the inception of the tenancy 1. contains a condition which amounts to a violation of law which may endanger or materially impair the health, safety, or well-being of the occupant; or 2. is unfit for human habitation;

- [940 CMR 3.17(3)(a)](https://www.law.cornell.edu/regulations/massachusetts/940-CMR-3-17)

  > It shall be unfair or deceptive act or practice for an owner to include in any rental agreement any term which:

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `ma-prohibited-002` — Landlord exculpation / indemnity / hold-harmless for its own negligence

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per M.G.L. c. 186, § 15, any lease covenant whose effect is to indemnify the landlord, hold the landlord harmless, or exonerate the landlord from liability to the tenant for injury, loss, or damage arising from the landlord's own negligence or misconduct is against public policy and void.

**Tenant-facing wording (shown in the app):** Your landlord can't use the lease to escape responsibility for harm caused by their own negligence. 'Landlord not liable for any injury,' 'indemnify the landlord,' or 'hold harmless' clauses are void in Massachusetts.

**Example clause this flags (illustrative):** *The Tenant agrees to indemnify and hold the Landlord harmless from any and all liability for injury occurring on the premises.*

**Citations:**

- [M.G.L. c. 186, § 15](https://malegislature.gov/Laws/GeneralLaws/PartII/TitleI/Chapter186/Section15)

  > Any provision of a lease or other rental agreement relating to real property whereby a lessee or tenant enters into a covenant, agreement or contract, by the use of any words whatsoever, the effect of which is to indemnify the lessor or landlord or hold the lessor or landlord harmless, or preclude or exonerate the lessor or landlord from any or all liability to the lessee or tenant, or to any other person, for any injury, loss, damage or liability arising from any omission, fault, negligence or other misconduct of the lessor or landlord on or about the leased or rented premises … shall be deemed to be against public policy and void.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `ma-prohibited-003` — Waiver of jury trial

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per M.G.L. c. 186, § 15F, any provision of a residential lease whereby the tenant agrees to waive the right to a trial by jury in litigation with the landlord is against public policy and void.

**Tenant-facing wording (shown in the app):** A Massachusetts lease can't make you give up your right to a jury in a dispute with your landlord. That waiver is void.

**Example clause this flags (illustrative):** *The Tenant agrees to waive any right to a trial by jury in any dispute with the Landlord.*

**Citations:**

- [M.G.L. c. 186, § 15F](https://malegislature.gov/Laws/GeneralLaws/PartII/TitleI/Chapter186/Section15F)

  > Any provision of a lease or other rental agreement relating to residential real property whereby the tenant agrees to waive his right to trial by jury in any subsequent litigation with the landlord, or agrees that no action or failure to act by the landlord shall be construed as a constructive eviction, shall be deemed to be against public policy and void.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `ma-prohibited-004` — Waiver of constructive eviction

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per M.G.L. c. 186, § 15F, a residential-lease provision stating that no action or failure to act by the landlord shall be construed as a constructive eviction is against public policy and void. A clause barring the tenant from raising constructive eviction is unenforceable.

**Tenant-facing wording (shown in the app):** If the landlord makes the place unlivable, that can count as a constructive eviction — and a lease clause saying it never can is void in Massachusetts.

**Example clause this flags (illustrative):** *The parties agree that no action or failure to act by the Landlord shall be construed as a constructive eviction.*

**Citations:**

- [M.G.L. c. 186, § 15F](https://malegislature.gov/Laws/GeneralLaws/PartII/TitleI/Chapter186/Section15F)

  > Any provision of a lease or other rental agreement relating to residential real property whereby the tenant … agrees that no action or failure to act by the landlord shall be construed as a constructive eviction, shall be deemed to be against public policy and void.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `ma-prohibited-005` — Self-help eviction / lockout / utility shutoff

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per M.G.L. c. 186, § 14, a landlord who willfully fails to furnish required utilities or services, who interferes with the tenant's quiet enjoyment, or who attempts to regain possession by force without judicial process commits a punishable offense and is liable to the tenant; any waiver of that section is void. § 15F separately gives the tenant a remedy when removed or excluded except by valid court order. A lease clause authorizing the landlord to lock the tenant out, shut off utilities, or retake possession without going to court is unenforceable.

**Tenant-facing wording (shown in the app):** A Massachusetts landlord can't lock you out, shut off your heat, water, or electricity, or force you out — they have to go to court. Doing otherwise is illegal, and a lease clause saying they can doesn't hold up.

**Example clause this flags (illustrative):** *Upon default, the Landlord may lock the tenant out and shut off the utilities without resort to any court.*

**Citations:**

- [M.G.L. c. 186, § 14](https://malegislature.gov/Laws/GeneralLaws/PartII/TitleI/Chapter186/Section14)

  > any lessor or landlord who directly or indirectly interferes with the quiet enjoyment of any residential premises by the occupant, or who attempts to regain possession of such premises by force without benefit of judicial process, shall be punished by a fine of not less than twenty-five dollars nor more than three hundred dollars, or by imprisonment for not more than six months.

- [M.G.L. c. 186, § 15F](https://malegislature.gov/Laws/GeneralLaws/PartII/TitleI/Chapter186/Section15F)

  > If a tenant is removed from the premises or excluded therefrom by the landlord or his agent except pursuant to a valid court order, the tenant may recover possession or terminate the rental agreement and, in either case, recover three months' rent or three times the damages sustained by him, and the cost of suit, including reasonable attorney's fees.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `ma-prohibited-006` — Penalty for complaining, or retaliation against the tenant

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per M.G.L. c. 186, § 18, a landlord may not threaten or take reprisals against a tenant for reporting a code violation, enforcing tenant rights, or joining a tenants' union, and any waiver of that protection in a lease is void. 940 CMR 3.17(6)(b) makes retaliation an unfair or deceptive practice. A lease clause that penalizes the tenant for complaining, or that waives the anti-retaliation protection, is unenforceable.

**Tenant-facing wording (shown in the app):** Your landlord can't punish you for reporting bad conditions or joining a tenants' group. A lease clause that fines you for complaining — or that signs away this protection — is void in Massachusetts.

**Example clause this flags (illustrative):** *The Landlord may retaliate against the Tenant for reporting any condition to the board of health.*

**Citations:**

- [M.G.L. c. 186, § 18](https://malegislature.gov/Laws/GeneralLaws/PartII/TitleI/Chapter186/Section18)

  > Any person or agent thereof who threatens to or takes reprisals against any tenant of residential premises for the tenant's act of … reporting to the board of health … a violation or a suspected violation of any health or building code … or for organizing or joining a tenants' union or similar organization … shall be liable for damages which shall not be less than one month's rent or more than three month's rent … Any waiver of this provision in any lease or other rental agreement shall be void and unenforceable.

- [940 CMR 3.17(6)(b)](https://www.law.cornell.edu/regulations/massachusetts/940-CMR-3-17)

  > Retaliate or threaten to retaliate in any manner against a tenant for exercising or attempting to exercise any legal rights as set forth in M.G.L. c. 186, § 18;

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

## Prohibited / regulated fees

> **Statute context:** Massachusetts move-in-charge and fee rules, quoted verbatim from M.G.L. c. 186, § 15B on malegislature.gov and 940 CMR 3.17 (the Attorney General's c. 93A landlord-tenant regulation) on mass.gov, both retrieved 2026-06-20. § 15B(1)(b) is an exhaustive list of the only four lawful up-front charges (first month, last month, a one-month security deposit, and the cost of a key and lock) — there is no lawful application, screening, move-in, amenity, or pet up-front fee. § 15B(1)(c) bars any interest or penalty for late rent until 30 days after it was due; 940 CMR 3.17(6)(a) restates that bar. status=draft-unverified: must be reviewed by a Massachusetts tenant attorney / legal-aid clinic before public conclusions.

### `ma-fees-001` — Late fee charged before rent is 30 days overdue

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per M.G.L. c. 186, § 15B(1)(c), no lease may impose interest or a penalty for failure to pay rent until thirty days after the rent was due. The Attorney General's regulation 940 CMR 3.17(6)(a) makes charging such a late fee earlier an unfair or deceptive practice. A clause imposing a late fee on day 1, day 5, or any time inside the 30-day window is unenforceable.

**Tenant-facing wording (shown in the app):** Massachusetts landlords can't charge a late fee until your rent is a full 30 days overdue. A 'late fee after 5 days' or '$50 if rent is late' clause isn't enforceable here.

**Example clause this flags (illustrative):** *A late fee of $75 shall be charged after five (5) days if rent is not paid when due.*

**Citations:**

- [M.G.L. c. 186, § 15B(1)(c)](https://malegislature.gov/Laws/GeneralLaws/PartII/TitleI/Chapter186/Section15B)

  > No lease or other rental agreement shall impose any interest or penalty for failure to pay rent until thirty days after such rent shall have been due.

- [940 CMR 3.17(6)(a)](https://www.law.cornell.edu/regulations/massachusetts/940-CMR-3-17)

  > It shall be an unfair and deceptive practice for an owner to: (a) Impose any interest or penalty for late payment or rent unless such payment is 30 days overdue;

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `ma-fees-002` — Application or tenant-screening fee charged up front

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per M.G.L. c. 186, § 15B(1)(b), the only amounts a lessor may require at or before the start of a tenancy are first month's rent, last month's rent, a security deposit equal to one month's rent, and the cost of a new key and lock. 940 CMR 3.17(4)(a) restates this exhaustive list. An application fee, screening fee, or credit-check fee is not on that list and is an unlawful up-front charge.

**Tenant-facing wording (shown in the app):** In Massachusetts a landlord can only collect four things before you move in: first month, last month, a one-month security deposit, and the cost of a new lock and key. An application fee or credit-check fee isn't allowed.

**Example clause this flags (illustrative):** *Each applicant shall pay a non-refundable application fee of $50 before the application is processed.*

**Citations:**

- [M.G.L. c. 186, § 15B(1)(b)](https://malegislature.gov/Laws/GeneralLaws/PartII/TitleI/Chapter186/Section15B)

  > At or prior to the commencement of any tenancy, no lessor or agent of the lessor may require a tenant or prospective tenant to pay, to the lessor or to an agent of the lessor, any amount in excess of the following: (i) rent for the first full month of occupancy; and, (ii) rent for the last full month of occupancy calculated at the same rate as the first month; and, (iii) a security deposit equal to the first month's rent

- [940 CMR 3.17(4)(a)](https://www.law.cornell.edu/regulations/massachusetts/940-CMR-3-17)

  > It shall be an unfair or deceptive practice for an owner to: (a) require a tenant or prospective tenant, at or prior to the commencement of any tenancy, to pay any amount in excess of the following:

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `ma-fees-003` — Move-in, amenity, pet, or other up-front fee not allowed by statute

**Severity:** questionable (Worth checking (context-dependent))

**What the rule treats as wrong:** Per M.G.L. c. 186, § 15B(1)(b), the up-front charges a lessor may require are exhaustively limited to first month's rent, last month's rent, a one-month security deposit, and the cost of a key and lock. A move-in fee, amenity fee, redecorating fee, community fee, or non-refundable pet fee charged at or before move-in is outside that list and is an unlawful up-front charge.

**Tenant-facing wording (shown in the app):** Beyond first month, last month, a one-month deposit, and the cost of a lock and key, Massachusetts landlords can't charge extra up-front fees — no move-in fee, pet fee, or amenity fee before you move in.

**Example clause this flags (illustrative):** *The Tenant shall pay a non-refundable move-in fee prior to occupancy in addition to the amounts above.*

**Citations:**

- [M.G.L. c. 186, § 15B(1)(b)(iv)](https://malegislature.gov/Laws/GeneralLaws/PartII/TitleI/Chapter186/Section15B)

  > (iv) the purchase and installation cost for a key and lock.

- [M.G.L. c. 186, § 15B(1)(d)](https://malegislature.gov/Laws/GeneralLaws/PartII/TitleI/Chapter186/Section15B)

  > No lessor or successor in interest shall at any time subsequent to the commencement of a tenancy demand rent in advance in excess of the current month's rent or a security deposit in excess of the amount allowed by this section.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

## Early termination & duty to mitigate

> **Statute context:** Massachusetts early-termination / lease-break penalty rule, quoted verbatim from 940 CMR 3.17(6) (the Attorney General's c. 93A landlord-tenant regulation) on mass.gov, retrieved 2026-06-20. 940 CMR 3.17(6)(c) makes it an unfair or deceptive practice to retain, as damages for a tenant's breach, any amount exceeding the damages the owner is actually entitled to under law; 940 CMR 3.17(6)(d) bars requiring rent for periods the tenant was not obligated to and did not occupy. A clause forcing the tenant to forfeit the deposit or pay all remaining rent on early move-out, regardless of the landlord's actual loss, is an unfair or deceptive practice. status=draft-unverified: must be reviewed by a Massachusetts tenant attorney / legal-aid clinic before public conclusions.

### `ma-termination-001` — Early-termination penalty exceeding the landlord's actual damages

**Severity:** questionable (Worth checking (context-dependent))

**What the rule treats as wrong:** Per 940 CMR 3.17(6)(c), it is an unfair or deceptive practice for an owner to retain, as damages for a tenant's breach of lease, any amount exceeding the damages the owner is actually entitled to under law (or otherwise agreed). 940 CMR 3.17(6)(d) bars demanding rent for periods the tenant did not occupy and was not obligated to occupy. A clause that makes the tenant automatically forfeit the deposit or pay all remaining rent on early move-out — without regard to the landlord's real loss or re-renting — exceeds lawful damages.

**Tenant-facing wording (shown in the app):** If you break the lease early, the landlord can charge for their actual losses — not an automatic penalty of the whole deposit or every remaining month. A clause that bills you flat for all remaining rent regardless of what the landlord actually lost may not hold up in Massachusetts.

**Example clause this flags (illustrative):** *The Tenant shall forfeit the deposit if the Tenant elects early termination of this Lease.*

**Citations:**

- [940 CMR 3.17(6)(c)](https://www.mass.gov/doc/940-cmr-3-consumer-protection-general-regulations/download)

  > Retain as damages for a tenant's breach of lease, of the failure of a prospective tenant to enter into a written rental agreement after signing a rental application, any amount which exceeds the damages to which he is entitled under the law, or an amount which the parties have otherwise agreed as to the amount of the damages;

- [940 CMR 3.17(6)(d)](https://www.mass.gov/doc/940-cmr-3-consumer-protection-general-regulations/download)

  > Require payment for rent for periods during which the tenant was not obligated to occupy and did not in fact occupy the dwelling unit unless otherwise agreed to in writing by the parties;

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

## Landlord entry

> **Statute context:** Massachusetts landlord-entry rules, quoted verbatim from M.G.L. c. 186, § 15B(1)(a) on malegislature.gov and 940 CMR 3.17(6)(e) (the Attorney General's c. 93A landlord-tenant regulation) on mass.gov, both retrieved 2026-06-20. NOTE ON SECTION NUMBERING: the entry/access rule lives in § 15B(1)(a) (the security-deposit section's opening clause), NOT in § 15 — § 15 is the landlord-exculpation void provision. Both the statute and the regulation enumerate the ONLY purposes for which a lessor may enter before the lease ends (inspect, repair, show to a prospective tenant/buyer/mortgagee), plus court order, apparent abandonment, and end-of-tenancy damage inspection. A clause letting the landlord enter at any time / for any reason / without notice exceeds those purposes. status=draft-unverified: must be reviewed by a Massachusetts tenant attorney / legal-aid clinic before public conclusions.

### `ma-entry-001` — Landlord may enter at any time / for any reason / without notice

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per M.G.L. c. 186, § 15B(1)(a), a residential lease may not contain a provision letting the lessor enter before the lease ends except to inspect, to make repairs, or to show the unit to a prospective tenant, purchaser, or mortgagee (plus by court order, on apparent abandonment, or for end-of-tenancy damage inspection). 940 CMR 3.17(6)(e) makes entry for any other purpose an unfair or deceptive practice. A clause granting the landlord a general right to enter at any time, for any reason, or without notice is unenforceable.

**Tenant-facing wording (shown in the app):** In Massachusetts a landlord can enter only for specific reasons — to inspect, make repairs, or show the place — plus a court order, apparent abandonment, or an end-of-tenancy damage check. A lease clause saying they can 'enter at any time' or 'for any reason' goes beyond what the law allows.

**Example clause this flags (illustrative):** *The Landlord may enter the premises at any time and for any reason without notice to the Tenant.*

**Citations:**

- [M.G.L. c. 186, § 15B(1)(a)](https://malegislature.gov/Laws/GeneralLaws/PartII/TitleI/Chapter186/Section15B)

  > No lease relating to residential real property shall contain a provision that a lessor may, except to inspect the premises, to make repairs thereto or to show the same to a prospective tenant, purchaser, mortgagee or its agents, enter the premises before the termination date of such lease.

- [940 CMR 3.17(6)(e)](https://www.mass.gov/doc/940-cmr-3-consumer-protection-general-regulations/download)

  > Enter a dwelling unit other than (i) to inspect the premises, or (ii) to make repairs thereto, or (iii) to show the same to a prospective tenant, purchaser, mortgagee or its agents, or (iv) pursuant to a court order, or (v) if the premises appear to have been abandoned by the tenant, or (vi) to inspect, during the last 30 days of the tenancy or after either party has given notice to the other of intention to terminate the tenancy, for the purpose of determining the amount of damage

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

## Security deposits

> **Statute context:** Massachusetts security-deposit rules, quoted verbatim from M.G.L. c. 186, § 15B on malegislature.gov, retrieved 2026-06-20. § 15B(1)(b)(iii) caps a security deposit at the first month's rent. § 15B(1)(e) makes the deposit the tenant's property, not to be commingled with the lessor's assets nor subject to the lessor's creditors. § 15B(3)(a) requires a separate, interest-bearing Massachusetts bank account beyond the claim of creditors. § 15B(3)(b) requires 5% annual interest. § 15B(4) requires return within 30 days with a sworn itemized list of any damage. § 15B(7) awards treble damages for forfeiting violations. § 15B(8) voids any conflicting lease term or waiver. status=draft-unverified: must be reviewed by a Massachusetts tenant attorney / legal-aid clinic before public conclusions.

### `ma-deposit-001` — Security deposit exceeds one month's rent

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per M.G.L. c. 186, § 15B(1)(b), at or before the start of a tenancy a lessor may require no more than first month's rent, last month's rent, a security deposit equal to the first month's rent, and the cost of a new key and lock. A security deposit larger than one month's rent — or a demand for two or three months as a deposit — exceeds the statutory cap and is unenforceable as to the excess.

**Tenant-facing wording (shown in the app):** In Massachusetts the most a landlord can take as a security deposit is one month's rent. If the lease asks for two or three months as a deposit, the extra isn't allowed.

**Example clause this flags (illustrative):** *The Tenant shall pay a security deposit of two months' rent before taking occupancy.*

**Citations:**

- [M.G.L. c. 186, § 15B(1)(b)](https://malegislature.gov/Laws/GeneralLaws/PartII/TitleI/Chapter186/Section15B)

  > At or prior to the commencement of any tenancy, no lessor or agent of the lessor may require a tenant or prospective tenant to pay, to the lessor or to an agent of the lessor, any amount in excess of the following: (i) rent for the first full month of occupancy; and, (ii) rent for the last full month of occupancy calculated at the same rate as the first month; and, (iii) a security deposit equal to the first month's rent

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `ma-deposit-002` — Security deposit commingled / treated as the landlord's money

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per M.G.L. c. 186, § 15B(1)(e), a security deposit continues to be the tenant's property, may not be commingled with the lessor's assets, and is not subject to the lessor's creditors. § 15B(3)(a) requires it to be held in a separate, interest-bearing Massachusetts bank account beyond the claim of creditors. A clause letting the landlord commingle the deposit or treat it as their own funds is unenforceable.

**Tenant-facing wording (shown in the app):** Your deposit stays your money — the landlord just holds it in a separate bank account. A clause letting them mix it with their own funds or treat it as theirs isn't allowed in Massachusetts.

**Example clause this flags (illustrative):** *The Landlord may commingle the security deposit with the Landlord's own funds and general operating accounts.*

**Citations:**

- [M.G.L. c. 186, § 15B(1)(e)](https://malegislature.gov/Laws/GeneralLaws/PartII/TitleI/Chapter186/Section15B)

  > A security deposit shall continue to be the property of the tenant making such deposit, shall not be commingled with the assets of the lessor, and shall not be subject to the claims of any creditor of the lessor or of the lessor's successor in interest, including a foreclosing mortgagee or trustee in bankruptcy

- [M.G.L. c. 186, § 15B(3)(a)](https://malegislature.gov/Laws/GeneralLaws/PartII/TitleI/Chapter186/Section15B)

  > Any security deposit received by such lessor shall be held in a separate, interest-bearing account in a bank, located within the commonwealth under such terms as will place such deposit beyond the claim of creditors of the lessor

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `ma-deposit-003` — No interest paid on the security deposit

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per M.G.L. c. 186, § 15B(3)(b), a lessor holding a security deposit for one year or longer must pay the tenant interest at 5% per year (or the lesser amount actually earned at the bank), payable at the end of each year of the tenancy. A clause stating the deposit earns no interest, or that the landlord keeps any interest, conflicts with the statute and is void under § 15B(8).

**Tenant-facing wording (shown in the app):** If your landlord holds your deposit for a year or more, they owe you interest on it — 5% a year, or whatever the bank actually paid, every year. A clause saying you get no interest doesn't hold up.

**Example clause this flags (illustrative):** *The security deposit shall not bear interest of any kind for the benefit of the Tenant.*

**Citations:**

- [M.G.L. c. 186, § 15B(3)(b)](https://malegislature.gov/Laws/GeneralLaws/PartII/TitleI/Chapter186/Section15B)

  > A lessor of residential real property who holds a security deposit pursuant to this section for a period of one year or longer from the commencement of the term of the tenancy shall, beginning with the first day of the tenancy, pay interest at the rate of five per cent per year, or other such lesser amount of interest as has been received from the bank where the deposit has been held payable to the tenant at the end of each year of the tenancy.

- [M.G.L. c. 186, § 15B(8)](https://malegislature.gov/Laws/GeneralLaws/PartII/TitleI/Chapter186/Section15B)

  > Any provision of a lease which conflicts with any provision of this section and any waiver by a tenant or prospective tenant of any provision of this section shall be deemed to be against public policy and therefore void and unenforceable.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `ma-deposit-004` — Security deposit not returned within 30 days / no itemized list

**Severity:** illegal (Illegal / unenforceable)

**What the rule treats as wrong:** Per M.G.L. c. 186, § 15B(4), the lessor must return the deposit (or its balance) within thirty days after the tenancy ends, and any deduction for damage must be supported by a sworn, itemized list within those thirty days. A clause giving the landlord more than 30 days, or letting them keep the deposit without an itemized accounting, conflicts with the statute and is void under § 15B(8).

**Tenant-facing wording (shown in the app):** You're owed your deposit back within 30 days of moving out. If the landlord keeps any of it for damage, they have to send you a signed, itemized list within those 30 days — a clause giving them longer, or no list at all, isn't enforceable.

**Example clause this flags (illustrative):** *The Landlord shall return the deposit within forty-five (45) days after the Tenant vacates.*

**Citations:**

- [M.G.L. c. 186, § 15B(4)](https://malegislature.gov/Laws/GeneralLaws/PartII/TitleI/Chapter186/Section15B)

  > The lessor shall, within thirty days after the termination of occupancy under a tenancy-at-will or the end of the tenancy as specified in a valid written lease agreement, return to the tenant the security deposit or any balance thereof

- [M.G.L. c. 186, § 15B(4)(iii)](https://malegislature.gov/Laws/GeneralLaws/PartII/TitleI/Chapter186/Section15B)

  > the lessor shall provide to the tenant within such thirty days an itemized list of damages, sworn to by the lessor or his agent under pains and penalties of perjury, itemizing in precise detail the nature of the damage and of the repairs necessary to correct such damage

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

### `ma-deposit-005` — Non-refundable security deposit

**Severity:** questionable (Worth checking (context-dependent))

**What the rule treats as wrong:** A security deposit remains the tenant's property (M.G.L. c. 186, § 15B(1)(e)) and must be returned, less lawful itemized deductions, within thirty days of the tenancy's end (§ 15B(4)). Labeling the deposit 'non-refundable' conflicts with that scheme and is void under § 15B(8). (A statute-authorized optional fee in lieu of a deposit is a different thing and is not a security deposit.)

**Tenant-facing wording (shown in the app):** A deposit isn't a fee — calling it 'non-refundable' doesn't make it so. In Massachusetts you're owed it back within 30 days of moving out, minus an itemized list of any real damage.

**Example clause this flags (illustrative):** *The first month's payment labeled herein is a non-refundable security deposit and will not be returned under any circumstances.*

**Citations:**

- [M.G.L. c. 186, § 15B(1)(e)](https://malegislature.gov/Laws/GeneralLaws/PartII/TitleI/Chapter186/Section15B)

  > A security deposit shall continue to be the property of the tenant making such deposit, shall not be commingled with the assets of the lessor

- [M.G.L. c. 186, § 15B(8)](https://malegislature.gov/Laws/GeneralLaws/PartII/TitleI/Chapter186/Section15B)

  > Any provision of a lease which conflicts with any provision of this section and any waiver by a tenant or prospective tenant of any provision of this section shall be deemed to be against public policy and therefore void and unenforceable.

**Reviewer:** ☐ Accurate ☐ Needs change — *severity? · citation/quote? · framing? · UPL?*

> Notes:

---

*All rules `draft-unverified`. Generated from `rules/ma/*.json`by`scripts/build_review_packet.py` — regenerate after any rule change. LeaseLookout is not a law firm and this packet is not a request for legal advice to any individual; it is a request to review curated legal-information content for accuracy.*
