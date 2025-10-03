# 배포 가이드

이 문서는 `resume_extract` 패키지를 PyPI에 배포하는 방법을 설명합니다.

## 사전 준비

### 1. PyPI 계정 생성

#### TestPyPI (테스트용 - 권장)

1. https://test.pypi.org/account/register/ 에서 계정 생성
2. https://test.pypi.org/manage/account/token/ 에서 API 토큰 생성
   - Token name: `resume_extract` (또는 원하는 이름)
   - Scope: "Entire account" 선택

#### PyPI (실제 배포)

1. https://pypi.org/account/register/ 에서 계정 생성
2. https://pypi.org/manage/account/token/ 에서 API 토큰 생성
   - Token name: `resume_extract` (또는 원하는 이름)
   - Scope: "Entire account" 선택

> ⚠️ **주의**: API 토큰은 생성 시 한 번만 표시되므로 안전한 곳에 보관하세요!

## 배포 방법

### 방법 1: 환경변수 사용 (권장)

#### TestPyPI에 테스트 배포

```bash
# 1. 테스트 및 빌드
make test
make clean
make build

# 2. 환경변수 설정
export TWINE_USERNAME=__token__
export TWINE_PASSWORD=pypi-your-testpypi-token-here

# 3. TestPyPI에 배포
make publish-test
```

#### PyPI에 실제 배포

```bash
# 1. 테스트 및 빌드
make test
make clean
make build

# 2. 환경변수 설정
export TWINE_USERNAME=__token__
export TWINE_PASSWORD=pypi-your-real-pypi-token-here

# 3. PyPI에 배포
make publish
```

### 방법 2: .pypirc 파일 사용

`~/.pypirc` 파일을 생성하여 설정:

```ini
[distutils]
index-servers =
    pypi
    testpypi

[pypi]
username = __token__
password = pypi-your-pypi-token-here

[testpypi]
repository = https://test.pypi.org/legacy/
username = __token__
password = pypi-your-testpypi-token-here
```

> ⚠️ **보안 주의**: `.pypirc` 파일에는 민감한 정보가 포함되므로 파일 권한을 제한하세요:
>
> ```bash
> chmod 600 ~/.pypirc
> ```

그 다음 배포:

```bash
# TestPyPI에 배포
make publish-test

# PyPI에 배포
make publish
```

## 배포 체크리스트

배포하기 전에 다음 사항을 확인하세요:

- [ ] 모든 테스트가 통과하는지 확인 (`make test`)
- [ ] 버전 번호가 올바른지 확인 (`pyproject.toml`)
- [ ] CHANGELOG.md가 업데이트되었는지 확인
- [ ] README.md가 최신 정보를 포함하는지 확인
- [ ] 불필요한 파일이 포함되지 않도록 `.gitignore` 확인
- [ ] TestPyPI에서 먼저 테스트 배포 수행
- [ ] TestPyPI에서 설치 및 동작 테스트
- [ ] 실제 PyPI에 배포

## 배포 후 확인

### TestPyPI에서 확인

```bash
# TestPyPI에서 설치 테스트
uv pip install --index-url https://test.pypi.org/simple/ --extra-index-url https://pypi.org/simple resume_extract

# 또는
pip install --index-url https://test.pypi.org/simple/ --extra-index-url https://pypi.org/simple resume_extract
```

### PyPI에서 확인

```bash
# PyPI에서 설치 테스트
uv pip install resume_extract

# 또는
pip install resume_extract
```

### 패키지 동작 확인

```python
from resume_extract import ResumeExtractor

# 간단한 테스트
extractor = ResumeExtractor(langextract_api_key="test-key")
print(extractor.get_supported_file_types())
extractor.close()
```

## 버전 업데이트 워크플로우

1. **코드 변경 및 테스트**

   ```bash
   # 코드 수정
   make test
   ```

2. **버전 번호 업데이트**

   - `pyproject.toml`의 `version` 필드 업데이트
   - `src/resume_extract/__init__.py`의 `__version__` 업데이트
   - `CHANGELOG.md`에 변경사항 추가

3. **Git 커밋 및 태그**

   ```bash
   git add .
   git commit -m "Release v0.0.2"
   git tag v0.0.2
   git push origin main
   git push origin v0.0.2
   ```

4. **빌드 및 배포**
   ```bash
   make clean
   make build
   make publish
   ```

## 문제 해결

### 오류: "File already exists"

같은 버전을 다시 업로드할 수 없습니다. 버전 번호를 증가시켜야 합니다.

```bash
# pyproject.toml과 __init__.py의 버전 업데이트
# 예: 0.0.1 -> 0.0.2
```

### 오류: "Invalid or non-existent authentication information"

API 토큰이 잘못되었거나 만료되었습니다. 새로운 토큰을 생성하세요.

### 오류: "The user '...' isn't allowed to upload to project '...'"

해당 프로젝트에 대한 권한이 없습니다. 프로젝트 소유자가 권한을 부여해야 합니다.

## 추가 리소스

- [PyPI 공식 문서](https://packaging.python.org/tutorials/packaging-projects/)
- [Twine 문서](https://twine.readthedocs.io/)
- [Semantic Versioning](https://semver.org/)
