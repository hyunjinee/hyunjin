"""
Pocketflow Async 버전 사용 예제
"""
import asyncio
from pocketflow import (
    AsyncNode, 
    AsyncBatchNode, 
    AsyncParallelBatchNode,
    AsyncFlow,
    AsyncBatchFlow,
    AsyncParallelBatchFlow
)


# ========================================
# 1. AsyncNode - 기본 비동기 노드
# ========================================

class AsyncDataFetcher(AsyncNode):
    """비동기로 데이터를 가져오는 노드"""
    
    def __init__(self):
        super().__init__(max_retries=3, wait=1)
    
    async def prep_async(self, shared):
        """비동기 준비 단계"""
        print("Preparing async fetch...")
        await asyncio.sleep(0.1)
        return {"url": "https://api.example.com/data"}
    
    async def exec_async(self, prep_res):
        """비동기 실행 - API 호출 시뮬레이션"""
        url = prep_res['url']
        print(f"Fetching from {url}...")
        await asyncio.sleep(0.5)  # API 호출 시뮬레이션
        
        # 간단한 데이터 반환
        return {"data": [1, 2, 3, 4, 5]}
    
    async def exec_fallback_async(self, prep_res, exc):
        """재시도 실패 시"""
        print(f"Fetch failed: {exc}")
        return {"data": [], "error": str(exc)}
    
    async def post_async(self, shared, prep_res, exec_res):
        """후처리"""
        shared['fetched_data'] = exec_res['data']
        print(f"Fetched {len(exec_res['data'])} items")
        return "default"


# ========================================
# 2. AsyncBatchNode - 순차 배치 처리
# ========================================

class AsyncSequentialProcessor(AsyncBatchNode):
    """여러 아이템을 순차적으로 비동기 처리"""
    
    async def prep_async(self, shared):
        """처리할 아이템 목록"""
        return [1, 2, 3, 4, 5]
    
    async def exec_async(self, item):
        """각 아이템을 순차적으로 처리"""
        print(f"Processing item {item}...")
        await asyncio.sleep(0.3)  # 각 아이템 처리에 0.3초
        result = item ** 2
        print(f"Item {item} -> {result}")
        return result
    
    async def post_async(self, shared, prep_res, exec_res):
        """모든 처리 완료 후"""
        print(f"Sequential batch results: {exec_res}")
        shared['sequential_results'] = exec_res
        return exec_res


# ========================================
# 3. AsyncParallelBatchNode - 병렬 배치 처리
# ========================================

class AsyncParallelProcessor(AsyncParallelBatchNode):
    """여러 아이템을 병렬로 비동기 처리"""
    
    async def prep_async(self, shared):
        """처리할 아이템 목록"""
        return [1, 2, 3, 4, 5]
    
    async def exec_async(self, item):
        """각 아이템을 병렬로 처리"""
        print(f"Starting parallel processing of item {item}...")
        await asyncio.sleep(0.3)  # 모든 아이템이 동시에 처리됨
        result = item ** 2
        print(f"Parallel item {item} -> {result}")
        return result
    
    async def post_async(self, shared, prep_res, exec_res):
        """모든 병렬 처리 완료 후"""
        print(f"Parallel batch results: {exec_res}")
        shared['parallel_results'] = exec_res
        return exec_res


# ========================================
# 4. AsyncFlow - 비동기 플로우
# ========================================

class AsyncLoadNode(AsyncNode):
    """데이터 로드 노드"""
    
    async def exec_async(self, prep_res):
        print("Loading data asynchronously...")
        await asyncio.sleep(0.2)
        return {"data": list(range(10))}
    
    async def post_async(self, shared, prep_res, exec_res):
        shared['loaded_data'] = exec_res['data']
        return "default"


class AsyncFilterNode(AsyncNode):
    """데이터 필터링 노드"""
    
    async def prep_async(self, shared):
        return shared.get('loaded_data', [])
    
    async def exec_async(self, data):
        print(f"Filtering {len(data)} items...")
        await asyncio.sleep(0.2)
        # 짝수만 필터링
        filtered = [x for x in data if x % 2 == 0]
        return filtered
    
    async def post_async(self, shared, prep_res, exec_res):
        shared['filtered_data'] = exec_res
        
        # 조건부 분기
        if len(exec_res) > 3:
            return "many"
        else:
            return "few"


