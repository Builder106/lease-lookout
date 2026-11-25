# Test fixtures — lease documents

Three tiers of test data for the engine.

## Tier 1 — public sample leases (NOT committed)

Real-world, mostly-**legal** templates — good for checking we don't over-flag.
They're third-party documents, so we don't commit them; fetch on demand:

```bash
bash scripts/fetch_sample_leases.sh
```

Lands PDFs in `sample_leases/` (gitignored). Sources: the CT Association of
Realtors form, university off-campus housing samples (`.edu`), and an FTC sample.

## Tier 2 — synthetic leases (committed, owned by us)

`synthetic/*.txt` are the source of truth:

- `clean-lease.txt` — a legal CT lease; the engine should flag **nothing**.
- `kitchen-sink-lease.txt` — plants one prohibited clause per rule; the engine

  should flag **every** rule.

`tests/test_rule_coverage.py` asserts exactly that — a coverage guard: add a rule,
add a clause, or the suite fails. Generate PDF versions for manual / upload testing:

```bash
python scripts/make_synthetic_pdfs.py   # writes synthetic/*.pdf (gitignored)
```

## Tier 3 — real Wesleyan leases (NEVER committed)

The real target. Collect from off-campus juniors/seniors, **redact names and
addresses first**, and keep them out of git entirely. The alpha is the richest source.
