# Pocketflow 완벽 가이드

## 📚 목차

1. [Pocketflow란?](#pocketflow란)
2. [핵심 개념](#핵심-개념)
3. [주요 클래스](#주요-클래스)
4. [내부 메서드 설명](#내부-메서드-설명)
5. [사용 패턴](#사용-패턴)
6. [Async 버전](#async-버전)

---

## Pocketflow란?

Pocketflow는 **복잡한 AI 시스템을 구조적으로 설계하고 관리**하기 위한 Python 프레임워크입니다.

### 주요 특징

- ✅ **모듈형 노드**: 엄격한 생명주기를 가진 독립적인 실행 단위
- ✅ **선언적 Flow**: 노드들을 연결하여 워크플로우 구성
- ✅ **계층적 중첩**: Flow를 Node처럼 사용 가능 (Flow-as-Node)
- ✅ **명시적 조건 로직**: 액션 기반 분기 처리
- ✅ **재시도 메커니즘**: 자동 retry 및 fallback 지원

---

## 핵심 개념

### 1. Node 생명주기

모든 Node는 다음 3단계 생명주기를 따릅니다:

```
prep() → exec() → post()
```

- **prep**: 실행 전 준비 (데이터 로딩, 설정 등)
- **exec**: 실제 실행 로직 (비즈니스 로직)
- **post**: 실행 후 처리 (상태 업데이트, 다음 액션 결정)

### 2. Shared State

모든 노드는 `shared` 딕셔너리를 통해 상태를 공유합니다:

```python
shared = {'user_id': 123}
node.run(shared)  # 노드 실행
# shared 딕셔너리가 업데이트됨
```

### 3. 액션 기반 분기

`post()` 메서드의 반환값에 따라 다음 노드를 결정합니다:

```python
def post(self, shared, prep_res, exec_res):
    if exec_res > 100:
        return "high"  # "high" 액션으로 등록된 노드로 이동
    else:
        return "low"   # "low" 액션으로 등록된 노드로 이동
```

---

## 주요 클래스

### 1. BaseNode

모든 노드의 기본 클래스입니다.

**주요 속성:**

- `params`: 노드 파라미터 딕셔너리
- `successors`: 액션별 다음 노드 매핑 `{action: node}`

**주요 메서드:**

- `set_params(params)`: 파라미터 설정
- `next(node, action="default")`: 다음 노드 등록
- `prep(shared)`: 준비 단계
- `exec(prep_res)`: 실행 단계
- `post(shared, prep_res, exec_res)`: 후처리 단계

### 2. Node

재시도 기능이 추가된 기본 노드입니다.

**생성자 파라미터:**

```python
Node(max_retries=1, wait=0)
```

- `max_retries`: 최대 재시도 횟수 (기본: 1)
- `wait`: 재시도 간 대기 시간(초) (기본: 0)

**추가 메서드:**

- `exec_fallback(prep_res, exc)`: 모든 재시도 실패 시 실행

**예제:**

```python
class APICallNode(Node):
    def __init__(self):
        super().__init__(max_retries=3, wait=2)  # 3번 재시도, 2초 대기

    def exec(self, prep_res):
        # API 호출 (실패하면 자동 재시도)
        return api_call()

    def exec_fallback(self, prep_res, exc):
        # 모든 재시도 실패 시
        return {"error": str(exc)}
```

### 3. BatchNode

여러 아이템을 일괄 처리하는 노드입니다.

**동작 방식:**

- `prep()`이 아이템 리스트를 반환
- 각 아이템에 대해 `exec()`를 순차적으로 실행
- `post()`가 모든 결과를 받아 처리

**예제:**

```python
class ImageProcessorBatch(BatchNode):
    def prep(self, shared):
        # 처리할 이미지 목록 반환
        return shared['image_paths']

    def exec(self, image_path):
        # 각 이미지를 개별 처리
        return process_image(image_path)

    def post(self, shared, prep_res, exec_res):
        # 모든 처리 결과 저장
        shared['processed_images'] = exec_res
        return exec_res
```

### 4. Flow

여러 노드를 연결하여 워크플로우를 구성합니다.

**주요 메서드:**

- `start(node)`: 시작 노드 설정
- `get_next_node(curr, action)`: 액션에 따른 다음 노드 반환

**노드 연결 방법:**

#### 방법 1: `>>` 연산자 (순차 연결)

```python
flow = Flow()
flow.start(node1) >> node2 >> node3
```

#### 방법 2: `next()` 메서드

```python
flow = Flow()
flow.start(node1)
node1.next(node2)
node2.next(node3)
```

#### 방법 3: 조건부 분기 (`-` 연산자)

```python
flow = Flow()
flow.start(node1) >> node2
node2 - "success" >> node3
node2 - "failure" >> node4
```

### 5. BatchFlow

여러 파라미터 세트로 동일한 플로우를 반복 실행합니다.

**동작 방식:**

- `prep()`이 파라미터 리스트를 반환
- 각 파라미터로 플로우를 순차 실행

**예제:**

```python
class MultiUserFlow(BatchFlow):
    def prep(self, shared):
        # 각 사용자에 대한 파라미터
        return [
            {'user_id': 1, 'name': 'Alice'},
            {'user_id': 2, 'name': 'Bob'},
            {'user_id': 3, 'name': 'Charlie'},
        ]

class ProcessUserNode(Node):
    def prep(self, shared):
        # self.params에서 현재 사용자 파라미터 접근
        return self.params

    def exec(self, prep_res):
        user_id = prep_res['user_id']
        name = prep_res['name']
        print(f"Processing user {user_id}: {name}")
        return {"processed": True}

# 사용
flow = MultiUserFlow()
flow.start(ProcessUserNode())
flow.run({})
# Output:
# Processing user 1: Alice
# Processing user 2: Bob
# Processing user 3: Charlie
```

---

## 내부 메서드 설명

### BaseNode 내부 메서드

#### `_run(shared)`

노드 실행의 핵심 메서드입니다.

```python
def _run(self, shared):
    p = self.prep(shared)      # 1. 준비
    e = self._exec(p)          # 2. 실행
    return self.post(shared, p, e)  # 3. 후처리
```

#### `_exec(prep_res)`

실제 실행 로직을 호출합니다. 재시도가 필요한 경우 오버라이드됩니다.

```python
# BaseNode
def _exec(self, prep_res):
    return self.exec(prep_res)

# Node (재시도 포함)
def _exec(self, prep_res):
    for self.cur_retry in range(self.max_retries):
        try:
            return self.exec(prep_res)
        except Exception as e:
            if self.cur_retry == self.max_retries - 1:
                return self.exec_fallback(prep_res, e)
            if self.wait > 0:
                time.sleep(self.wait)
```

### Flow 내부 메서드

#### `_orch(shared, params=None)`

플로우 오케스트레이션의 핵심 메서드입니다.

```python
def _orch(self, shared, params=None):
    curr = copy.copy(self.start_node)
    p = params or {**self.params}
    last_action = None

    while curr:
        curr.set_params(p)          # 파라미터 설정
        last_action = curr._run(shared)  # 노드 실행
        curr = copy.copy(self.get_next_node(curr, last_action))  # 다음 노드

    return last_action
```

**주요 동작:**

1. 시작 노드부터 시작
2. 현재 노드 실행
3. 반환된 액션으로 다음 노드 결정
4. 다음 노드가 없을 때까지 반복

---

## 사용 패턴

### 패턴 1: 선형 파이프라인

```python
class FetchNode(Node):
    def exec(self, prep_res):
        return fetch_data()

class TransformNode(Node):
    def prep(self, shared):
        return shared['data']

    def exec(self, data):
        return transform(data)

    def post(self, shared, prep_res, exec_res):
        shared['transformed'] = exec_res
        return "default"

class SaveNode(Node):
    def prep(self, shared):
        return shared['transformed']

    def exec(self, data):
        save_to_db(data)

# Flow 구성
flow = Flow()
flow.start(FetchNode()) >> TransformNode() >> SaveNode()
flow.run({})
```

### 패턴 2: 조건부 분기

```python
class ValidationNode(Node):
    def exec(self, prep_res):
        if validate(prep_res):
            return "valid"
        return "invalid"

    def post(self, shared, prep_res, exec_res):
        return exec_res  # "valid" 또는 "invalid" 반환

class ProcessValidNode(Node):
    def exec(self, prep_res):
        print("유효한 데이터 처리")

class ProcessInvalidNode(Node):
    def exec(self, prep_res):
        print("유효하지 않은 데이터 처리")

# Flow 구성
flow = Flow()
validator = ValidationNode()
flow.start(validator)
validator - "valid" >> ProcessValidNode()
validator - "invalid" >> ProcessInvalidNode()
```

### 패턴 3: 재시도 + Fallback

```python
class ResilientAPINode(Node):
    def __init__(self):
        super().__init__(max_retries=5, wait=2)

    def exec(self, prep_res):
        # API 호출 (실패하면 2초 후 재시도, 최대 5번)
        response = call_external_api()
        if not response.ok:
            raise Exception("API 호출 실패")
        return response.json()

    def exec_fallback(self, prep_res, exc):
        # 5번 모두 실패한 경우
        logger.error(f"API 완전 실패: {exc}")
        return {"error": "API unavailable", "cached": get_cached_data()}
```

### 패턴 4: 배치 처리

```python
class FileProcessorBatch(BatchNode):
    def __init__(self):
        super().__init__(max_retries=3)  # 각 파일당 3번 재시도

    def prep(self, shared):
        # 처리할 파일 목록
        return glob.glob("data/*.csv")

    def exec(self, file_path):
        # 각 파일 개별 처리 (실패하면 재시도)
        return process_csv(file_path)

    def exec_fallback(self, prep_res, exc):
        # 특정 파일 처리 실패
        return {"file": prep_res, "error": str(exc)}

    def post(self, shared, prep_res, exec_res):
        # 모든 파일 처리 결과
        shared['results'] = exec_res
        return exec_res
```

### 패턴 5: 복잡한 워크플로우

```python
# RAG (Retrieval-Augmented Generation) 예제

class RetrieveNode(Node):
    def exec(self, query):
        docs = vector_search(query)
        return docs

    def post(self, shared, prep_res, exec_res):
        shared['retrieved_docs'] = exec_res
        if len(exec_res) > 0:
            return "found"
        return "not_found"

class GenerateWithContextNode(Node):
    def prep(self, shared):
        return {
            'query': shared['query'],
            'context': shared['retrieved_docs']
        }

    def exec(self, prep_res):
        return llm_generate(prep_res['query'], prep_res['context'])

class GenerateWithoutContextNode(Node):
    def prep(self, shared):
        return shared['query']

    def exec(self, query):
        return llm_generate(query)

# Flow 구성
flow = Flow()
retrieve = RetrieveNode()
flow.start(retrieve)
retrieve - "found" >> GenerateWithContextNode()
retrieve - "not_found" >> GenerateWithoutContextNode()

shared = {'query': '파이썬이란?'}
result = flow.run(shared)
```

---

## Async 버전

Pocketflow는 모든 클래스의 비동기 버전을 제공합니다.

### 주요 Async 클래스

- `AsyncNode`: 비동기 Node
- `AsyncBatchNode`: 순차 배치 (각 아이템을 순차적으로 await)
- `AsyncParallelBatchNode`: 병렬 배치 (모든 아이템을 동시에 await)
- `AsyncFlow`: 비동기 Flow
- `AsyncBatchFlow`: 순차 배치 Flow
- `AsyncParallelBatchFlow`: 병렬 배치 Flow

### AsyncNode 사용법

```python
from pocketflow import AsyncNode, AsyncFlow
import asyncio

class AsyncAPINode(AsyncNode):
    def __init__(self):
        super().__init__(max_retries=3, wait=1)

    async def prep_async(self, shared):
        """비동기 준비"""
        return await load_config()

    async def exec_async(self, prep_res):
        """비동기 실행"""
        async with httpx.AsyncClient() as client:
            response = await client.get("https://api.example.com")
            return response.json()

    async def exec_fallback_async(self, prep_res, exc):
        """비동기 폴백"""
        return {"error": str(exc)}

    async def post_async(self, shared, prep_res, exec_res):
        """비동기 후처리"""
        shared['api_result'] = exec_res
        return "default"

# 실행
async def main():
    node = AsyncAPINode()
    shared = {}
    result = await node.run_async(shared)
    print(result)

asyncio.run(main())
```

### AsyncParallelBatchNode 예제

```python
from pocketflow import AsyncParallelBatchNode

class ParallelAPIBatch(AsyncParallelBatchNode):
    async def prep_async(self, shared):
        # 병렬 처리할 URL 목록
        return [
            "https://api.example.com/1",
            "https://api.example.com/2",
            "https://api.example.com/3",
        ]

    async def exec_async(self, url):
        # 각 URL을 병렬로 호출
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            return response.json()

    async def post_async(self, shared, prep_res, exec_res):
        # 모든 병렬 요청 완료 후
        shared['results'] = exec_res
        return exec_res

# 실행
async def main():
    node = ParallelAPIBatch()
    shared = {}
    results = await node.run_async(shared)
    print(results)  # 3개 API 호출이 병렬로 실행됨

asyncio.run(main())
```

---

## 고급 패턴

### Flow-as-Node (플로우를 노드처럼 사용)

```python
# 서브 플로우 정의
data_processing_flow = Flow()
data_processing_flow.start(LoadNode()) >> CleanNode() >> TransformNode()

# 메인 플로우에서 서브 플로우를 노드처럼 사용
main_flow = Flow()
main_flow.start(FetchNode()) >> data_processing_flow >> SaveNode()
```

### 동적 파라미터 전달

```python
class ParameterizedNode(Node):
    def prep(self, shared):
        # self.params에서 동적으로 전달된 파라미터 사용
        threshold = self.params.get('threshold', 0.5)
        return {'threshold': threshold, 'data': shared['data']}

    def exec(self, prep_res):
        threshold = prep_res['threshold']
        data = prep_res['data']
        return [x for x in data if x > threshold]

# 사용
flow = Flow()
flow.set_params({'threshold': 0.8})  # 플로우 레벨 파라미터
flow.start(ParameterizedNode())
```

---

## 요약

### 언제 어떤 클래스를 사용할까?

| 상황                               | 사용할 클래스            |
| ---------------------------------- | ------------------------ |
| 단일 작업 수행                     | `Node`                   |
| 여러 아이템 순차 처리              | `BatchNode`              |
| 여러 작업을 순서대로 연결          | `Flow`                   |
| 동일 플로우를 여러 파라미터로 반복 | `BatchFlow`              |
| 비동기 작업                        | `AsyncNode`, `AsyncFlow` |
| 여러 아이템 병렬 처리              | `AsyncParallelBatchNode` |
| 여러 플로우 병렬 실행              | `AsyncParallelBatchFlow` |

### 핵심 메서드

| 메서드                             | 목적                     | 반환값                    |
| ---------------------------------- | ------------------------ | ------------------------- |
| `prep(shared)`                     | 실행 전 준비             | exec()에 전달될 데이터    |
| `exec(prep_res)`                   | 실제 비즈니스 로직       | post()에 전달될 결과      |
| `post(shared, prep_res, exec_res)` | 후처리 및 다음 액션 결정 | 다음 노드로의 액션 문자열 |
| `exec_fallback(prep_res, exc)`     | 재시도 실패 시 폴백      | 대체 결과                 |

### 연산자

| 연산자 | 사용법                       | 의미                                   |
| ------ | ---------------------------- | -------------------------------------- |
| `>>`   | `node1 >> node2`             | node1 다음에 node2 연결 (default 액션) |
| `-`    | `node - "action"`            | 특정 액션 지정                         |
| 조합   | `node1 - "success" >> node2` | node1의 "success" 액션을 node2로 연결  |

---

## 참고 자료

- arXiv 논문: [Pocketflow: A Framework for Designing Complex AI Systems](https://arxiv.org/abs/2504.03771)
- 소스 코드: 매우 간결하고 읽기 쉬운 구현 (~100줄)
