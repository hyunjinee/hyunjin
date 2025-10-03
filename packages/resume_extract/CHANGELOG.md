# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2024-XX-XX

### Added

- 초기 버전 릴리스
- URL에서 이력서 다운로드 및 정보 추출 기능
- Google LangExtract를 이용한 구조화된 정보 추출
- 다양한 파일 형식 지원 (PDF, DOCX, DOC, TXT, HTML)
- 웹페이지에서 직접 텍스트 추출
- 완전한 데이터 모델 (ResumeInfo, ContactInfo 등)
- 포괄적인 오류 처리 및 예외 클래스
- 단위 테스트 및 통합 테스트
- 사용 예제 및 문서

### Features

- **다중 입력 방식**: URL, 로컬 파일, 텍스트 직접 입력 지원
- **파일 형식 지원**: PDF, Word 문서, HTML, 텍스트 파일
- **구조화된 출력**: Pydantic 모델을 사용한 타입 안전한 데이터 구조
- **오류 처리**: 상세한 예외 처리 및 에러 메시지
- **설정 가능**: 파일 크기 제한, 타임아웃, 재시도 횟수 등 설정 가능
- **컨텍스트 매니저**: 자동 리소스 정리
- **편의 함수**: 간단한 사용을 위한 헬퍼 함수들

### Technical Details

- Python 3.8+ 지원
- Google LangExtract 통합
- BeautifulSoup를 이용한 HTML 파싱
- PyPDF2를 이용한 PDF 파싱
- python-docx를 이용한 Word 문서 파싱
- Requests를 이용한 HTTP 통신 및 다운로드
- Pydantic을 이용한 데이터 검증
- pytest를 이용한 테스트 프레임워크
