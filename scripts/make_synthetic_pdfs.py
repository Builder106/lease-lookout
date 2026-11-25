"""Generate PDF versions of the synthetic lease fixtures (for manual / upload testing).

Reads tests/fixtures/synthetic/*.txt and writes matching *.pdf using PyMuPDF.
The .txt files are the committed source of truth; the PDFs are generated and
gitignored. Run from the repo root:

    python scripts/make_synthetic_pdfs.py
"""
from __future__ import annotations

import textwrap
from pathlib import Path

import fitz  # PyMuPDF

SYN = Path(__file__).resolve().parent.parent / "tests" / "fixtures" / "synthetic"


def text_to_pdf(text: str, out_path: Path) -> None:
    doc = fitz.open()
    page = doc.new_page()
    x, top, bottom, leading = 54, 64, 54, 14
    y = top
    for para in text.split("\n"):
        for line in (textwrap.wrap(para, width=95) or [""]):
            if y > page.rect.height - bottom:
                page = doc.new_page()
                y = top
            page.insert_text((x, y), line, fontsize=10, fontname="helv")
            y += leading
    doc.save(out_path)
    doc.close()


def main() -> None:
    for txt in sorted(SYN.glob("*.txt")):
        pdf = txt.with_suffix(".pdf")
        text_to_pdf(txt.read_text(encoding="utf-8"), pdf)
        print(f"wrote {pdf.relative_to(SYN.parent.parent.parent)}")


if __name__ == "__main__":
    main()
