# Cloudflare Workers 이전 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** services/blog을 Vercel에서 Cloudflare Workers(무료 티어)로 이전 가능한 상태로 전환한다. OG 이미지는 빌드 타임 정적 생성으로 바꾼다.

**Architecture:** ADR-0003 참조. 동적 /og 제거 → satori 빌드 스크립트, proxy.ts → middleware.ts, @opennextjs/cloudflare 어댑터 + wrangler.jsonc + open-next.config.ts, Vercel 전용 요소 제거. 배포·DNS는 계획 밖(사용자 인증 필요 — 핸드오프 섹션 참조).

**Tech Stack:** @opennextjs/cloudflare(최신), wrangler(최신), satori, @resvg/resvg-js.

## Global Constraints

- pnpm만 사용. 실행 위치 /Users/hyunjin/hyunjin/services/blog.
- TypeScript 변경 후 `npx tsc --noEmit` (허용 잔존: 스토리북 stories 3건).
- 기존 한국어 글 무수정. i18n 브랜치 산출물(middleware 로직, hreflang, locale 표면) 동작 보존 — Task D의 curl 매트릭스가 게이트.
- 워킹 트리에 무관 변경 다수: `git add -A` 금지, 커밋은 태스크별 명시 파일만. 커밋 트레일러:
  ```
  Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_016HpWmaPn4QAcU6FB37tvNM
  ```
- 디스크 여유 ~900MB: 큰 빌드 전 `rm -rf .next .open-next` 허용(재생성물).
- 어댑터 관련 수치·API는 사전 지식 금지 — 공식 문서(opennext.js.org/cloudflare, developers.cloudflare.com)와 `node_modules/wrangler/config-schema.json`으로 확인 (cloudflare 스킬 지침).

---

### Task A: OG 이미지 빌드 타임 정적 생성

**Files:**
- Create: `scripts/generate-og.mjs`
- Modify: `app/[locale]/blog/[...slug]/page.tsx`(generateMetadata의 imageList), `app/[locale]/layout.tsx`(og/twitter images), `package.json`(deps·build 배선), blog `.gitignore`(/public/og/)
- Delete: `app/og/route.tsx`

**Interfaces:**
- Produces: `public/og/blog/{locale}/{slug}.png`(비draft 전 글) + `public/og/default.png`. 메타데이터가 참조하는 URL 규약: `${siteUrl}/og/blog/${post.locale}/${post.slug}.png`, 기본 `${siteUrl}/og/default.png`.

- [ ] **Step 1: 의존성** — `pnpm add -D satori @resvg/resvg-js`

- [ ] **Step 2: scripts/generate-og.mjs 작성** (기존 route.tsx의 디자인·폰트 로직 승계, JSX 대신 satori 객체 트리)

```mjs
import { mkdirSync, writeFileSync } from 'fs'
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import { allBlogs } from '../.contentlayer/generated/index.mjs'

const OUT = './public/og'

async function loadGoogleFont(family, weight, text) {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&text=${encodeURIComponent(text)}`
  const css = await (await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })).text()
  const src = css.match(/src: url\((.+?)\) format/)?.[1]
  if (!src) throw new Error(`font load failed: ${family}`)
  return await (await fetch(src)).arrayBuffer()
}

const div = (style, children) => ({ type: 'div', props: { style, children } })

function template(title, subtitle) {
  return div(
    {
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      justifyContent: 'space-between', background: '#0a0a0a', padding: '72px 80px', fontFamily: 'Noto',
    },
    [
      div({ display: 'flex', fontSize: 30, fontWeight: 400, color: '#9ca3af' }, `hyunjin · ${subtitle}`),
      div({ display: 'flex', fontSize: 68, fontWeight: 700, color: '#ffffff', lineHeight: 1.25 }, title),
      div({ display: 'flex', fontSize: 26, fontWeight: 400, color: '#3b82f6' }, 'hyunjinlee.com'),
    ],
  )
}

async function render(title, subtitle, outPath) {
  const glyphs = `${title}${subtitle}hyunjin · hyunjinlee.com 이현진 (Hyunjin Lee)`
  const [bold, regular] = await Promise.all([
    loadGoogleFont('Noto Sans KR', 700, glyphs),
    loadGoogleFont('Noto Sans KR', 400, glyphs),
  ])
  const svg = await satori(template(title, subtitle), {
    width: 1200, height: 630,
    fonts: [
      { name: 'Noto', data: bold, weight: 700, style: 'normal' },
      { name: 'Noto', data: regular, weight: 400, style: 'normal' },
    ],
  })
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng()
  writeFileSync(outPath, png)
}

