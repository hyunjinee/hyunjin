---
status: accepted
supersedes-partially: 0004 (빌드 도구: Next output:'export' → Astro output:'static')
---

# Next.js → Astro 7 전환

Next.js(App Router)는 100% 프리렌더 사이트를 서빙하기 위해 contentlayer2·pliny·next-themes 등 무거운 런타임 의존을 끌고 다녔고, `astro dev`로 병행 구축한 WIP 트리(Task 1~9)가 기능 동등성에 도달한 뒤로는 Next 쪽 코드가 순수 부채였다. 이 ADR은 그 전환을 완결한 스위치(Task 10) 시점의 결정·발견·검증 게이트를 기록한다.

## 결정 사항

- **Astro 7** (`astro: ^7.0.7`). Task 1~9는 Astro 6로 시작했으나 마이그레이션 도중 7로 스캐폴드를 올렸다(`c462689`).
- **`build.format: 'file'`** (astro.config.mjs) — 기본값(디렉터리+index.html)은 Cloudflare Workers Static Assets의 `html_handling` 기본값(auto-trailing-slash)과 만나 `/x → /x/` 307을 모든 페이지에 붙인다. canonical·sitemap·내부 링크가 전부 무슬래시라 `trailingSlash: 'never'` + `build.format: 'file'` 조합으로 고정(`c4d2cb4`).
- **URL 계약 교정 13건**: `docs/migration-url-contract.txt`에서 soft-404 아티팩트를 제거했다 — `/tags/*` 12건(draft 전용 태그 페이지, 구 Next static export가 en만 프루닝하고 ko 트리에 남긴 200짜리 404 UI 잔재)과 `/_not-found` 1건(Next 내부 아티팩트). 실제 프로덕션 Worker는 이 URL들에 진짜 404를 서빙하므로 계약에서 빼는 쪽이 정답이었다(`dacc4a6`).
- **`og:locale` 채택**: Base.astro가 `<meta property="og:locale" content={ko_KR|en_US}>`를 유지한다 — Next 원본에 있던 태그를 이식 과정에서 버리지 않고 그대로 채택.
- **검색: kbar island 유지** (pagefind 등으로 교체하지 않음, 사용자 결정). `SearchProvider`로 트리 전체를 감싸던 pliny 구조는 걷어내고 Header 안 `Search.tsx` island 하나가 `/search.json`·`/search-en.json`을 fetch해 완결한다.
- **Accept-Language 첫 방문 감지 보류 유지**: ADR-0004에서 서버 부재로 보류했던 `/` → `/en` 307 자동 감지는 이번 전환에서도 재도입하지 않았다. 필요해지면 ko 홈에 클라이언트 스크립트로 추가하는 경로는 여전히 열려 있다.

## 발견

- **umami 분석이 애초에 무기능이었다**: `data/siteMetadata.js`의 `analytics.umamiAnalytics.umamiWebsiteId`는 `process.env.NEXT_UMAMI_ID`를 읽었지만 이 설정 객체를 실제로 소비하는 컴포넌트가 어디에도 없었다 — `src/layouts/Base.astro`가 처음부터 `import.meta.env.PUBLIC_UMAMI_ID`를 직접 읽는 별도 경로로 스크립트를 심고 있었다. Task 10에서 GHA `NEXT_UMAMI_ID` → `PUBLIC_UMAMI_ID` 전환(vars 리네임은 사용자 액션) + `siteMetadata.js`의 dead `analytics`/`comments`(giscus) 블록 중 giscus 잔재를 정리하면서 확인.
- **`astro dev`를 크래시시키는 CJS 버그**: `data/siteMetadata.js`가 `module.exports`(CJS)였는데, Vite의 PostCSS 설정 탐색(`postcss.config.js`, 역시 CJS)이 `package.json`에 `"type": "module"`이 없는 상태에서 우연히 동작하고 있었을 뿐 — 실제로는 `astro dev`가 `.astro`/`.tsx`에서 `import siteMetadata from '...siteMetadata.js'`로 끌어오는 경로에서 잠재적으로 깨지는 조합이었다. `"type": "module"` 추가 + `module.exports` → `export default` 전환으로 해결하고, 이 변경이 프로젝트의 유일한 CJS 파일이던 `postcss.config.js`(css 통합으로 삭제됨)를 제외하면 전부 이미 ESM이었음을 확인 후 안전하다고 판단.
- **`app/`(Next) 삭제가 드러낸 dangling import 2건**: `src/pages/test-mdx.mdx`(URL 계약 `/test-mdx` 소속, 삭제 불가)가 옛 `components/InteractiveButton`을 상대경로로 참조하고 있었다 — `src/components/islands/`로 이식된 적이 없던 누락이었다. `mdx-components.tsx`(Next App Router 전용 MDX 컴포넌트 매핑, `next/link`·`pliny`·`sugar-high` import)는 아무도 참조하지 않는 완전한 사체였다. 전자는 island로 이식, 후자는 삭제.
- **`src/`가 지금까지 한 번도 타입체크된 적이 없었다**: 구 `tsconfig.json`이 마이그레이션 기간 동안 Next 트리와의 충돌을 피하려고 `"exclude": ["src"]`를 걸어뒀다. `astro/tsconfigs/strict` 기반으로 재작성해 처음으로 `src/`·`scripts/`를 포함시키자 진짜 버그 3건이 나왔다(`Footer.astro`의 주석 처리된 social 필드 접근, `Lightbox.tsx`의 `Element` vs `HTMLElement` addEventListener 오버로드, `MobileNav.tsx`의 non-null 없는 ref) — 전부 수정.

## 검증 게이트

`scripts/verify-dist.mjs`가 `pnpm build` 체인 마지막 단계로 8종을 확인한다: (a) URL 계약 엄격 레이아웃(디렉터리 형식은 talks 정적 덱만 허용), (b) draft 누출(HTML/search.json/sitemap.xml/feed 전체), (c) 레거시 grep needle(`hyunjinlee.com/ko`, `href="/en/ko`) 부재, (d) 커스텀 404, (e) `_headers`·`_redirects`(7 규칙), (f) `feed.xml`·`en/feed.xml`·태그별 feed 항목 수 일치, (g) `sitemap.xml` URL ⊆ 계약, (h) en 표면 4개 페이지로 봉인.

## 부채로 남긴 것

- **storybook 계열**: `@storybook/nextjs`(Next 결합), `postcss.config.js` 삭제로 storybook의 Tailwind 처리 경로가 끊겼을 가능성 — 스코프 밖으로 명시적으로 보류.
- **plain `tsc --noEmit`은 `.astro` import를 해석 못 함**: `src/components/mdx/index.ts`의 `import Link from '../Link.astro'` 같은 구문은 raw tsc에서 `TS2307`을 낸다. `@astrojs/check`(`astro check`)가 공식 대응 도구이며 이걸로 0 errors를 확인했다(`tsconfig.json` 자체는 `astro/tsconfigs/strict`를 그대로 상속하므로 두 도구 모두 같은 설정을 본다).
- **`biome check .`의 포맷 전용 findings 15건**: `src/lib/talks/records/*.json`(Notion export 캐시, 의도적으로 minify됨), `data/githubContributions.json`, `.vscode/*.json` 등 — 전부 Task 10 이전부터 있던 파일이고 Next/Astro 전환과 무관해 건드리지 않았다.
