# Parser engine

`extract → match → flags`. Pure Python, no web framework. Importable and
unit-tested standalone; in production it runs as a Vercel Python function.

- `extract.py`— PDF → per-page`TextSpan`s (pdfplumber; OCR fallback is a TODO).
- `rules.py`— loads the curated ruleset from`../rules/<jurisdiction>/`.
- `matchers/base.py`— the **swappable seam**: a`Matcher` decides which rules fire.
- `matchers/deterministic.py` — regex/keyword matcher (ships first; free; predictable).
- `pipeline.py`—`analyze(pdf_path, jurisdiction, matcher)` ties it together.
- `types.py`—`Rule`, `Flag`, `Citation`, `TextSpan`, `Severity`.

## Adding a matcher (e.g. a free local semantic one)

Subclass `Matcher`, implement `match(spans, rules) -> list[Flag]`, set `name`,
then `analyze(..., matcher=YourMatcher())` and compare against the deterministic
baseline on the same leases. **Never**call a paid API, and**never** let the
matcher decide what the law is — it only decides whether a curated rule's text
is present.

## Run (from the repo root)

```bash
uv sync --group dev
uv run pytest
```

`uv sync`creates`.venv`and installs from`uv.lock`. Add `--group tooling` if you
need the review-packet generator in `scripts/`. Scanned-PDF OCR needs the
`tesseract` binary on PATH; it isn't a Python package, so install it yourself
(`brew install tesseract`).

Change a dependency in `pyproject.toml`and you must re-run`uv lock`. CI syncs
with `--frozen`, so a stale lockfile fails the build.
