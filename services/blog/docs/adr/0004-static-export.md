---
status: accepted
supersedes-partially: 0003 (런타임 어댑터 부분)
---

# output: 'export' + Workers Static Assets 전용 배포 (Worker 스크립트 제거)

사이트는 100% 프리렌더(SSG)인데 OpenNext 어댑터는 HTML 요청마다 Worker를 호출해 캐시 봉투(`.cache` JSON)를 여는 구조였다. Worker가 하던 일은 렌더링이 아니라 URL 계층(무프리픽스 ko rewrite, /ko 정규화, legacy slug 301)뿐이므로, 이를 빌드 타임 산출물로 실체화하고 서버를 완전히 제거하기로 했다.

## 결정 사항

- **빌드**: `EXPORT=1 next build`(output: 'export') → `scripts/postexport.mjs`가 `out/ko/**`를 루트로 병합해 무프리픽스 ko URL을 파일 트리로 실체화. `/en`은 그대로.
- **라우팅 이전**: `/ko/*` → 무프리픽스 301과 legacy 한글 slug 301은 postexport가 생성하는 `out/_redirects`로. 보안 헤더는 `public/_headers`로. 구 vercel.json의 talks 전용 제한 CSP는 이식하지 않음 — URL 글롭이 뷰어 페이지까지 덮어 YouTube 임베드·umami를 차단하는 회귀(적대 리뷰 검출)라 전역 CSP로 통일.
- **en soft-404 프루닝**: `[locale]` gsp가 en도 생성해 (ko-only) 페이지들이 404 UI를 200짜리 파일로 남김 → postexport가 `.next/server/app/en/**.meta`의 `status: 404`를 정본으로 삭제해 진짜 HTTP 404 복원. HTML 내용 매칭은 쓰지 않는다(200 페이지의 인라인 RSC flight에도 not-found 텍스트가 프리로드돼 오탐).
- **태그 gsp 인코딩**: `encodeURI(tag)` 반환 시 export가 퍼센트 인코딩 리터럴 파일명으로 굽고 자산 서버는 디코딩 후 조회해 한글 태그가 404 → 디코딩된 값 반환으로 수정 (적대 리뷰 검출, critical).
- **404**: `[locale]/[...rest]` catch-all이 `/ko/404`를 프리렌더 → 병합 시 루트 `404.html`이 됨. wrangler `not_found_handling: "404-page"`.
- **배포**: wrangler.jsonc에서 `main` 제거(자산 전용 Worker). 요청 무과금·무제한, 3MiB 번들 한도 소멸. @opennextjs/cloudflare 의존성 제거.
- **middleware.ts는 `next dev` 전용으로 존치**: dev에서 무프리픽스 ko·언어 감지 패리티 유지. 프로덕션에선 실행되지 않는다.
- **reports 원본 HTML**: `/reports/<slug>.html`이 뷰어 페이지 파일(`reports/<slug>.html`)과 경로 충돌 → `public/static/reports/`로 이동, 뷰어 iframe src 변경.

## 포기한 것

- **Accept-Language 첫 방문 감지**(`/` → `/en` 307): 서버가 없어 불가. 보류 결정(2026-07-12). 필요해지면 ko 홈에 클라이언트 스크립트로 재도입.
- **교차 locale slug 307**(/en/&lt;ko-slug&gt; → 원문): 정적 규칙으로 표현 불가한 nicety라 제거. 대신 404.
- **뉴스레터 API**(/api/newsletter): secret 미설정으로 이미 500이던 것을 라우트째 삭제.

## Consequences

- 프리렌더 페이지는 URL당 HTML(.html)과 RSC flight(.txt) 두 파일로 서빙되며, 클라이언트 네비게이션은 middleware rewrite 시절과 동일하게 동작한다 (rewrite는 원래 클라이언트에 보이지 않았으므로 등가).
- `/404`를 직접 방문하면 404 페이지가 200으로 나온다 (정적 호스팅 공통 quirk, 무해).
- 검색 인덱스(search.json)는 draft를 제외하고 생성되며 postexport 게이트가 누출을 빌드 실패로 막는다 (기존엔 draft 제목·본문이 공개 인덱스에 새고 있었음 — 적대 리뷰 검출).
- 새 페이지 라우트가 public/ 디렉터리와 경로가 겹치면 postexport 병합 게이트가 빌드를 실패시킨다.
- 25MiB/파일 자산 한도는 여전하다 (enterthon-2025 .mov 부채 유지).
