# @hyunjin/babel-plugin-undefined-to-void

Some JavaScript implementations allow undefined to be overwritten, this may lead to peculiar bugs that are extremely hard to track down.

This plugin transforms undefined into void 0 which returns undefined regardless of if it's been reassigned.

`undefined`를 `void 0`으로 변환하는 Babel 플러그인입니다.

## 왜 사용하나요?

- `undefined`는 전역 변수로 재할당될 수 있습니다 (non-strict mode에서)
- `void 0`은 항상 undefined를 반환하므로 더 안전합니다
- 때로는 `void 0`이 더 짧아서 번들 크기를 줄일 수 있습니다

## 설치

```bash
pnpm add -D @hyunjin/babel-plugin-undefined-to-void
```

## 사용법

### .babelrc

```json
{
  "plugins": ["@hyunjin/babel-plugin-undefined-to-void"]
}
```

### babel.config.js

```javascript
module.exports = {
  plugins: ['@hyunjin/babel-plugin-undefined-to-void'],
}
```

### @babel/core API

```javascript
const babel = require('@babel/core')

const result = babel.transformSync(code, {
  plugins: ['@hyunjin/babel-plugin-undefined-to-void'],
})
```

## 예제

### 입력

```javascript
// 비교 연산
if (foo === undefined) {
}

// 변수 할당
let bar = undefined

// 함수 반환
function test() {
  return undefined
}

// 배열
const arr = [1, undefined, 3]

// 객체
const obj = { prop: undefined }

// 기본 매개변수
function fn(a = undefined) {}

// 삼항 연산자
const result = condition ? undefined : 'value'
```

### 출력

```javascript
// 비교 연산
if (foo === void 0) {
}

// 변수 할당
let bar = void 0

// 함수 반환
function test() {
  return void 0
}

// 배열
const arr = [1, void 0, 3]

// 객체
const obj = { prop: void 0 }

// 기본 매개변수
function fn(a = void 0) {}

// 삼항 연산자
const result = condition ? void 0 : 'value'
```

## 주의사항

이 플러그인은 다음과 같은 경우에는 변환하지 않습니다:

- `undefined`가 변수명으로 사용되는 경우
- `undefined`가 함수 매개변수명으로 사용되는 경우
- 문자열 내의 'undefined' (예: `typeof foo === 'undefined'`)

## 개발

```bash
# 개발 모드
pnpm dev

# 빌드
pnpm build

# 테스트
pnpm test

# 테스트 watch 모드
pnpm test:watch
```
