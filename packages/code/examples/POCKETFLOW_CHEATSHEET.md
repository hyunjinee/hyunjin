# Pocketflow 치트시트 🚀

## 📦 설치

```bash
pip install pocketflow>=0.0.3
# 또는
uv add pocketflow
```

---

## 🔥 기본 개념

### Node 생명주기

```
prep(shared) → exec(prep_res) → post(shared, prep_res, exec_res)
```

- **prep**: 준비 단계 (데이터 로딩)
- **exec**: 실행 단계 (비즈니스 로직)
- **post**: 후처리 (상태 업데이트, 다음 액션 결정)

---

## 📋 클래스 선택 가이드

```python
# 단일 작업
from pocketflow import Node

# 여러 아이템 순차 처리
from pocketflow import BatchNode

# 노드들을 순서대로 연결
from pocketflow import Flow

# 동일 플로우를 여러 파라미터로 반복
from pocketflow import BatchFlow

# 비동기 버전
from pocketflow import AsyncNode, AsyncBatchNode, AsyncParallelBatchNode
from pocketflow import AsyncFlow, AsyncBatchFlow, AsyncParallelBatchFlow
```

---

## 💡 기본 사용법

### 1. 간단한 Node

```python
from pocketflow import Node

class MyNode(Node):
    def prep(self, shared):
        # shared에서 데이터 가져오기
        return shared.get('input_data')

    def exec(self, prep_res):
        # 실제 작업 수행
        result = process(prep_res)
        return result

    def post(self, shared, prep_res, exec_res):
        # 결과를 shared에 저장
        shared['output'] = exec_res
        return "default"  # 다음 노드로의 액션

# 실행
shared = {'input_data': [1, 2, 3]}
node = MyNode()
node.run(shared)
print(shared['output'])
```

### 2. Retry가 있는 Node

```python
class RobustNode(Node):
    def __init__(self):
        super().__init__(
            max_retries=3,  # 최대 3번 재시도
            wait=2          # 재시도 간 2초 대기
        )

    def exec(self, prep_res):
        # 실패하면 자동으로 재시도
        return risky_operation()

    def exec_fallback(self, prep_res, exc):
        # 모든 재시도 실패 시
        return {"error": str(exc)}
```

### 3. BatchNode - 여러 아이템 처리

```python
from pocketflow import BatchNode

class ProcessMany(BatchNode):
    def prep(self, shared):
        # 처리할 아이템 리스트 반환
        return [1, 2, 3, 4, 5]

    def exec(self, item):
        # 각 아이템 개별 처리
        return item * 2

    def post(self, shared, prep_res, exec_res):
        # exec_res는 모든 결과의 리스트
        # [2, 4, 6, 8, 10]
        shared['results'] = exec_res
        return exec_res
```

### 4. Flow - 노드 연결

```python
from pocketflow import Flow

# 노드 생성
node1 = FetchNode()
node2 = ProcessNode()
node3 = SaveNode()

# Flow 구성
flow = Flow()

# 방법 1: >> 연산자
flow.start(node1) >> node2 >> node3

# 방법 2: next() 메서드
flow.start(node1)
node1.next(node2)
node2.next(node3)

# 실행
shared = {}
flow.run(shared)
```

### 5. 조건부 분기

```python
class CheckNode(Node):
    def post(self, shared, prep_res, exec_res):
        if exec_res > 100:
            return "high"
        else:
            return "low"

# Flow 구성
flow = Flow()
checker = CheckNode()
high_handler = HighNode()
low_handler = LowNode()

flow.start(checker)
checker - "high" >> high_handler
checker - "low" >> low_handler
```

### 6. BatchFlow - 플로우 반복

```python
from pocketflow import BatchFlow

class MyBatchFlow(BatchFlow):
    def prep(self, shared):
        # 각 실행에 대한 파라미터 리스트
        return [
            {'user_id': 1, 'name': 'Alice'},
            {'user_id': 2, 'name': 'Bob'},
        ]

class ProcessUserNode(Node):
    def prep(self, shared):
        # self.params에서 현재 파라미터 접근
        return self.params

    def exec(self, user_info):
        user_id = user_info['user_id']
        name = user_info['name']
        return f"Processed {name}"

# 사용
flow = MyBatchFlow()
flow.start(ProcessUserNode())
flow.run({})
# Alice와 Bob을 순차적으로 처리
```

---

## ⚡ Async 버전

### AsyncNode

```python
from pocketflow import AsyncNode
import asyncio

class MyAsyncNode(AsyncNode):
    async def prep_async(self, shared):
        return await load_data()

    async def exec_async(self, prep_res):
        return await async_process(prep_res)

    async def post_async(self, shared, prep_res, exec_res):
        shared['result'] = exec_res
        return "default"

# 실행
async def main():
    node = MyAsyncNode()
    shared = {}
    await node.run_async(shared)

asyncio.run(main())
```

### AsyncParallelBatchNode (병렬 처리)

