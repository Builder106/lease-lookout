"""Unit tests for the command-line interface in engine/cli.py."""
import io
import json
import runpy
import sys
from pathlib import Path
from unittest.mock import patch

import pytest

from engine.cli import main

FIXTURE_PDF = Path(__file__).parent / "fixtures" / "sample-ct-lease.pdf"


def test_cli_success_default_jurisdiction() -> None:
    captured = io.StringIO()
    with patch("sys.stdout", captured):
        code = main([str(FIXTURE_PDF)])
    assert code == 0
    data = json.loads(captured.getvalue())
    assert data["ok"] is True
    assert data["jurisdiction"] == "ct"
    assert len(data["flags"]) > 0


def test_cli_success_explicit_jurisdiction() -> None:
    captured = io.StringIO()
    with patch("sys.stdout", captured):
        code = main([str(FIXTURE_PDF), "--jurisdiction", "ct"])
    assert code == 0
    data = json.loads(captured.getvalue())
    assert data["ok"] is True
    assert data["jurisdiction"] == "ct"


def test_cli_error_nonexistent_file() -> None:
    captured = io.StringIO()
    with patch("sys.stdout", captured):
        code = main(["/nonexistent/lease.pdf"])
    assert code == 2
    data = json.loads(captured.getvalue())
    assert data["ok"] is False
    assert "error" in data


def test_cli_main_module_execution() -> None:
    sys.modules.pop("engine.cli", None)
    with patch.object(sys, "argv", ["engine.cli", str(FIXTURE_PDF)]):
        with pytest.raises(SystemExit) as exc_info:
            runpy.run_module("engine.cli", run_name="__main__")
        assert exc_info.value.code == 0