const posts = allBlogs.filter((p) => p.draft !== true)
mkdirSync(OUT, { recursive: true })
for (const post of posts) {
  const dir = `${OUT}/blog/${post.locale}`
  mkdirSync(dir, { recursive: true })
  await render(String(post.title).slice(0, 80), post.tags?.[0] ?? 'Software Engineer', `${dir}/${post.slug}.png`)
}
await render('이현진 (Hyunjin Lee)', 'Software Engineer', `${OUT}/default.png`)
console.log(`OG images generated: ${posts.length} posts + default`)
```

- [ ] **Step 3: 실행 검증** — `pnpm exec contentlayer2 build && node ./scripts/generate-og.mjs` → `ls public/og/blog/ko | wc -l`(비draft ko 글 수), `public/og/blog/en/closed-loop.png` 존재, `file public/og/default.png` = PNG 1200x630.

- [ ] **Step 4: 소비처 전환**
  - `[...slug]/page.tsx` generateMetadata: `ogSubtitle` 계산과 `/og?title=` imageList를 다음으로 교체:
    ```ts
    let imageList = [`${siteMetadata.siteUrl}/og/blog/${post.locale}/${post.slug}.png`]
    ```
  - `[locale]/layout.tsx` metadata: openGraph.images와 twitter.images의 `` `${siteMetadata.siteUrl}/og` `` → `` `${siteMetadata.siteUrl}/og/default.png` ``
  - `git rm app/og/route.tsx`

- [ ] **Step 5: 배선** — build 스크립트에 generate-og 삽입: `contentlayer2 build && validate-i18n && node ./scripts/generate-og.mjs && next build && postbuild`. blog `.gitignore`에 `/public/og/` 추가 (피드와 같은 빌드 산출물 관례).

- [ ] **Step 6: 검증** — `npx tsc --noEmit`(스토리북 3건 외 클린), dev 서버로 `curl -s localhost:3000/blog/closed-loop | grep -o 'og/blog/ko/closed-loop.png'` 확인 후 서버 종료.

- [ ] **Step 7: Commit** — 명시 파일만: scripts/generate-og.mjs, 두 page/layout, app/og/route.tsx(삭제), package.json, pnpm-lock.yaml, .gitignore(블로그 것).

---

### Task B: proxy.ts → middleware.ts

**Files:** Rename: `proxy.ts` → `middleware.ts` (함수명 `proxy` → `middleware`)

- [ ] **Step 1**: `git mv proxy.ts middleware.ts`, 파일 내 `export function proxy` → `export function middleware`. 주석의 'proxy' 표기도 정리. config(matcher)는 그대로.
- [ ] **Step 2**: dev 서버 기동 → curl 3종: `/ko/blog` 308, `Accept-Language: en`으로 `/` 307 /en, `/blog` 200 + `x-middleware-rewrite`. Next 16의 deprecation 경고가 로그에 떠도 동작하면 통과(ADR-0003 수용 리스크). 서버 종료.
- [ ] **Step 3**: Commit (middleware.ts만).

---

### Task C: OpenNext 어댑터 도입 + Vercel 전용 요소 제거

**Files:**
- Create: `wrangler.jsonc`, `open-next.config.ts`
- Modify: `next.config.ts`, `app/[locale]/layout.tsx`(vercel analytics 제거), `package.json`(deps·scripts), blog `.gitignore`(.open-next/)

**Interfaces:**
- Produces: `pnpm preview:cf` = `opennextjs-cloudflare build && opennextjs-cloudflare preview`, `pnpm deploy:cf` = build && deploy.

- [ ] **Step 1: 의존성** — `pnpm add @opennextjs/cloudflare` + `pnpm add -D wrangler`. 설치 후 **공식 문서(https://opennext.js.org/cloudflare/get-started)를 WebFetch로 확인**해 아래 설정 파일들이 현재 버전 규약과 맞는지 대조하고 다르면 문서를 따른다.

- [ ] **Step 2: wrangler.jsonc** (스키마: node_modules/wrangler/config-schema.json로 필드 검증)

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "hyunjin-blog",
  "main": ".open-next/worker.js",
  "compatibility_date": "2026-06-01",
  "compatibility_flags": ["nodejs_compat", "global_fetch_strictly_public"],
  "assets": {
    "directory": ".open-next/assets",
    "binding": "ASSETS",
    // HTML 라우트는 middleware(locale rewrite)를 위해 Worker 우선, 순수 정적 자산은 무과금 직접 서빙
    "run_worker_first": ["/*", "!/_next/static/*", "!/static/*", "!/og/*", "!/feed.xml", "!/en/*.xml", "!/tags/*", "!/search.json", "!/search-en.json"]
  },
  "services": [{ "binding": "WORKER_SELF_REFERENCE", "service": "hyunjin-blog" }]
}
```
주의: `!/tags/*`는 태그 피드(xml) 의도인데 태그 HTML 페이지도 제외해버린다 — **잘못된 예시**이며 올바른 패턴은 `"!/tags/*/feed.xml"`. run_worker_first가 글롭 부정 패턴을 지원하는지 config-schema로 확인하고, 미지원이면 `true`로 단순화(무료 한도의 4%라 비용 영향 없음).