```python
from pocketflow import AsyncParallelBatchNode

class ParallelAPIBatch(AsyncParallelBatchNode):
    async def prep_async(self, shared):
        # 병렬 처리할 URL 목록
        return ["url1", "url2", "url3"]

    async def exec_async(self, url):
        # 각 URL을 병렬로 호출
        return await fetch_url(url)

    async def post_async(self, shared, prep_res, exec_res):
        # 모든 병렬 요청 완료 후
        shared['all_results'] = exec_res
        return exec_res

# 3개 URL이 동시에 호출됨 (순차 X)
```

### AsyncParallelBatchFlow (병렬 플로우)

```python
from pocketflow import AsyncParallelBatchFlow

class ParallelUserFlow(AsyncParallelBatchFlow):
    async def prep_async(self, shared):
        return [
            {'user_id': 1},
            {'user_id': 2},
            {'user_id': 3},
        ]

flow = ParallelUserFlow()
flow.start(ProcessUserNode())
await flow.run_async({})
# 3명의 사용자를 병렬로 처리
```

---

## 🎯 연산자

| 연산자 | 사용법                      | 설명                     |
| ------ | --------------------------- | ------------------------ |
| `>>`   | `node1 >> node2`            | 순차 연결 (default 액션) |
| `-`    | `node - "action"`           | 특정 액션 지정           |
| 조합   | `node - "success" >> node2` | 조건부 연결              |

---

## 📊 성능 비교

### 순차 vs 병렬 (5개 아이템, 각 0.3초)

```python
# 순차: AsyncBatchNode
# 실행 시간: 1.5초 (0.3 × 5)

# 병렬: AsyncParallelBatchNode
# 실행 시간: 0.3초 (모두 동시 실행)
# 속도 향상: 5배
```

---

## 🔍 디버깅 팁

### 1. 현재 재시도 횟수 확인

```python
class DebugNode(Node):
    def exec(self, prep_res):
        print(f"Retry attempt: {self.cur_retry}")
        return do_something()
```

### 2. Shared State 추적

```python
def post(self, shared, prep_res, exec_res):
    print(f"Current shared state: {shared}")
    return "default"
```

### 3. Flow 경로 추적

```python
class TrackedNode(Node):
    def post(self, shared, prep_res, exec_res):
        action = determine_action(exec_res)
        print(f"Taking action: {action}")
        return action
```

---

## 📝 실전 패턴

### RAG 패턴

```python
class RetrieveNode(Node):
    def exec(self, query):
        docs = vector_search(query)
        return docs

    def post(self, shared, prep_res, exec_res):
        shared['docs'] = exec_res
        return "found" if exec_res else "not_found"

class GenerateWithContext(Node):
    def prep(self, shared):
        return {'query': shared['query'], 'docs': shared['docs']}

    def exec(self, prep_res):
        return llm_generate(prep_res['query'], prep_res['docs'])

# Flow
flow = Flow()
retrieve = RetrieveNode()
flow.start(retrieve)
retrieve - "found" >> GenerateWithContext()
retrieve - "not_found" >> GenerateWithoutContext()
```

### ETL 패턴

```python
# Extract
class ExtractNode(Node):
    def exec(self, prep_res):
        return load_from_source()

# Transform
class TransformNode(BatchNode):
    def prep(self, shared):
        return shared['raw_data']

    def exec(self, item):
        return transform_item(item)

# Load
class LoadNode(BatchNode):
    def prep(self, shared):
        return shared['transformed_data']

    def exec(self, item):
        save_to_db(item)

# Pipeline
flow = Flow()
flow.start(ExtractNode()) >> TransformNode() >> LoadNode()
```

### API 오케스트레이션

```python
class APINode(AsyncNode):
    def __init__(self, endpoint):
        super().__init__(max_retries=3, wait=1)
        self.endpoint = endpoint

    async def exec_async(self, prep_res):
        return await call_api(self.endpoint, prep_res)

# 여러 API 순차 호출
flow = AsyncFlow()
flow.start(APINode("/auth")) >> APINode("/user") >> APINode("/data")
```

---

## 🚨 주의사항

1. **AsyncNode에서는 `run()` 대신 `run_async()` 사용**

   ```python
   # ❌ 잘못됨
   node.run(shared)

   # ✅ 올바름
   await node.run_async(shared)
   ```

2. **Flow에서 Node를 직접 실행하면 경고 발생**

   ```python
   node = MyNode()
   node.next(NextNode())
   node.run(shared)  # ⚠️ 경고: successors가 실행되지 않음
   ```

3. **post()의 반환값이 다음 액션을 결정**
   ```python
   def post(self, shared, prep_res, exec_res):
       return "default"  # 반드시 문자열 반환
   ```

---

## 🎓 학습 순서

1. ✅ **기본 Node** - `pocketflow_tutorial.py` 예제 1-3
2. ✅ **Flow와 연결** - `pocketflow_tutorial.py` 예제 4-6
3. ✅ **AsyncNode** - `pocketflow_async_examples.py` 예제 1
4. ✅ **Parallel vs Sequential** - `pocketflow_async_examples.py` 예제 8
5. ✅ **실전 패턴** - 위의 실전 패턴 참고

---

## 📚 더 알아보기

- 상세 가이드: `POCKETFLOW_GUIDE.md`
- 동기 예제: `pocketflow_tutorial.py`
- 비동기 예제: `pocketflow_async_examples.py`
- 논문: https://arxiv.org/abs/2504.03771
