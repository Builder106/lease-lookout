# LeaseLookout Feature Audit & Technical Roadmap

This document provides a comprehensive audit of the current capabilities of LeaseLookout (as of Summer 2026), outlines ongoing maintenance requirements, details planned improvements to existing features, and establishes a prioritized roadmap for future capabilities.

---

## 1. Executive Summary & Core Constraints

LeaseLookout is a tenant-side "defensive API" designed to level the information asymmetry between landlords (equipped with enterprise management tools like Yardi or AppFolio) and renters signing multi-page residential leases.

### Non-Negotiable Operational & Technical Principles

1. **Zero Paid LLM APIs:** All clause parsing relies on deterministic pattern matching or free, locally hosted open-source models (`engine/matchers/`). No metered external API calls.
2. **Statutory Grounding & UPL Compliance:** LeaseLookout provides legal *information*, not legal advice. Every flagged clause links to a primary statutory citation (e.g., Conn. Gen. Stat. § 47a-4).
3. **Open Source:** Code is AGPL-3.0; rulesets and plain-English explainers are CC BY 4.0, so legal aid groups and clinics can reuse them.
4. **Deployment:** Next.js web application deployed on Vercel (private mode); Python parsing engine executed via serverless function or decoupled worker.

---

## 2. Feature Audit: Current State (Summer 2026)

| Feature Module | Current Implementation | Technical Components | Status |
| :--- | :--- | :--- | :--- |
| **Landing & Brand Identity** | Animated 3D hero (Blender render + Motion 12.40), Watchtower mark, stat counters, invite form, legal disclaimers. | Next.js 16 (App Router), Tailwind v4, lucide-react, next/font (Inter, Instrument Serif, JetBrains Mono) | **Production-Ready** (Private Prod) |
| **Authentication & Access** | Email/password sign-in, invite-only flow, JWT claim verification via `getClaims()`, session proxy middleware (`src/proxy.ts`). | Supabase Auth (`@supabase/ssr`), Next 16 Proxy | **Production-Ready** |
| **Lease Document Intake** | Drag-and-drop upload form (PDF up to 20MB), state jurisdiction selector (Auto-detect + manual override). | `src/components/Analyzer.tsx`, `/api/analyze` POST endpoint | **Production-Ready** |
| **Parsing & Extraction Engine** | Multi-page text extraction (`pdfplumber`) with OCR fallback via `PyMuPDF`+`tesseract` CLI over stdin. | Python 3.12 (`engine/extract.py`), `uv` package manager | **Production-Ready** (Digital & Scanned PDFs) |
| **Scope & Jurisdiction Routing** | Automatic jurisdiction detection, statutory fingerprinting, institutional housing carve-out checks (CT § 47a-2(a)). | `engine/scope.py`, `ScopeBanner.tsx` UI warning | **Production-Ready** |
| **Rule Matching Engine** | Swappable matcher seam (`engine/matchers/base.py`), `DeterministicMatcher` (regex/keyword matching with negation windows). | Python (`engine/matchers/deterministic.py`) | **Production-Ready** (Deterministic v1) |
| **Curated Rulesets** | Connecticut ruleset (23 curated rules with verbatim statute quotes), plus draft review packets for MA, ME, NH, NY, RI, VT. | `rules/ct/*.json`, `rules/schema.json` | **Active / Draft-Unverified** |
| **Lookout Report UI** | Scrollytelling report, severity pills (`illegal`, `questionable`, `info`), verbatim statutory text, direct law links. | `LookoutReport.tsx`, `SeverityPill.tsx` | **Production-Ready** |
| **Saved Analysis History** | User lease history list (`/history`) and detail view (`/history/[id]`) with Postgres Row-Level Security (`auth.uid() = user_id`). | Supabase Postgres (`analyses` table), RLS policies | **Production-Ready** |
| **Legal Review Packet Generator** | Automated Markdown and Word (`.docx`) review packet builder for attorney and legal-aid audit workflows. | `scripts/build_review_packet.py`, `scripts/build_review_packet_docx.py` | **Production-Ready** |

---

## 3. Maintenance Plan

### 3.1 Codebase & Dependency Hygiene

- **Next.js & React Upgrade Tracking:** Keep Next.js 16 and React 19 updated. Verify Next.js App Router conventions against `node_modules/next/dist/docs/`.
- **Python Engine (`uv`):** Execute all dependency modifications through `uv` (`pyproject.toml`and`uv.lock`). Run `uv sync --group dev` and `uv run pytest`.
- **Node Environment Pinning:** Maintain `.node-version` (`24`) to match the verified runtime and keep local and CI builds consistent.

### 3.2 Vercel Serverless Function Limits & Scaling Strategy

