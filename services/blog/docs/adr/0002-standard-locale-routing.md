---
status: accepted
---

# 표준 [locale] 라우팅 채택, 단 ko는 무프리픽스

ADR-0001(언어=글 속성, 프리픽스 없음)을 5인 적대적 설계 심사에 올린 결과 뼈대는 생존했으나, 숨김 노출 정책이 준고아 페이지(영어 글 색인 실패 위험), 영어 독자 재방문 루프 단절, 노출 규칙 자기모순을 낳는다는 지적이 수렴했고, 블로그 주인이 업계 표준 방식을 원한다고 최종 결정했다. 이에 `app/[locale]` 세그먼트 + middleware locale 감지라는 표준 레시피로 전환한다.

## 결정 사항

- **URL**: `localePrefix: as-needed`. 기본 언어(ko)는 무프리픽스로 기존 URL 16개 무변경, 영어만 `/en` 프리픽스. `/ko/*` 접근은 무프리픽스로 redirect.
- **영어 slug는 별도 지정**: `/en/blog/forgetting-is-the-hard-part`처럼 영어 글은 영어 slug를 가진다. 쌍 연결은 frontmatter `translationOf: <원문 slug>` 포인터(ADR-0001에서 승계).
- **locale 표면 분리**: ko 표면(홈·목록·태그·피드)은 한국어 글만, `/en` 표면은 영어 글만. 번역 없는 한국어 글은 `/en` 목록에서 숨김(fallback 없음, 실사례 검증된 표준 선택).
- **첫 방문 감지**: middleware가 Accept-Language + 쿠키로 영어 브라우저의 무프리픽스 첫 방문을 `/en`으로 안내. "방문자별로 알아서"라는 원래 요구의 표준적 구현.

## Considered Options

- **ADR-0001 유지 + 보강**(영어 목록 라우트, en 피드, lint 집행): 최소 수정이지만 보강할수록 표준 레시피에 수렴하며 어중간해짐. 주인이 표준을 명시 요구하여 기각.
- **/ko + /en 완전 대칭**: 가장 순수한 표준이나 기존 URL 전부가 301 경유가 됨. 기존 URL 보존을 위해 기각.
- **한국어 slug 공유**(/en/blog/메모리의-...): 표준 기본값이고 구현 최소지만 영어 독자에게 퍼센트 인코딩된 URL이 노출됨. 기각.

## Consequences

- `app/` 전 라우트가 `[locale]` 세그먼트 아래로 이동. `<html lang>`이 locale별로 올바르게 서빙되어 ADR-0001의 접근성 결함(영어 글이 lang=ko-KR로 서빙)이 구조적으로 해소된다.
- 목록·태그·검색 인덱스·RSS가 locale별로 분리된다(tag-data, search.json, feed도 per-locale). 심사에서 지적된 "필터 지점 열거" 문제는 라우팅 레벨 분리로 대부분 소멸하나, raw `allBlogs` 직접 import 금지 lint는 여전히 둔다.
- hreflang: 번역 쌍 양방향 + x-default는 영어(쌍이 있을 때. 어느 locale에도 안 맞는 국제 사용자에게 한국어보다 영어가 낫다는 심사 반영). 번역은 self-canonical(ADR-0001 승계).
- as-needed는 next-intl에서 정적 빌드 이슈 경고 사례가 있으므로, 구현 시 전 페이지 정적 생성 여부를 빌드 게이트로 검증한다. 실패 시 수동 [locale] 패턴(공식 가이드)으로 대체한다.
- (구현 계획 시 확정) 수동 [locale] 패턴을 기본으로 승격한다. 근거: UI 라벨이 이미 전부 영어라 메시지 카탈로그가 불필요해 next-intl의 핵심 가치가 소멸하고, as-needed 정적 빌드 리스크와 기존 next.config 3중 플러그인 래핑(withContentlayer·withMDX·bundle-analyzer + react-compiler)과의 조합 리스크를 회피한다. 한국어 UI 문자열이 필요해지는 시점에 next-intl 도입을 재평가한다.
- 원문 무수정 원칙은 유지: 한국어 글 파일은 이동·수정 없음. 영어 글은 `data/blog/en/`에 산다.