class AsyncProcessManyNode(AsyncNode):
    """많은 데이터 처리"""
    
    async def exec_async(self, prep_res):
        print("Processing many items...")
        await asyncio.sleep(0.2)
        return "processed_many"


class AsyncProcessFewNode(AsyncNode):
    """적은 데이터 처리"""
    
    async def exec_async(self, prep_res):
        print("Processing few items...")
        await asyncio.sleep(0.2)
        return "processed_few"


# ========================================
# 5. AsyncBatchFlow - 순차 배치 플로우
# ========================================

class AsyncUserProcessorNode(AsyncNode):
    """사용자별 처리 노드"""
    
    async def prep_async(self, shared):
        # self.params에서 현재 배치 파라미터 가져오기
        return self.params
    
    async def exec_async(self, prep_res):
        user_id = prep_res['user_id']
        name = prep_res['name']
        print(f"Processing user {user_id}: {name}")
        await asyncio.sleep(0.2)
        return {"user_id": user_id, "processed": True}
    
    async def post_async(self, shared, prep_res, exec_res):
        print(f"User {exec_res['user_id']} completed")
        return "default"


class AsyncUserBatchFlow(AsyncBatchFlow):
    """여러 사용자를 순차적으로 처리하는 플로우"""
    
    async def prep_async(self, shared):
        """각 사용자에 대한 파라미터 리스트"""
        return [
            {'user_id': 1, 'name': 'Alice'},
            {'user_id': 2, 'name': 'Bob'},
            {'user_id': 3, 'name': 'Charlie'},
        ]


# ========================================
# 6. AsyncParallelBatchFlow - 병렬 배치 플로우
# ========================================

class AsyncParallelUserBatchFlow(AsyncParallelBatchFlow):
    """여러 사용자를 병렬로 처리하는 플로우"""
    
    async def prep_async(self, shared):
        """각 사용자에 대한 파라미터 리스트"""
        return [
            {'user_id': 1, 'name': 'Alice'},
            {'user_id': 2, 'name': 'Bob'},
            {'user_id': 3, 'name': 'Charlie'},
        ]


# ========================================
# 7. 복잡한 비동기 워크플로우 예제
# ========================================

class AsyncAPICallNode(AsyncNode):
    """외부 API 호출 시뮬레이션"""
    
    def __init__(self, api_name, delay=0.5):
        super().__init__(max_retries=3, wait=0.5)
        self.api_name = api_name
        self.delay = delay
        self.call_count = 0
    
    async def exec_async(self, prep_res):
        self.call_count += 1
        print(f"Calling {self.api_name} API (attempt {self.call_count})...")
        
        await asyncio.sleep(self.delay)
        
        # 첫 번째 시도는 실패하도록 (재시도 테스트)
        if self.call_count == 1:
            raise Exception(f"{self.api_name} temporary failure")
        
        return {
            "api": self.api_name,
            "status": "success",
            "data": f"Data from {self.api_name}"
        }
    
    async def exec_fallback_async(self, prep_res, exc):
        print(f"{self.api_name} completely failed: {exc}")
        return {"api": self.api_name, "status": "failed", "error": str(exc)}
    
    async def post_async(self, shared, prep_res, exec_res):
        shared[f'{self.api_name}_result'] = exec_res
        
        if exec_res['status'] == 'success':
            return "success"
        return "failure"


# ========================================
# 실행 예제
# ========================================

async def example_1_async_node():
    """예제 1: 기본 AsyncNode"""
    print("=" * 60)
    print("예제 1: AsyncNode - 기본 비동기 노드")
    print("=" * 60)
    
    node = AsyncDataFetcher()
    shared = {}
    result = await node.run_async(shared)
    print(f"Result: {result}")
    print(f"Shared: {shared}\n")


async def example_2_sequential_batch():
    """예제 2: AsyncBatchNode - 순차 배치"""
    print("=" * 60)
    print("예제 2: AsyncBatchNode - 순차 배치 처리")
    print("=" * 60)
    
    import time
    start = time.time()
    
    node = AsyncSequentialProcessor()
    shared = {}
    result = await node.run_async(shared)
    
    elapsed = time.time() - start
    print(f"Result: {result}")
    print(f"Time: {elapsed:.2f}s (약 1.5초 - 5개 * 0.3초)\n")


