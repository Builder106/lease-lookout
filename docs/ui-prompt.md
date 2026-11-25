# LeaseLookout — AI UI-generation prompt

## How to use this

- Best matches: **v0.dev**(outputs Next.js + Tailwind + shadcn/ui — your exact stack, so components drop into the real app),**Lovable**/**Bolt.new** (clickable full-app prototypes), or Figma Make for pure visuals.
- For best results, generate the **landing page**and the**app** in *separate* sessions. Paste the **Shared context** block with each one, then add the screen you want.
- It's intentionally opinionated about the look — that's what keeps these tools from defaulting to generic SaaS slop. Trim if a tool's prompt box is small.

---

## ── SHARED CONTEXT (paste this with every screen) ──

You are designing **LeaseLookout**, a web app that helps renters understand their lease. Design with the taste and restraint of Linear, Stripe, and Mercury — but **warmer and more human**, because the user is often an anxious 20-year-old signing their first lease, not an enterprise buyer.

**What it does:**a renter uploads their lease PDF; LeaseLookout reads it against Connecticut landlord-tenant law and returns a plain-English report — "the Lookout" — that flags clauses which may be**illegal / unenforceable**or**worth checking**, each with the exact statute cited. It's the counterweight to the enterprise software landlords use. First market: off-campus student renters around Wesleyan University in Middletown, CT.

**Who it's for / the emotional job:**a first-time renter who feels powerless against a confusing 50-page contract and a landlord who holds all the leverage. The UI's job is to make them feel**clear, calm, and in control** — informed, not scared.

**Voice:** a knowledgeable friend who's on your side. Calm, plain-spoken, empowering. Never alarmist, never lawyerly, never hypey.

**Art direction (be specific — avoid the generic AI look):**

- Mood: quiet confidence, editorial calm, trustworthy — a product that feels like it's protecting you.
- Color: warm off-white / paper background in light mode, a true *near-black* (not pure black) in dark mode, ink-colored text. **One**confident brand accent — a deep, calm**emerald/teal**(trust, "shield"), used sparingly. A strict**semantic palette**: muted **red/rose**= "likely unenforceable," warm**amber** = "worth checking," neutral = "good to know." Color carries meaning; don't decorate with it.
- Type: a clean humanist sans for UI (Inter / Geist). Optionally a refined serif for the big hero line to feel editorial and human. Confident, tight headline tracking; comfortable reading measure for body text.
- Layout: generous whitespace, a calm single-column reading flow for the report, clear hierarchy. Flags are cards with a thin colored left-border/ring matching their severity.
- Motion: subtle and purposeful — flags fade-and-rise gently as they appear; a calm "reading your lease…" state. No bouncy/playful motion. Light scrollytelling on the landing page is welcome (walk through one example clause as the user scrolls).
- Iconography: minimal, line-based. A tasteful shield/lock motif for the brand mark is welcome — never a cartoon shield.
- Dark mode: first-class, via CSS variables.

**Avoid (these read as generic AI output):** purple→blue gradients, glassmorphism everywhere, floating 3D blobs/spheres, hero stock illustrations of people at laptops, emoji in headings, fake "Trusted by" logo walls, invented testimonials, "🚀 Supercharge your…" copy, neon glows, and cluttered feature grids.

**Build constraints:**output**React + TypeScript + Tailwind CSS**(use**shadcn/ui** if available). Semantic, accessible HTML — real headings, labeled inputs, visible focus states, WCAG-AA contrast, aria where needed. Mobile-first and fully responsive. Componentize (`AppHeader`, `UploadDropzone`, `ReportSummary`, `FlagCard`, `SeverityPill`). Don't invent features, pricing, or stats beyond what's described.

---

## ── SCREEN A: Landing page (public marketing one-pager, invite-only beta) ──

A calm, confident single page. Sections, top to bottom:

1. **Hero** — Headline: *"Know what your lease really says."*Subhead:*"Upload your lease and see which clauses may be illegal or unenforceable under Connecticut law — in plain English, with the statute. Built for renters."* Primary CTA **"Request access"**(it's an invite-only beta), secondary**"See how it works."** No stock art — let type and a restrained visual carry it (e.g., a faint lease document with one clause highlighted/struck-through).
2. **The problem** — a sharp line: *"Landlords have enterprise software. You have a 50-page PDF and a pen."* One short paragraph on the power asymmetry.
3. **How it works**— three steps:**Upload your lease → We read it against CT law → Get a plain-English report with citations.**
4. **What it catches** — 2–3 real example flag cards (use the Example content below).
5. **Trust & honesty** — *"Every flag cites the actual statute, so you can verify it. LeaseLookout isn't a lawyer and doesn't give legal advice — it points you to the law so you can ask better questions."*Plus a privacy line:*"Your lease is yours. Only you can see your analyses."*
6. **Who it's for** — Connecticut / Wesleyan off-campus renters, for now.
7. **Footer** — the not-legal-advice disclaimer, *"Connecticut leases only, for now,"* invite-only beta note, minimal nav.

---

## ── SCREEN B: The app (authenticated product) ──

**App shell:** a slim top bar — brand mark (left); "My analyses" link; signed-in email (muted); "Sign out" (right). Calm and unobtrusive.

**a) Upload / empty state** — a large dashed drop-zone: *"Choose a PDF lease, or drop it here,"*helper*"PDF up to 20 MB."* Primary **"Analyze lease"** button, disabled until a file is selected. A reassuring one-line privacy note.

**b) Analyzing state** — a calm *"Reading your lease…"* state that feels like careful reading, not a generic spinner.

**c) The Lookout report (core screen):**

- Summary header, e.g. *"2 clauses worth your attention,"*with a quieter line:*"Analyzed 7 pages. This isn't every possible issue — it's the patterns we check for so far."*
- A vertical list of **flag cards**, most-serious first. Each card has: a **severity pill** (with a small dot) + a faint *"page 3"*; a **title**; a **plain-English explainer**(1–2 calm sentences); the**matched clause**as a monospaced quote;**statute citation link(s)**("Conn. Gen. Stat. § 47a-4(a)(3) ↗"); and a small muted**"draft · not verified"** badge.
- A persistent, calm disclaimer block at the bottom: *"This is not legal advice. Verify anything important with a Connecticut tenant attorney or legal-aid clinic."*

**d) Clean state** — when nothing flags: *"Nothing jumped out"* — reassuring, not empty-feeling.

**e) Scanned-PDF state** — *"We couldn't read this PDF's text — it looks scanned. Try a digital PDF."*

**f) My analyses (history list)** — rows with filename, date, page count, and severity-count chips ("2 illegal," "1 to check," or "clean"). Click → detail.

**g) Analysis detail** — the same Lookout report re-rendered from a saved analysis, with a back link.

**h) Login / sign up** — minimal, centered. Email + password, with a toggle between sign in and sign up. Invite-only framing: *"LeaseLookout is invite-only while in beta."*

---

## ── REAL EXAMPLE CONTENT (paste with Screen B; populate the flag cards with these, not lorem ipsum) ──

1. **Likely unenforceable — Landlord exculpation / hold-harmless** · page 3

   *Your landlord can't use the lease to dodge responsibility for their own negligence, or make you cover their legal costs. "Hold harmless" clauses generally don't hold up.*
   Matched: "…the Tenant shall hold the Landlord harmless and indemnify the Landlord…" · Conn. Gen. Stat. § 47a-4(a)(3)

2. **Likely unenforceable — Security deposit over the legal limit** · page 1

   *In Connecticut a deposit can't exceed two months' rent — one month if you're 62 or older. Anything more isn't enforceable.*
   Matched: "…a security deposit equal to three months' rent…" · Conn. Gen. Stat. § 47a-21(b)

3. **Likely unenforceable — Entry without notice** · page 5

   *Your landlord generally has to give reasonable notice before entering, except in an emergency. "Anytime, without notice" isn't enforceable.*
   Matched: "…Landlord may enter the premises at any time without notice…" · Conn. Gen. Stat. § 47a-16

4. **Worth checking — Late fee** · page 2

   *Connecticut gives you a grace period (9 days for a monthly tenancy) before rent is "late." A fee charged before that isn't allowed — check the timing.*
   Conn. Gen. Stat. § 47a-15a

5. **Worth checking — Landlord's attorney's fees** · page 6

   *If you lose a rent case, the most you can be made to pay toward the landlord's lawyer is 15% of the judgment. Watch for uncapped "all attorney's fees" language.*
   Conn. Gen. Stat. § 47a-4(a)(7)

---

*Deliver the landing page and the app as separate, clearly-labeled views. Keep it production-quality and componentized.*
