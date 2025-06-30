# hyunjin

- 바벨 플러그인은 어떻게 만들어?

## 바벨 플러그인 만드는 방법

바벨 플러그인은 JavaScript 코드를 AST(추상 구문 트리)로 파싱한 후 변환하는 도구입니다.

### 기본 구조

```javascript
module.exports = function (babel) {
  const { types: t } = babel

  return {
    name: '플러그인-이름',
    visitor: {
      // AST 노드 타입별 처리
      Identifier(path) {
        // 변환 로직
      },
    },
  }
}
```

### 주요 개념

1. **AST (Abstract Syntax Tree)**: 코드의 구조를 트리 형태로 표현
2. **Visitor 패턴**: AST의 각 노드를 방문하며 변환 수행
3. **Path API**: 노드 조작을 위한 강력한 API (`path.replaceWith()`, `path.remove()` 등)

### 예제

`packages/babel-plugin-example/` 디렉토리에 다음 예제들이 있습니다:

- **기본 예제** (`index.js`): console.log를 myLogger.log로 변환
- **고급 예제** (`advanced-example.js`): JSX 변환, import 추가, 함수 변환 등
- **테스트 예제** (`test-plugin.js`): 플러그인 테스트 방법

### 개발 순서

1. AST Explorer(https://astexplorer.net/)에서 변환하려는 코드의 AST 구조 파악
2. Visitor 메서드로 해당 노드 타입 처리
3. Babel Types API로 새로운 노드 생성
4. 테스트 작성 및 실행

자세한 내용은 `packages/babel-plugin-example/README.md`를 참고하세요.