async def example_3_parallel_batch():
    """예제 3: AsyncParallelBatchNode - 병렬 배치"""
    print("=" * 60)
    print("예제 3: AsyncParallelBatchNode - 병렬 배치 처리")
    print("=" * 60)
    
    import time
    start = time.time()
    
    node = AsyncParallelProcessor()
    shared = {}
    result = await node.run_async(shared)
    
    elapsed = time.time() - start
    print(f"Result: {result}")
    print(f"Time: {elapsed:.2f}s (약 0.3초 - 병렬 실행)\n")


async def example_4_async_flow():
    """예제 4: AsyncFlow - 조건부 분기"""
    print("=" * 60)
    print("예제 4: AsyncFlow - 비동기 플로우 (조건부 분기)")
    print("=" * 60)
    
    # Flow 구성
    load_node = AsyncLoadNode()
    filter_node = AsyncFilterNode()
    many_node = AsyncProcessManyNode()
    few_node = AsyncProcessFewNode()
    
    flow = AsyncFlow()
    flow.start(load_node) >> filter_node
    filter_node - "many" >> many_node
    filter_node - "few" >> few_node
    
    shared = {}
    result = await flow.run_async(shared)
    print(f"Result: {result}")
    print(f"Shared: {shared}\n")


async def example_5_sequential_batch_flow():
    """예제 5: AsyncBatchFlow - 순차 배치 플로우"""
    print("=" * 60)
    print("예제 5: AsyncBatchFlow - 순차 배치 플로우")
    print("=" * 60)
    
    import time
    start = time.time()
    
    flow = AsyncUserBatchFlow()
    flow.start(AsyncUserProcessorNode())
    
    shared = {}
    await flow.run_async(shared)
    
    elapsed = time.time() - start
    print(f"Time: {elapsed:.2f}s (약 0.6초 - 3명 순차)\n")


async def example_6_parallel_batch_flow():
    """예제 6: AsyncParallelBatchFlow - 병렬 배치 플로우"""
    print("=" * 60)
    print("예제 6: AsyncParallelBatchFlow - 병렬 배치 플로우")
    print("=" * 60)
    
    import time
    start = time.time()
    
    flow = AsyncParallelUserBatchFlow()
    flow.start(AsyncUserProcessorNode())
    
    shared = {}
    await flow.run_async(shared)
    
    elapsed = time.time() - start
    print(f"Time: {elapsed:.2f}s (약 0.2초 - 3명 병렬)\n")


async def example_7_complex_workflow():
    """예제 7: 복잡한 워크플로우 - 재시도 포함"""
    print("=" * 60)
    print("예제 7: 복잡한 비동기 워크플로우 (재시도 포함)")
    print("=" * 60)
    
    # 여러 API를 순차적으로 호출하는 플로우
    api1 = AsyncAPICallNode("WeatherAPI", delay=0.3)
    api2 = AsyncAPICallNode("GeoAPI", delay=0.2)
    
    flow = AsyncFlow()
    flow.start(api1) >> api2
    
    shared = {}
    result = await flow.run_async(shared)
    
    print(f"\nFinal Result: {result}")
    print(f"Shared State: {shared}\n")


async def example_8_performance_comparison():
    """예제 8: 순차 vs 병렬 성능 비교"""
    print("=" * 60)
    print("예제 8: 순차 vs 병렬 성능 비교")
    print("=" * 60)
    
    import time
    
    # 순차 처리
    print("\n[순차 처리]")
    start = time.time()
    seq_node = AsyncSequentialProcessor()
    await seq_node.run_async({})
    seq_time = time.time() - start
    
    # 병렬 처리
    print("\n[병렬 처리]")
    start = time.time()
    par_node = AsyncParallelProcessor()
    await par_node.run_async({})
    par_time = time.time() - start
    
    print(f"\n성능 비교:")
    print(f"  순차: {seq_time:.2f}초")
    print(f"  병렬: {par_time:.2f}초")
    print(f"  속도 향상: {seq_time/par_time:.1f}배\n")


async def main():
    """모든 예제 실행"""
    
    await example_1_async_node()
    await example_2_sequential_batch()
    await example_3_parallel_batch()
    await example_4_async_flow()
    await example_5_sequential_batch_flow()
    await example_6_parallel_batch_flow()
    await example_7_complex_workflow()
    await example_8_performance_comparison()
    
    print("=" * 60)
    print("모든 예제 완료!")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())

