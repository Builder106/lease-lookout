"""PDF -> text. Lease PDFs are often ugly (digital, scanned, or photographed)."""
from __future__ import annotations

import shutil
import subprocess
from pathlib import Path

from .types import TextSpan

# Below this many non-whitespace characters, a digital extraction is treated as
# "empty" (likely a scanned/image-only PDF) and we fall back to OCR.
MIN_DIGITAL_CHARS = 50


class OCRUnavailable(RuntimeError):
    """Raised when OCR is needed but PyMuPDF or the `tesseract` binary is missing."""


def extract_text(pdf_path: str | Path) -> list[TextSpan]:
    """Digital text per page via pdfplumber (lazy import keeps this module cheap)."""
    import pdfplumber

    spans: list[TextSpan] = []
    with pdfplumber.open(str(pdf_path)) as pdf:
        for i, page in enumerate(pdf.pages):
            text = page.extract_text() or ""
            spans.append(TextSpan(page=i + 1, start=0, end=len(text), text=text))
    return spans


def extract_text_ocr(pdf_path: str | Path, dpi: int = 200) -> list[TextSpan]:
    """OCR each page, for scanned/image-only PDFs.

    Renders pages with PyMuPDF (no system poppler needed) and pipes each page's
    PNG to the `tesseract` CLI over stdin — no temp files, which sidesteps a
    file-access issue with the spawned binary and avoids pytesseract's fragile
    stderr decoding. Raises OCRUnavailable if PyMuPDF or tesseract isn't present,
    so callers can degrade gracefully.
    """
    try:
        import pymupdf
    except ImportError as e:  # pragma: no cover
        raise OCRUnavailable(f"PyMuPDF missing: {e}") from e

    tesseract = shutil.which("tesseract")
    if not tesseract:
        raise OCRUnavailable("tesseract binary not found on PATH")

    try:
        doc = pymupdf.open(str(pdf_path))
    except Exception as e:  # noqa: BLE001
        raise OCRUnavailable(f"could not open PDF for OCR: {e}") from e

    spans: list[TextSpan] = []
    try:
        matrix = pymupdf.Matrix(dpi / 72.0, dpi / 72.0)
        for i, page in enumerate(doc):
            png = page.get_pixmap(matrix=matrix).tobytes("png")
            proc = subprocess.run(
                [tesseract, "stdin", "stdout", "-l", "eng"],
                input=png,
                capture_output=True,
                timeout=180,
            )
            text = proc.stdout.decode("utf-8", "ignore") if proc.returncode == 0 else ""
            spans.append(TextSpan(page=i + 1, start=0, end=len(text), text=text))
    finally:
        doc.close()
    return spans


def extract_best(pdf_path: str | Path) -> tuple[list[TextSpan], str]:
    """Digital extraction, falling back to OCR when the PDF yields almost no text.

    Returns (spans, method) where method is "digital", "ocr", or "none"
    (none = still unreadable, e.g. a scanned PDF with OCR unavailable).
    """
    spans = extract_text(pdf_path)
    if len(full_text(spans).strip()) >= MIN_DIGITAL_CHARS:
        return spans, "digital"
    try:
        ocr_spans = extract_text_ocr(pdf_path)
    except OCRUnavailable:
        return spans, "none"
    if len(full_text(ocr_spans).strip()) >= MIN_DIGITAL_CHARS:
        return ocr_spans, "ocr"
    return (ocr_spans or spans), "none"


def full_text(spans: list[TextSpan]) -> str:
    """Join page spans back into one string (handy for whole-document matching)."""
    return "\n\n".join(s.text for s in spans)
