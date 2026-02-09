# lower (BuildHIR)

BuildHIR는 React Compiler 파이프라인의 첫 번째 주요 변환 패스이다.

Babel AST(자바스크립트 코드의 트리 구조)를 HIR(High-level Intermediate Representation)로 변환하는 단계

HIR은 코드를 기본 블록(basic block), 명령어(instruction), 터미널(terminal)로 구성된 제어 흐름 그래프(CFG)로 표현한다.

이것은 React Compiler 파이프라인의 첫 번째 주요 변환 패스이며, 표현식 수준의 정밀한 메모이제이션 분석을 가능하게 합니다.

컴파일러 용어에서 lowering은 고수준 표현을 저수준 표현으로 내리는 것을 뜻한다.

이 경우:

- 고수준 = Babel AST (자바스크립트 문법에 가까운 트리 구조)
- 저수준 = HIR (제어 흐름 그래프, 기본 블록, 명령어 단위)

AST는 사람이 읽기 좋은 형태지만, 컴파일러가 분석하기엔 추상화 수준이 너무 높습니다.
예를 들어 a && b가 AST에서는 LogicalExpression 노드 하나지만, HIR에서는 분기가 있는 두개의 블록으로 내려갑니다.

AST (고수준): LogicalExpression { left: a, operator: &&, right: b }
↓ lowering
HIR (저수준): bb0: a를 평가 → 참이면 bb1, 거짓이면 bb2
bb1: b를 평가
bb2: 결과 합류

즉 "lower"는 추상화 수준을 한 단계 내린다는 의미이고, 컴파일러 분야에서 널리 쓰이는 표준 용어입니다.
GCC, LLVM 등 범용 컴파일러에서도 동일한 용어를 사용합니다.

## 입력 불변 조건

- 입력은 유효한 Babel NodePath<t.Function>이어야 한다 (FunctionDeclaration,
  FunctionExpression, 또는 ArrowFunctionExpression)
- 함수는 컴포넌트 또는 훅이어야 한다 (환경 설정에 의해 결정됨)
- 바인딩 해석을 위해 Babel 스코프 분석이 사용 가능해야 한다
- 컴파일러 설정이 담긴 Environment 인스턴스가 제공되어야 한다
- 중첩 함수 lowering(재귀 호출)을 위한 bindings 맵은 선택 사항이다
- 외부 스코프에서 캡처된 컨텍스트 변수를 위한 capturedRefs 맵은 선택 사항입니다

왜 필요한가?

일반 AST는 트리 구조라서 if/else, 반복문 등의 제어 흐름을 정밀하게 분석하기 어렵습니다.
HIR로 변환하면 코드를 "기본 블록(basic block)" 단위로 쪼개서 어떤 값이 어디서
쓰이는지, 어떤 분기를 타는지 명확하게 추적할 수 있습니다.

변환 과정

JavaScript 함수
↓

1. 파라미터 처리 (destructuring 포함)
2. 본문을 문(statement) 단위로 재귀 하강
3. 각 표현식을 Instruction으로 변환
4. 제어 흐름(if, for, switch 등)은 별도 블록으로 분리
   ↓
   HIR (제어 흐름 그래프)

핵심 개념
┌─────────────┬──────────────────────────────────────────────────────────────┐
│ 개념 │ 설명 │
├─────────────┼──────────────────────────────────────────────────────────────┤
│ BasicBlock │ 명령어 배열 + 터미널(분기/리턴 등) 하나로 구성된 코드 단위 │
├─────────────┼──────────────────────────────────────────────────────────────┤
│ Instruction │ 하나의 연산 (LoadLocal, CallExpression, BinaryExpression 등) │
├─────────────┼──────────────────────────────────────────────────────────────┤
│ Terminal │ 블록의 끝에서 다음 블록으로 가는 방법 (if, goto, return 등) │
├─────────────┼──────────────────────────────────────────────────────────────┤
│ Place │ 값에 대한 참조 (임시 변수 $0, $1 등) │
└─────────────┴──────────────────────────────────────────────────────────────┘
예시로 이해하기

function foo(x, y) {
if (x) {
return foo(false, y);
}
return [y * 10];
}

이 코드가 3개 블록으로 분리됩니다:

bb0 (진입):
x를 로드 → if(x)이면 bb2, 아니면 bb1

bb2 (then 분기):
foo(false, y) 호출 → return

bb1 (else 분기):
y \* 10 계산 → 배열로 감싸기 → return

이 단계의 특징

- 타입/이펙트는 아직 없음 — <unknown>으로 표시, 이후 패스에서 채워짐
- 모든 값에 임시 변수 부여 — $0, $1 같은 식별자로 각 연산 결과를 추적
- 제어 흐름이 명시적 — 삼항 연산자, &&/||, 옵셔널 체이닝도 전부 분기 블록으로 변환

특수 케이스 처리

- 호이스팅 — let/const 전방 참조 시 DeclareContext 생성
- 클로저 캡처 — 중첩 함수가 외부 변수 사용 시 LoadContext/StoreContext 사용
- 옵셔널 체이닝 (?.) — OptionalTerminal로 단락 평가 분기 생성
- try/catch — try 블록 내 각 명령어 뒤에 MaybeThrowTerminal 추가
- 지원 안 함 — var, with, 인라인 class, eval은 에러 발생

이후 파이프라인에서 이 HIR을 기반으로 이펙트 추론 → 리액티브 스코프 분석 → 메모이제이
코드 생성이 이어집니다.
