# Hyunjin's Monorepo

TypeScript와 Python을 함께 사용하는 monorepo 프로젝트입니다.

## 프로젝트 구조

```
hyunjin/
├── packages/          # 공유 라이브러리 및 패키지
│   ├── babel-plugin-*  # Babel 플러그인들
│   ├── query-core      # 쿼리 관련 핵심 로직
│   ├── resume_extract  # Python: 이력서 정보 추출 라이브러리
│   └── ...
├── services/          # 독립적인 서비스 애플리케이션
│   ├── blog           # Next.js 블로그
│   ├── api            # NestJS API 서버
│   └── ...
└── internal/          # 내부 설정 파일
    ├── eslint-config
    └── typescript-config
```

## 기술 스택

### TypeScript/JavaScript

- **패키지 매니저**: pnpm
- **프론트엔드**: React, Next.js
- **백엔드**: NestJS, Node.js
- **스타일링**: TailwindCSS, SCSS
- **빌드 도구**: Babel, tsup, Rollup
- **테스트**: Jest, Testing Library

### Python

- **패키지 매니저**: uv
- **Python 버전**: >= 3.10
- **테스트**: pytest
- **코드 품질**: black, isort, ruff, mypy

## 설치

### Prerequisites

- Node.js >= 20.11.0
- pnpm >= 8.14.1
- Python >= 3.10
- uv (Python package manager)

### 설치 방법

```bash
# Python 의존성 설치
uv sync

# pnpm 의존성 설치
pnpm install

# 또는 모든 의존성 한번에 설치
make install-all
```

## 사용법

### TypeScript 프로젝트

```bash
# 개발 서버 실행
pnpm dev

# 특정 워크스페이스 명령 실행
pnpm -F @hyunjin/blog dev

# 빌드
pnpm build

# 테스트
pnpm test

# 린트
pnpm lint
```

### Python 프로젝트

```bash
# 테스트 실행
uv run pytest
# 또는
make test

# 커버리지와 함께 테스트
make test-cov

# 코드 포맷팅
make format

# 린트 검사
make lint

# 캐시 정리
make clean
```

### 통합 명령어

```bash
# 모든 테스트 실행 (Python + TypeScript)
make test-all

# 모든 린트 실행
make lint-all

# 도움말 보기
make help
```

## Python 워크스페이스

이 monorepo는 uv 워크스페이스를 사용하여 Python 패키지들을 관리합니다.

### Python 패키지 추가하기

1. `packages/` 디렉토리에 새 패키지 생성
2. `pyproject.toml`에 워크스페이스 멤버로 추가:

```toml
[tool.uv.workspace]
members = ["packages/resume_extract", "packages/your-new-package"]
```

## 개발 규칙

### 코드 스타일

#### TypeScript

- 함수형 컴포넌트와 React Hooks 사용
- 모든 비동기 처리는 async/await 패턴
- ESLint, Prettier 설정 준수

#### Python

- Black 포맷터 사용 (line-length: 88)
- Type hints 작성
- docstring 작성 (Google style)

### 파일 명명 규칙

#### TypeScript

- 컴포넌트: PascalCase (예: `Button.tsx`)
- 유틸리티/헬퍼: camelCase (예: `formatDate.ts`)
- 상수: UPPER_SNAKE_CASE
- 테스트 파일: `*.test.ts`, `*.test.tsx`

#### Python

- 모듈/패키지: snake_case
- 클래스: PascalCase
- 함수/변수: snake_case
- 상수: UPPER_SNAKE_CASE
- 테스트 파일: `test_*.py`

### Git 커밋 규칙

- 의미있는 커밋 메시지 작성
- 기능별로 작은 단위로 커밋
- 각 패키지/서비스별로 독립적인 변경사항 관리

## 주요 패키지

### TypeScript

- **babel-plugin-react-compiler**: React Compiler Babel 플러그인
- **query-core**: 쿼리 관련 핵심 로직
- **http-client**: HTTP 클라이언트 라이브러리

### Python

- **resume_extract**: 이력서 정보 추출 라이브러리
