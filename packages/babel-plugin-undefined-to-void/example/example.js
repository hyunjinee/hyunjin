// 이 파일은 babel-plugin-undefined-to-void의 동작을 보여주는 예제입니다.
// 플러그인을 적용하면 모든 undefined가 void 0으로 변환됩니다.

// 1. 변수 할당
let myVar = undefined;
const myConst = undefined;

// 2. 비교 연산
if (myVar === undefined) {
  console.log('myVar is undefined');
}

if (myConst !== undefined) {
  console.log('myConst is not undefined');
}

// 3. 함수 반환값
function returnUndefined() {
  return undefined;
}

// 4. 함수 매개변수 기본값
function greet(name = undefined) {
  if (name === undefined) {
    return 'Hello, anonymous!';
  }
  return `Hello, ${name}!`;
}

// 5. 배열과 객체
const myArray = [1, 2, undefined, 4, undefined];
const myObject = {
  name: 'John',
  age: undefined,
  city: 'Seoul',
  country: undefined
};

// 6. 삼항 연산자
const result = true ? undefined : 'defined';

// 7. 함수 호출
console.log(undefined);
greet(undefined);

// 8. 논리 연산
const value = undefined || 'default';
const anotherValue = 'something' && undefined;

// 9. switch 문
switch (myVar) {
  case undefined:
    console.log('It is undefined');
    break;
  default:
    console.log('It is not undefined');
}

// 10. try-catch
try {
  if (someVariable === undefined) {
    throw new Error('Variable is undefined');
  }
} catch (e) {
  console.error(e);
}

// 주의: 다음과 같은 경우는 변환되지 않습니다
// - undefined가 변수명으로 사용되는 경우
function shadow() {
  let undefined = 5; // 이것은 변환되지 않음
  return undefined; // 이것도 변환되지 않음 (지역 변수 참조)
}

// - typeof 연산자와 함께 문자열로 사용되는 경우
if (typeof someVar === 'undefined') { // 문자열 'undefined'는 변환되지 않음
  console.log('someVar is undefined');
}