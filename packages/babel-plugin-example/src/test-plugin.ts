// 바벨 플러그인 테스트 방법 (TypeScript)
import * as babel from '@babel/core'
import transformConsoleLog from './index'

// 테스트할 코드
const inputCode = `
console.log('Hello');
console.error('Error');
const result = console.log('World');
`

async function testPlugin() {
  try {
    // 플러그인 적용
    const output = babel.transformSync(inputCode, {
      plugins: [transformConsoleLog],
      parserOpts: {
        sourceType: 'module',
        plugins: ['jsx', 'typescript'],
      },
    })

    if (!output || !output.code) {
      throw new Error('변환 실패')
    }

    console.log('원본 코드:')
    console.log(inputCode)
    console.log('\n변환된 코드:')
    console.log(output.code)

    // 결과 검증
    const expectedOutput = `myLogger.log('Hello');
console.error('Error');
const result = myLogger.log('World');`

    if (output.code.trim() === expectedOutput.trim()) {
      console.log('\n✅ 테스트 통과!')
    } else {
      console.log('\n❌ 테스트 실패!')
      console.log('예상된 결과:')
      console.log(expectedOutput)
    }
  } catch (error) {
    console.error('테스트 중 오류 발생:', error)
  }
}

// Jest를 사용한 단위 테스트
export function setupJestTests() {
  describe('console.log 변환 플러그인', () => {
    it('console.log를 myLogger.log로 변환해야 함', () => {
      const input = `console.log('test');`
      const output = babel.transformSync(input, {
        plugins: [transformConsoleLog],
      })

      expect(output?.code).toBe(`myLogger.log('test');`)
    })

    it('console.error는 변환하지 않아야 함', () => {
      const input = `console.error('error');`
      const output = babel.transformSync(input, {
        plugins: [transformConsoleLog],
      })

      expect(output?.code).toBe(`console.error('error');`)
    })

    it('중첩된 console.log도 변환해야 함', () => {
      const input = `
        function test() {
          console.log('nested');
        }
      `
      const output = babel.transformSync(input, {
        plugins: [transformConsoleLog],
      })

      expect(output?.code).toContain(`myLogger.log('nested');`)
    })
  })
}

// 테스트 실행
if (require.main === module) {
  testPlugin()
}
