"""Command-line entry point for the parser engine.

Usage:  python -m engine.cli <lease.pdf> [--jurisdiction ct]

Prints the JSON report to stdout. Shares engine.report.build_report with the
Vercel Python function (api/analyze.py) so local and prod return the same shape.
"""
from __future__ import annotations

import argparse
import json
import sys

from .report import build_report


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="engine.cli", description="Analyze a lease PDF.")
    parser.add_argument("pdf", help="path to the lease PDF")
    parser.add_argument("--jurisdiction", default="ct")
    args = parser.parse_args(argv)

    try:
        report = build_report(args.pdf, args.jurisdiction)
    except Exception as e:  # noqa: BLE001 — return a clean JSON error to the caller
        json.dump({"ok": False, "error": f"{type(e).__name__}: {e}"}, sys.stdout)
        return 2

    json.dump(report, sys.stdout, ensure_ascii=False)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
