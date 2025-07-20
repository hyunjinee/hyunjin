# Hyunjin Monorepo

이 프로젝트는 pnpm workspace를 사용하는 모노레포입니다. 다양한 패키지와 서비스를 포함하고 있습니다.

## 📦 패키지

### 공개 패키지 (packages/)

- **@hyunjin/http-client**: Axios 기반 HTTP 클라이언트
- **@hyunjin/babel-plugin-react-compiler**: React Compiler Babel 플러그인
- **@hyunjin/query-core**: 쿼리 관련 핵심 로직
- **@hyunjin/react-compiler-runtime**: React Compiler 런타임
- **@hyunjin/ui**: 공통 UI 컴포넌트

### 내부 패키지 (internal/)

- **@hyunjin/eslint-config**: ESLint 설정
- **@hyunjin/typescript-config**: TypeScript 설정

### 서비스 (services/)

- **@hyunjin/blog**: Next.js 기반 블로그
- **api**: NestJS 기반 API 서버
- **logging-service**: 로깅 서비스
- **uber-service**: Uber 서비스 예제

## 🚀 시작하기

### 설치

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 특정 패키지 개발
pnpm -F @hyunjin/http-client dev
```

### 빌드

```bash
# 모든 패키지 빌드
pnpm build

# 특정 패키지 빌드
pnpm -F @hyunjin/http-client build
```

### 테스트

```bash
# 모든 패키지 테스트
pnpm test

# 특정 패키지 테스트
pnpm -F @hyunjin/http-client test
```

## 📋 버전 관리 및 릴리즈

이 프로젝트는 [Changesets](https://github.com/changesets/changesets)를 사용하여 버전 관리와 릴리즈를 자동화합니다.

### 변경사항 추가

```bash
pnpm changeset
```

### 버전 업데이트

```bash
pnpm changeset version
```

### 릴리즈

```bash
pnpm release
```

자세한 사용법은 [CHANGESETS.md](./CHANGESETS.md)를 참조하세요.

## 🔧 개발 환경

- **Node.js**: >= 20.11.0
- **pnpm**: >= 8.14.1
- **TypeScript**: >= 5.0.0

## 📚 문서

- [Changesets 사용법](./CHANGESETS.md)
- [프로젝트 규칙](./docs/PROJECT_RULES.md)

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 라이선스

MIT License
