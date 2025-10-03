# 개발 가이드

## 환경 설정

**요구사항**: Python 3.10+

### uv 설치

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### 프로젝트 설정

```bash
# 저장소 클론
git clone <repository-url>
cd resume-extract-py

# 개발 환경 설정
make dev-setup

# 또는 수동으로
uv sync --dev
uv run pre-commit install
```

## 개발 워크플로우

### 1. 의존성 관리

```bash
# 새 의존성 추가
uv add requests

# 개발 의존성 추가
uv add --dev pytest

# 의존성 제거
uv remove package-name

# 락파일 업데이트
uv lock

# 의존성 동기화
uv sync
```

### 2. 코드 작성

```bash
# 가상환경 활성화
uv shell

# 또는 uv run으로 직접 실행
uv run python script.py
```

### 3. 테스트

```bash
# 모든 테스트 실행
make test

# 특정 테스트 파일
uv run pytest tests/test_models.py

# 특정 테스트 함수
uv run pytest tests/test_models.py::TestContactInfo::test_contact_info_creation

# 커버리지 포함
make test-cov
```

### 4. 코드 품질

```bash
# 포맷팅
make format

# 린팅
make lint

# 포맷 확인
make format-check
```

### 5. 빌드 및 배포

```bash
# 빌드
make build

# 로컬 설치 테스트
uv pip install dist/*.whl

# PyPI 배포
make publish
```

## 프로젝트 구조

```
resume-extract-py/
├── src/resume_extract/          # 메인 라이브러리
│   ├── __init__.py             # 패키지 초기화
│   ├── models.py               # 데이터 모델
│   ├── exceptions.py           # 예외 클래스
│   ├── parsers.py              # 파일 파서
│   ├── downloader.py           # URL 다운로더
│   ├── langextract_integration.py  # LangExtract 통합
│   └── extractor.py            # 메인 추출기
├── tests/                      # 테스트
├── examples/                   # 사용 예제
├── pyproject.toml              # 프로젝트 설정
├── uv.lock                     # 락파일
├── Makefile                    # 개발 도구
└── README.md                   # 문서
```

## 새 기능 추가

### 1. 새 파일 형식 지원

1. `parsers.py`에 새 파서 메서드 추가
2. `downloader.py`에 지원 형식 추가
3. 테스트 추가
4. 문서 업데이트

### 2. 새 추출 필드 추가

1. `models.py`에 데이터 모델 수정
2. `langextract_integration.py`에 추출 로직 추가
3. 테스트 추가
4. 문서 업데이트

## 테스트 가이드

### 테스트 작성 원칙

- 각 클래스/함수마다 테스트 클래스 작성
- 정상 케이스와 예외 케이스 모두 테스트
- Mock을 사용하여 외부 의존성 격리
- 실제 API 호출은 통합 테스트에서만

### Mock 사용 예제

```python
from unittest.mock import Mock, patch

@patch('resume_extract.langextract_integration.lx')
def test_extraction(self, mock_lx):
    # LangExtract 모킹
    mock_result = Mock()
    mock_result.extractions = [...]
    mock_lx.extract.return_value = mock_result

    # 테스트 실행
    processor = LangExtractProcessor(api_key="test")
    result = processor.extract_resume_info("test text")

    # 검증
    assert result.name == "expected_name"
```

## 성능 최적화

### 1. 프로파일링

```bash
# 프로파일링 실행
uv run python -m cProfile -o profile.stats script.py

# 결과 분석
uv run python -c "import pstats; pstats.Stats('profile.stats').sort_stats('cumtime').print_stats(10)"
```

### 2. 메모리 사용량 확인

```bash
# 메모리 프로파일링
uv add --dev memory-profiler
uv run mprof run script.py
uv run mprof plot
```

## 릴리스 프로세스

### 1. 버전 업데이트

```bash
# pyproject.toml에서 version 필드 수정
version = "0.2.0"
```

### 2. 체인지로그 업데이트

```bash
# CHANGELOG.md에 변경사항 추가
```

### 3. 태그 및 릴리스

```bash
git add .
git commit -m "Release v0.2.0"
git tag v0.2.0
git push origin v0.2.0

# 빌드 및 배포
make build
make publish
```

## 문제 해결

### 일반적인 문제들

#### 1. LangExtract API 오류

- API 키 확인
- 네트워크 연결 확인
- 사용량 한도 확인

#### 2. 파일 파싱 오류

- 파일 형식 확인
- 파일 손상 여부 확인
- 인코딩 문제 확인

#### 3. 의존성 충돌

```bash
# 의존성 트리 확인
uv tree

# 충돌 해결
uv lock --upgrade
```

## 기여 가이드

1. 이슈 생성 또는 기존 이슈 확인
2. 브랜치 생성: `git checkout -b feature/new-feature`
3. 코드 작성 및 테스트
4. 코드 품질 검사: `make format lint test`
5. 커밋 및 푸시
6. Pull Request 생성

## 유용한 명령어

```bash
# 전체 개발 워크플로우
make dev-setup && make test && make lint && make build

# 패키지 정보 확인
uv run python -c "import resume_extract; print(resume_extract.__version__)"

# 의존성 그래프 시각화
uv tree

# 프로젝트 통계
find src -name "*.py" | xargs wc -l
```
