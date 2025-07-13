const babel = require('@babel/core');
const fs = require('fs');
const path = require('path');

// 플러그인 경로
const pluginPath = path.join(__dirname, '../dist/index.js');

// 예제 파일 읽기
const inputPath = path.join(__dirname, 'example.js');
const outputPath = path.join(__dirname, 'example.transformed.js');

// 파일 내용 읽기
const code = fs.readFileSync(inputPath, 'utf8');

// Babel 변환 실행
const result = babel.transformSync(code, {
  plugins: [pluginPath],
  filename: inputPath,
  babelrc: false,
  configFile: false,
});

// 변환된 코드를 파일로 저장
fs.writeFileSync(outputPath, result.code);

console.log('변환 완료!');
console.log(`입력 파일: ${inputPath}`);
console.log(`출력 파일: ${outputPath}`);
console.log('\n변환 전후 비교:');
console.log('=====================================');
console.log('변환 전: let myVar = undefined;');
console.log('변환 후: let myVar = void 0;');
console.log('=====================================');