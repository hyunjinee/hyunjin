// myLogger 구현체
const myLogger = {
  log: (...args) => {
    console.log('[MyLogger]', new Date().toISOString(), ...args)
  },
}

module.exports = { myLogger }
