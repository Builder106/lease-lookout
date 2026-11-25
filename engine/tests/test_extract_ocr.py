"""Unit tests for OCR extraction and fallbacks in engine/extract.py."""
import subprocess
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest

from engine.extract import (
    OCRUnavailable,
    extract_best,
    extract_text,
    extract_text_ocr,
    full_text,
)
from engine.types import TextSpan

FIXTURE_PDF = Path(__file__).parent / "fixtures" / "sample-ct-lease.pdf"


def test_full_text_joins_with_double_newline() -> None:
    spans = [
        TextSpan(page=1, start=0, end=5, text="Hello"),
        TextSpan(page=2, start=0, end=5, text="World"),
    ]
    assert full_text(spans) == "Hello\n\nWorld"


def test_extract_text_handles_none_page_text() -> None:
    mock_page = MagicMock()
    mock_page.extract_text.return_value = None
    mock_pdf = MagicMock()
    mock_pdf.pages = [mock_page]
    mock_pdf.__enter__.return_value = mock_pdf

    with patch("pdfplumber.open", return_value=mock_pdf):
        spans = extract_text("dummy.pdf")
        assert len(spans) == 1
        assert spans[0].text == ""


def test_extract_text_ocr_tesseract_missing() -> None:
    with patch("shutil.which", return_value=None):
        with pytest.raises(OCRUnavailable, match="tesseract binary not found on PATH"):
            extract_text_ocr(FIXTURE_PDF)


def test_extract_text_ocr_pymupdf_open_fails() -> None:
    with patch("shutil.which", return_value="/usr/bin/tesseract"):
        with patch("pymupdf.open", side_effect=RuntimeError("Corrupt PDF")):
            with pytest.raises(OCRUnavailable, match="could not open PDF for OCR: Corrupt PDF"):
                extract_text_ocr("corrupt.pdf")


def test_extract_text_ocr_success() -> None:
    mock_doc = MagicMock()
    mock_page = MagicMock()
    mock_pixmap = MagicMock()
    mock_pixmap.tobytes.return_value = b"fake-png-bytes"
    mock_page.get_pixmap.return_value = mock_pixmap
    mock_doc.__iter__.return_value = [mock_page]

    with patch("shutil.which", return_value="/usr/bin/tesseract"):
        with patch("pymupdf.open", return_value=mock_doc):
            with patch(
                "subprocess.run",
                return_value=subprocess.CompletedProcess(
                    args=[], returncode=0, stdout=b"Scanned lease page text\n"
                ),
            ):
                spans = extract_text_ocr("mock.pdf", dpi=150)
                assert len(spans) == 1
                assert spans[0].page == 1
                assert spans[0].text == "Scanned lease page text\n"
                mock_doc.close.assert_called_once()


def test_extract_text_ocr_subprocess_failure() -> None:
    mock_doc = MagicMock()
    mock_page = MagicMock()
    mock_pixmap = MagicMock()
    mock_pixmap.tobytes.return_value = b"fake-png-bytes"
    mock_page.get_pixmap.return_value = mock_pixmap
    mock_doc.__iter__.return_value = [mock_page]

    with patch("shutil.which", return_value="/usr/bin/tesseract"):
        with patch("pymupdf.open", return_value=mock_doc):
            with patch(
                "subprocess.run",
                return_value=subprocess.CompletedProcess(
                    args=[], returncode=1, stdout=b""
                ),
            ):
                spans = extract_text_ocr("mock.pdf")
                assert len(spans) == 1
                assert spans[0].text == ""
                mock_doc.close.assert_called_once()


def test_extract_best_digital() -> None:
    spans, method = extract_best(FIXTURE_PDF)
    assert method == "digital"
    assert len(spans) > 0


def test_extract_best_fallback_ocr_unavailable() -> None:
    short_span = [TextSpan(page=1, start=0, end=10, text="Too short")]
    with patch("engine.extract.extract_text", return_value=short_span):
        with patch("engine.extract.extract_text_ocr", side_effect=OCRUnavailable("no tesseract")):
            spans, method = extract_best("dummy.pdf")
            assert method == "none"
            assert spans == short_span


def test_extract_best_fallback_ocr_success() -> None:
    short_span = [TextSpan(page=1, start=0, end=10, text="Too short")]
    long_ocr_text = "This is a full page of text extracted via OCR that exceeds fifty characters easily."
    ocr_spans = [TextSpan(page=1, start=0, end=len(long_ocr_text), text=long_ocr_text)]

    with patch("engine.extract.extract_text", return_value=short_span):
        with patch("engine.extract.extract_text_ocr", return_value=ocr_spans):
            spans, method = extract_best("dummy.pdf")
            assert method == "ocr"
            assert spans == ocr_spans


def test_extract_best_fallback_ocr_insufficient_text() -> None:
    short_span = [TextSpan(page=1, start=0, end=10, text="Too short")]
    short_ocr_span = [TextSpan(page=1, start=0, end=5, text="Tiny")]

    with patch("engine.extract.extract_text", return_value=short_span):
        with patch("engine.extract.extract_text_ocr", return_value=short_ocr_span):
            spans, method = extract_best("dummy.pdf")
            assert method == "none"
            assert spans == short_ocr_span
