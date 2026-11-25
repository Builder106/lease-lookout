# LeaseLookout

> **Tenant rights assistant for residential leases.** Upload your rental lease to identify potentially illegal or unenforceable clauses before signing.

[![CI](https://github.com/Builder106/lease-lookout/actions/workflows/ci.yml/badge.svg)](https://github.com/Builder106/lease-lookout/actions/workflows/ci.yml)

**Status:** early build (summer 2026). In active development.

## 💡 What is LeaseLookout?

Most renters are handed 30 to 50-page legal leases filled with dense clauses they cannot easily decipher. Some landlords include clauses that actually violate local tenant rights laws (such as illegal security deposit deductions, unreasonable entry notices, or unfair maintenance waivers).

LeaseLookout is an automated document reviewer for renters. You upload your lease PDF, and the platform scans every clause against local housing statutes (starting with Connecticut law), highlighting questionable terms and explaining your legal rights in plain English with direct legal citations.

> ⚠️ **Not legal advice:** LeaseLookout provides educational information and statute citations to help you review a lease. It is not a law firm and does not provide formal legal representation. For critical disputes, consult a certified tenant attorney or legal aid clinic.

## How it works

The tenant uploads a lease PDF. The web app stores the encrypted file in Supabase, then asks the Python engine to extract its text and compare clauses with the verified Connecticut ruleset. The report shows flagged clauses, statute citations, and plain English notes.

The clause matcher evaluates document text against curated housing statute definitions. The legal rules (`rules/` directory) serve as the authoritative benchmark for tenant protections without relying on paid black-box AI APIs.

## Tech Stack

- **Web Frontend:** Next.js 16 (React 19, TypeScript) and Tailwind CSS v4
- **Database & Storage:** Supabase
- **Document Parser:** Python text extraction engine
- **Rules Engine:** Curated statutory rule definitions in JSON (`rules/ct/`)

## Repo layout

| Path | What |
| --- | --- |
| `src/app/` | Next.js app |
| `engine/` | Python parser:`extract → match → flags` |
| `engine/matchers/` | swappable matcher seam (deterministic first) |
| `rules/` | curated, statute-cited ruleset +`schema.json` |
| `docs/feature-audit-and-roadmap.md` | feature audit, maintenance plan & roadmap |

## Develop

### Web app

```bash
npm run dev        # http://localhost:3000
npm run build
```

### Parser engine (uv — see `engine/README.md`)

```bash
uv sync --group dev
uv run pytest
```

## License

Proprietary — all rights reserved. © 2026 Yinka Vaughan. (Final license posture for this commercial product is still to be decided — see `JOURNAL.md`.)
