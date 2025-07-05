// 바벨 플러그인 실행 및 결과 확인
import * as babel from '@babel/core'
import * as fs from 'fs'
import * as path from 'path'
import transformConsoleLog from './src/index'

const inputFilePath = path.join(__dirname, 'test-example.js')
const inputCode = fs.readFileSync(inputFilePath, 'utf-8')

console.log('=== 원본 코드 ===')
console.log(inputCode)
console.log('\n')

// 바벨 변환 실행
const result = babel.transformSync(inputCode, {
  plugins: [transformConsoleLog],
  filename: 'test-example.js',
  parserOpts: {
    sourceType: 'module',
  },
})

if (result && result.code) {
  console.log('=== 변환된 코드 ===')
  console.log(result.code)
  console.log('\n')

  // 변환 결과 파일로 저장
  const outputPath = path.join(__dirname, 'test-example-transformed.js')
  fs.writeFileSync(outputPath, result.code)
  console.log(`✅ 변환된 코드가 ${outputPath}에 저장되었습니다.`)

  // 변환 확인
  const logCount = (inputCode.match(/console\.log/g) || []).length
  const transformedLogCount = (result.code.match(/myLogger\.log/g) || []).length
  const remainingConsoleLog = (result.code.match(/console\.log/g) || []).length

  console.log('\n=== 변환 통계 ===')
  console.log(`원본 console.log 개수: ${logCount}`)
  console.log(`변환된 myLogger.log 개수: ${transformedLogCount}`)
  console.log(`남은 console.log 개수: ${remainingConsoleLog}`)
  console.log(`console.error 유지됨: ${result.code.includes('console.error') ? '✅' : '❌'}`)
} else {
  console.error('변환 실패!')
}
