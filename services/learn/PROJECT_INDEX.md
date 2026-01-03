# 🎯 Interview 프로젝트 인덱스

## 📋 프로젝트 개요

- **프로젝트명**: Interview
- **목적**: 기술 면접 준비를 위한 학습 자료 정리
- **URL**: https://bttb-interview.vercel.app
- **GitHub**: https://github.com/back-to-the-basic/interview
- **기술 스택**:
  - Docusaurus (정적 사이트 생성기)
  - React 18
  - TypeScript
  - PWA 지원
  - Vercel 배포

## 🏗️ 프로젝트 구조

```
learn/
├── docs/                    # 모든 문서 콘텐츠
│   ├── operating-system/    # 운영체제
│   ├── network/            # 네트워크
│   ├── javascript/         # JavaScript
│   ├── computer-structure/ # 컴퓨터 구조
│   ├── react/              # React
│   ├── web/                # 웹 기술
│   ├── data-structure/     # 자료구조
│   ├── graphql/           # GraphQL
│   ├── project/           # 프로젝트 소개
│   └── etc/               # 기타
├── src/                    # 소스 코드
├── static/                 # 정적 파일
└── 설정 파일들
```

## 📚 문서 카테고리

### 1. 🖥️ 운영체제 (Operating System)

- **위치**: `docs/operating-system/`
- **주요 내용**:
  - 공룡책 정리
  - 혼자 공부하는 운영체제
  - 면접 질문 정리
- **하위 카테고리**:
  - 운영체제 개요 (커널, 이중모드, 캐시 등)
  - 프로세스와 스레드
  - 프로세스 동기화
  - CPU 스케줄링
  - 가상 메모리
  - 파일 시스템
  - 입출력 시스템과 저장장치

### 2. 🌐 네트워크 (Network)

- **위치**: `docs/network/`
- **주요 내용**:
  - 면접 질문 정리
  - 컴퓨터 네트워킹 하향식 접근
  - Learning HTTP2
- **주요 토픽**:
  - OSI 7 Layer
  - TCP/IP
  - HTTP/HTTPS
  - DNS, ARP, CDN
  - 3-way/4-way Handshaking
  - RESTful API
  - 소켓 통신

### 3. 💛 JavaScript

- **위치**: `docs/javascript/`
- **주요 내용**:
  - 모던 자바스크립트 딥 다이브
  - 핵심 개념 정리
- **주요 토픽**:
  - 실행 컨텍스트
  - 호이스팅
  - 이벤트 루프
  - 비동기 처리 (Promise, async/await)
  - 가비지 컬렉션
  - 클로저, this
  - 제너레이터, 이터러블

### 4. 🔧 컴퓨터 구조 (Computer Structure)

- **위치**: `docs/computer-structure/`
- **주요 내용**:
  - CPU 구조와 동작
  - 메모리 계층구조
  - 인터럽트
  - 클럭
- **학습 자료**: 개념 정리 (1~4)

### 5. ⚛️ React

- **위치**: `docs/react/`
- **주요 내용**:
  - React 기본 개념
  - Flux 아키텍처
  - Hooks (useEffect, useLayoutEffect, use)
  - CSS in JS
  - 디자인 시스템
  - 에러 바운더리

### 6. 🌍 Web

- **위치**: `docs/web/`
- **주요 내용**:
  - 브라우저 동작 원리
  - CORS, CSRF
  - 쿠키와 세션
  - CSR/SSR/SSG
  - 웹 접근성
  - HTTP 통신 특성

### 7. 📊 자료구조 (Data Structure)

- **위치**: `docs/data-structure/`
- **현재 내용**: Hash Table

### 8. 🚀 GraphQL

- **위치**: `docs/graphql/`
- **주요 내용**:
  - BFF (Backend for Frontend)
  - Overfetching과 Underfetching

### 9. 💼 프로젝트 (Project)

- **위치**: `docs/project/`
- **포함 프로젝트**:
  - 방슐랭가이드: 1인 가구 중심 부동산 직거래 플랫폼
  - MOZI: 시간/장소 기반 TODO 서비스

### 10. 📦 기타 (Etc)

- **위치**: `docs/etc/`
- **주요 내용**:
  - Docker
  - Unit 테스트 정리

## ⚙️ 프로젝트 설정

### 주요 명령어

```bash
# 개발 서버 실행
yarn start

# 빌드
yarn build

# 타입 체크
yarn typecheck

# 린트
yarn lint
yarn lint:fix

# 포맷팅
yarn format
```

### 기술적 특징

- **PWA 지원**: 오프라인에서도 사용 가능
- **Google Analytics**: G-7NECSDQ2KN
- **자동 사이드바 생성**: 폴더 구조 기반

## 📝 문서 작성 규칙

1. **파일 형식**: MDX (Markdown + JSX)
2. **이미지 컴포넌트**: `@site/src/components/Image` 사용
3. **카테고리 설정**: `_category_.json` 파일로 관리
4. **메타데이터**: 각 문서 상단에 frontmatter 작성

## 🔗 관련 링크

- [프로덕션 사이트](https://bttb-interview.vercel.app)
- [GitHub 저장소](https://github.com/back-to-the-basic/interview)

## 📈 프로젝트 통계

- **총 문서 수**: 약 80개 이상
- **주요 카테고리**: 10개
- **지원 플랫폼**: Web, PWA
- **배포**: Vercel

---

_이 문서는 프로젝트의 전체 구조와 내용을 파악하기 위한 인덱스 문서입니다._
