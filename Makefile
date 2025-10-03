.PHONY: help install test lint format clean

help: ## 도움말 표시
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Python 의존성 설치
	uv sync

test: ## 테스트 실행
	uv run pytest

test-cov: ## 커버리지와 함께 테스트 실행
	uv run pytest --cov --cov-report=html --cov-report=term

lint: ## 린트 검사
	uv run ruff check .
	uv run mypy .

format: ## 코드 포맷팅
	uv run black .
	uv run isort .
	uv run ruff check --fix .

format-check: ## 포맷 확인 (변경하지 않음)
	uv run black --check .
	uv run isort --check-only .

clean: ## 빌드 파일 및 캐시 정리
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name "*.egg-info" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".mypy_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name "htmlcov" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name ".coverage" -delete 2>/dev/null || true
	find . -type f -name "*.pyc" -delete 2>/dev/null || true
	find . -type d -name "dist" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name "build" -exec rm -rf {} + 2>/dev/null || true

# pnpm 관련 명령어
pnpm-install: ## pnpm 의존성 설치
	pnpm install

pnpm-dev: ## pnpm 개발 서버 실행
	pnpm dev

pnpm-build: ## pnpm 빌드
	pnpm build

pnpm-test: ## pnpm 테스트
	pnpm test

pnpm-lint: ## pnpm 린트
	pnpm lint

# 전체 프로젝트
install-all: install pnpm-install ## 모든 의존성 설치 (Python + pnpm)

test-all: test pnpm-test ## 모든 테스트 실행 (Python + pnpm)

lint-all: lint pnpm-lint ## 모든 린트 실행 (Python + pnpm)

