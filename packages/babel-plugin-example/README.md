# 바벨 플러그인 개발 가이드 (TypeScript)

## 1. 바벨 플러그인이란?

바벨 플러그인은 JavaScript 코드를 AST(추상 구문 트리)로 파싱한 후, 이를 순회하며 변환하는 도구입니다.

## 2. 핵심 개념

### AST (Abstract Syntax Tree)

코드를 트리 구조로 표현한 것입니다. 각 노드는 코드의 구조적 요소를 나타냅니다.

```javascript
// 코드
const x = 1;

// AST
{
  type: "VariableDeclaration",
  declarations: [{
    type: "VariableDeclarator",
    id: { type: "Identifier", name: "x" },
    init: { type: "NumericLiteral", value: 1 }
  }],
  kind: "const"
}
```

### Visitor 패턴

AST의 각 노드를 방문하면서 변환을 수행합니다.

```javascript
visitor: {
  Identifier(path) {
    // 모든 Identifier 노드 방문
  },
  FunctionDeclaration(path) {
    // 모든 함수 선언 방문
  }
}
```

### Path API

노드를 조작하는 강력한 API입니다.

```javascript
// 주요 메서드들
path.node // 현재 노드
path.parent // 부모 노드
path.replaceWith() // 노드 교체
path.remove() // 노드 제거
path.insertBefore() // 앞에 삽입
path.insertAfter() // 뒤에 삽입
path.traverse() // 하위 노드 순회
```

## 3. 개발 단계

### 1단계: 프로젝트 설정 (TypeScript)

```bash
pnpm init
pnpm add -D @babel/core @babel/types @babel/traverse
pnpm add -D typescript @types/babel__core @types/babel__traverse @types/node
pnpm add -D ts-node # 테스트용
```

TypeScript 설정 (tsconfig.json):

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

### 2단계: 플러그인 작성 (TypeScript)

```typescript
import type { PluginObj, PluginPass } from '@babel/core'
import type { NodePath } from '@babel/traverse'
import type * as BabelTypes from '@babel/types'

export default function myPlugin(babel: typeof import('@babel/core')): PluginObj<PluginPass> {
  const { types: t } = babel

  return {
    name: 'my-plugin',
    visitor: {
      Identifier(path: NodePath<BabelTypes.Identifier>) {
        // 타입 안전한 변환 로직
      },
    },
  }
}
```

### 3단계: 테스트

```javascript
const babel = require('@babel/core')
const plugin = require('./my-plugin')

const result = babel.transformSync(code, {
  plugins: [plugin],
})
```

## 4. 유용한 도구들

### AST Explorer

https://astexplorer.net/

- 코드를 AST로 시각화
- 실시간 플러그인 테스트

### Babel Types

모든 노드 타입과 생성 함수 제공

- `t.identifier('name')`
- `t.stringLiteral('value')`
- `t.callExpression(callee, args)`

## 5. 실전 팁

1. **노드 타입 확인**: `t.isIdentifier()`, `t.isCallExpression()` 등 사용
2. **스코프 관리**: `path.scope`로 변수 스코프 추적
3. **바인딩**: `path.scope.getBinding(name)`으로 변수 정의 찾기
4. **성능**: 불필요한 순회 최소화
5. **디버깅**: `path.node`를 console.log로 확인

## 6. 주의사항

- AST 구조를 깨뜨리지 않도록 주의
- 무한 루프 방지 (노드 생성 시 재방문 주의)
- 옵션 처리: `this.opts`로 플러그인 옵션 접근
- 에러 처리: 예외 상황 고려

## 7. 예제 플러그인들 (TypeScript)

### JavaScript 예제 (기존)

- `index.js`: console.log 변환
- `advanced-example.js`: 고급 기능들
- `test-plugin.js`: 테스트 방법
- `typed-example.js`: JSDoc을 사용한 타입 안전 플러그인

### TypeScript 예제 (src 디렉토리)

- `src/index.ts`: 기본 console.log 변환 (TypeScript)
- `src/advanced-example.ts`: 고급 기능들 (TypeScript)
- `src/practical-example.ts`: 실용적인 예제 - 성능 모니터링, 에러 처리
- `src/utils.ts`: 유틸리티 함수와 타입 정의
- `src/test-plugin.ts`: TypeScript 테스트 방법

### 빌드 및 실행

```bash
# TypeScript 빌드
pnpm build

# 개발 모드 (watch)
pnpm dev

# 테스트 실행
pnpm test
```
