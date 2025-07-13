// 이 파일은 babel-plugin-remove-console의 동작을 보여주는 예제입니다

console.log('This log will be removed');
console.error('This error will be removed');
console.warn('This warning will be removed');
console.info('This info will be removed');

// 변수에 할당된 console
const result = console.log('This returns undefined');
console.log('result:', result);

// 조건문 안의 console
if (true) {
  console.log('Conditional log');
}

// 함수 안의 console
function processData(data) {
  console.log('Processing:', data);
  const transformed = data.toUpperCase();
  console.log('Transformed:', transformed);
  return transformed;
}

// 클래스 안의 console
class Logger {
  constructor() {
    console.log('Logger initialized');
  }
  
  log(message) {
    console.log('Logger:', message);
  }
}

// 화살표 함수의 console
const arrowFunc = () => {
  console.log('Arrow function');
  return 42;
};

// try-catch 안의 console
try {
  console.log('Try block');
  throw new Error('Test error');
} catch (e) {
  console.error('Error caught:', e);
}

// 배열 메서드와 함께 사용
[1, 2, 3].forEach(num => console.log('Number:', num));

// 객체 메서드가 아닌 console 호출은 유지됨
const myConsole = { log: (msg) => msg };
myConsole.log('This will not be removed');