.PHONY: help install test lint format clean build publish dev-install

help:	## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install:	## Install dependencies
	uv sync

install-dev:	## Install development dependencies
	uv sync --dev

install-prod:	## Install production dependencies only
	uv sync --no-dev

test:	## Run tests
	uv run pytest

test-verbose:	## Run tests with verbose output
	uv run pytest -v

test-cov:	## Run tests with coverage
	uv run pytest --cov=resume_extract --cov-report=html --cov-report=term

lint:	## Run linting
	uv run flake8 src/resume_extract tests
	uv run mypy src/resume_extract

format:	## Format code
	uv run black src/resume_extract tests examples
	uv run isort src/resume_extract tests examples

format-check:	## Check formatting
	uv run black --check src/resume_extract tests examples
	uv run isort --check-only src/resume_extract tests examples

clean:	## Clean build artifacts
	rm -rf build/
	rm -rf dist/
	rm -rf *.egg-info/
	find . -type d -name __pycache__ -delete
	find . -type f -name "*.pyc" -delete

build:	## Build package
	uv build

publish:	## Publish to PyPI
	uv run twine upload dist/*

dev-setup:	## Set up development environment
	uv sync --dev
	uv run pre-commit install

example:	## Run example
	cd examples && uv run python basic_usage.py

lock:	## Update lockfile
	uv lock

sync:	## Sync dependencies from lockfile
	uv sync

add:	## Add a dependency (use: make add PACKAGE=package-name)
	uv add $(PACKAGE)

add-dev:	## Add a dev dependency (use: make add-dev PACKAGE=package-name)
	uv add --dev $(PACKAGE)

shell:	## Activate virtual environment shell
	uv shell

run:	## Run a command in the project environment (use: make run CMD="your command")
	uv run $(CMD)