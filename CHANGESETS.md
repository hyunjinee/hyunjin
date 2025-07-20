# Changesets 사용법

이 프로젝트는 [Changesets](https://github.com/changesets/changesets)를 사용하여 모노레포의 버전 관리와 릴리즈를 자동화합니다.

## 🚀 빠른 시작

### 1. 변경사항 추가

변경사항이 있는 패키지에 대해 changeset을 생성합니다:

```bash
pnpm changeset
```

이 명령어를 실행하면:

1. 변경된 패키지 목록이 표시됩니다
2. 변경사항 유형을 선택합니다 (major/minor/patch)
3. 변경사항 설명을 작성합니다

### 2. 버전 업데이트

changeset을 적용하여 버전을 업데이트합니다:

```bash
pnpm version
```

이 명령어는:

- CHANGELOG.md 파일을 생성/업데이트
- package.json의 버전을 업데이트
- 의존성 버전을 자동으로 업데이트

### 3. 릴리즈

패키지를 빌드하고 배포합니다:

```bash
pnpm release
```

## 📋 주요 명령어

```bash
# changeset 생성 (대화형)
pnpm changeset

# 버전 업데이트
pnpm version

# 릴리즈 (빌드 + 배포)
pnpm release

# 모든 패키지 빌드
pnpm build

# 모든 패키지 테스트
pnpm test

# 모든 패키지 린트
pnpm lint
```

## 🔧 설정

### .changeset/config.json

```json
{
  "access": "public", // 패키지 접근 권한
  "baseBranch": "main", // 기본 브랜치
  "updateInternalDependencies": "patch", // 내부 의존성 업데이트 방식
  "ignore": [
    // 무시할 패키지들
    "services/*",
    "temp/*",
    "shared/*"
  ]
}
```

## 📦 패키지별 설정

### 공개 패키지 (packages/)

- `@hyunjin/http-client`
- `@hyunjin/babel-plugin-react-compiler`
- `@hyunjin/query-core`
- 기타 packages/ 디렉토리의 패키지들

### 내부 패키지 (internal/)

- `@hyunjin/eslint-config`
- `@hyunjin/typescript-config`

### 서비스 (services/)

- 블로그, API 서버 등은 릴리즈 대상에서 제외

## 🔄 워크플로우

### 개발 워크플로우

1. **기능 개발**

   ```bash
   # 패키지 개발
   cd packages/http-client
   pnpm dev
   ```

2. **변경사항 기록**

   ```bash
   # 루트에서 실행
   pnpm changeset
   ```

3. **커밋**
   ```bash
   git add .
   git commit -m "feat: add new feature to http-client"
   ```

### 릴리즈 워크플로우

1. **버전 업데이트**

   ```bash
   pnpm version
   ```

2. **테스트 및 빌드**

   ```bash
   pnpm test
   pnpm build
   ```

3. **릴리즈**
   ```bash
   pnpm release
   ```

## 📝 Changeset 작성 가이드

### 변경사항 유형

- **major**: 호환되지 않는 API 변경
- **minor**: 새로운 기능 추가 (하위 호환)
- **patch**: 버그 수정 (하위 호환)

### 예시

```markdown
---
'@hyunjin/http-client': patch
'@hyunjin/query-core': minor
---

http-client: Fix retry logic for network errors
query-core: Add new utility function for data transformation
```

## 🚨 주의사항

1. **서비스는 릴리즈하지 않음**: `services/` 디렉토리의 프로젝트들은 릴리즈 대상에서 제외됩니다.

2. **의존성 관리**: 패키지 간 의존성이 변경되면 자동으로 버전이 업데이트됩니다.

3. **CHANGELOG**: 모든 변경사항은 자동으로 CHANGELOG.md에 기록됩니다.

4. **Git 태그**: 릴리즈 시 자동으로 Git 태그가 생성됩니다.

## 🔗 관련 링크

- [Changesets 공식 문서](https://github.com/changesets/changesets)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Semantic Versioning](https://semver.org/)
