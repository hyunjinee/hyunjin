# @hyunjin/babel-plugin-example

console.log를 myLogger.log로 변환하는 Babel 플러그인 예제입니다.

## 설치

```bash
npm install --save-dev @hyunjin/babel-plugin-example
# 또는
pnpm add -D @hyunjin/babel-plugin-example
# 또는
yarn add -D @hyunjin/babel-plugin-example
```

## 사용법

### .babelrc 또는 babel.config.js 설정

```json
{
  "plugins": ["@hyunjin/babel-plugin-example"]
}
```

또는

```javascript
module.exports = {
  plugins: ['@hyunjin/babel-plugin-example'],
}
```

### 변환 예제

변환 전:

```javascript
console.log('Hello World!')
console.log('Debug:', value)
```

변환 후:

```javascript
myLogger.log('Hello World!')
myLogger.log('Debug:', value)
```

## myLogger 구현 예제

플러그인은 `console.log`를 `myLogger.log`로 변환하므로, 실행하려면 `myLogger` 객체를 구현해야 합니다:

```javascript
// myLogger.js
const myLogger = {
  log: (...args) => {
    const timestamp = new Date().toISOString()
    console.log(`[${timestamp}]`, ...args)
  },
}

// 전역으로 사용하려면
global.myLogger = myLogger
// 또는 window.myLogger = myLogger; (브라우저)

// 또는 모듈로 export
module.exports = myLogger
```

## 개발

```bash
# 의존성 설치
pnpm install

# 빌드
pnpm build

# 테스트
pnpm test:jest
```

## 라이선스

MIT
