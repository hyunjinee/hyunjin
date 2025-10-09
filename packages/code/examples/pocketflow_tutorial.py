"""
Pocketflow 사용 예제 및 설명
"""
from pocketflow import Node, BatchNode, Flow, BatchFlow

# ========================================
# 1. 기본 Node 사용법
# ========================================

class SimpleNode(Node):
    """가장 기본적인 Node 예제"""
    
    def prep(self, shared):
        """실행 전 준비 단계 - shared state에서 데이터를 가져올 수 있음"""
        print(f"Prep: {shared.get('name', 'Unknown')}")
        return {"data": "prepared"}
    
    def exec(self, prep_res):
        """실제 실행 로직 - prep의 결과를 받아서 처리"""
        print(f"Exec: {prep_res}")
        return {"result": "executed"}
    
    def post(self, shared, prep_res, exec_res):
        """실행 후 처리 - shared state를 업데이트하거나 결과를 반환"""
        shared['output'] = exec_res
        print(f"Post: {exec_res}")
        return "success"


# ========================================
# 2. Retry 기능이 있는 Node
# ========================================

class RetryNode(Node):
    """실패 시 재시도하는 Node"""
    
    def __init__(self):
        # max_retries: 최대 재시도 횟수, wait: 재시도 간 대기 시간(초)
        super().__init__(max_retries=3, wait=1)
        self.attempt = 0
    
    def exec(self, prep_res):
        self.attempt += 1
        print(f"Attempt {self.attempt}")
        
        if self.attempt < 3:
            raise Exception("일부러 발생시킨 에러")
        
        return {"success": True}
    
    def exec_fallback(self, prep_res, exc):
        """모든 재시도 실패 시 실행되는 폴백 메서드"""
        print(f"모든 재시도 실패: {exc}")
        return {"success": False, "error": str(exc)}


# ========================================
# 3. BatchNode - 여러 아이템을 일괄 처리
# ========================================

class DataProcessor(BatchNode):
    """여러 데이터를 순차적으로 처리하는 BatchNode"""
    
    def prep(self, shared):
        """처리할 아이템 리스트를 반환"""
        return [1, 2, 3, 4, 5]
    
    def exec(self, item):
        """각 아이템에 대해 개별적으로 실행됨"""
        result = item * 2
        print(f"Processing {item} -> {result}")
        return result
    
    def post(self, shared, prep_res, exec_res):
        """모든 아이템 처리 후 결과를 저장"""
        print(f"Batch results: {exec_res}")
        shared['batch_output'] = exec_res
        return exec_res


# ========================================
# 4. Flow - 노드들을 연결하여 워크플로우 구성
# ========================================

class FetchDataNode(Node):
    """데이터를 가져오는 노드"""
    
    def exec(self, prep_res):
        print("데이터 가져오기...")
        return {"data": [10, 20, 30]}
    
    def post(self, shared, prep_res, exec_res):
        shared['raw_data'] = exec_res['data']
        return "default"  # 다음 노드로 이동


class ProcessDataNode(Node):
    """데이터를 처리하는 노드"""
    
    def prep(self, shared):
        return shared.get('raw_data', [])
    
    def exec(self, prep_res):
        print(f"데이터 처리 중: {prep_res}")
        processed = [x * 2 for x in prep_res]
        return {"processed": processed}
    
    def post(self, shared, prep_res, exec_res):
        shared['processed_data'] = exec_res['processed']
        
        # 조건부 분기 예제
        if sum(exec_res['processed']) > 100:
            return "high_value"
        else:
            return "low_value"


class HighValueNode(Node):
    """높은 값일 때 실행되는 노드"""
    
    def exec(self, prep_res):
        print("높은 값 처리!")
        return "high"


class LowValueNode(Node):
    """낮은 값일 때 실행되는 노드"""
    
    def exec(self, prep_res):
        print("낮은 값 처리!")
        return "low"


# ========================================
# 5. BatchFlow - 여러 파라미터로 Flow를 반복 실행
# ========================================

class ItemProcessorNode(Node):
    """파라미터를 받아서 처리하는 노드"""
    
    def prep(self, shared):
        # self.params에서 현재 배치의 파라미터를 가져올 수 있음
        return self.params
    
    def exec(self, prep_res):
        item_id = prep_res.get('id')
        value = prep_res.get('value', 0)
        result = value ** 2
        print(f"Item {item_id}: {value}^2 = {result}")
        return result


# ========================================
# 실행 예제
# ========================================

if __name__ == "__main__":
    print("=" * 50)
    print("1. 기본 Node 실행")
    print("=" * 50)
    node = SimpleNode()
    shared = {'name': 'Test'}
    result = node.run(shared)
    print(f"Result: {result}\n")
    
    print("=" * 50)
    print("2. Retry Node 실행")
    print("=" * 50)
    retry_node = RetryNode()
    retry_result = retry_node.run({})
    print(f"Result: {retry_result}\n")
    
    print("=" * 50)
    print("3. BatchNode 실행")
    print("=" * 50)
    batch_node = DataProcessor()
    batch_shared = {}
    batch_result = batch_node.run(batch_shared)
    print(f"Result: {batch_result}\n")
    
    print("=" * 50)
    print("4. Flow 실행 (조건부 분기)")
    print("=" * 50)
    
    # Flow 구성: >> 연산자로 노드를 연결
    fetch = FetchDataNode()
    process = ProcessDataNode()
    high_node = HighValueNode()
    low_node = LowValueNode()
    
    # 조건부 분기 설정
    # process - "high_value" >> high_node
    # process - "low_value" >> low_node
    flow = Flow()
    flow.start(fetch) >> process
    process - "high_value" >> high_node
    process - "low_value" >> low_node
    
    flow_shared = {}
    flow_result = flow.run(flow_shared)
    print(f"Flow Result: {flow_result}")
    print(f"Shared State: {flow_shared}\n")
    
    print("=" * 50)
    print("5. BatchFlow 실행")
    print("=" * 50)
    
    # BatchFlow는 prep에서 파라미터 리스트를 반환하고
    # 각 파라미터로 플로우를 반복 실행
    class BatchItemFlow(BatchFlow):
        def prep(self, shared):
            # 각 아이템에 대한 파라미터 리스트
            return [
                {'id': 1, 'value': 10},
                {'id': 2, 'value': 20},
                {'id': 3, 'value': 30},
            ]
    
    batch_flow = BatchItemFlow()
    batch_flow.start(ItemProcessorNode())
    
    batch_flow_shared = {}
    batch_flow.run(batch_flow_shared)
    print()
    
    print("=" * 50)
    print("6. 연산자를 이용한 간편한 Flow 구성")
    print("=" * 50)
    
    # >> 연산자로 순차 연결
    n1 = SimpleNode()
    n2 = SimpleNode()
    n3 = SimpleNode()
    
    simple_flow = Flow()
    simple_flow.start(n1) >> n2 >> n3
    
    simple_shared = {'name': 'Chain'}
    simple_flow.run(simple_shared)