- [ ] **Step 3: open-next.config.ts** (import 경로는 설치된 패키지의 실제 export를 확인해 맞춘다)

```ts
import { defineCloudflareConfig } from '@opennextjs/cloudflare'
import staticAssetsIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache'

// incrementalCache 누락 = SSG가 매 요청 SSR 폴백 + 500 — 가장 흔한 마이그레이션 함정 (ADR-0003)
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
})
```

- [ ] **Step 4: next.config.ts** — `initOpenNextCloudflareForDev()` 호출 추가(플러그인 체인 밖 사이드이펙트, `initOpenNextCloudflareForDev(); export default withContentlayer(...)` 형태), `images: { unoptimized: true }` 추가(기존 images 설정과 병합).

- [ ] **Step 5: Vercel 전용 제거** — `app/[locale]/layout.tsx`에서 `@vercel/speed-insights`·`@vercel/analytics` import와 `<SpeedInsights />`·`<NextAnalytics />` 제거, `pnpm remove @vercel/analytics @vercel/speed-insights`.

- [ ] **Step 6: scripts** — package.json에 `"preview:cf": "opennextjs-cloudflare build && opennextjs-cloudflare preview"`, `"deploy:cf": "opennextjs-cloudflare build && opennextjs-cloudflare deploy"`. `.gitignore`에 `.open-next/` 추가.

- [ ] **Step 7: 검증** — `npx tsc --noEmit`, `pnpm build`(Vercel식 빌드가 여전히 통과하는지 — postbuild 게이트 포함). Commit (명시 파일만).

---

### Task D: 통합 검증 게이트 (workerd 로컬)

**Files:** 없음 (검증 전용. 발견된 결함 수정은 원인 파일에 커밋)

- [ ] **Step 1**: `rm -rf .next && pnpm exec opennextjs-cloudflare build 2>&1 | tail -20` — 성공 + **Worker 번들 크기 기록** (출력의 gzip 크기 또는 `.open-next/worker.js` 크기. 무료 한도 3MiB 압축 대비 보고. @vercel/og 제거로 여유 있어야 정상).
- [ ] **Step 2**: `pnpm exec opennextjs-cloudflare preview` 백그라운드 (기본 포트 8787 가정, 출력에서 확인) 후 curl 매트릭스 전부 기록:

```bash
curl -sI localhost:8787/ | head -1                                    # 200 ko 이력서 홈
curl -s  localhost:8787/ | grep -o 'lang="ko-KR"'
curl -sI -H 'Accept-Language: en-US' localhost:8787/ | grep -iE 'HTTP|location'   # 307 /en
curl -sI localhost:8787/ko/blog | grep -iE 'HTTP|location'            # 308 /blog
curl -s  localhost:8787/en/blog | grep -c closed-loop                 # ≥1
curl -s  localhost:8787/blog/closed-loop | grep -io 'hreflang="[^"]*"' | sort -u  # 3종
curl -sI localhost:8787/og/blog/ko/closed-loop.png | grep -iE 'HTTP|content-type' # 200 image/png
curl -sI localhost:8787/en/tossbank | head -1                         # 404
curl -sI localhost:8787/asdf | head -1                                # 404
curl -s  localhost:8787/sitemap.xml | grep -c 'en/blog/closed-loop'   # ≥1
curl -sI localhost:8787/feed.xml | head -1                            # 200
curl -sI -X POST localhost:8787/api/newsletter | head -1              # 4xx/5xx라도 라우팅 자체는 도달(500 스택이 모듈 미지원이면 보고)
```
- [ ] **Step 3**: preview 종료. 실패 항목이 있으면 원인 수정 → 재검증 → 수정 커밋. 전부 통과하면 검증 결과를 보고서에 기록 (커밋 없음).

---

## 계획 밖: 배포 핸드오프 (사용자 인증 필요)

1. `pnpm exec wrangler login` (사용자 직접 — 브라우저 OAuth)
2. `pnpm deploy:cf` → `hyunjin-blog.<subdomain>.workers.dev`에서 프로덕션 스모크
3. Cloudflare 대시보드: 도메인 zone 추가 → 등록기관에서 네임서버 변경 → Workers Custom Domain으로 hyunjinlee.com 연결 (이 시점 402 장애 종료)
4. Web Analytics 토큰 발급 후 beacon 추가 (선택)
5. Workers Builds git 연동 (root: services/blog) 또는 수동 deploy 유지 결정
