const babel = require('@babel/core');
const fs = require('fs');
const path = require('path');

// 소스 파일 읽기
const sourceCode = fs.readFileSync(path.join(__dirname, 'example.js'), 'utf8');

// 기본 변환 (모든 console 제거)
console.log('=== 기본 변환 (모든 console 제거) ===\n');
const defaultResult = babel.transformSync(sourceCode, {
  plugins: [require('../dist/index.js').default],
  filename: 'example.js'
});
console.log(defaultResult.code);

// exclude 옵션 사용 (error와 warn 유지)
console.log('\n\n=== exclude: ["error", "warn"] 옵션 사용 ===\n');
const excludeResult = babel.transformSync(sourceCode, {
  plugins: [[require('../dist/index.js').default, { exclude: ['error', 'warn'] }]],
  filename: 'example.js'
});
console.log(excludeResult.code);

// 결과를 파일로 저장
fs.writeFileSync(
  path.join(__dirname, 'example.transformed.js'), 
  defaultResult.code
);
fs.writeFileSync(
  path.join(__dirname, 'example.transformed.exclude.js'), 
  excludeResult.code
);

console.log('\n✅ 변환된 파일이 생성되었습니다:');
console.log('   - example.transformed.js (모든 console 제거)');
console.log('   - example.transformed.exclude.js (error, warn 유지)');