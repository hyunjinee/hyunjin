# resume_extract

이력서 URL을 입력하면 정보를 추출하는 파이썬 라이브러리입니다. Google의 LangExtract를 활용하여 구조화된 정보 추출을 제공합니다.

**요구사항**: Python 3.10+

## 목차

- [resume\_extract](#resume_extract)
  - [목차](#목차)
  - [설치](#설치)
    - [uv 사용 (권장)](#uv-사용-권장)
    - [pip 사용](#pip-사용)
  - [환경 설정](#환경-설정)
  - [사용법](#사용법)
    - [기본 사용법](#기본-사용법)
    - [텍스트에서 직접 추출](#텍스트에서-직접-추출)
    - [편의 함수 사용](#편의-함수-사용)
    - [컨텍스트 매니저 사용](#컨텍스트-매니저-사용)
  - [지원 형식](#지원-형식)
  - [추출되는 정보](#추출되는-정보)
  - [개발 명령어](#개발-명령어)
    - [의존성 관리](#의존성-관리)
    - [테스트](#테스트)
    - [코드 품질](#코드-품질)
    - [빌드 및 배포](#빌드-및-배포)
    - [예제 실행](#예제-실행)
    - [실전 예제 (quick\_start.py)](#실전-예제-quick_startpy)
  - [설정 옵션](#설정-옵션)
  - [데이터 모델](#데이터-모델)
    - [JSON 출력 예제](#json-출력-예제)
  - [오류 처리](#오류-처리)
  - [성능 최적화](#성능-최적화)
  - [라이선스](#라이선스)

## 설치

### uv 사용 (권장)

```bash
uv add resume_extract
```

### pip 사용

```bash
pip install resume_extract
```

## 환경 설정

LangExtract API 키가 필요합니다:

```bash
# 환경변수 설정
export LANGEXTRACT_API_KEY="your-api-key-here"

# 또는 .env 파일에 추가
echo "LANGEXTRACT_API_KEY=your-api-key-here" > .env
```

## 사용법

### 기본 사용법

```python
from resume_extract import ResumeExtractor

# 추출기 초기화
extractor = ResumeExtractor()

# URL에서 이력서 정보 추출
result = extractor.extract_from_url("https://example.com/resume.pdf")

print(result.name)
print(result.contact.email)
print(result.skills)
print(result.experience)
```

### 텍스트에서 직접 추출

```python
# 텍스트 문자열에서 직접 추출
text = """
이현진
이메일: example@email.com
전화: 010-1234-5678
...
"""
result = extractor.extract_from_text(text)
```

### 편의 함수 사용

```python
from resume_extract import extract_from_url, extract_from_file, extract_from_text

# 간단한 한 줄 사용
result = extract_from_url("https://example.com/resume.pdf")
result = extract_from_file("./resume.pdf")
result = extract_from_text("이력서 텍스트 내용...")
```

### 컨텍스트 매니저 사용

```python
with ResumeExtractor() as extractor:
    result = extractor.extract_from_url("https://example.com/resume.pdf")
    # 자동으로 리소스 정리됨
```

## 지원 형식

- PDF 파일
- Word 문서 (.docx, .doc)
- HTML 웹페이지
- 일반 텍스트 파일

## 추출되는 정보

- 이름
- 연락처 (이메일, 전화번호, 주소, LinkedIn, GitHub)
- 기술/스킬
- 경력 사항
- 학력
- 프로젝트 경험
- 자격증

## 개발 명령어

### 의존성 관리

```bash
# 의존성 설치
make install

# 개발 의존성 포함 설치
make install-dev

# 의존성 추가
make add PACKAGE=package-name

# 개발 의존성 추가
make add-dev PACKAGE=package-name

# 락파일 업데이트
make lock
```

### 테스트

```bash
# 기본 테스트
make test

# 상세 테스트
make test-verbose

# 커버리지 포함 테스트
make test-cov
```

### 코드 품질

```bash
# 코드 포맷팅
make format

# 포맷 확인
make format-check

# 린팅
make lint
```

### 빌드 및 배포

```bash
# 빌드
make build

# 배포
make publish
```

### 예제 실행

```bash
# make 명령어로 실행
make example

# 또는 직접 실행
uv run python examples/quick_start.py

# 환경변수가 설정되어 있어야 합니다
export LANGEXTRACT_API_KEY="your-api-key-here"
```

### 실전 예제 (quick_start.py)

```python
#!/usr/bin/env python3
from resume_extract import ResumeExtractor

# 샘플 텍스트로 테스트
sample_text = """
이현진
이메일: leehj0110@kakao.com
전화: 010-1234-5678
주소: 서울특별시 강남구

## 경력
토스뱅크 - 소프트웨어 엔지니어 (2023.09 ~ 2024.04)
- React, Node.js를 이용한 웹 애플리케이션 개발

## 학력
충남대학교 컴퓨터공학과 학사 (2016.03 ~ 2020.02)

## 기술
JavaScript, React, Node.js, Python, AWS
"""

try:
    with ResumeExtractor() as extractor:
        result = extractor.extract_from_text(sample_text)

        print(f"👤 이름: {result.name or '미확인'}")
        print(f"📧 이메일: {result.contact.email or '미확인'}")
        print(f"📱 전화번호: {result.contact.phone or '미확인'}")
        print(f"🏠 주소: {result.contact.address or '미확인'}")

        if result.skills:
            print(f"🛠️  기술: {', '.join(result.skills)}")

        if result.experience:
            print(f"💼 경력: {len(result.experience)}개")
            for i, exp in enumerate(result.experience, 1):
                print(f"   {i}. {exp.company} - {exp.position}")

        print(f"📊 신뢰도: {result.confidence_score or 'N/A'}")

except Exception as e:
    print(f"❌ 오류 발생: {e}")
```

## 설정 옵션

```python
extractor = ResumeExtractor(
    langextract_api_key="your-key",        # API 키
    model_id="gemini-2.0-flash",           # 모델 선택
    max_file_size_mb=10,                   # 최대 파일 크기
    timeout=30,                            # 네트워크 타임아웃
    max_retries=3                          # 재시도 횟수
)
```

## 데이터 모델

추출된 정보는 구조화된 Pydantic 모델로 반환됩니다:

- `ResumeInfo`: 전체 이력서 정보
- `ContactInfo`: 연락처 정보
- `ExperienceInfo`: 경력 정보
- `EducationInfo`: 학력 정보
- `ProjectInfo`: 프로젝트 정보
- `CertificationInfo`: 자격증 정보

### JSON 출력 예제

```python
result = extractor.extract_from_url("https://example.com/resume.pdf")

# 딕셔너리로 변환
data = result.to_dict()

# JSON 문자열로 변환
json_str = result.to_json()
print(json_str)
```

## 오류 처리

```python
from resume_extract import (
    ResumeExtractor,
    InvalidURLError,
    UnsupportedFileTypeError,
    DownloadError
)

try:
    result = extractor.extract_from_url("https://example.com/resume.pdf")
except InvalidURLError as e:
    print(f"잘못된 URL: {e}")
except UnsupportedFileTypeError as e:
    print(f"지원하지 않는 파일 형식: {e}")
except DownloadError as e:
    print(f"다운로드 실패: {e}")
```

## 성능 최적화

- **배치 처리**: 여러 이력서를 처리할 때는 하나의 `ResumeExtractor` 인스턴스를 재사용
- **캐싱**: 동일한 URL의 경우 결과를 캐싱하여 재사용
- **병렬 처리**: 독립적인 이력서들은 병렬로 처리 가능

```python
# 배치 처리 예제
urls = ["url1.pdf", "url2.pdf", "url3.pdf"]

with ResumeExtractor() as extractor:
    results = []
    for url in urls:
        try:
            result = extractor.extract_from_url(url)
            results.append(result)
        except Exception as e:
            print(f"처리 실패 {url}: {e}")
```

## 라이선스

MIT License
