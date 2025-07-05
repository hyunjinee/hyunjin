// 테스트 파일
console.log('안녕하세요!')
console.log('바벨 플러그인 테스트입니다.')

function greet(name) {
  console.log(`Hello, ${name}!`)
}

class Logger {
  info(message) {
    console.log(`[INFO] ${message}`)
  }

  error(message) {
    console.log(`[ERROR] ${message}`)
  }
}

const logger = new Logger()
logger.info('시작합니다')

greet('World')

// 조건부 로깅
if (true) {
  console.log('조건이 참입니다')
}

// 배열과 객체 로깅
console.log([1, 2, 3])
console.log({ name: 'test', value: 42 })
