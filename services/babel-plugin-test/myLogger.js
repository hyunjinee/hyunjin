// myLogger 구현
const myLogger = {
  log: (...args) => {
    const timestamp = new Date().toISOString()
    const caller = new Error().stack?.split('\n')[2]?.trim() || 'unknown'

    // 색상 있는 출력
    console.log(`\x1b[36m[${timestamp}]\x1b[0m \x1b[33m[CUSTOM LOG]\x1b[0m`, ...args, `\x1b[90m${caller}\x1b[0m`)
  },
}

// Node.js 전역으로 설정
global.myLogger = myLogger

module.exports = myLogger
