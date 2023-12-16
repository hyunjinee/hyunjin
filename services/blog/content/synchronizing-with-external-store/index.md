---
title: Concurrent Mode에서 외부 시스템과의 동기화
emoji: ''
date: '2023-07-26'
author: 이현진
tags: React
categories: 블로그
---

![](https://velog.velcdn.com/images/hyunjine/post/8467f9c3-907c-41ba-920d-735f88f88e6b/image.png)

리액트에서 외부 시스템과 동기화할 때 useEffect라는 훅을 사용합니다.

리액트에서 *Effect*란 컴포넌트의 **렌더링 자체로 발생하는 부작용을 표현하기 위함**입니다. 따라서 컴포넌트의 렌더링 이후 화면이 업데이트 된 후에 발생합니다.([After commit phase](https://velog.io/@hyunjine/%EB%A6%AC%EC%95%A1%ED%8A%B8-%EB%A0%8C%EB%8D%94%EB%A7%81%EC%97%90-%EB%8C%80%ED%95%9C-%EC%9D%B4%ED%95%B4#render-phase%EC%99%80-commit-phase))

이런 특성을 사용한다면 리액트 외부에 있는 스토어와 동기화하는데 사용할 수 있습니다.
Redux와 비슷한 방식으로 스토어를 만들어서 useEffect를 사용해 외부 시스템과 동기화해보도록 하겠습니다.

아래 예제에서는 Store의 count 변수를 setInterval를 사용하여 1초마다 1씩 증가하도록 dispatch하고 이를 구독하는 Counter 컴포넌트를 만들어봅니다.([Full Code](https://codesandbox.io/p/sandbox/redux-like-store-xqvsg9?file=%2Fsrc%2FApp.tsx%3A1%2C1))

```typescript
const store = {
  state: { count: 0 },
  listeners: new Set<() => void>(),
  subscribe: (callback: () => void) => {
    store.listeners.add(callback);
    return () => {
      store.listeners.delete(callback);
    };
  },
};

export const dispatch = (action: { type: string }) => {
  if (action.type === 'increment') {
    store.state = { count: store.state.count + 1 };
  }

  store.listeners.forEach((listener) => listener());
};

export const useStore = () => {
  const [state, setState] = useState(store.state);
  useEffect(() => {
    const handleChange = () => setState(store.state);
    const unsubscribe = store.subscribe(handleChange);
    return unsubscribe;
  }, []);

  return state;
};
```

<iframe style="border: 1px solid rgba(0, 0, 0, 0.1);border-radius:2px;" width="800" height="450" src="https://codesandbox.io/p/sandbox/redux-like-store-xqvsg9?file=%2Fsrc%2Fmain.tsx%3A9%2C9&embed=1" allowfullscreen></iframe>

![](https://velog.velcdn.com/images/hyunjine/post/b1ce3aba-644c-4a9b-83fb-08f54b1b12a6/image.png)

<br/>

Redux는 [Flux 패턴](https://velog.io/@hyunjine/Flux)을 따르므로 View 또는 외부로부터 들어온 Action을 Dispatch 할 수 있도록 하였고 Store를 객체 형태로 정의했습니다. 그리고 이 Store를 컴포넌트에서 사용할 수 있도록 useStore라는 훅을 사용해서 외부 시스템(Store)으로 부터 상태를 동기화했습니다. Codesandbox를 보면 상태값을 잘 구독하고 있는 것을 볼 수 있습니다.

## Synchronous Rendering

동시성 기능을 사용하지 않으면 이렇게 스토어를 구독해도 상관없었습니다. 아래 그림은 동시성 기능을 사용하지 않은 Synchronous한 렌더링을 표현한 그림입니다.

![](https://velog.velcdn.com/images/hyunjine/post/d4074f12-2fb8-4b44-855c-11f64f777c01/image.png)
그림출처: [What is Tearing](https://github.com/reactwg/react-18/discussions/69)

첫번째 그림에서 리액트 트리 렌더링을 시작하게 되고 컴포넌트에서 외부 스토어로부터 데이터를 가져옵니다.(파란색) 두번째, 세번째 그림의 컴포넌트에서도 마찬가지로 외부 스토어로부터 데이터를 가져오고 렌더링은 계속 지속됩니다. 중요한 점은 렌더링을 멈출 수 없기 때문에 렌더링 도중에 스토어가 변경될 수 없다는 것입니다.

![](https://velog.velcdn.com/images/hyunjine/post/fdc43d28-52b4-4d05-9d6e-8cfc405e959a/image.png)

## Concurrent Rendering

반면에 동시성 기능을 적용한다면 렌더링이 중단될 수 있습니다. 렌더링의 중단은 애플리케이션의 반응성(responsiveness)을 높여줍니다. startTransition과 같은 API를 사용하여 타이핑, 유저의 클릭과 같이 반응성이 중요한 업데이트를 긴급한 업데이트(urgent updates)로 분류하고 이로 인한 전환 업데이트(transition updates)의 우선순위는 낮게 만들 수 있습니다.

![](https://velog.velcdn.com/images/hyunjine/post/4e821869-98a8-4579-baca-e64905c72cef/image.png)

위의 첫번째 그림에서 렌더링을 시작한 후 컴포넌트에서 외부 스토어의 값을 가져오고(파란색) 두번째 그림에서는 렌더링이 멈추고 유저의 상호작용에 의해서 스토어가 업데이트됩니다. 이 상태에서 다시 렌더링이 진행되면 스토어의 값이 달라져있기(빨간색) 때문에 세번째 그림처럼 다른 값을 가져오게됩니다.

![](https://velog.velcdn.com/images/hyunjine/post/91cc921c-9ef7-42c1-a1f6-1594a2f0e03d/image.png)

이 상황에서 아직 마무리하지 못한 렌더링이 다시 진행된다면 나머지 부분에서 바뀐 스토어의 값을 가져올 수 있습니다. 이렇게되면 렌더링 중에 스토어에 있는 값이 바뀌어서 UI의 한 곳에는 스토어가 업데이트되기 이전 값을 다른 한 곳에는 스토어가 업데이트된 이후의 값을 표시하게될 수 있는데 **Tearing**이라고 표현합니다.

![](https://velog.velcdn.com/images/hyunjine/post/8ddf11a6-627e-4366-aaca-f4c555b35201/image.png)

사진 출처: [위키피디아](https://en.wikipedia.org/wiki/Screen_tearing)

Tearing은 전통적으로 그래픽 프로그래밍에서 시각적 불일치를 나타내는 용어로 사용되었다고 합니다. 하지만 User Interface에서 Tearing이란 UI가 동일한 상태에 대해 다른 값을 표시하는 것을 의미합니다.

자바스크립트는 싱글 스레드이기 때문에 일반적으로 웹 개발에서는 이 문제가 발생하지 않습니다. 하지만 리액트에서는 동시성 기능을 도입하였고 이로 인해 startTransition이나 Suspense와 같은 동시성 기능을 사용할 때 Tearing이라는 문제가 발생할 수 있습니다.

이 글의 처음에 작성했던 코드를 리팩토링해서 Tearing이라는 문제를 발생시켜보겠습니다.

```tsx
setInterval(() => {
  dispatch({ type: "increment" });
}, 1000);

function Counter({ index }: { index: number }) {
  const store = useStore();
  const now = performance.now();
  while (performance.now() - now < 500) {
    // 무거운 계산
  }

... 생략

function App() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="App">
      <button
        onClick={() =>
          React.startTransition(() => {
            setIsOpen((prev) => !prev);
          })
        }
      >
        {isOpen ? "RESET" : "Tearing 확인하기"}
      </button>
      {isOpen && [...Array(5)].map((_, i) => <Counter key={i} index={i} />)}
    </div>
  );
}
```

<iframe style="border: 1px solid rgba(0, 0, 0, 0.1);border-radius:2px;" width="800" height="450" src="https://codesandbox.io/p/sandbox/tearing-example-tmj7l9?file=%2Fsrc%2FApp.tsx%3A21%2C7&embed=1" allowfullscreen></iframe>

동시성 기능을 사용하기 위해 startTransition API를 사용하였고, "Tearing 확인하기" 버튼을 클릭했을 때 Counter 컴포넌트는 무거운 계산을 포함하여 렌더링이 될 수 있게 했고 이와 동시에 1초마다 increment 액션이 dispatch 됩니다.(Counter 컴포넌트에 무거운 계산을 포함시킨 이유는 Counter 컴포넌트가 느리게 렌더링되도록 해서 렌더링되는동안 스토어의 값을 변화시키기 위함입니다.)

![](https://velog.velcdn.com/images/hyunjine/post/644cf1a1-842c-475c-81b5-fe4a331fedcd/image.png)

버튼을 누르면 위와 같이 렌더링 중간에 스토어의 값이 바뀌었기 때문에 UI에 상태가 다르게 표시되는 Tearing 현상이 발생하는 것을 확인할 수 있습니다.

![](https://velog.velcdn.com/images/hyunjine/post/9cc46b2e-09b7-47ac-b8f7-5bd5103a0737/image.png)

## 정리

위에서 발생한 Tearing 현상에 대해 정리해보겠습니다.

1. setIsOpen에 의한 렌더링은 startTransition으로 감싸져 있으므로 Concurrent 하게 렌더링된다. "Tearing 확인하기"버튼을 누르면 렌더링이 시작된다.
2. Count 컴포넌트가 렌더링되기 시작한다. 하지만 heavy한 연산이 내장되어 있기 때문에 천천히 렌더링된다.
3. 이 때 1초가 지나서 increment 액션이 디스패치된다. 렌더링을 잠시 멈추고 스토어의 값을 업데이트한다.
4. 렌더링이 다시 시작되고 나머지 Counter 컴포넌트를 렌더링한다.
5. 렌더링 중간에 스토어가 업데이트 되었기 때문에 Tearing 현상이 발생한다.

이렇게 이 글에서는 리액트에서 외부 시스템과 동기화하는 방법과 동시성 기능을 적용했을 때 UI의 시각적 불일치 현상인 Tearing 현상이 발생할 수 있다는 것을 알아봤습니다.

## Reference

- [Synchronizing with Effects](https://ko.react.dev/learn/synchronizing-with-effects)
- [What is tearing?](https://github.com/reactwg/react-18/discussions/69)
