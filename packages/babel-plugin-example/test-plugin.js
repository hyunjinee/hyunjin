// 바벨 플러그인 테스트 방법
const babel = require('@babel/core')
const plugin = require('./index')

// 테스트할 코드
const inputCode = `
console.log('Hello');
console.error('Error');
const result = console.log('World');
`

// 플러그인 적용
const output = babel.transformSync(inputCode, {
  plugins: [plugin],
  parserOpts: {
    sourceType: 'module',
  },
})

console.log('원본 코드:')
console.log(inputCode)
console.log('\n변환된 코드:')
console.log(output.code)

// Jest를 사용한 단위 테스트 예제
// test-plugin.test.js
/*
const babel = require('@babel/core');
const plugin = require('./index');

describe('console.log 변환 플러그인', () => {
  it('console.log를 myLogger.log로 변환해야 함', () => {
    const input = `console.log('test');`;
    const output = babel.transformSync(input, {
      plugins: [plugin]
    });
    
    expect(output.code).toBe(`myLogger.log('test');`);
  });

  it('console.error는 변환하지 않아야 함', () => {
    const input = `console.error('error');`;
    const output = babel.transformSync(input, {
      plugins: [plugin]
    });
    
    expect(output.code).toBe(`console.error('error');`);
  });
});
*/