- **Timeout Mitigation:** Vercel Hobby functions time out at 10s. For heavy scanned PDFs, monitor execution duration.
- **Decoupled Architecture Seam:** If scanned PDF parsing or OCR load causes Vercel function timeouts, execute the migration plan outlined in `docs/architecture-scaling.md`:
  1. Decouple `api/analyze.py` from Vercel serverless.
  2. Deploy `engine/` to a persistent background worker (Fly.io / Render / Railway).
  3. Switch Next.js intake to async job submission with polling or webhook callbacks.

### 3.3 Statutory Ruleset Maintenance

- **Legal Review Tracking:** Track feedback from attorney and legal-aid reviewers. Update rule metadata from `status: "draft-unverified"`to`status: "attorney-reviewed"`.
- **Legislative Update Monitoring:** Monitor Connecticut General Assembly (CGA) public acts (e.g., P.A. 23-207 fee caps) and update rule JSON definitions annually before the academic leasing cycle (May–August).

---

## 4. Improvement Plan for Current Features

### 4.1 Matcher Precision & Context Handling

- **Enhanced Negation & Windowing:** Refine `DeterministicMatcher` regex windows to prevent false positives when clauses state tenant exceptions (e.g., "Landlord shall not enter without 24 hours notice").
- **Multi-Column & Table Extraction:** Improve `pdfplumber` layout parsing for dual-column lease layouts and tabular fee schedules.

### 4.2 Free Local Semantic Matcher (`engine/matchers/semantic.py`)

- **Seam Implementation:** Fulfill the swappable matcher interface using an open-source, local sentence transformer model (e.g., `all-MiniLM-L6-v2`via`onnxruntime`or`fastembed`).
- **A/B Matcher Benchmarking:** Add CLI benchmarking commands to evaluate `DeterministicMatcher`vs.`SemanticMatcher` on synthetic and sample leases without introducing paid API calls.

### 4.3 Report UX & Export Capabilities

- **Tenant PDF Export:** Add client-side PDF generation (or styled print layout) for the Lookout Report so tenants can bring a physical copy to lease negotiations.
- **Flag Filtering & Search:** Add filtering controls on the report view (by severity, topic area: security deposits, maintenance, fees, entry rights).
- **Page Anchor Jump:** Allow clicking a flag in the Lookout Report to highlight the exact page and paragraph in an embedded PDF viewer.

---

## 5. New Feature Additions

Re-prioritized on 2026-11-25 (see `JOURNAL.md`). Most tenants can't negotiate a lease in a tight market and can't afford a lawyer, so a list of void clauses at signing changes little. The security deposit is where tenants can win on their own: the law sets deadlines, disputes go to small claims court, and a clear letter that cites the statute often settles it.

### Phase 1: Deposit Recovery (Spring 2027, before the May move-out season)

1. **Move-In Record (CT § 47a-7c, MA c. 186 § 15B):**

- *Description:* Guided move-in walk-through. Renters log existing damage room by room with timestamped photos and get a dated record they can keep.
- *Value:* The evidence that decides most deposit disputes, captured on day one.

1. **Deposit Deadline Tracker (CT § 47a-21(d), MA c. 186 § 15B(4)):**

- *Description:* Starts counting at move-out and shows the landlord's legal deadline (21 days in Connecticut; 30 days in Massachusetts, with a sworn itemized list of damages).

1. **Deposit Demand Letter (CT § 47a-21, MA c. 186 § 15B):**

- *Description:* When the deadline passes or deductions look wrong, fills a demand letter template with the tenant's facts and the cited statute. Template language goes through legal-aid review before launch.

1. **Small Claims Packet:**

- *Description:* If the letter doesn't work, a checklist and filled forms for the right small claims court, with the move-in record attached.

### Phase 2: Lease Check as Background

1. **Lease Indexing:** The existing clause scan runs at upload and stays available, but its main job becomes matching later disputes to the right clause and statute.
1. **Multi-State Ruleset Expansion (MA, NY, RI):** Graduate the draft rulesets into verified, test-covered modules, starting with the deposit rules (a small, reviewable slice).

### Deprioritized

- **Tenant Counter-Offer Generator:** Useful only where tenants have bargaining power, which is rare in the current market.

---

## 6. Implementation & Verification Protocols

All software changes must pass the following verification battery prior to deployment:

- **TypeScript Static Verification:** `tsc --noEmit`&`npm run build`via`verify-on-vm`.
- **Python Engine Test Suite:** `uv run pytest`covering`test_sample_lease.py`, `test_scope.py`, `test_segment.py`, `test_smoke.py`, and `test_rule_coverage.py`.
- **Ruleset Coverage Guarantee:** Every rule in `rules/<jurisdiction>/*.json`must have a corresponding test case in`test_rule_coverage.py` asserting that it fires against a synthetic test lease.
