# Code

코드 유틸리티 패키지

## 설치

```bash
# 프로젝트 의존성 설치
uv sync

# 개발 의존성 포함 설치
uv sync --dev
```

## 개발

```bash
# 테스트 실행
uv run pytest

# 코드 포맷팅
uv run black code tests

# 타입 체크
uv run mypy code

# 린팅
uv run ruff check code
```

## 사용법

```python
from code import example

# 예제 코드
```

## 라이선스

MIT
