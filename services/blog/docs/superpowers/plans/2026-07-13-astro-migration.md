# Astro 6 전환 실행 계획

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development로 태스크 단위 실행. 스펙: [2026-07-13-astro-migration-design.md](../specs/2026-07-13-astro-migration-design.md) — 태스크 브리프가 참조하는 단일 진실.

**Goal:** services/blog의 빌드를 Next.js 16 static export에서 Astro 6 정적 빌드로 교체하되, URL 계약 83개·draft 불변식·SEO 표면·체감 기능을 그대로 보존한다.

**Architecture:** 기존 코드를 지우지 않고 `src/`(Astro)를 병렬 구축. 각 태스크는 `pnpm astro:build` + 게이트 통과가 커밋 조건. 마지막 태스크에서 스크립트 스위치 + Next 잔재 삭제. 배포 계층(wrangler·_headers·_redirects·GHA)은 디렉터리명 외 불변.

**Tech Stack:** Astro 6(정적), @astrojs/mdx, @astrojs/react(island 15종), @tailwindcss/vite(v4 CSS-first 기존 css/tailwind.css 재사용), kbar(검색 island 유지 — 사용자 결정), satori/resvg(OG), zod 스키마 Content Collections.

## Global Constraints

- **URL 계약**: `docs/migration-url-contract.txt` 83개 전부 dist/에서 서빙. en 표면은 정확히 4개(/en, /en/blog, /en/blog/page/1, /en/tags). `/en/blog/page/1`은 en 공개 글 0이어도 최소 1페이지 생성.
- **slug**: frontmatter slug 우선, 없으면 `github-slugger.slug(파일명)` — contentlayer resolveSlug(contentlayer.config.ts:53-58) 로직 그대로. Astro 기본 id 규칙 사용 금지.
- **draft**: zod `draft: z.boolean().default(false)`. draft는 페이지·search.json·sitemap·RSS·태그 집계 전부에서 제외.
- **canonical/hreflang**: 있는 곳(홈·blog 목록·글 상세 번역쌍·tags/[tag])만 유지, 없는 곳(페이지네이션·포트폴리오 다수)에 추가 금지. x-default=en.
- **환경변수**: `PUBLIC_UMAMI_ID` (구 NEXT_UMAMI_ID). giscus env 제거.
- **코드 스타일**: biome 통과(2sp, 120col, single quote). `console.log` 프로덕션 금지(빌드 스크립트 제외).
- 매 태스크 종료: `pnpm astro:build` 성공 + 해당 태스크의 Verify 명령 통과 + 커밋(해당 파일만 staging).

---

### Task 1: 스캐폴드 + Content Collections 데이터 계층

**Files:**
- Create: `astro.config.mjs`, `src/content.config.ts`, `src/lib/locale.ts`, `src/lib/posts.ts`, `src/lib/tags.ts`, `src/pages/_smoke.astro`(임시)
- Modify: `package.json`(deps + `astro:dev`/`astro:build` 스크립트 추가), `tsconfig.json`(exclude에 `src` 추가 — Next tsc와 격리, 스위치 때 재구성)

