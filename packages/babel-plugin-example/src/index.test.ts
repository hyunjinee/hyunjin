import * as babel from '@babel/core'
import transformConsoleLog from './index'

describe('console.log 변환 플러그인', () => {
  // 헬퍼 함수: 코드 변환
  const transform = (code: string): string | null | undefined => {
    const result = babel.transformSync(code, {
      plugins: [transformConsoleLog],
      parserOpts: {
        sourceType: 'module',
      },
    })
    return result?.code
  }

  it('console.log를 myLogger.log로 변환해야 함', () => {
    const input = `console.log('test');`
    const output = transform(input)
    expect(output).toBe(`myLogger.log('test');`)
  })

  it('여러 인자를 가진 console.log도 변환해야 함', () => {
    const input = `console.log('message', data, 123);`
    const output = transform(input)
    expect(output).toBe(`myLogger.log('message', data, 123);`)
  })

  it('console.error는 변환하지 않아야 함', () => {
    const input = `console.error('error');`
    const output = transform(input)
    expect(output).toBe(`console.error('error');`)
  })

  it('console.warn도 변환하지 않아야 함', () => {
    const input = `console.warn('warning');`
    const output = transform(input)
    expect(output).toBe(`console.warn('warning');`)
  })

  it('중첩된 console.log도 변환해야 함', () => {
    const input = `
      function test() {
        console.log('nested');
      }
    `
    const output = transform(input)
    expect(output).toContain(`myLogger.log('nested');`)
  })

  it('조건문 안의 console.log도 변환해야 함', () => {
    const input = `
      if (condition) {
        console.log('conditional');
      }
    `
    const output = transform(input)
    expect(output).toContain(`myLogger.log('conditional');`)
  })

  it('화살표 함수 안의 console.log도 변환해야 함', () => {
    const input = `const fn = () => console.log('arrow');`
    const output = transform(input)
    expect(output).toBe(`const fn = () => myLogger.log('arrow');`)
  })

  it('메서드 체이닝이 있는 경우도 변환해야 함', () => {
    const input = `console.log('chaining').toString();`
    const output = transform(input)
    expect(output).toBe(`myLogger.log('chaining').toString();`)
  })

  it('템플릿 리터럴을 사용한 console.log도 변환해야 함', () => {
    const input = 'console.log(`Hello ${name}`);'
    const output = transform(input)
    expect(output).toBe('myLogger.log(`Hello ${name}`);')
  })

  // TODO: 스코프 분석을 추가해서 로컬 console 변수는 변환하지 않도록 개선 필요
  it.skip('console이 변수인 경우는 변환하지 않아야 함', () => {
    const input = `
      const console = { log: () => {} };
      console.log('custom');
    `
    const output = transform(input)
    // 로컬 console 변수는 변환하지 않음
    expect(output).toContain(`console.log('custom');`)
  })
})
