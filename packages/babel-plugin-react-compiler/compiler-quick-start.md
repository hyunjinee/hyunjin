# React Compiler 빠른 시작 가이드

## 1. 환경 설정

```bash
cd compiler
pnpm install
pnpm snap:build
```

## 2. 첫 번째 테스트 작성

`compiler/packages/babel-plugin-react-compiler/src/__tests__/fixtures/compiler/my-first-test.js` 파일 생성:

```javascript
function MyComponent(props) {
  const expensive = props.data.map(item => item * 2);
  return <div>{expensive}</div>;
}

export const FIXTURE_ENTRYPOINT = {
  fn: MyComponent,
  params: [{data: [1, 2, 3]}],
};
```

## 3. 테스트 실행

```bash
# 스냅샷 생성
pnpm snap --update

# 결과 확인
pnpm snap
```

## 4. 결과 분석

생성된 `my-first-test.expect.md` 파일을 열어서:
- **Input**: 원본 코드
- **Code**: 컴파일된 코드 (메모이제이션 적용)
- **Eval output**: 실행 결과

## 5. 디버깅 모드로 실행

`testfilter.txt` 파일 생성:
```
my-first-test
```

```bash
# 특정 테스트만 실행하며 중간 단계 출력
pnpm snap --filter --watch
```

이렇게 하면 컴파일 과정의 각 단계 (HIR, SSA, ReactiveScopes 등)를 볼 수 있습니다.

## 핵심 코드 읽기 순서

1. **HIR 이해하기**
   - `src/HIR/HIR.ts` - 타입 정의
   - `src/HIR/PrintHIR.ts` - HIR 출력 (디버깅용)

2. **간단한 최적화 패스**
   - `src/Optimization/ConstantPropagation.ts` - 상수 전파
   - `src/Optimization/DeadCodeElimination.ts` - 죽은 코드 제거

3. **Reactive Scope 이해하기**
   - `src/ReactiveScopes/InferReactiveScopeVariables.ts` - 스코프 추론
   - `src/ReactiveScopes/CodegenReactiveFunction.ts` - 코드 생성

## 실제 컴파일러 수정해보기

### 예제: 새로운 최적화 추가

1. `src/Optimization/MyOptimization.ts` 생성:
```typescript
export function myOptimization(fn: HIRFunction): void {
  // HIR을 순회하며 최적화 수행
  for (const [_, block] of fn.body.blocks) {
    for (const instr of block.instructions) {
      // 여기서 최적화 로직 구현
    }
  }
}
```

2. `src/Entrypoint/Pipeline.ts`에 추가:
```typescript
import {myOptimization} from '../Optimization/MyOptimization';

// ... 파이프라인에 추가
myOptimization(hir);
log({kind: 'hir', name: 'MyOptimization', value: hir});
```

3. 테스트하고 결과 확인!

## 도움이 되는 리소스

- [Design Goals](compiler/docs/DESIGN_GOALS.md) - 컴파일러 설계 목표
- [Development Guide](compiler/docs/DEVELOPMENT_GUIDE.md) - 개발 가이드
- Fixture 예제들 - `src/__tests__/fixtures/compiler/` 디렉토리 
