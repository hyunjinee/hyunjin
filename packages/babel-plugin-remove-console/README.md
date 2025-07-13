# @hyunjin/babel-plugin-remove-console

> console 문을 제거하는 Babel 플러그인

## 설치

```bash
pnpm add -D @hyunjin/babel-plugin-remove-console
```

## 사용법

### Babel 설정 (.babelrc)

```json
{
  "plugins": ["@hyunjin/babel-plugin-remove-console"]
}
```

### 옵션

특정 console 메서드를 제외하고 싶다면 `exclude` 옵션을 사용하세요:

```json
{
  "plugins": [
    ["@hyunjin/babel-plugin-remove-console", {
      "exclude": ["error", "warn"]
    }]
  ]
}
```

## 예제

### 입력 코드

```javascript
console.log('This will be removed');
console.error('This will also be removed');

const result = console.log('This returns undefined');

function doSomething() {
  console.warn('Debug message');
  return 42;
}
```

### 출력 코드 (기본 설정)

```javascript
const result = void 0;

function doSomething() {
  return 42;
}
```

### 출력 코드 (exclude: ["error", "warn"])

```javascript
console.error('This will also be removed');

const result = void 0;

function doSomething() {
  console.warn('Debug message');
  return 42;
}
```

## 동작 방식

이 플러그인은 다음과 같이 동작합니다:

1. **문장으로 사용된 console**: 전체 문장을 제거합니다
   ```javascript
   console.log('hello'); // 이 줄 전체가 제거됩니다
   ```

2. **표현식으로 사용된 console**: `void 0`으로 대체합니다
   ```javascript
   const x = console.log('hello'); // const x = void 0;
   ```

3. **exclude 옵션**: 지정된 메서드는 제거하지 않습니다
   ```javascript
   // exclude: ['error']인 경우
   console.log('removed');   // 제거됨
   console.error('kept');    // 유지됨
   ```

## 개발

```bash
# 빌드
pnpm build

# 테스트
pnpm test

# 개발 모드 (watch)
pnpm dev
```

## 라이센스

MIT