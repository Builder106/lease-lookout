# LeaseLookout Feature Audit & Technical Roadmap

This document provides a comprehensive audit of the current capabilities of LeaseLookout (as of Summer 2026), outlines ongoing maintenance requirements, details planned improvements to existing features, and establishes a prioritized roadmap for future capabilities.

---

## 1. Executive Summary & Core Constraints

LeaseLookout is a tenant-side "defensive API" designed to level the information asymmetry between landlords (equipped with enterprise management tools like Yardi or AppFolio) and renters signing multi-page residential leases.

### Non-Negotiable Operational & Technical Principles

1. **Zero Paid LLM APIs:** All clause parsing relies on deterministic pattern matching or free, locally hosted open-source models (`engine/matchers/`). No metered external API calls.
2. **Statutory Grounding & UPL Compliance:** LeaseLookout provides legal *information*, not legal advice. Every flagged clause links to a primary statutory citation (e.g., Conn. Gen. Stat. § 47a-4).
3. **Deployment:** Next.js web application deployed on Vercel (private mode); Python parsing engine executed via serverless function or decoupled worker.

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

### Phase 1: Pre-Lease Signing Tools (Fall 2026)

1. **Tenant Counter-Offer Generator ("Negotiation Cheat Sheet"):**

- *Description:* Generates polite, professionally formatted email drafts requesting clause modification or removal, citing the exact statutory provision (e.g., "Request removing § 14 per Conn. Gen. Stat. § 47a-4(a)(3)").
- *Target User:* Wesleyan student renters negotiating off-campus leases.

1. **Multi-State Ruleset Expansion (MA, NY, RI):**

- *Description:* Graduate Massachusetts, New York, and Rhode Island rulesets from draft review packets into fully verified, test-covered ruleset modules.

### Phase 2: Move-In & Tenancy Protection (Spring 2027)

1. **Pre-Occupancy Walk-Through Checklist (CT § 47a-7c):**

- *Description:* Interactive move-in inspection tool enabling renters to log existing property damage, upload photos, and generate a timestamped walk-through document.
- *Value:* Protects against illegal security deposit deductions at move-out.

1. **Security Deposit Demand Letter Drafts (CT § 47a-21):**

- *Description:* Automated post-tenancy tool for generating formal security deposit return demand letters with statutory 21-day interest calculations.

---

## 6. Implementation & Verification Protocols

All software changes must pass the following verification battery prior to deployment:

- **TypeScript Static Verification:** `tsc --noEmit`&`npm run build`via`verify-on-vm`.
- **Python Engine Test Suite:** `uv run pytest`covering`test_sample_lease.py`, `test_scope.py`, `test_segment.py`, `test_smoke.py`, and `test_rule_coverage.py`.
- **Ruleset Coverage Guarantee:** Every rule in `rules/<jurisdiction>/*.json`must have a corresponding test case in`test_rule_coverage.py` asserting that it fires against a synthetic test lease.
