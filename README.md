# LeaseLookout

> **Get your security deposit back.** LeaseLookout helps renters record the apartment at move-in, know the landlord's legal deadline at move-out, and send a demand letter that cites the law.

[![CI](https://github.com/Builder106/lease-lookout/actions/workflows/ci.yml/badge.svg)](https://github.com/Builder106/lease-lookout/actions/workflows/ci.yml)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](LICENSE)
[![Rules: CC BY 4.0](https://img.shields.io/badge/Rules-CC_BY_4.0-lightgrey.svg)](rules/LICENSE)

**Status:** invite-only beta. The lease check works today for Connecticut. The deposit tools are in development.

## Why deposits

Most renters can't negotiate a lease in a tight market, and few can afford a lawyer to fight one later. So knowing a clause is illegal at signing often changes nothing.

The security deposit is different. The law gives landlords a deadline to return it: 21 days in Connecticut, and 30 days in Massachusetts along with a sworn, itemized list of damages. Disputes go to small claims court, where you don't need a lawyer. A clear letter that names the statute often gets the money back without going to court at all.

LeaseLookout covers that whole path:

1. **Move in.** Record the apartment's condition room by room with timestamped photos. That record is the evidence most deposit disputes turn on.
2. **Upload your lease.** LeaseLookout checks it against your state's tenant laws and flags clauses that may be illegal or unenforceable, each with the statute. *(Available now for Connecticut.)*
3. **Move out.** See the date your landlord must return the deposit by.
4. **If it doesn't come back.** Get a demand letter that cites the law, then a small claims checklist if you need it.

> ⚠️ **Not legal advice.** LeaseLookout gives legal information and statute citations. It is not a law firm and does not represent you. For a specific situation, contact a tenant-rights attorney or legal-aid clinic.

## Open source

LeaseLookout is open source so anyone can read and check the rules about what landlords can and can't do.

- **Code** (app and engine) is licensed under the [GNU AGPL v3](LICENSE).
- **Rulesets and plain-English explainers** in [`rules/`](rules/) are licensed under [CC BY 4.0](rules/LICENSE). Legal aid groups, clinics, and other tenant tools are welcome to reuse them with credit.

Every rule quotes a primary source and starts as `draft-unverified` until a tenant attorney or legal-aid clinic reviews it. If you practice housing law in New England and can review a state's deposit rules, please open an issue.

Contributions are welcome. Corrections to a rule should cite the statute or regulation they rely on.

## How it works

The web app stores the uploaded lease encrypted in Supabase and asks the Python engine to extract its text and compare each clause with the curated ruleset for that state. The report shows flagged clauses, statute citations, and plain-English notes. Matching is deterministic and runs without paid AI services. The matcher only decides whether a rule applies; the rules in `rules/` decide what the law says.

## Tech stack

- **Web app:** Next.js 16 (React 19, TypeScript) and Tailwind CSS v4
- **Auth, database and storage:** Supabase
- **Engine:** Python text extraction and clause matching (`engine/`)
- **Rules:** statute-cited JSON per state (`rules/<state>/`)

## Repo layout

| Path | What |
| --- | --- |
| `src/app/` | Next.js app |
| `engine/` | Python parser: `extract → match → flags` |
| `engine/matchers/` | swappable matcher interface (deterministic first) |
| `rules/` | curated, statute-cited rulesets and `schema.json` |
| `docs/feature-audit-and-roadmap.md` | feature audit and roadmap |

## Develop

### Web app

```bash
npm install
npm run dev
npm run build
```

The dev server runs at http://localhost:3000. Copy `.env.example` to `.env.local` and fill in your own Supabase project values.

### Engine

```bash
uv sync --group dev
uv run pytest
```

See `engine/README.md` for details.

## License

Code: [AGPL-3.0](LICENSE). Rules and explainers: [CC BY 4.0](rules/LICENSE). © 2026 Yinka Vaughan.
