# 🛠️ Interview 프로젝트 개발 가이드

## 🚀 시작하기

### 전제 조건

- Node.js 16.14 이상
- Yarn (npm 대신 Yarn 사용)
- Git

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/back-to-the-basic/interview.git
cd interview

# 의존성 설치
yarn install

# 개발 서버 실행
yarn start
```

개발 서버는 http://localhost:3000 에서 실행됩니다.

## 📝 문서 작성 가이드

### 1. 파일 생성

- 위치: `docs/` 디렉토리 내 적절한 카테고리
- 형식: `.mdx` (Markdown + JSX)
- 명명: 한글 파일명 가능, 공백은 대시(-)로 대체

### 2. Frontmatter 작성

```mdx
---
title: 문서 제목
sidebar_position: 1
slug: custom-url-slug # 선택사항
description: 문서 설명 # SEO용
tags:
  - 태그1
  - 태그2
---
```

### 3. 이미지 사용

```jsx
import Image from '@site/src/components/Image';

<Image src="이미지URL" width="500px" referenceLink="참조링크" description="이미지 설명" />;
```

### 4. 카테고리 설정

각 폴더에 `_category_.json` 파일 생성:

```json
{
  "label": "카테고리명",
  "position": 1,
  "link": {
    "type": "generated-index",
    "description": "카테고리 설명"
  }
}
```

## 🔧 개발 명령어

```bash
# 빌드
yarn build

# 빌드된 사이트 미리보기
yarn serve

# 타입 체크
yarn typecheck

# 린트 실행
yarn lint
yarn lint:fix

# 코드 포맷팅
yarn format

# 번역 파일 생성
yarn write-translations

# 캐시 삭제
yarn clear
```

## 📁 프로젝트 구조

```
├── docs/              # 모든 문서 콘텐츠
├── src/               # React 컴포넌트 및 커스텀 코드
│   ├── components/    # 재사용 가능한 컴포넌트
│   ├── css/          # 전역 스타일
│   ├── pages/        # 커스텀 페이지
│   └── utils/        # 유틸리티 함수
├── static/           # 정적 파일 (이미지, 폰트 등)
├── docusaurus.config.js  # Docusaurus 설정
├── sidebars.js      # 사이드바 설정
└── package.json     # 프로젝트 의존성
```

## 🎨 스타일 가이드

### MDX 컴포넌트

```mdx
:::tip 팁
유용한 정보를 제공합니다.
:::

:::warning 주의
주의해야 할 내용입니다.
:::

:::danger 위험
중요한 경고 사항입니다.
:::

:::info 정보
추가 정보를 제공합니다.
:::
```

### 코드 블록

````mdx
```javascript title="example.js"
function hello() {
  console.log('Hello, World!');
}
```
````

## 🐛 트러블슈팅

### 빌드 오류

1. 캐시 삭제: `yarn clear`
2. node_modules 재설치:
   ```bash
   rm -rf node_modules
   yarn install
   ```

### @mdx-js/react 버전 충돌

Docusaurus 3.x를 사용하는 경우 `@mdx-js/react` 버전이 맞지 않을 수 있습니다.

**증상**:

```
Module not found: Error: Can't resolve '@mdx-js/react'
```

**해결방법**:
package.json에서 `@mdx-js/react` 버전을 `^3.0.0`으로 업데이트:

```json
"@mdx-js/react": "^3.0.0"
```

### 이미지 로딩 문제

- 이미지는 `static/img/` 폴더에 저장
- 경로는 `/img/파일명` 형식으로 참조

## 🤝 기여 방법

1. Fork 후 feature 브랜치 생성
2. 변경사항 커밋 (자동 포맷팅 적용됨)
3. Pull Request 생성

### 커밋 메시지 규칙

- `feat:` 새로운 기능 추가
- `fix:` 버그 수정
- `docs:` 문서 수정
- `style:` 코드 포맷팅
- `refactor:` 코드 리팩토링
- `test:` 테스트 추가
- `chore:` 빌드 업무 수정

## 📚 추가 리소스

- [Docusaurus 공식 문서](https://docusaurus.io/docs)
- [MDX 문법 가이드](https://mdxjs.com/)
- [프로젝트 이슈 트래커](https://github.com/back-to-the-basic/interview/issues)

---

_질문이나 제안사항이 있다면 GitHub Issues를 통해 문의해주세요._
