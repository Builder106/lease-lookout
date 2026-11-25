"""Vercel Python function: POST a lease PDF (raw bytes) -> JSON report.

This is the production engine boundary at /api/analyze. A Node serverless
function can't spawn Python, so the engine runs here. Local dev uses `vercel dev`.

OCR needs the `tesseract` binary, which Vercel's Python runtime doesn't include —
scanned PDFs degrade to "couldn't read this PDF" in prod; digital PDFs work.
"""
import json
import os
import sys
import tempfile
from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse

# Make the project root importable so `engine` resolves inside the function bundle.
_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _ROOT not in sys.path:
    sys.path.insert(0, _ROOT)

from engine.report import build_report  # noqa: E402
from engine.rules import available_jurisdictions  # noqa: E402

MAX_BYTES = 20 * 1024 * 1024


def _resolve_jurisdiction(path: str) -> str:
    """Pick the jurisdiction from ?jurisdiction=, the env default, or auto-detect.

    A client-supplied code is honored only if we actually have that ruleset; anything
    else (unknown code, "auto", or absent) falls through to auto-detection in the engine,
    which routes by the lease text. Never trust an arbitrary folder name from the query.
    """
    requested = (parse_qs(urlparse(path).query).get("jurisdiction") or [""])[0].strip().lower()
    if requested and requested != "auto" and requested in available_jurisdictions():
        return requested
    if requested == "auto":
        return "auto"
    return os.environ.get("LEASELOOKOUT_JURISDICTION", "auto")


class handler(BaseHTTPRequestHandler):
    def do_POST(self):  # noqa: N802 (Vercel/BaseHTTPRequestHandler contract)
        try:
            length = int(self.headers.get("content-length") or 0)
            if length <= 0:
                return self._send(400, {"ok": False, "error": "Empty upload."})
            if length > MAX_BYTES:
                return self._send(413, {"ok": False, "error": "That file is over the 20 MB limit."})
            body = self.rfile.read(length)
            jurisdiction = _resolve_jurisdiction(self.path)
            tmp = tempfile.NamedTemporaryFile(suffix=".pdf", delete=False)
            try:
                tmp.write(body)
                tmp.close()
                report = build_report(tmp.name, jurisdiction)
            finally:
                os.unlink(tmp.name)
            self._send(200, report)
        except Exception as e:  # noqa: BLE001
            self._send(500, {"ok": False, "error": f"Analysis failed: {type(e).__name__}: {e}"})

    def _send(self, status: int, obj: dict) -> None:
        payload = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)
