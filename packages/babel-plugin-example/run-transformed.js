// myLogger 임포트
const { myLogger } = require('./myLogger')

// 전역에 myLogger 등록 (실제 프로젝트에서는 import로 처리)
global.myLogger = myLogger

console.log('=== 변환된 코드 실행 테스트 ===\n')

// 변환된 코드 실행
require('./test-example-transformed')

console.log('\n=== 실행 완료 ===')
