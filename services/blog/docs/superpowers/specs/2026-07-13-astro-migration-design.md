# Astro 6 전환 설계 (services/blog)

Next.js 16 static export를 Astro 6 정적 빌드로 교체한다. 배포 계층(Cloudflare Workers Static Assets 자산 전용, wrangler.jsonc, _headers, _redirects, GHA)은 그대로 두고 빌드 스텝만 바꾼다.

## 왜 (요약)

- 사이트는 100% 정적인데 Next는 RSC 앱 프레임워크라서, ko 무프리픽스·soft-404·검색 인덱스 같은 정적 사이트 관심사를 전부 postexport 해킹과 게이트로 지탱 중 (ADR-0004)
- Astro는 `i18n.routing.prefixDefaultLocale: false`로 ko 무프리픽스가 네이티브, Content Collections가 포크 유지 상태인 Contentlayer2를 대체, 글 페이지 JS 0KB
- Cloudflare가 2026-01 Astro 인수 — 우리 배포 스택과 1st-party 정합

## 불변 계약 (인수 기준)

1. **URL 계약**: `docs/migration-url-contract.txt`의 83개 URL이 전부 동일 경로로 서빙된다. en 표면은 정확히 4개(/en, /en/blog, /en/blog/page/1, /en/tags). dist/ 빌드 후 URL 목록 diff가 게이트.
2. **draft 불변식**: draft 글은 페이지·검색 인덱스·sitemap·RSS·태그 카운트 어디에도 없다.
3. **리다이렉트**: `/ko/*` → 무프리픽스 301, legacy 한글 slug 5건 301 (`_redirects`, 정적 파일로 동결).
4. **SEO 표면 보존**: canonical·hreflang(번역쌍만 ko/en/x-default=en)·JSON-LD·og:image(/og/blog/{locale}/{slug}.png)·RSS(/feed.xml, /en/feed.xml, /tags/*/feed.xml)·sitemap(translationOf 기반 hreflang) 동일. canonical이 **없는** 페이지(페이지네이션, 포트폴리오 다수)는 없는 상태 그대로 둔다 — 일괄 추가 금지.
5. **다크모드·검색·코드 복사·이미지 라이트박스·발표 뷰어** 등 사용자 체감 기능 유지.

## 구조 매핑

| 현재 | Astro |
|---|---|
| `app/[locale]/x/page.tsx` (ko) | `src/pages/x.astro` |
| `app/[locale]/x/page.tsx` (en 표면 4개) | `src/pages/en/{index,blog/...,tags}.astro` 명시 파일 |
| `(ko-only)/layout.tsx` locale 가드 | 불필요 (en 파일을 안 만들면 끝) |
| `[...rest]` 404 프리렌더 + postexport 복사 | `src/pages/404.astro` |
| contentlayer2 Blog/Authors + computed | Content Collections (glob loader) + zod 스키마 + `src/lib/posts.ts` 유틸 이식 |
| pliny MDXLayoutRenderer(body.code) | `render(entry)` |
| middleware.ts (dev 전용) | 삭제 — dev도 prod와 동일 라우팅 |
| postexport.mjs 병합·프루닝·404 | 삭제 |
| postexport.mjs _redirects 생성 | `public/_redirects` 정적 동결 (7규칙: /ko 2 + legacy 5) |
| postexport.mjs 게이트 | `scripts/verify-dist.mjs`로 이식: URL 계약 diff, draft 누출(검색·sitemap·html), 404.html 존재, /ko 프리픽스 누출 needle |
| contentlayer onSuccess (tag-data, search.json) | `src/lib/tags.ts` 유틸(빌드 타임 집계) + 검색 인덱스 스크립트 |
| app/sitemap.ts | 커스텀 `src/pages/sitemap.xml.ts` 엔드포인트 (@astrojs/sitemap은 translationOf 표현 불가) |
| app/robots.ts | `public/robots.txt` 정적 |
| scripts/rss.mjs | adapt: pliny 유틸 제거, 태그 집계는 `src/lib/tags.ts` 공유 |
| scripts/generate-og.mjs | adapt: 컬렉션 소스로 변경 + **폰트 woff 리포 vendoring** (CI 네트워크 플레이크 제거) |
| wrangler.jsonc | `assets.directory: "out" → "dist"` 한 줄 |
| GHA deploy-blog.yml | `NEXT_UMAMI_ID → PUBLIC_UMAMI_ID` env 매핑 + GH vars 리네임 (같은 PR) |

## 주요 결정

1. **콘텐츠 스키마 (zod)**: `draft: z.boolean().default(false)` (미지정 4편 = 공개 유지), `summary: z.string().nullable().optional()` (null 4편), `slug` frontmatter 우선·없으면 github-slugger(파일명) — 현재 resolveSlug 로직 그대로 이식 (Astro 기본 id 규칙 사용 금지, URL 계약 파괴됨). `translationOf`, `layout`(PostBanner 10·PostSimple 6·기본 PostLayout), `images`(로컬/원격 혼재 string|array), `bannerFit`, `lastmod`, `authors`.
2. **MDX 파이프라인**: 블로그 글·페이지 MDX 모두 `syntaxHighlight: false` + 기존 체인(remark-gfm, remark-math, rehype-slug, rehype-autolink-headings, rehype-katex, rehype-prism-plus) + prism.css 단일화. sugar-high/code-highlight.css는 drop. pliny remarkImgToJsx·remarkCodeTitles는 drop(코드 타이틀 구문 미사용 확인됨, 이미지는 표준 마크다운 img).
3. **이미지**: public/ 참조는 `<img>` 그대로 (URL 보존). colocated static import(bclguide 등)는 `src/assets/`로 이동 후 astro:assets (내부 참조라 URL 변경 무방). next/image 속성(width/height/priority)은 img 속성으로 기계 변환.
4. **다크모드**: next-themes → 인라인 스크립트(localStorage + `html.dark` 클래스, FOUC 방지 head 배치). React island(Mermaid·ThemeSwitch·NotionPage)는 `html` class MutationObserver 공용 훅 `useThemeClass()`로 구독.
5. **검색**: [결정 대기 — 아래 질문] kbar island 유지 vs pagefind 교체.
6. **라이트박스**: 글의 모든 이미지가 island가 되는 현행 구조를 버리고, 빌드 타임 `<img>` + 문서당 1개 위임 리스너 island로 재설계 (클릭 확대 UX 동일, 하이드레이션 비용 O(이미지 수)→O(1)).
7. **mermaid**: island 유지 (`client:visible`, 4편만 로드) — 다크모드 재렌더 동작 보존.
8. **ViewTransition**: Main의 title morph는 Astro cross-document view transitions(CSS `view-transition-name`)로 재현, 미지원 브라우저는 morph 없이 동작(수용). /dev/view-transition 2페이지는 React island(`client:only`)로 통째 유지 (URL 계약에 있음).
9. **React island 목록** (@astrojs/react): ThemeSwitch, MobileNav, 검색(결정 따라), Mermaid, 라이트박스(신규 단일), CalendarView, ExcalidrawViewer(client:only), PDFPresentation(talks), NotionPage, DeckCarousel·ZoomableImage(bclguide), LumosGallery(tossbank), ReportViewer, GithubContributions, dev 데모 2종. 나머지 전부 .astro 정적.
10. **이식하지 않는 것(데드 코드)**: Comments/giscus(전 레이아웃에서 주석 처리로 꺼져 있음 — 코드·env 제거, 살리려면 별도 작업), BtoaPolyfill(검색 결정에 종속), DeckViewer.tsx(미사용), InteractiveButton, references-data.bib + bibliography, 고아 MDX 2편(data/2025.mdx, deriving-ols-estimator.mdx), about/page.tsx 주석 160줄, framer-motion·@svgr/webpack(인라인 SVG 컴포넌트로), Space Grotesk 죽은 토큰, ScrollTopAndComment의 죽은 comment 버튼(scroll-top만 유지).
11. **환경변수**: `NEXT_UMAMI_ID → PUBLIC_UMAMI_ID` (GHA vars 리네임 동일 PR), giscus env 4종 제거.
12. **의존성 제거**: next, react-compiler 관련, contentlayer2, pliny, next-themes, @next/mdx·bundle-analyzer, @formatjs/intl-localematcher, negotiator. 유지: react/react-dom(island), tailwindcss 4, katex, prism css, satori/resvg, github-slugger, @headlessui/react(CalendarView), @excalidraw, react-pdf, kbar(결정 시).

## 리스크와 대응

- **slug 회귀** (frontmatter 없는 글의 github-slugger computed): resolveSlug 이식 + URL 계약 diff 게이트가 잡음
- **/talks/[slug] vs /talks/git-collaboration 경로 충돌**: Astro getStaticPaths에서 git-collaboration 명시 제외 (Next는 정적 세그먼트 우선으로 흡수했음)
- **/en/blog/page/1 최소 1페이지 보장**: en 공개 글 0인 상태에서 paginate가 빈 배열이면 생성 누락 — 최소 1페이지 로직 명시 이식, 계약 게이트가 잡음
- **tag-data/search/rss의 생성 시점 순환**: contentlayer onSuccess가 사라지므로 `src/lib/tags.ts` 단일 소스로 페이지·rss·검색이 공유. rss만 바꾸고 태그 피드를 빠뜨리면 빈 피드 — verify-dist가 feed.xml 존재+항목 수 검사
- **빈 MDX(/2026)·개발용 페이지(/test-mdx, /source-of-truth)**: 계약에 있으므로 유지, 빈 MDX 빌드 가능 여부는 스캐폴드 단계에서 즉시 확인
- **pnpm 워크스페이스**: services/blog의 프레임워크 교체가 루트 lockfile에 큰 diff — 단일 커밋으로 격리

## 실행 방식

feat/astro-migration 브랜치에서 **기존 코드를 지우지 않고** `src/`를 병렬 구축 → 빌드 전환 스위치는 마지막 태스크에서 package.json scripts 교체 + Next 잔재 일괄 삭제. 태스크마다 `pnpm build && verify-dist` 통과가 커밋 조건. 완료 후 전체 diff 적대 리뷰 → PR → 머지 시 GHA가 자동 배포.

## 성공 기준

1. `scripts/verify-dist.mjs` 전체 통과 (URL 계약 83개, draft 0 누출, 404, /ko 누출 0)
2. wrangler dev 라우트 매트릭스 (static export 전환 때의 24종 + 한글 태그 + en soft-404) 전부 기존과 동일 응답
3. 글 페이지 전송 JS: 현재(React 런타임 + flight) 대비 90%+ 감소 (mermaid 글 제외)
4. `pnpm dev`(astro dev)에서 무프리픽스 ko·/en 라우팅이 프로덕션과 동일 (middleware 이중 구조 소멸)
