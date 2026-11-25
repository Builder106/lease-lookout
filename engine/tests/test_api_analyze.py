"""Unit tests for the Vercel serverless handler in api/analyze.py."""
import io
import json
import os
from pathlib import Path
from unittest.mock import patch

from api.analyze import MAX_BYTES, _resolve_jurisdiction, handler

FIXTURE_PDF = Path(__file__).parent / "fixtures" / "sample-ct-lease.pdf"


class MockRequest:
    def __init__(self, path: str, headers: dict[str, str], body: bytes):
        self.path = path
        self.headers = headers
        self.rfile = io.BytesIO(body)
        self.wfile = io.BytesIO()

    def send_response(self, code: int) -> None:
        self.wfile.write(f"HTTP/1.1 {code}\r\n".encode())

    def send_header(self, keyword: str, value: str) -> None:
        self.wfile.write(f"{keyword}: {value}\r\n".encode())

    def end_headers(self) -> None:
        self.wfile.write(b"\r\n")

    def execute_post(self) -> tuple[int, dict, dict]:
        # Invoke the handler method by binding mock attributes
        h = handler.__new__(handler)
        h.path = self.path
        h.headers = self.headers
        h.rfile = self.rfile
        h.wfile = self.wfile
        h.send_response = self.send_response
        h.send_header = self.send_header
        h.end_headers = self.end_headers

        h.do_POST()

        raw_output = self.wfile.getvalue()
        header_part, _, body_part = raw_output.partition(b"\r\n\r\n")
        lines = header_part.decode("utf-8").split("\r\n")
        status_code = int(lines[0].split()[1])
        headers = {}
        for line in lines[1:]:
            if ": " in line:
                k, v = line.split(": ", 1)
                headers[k.lower()] = v
        body = json.loads(body_part.decode("utf-8")) if body_part else {}
        return status_code, headers, body


def test_resolve_jurisdiction_explicit_valid() -> None:
    assert _resolve_jurisdiction("/api/analyze?jurisdiction=ct") == "ct"
    assert _resolve_jurisdiction("/api/analyze?jurisdiction=CT") == "ct"
    assert _resolve_jurisdiction("/api/analyze?jurisdiction=ny") == "ny"


def test_resolve_jurisdiction_auto() -> None:
    assert _resolve_jurisdiction("/api/analyze?jurisdiction=auto") == "auto"


def test_resolve_jurisdiction_fallback_default() -> None:
    with patch.dict(os.environ, {}, clear=True):
        assert _resolve_jurisdiction("/api/analyze") == "auto"
        assert _resolve_jurisdiction("/api/analyze?jurisdiction=unknown_state") == "auto"


def test_resolve_jurisdiction_fallback_env() -> None:
    with patch.dict(os.environ, {"LEASELOOKOUT_JURISDICTION": "me"}):
        assert _resolve_jurisdiction("/api/analyze") == "me"
        assert _resolve_jurisdiction("/api/analyze?jurisdiction=unknown_xyz") == "me"


def test_post_empty_upload_no_content_length() -> None:
    req = MockRequest("/api/analyze", {}, b"")
    status, headers, body = req.execute_post()
    assert status == 400
    assert body["ok"] is False
    assert body["error"] == "Empty upload."


def test_post_empty_upload_zero_length() -> None:
    req = MockRequest("/api/analyze", {"content-length": "0"}, b"")
    status, headers, body = req.execute_post()
    assert status == 400
    assert body["ok"] is False
    assert body["error"] == "Empty upload."


def test_post_payload_over_limit() -> None:
    req = MockRequest("/api/analyze", {"content-length": str(MAX_BYTES + 1)}, b"")
    status, headers, body = req.execute_post()
    assert status == 413
    assert body["ok"] is False
    assert "20 MB limit" in body["error"]


def test_post_valid_pdf() -> None:
    pdf_bytes = FIXTURE_PDF.read_bytes()
    req = MockRequest(
        "/api/analyze?jurisdiction=ct",
        {"content-length": str(len(pdf_bytes))},
        pdf_bytes,
    )
    status, headers, body = req.execute_post()
    assert status == 200
    assert headers["content-type"] == "application/json; charset=utf-8"
    assert body["ok"] is True
    assert body["jurisdiction"] == "ct"
    assert len(body["flags"]) > 0


def test_post_analysis_exception() -> None:
    bad_pdf_bytes = b"Not a valid PDF document at all"
    req = MockRequest(
        "/api/analyze?jurisdiction=ct",
        {"content-length": str(len(bad_pdf_bytes))},
        bad_pdf_bytes,
    )
    status, headers, body = req.execute_post()
    assert status == 500
    assert body["ok"] is False
    assert "Analysis failed" in body["error"]
