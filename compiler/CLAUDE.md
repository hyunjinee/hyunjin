# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 언어 규칙

**모든 응답은 한국어로 작성합니다.**

## 프로젝트 개요

Meta의 React Compiler를 학습·연구 목적으로 포크하여 재구현하는 프로젝트. Babel 플러그인 기반으로 React 컴포넌트/Hook을 자동 메모이제이션하는 컴파일러, 런타임, 그리고 브라우저 기반 Playground로 구성됩니다.

## 필수 명령어

```bash
# 패키지 매니저: pnpm만 사용 (npm, yarn 절대 금지)
pnpm install

# babel-plugin-react-compiler
pnpm -F @hyunjin/babel-plugin-react-compiler build    # tsup 빌드 (CJS, dist/)
pnpm -F @hyunjin/babel-plugin-react-compiler jest      # Jest 테스트 (빌드 후 ts-jest)
pnpm -F @hyunjin/babel-plugin-react-compiler lint      # ESLint

# react-compiler-runtime
pnpm -F react-compiler-runtime build                   # tsup 빌드

# react-compiler-playground
pnpm -F react-compiler-playground dev                  # Next.js dev (--webpack 플래그 필수)
pnpm -F react-compiler-playground build                # Next.js 빌드
pnpm -F react-compiler-playground test                 # Playwright E2E (workers=4)
```

## 아키텍처

### 3개 패키지 구성

```
compiler/
├── babel-plugin-react-compiler/  # 핵심: Babel 플러그인 (Meta 기반 재구현)
├── react-compiler-runtime/       # 런타임: React < 19에서 useMemoCache 폴리필
└── react-compiler-playground/    # Playground: Next.js 16 + Monaco Editor
```

### babel-plugin-react-compiler 컴파일 파이프라인

```
소스 코드 → Babel AST → (lowering) → HIR → (analysis) → Reactive Scopes → (codegen) → 최적화된 AST
```

핵심 모듈 구조:
- **진입점**: `src/index.ts` → `Babel/RunReactCompilerBabelPlugin.ts` → `EntryPoint/Program.ts`
- **Babel 통합**: `Babel/BabelPlugin` — Program visitor의 enter에서 `compileProgram()` 호출
- **프로그램 컴파일**: `EntryPoint/Program.ts` — 파일 내 함수를 탐색하고 컴파일 대상 선별 (compilationMode: annotation/infer/syntax/all)
- **파이프라인**: `EntryPoint/Pipeline.ts` — 개별 함수를 HIR로 변환, 분석, 코드 생성
- **HIR**: `HIR/HIR.ts` — 핵심 중간 표현 타입 (ReactiveFunction, Place, Instruction 등)
- **환경**: `HIR/Environment.ts` — Hook 설정, EnvironmentConfig (Zod 스키마)
- **옵션**: `EntryPoint/Options.ts` — PluginOptions, Logger, CompilerReactTarget (17/18/19)
- **에러**: `CompileError.ts` — ErrorSeverity 레벨 (InvalidJS, Todo, Invariant 등)
- **지시어**: `use forget`/`use memo` (opt-in), `use no forget`/`use no memo` (opt-out)

### react-compiler-runtime

`React.__COMPILER_RUNTIME?.c`가 있으면 사용하고, 없으면 `useMemo` 기반 폴리필로 메모 캐시(`$empty` sentinel) 제공. React 17/18용.

### react-compiler-playground

- Next.js 16 + Webpack (Monaco Editor 플러그인 때문에 `--webpack` 필수)
- `StoreContext` — useReducer 기반 전역 상태 (source 코드 관리, lz-string 압축으로 URL 공유)
- `EditorImpl` — Monaco Editor로 코드 입력, `babel-plugin-react-compiler`를 브라우저에서 실행하여 결과 표시
- `next.config.js`에서 `react-compiler-runtime`을 로컬 경로로 alias 설정

### 빌드

- **tsup** — babel-plugin, runtime 패키지 (CJS 출력, es2015 타겟)
- babel-plugin은 `@babel/types`를 external, runtime은 `react`를 external로 설정

### 테스트

- **Jest** (ts-jest) — babel-plugin 단위 테스트 (`src/__tests__/`)
- **Playwright** — playground E2E 테스트
- 스냅샷 테스트: fixture 파일 (`src/__tests__/fixtures/compiler/`) → `.expect.md` 생성

### 참고 문서 (저장소 내)

- `compiler-quick-start.md` — 테스트 작성·실행, 코드 읽기 순서, 새 최적화 추가 가이드
- `src/Babel/BabelPlugin.md` — Babel 플러그인 동작 흐름 상세 설명
- `src/EntryPoint/Program.md` — compileProgram 전체 흐름, compilationMode별 동작
