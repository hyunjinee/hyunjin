# NPM 배포 가이드

## 배포 준비

1. **npm 계정 확인**

   ```bash
   npm whoami
   ```

   로그인이 필요한 경우:

   ```bash
   npm login
   ```

2. **패키지 이름 확인**
   - 현재: `@hyunjin/babel-plugin-example`
   - 스코프 패키지는 기본적으로 private이므로 public으로 배포하려면 추가 옵션 필요

## 배포 과정

### 1. 버전 업데이트

```bash
# patch 버전 증가 (1.0.0 → 1.0.1)
pnpm version patch

# minor 버전 증가 (1.0.0 → 1.1.0)
pnpm version minor

# major 버전 증가 (1.0.0 → 2.0.0)
pnpm version major
```

### 2. 빌드

```bash
pnpm build
```

### 3. 배포 전 테스트 (Dry Run)

```bash
pnpm publish --dry-run --access public
```

### 4. 실제 배포

```bash
# 스코프 패키지를 public으로 배포
pnpm publish --access public

# 또는 package.json에 추가
"publishConfig": {
  "access": "public"
}
```

## 배포 후 확인

1. **NPM 페이지에서 확인**

   ```
   https://www.npmjs.com/package/@hyunjin/babel-plugin-example
   ```

2. **설치 테스트**
   ```bash
   # 다른 프로젝트에서
   pnpm add -D @hyunjin/babel-plugin-example
   ```

## 버전 관리 팁

- **patch** (1.0.x): 버그 수정
- **minor** (1.x.0): 새 기능 추가 (하위 호환)
- **major** (x.0.0): 큰 변경사항 (하위 호환 X)

## 주의사항

1. 한 번 배포한 버전은 수정 불가 (unpublish 후 24시간 대기)
2. README.md가 npm 페이지에 표시됨
3. .npmignore 또는 files 필드로 배포 파일 관리
