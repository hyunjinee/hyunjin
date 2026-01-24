# CLAUDE.md

이 파일은 Claude가 이 프로젝트를 작업할 때 참고하는 컨텍스트 문서입니다.

## 프로젝트 개요

**hyunjin** - pnpm workspace 기반의 모노레포 프로젝트입니다. 개인 학습, 블로그, 실험적인 패키지 개발 등 다양한 목적으로 사용됩니다.

## 프로젝트 구조

```
hyunjin/
├── packages/          # 공유 라이브러리 및 재사용 가능한 패키지
├── services/          # 독립적인 서비스 애플리케이션
├── internal/          # 내부 설정 (eslint-config, typescript-config)
├── examples/          # 예제 코드
├── opencode/          # opencode 관련 코드
└── temp/              # 임시 파일
```

## 기술 스택

| 분류 | 기술 |
|------|------|
| 패키지 매니저 | **pnpm** (npm, yarn 사용 금지) |
| 프론트엔드 | React, Next.js, TypeScript |
| 백엔드 | NestJS, Node.js |
| 스타일링 | TailwindCSS, SCSS |
| 빌드 도구 | Babel, tsup, Rollup |
| 테스트 | Jest, Testing Library |
| 린터/포맷터 | Biome, ESLint |
| 버전 관리 | Changesets |

## 필수 환경

- Node.js >= 20.11.0
- pnpm >= 8.14.1 (현재 packageManager: pnpm@10.27.0)

## 주요 명령어

```bash
# 개발 서버 실행 (모든 워크스페이스)
pnpm dev

# 특정 워크스페이스 명령 실행
pnpm -F <package-name> <command>
pnpm -F @hyunjin/blog dev

# 빌드
pnpm build

# 테스트 실행
sudo pnpm test

# 린트
pnpm lint

# 코드 포맷팅
pnpm format

# Biome 체크 및 수정
pnpm check

# Changeset 생성
pnpm changeset

# 릴리즈
pnpm release
```

## 주요 워크스페이스

### packages/
- **babel-plugin-react-compiler**: React Compiler 관련 Babel 플러그인 (tsup 빌드)
- **query-core**: 쿼리 관련 핵심 로직

### services/
- **blog**: Next.js 기반 블로그 (MDX, Contentlayer 사용)
- **api**: NestJS 기반 API 서버
- **learn**: 학습 자료 및 문서
- **react-compiler-playground**: React Compiler 실험용
- **deepseek**: DeepSeek 관련 서비스

### opencode/
- opencode 프로젝트 (bun 사용)
- 테스트: `bun dev` (packages/opencode 디렉토리에서)

## 코딩 컨벤션

### 파일 네이밍
- 컴포넌트: `PascalCase.tsx` (예: `Button.tsx`)
- 유틸리티/헬퍼: `camelCase.ts` (예: `formatDate.ts`)
- 상수: `UPPER_SNAKE_CASE`
- 테스트: `*.test.ts`, `*.test.tsx`

### 코드 스타일
- TypeScript 우선 사용
- 함수형 컴포넌트 + React Hooks
- async/await 패턴 사용
- 프로덕션 코드에 console.log 금지

### 환경변수
- `.env.local` 파일 사용 (`.env`는 git에 포함하지 않음)

## 중요 사항

1. **절대 npm이나 yarn을 사용하지 마세요** - pnpm만 사용
2. **git에 커밋하지 않을 것**: node_modules, .env, build 결과물
3. **테스트 실행 시**: `sudo pnpm test` 사용
4. **한국어로 응답**: 모든 응답은 한국어로 작성

## 관련 문서

- [Changesets 가이드](./CHANGESETS.md)
- [프로젝트 규칙](./.cursor/rules/project-rule.mdc)
