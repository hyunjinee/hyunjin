import { transformSync } from '@babel/core'
import plugin from './index'

function transform(code: string) {
  const result = transformSync(code, {
    plugins: [plugin],
    configFile: false,
    babelrc: false,
  })
  return result?.code
}

describe('babel-plugin-undefined-to-void', () => {
  it('should transform undefined to void 0 in comparison', () => {
    const input = `if (foo === undefined) { console.log('undefined') }`
    const output = transform(input)
    expect(output).toBe(`if (foo === void 0) {\n  console.log('undefined');\n}`)
  })

  it('should transform undefined to void 0 in variable assignment', () => {
    const input = `let foo = undefined`
    const output = transform(input)
    expect(output).toBe(`let foo = void 0;`)
  })

  it('should transform undefined to void 0 in return statement', () => {
    const input = `function test() { return undefined }`
    const output = transform(input)
    expect(output).toBe(`function test() {\n  return void 0;\n}`)
  })

  it('should transform undefined to void 0 in array', () => {
    const input = `const arr = [1, undefined, 3]`
    const output = transform(input)
    expect(output).toBe(`const arr = [1, void 0, 3];`)
  })

  it('should transform undefined to void 0 in object', () => {
    const input = `const obj = { foo: undefined }`
    const output = transform(input)
    expect(output).toBe(`const obj = {\n  foo: void 0\n};`)
  })

  it('should not transform undefined when it is a parameter name', () => {
    const input = `function test(undefined) { return undefined }`
    const output = transform(input)
    expect(output).toBe(`function test(undefined) {\n  return undefined;\n}`)
  })

  it('should not transform undefined when it is a variable name', () => {
    const input = `let undefined = 5`
    const output = transform(input)
    expect(output).toBe(`let undefined = 5;`)
  })

  it('should transform undefined in default parameters', () => {
    const input = `function test(a = undefined) { }`
    const output = transform(input)
    expect(output).toBe(`function test(a = void 0) {}`)
  })

  it('should transform multiple undefined occurrences', () => {
    const input = `if (a === undefined && b !== undefined) { c = undefined }`
    const output = transform(input)
    expect(output).toBe(`if (a === void 0 && b !== void 0) {\n  c = void 0;\n}`)
  })

  it('should handle typeof undefined', () => {
    const input = `typeof foo === 'undefined'`
    const output = transform(input)
    // typeof는 변환하지 않음 (문자열이므로)
    expect(output).toBe(`typeof foo === 'undefined';`)
  })

  it('should transform undefined in ternary operator', () => {
    const input = `const result = condition ? undefined : 'value'`
    const output = transform(input)
    expect(output).toBe(`const result = condition ? void 0 : 'value';`)
  })

  it('should transform undefined in function call', () => {
    const input = `myFunction(undefined, 'test')`
    const output = transform(input)
    expect(output).toBe(`myFunction(void 0, 'test');`)
  })
})