<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:leaselookout -->

# LeaseLookout

A tenant-side "defensive API": upload a lease PDF, get its illegal/abusive clauses flagged against Connecticut housing law, each with a statute citation in plain English. MVP wedge: Wesleyan off-campus renters in Middletown, CT. Later (out of MVP scope): maintenance ledger, security-deposit demand letters, roommate finances.

## Stack

- **Web app:** Next.js 16 (App Router, TS) + Tailwind v4, on Vercel.
- **Auth / DB / file storage:** Supabase.
- **Parser engine:** Python (`engine/`) — runs locally for dev and as a Vercel Python function in prod. Importable and unit-tested standalone.
- **Ruleset:** curated, statute-cited JSON in `rules/` — the source of truth for what counts as "illegal".

## Non-negotiables (read before proposing changes)

1. **No paid LLM API.** Cost-sensitive build. Free/local only. The clause matcher lives behind a swappable interface (`engine/matchers/base.py`); a deterministic matcher ships first, and a *free local* semantic matcher can be A/B'd against it later on the same leases — never a metered API.
2. **Never invent law.** A matcher only decides *whether* a curated `Rule` fires; it never decides what the law is. Every flag must carry a citation to a primary source. The product always shows "this is not legal advice" framing. Get the ruleset attorney/legal-aid reviewed before shipping public conclusions.
3. **Next.js 16 post-dates most training data.** Before writing Next routing / server-component / config code, read the relevant guide in `node_modules/next/dist/docs/` (see the warning at the top of this file). Don't assume Next 14/15 patterns.

## Layout

- `src/app/` — Next.js app.
- `engine/` — Python parser (`extract → match → flags`). `engine/matchers/` is the swappable seam.
- `rules/<jurisdiction>/*.json`— curated ruleset;`rules/schema.json` is the format; citations are mandatory.

## Dev

- Web: `npm run dev`(<http://localhost:3000>),`npm run build`, `npm run lint`.
- Engine: **uv only** (no pip, no requirements.txt). `uv sync --group dev`, then `uv run pytest`. Re-run `uv lock`after any`pyproject.toml`dependency change; CI syncs`--frozen`.

## Deploy

**GitHub auto-deploy only.**Push to `main` (`Builder106/lease-lookout`) and Vercel builds + ships — the repo is git-connected. Don't use the `vercel deploy`CLI: it uploads gitignored files (e.g. the local`project/`design export) and diverges from the git build. Use`vercel` only for read-only checks (`ls`, `inspect --logs`, `curl`, `env`). The deployment stays **private** (behind Vercel Authentication), never public. The repo itself is public: never commit secrets, personal details, private correspondence, or machine-specific paths.
<!-- END:leaselookout -->
