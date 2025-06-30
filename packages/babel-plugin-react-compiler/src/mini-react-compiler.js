// 1. 간단한 HIR (High-level Intermediate Representation) 타입 정의
class Place {
  constructor(name, type = 'unknown') {
    this.name = name
    this.type = type
    this.reactive = false
  }
}

class Instruction {
  constructor(id, lvalue, value) {
    this.id = id
    this.lvalue = lvalue // 왼쪽 값 (할당 대상)
    this.value = value // 오른쪽 값 (실제 값)
  }
}

class ReactiveScope {
  constructor(id, dependencies = new Set()) {
    this.id = id
    this.dependencies = dependencies
    this.instructions = []
  }
}

// 2. 간단한 분석기
class MiniReactCompiler {
  constructor() {
    this.instructionId = 0
    this.scopeId = 0
  }

  // Babel AST를 HIR로 변환하는 간단한 예제
  compile(component) {
    console.log('🔧 컴파일 시작:', component.name)

    // 1단계: HIR 빌드 (간단한 예제)
    const hir = this.buildHIR(component)

    // 2단계: 의존성 분석
    const dependencies = this.analyzeDependencies(hir)

    // 3단계: Reactive Scope 결정
    const scopes = this.inferReactiveScopes(hir, dependencies)

    // 4단계: 코드 생성
    const optimizedCode = this.generateCode(component, scopes)

    return optimizedCode
  }

  buildHIR(component) {
    const instructions = []

    // props.count를 읽는 instruction
    const countPlace = new Place('props.count', 'number')
    countPlace.reactive = true

    instructions.push(
      new Instruction(this.instructionId++, new Place('count'), {
        kind: 'LoadProperty',
        object: 'props',
        property: 'count',
      }),
    )

    // doubled = count * 2 계산
    instructions.push(
      new Instruction(this.instructionId++, new Place('doubled'), {
        kind: 'BinaryExpression',
        operator: '*',
        left: countPlace,
        right: 2,
      }),
    )

    return instructions
  }

  analyzeDependencies(instructions) {
    const deps = new Map()

    for (const inst of instructions) {
      if (inst.value.kind === 'LoadProperty' && inst.value.object === 'props') {
        deps.set(inst.lvalue.name, [`props.${inst.value.property}`])
      } else if (inst.value.kind === 'BinaryExpression') {
        deps.set(inst.lvalue.name, [inst.value.left.name])
      }
    }

    return deps
  }

  inferReactiveScopes(instructions, dependencies) {
    const scopes = []

    // props.count에 의존하는 모든 값을 하나의 scope로 묶기
    const scope = new ReactiveScope(this.scopeId++)
    scope.dependencies.add('props.count')

    for (const inst of instructions) {
      if (dependencies.has(inst.lvalue.name)) {
        scope.instructions.push(inst)
      }
    }

    scopes.push(scope)
    return scopes
  }

  generateCode(component, scopes) {
    let code = `function ${component.name}(props) {\n`
    code += `  const $ = _c(${scopes.length * 2}); // 메모 슬롯\n\n`

    for (const scope of scopes) {
      code += `  // Reactive Scope #${scope.id}\n`
      code += `  let doubled;\n`
      code += `  if ($[0] !== props.count) {\n`
      code += `    doubled = props.count * 2;\n`
      code += `    $[0] = props.count;\n`
      code += `    $[1] = doubled;\n`
      code += `  } else {\n`
      code += `    doubled = $[1];\n`
      code += `  }\n\n`
    }

    code += `  return <div>{doubled}</div>;\n`
    code += `}`

    return code
  }
}

// 3. 사용 예제
const compiler = new MiniReactCompiler()

// 입력: 간단한 React 컴포넌트
const inputComponent = {
  name: 'Counter',
  code: `
function Counter(props) {
  const doubled = props.count * 2;
  return <div>{doubled}</div>;
}
  `,
}

// 컴파일!
const optimized = compiler.compile(inputComponent)

console.log('\n📥 입력 코드:')
console.log(inputComponent.code)

console.log('\n📤 최적화된 코드:')
console.log(optimized)

console.log('\n✨ 효과:')
console.log('- props.count가 변하지 않으면 doubled 계산을 건너뜁니다')
console.log('- 메모이제이션을 통해 불필요한 재계산을 방지합니다')
