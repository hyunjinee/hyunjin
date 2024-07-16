---
title: Redux에 대한 생각
emoji: ''
date: '2022-04-28'
author: 이현진
tags: React
categories: 블로그
---

![image](https://github.com/hyunjinee/hyunjin/assets/63354527/3baed470-a29a-472e-b17f-f951206315db)

내가 리액트 공부를 시작했을 때, 리덕스는 리액트 애플리케이션에서 매우 널리 사용되고 있었다.  
나는 리덕스를 왜 만들었는지, 어떤 문제를 해결하는지등의 궁금증이 있었고 공부하면서 정리한 내용, 의문점, 생각들을 적어놓으려고 한다.

리덕스는 상태의 중앙 관리를 위한 상태 관리 도구이다. 즉, 전역 상태(Store)를 생성하고 상태를 관리하기 위한 라이브러리이다.
Store는 생성시에 reducer 함수를 요구한다. reducer는 데이터를 변경하는 함수이고 리턴값은 스토어의 상태가 된다.

리덕스에서 State(Read-Only)를 변경할 수 있는 수단은 액션을 dispatch하여 reducer를 호출하는 것이다.
여기서 액션이란 상태에 변화가 필요할 때 발생시키는 것으로 이해할 수 있다. 이는 자바스크립트 객체 형태로 표현할 수 있으며, 액션 객체는 type 필드를 필수적으로 갖는다.

Store는 reducer를 통해 상태를 변경하고 상태를 변경하면 이를 구독하고 있는 컴포넌트들에게 상태가 변경되었다는 것을 알려준다. 이러한 과정을 통해 리덕스는 상태를 관리한다.

리액트에서 useState와 같은 훅으로 관리하는 상태의 관리 주체는 리액트이다. 여기에 리덕스를 추가한다면 상태 트리를 리덕스가 관리하게 되고 상태를 업데이트하는 로직도 리덕스쪽으로 뺄 수 있다.

상태를 리액트 외부에 두기 때문에 당연하게도 리액트와 상태의 동기화가 필요하다. 이를 담당하는 라이브러리가 react-redux이다.

상태 관리를 하기위해 리덕스의 스토어에 상태를 저장하고, 액션을 디스패치하고, 리듀서를 통해 상태를 업데이트하는 것이 리덕스의 전체적인 멘탈 모델이다.

## 리덕스 미들웨어

미들웨어는 액션이 디스패치되어서 이를 리듀서에서 처리하기 전에 설정할 수 있는 작업이다. 전달받은 액션을 콘솔에 기록할 수도 있고, 전달받은 액션에 기반하여 액션을 아예 취소시켜버리거나 다른 종류들의 액션들을 추가적으로 디스패치할 수도 있다.

미들웨어는 결국 액션이 리듀서에 도착하기전에 인터셉트하여 리듀서에 액션이 도달하지 못하게끔 컨트롤할 수 있다.

리덕스에서 비동기 작업을 처리할 때 사용되는 미들웨어로는 redux-thunk, redux-saga, redux-promise, redux-pender등이 존재한다.

### 왜 비동기 요청은 리덕스 애플리케이션을 부수는가

```ts
export const fetchPosts = async () => {
  const response = await axios.get('https://jsonplaceholder.typicode.com/posts');

  return {
    type: 'FETCH_POSTS',
    payload: response.data,
  };
};
```

예시의 액션 생성자 함수는 type 속성을 갖는 객체를 반환한다. 바벨을 통해서 위 코드를 트랜스파일링한 코드의 일부분을 확인해보자.

```ts
export var fetchPosts = /*#__PURE__*/ (function () {
  var _ref = _asyncToGenerator(
    /*#__PURE__*/ _regeneratorRuntime().mark(function _callee() {
      var response;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1)
          switch ((_context.prev = _context.next)) {
            case 0:
              _context.next = 2;
              return axios.get('https://jsonplaceholder.typicode.com/posts');
            case 2:
              response = _context.sent;
              return _context.abrupt('return', {
                type: 'FETCH_POSTS',
                payload: response.data,
              });
            case 4:
            case 'end':
              return _context.stop();
          }
      }, _callee);
    }),
  );
  return function fetchPosts() {
    return _ref.apply(this, arguments);
  };
})();
```

위 코드에서 case 2인 경우 액션 객체를 리턴하는 것처럼 보이지만 다른 케이스의 경우 액션 객체를 리턴하고 있지 않다.
비동기 요청을 한 후 액션 객체를 리턴하는 것처럼 보이지만 실제로는 아닐 수도 있는 것이다.

만약 async / await 키워드를 지우면 어떻게 될까?

```ts
export const fetchPosts = () => {
  const promise = axios.get('https://jsonplaceholder.typicode.com/posts');

  return {
    type: 'FETCH_POSTS',
    payload: promise,
  };
};
```

위 처럼 promise 객체를 반환할 수 있지만 데이터 fetching이 끝나지 않은 상태에서 액션을 리턴하고 있다.

이런 문제들을 해결하는 라이브러리가 redux-thunk이다.

redux-thunk는 액션 생성자 함수가 액션 객체를 리턴하는 것이 아닌, 함수를 리턴할 수 있게 해준다.

thunk란 특정 작업을 나중에 하도록 미루기 위해서 함수 형태로 감싼 것을 지칭한다. 예를 들어서 1 + 2를 바로 하고 싶으면 아래와 같이 할 수 있다.

```ts
export const fetchPosts = () => async (dispatch, getState) => {
  const response = await axios.get('어쩌구저쩌구');
  dispatch({ type: 'FETCH_POSTS', payload: response.data });
};
```

이게 어떻게 비동기 요청을 해결할까?

단지 액션이 디스패치 되는 것을 멈출뿐이다.