**Interfaces (Produces):**
- 컬렉션 `blog`(data/blog/** glob, en/ 하위 → locale 'en'), `authors`(data/authors/**)
- `src/lib/posts.ts`: `postsForLocale(locale): Entry[]`(draft 제외+date desc), `pairOf(entry)`, `translationFor`, `originalOf`, `findBySlug(locale, slug)`, `entrySlug(entry): string`(resolveSlug 이식), `postUrl(locale, slug)`
- `src/lib/locale.ts`: 기존 lib/locale.ts 복사(경로만)
- `src/lib/tags.ts`: `tagCounts(locale): Record<string, number>`(github-slugger 키, draft 제외) — 페이지·rss·검색이 공유할 단일 소스

```mjs
// astro.config.mjs 핵심
export default defineConfig({
  site: 'https://hyunjinlee.com',
  output: 'static',
  trailingSlash: 'never',
  i18n: { defaultLocale: 'ko', locales: ['ko', 'en'], routing: { prefixDefaultLocale: false } },
  integrations: [mdx(), react()],
  vite: { plugins: [tailwindcss()] },
  markdown: { syntaxHighlight: false, remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [rehypeSlug, [rehypeAutolink, {behavior:'prepend'...기존 옵션}], rehypeKatex, [rehypePrismPlus, {defaultLanguage:'js', ignoreMissing:true}]] },
})
```

```ts
// src/content.config.ts 스키마 핵심 (contentlayer.config.ts:126-166 대응)
const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './data/blog' }),
  schema: z.object({
    title: z.string(), date: z.coerce.date(), tags: z.array(z.string()).default([]),
    lastmod: z.coerce.date().optional(), draft: z.boolean().default(false),
    summary: z.string().nullable().optional(), images: z.union([z.string(), z.array(z.string())]).optional(),
    authors: z.array(z.string()).optional(), layout: z.enum(['PostLayout','PostSimple','PostBanner']).optional(),
    slug: z.string().optional(), translationOf: z.string().optional(), bannerFit: z.string().optional(),
    bibliography: z.string().optional(), canonicalUrl: z.string().optional(),
  }),
})
// locale: entry.id가 'en/'로 시작하면 'en' 아니면 'ko' (resolveDocLocale 대응)
// entrySlug: frontmatter slug ?? githubSlug(파일명 stem) (resolveSlug 대응)
```

**Steps:** deps 설치 → config·스키마 작성 → lib 이식 → `_smoke.astro`에서 `postsForLocale('ko').length` 출력 → build → 검증 스크립트로 slug 집합 확인 → 커밋.

**Verify:**
```bash
pnpm astro:build   # 성공
node -e "…getCollection 목록 덤프…"  # ko 16·en 1, entrySlug 집합이 기존 out/blog/*.html 파일명 집합과 일치 (스모크 스크립트 제공)
```

### Task 2: 전역 셸 — Base 레이아웃·Header/Footer·테마·검색·404

**Files:**
- Create: `src/layouts/Base.astro`, `src/components/{Header,Footer,Link,SectionContainer,PageTitle,Tag,LocaleSwitcher,SearchButton}.astro`, `src/components/islands/{ThemeSwitch,MobileNav,Search}.tsx`, `src/lib/useThemeClass.ts`, `src/pages/404.astro`, `scripts/build-search-index.mjs`
- 참조(이식 원본): `app/[locale]/layout.tsx`, `components/{Header,Footer,ThemeSwitch,MobileNav,SearchButton,LocaleSwitcher,Tag,Link}.tsx`, `contentlayer.config.ts:96-124`(검색 인덱스), `components/BtoaPolyfill.tsx`

**Interfaces (Produces):**
- `Base.astro` props: `{ title?, description?, canonical?, hreflang?: {ko,en,xDefault}, ogImage?, locale: 'ko'|'en' }` — head에 metadataBase 상당·feed alternate(/feed.xml | /en/feed.xml)·css 전역 import·**FOUC 방지 인라인 테마 스크립트**(localStorage 'theme' → html.dark)·umami script(PUBLIC_UMAMI_ID)
- `useThemeClass()`: html class MutationObserver 훅 — Mermaid·NotionPage가 소비
- Search island: kbar 직접 의존 단일 island(SearchProvider가 레이아웃을 감싸는 현행 구조 금지), locale별 인덱스(/search.json | /search-en.json) fetch, 한글 btoa 이슈는 island 내부에서 처리(BtoaPolyfill 로직 이식)
- `build-search-index.mjs`: createSearchIndex(contentlayer.config.ts:96-124) 이식 — **draft 제외**, en path는 `en/blog/<slug>`(선행 슬래시 없음) 바이트 단위 유지, public/search{,-en}.json 출력

**Steps:** 테마 스크립트·Base 작성 → Header/Footer .astro 변환(usePathname 의존은 `Astro.url.pathname` prop) → island 3종 → 404.astro(app/[locale]/not-found.tsx 마크업) → 검색 인덱스 스크립트 → 스모크 페이지에 Base 적용 → build·커밋.

**Verify:**
```bash
pnpm astro:build && node scripts/build-search-index.mjs
grep -c 'dark' dist/404.html               # 테마 스크립트 포함
python3 - <<'P'  # search.json에 draft 0건
…draft slug 교차 검사…
P
```

### Task 3: 블로그 코어 — 글 상세·포스트 레이아웃 3종·MDX 표면

**Files:**
- Create: `src/pages/blog/[...slug].astro`, `src/pages/en/blog/[...slug].astro`, `src/layouts/{PostLayout,PostSimple,PostBanner}.astro`, `src/components/mdx/{index.ts,Lightbox.tsx(문서당 1 island),CopyCode(인라인 스크립트 or rehype),Mermaid.tsx,TableWrapper.astro}`, `src/components/ScrollTop.tsx`
- 참조: `app/[locale]/blog/[...slug]/page.tsx`(메타·JSON-LD·prev/next·altLocale), `layouts/Post*.tsx`, `components/{MDXComponents,ImageViewer,Pre,Mermaid,ScrollTopAndComment}.tsx`

**핵심 규칙:**
- getStaticPaths: `postsForLocale(locale)` draft 제외, slug `/` 포함 가능([...slug])
- 메타 패리티: canonical=postUrl, 번역쌍(pairOf) 있을 때만 hreflang 3종, og:article(publishedTime·modifiedTime·authors), og 이미지 frontmatter images 우선 없으면 `/og/blog/{locale}/{slug}.png`, JSON-LD structuredData(+author 배열) — 기존 generateMetadata(page.tsx:27-96)와 필드 단위 동일
- **런타임 redirect 로직(page.tsx:116-135) 이식 금지** — _redirects 소관
- 라이트박스: 본문 `<img>`는 빌드 타임 정적, 문서당 1개 위임 island가 클릭 시 확대(기존 ImageViewer UX)
- 코드 복사 버튼: Pre 대체 — rehype로 버튼 마크업 주입 + Base의 위임 인라인 스크립트(React 불필요)
- mermaid: ` ```mermaid` 펜스 → island(client:visible, useThemeClass 구독). 실사용 4편(closed-loop ko/en, agent-browser, 메모리…)이 회귀 테스트 대상
- prev/next 같은 locale, altLocale 배너 링크(pairOf)

**Verify:**
```bash
pnpm astro:build
# 대표 3편(understanding-react-rendering·closed-loop draft 부재·mermaid 글) HTML을 기존 out/과 비교:
node scripts/compare-meta.mjs dist out blog/understanding-react-rendering  # canonical·og·JSON-LD 필드 diff 0
ls dist/blog/branch-strategy.html 2>&1 | grep 'No such'   # draft 미생성
```

### Task 4: 목록 표면 — 홈 2종·blog 목록/페이지네이션·태그

**Files:**
- Create: `src/pages/index.astro`(ResumeHome 정적 변환 401줄), `src/pages/en/index.astro`, `src/components/PostList.astro`(Main 대응, view-transition-name=`title-{slug}` CSS), `src/pages/blog/index.astro`, `src/pages/blog/page/[page].astro`, `src/pages/en/blog/{index,page/[page]}.astro`, `src/pages/tags/index.astro`, `src/pages/tags/[tag].astro`, `src/pages/en/tags/index.astro`, `src/layouts/ListWithTags.astro`
- 참조: `app/[locale]/{page,Main,ResumeHome}.tsx`, `app/[locale]/blog/**`, `app/[locale]/tags/**`, `layouts/ListLayoutWithTags.tsx`

**핵심 규칙:**
- 홈 hreflang(ko=/ en=/en x-default=/en), en 홈만 title 'Blog'
- 페이지네이션 POSTS_PER_PAGE=5, **최소 1페이지 보장**(en 공개 0에서도 /en/blog/page/1 생성), canonical 없음 유지
- 태그: `tagCounts(locale)` 소스, [tag] 파라미터는 **디코딩된 값**(static export 때 encodeURI 회귀 재발 금지), ko만 RSS alternate. en/tags/[tag]는 공개 글 0이라 생성 0(계약과 일치)
- ViewTransition morph: `@view-transition` cross-document + `view-transition-name` — Safari 미지원 수용

**Verify:** build 후 `find dist -name '*.html'` 목록이 계약 83개와 diff 0에 근접(talks·reports·포트폴리오 태스크 제외분 명시). `/tags/회고` 파일명이 디코딩 한글인지 확인.

### Task 5: 피드·sitemap·OG·robots·정적 산출물

**Files:**
- Create: `src/pages/sitemap.xml.ts`(translationOf hreflang 커스텀 — @astrojs/sitemap 금지), `public/robots.txt`, `scripts/fonts/`(satori용 woff vendoring)
- Modify: `scripts/rss.mjs`(pliny 제거, 컬렉션 JSON 소스 교체, tagCounts 공유), `scripts/generate-og.mjs`(컬렉션 소스 + 로컬 폰트)
- 참조: `app/sitemap.ts`, `app/robots.ts`, 기존 스크립트

**Verify:** rss 항목 수·sitemap URL 집합·hreflang이 기존 out/ 산출물과 diff 0. OG PNG 8+1종 생성.

### Task 6: ko-only 정적 페이지 (경량 그룹)

**Files:** `src/pages/{about,projects,berriz,kakaoent,tossbank,dev/mcp,source-of-truth}.astro`, mdx 노트 `src/pages/{2025,2026,compiler,n/1,test-mdx}.mdx`, island: `GithubContributions.tsx`, `LumosGallery.tsx`
- 참조: `app/[locale]/(ko-only)/{about,projects,berriz,kakaoent,tossbank,dev/mcp,source-of-truth,…}/page.*`
- about: authors 컬렉션 render(), 주석 160줄 이식 금지. /2026 빈 MDX 빌드 확인(안 되면 빈 프론트매터 1줄).

### Task 7: ko-only 인터랙티브 페이지 (중량 그룹)

**Files:** `src/pages/{bclguide,debutsplan,calendar}.astro` + islands `{DeckCarousel,ZoomableImage,ExcalidrawViewer(client:only),CalendarView}.tsx`, bclguide colocated 자산 → `src/assets/bclguide/`(astro:assets), pptx·xd-assets는 이식 제외(라우트 오염 방지, 필요 시 public/)
- DeckViewer.tsx 미이식(미사용).

### Task 8: talks + reports + dev 데모

**Files:** `src/pages/talks/{index,[slug],git-collaboration/index,git-collaboration/[id]}.astro`, `src/pages/reports/{index,[slug]}.astro`, `src/pages/dev/view-transition/{index,card}.astro`, islands: `PDFPresentation`(react-pdf, unpkg worker URL 유지), `NotionPage`(useThemeClass), `ReportViewer`(+VibeTip), dev 데모 2종 `client:only="react"`
- **talks/[slug] getStaticPaths에서 git-collaboration 명시 제외** (정적 라우트와 충돌)
- ReportViewer iframe src `/static/reports/{slug}.html` 유지

### Task 9: 게이트 — verify-dist + _redirects 동결 + validate-i18n adapt

**Files:**
- Create: `scripts/verify-dist.mjs`, `public/_redirects`(현재 postexport 산출 7규칙 동결 복사)
- Modify: `scripts/validate-i18n.mjs`(contentlayer 의존 → 프론트매터 직접 파싱 or 컬렉션, 규칙 6종 유지)

```mjs
// verify-dist.mjs 검사 항목 (postexport 게이트 승계 + 계약)
// 1. docs/migration-url-contract.txt 각 URL → dist 파일 존재 (X.html 또는 X/index.html)
// 2. dist HTML 전체에 draft slug·'hyunjinlee.com/ko'·'href="/en/ko' 누출 0 (grep needle 승계)
// 3. dist/404.html 존재 + '페이지를 찾을 수 없습니다'
// 4. search.json·search-en.json draft 0 + en path 형식
// 5. dist/_redirects 7규칙·dist/_headers 존재
// 6. feed.xml·en/feed.xml·tags/*/feed.xml 존재 + item 수 == 공개 글 수
// 7. sitemap.xml URL 집합 == 기존 계약 부분집합 검사
```

### Task 10: 스위치 — 스크립트 교체·Next 잔재 삭제·CI·문서

**Files:**
- Modify: `package.json`(dev/build/build:cf/deploy:cf → astro 체인: `astro build && build-search-index && rss && generate-og(선행) && verify-dist`, next·contentlayer2·pliny·next-themes·@next/*·negotiator·@formatjs 등 deps 제거), `wrangler.jsonc`(directory: dist), `.github/workflows/deploy-blog.yml`(PUBLIC_UMAMI_ID), `tsconfig.json`(astro/tsconfigs/strict 기반 재작성), `readme.md`
- Delete: `app/`, `components/`, `layouts/`, `lib/`, `middleware.ts`, `next.config.ts`, `contentlayer.config.ts`, `scripts/{postbuild,postexport}.mjs`, `next-env.d.ts`, `css/code-highlight.css`, `data/{2025.mdx,deriving-ols-estimator.mdx,references-data.bib}`, giscus env 잔재
- Create: `docs/adr/0005-astro-migration.md`, migration record 갱신
- **GH vars 리네임(NEXT_UMAMI_ID→PUBLIC_UMAMI_ID)은 사용자 액션 — 머지 전 안내**

**Verify:** `pnpm build:cf` 전체 체인 통과, `pnpm exec biome check`, lockfile 정리(`pnpm install`), `git grep -l 'next/' src/` 0건.

### Task 11: 최종 검증 + 적대 리뷰 + PR

- wrangler dev 매트릭스: static export 때 24종 + `/tags/%ED%9A%8C%EA%B3%A0` + en soft-404 4종 + mermaid 글·발표 뷰어·reports 뷰어 콘텐츠 확인
- 성공 기준 3(글 페이지 JS 전송량 90%+ 감소) 측정 기록
- 전체 브랜치 diff 적대 리뷰 워크플로(발견당 반박 2표) → Critical/Important 수정
- PR 생성(본문에 스펙·계약·매트릭스 결과), 머지·배포·GH vars 리네임은 사용자 확인 후

## Self-Review 노트

- 계약 83개 중 이 계획이 커버하지 않는 URL: 없음 (Task 3·4·6·7·8이 전수, _not-found는 Next 아티팩트라 제외 — verify-dist 계약 파일에서 1행 제거 필요, Task 9에서 처리)
- 타입 일관성: `entrySlug`·`postUrl`·`tagCounts` 시그니처는 Task 1이 단일 정의, 이후 태스크는 소비만
- 순서 의존: Task 2의 검색 인덱스는 Task 1 컬렉션 필요, Task 5 rss는 Task 1 tagCounts 필요, Task 9는 3-8 완료 후 의미, Task 10은 9 통과 후
