// 테스트용 입력 파일
console.log('첫 번째 로그')
console.log('두 번째 로그', { data: true })

function testFunction() {
  console.log('함수 안의 로그')
  console.error('이건 변환되면 안됨')
}

const arrow = () => {
  console.log('화살표 함수의 로그')
  return console.log('리턴문의 로그')
}

// 중첩된 console.log
if (true) {
  console.log('조건문 안의 로그')
  for (let i = 0; i < 3; i++) {
    console.log('반복문 로그', i)
  }
}

// 체이닝된 경우
console.log('체이닝 테스트').toString()
