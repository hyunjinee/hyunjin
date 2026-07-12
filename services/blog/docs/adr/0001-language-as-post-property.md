---
status: superseded by ADR-0002
---

# 언어는 라우팅이 아니라 글의 속성이다

블로그에 한·영 이중 언어를 지원하면서 `/en`, `/ko` locale 프리픽스 라우팅을 쓰지 않기로 했다. 영어 번역은 자기만의 영어 slug를 가진 독립 글로 `/blog/` 바로 아래에 살고, frontmatter `lang: en` + `translationOf: <원문 slug>`로 원문과 짝을 맺으며, hreflang 상호 참조로 검색엔진에 쌍을 알린다. 기존 한국어 URL은 하나도 바뀌지 않는다.

## Considered Options

- **`app/[locale]` 세그먼트 + `/en` 프리픽스** (Next.js 공식 패턴, PxlSyl 포크 방식): SEO 표준이지만 기존 한국어 URL 전부 이동 또는 as-needed 프리픽스 예외 처리 필요, 라우팅 전면 개편. URL 미관상 원치 않음.
- **쿠키/Accept-Language 기반 무URL 구분** (Spotify 웹 플레이어 방식): 원래 원했던 UX지만 한 URL에 한 버전만 색인되어 영어 글이 검색에 존재하지 않게 됨. SSG도 포기해야 함.
- **글 속성 방식 (채택)**: SEO가 요구하는 건 프리픽스가 아니라 "언어별로 다른 URL"이므로, slug 차이만으로 hreflang이 성립. 라우팅 무변경, 기존 글 무수정.

## Consequences

- 번역은 목록·태그·RSS·사이트 내 검색에서 숨기고(원문의 전환 링크와 검색엔진으로만 진입), sitemap과 hreflang에는 반드시 포함한다.
- 번역 글에 `canonicalUrl`을 원문으로 설정하면 안 된다. 각 언어 버전은 self-canonical + hreflang이어야 구글이 양쪽을 색인한다.
- 나중에 영어 전용 목록(영어 홈 등)이 필요해지면 글 URL은 그대로 두고 `lang: en` 글만 모으는 목록 라우트를 추가하면 된다. 매몰 비용 없음.
