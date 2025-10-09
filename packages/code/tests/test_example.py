"""Example test file."""

import pytest


def test_example() -> None:
    """Example test case."""
    assert True


def test_version() -> None:
    """Test version is accessible."""
    from code import __version__
    
    assert __version__ == "0.0.1"

