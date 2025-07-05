# Babel Plugin Test

@hyunjin/babel-plugin-example 플러그인 테스트 프로젝트입니다.

## 플러그인 기능

`console.log`를 `myLogger.log`로 자동 변환합니다.

## 실행 방법

```bash
# 빌드만
pnpm build

# 실행만
pnpm start

# 빌드 후 실행
pnpm dev
```

## 파일 구조

- `src/index.js` - 원본 소스 코드 (console.log 사용)
- `dist/index.js` - 변환된 코드 (myLogger.log 사용)
- `myLogger.js` - 커스텀 로거 구현
- `.babelrc` - Babel 설정

## 변환 예시

변환 전:

```javascript
console.log('Hello World!')
```

변환 후:

```javascript
myLogger.log('Hello World!')
```

실행 결과:

```
[2025-07-05T10:22:06.655Z] [CUSTOM LOG] Hello World! at ...
```
