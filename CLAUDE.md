# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 언어 규칙

**모든 응답은 한국어로 작성합니다.**

## 프로젝트 개요

pnpm workspace 기반 모노레포. 개인 블로그, 학습, 실험적 패키지 개발 용도. TypeScript/JavaScript와 Python을 모두 포함합니다.

## 필수 명령어

```bash
# 패키지 매니저: pnpm만 사용 (npm, yarn 절대 금지)
pnpm install

# 개발
pnpm dev                          # 모든 워크스페이스 dev 실행
pnpm -F <package-name> dev        # 특정 워크스페이스 (예: pnpm -F @hyunjin/blog dev)
pnpm blog dev                     # 블로그 서비스 단축 명령

# 빌드 & 테스트
pnpm build                        # 전체 빌드
pnpm -F <package-name> build      # 특정 워크스페이스 빌드
sudo pnpm test                    # 전체 테스트 (sudo 필요)
pnpm -F <package-name> test:run   # 특정 워크스페이스 테스트

# 코드 품질 (Biome가 주 도구)
pnpm check                        # biome check --write .
pnpm format                       # biome format --write .
pnpm lint                         # 모든 워크스페이스 lint

# 버전 관리
pnpm changeset                    # 변경사항 기록
pnpm version                      # 버전 업데이트 + CHANGELOG 생성
pnpm release                      # 빌드 후 배포 (pnpm build && changeset publish)

# Python (uv 사용)
uv sync                           # Python 의존성 설치
uv run pytest                     # Python 테스트
make test-all                     # Python + pnpm 전체 테스트
make lint-all                     # Python + pnpm 전체 린트
```

## 아키텍처

### 워크스페이스 구조

pnpm workspace는 `packages/*`와 `services/*`를 포함합니다 (`pnpm-workspace.yaml`).

- **packages/** - 재사용 가능한 라이브러리 (tsup으로 빌드)
  - `babel-plugin-react-compiler` - React Compiler Babel 플러그인 (Meta 기반, HIR 변환)
  - `http-client` - Axios 기반 HTTP 클라이언트 (재시도, 인터셉터)
  - `query-core` - TanStack Query 스타일 쿼리 코어 (modern + legacy 빌드)
  - `resume_extract` - Python 이력서 추출 라이브러리 (uv, pytest)
- **services/** - 독립 애플리케이션
  - `blog` - Next.js 16 블로그 (Contentlayer2 MDX, React 19, React Compiler, TailwindCSS 4)
  - `api` - Express API 서버 (LangChain, Supabase)
  - `react-compiler-playground` - React Compiler 테스트용 (Monaco Editor, Playwright E2E)
  - `learn` - Docusaurus 기반 학습 문서
- **internal/** - 공유 설정 (`eslint-config`, `typescript-config`)
- **opencode/** - 별도 프로젝트 (Bun 런타임, SST 배포, 메인 pnpm workspace에 포함되지 않음)

### 빌드 도구

- **tsup** - 대부분의 패키지 빌드 도구 (CJS/ESM 출력)
- **Biome** (v2.3.12) - 주 린터/포매터. 설정: 2 spaces, 120 line width, single quotes, 세미콜론 최소화, trailing commas
- **ESLint** - 일부 서비스에서 보조적 사용 (Next.js, Docusaurus)

### 테스트 프레임워크

패키지마다 다른 테스트 프레임워크를 사용:
- **Jest** (ts-jest) - babel-plugin 계열 패키지
- **Vitest** - http-client, query-core
- **Playwright** - react-compiler-playground (E2E)
- **pytest** - Python 패키지 (resume_extract)

### Changesets

baseBranch: `main`, access: `public`. 릴리즈 워크플로우: changeset 생성 → version → release.

## 코딩 컨벤션

- 컴포넌트 파일: `PascalCase.tsx`, 유틸리티: `camelCase.ts`, 상수: `UPPER_SNAKE_CASE`
- TypeScript 우선, 함수형 컴포넌트 + Hooks, async/await
- 프로덕션 코드에 `console.log` 금지
- 환경변수는 `.env.local` 사용

## 필수 환경

- Node.js >= 20.11.0 (.nvmrc: 24.7.0)
- pnpm@10.27.0
- Python >= 3.10 (uv로 관리, Python 패키지 작업 시)
