# 블로그 표준 locale 라우팅(ko 무프리픽스 + /en) 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** services/blog에 `app/[locale]` 세그먼트 기반 한·영 이중 언어를 구현한다. 한국어 URL은 무프리픽스로 전부 유지, 영어는 `/en` 아래 자기 slug로 산다.

**Architecture:** Next.js 공식 i18n 가이드의 수동 패턴(proxy.ts locale 감지 + `app/[locale]` 세그먼트, 라이브러리 없음). 콘텐츠는 `data/blog/en/`에 영어 글, `translationOf` frontmatter로 쌍 연결. 일회성 한국어 페이지는 `(ko-only)` 라우트 그룹으로 en 접근을 차단한다. 근거 문서: `docs/adr/0002-standard-locale-routing.md`, `CONTEXT.md`.

**Tech Stack:** Next.js 16.1.1(App Router, proxy.ts), Contentlayer2 0.5.3, pliny 0.4.0, negotiator + @formatjs/intl-localematcher(신규, proxy 언어 매칭용).

## Global Constraints

- 패키지 매니저는 pnpm만 사용. 실행 위치는 `/Users/hyunjin/hyunjin/services/blog` (모노레포 명령은 `pnpm -F @hyunjin/blog <cmd>`).
- 모든 TypeScript 변경 후 `npx tsc --noEmit` 통과 필수 (사용자 글로벌 규칙).
- 기존 한국어 글 16개(`data/blog/*.mdx`)는 이동·수정 금지. 기존 한국어 URL 무변경.
- 프로덕션 코드에 `console.log` 금지 (검증 스크립트 등 node 스크립트는 예외, 기존 패턴 따름).
- 커밋은 태스크당 1개, 해당 태스크 파일만 정확히 staging. 메시지는 기존 스타일(`feat(blog): ...` 한국어 요약). push 금지.
- locale은 `'ko' | 'en'` 두 개, 기본 ko. en 표면은 홈·blog·tags만. 나머지 페이지는 전부 ko 전용.
- 커밋 메시지 끝에 다음 트레일러 포함:
  ```
  Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_016HpWmaPn4QAcU6FB37tvNM
  ```

## 목표 디렉토리 구조

```
app/
├── [locale]/
│   ├── layout.tsx            ← 루트 레이아웃 (구 app/layout.tsx, html lang 분기)
│   ├── not-found.tsx         ← 이동
│   ├── page.tsx              ← 홈: ko=이력서, en=영어 글 목록
│   ├── ResumeHome.tsx        ← 구 app/page.tsx 본문 추출
│   ├── Main.tsx              ← 이동
│   ├── blog/{page.tsx, page/[page]/page.tsx, [...slug]/page.tsx}
│   ├── tags/{page.tsx, [tag]/page.tsx}
│   └── (ko-only)/
│       ├── layout.tsx        ← locale !== 'ko' → notFound()
│       └── about/ projects/ talks/ reports/ calendar/ kakaoent/ tossbank/
│           berriz/ bclguide/ debutsplan/ source-of-truth/ dev/ 2025/ 2026/
│           compiler/ n/ test-mdx/
├── api/ og/ robots.ts sitemap.ts seo.tsx theme-providers.tsx tag-data.json  ← 루트 유지
proxy.ts                      ← 신규 (services/blog 루트)
lib/posts.ts                  ← 신규 (locale 필터 단일 진입점)
scripts/validate-i18n.mjs     ← 신규
```

---

### Task 1: Contentlayer 콘텐츠 모델 (locale, translationOf, slug 하위 디렉토리)

**Files:**
- Modify: `contentlayer.config.ts`

**Interfaces:**
- Produces: Blog 문서에 `locale: 'ko' | 'en'`(computed), `translationOf?: string`(frontmatter) 필드. `app/tag-data.json` 형태가 `{ ko: Record<string, number>, en: Record<string, number> }`로 변경. 검색 인덱스가 `public/search.json`(ko) + `public/search-en.json`(en) 두 개로 분리.

- [ ] **Step 1: locale 리졸버와 slug 리졸버 수정**

`contentlayer.config.ts`에서 기존 `resolveSlug`(47행 부근)를 다음으로 교체:

```ts
const LOCALES = ['ko', 'en']

// data/blog/en/* → 'en', 그 외 전부 'ko' (frontmatter 아닌 경로가 단일 진실)
const resolveDocLocale = (doc) => {
  const segs = doc._raw.flattenedPath.split('/')
  return segs[0] === 'blog' && segs[1] === 'en' ? 'en' : 'ko'
}

// frontmatter slug 우선. 없으면 첫 세그먼트(blog/authors)와 locale 세그먼트(en)를 벗긴 파일명을 kebab-case로
const resolveSlug = (doc) => {
  if (doc.slug) return doc.slug
  const segs = doc._raw.flattenedPath.split('/').slice(1)
  const rest = segs[0] === 'en' ? segs.slice(1) : segs
  return slug(rest.join('/'))
}
```

- [ ] **Step 2: computedFields에 locale 추가**

`computedFields` 객체(50행 부근)에 추가:

```ts
locale: { type: 'string', resolve: resolveDocLocale },
```

- [ ] **Step 3: Blog fields에 translationOf 추가**

`Blog` defineDocumentType의 `fields`에 추가 (`canonicalUrl` 아래):

```ts
translationOf: { type: 'string' }, // 번역 글에만: 원문(ko)의 slug
```

- [ ] **Step 4: structuredData url을 locale 인지형으로 수정**

기존 `url: \`${siteMetadata.siteUrl}/${doc._raw.flattenedPath.split('/')[0]}/${resolveSlug(doc)}\`` 를 다음으로 교체:

```ts
url:
  resolveDocLocale(doc) === 'en'
    ? `${siteMetadata.siteUrl}/en/blog/${resolveSlug(doc)}`
    : `${siteMetadata.siteUrl}/blog/${resolveSlug(doc)}`,
inLanguage: resolveDocLocale(doc) === 'en' ? 'en' : 'ko',
```

- [ ] **Step 5: createTagCount를 locale별 이중 맵으로 변경**

```ts
function createTagCount(allBlogs) {
  const tagCount = { ko: {}, en: {} }
  allBlogs.forEach((file) => {
    if (file.tags && (!isProduction || file.draft !== true)) {
      const loc = resolveDocLocale(file)
      file.tags.forEach((tag) => {
        const formattedTag = slug(tag)
        tagCount[loc][formattedTag] = (tagCount[loc][formattedTag] || 0) + 1
      })
    }
  })
  writeFileSync('./app/tag-data.json', JSON.stringify(tagCount))
}
```

- [ ] **Step 6: createSearchIndex를 locale별 파일로 분리**

```ts
function createSearchIndex(allBlogs) {
  if (siteMetadata?.search?.provider === 'kbar' && siteMetadata.search.kbarConfig.searchDocumentsPath) {
    for (const loc of LOCALES) {
      const localeBlogs = allBlogs.filter((b) => resolveDocLocale(b) === loc)
      const documents = allCoreContent(sortPosts(localeBlogs)).map((doc) => {
        const full = localeBlogs.find((b) => b.slug === doc.slug)
        const body = toSearchText(full?.body?.raw)
        return { ...doc, summary: [doc.summary, body].filter(Boolean).join(' ') }
      })
      const filename = loc === 'ko' ? 'search.json' : 'search-en.json'
      writeFileSync(`public/${filename}`, JSON.stringify(documents))
    }
    console.log('Local search index generated...')
  }
}
```

- [ ] **Step 7: 빌드로 검증**

```bash
cd /Users/hyunjin/hyunjin/services/blog
pnpm exec contentlayer2 build
node -e "const t=require('./app/tag-data.json'); if(!t.ko||!t.en) process.exit(1); console.log('tag-data ok', Object.keys(t.ko).length, 'ko tags')"
ls public/search.json public/search-en.json
node -e "const {allBlogs}=await import('./.contentlayer/generated/index.mjs'); const l=new Set(allBlogs.map(b=>b.locale)); console.log('locales:',[...l]); if(allBlogs.some(b=>!b.locale)) process.exit(1)" --input-type=module
```
Expected: tag-data ok, 두 검색 파일 존재, locales: ['ko'] (en 글이 아직 없으므로), exit 0.

- [ ] **Step 8: 소비처 임시 호환 확인**

`app/tags/page.tsx`와 `app/tags/[tag]/page.tsx`, `layouts/ListLayoutWithTags.tsx`, `scripts/rss.mjs`가 구형 flat tag-data를 읽고 있어 이 시점에 깨진다. Task 5·9 전까지 빌드를 깨뜨리지 않도록 **이 태스크에서 임시 shim은 만들지 않고**, Step 7의 contentlayer 단독 빌드까지만 확인하고 커밋한다 (전체 `pnpm build`는 Task 10 게이트).

- [ ] **Step 9: Commit**

```bash
git add contentlayer.config.ts app/tag-data.json public/search.json public/search-en.json
git commit -m "feat(blog): contentlayer에 locale·translationOf 모델 추가, 태그·검색 인덱스 locale 분리"
```

---

### Task 2: 번역 무결성 빌드 검증 스크립트

**Files:**
- Create: `scripts/validate-i18n.mjs`
- Modify: `package.json` (build 스크립트, validate 스크립트 추가)

**Interfaces:**
- Consumes: `.contentlayer/generated/index.mjs`의 `allBlogs` (Task 1의 locale/translationOf 필드)
- Produces: 규칙 위반 시 exit 1로 빌드 실패. 규칙: (1) translationOf는 실존 ko slug (2) 원문당 번역 최대 1개 (3) ko 글에 translationOf 금지 (4) 공개 번역이 draft 원문을 가리키면 실패 (5) 원문이 번역보다 최신이면 stale 경고(비실패) (6) app/·layouts/·components/에서 `allBlogs` 직접 참조 금지(lib/posts.ts 경유 강제)

- [ ] **Step 1: 스크립트 작성**

`scripts/validate-i18n.mjs`:

```mjs
import { readFileSync, readdirSync, statSync } from 'fs'
import path from 'path'
import { allBlogs } from '../.contentlayer/generated/index.mjs'

let failed = false
const err = (m) => {
  console.error(`✗ ${m}`)
  failed = true
}

const koPosts = allBlogs.filter((p) => p.locale === 'ko')
const enPosts = allBlogs.filter((p) => p.locale === 'en')
const koBySlug = new Map(koPosts.map((p) => [p.slug, p]))

// locale 내 slug 유일성
for (const [loc, posts] of [['ko', koPosts], ['en', enPosts]]) {
  const seen = new Set()
  for (const p of posts) {
    if (seen.has(p.slug)) err(`[${loc}] slug 중복: ${p.slug}`)
    seen.add(p.slug)
  }
}

// 번역 쌍 무결성
const pairSeen = new Map()
for (const post of enPosts) {
  if (!post.translationOf) continue
  const original = koBySlug.get(post.translationOf)
  if (!original) {
    err(`${post._raw.sourceFilePath}: translationOf '${post.translationOf}'에 해당하는 원문 없음`)
    continue
  }
  if (pairSeen.has(post.translationOf)) {
    err(`원문 '${post.translationOf}'에 번역이 2개: ${pairSeen.get(post.translationOf)}, ${post.slug}`)
  }
  pairSeen.set(post.translationOf, post.slug)
  if (!post.draft && original.draft) err(`${post.slug}: draft 원문의 번역이 공개 상태`)
  const oMod = new Date(original.lastmod || original.date)
  const tMod = new Date(post.lastmod || post.date)
  if (oMod > tMod) console.warn(`⚠ stale: 원문 '${original.slug}'(${original.lastmod || original.date})이 번역 '${post.slug}'보다 최신`)
}

for (const post of koPosts) {
  if (post.translationOf) err(`${post.slug}: 한국어 원문에는 translationOf를 쓸 수 없음`)
}

// allBlogs 직접 import 금지 (lib/posts.ts 경유 강제)
const ALLOWED = new Set(['lib/posts.ts'])
const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = path.join(dir, f)
    return statSync(p).isDirectory() ? walk(p) : /\.(ts|tsx)$/.test(f) ? [p] : []
  })
for (const dir of ['app', 'layouts', 'components']) {
  for (const file of walk(dir)) {
    const rel = file.split(path.sep).join('/')
    if (ALLOWED.has(rel)) continue
    const src = readFileSync(file, 'utf8')
    if (/\ballBlogs\b/.test(src)) err(`${rel}: allBlogs 직접 사용 금지 — lib/posts.ts 헬퍼를 사용하세요`)
  }
}

if (failed) process.exit(1)
console.log(`✓ i18n validation passed (ko ${koPosts.length}, en ${enPosts.length}, pairs ${pairSeen.size})`)
```

- [ ] **Step 2: 실패를 먼저 확인 (test-first)**

깨진 픽스처를 만들어 스크립트가 실제로 잡는지 확인:

```bash
mkdir -p data/blog/en
printf -- "---\ntitle: Broken Fixture\ndate: '2026-07-11'\ntranslationOf: no-such-slug\n---\n\nbody\n" > data/blog/en/__broken-fixture.mdx
pnpm exec contentlayer2 build
node ./scripts/validate-i18n.mjs; echo "exit=$?"
```
Expected: `✗ ... translationOf 'no-such-slug'에 해당하는 원문 없음`, exit=1.
주의: 이 시점에는 아직 app/ 등이 allBlogs를 직접 import하므로 (6)번 규칙도 다수 걸린다. 그 오류 나열은 정상이며 Task 5~8에서 소거된다. 이 태스크의 통과 기준은 픽스처 오류가 잡히는 것.

- [ ] **Step 3: 픽스처 제거 후 쌍 규칙 통과 확인**

```bash
rm data/blog/en/__broken-fixture.mdx
pnpm exec contentlayer2 build
node ./scripts/validate-i18n.mjs; echo "exit=$?"
```
Expected: allBlogs 직접 사용 오류만 남고(과도기), 쌍 관련 오류 없음.

- [ ] **Step 4: package.json 배선**

`scripts`에 추가/수정:

```json
"validate": "node ./scripts/validate-i18n.mjs",
"build": "cross-env INIT_CWD=$PWD contentlayer2 build && node ./scripts/validate-i18n.mjs && cross-env INIT_CWD=$PWD next build && cross-env NODE_OPTIONS='--experimental-json-modules' node ./scripts/postbuild.mjs",
```

- [ ] **Step 5: Commit**

```bash
git add scripts/validate-i18n.mjs package.json
git commit -m "feat(blog): 번역 무결성 빌드 검증 스크립트 추가 (translationOf·slug 중복·allBlogs 직접 참조)"
```

---

### Task 3: lib/posts.ts — locale 필터 단일 진입점

**Files:**
- Create: `lib/posts.ts`

**Interfaces:**
- Produces (이후 모든 태스크가 사용):
  - `type Locale = 'ko' | 'en'`, `const LOCALES: Locale[]`, `isLocale(v: string): v is Locale`
  - `postsForLocale(locale: Locale): Blog[]` — 해당 locale 전체(draft 포함, 정렬 안 함)
  - `coreListFor(locale: Locale): CoreContent<Blog>[]` — 정렬 + draft 필터(프로덕션) 목록
  - `originalOf(post: Blog): Blog | undefined` — 번역 → 원문
  - `translationFor(post: Blog): Blog | undefined` — 원문 → 번역 (역방향 조회)
  - `postUrl(locale: Locale, slug: string): string` — `/blog/x` 또는 `/en/blog/x`
  - `localePath(locale: Locale, path: string): string` — 표면 경로 프리픽스
  - `pairOf(post: Blog): { ko: Blog; en: Blog } | undefined` — 쌍이 완성된 경우만

- [ ] **Step 1: 파일 작성**

```ts
import { allBlogs, type Blog } from 'contentlayer/generated'
import { allCoreContent, sortPosts, type CoreContent } from 'pliny/utils/contentlayer'

export type Locale = 'ko' | 'en'
export const LOCALES: Locale[] = ['ko', 'en']
export const isLocale = (v: string): v is Locale => (LOCALES as string[]).includes(v)

export function postsForLocale(locale: Locale): Blog[] {
  return allBlogs.filter((p) => p.locale === locale)
}

export function coreListFor(locale: Locale): CoreContent<Blog>[] {
  return allCoreContent(sortPosts(postsForLocale(locale)))
}

export function originalOf(post: Blog): Blog | undefined {
  if (!post.translationOf) return undefined
  return allBlogs.find((p) => p.locale === 'ko' && p.slug === post.translationOf)
}

export function translationFor(post: Blog): Blog | undefined {
  if (post.locale !== 'ko') return undefined
  return allBlogs.find((p) => p.locale === 'en' && p.translationOf === post.slug)
}

export function pairOf(post: Blog): { ko: Blog; en: Blog } | undefined {
  if (post.locale === 'ko') {
    const en = translationFor(post)
    return en ? { ko: post, en } : undefined
  }
  const ko = originalOf(post)
  return ko ? { ko, en: post } : undefined
}

export function postUrl(locale: Locale, slug: string): string {
  return locale === 'en' ? `/en/blog/${slug}` : `/blog/${slug}`
}

export function localePath(locale: Locale, path: string): string {
  if (locale === 'ko') return path
  return path === '/' ? '/en' : `/en${path}`
}

export function findBySlug(locale: Locale, slug: string): Blog | undefined {
  return allBlogs.find((p) => p.locale === locale && p.slug === slug)
}
```

- [ ] **Step 2: 타입 체크**

```bash
npx tsc --noEmit
```
Expected: PASS (Blog 타입에 locale·translationOf가 Task 1 contentlayer 빌드로 생성돼 있어야 함. 실패 시 `pnpm exec contentlayer2 build` 재실행).

- [ ] **Step 3: Commit**

```bash
git add lib/posts.ts
git commit -m "feat(blog): locale 필터 단일 진입점 lib/posts 추가"
```

---

### Task 4: 라우팅 골격 전환 — proxy.ts + app/[locale] 재배치 (원자적)

proxy와 세그먼트 이동은 어느 한쪽만 있으면 사이트가 깨지므로 한 태스크로 묶는다. 이 태스크가 끝나면 **ko 표면은 기존과 완전히 동일하게 동작**해야 한다.

**Files:**
- Create: `proxy.ts`, `app/[locale]/layout.tsx`, `app/[locale]/(ko-only)/layout.tsx`, `app/[locale]/page.tsx`, `app/[locale]/ResumeHome.tsx`
- Move (git mv): `app/{blog,tags,not-found.tsx,Main.tsx}` → `app/[locale]/`, 일회성 페이지 전부 → `app/[locale]/(ko-only)/`
- Delete: `app/layout.tsx`, `app/page.tsx` (내용은 [locale]로 승계)
- Modify: `package.json` (deps)

**Interfaces:**
- Consumes: `lib/posts.ts`의 `isLocale`, `coreListFor`, `localePath`
- Produces: 모든 UI 라우트가 `params.locale`을 가짐. `/` = ko 이력서 홈, `/en` = 영어 글 목록 홈. `/ko/*` → 308 무프리픽스. 영어 브라우저 첫 방문 `/` → 307 `/en` + NEXT_LOCALE 쿠키.

- [ ] **Step 1: 의존성 추가**

```bash
pnpm add negotiator @formatjs/intl-localematcher
pnpm add -D @types/negotiator
```

- [ ] **Step 2: proxy.ts 작성** (services/blog 루트, app/과 같은 레벨)

```ts
import { type NextRequest, NextResponse } from 'next/server'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

const LOCALES = ['ko', 'en']
const DEFAULT_LOCALE = 'ko'
const LOCALE_COOKIE = 'NEXT_LOCALE'

function preferredLocale(request: NextRequest): string {
  const headers = { 'accept-language': request.headers.get('accept-language') ?? '' }
  const languages = new Negotiator({ headers }).languages()
  try {
    return match(languages, LOCALES, DEFAULT_LOCALE)
  } catch {
    return DEFAULT_LOCALE
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 기본 언어(ko)는 무프리픽스가 정규 URL: /ko/* 접근은 벗겨서 308
  if (pathname === '/ko' || pathname.startsWith('/ko/')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.replace(/^\/ko/, '') || '/'
    return NextResponse.redirect(url, 308)
  }

  // /en/*는 세그먼트가 그대로 처리
  if (pathname === '/en' || pathname.startsWith('/en/')) {
    return NextResponse.next()
  }

  // 첫 방문 언어 감지: 홈에서만, 쿠키가 없을 때 1회만. 글 URL은 절대 자동 이동하지 않는다.
  if (pathname === '/' && !request.cookies.has(LOCALE_COOKIE) && preferredLocale(request) === 'en') {
    const url = request.nextUrl.clone()
    url.pathname = '/en'
    const response = NextResponse.redirect(url, 307)
    response.cookies.set(LOCALE_COOKIE, 'en', { path: '/', maxAge: 60 * 60 * 24 * 365 })
    return response
  }

  // 무프리픽스 = ko를 내부 rewrite (주소창 URL 유지)
  const url = request.nextUrl.clone()
  url.pathname = `/ko${pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  // api·og·Next 내부·정적 파일(점 포함 경로: feed.xml, search.json, favicon 등)은 제외
  matcher: ['/((?!api|og|_next|.*\\..*).*)'],
}
```

- [ ] **Step 3: 라우트 이동 (git mv)**

```bash
cd /Users/hyunjin/hyunjin/services/blog
mkdir -p 'app/[locale]/(ko-only)'
git mv app/blog 'app/[locale]/blog'
git mv app/tags 'app/[locale]/tags'
git mv app/Main.tsx 'app/[locale]/Main.tsx'
git mv app/not-found.tsx 'app/[locale]/not-found.tsx'
for d in about projects talks reports calendar kakaoent tossbank berriz bclguide debutsplan source-of-truth dev 2025 2026 compiler n test-mdx; do
  git mv "app/$d" "app/[locale]/(ko-only)/$d"
done
```
`app/lecture`는 빈 디렉토리이므로 대상 아님(무시). `app/api`, `app/og`, `app/robots.ts`, `app/sitemap.ts`, `app/seo.tsx`, `app/theme-providers.tsx`, `app/tag-data.json`은 루트 유지.

- [ ] **Step 4: app/[locale]/layout.tsx 작성 (구 app/layout.tsx 승계 + locale 분기)**

구 `app/layout.tsx` 내용을 기반으로 작성 후 `git rm app/layout.tsx`. 변경점만 명시:

```tsx
// (기존 import 유지) + 추가:
import { notFound } from 'next/navigation'
import { LOCALES, isLocale, type Locale } from '@/lib/posts'

// ThemeProviders import 경로 변경: './theme-providers' → '../theme-providers'

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

// metadata export는 기존 그대로 유지

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const htmlLang = locale === 'en' ? 'en-US' : siteMetadata.language
  const feedPath = locale === 'en' ? '/en/feed.xml' : '/feed.xml'
  const searchConfig = {
    ...(siteMetadata.search as SearchConfig),
    kbarConfig: {
      ...(siteMetadata.search as SearchConfig & { kbarConfig: object }).kbarConfig,
      searchDocumentsPath: locale === 'en' ? 'search-en.json' : 'search.json',
    },
  } as SearchConfig
  const basePath = process.env.BASE_PATH || ''

  return (
    <html lang={htmlLang} className="scroll-smooth" suppressHydrationWarning>
      {/* 기존 <link>·<meta> 블록 그대로, 단 RSS 링크만 변경: */}
      {/* <link rel="alternate" type="application/rss+xml" href={`${basePath}${feedPath}`} /> */}
      <body className="bg-white pl-[calc(100vw-100%)] text-black antialiased dark:bg-gray-950 dark:text-white h-full">
        <BtoaPolyfill />
        <ThemeProviders>
          <Analytics analyticsConfig={siteMetadata.analytics as AnalyticsConfig} />
          <SectionContainer>
            <SearchProvider searchConfig={searchConfig}>
              <Header locale={locale as Locale} />
              <main className="flex-1">{children}</main>
              <NextAnalytics />
              <SpeedInsights />
            </SearchProvider>
            <Footer />
          </SectionContainer>
        </ThemeProviders>
      </body>
    </html>
  )
}
```
주의: `Header locale` prop은 Task 7에서 추가된다. 이 태스크 시점에는 `<Header />`로 두고 Task 7에서 교체한다.

- [ ] **Step 5: (ko-only) 가드 레이아웃 작성**

`app/[locale]/(ko-only)/layout.tsx`:

```tsx
import { notFound } from 'next/navigation'

// 이 그룹의 페이지들은 한국어 전용 콘텐츠(포트폴리오·발표·데모)라 /en 아래에 존재하지 않는다
export default async function KoOnlyLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (locale !== 'ko') notFound()
  return children
}
```

- [ ] **Step 6: 홈 분기 — ResumeHome 추출 + page.tsx**

구 `app/page.tsx`의 본문 전체를 `app/[locale]/ResumeHome.tsx`로 이동(`export default function ResumeHome()`로 개명). 이때 사용되지 않는 죽은 계산 두 줄(`sortPosts(allBlogs)`/`allCoreContent` 및 관련 import)을 제거한다(validate 스크립트의 allBlogs 금지 규칙 대상이기도 함). metadata export가 있으면 page.tsx로 옮긴다. `git rm app/page.tsx` 후 `app/[locale]/page.tsx` 작성:

```tsx
import ResumeHome from './ResumeHome'
import Main from './Main'
import { coreListFor, isLocale } from '@/lib/posts'
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  if (locale === 'ko') return <ResumeHome />
  return <Main posts={coreListFor('en')} />
}
```

- [ ] **Step 7: 이동으로 깨진 상대 import 보정**

`app/[locale]/blog/page.tsx`의 `import Main from '../Main'`은 이동 후에도 유효(둘 다 [locale] 아래). tsc로 전수 확인:

```bash
npx tsc --noEmit
```
Expected: 상대 경로·'./theme-providers' 계열 오류가 있으면 전부 수정 후 PASS. (`app/seo.tsx`를 참조하는 `genPageMetadata` import는 `'app/seo'` 절대 별칭이라 이동 영향 없음.)

- [ ] **Step 8: 동작 확인 (dev 서버 + curl 매트릭스)**

```bash
pnpm dev  # 별도 백그라운드
sleep 8
curl -sI localhost:3000/ | head -1                                     # 200 (ko 이력서 홈)
curl -s  localhost:3000/ | grep -o 'lang="ko-KR"'                      # ko-KR
curl -sI -H 'Accept-Language: en-US,en;q=0.9' localhost:3000/ | grep -iE '^(HTTP|location)'  # 307 → /en
curl -s  localhost:3000/en | grep -o 'lang="en-US"'                    # en-US
curl -sI localhost:3000/ko/blog | grep -iE '^(HTTP|location)'          # 308 → /blog
curl -sI localhost:3000/blog | head -1                                 # 200
curl -sI localhost:3000/en/tossbank | head -1                          # 404 (ko-only 가드)
curl -sI localhost:3000/tossbank | head -1                             # 200
curl -sI "localhost:3000/blog/$(python3 -c "import urllib.parse;print(urllib.parse.quote('브랜치 전략'))")" | head -1  # 기존 글 접근 스모크
```
Expected: 주석대로. 실패 시 proxy matcher/rewrite부터 의심.

- [ ] **Step 9: Commit**

```bash
git add -A app proxy.ts package.json pnpm-lock.yaml
git commit -m "feat(blog): app/[locale] 세그먼트 도입 — proxy 기반 ko 무프리픽스 + /en 라우팅 골격"
```

---

### Task 5: 목록·태그 페이지 locale 배선

**Files:**
- Modify: `app/[locale]/blog/page.tsx`, `app/[locale]/blog/page/[page]/page.tsx`, `app/[locale]/tags/page.tsx`, `app/[locale]/tags/[tag]/page.tsx`, `layouts/ListLayoutWithTags.tsx`

**Interfaces:**
- Consumes: `coreListFor`, `postsForLocale`, `isLocale`, `localePath` (lib/posts.ts), `tagData[locale]` (Task 1 형태)
- Produces: 모든 목록이 locale 필터를 통과. `allBlogs` 직접 import가 이 파일들에서 소거됨.

- [ ] **Step 1: blog/page.tsx**

```tsx
import { coreListFor, isLocale } from '@/lib/posts'
import { genPageMetadata } from 'app/seo'
import { notFound } from 'next/navigation'
import Main from '../Main'

export const metadata = genPageMetadata({ title: 'Blog' })

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return <Main posts={coreListFor(locale)} />
}
```
(주석 처리돼 있던 ListLayout 데드 코드는 함께 삭제.)

- [ ] **Step 2: blog/page/[page]/page.tsx**

```tsx
import ListLayout from '@/layouts/ListLayoutWithTags'
import { coreListFor, isLocale, LOCALES, type Locale } from '@/lib/posts'
import { notFound } from 'next/navigation'

const POSTS_PER_PAGE = 5

export const generateStaticParams = async () => {
  return LOCALES.flatMap((locale) => {
    const totalPages = Math.max(1, Math.ceil(coreListFor(locale).length / POSTS_PER_PAGE))
    return Array.from({ length: totalPages }, (_, i) => ({ locale, page: (i + 1).toString() }))
  })
}

export default async function Page({ params }: { params: Promise<{ locale: string; page: string }> }) {
  const { locale, page } = await params
  if (!isLocale(locale)) notFound()
  const posts = coreListFor(locale)
  const pageNumber = parseInt(page)
  const initialDisplayPosts = posts.slice(POSTS_PER_PAGE * (pageNumber - 1), POSTS_PER_PAGE * pageNumber)
  const pagination = { currentPage: pageNumber, totalPages: Math.ceil(posts.length / POSTS_PER_PAGE) }
  return <ListLayout posts={posts} initialDisplayPosts={initialDisplayPosts} pagination={pagination} title="All Posts" />
}
```
참고: [locale] 부모가 generateStaticParams를 가지므로 자식에서 locale을 직접 열거해도 되고 부모 params를 받아도 된다. 여기서는 flatMap 열거로 통일(부모 의존 없이 자명).

- [ ] **Step 3: tags/page.tsx — tagData[locale] 사용**

기존 `const tagCounts = tagData as Record<string, number>` 를:

```tsx
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const tagCounts = (tagData as Record<string, Record<string, number>>)[locale]
  // ...이하 동일 (tagKeys, sortedTags)
```
import에 `isLocale`·`notFound` 추가. `/tags/${slug(t)}` 링크는 `localePath(locale, \`/tags/${slug(t)}\`)`로 감싼다.

- [ ] **Step 4: tags/[tag]/page.tsx**

- `generateStaticParams`: locale별 tagData 키를 열거:
```tsx
export const generateStaticParams = async () => {
  const data = tagData as Record<string, Record<string, number>>
  return LOCALES.flatMap((locale) => Object.keys(data[locale]).map((tag) => ({ locale, tag: encodeURI(tag) })))
}
```
- 본문: `allBlogs.filter(...)` → `postsForLocale(locale).filter(...)` + `allCoreContent(sortPosts(...))` 유지, params에서 locale 추출·검증. RSS alternates URL은 `${siteMetadata.siteUrl}${localePath(locale, `/tags/${tag}/feed.xml`)}`.

- [ ] **Step 5: ListLayoutWithTags의 tag-data·링크 locale 처리**

파일을 열어 다음을 적용 ('use client' 컴포넌트임):
1. `import tagData from 'app/tag-data.json'` 사용부를 `usePathname()`으로 현재 locale 판별(`pathname.startsWith('/en') ? 'en' : 'ko'`) 후 `tagData[locale]`로 교체.
2. 내부 `<Link href="/blog...">`, `<Link href={\`/tags/...\`}>` 하드코딩 경로를 판별한 locale로 프리픽스(en일 때 `/en` 접두).
3. `pathname` 기반 페이지네이션 경로 계산이 있으면 `/en` 프리픽스를 보존하는지 확인.

- [ ] **Step 6: 검증**

```bash
npx tsc --noEmit
node ./scripts/validate-i18n.mjs   # allBlogs 위반 대상에서 이 5개 파일이 사라졌는지
curl -s localhost:3000/en/blog | grep -c 'No posts found'   # 1 (en 글 0개 시점)
curl -sI localhost:3000/tags | head -1                       # 200
curl -sI localhost:3000/en/tags | head -1                    # 200 (빈 태그)
```

- [ ] **Step 7: Commit**

```bash
git add 'app/[locale]/blog' 'app/[locale]/tags' layouts/ListLayoutWithTags.tsx
git commit -m "feat(blog): 목록·태그 페이지 locale 필터 배선"
```

---

### Task 6: 글 상세 페이지 — locale 조회, prev/next, hreflang, 교차 locale 리다이렉트, 전환 링크

**Files:**
- Modify: `app/[locale]/blog/[...slug]/page.tsx`, `layouts/PostLayout.tsx`, `layouts/PostSimple.tsx`, `layouts/PostBanner.tsx`

**Interfaces:**
- Consumes: `findBySlug`, `coreListFor`, `postsForLocale`, `pairOf`, `postUrl`, `isLocale` (lib/posts.ts)
- Produces: 레이아웃 3종에 optional prop `altLocale?: { href: string; label: string }` 추가. hreflang `<link rel="alternate">` 출력. `/en/blog/<ko-slug>` → 번역 있으면 그 URL로, 없으면 원문 URL로 307.

- [ ] **Step 1: generateStaticParams를 locale별로**

```tsx
export const generateStaticParams = async () => {
  return LOCALES.flatMap((locale) =>
    postsForLocale(locale)
      .filter((p) => !p.draft)
      .map((p) => ({ locale, slug: (p.slug as string).split('/').map((name) => decodeURI(name)) })),
  )
}
```

- [ ] **Step 2: generateMetadata — locale 조회 + hreflang + og locale**

기존 `allBlogs.find((p) => p.slug === slug)` → `findBySlug(locale, slug)`. 반환 객체에 추가:

```tsx
const pair = pairOf(post)
const canonical = `${siteMetadata.siteUrl}${postUrl(post.locale as Locale, post.slug as string)}`
// ...
return {
  // ...기존 필드 유지,
  alternates: {
    canonical,
    ...(pair && {
      languages: {
        ko: `${siteMetadata.siteUrl}${postUrl('ko', pair.ko.slug as string)}`,
        en: `${siteMetadata.siteUrl}${postUrl('en', pair.en.slug as string)}`,
        // 어느 locale에도 안 맞는 국제 사용자에게는 영어 (ADR-0002)
        'x-default': `${siteMetadata.siteUrl}${postUrl('en', pair.en.slug as string)}`,
      },
    }),
  },
  openGraph: { /* 기존 유지하되 */ locale: post.locale === 'en' ? 'en_US' : 'ko_KR' },
}
```

- [ ] **Step 3: 본문 — locale 조회 + prev/next 필터 + 교차 locale 리다이렉트**

import 변경: `import { notFound, permanentRedirect, redirect } from 'next/navigation'` (redirect 추가), `import { coreListFor, findBySlug, pairOf, postUrl, postsForLocale, isLocale, LOCALES, type Locale } from '@/lib/posts'`, 기존 `allBlogs` import 제거(단 `allAuthors`와 타입 import는 유지).

```tsx
export default async function Page({ params }: { params: Promise<{ locale: string; slug: string[] }> }) {
  const awaited = await params
  if (!isLocale(awaited.locale)) return notFound()
  const locale = awaited.locale
  const slug = decodeURI(awaited.slug.join('/'))

  const sortedCoreContents = coreListFor(locale) // 심사 지적 반영: prev/next가 같은 locale 안에서만 돈다
  const postIndex = sortedCoreContents.findIndex((p) => p.slug === slug)
  if (postIndex === -1) {
    // 1) 반대 locale에 존재하는 slug면 그쪽 정규 URL로 안내 (쌍이 있으면 요청 locale의 쌍으로)
    //    나중에 번역이 생기면 목적지가 바뀌므로 308(영구, 브라우저 캐시)이 아니라 307(redirect)을 쓴다
    const other: Locale = locale === 'ko' ? 'en' : 'ko'
    const crossPost = findBySlug(other, slug)
    if (crossPost) {
      const pair = pairOf(crossPost)
      const target = pair ? pair[locale] : crossPost
      redirect(postUrl(target.locale as Locale, target.slug as string))
    }
    // 2) 기존 legacy 슬러그 301 로직: allBlogs → postsForLocale('ko')로 교체해 유지
    const requested = slugify(slug)
    const legacy = postsForLocale('ko').find(
      (p) => p.slug === requested || slugify(p._raw.flattenedPath.replace(/^.+?(\/)/, '')) === requested,
    )
    if (legacy) permanentRedirect(`/blog/${legacy.slug}`)
    return notFound()
  }

  const prev = sortedCoreContents[postIndex + 1]
  const next = sortedCoreContents[postIndex - 1]
  const post = findBySlug(locale, slug) as Blog
  // ...authorDetails·jsonLd 기존 유지
  const pair = pairOf(post)
  const altLocale = pair
    ? locale === 'ko'
      ? { href: postUrl('en', pair.en.slug as string), label: 'Read in English →' }
      : { href: postUrl('ko', pair.ko.slug as string), label: '한국어로 읽기 →' }
    : undefined

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Layout content={mainContent} authorDetails={authorDetails} next={next} prev={prev} altLocale={altLocale}>
        <MDXLayoutRenderer code={post.body.code} components={components} toc={post.toc} />
      </Layout>
    </>
  )
}
```
주의: prev/next 링크는 레이아웃 내부에서 `/blog/${prev.slug}`로 하드코딩돼 있을 수 있음 → Step 4에서 함께 처리.

- [ ] **Step 4: 레이아웃 3종에 altLocale prop + prev/next 경로 locale 보정**

PostLayout.tsx, PostSimple.tsx, PostBanner.tsx 각각:
1. Props 인터페이스에 `altLocale?: { href: string; label: string }` 추가.
2. 메타 영역(날짜·readingTime 근처)에 서버 렌더 정적 링크 추가:
```tsx
{altLocale && (
  <div className="pt-2">
    <Link href={altLocale.href} className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
      {altLocale.label}
    </Link>
  </div>
)}
```
3. 파일 내 `\`/blog/${prev.slug}\``·`\`/blog/${next.slug}\`` 하드코딩을 확인하고, 콘텐츠의 locale을 알 수 있는 값(content.locale — CoreContent에 locale 포함됨)으로 `content.locale === 'en' ? \`/en/blog/...\` : \`/blog/...\`` 처리. 동일하게 태그 링크 `/tags/...`도 en일 때 `/en/tags/...`.

- [ ] **Step 5: 검증**

```bash
npx tsc --noEmit
curl -s "localhost:3000/blog/closed-loop" | grep -o 'hreflang="[^"]*"' | sort -u   # 이 시점엔 쌍이 없어 빈 출력이 정상
curl -sI "localhost:3000/en/blog/closed-loop" | grep -iE '^(HTTP|location)'        # 307 → /blog/closed-loop (교차 locale)
```

- [ ] **Step 6: Commit**

```bash
git add 'app/[locale]/blog/[...slug]/page.tsx' layouts/PostLayout.tsx layouts/PostSimple.tsx layouts/PostBanner.tsx
git commit -m "feat(blog): 글 상세 locale 배선 — hreflang·교차 locale 리다이렉트·전환 링크·prev/next 필터"
```

---

### Task 7: 내비게이션 — Header locale 전파, LocaleSwitcher, Main/Tag 링크

**Files:**
- Create: `components/LocaleSwitcher.tsx`
- Modify: `components/Header.tsx`, `data/headerNavLinks.ts`, `app/[locale]/Main.tsx`, `components/Tag.tsx`, `components/MobileNav.tsx`, `app/[locale]/layout.tsx`

**Interfaces:**
- Consumes: `localePath`, `type Locale` (lib/posts.ts)
- Produces: `Header`가 `locale: Locale` prop을 받음. headerNavLinks 항목에 `localized: boolean` 추가. en 표면에서는 localized 링크만 노출.

- [ ] **Step 1: headerNavLinks에 localized 플래그**

```ts
const headerNavLinks = [
  { href: '/', title: 'Home', localized: true },
  { href: '/blog', title: 'Blog', localized: true },
  // { href: '/tags', title: 'Tags', localized: true },
  { href: '/projects', title: 'Projects', localized: false },
  { href: '/talks', title: 'Talks', localized: false },
  { href: '/reports', title: 'Reports', localized: false },
  { href: '/calendar', title: 'Calendar', localized: false },
  // { href: '/about', title: 'About', localized: false },
]
```

- [ ] **Step 2: LocaleSwitcher 작성** (`components/LocaleSwitcher.tsx`)

```tsx
'use client'

import { usePathname } from 'next/navigation'
import Link from './Link'

// 글 상세는 [...slug] 페이지의 교차 locale 리다이렉트가 번역 쌍으로 보정한다
export default function LocaleSwitcher() {
  const pathname = usePathname() ?? '/'
  const isEn = pathname === '/en' || pathname.startsWith('/en/')
  const target = isEn ? pathname.replace(/^\/en/, '') || '/' : pathname === '/' ? '/en' : `/en${pathname}`
  return (
    <Link
      href={target}
      aria-label={isEn ? '한국어로 전환' : 'Switch to English'}
      className="font-medium text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400"
    >
      {isEn ? '한국어' : 'EN'}
    </Link>
  )
}
```

- [ ] **Step 3: Header locale prop + 링크 분기 + 스위처 배치**

`components/Header.tsx`:

```tsx
import { localePath, type Locale } from '@/lib/posts'
import LocaleSwitcher from './LocaleSwitcher'

const Header = ({ locale = 'ko' }: { locale?: Locale }) => {
  // ...headerClass 동일
  return (
    <header className={headerClass}>
      <Link href={localePath(locale, '/')} aria-label={siteMetadata.headerTitle}>
        {/* 기존 로고 블록 동일 */}
      </Link>
      <div className="flex items-center space-x-4 leading-5 sm:space-x-6">
        <div className="hidden items-center space-x-4 sm:flex sm:space-x-6">
          {headerNavLinks
            .filter((link) => link.href !== '/')
            .filter((link) => locale === 'ko' || link.localized)
            .map((link) => (
              <Link key={link.title} href={link.localized ? localePath(locale, link.href) : link.href} className="...기존 클래스">
                {link.title}
              </Link>
            ))}
        </div>
        <SearchButton />
        <LocaleSwitcher />
        <ThemeSwitch />
        <MobileNav />
      </div>
    </header>
  )
}
```
`app/[locale]/layout.tsx`의 `<Header />`를 `<Header locale={locale as Locale} />`로 교체. `MobileNav.tsx`도 같은 필터·localePath 규칙 적용(파일 열어 nav 매핑부에 동일 패턴).

- [ ] **Step 4: Main.tsx·Tag.tsx 링크 locale 보정**

- `Main.tsx`: 서버 컴포넌트이므로 post 데이터로 판별한다. `posts`의 각 항목에 `locale`(CoreContent에 포함)이 있으므로 `<Link href={post.locale === 'en' ? \`/en/blog/${slug}\` : \`/blog/${slug}\`}>` 로 교체. "모든 글 보기"류 하단 링크가 있으면 동일 보정.
- `components/Tag.tsx`: `usePathname` 기반 client 판별로 교체:
```tsx
'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { slug } from 'github-slugger'

const Tag = ({ text }: Props) => {
  const pathname = usePathname() ?? '/'
  const prefix = pathname === '/en' || pathname.startsWith('/en/') ? '/en' : ''
  return (
    <Link href={`${prefix}/tags/${slug(text)}`} className="...기존 클래스 유지">
      {text.split(' ').join('-')}
    </Link>
  )
}
```
(기존 Tag.tsx를 열어 클래스명은 그대로 승계.)

- [ ] **Step 5: 검증**

```bash
npx tsc --noEmit
curl -s localhost:3000/ | grep -o '>EN<'                    # 스위처 노출
curl -s localhost:3000/en | grep -o '>한국어<'
curl -s localhost:3000/en | grep -c 'href="/talks"'         # 0 (en 표면에서 ko 전용 링크 숨김)
curl -s localhost:3000/en/blog | grep -o 'href="/en/blog'   # en 프리픽스 링크
```

- [ ] **Step 6: Commit**

```bash
git add components/LocaleSwitcher.tsx components/Header.tsx components/MobileNav.tsx components/Tag.tsx data/headerNavLinks.ts 'app/[locale]/Main.tsx' 'app/[locale]/layout.tsx'
git commit -m "feat(blog): 헤더 locale 내비게이션 + 언어 스위처"
```

---

### Task 8: SEO — sitemap alternates, 표면 hreflang, genPageMetadata locale

**Files:**
- Modify: `app/sitemap.ts`, `app/seo.tsx`, `app/[locale]/page.tsx`, `app/[locale]/blog/page.tsx`

**Interfaces:**
- Consumes: `postsForLocale`, `translationFor`, `postUrl`, `localePath` (lib/posts.ts)
- Produces: sitemap이 양 locale URL + 번역 쌍 alternates 포함. 홈·블로그 목록에 ko/en 상호 hreflang.

- [ ] **Step 1: sitemap.ts 재작성**

```ts
import type { MetadataRoute } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { postsForLocale, translationFor, originalOf, postUrl, localePath, LOCALES } from '@/lib/posts'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl
  const abs = (p: string) => `${siteUrl}${p}`

  const postRoutes = LOCALES.flatMap((locale) =>
    postsForLocale(locale)
      .filter((post) => !post.draft)
      .map((post) => {
        const pairPost = locale === 'ko' ? translationFor(post) : originalOf(post)
        return {
          url: abs(postUrl(locale, post.slug as string)),
          lastModified: post.lastmod || post.date,
          ...(pairPost && {
            alternates: {
              languages: {
                ko: abs(postUrl('ko', (locale === 'ko' ? post : pairPost).slug as string)),
                en: abs(postUrl('en', (locale === 'en' ? post : pairPost).slug as string)),
              },
            },
          }),
        }
      }),
  )

  // 이중 언어 표면: 홈·블로그·태그. ko 전용 표면은 무프리픽스 단독
  const surfaceAlternates = (path: string) => ({
    languages: { ko: abs(path === '' ? '/' : `/${path}`), en: abs(localePath('en', path === '' ? '/' : `/${path}`)) },
  })
  const localizedSurfaces = ['', 'blog', 'tags'].flatMap((route) =>
    LOCALES.map((locale) => ({
      url: abs(localePath(locale, route === '' ? '/' : `/${route}`)),
      lastModified: new Date().toISOString().split('T')[0],
      alternates: surfaceAlternates(route),
    })),
  )
  const koOnlySurfaces = ['projects', 'talks', 'reports', 'calendar'].map((route) => ({
    url: abs(`/${route}`),
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...localizedSurfaces, ...koOnlySurfaces, ...postRoutes]
}
```

- [ ] **Step 2: genPageMetadata에 locale 옵션**

`app/seo.tsx`의 PageSEOProps에 `locale?: 'ko' | 'en'` 추가, openGraph에 `locale: locale === 'en' ? 'en_US' : 'ko_KR'` 적용(기본 ko_KR 유지).

- [ ] **Step 3: 홈·블로그 목록 hreflang**

`app/[locale]/page.tsx`에 generateMetadata 추가:

```tsx
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return {
    alternates: {
      canonical: `${siteMetadata.siteUrl}${locale === 'en' ? '/en' : '/'}`,
      languages: { ko: `${siteMetadata.siteUrl}/`, en: `${siteMetadata.siteUrl}/en`, 'x-default': `${siteMetadata.siteUrl}/en` },
    },
    ...(locale === 'en' && { title: 'Blog', description: 'Posts in English' }),
  }
}
```
`app/[locale]/blog/page.tsx`의 `metadata`를 같은 패턴의 generateMetadata로 교체(`/blog` ↔ `/en/blog`).

- [ ] **Step 4: 검증**

```bash
npx tsc --noEmit
curl -s localhost:3000/sitemap.xml | grep -c 'xhtml:link'    # >0 (alternates 출력)
curl -s localhost:3000/ | grep -o 'hreflang="x-default"'
```

- [ ] **Step 5: Commit**

```bash
git add app/sitemap.ts app/seo.tsx 'app/[locale]/page.tsx' 'app/[locale]/blog/page.tsx'
git commit -m "feat(blog): sitemap alternates·표면 hreflang·og locale"
```

---

### Task 9: RSS locale 분리

**Files:**
- Modify: `scripts/rss.mjs`

**Interfaces:**
- Consumes: `.contentlayer/generated`의 locale 필드, `app/tag-data.json`의 `{ko, en}` 형태
- Produces: `public/feed.xml`(ko) + `public/en/feed.xml`(en, 글 있을 때만) + ko 태그 피드(기존 경로 유지)

- [ ] **Step 1: rss.mjs 수정**

핵심 변경 (전체 구조는 유지):

```mjs
const postUrl = (post) => (post.locale === 'en' ? `${'/'}en/blog/${post.slug}` : `/blog/${post.slug}`)

const generateRssItem = (config, post) => `
  <item>
    <guid>${config.siteUrl}${postUrl(post)}</guid>
    <title>${escape(post.title)}</title>
    <link>${config.siteUrl}${postUrl(post)}</link>
    ...기존 동일
`

const generateRss = (config, posts, page = 'feed.xml', language = config.language) => `
  ...<language>${language}</language>... (기존 language 자리만 파라미터화)
`

async function generateRSS(config, allBlogs, page = 'feed.xml') {
  const publish = (posts) => posts.filter((post) => post.draft !== true)
  const ko = publish(allBlogs.filter((p) => p.locale === 'ko'))
  const en = publish(allBlogs.filter((p) => p.locale === 'en'))

  if (ko.length > 0) writeFileSync(`./public/${page}`, generateRss(config, sortPosts(ko)))
  if (en.length > 0) {
    mkdirSync('./public/en', { recursive: true })
    writeFileSync(`./public/en/${page}`, generateRss(config, sortPosts(en), `en/${page}`, 'en-US'))
  }

  // 태그 피드는 ko만 유지 (en 태그 피드는 수요 생기면)
  for (const tag of Object.keys(tagData.ko)) {
    const filteredPosts = ko.filter((post) => post.tags.map((t) => slug(t)).includes(tag))
    if (filteredPosts.length === 0) continue
    const rss = generateRss(config, filteredPosts, `tags/${tag}/${page}`)
    const rssPath = path.join('public', 'tags', tag)
    mkdirSync(rssPath, { recursive: true })
    writeFileSync(path.join(rssPath, page), rss)
  }
}
```
(`tagData` 참조를 `tagData.ko`로 바꾸는 것이 형태 변경 대응의 핵심.)

- [ ] **Step 2: 실행 확인**

```bash
node -e "import('./scripts/rss.mjs').then(m => m.default())" 2>/dev/null || node --experimental-json-modules -e "const m = await import('./scripts/rss.mjs'); m.default()" --input-type=module
head -3 public/feed.xml
ls public/en/feed.xml 2>/dev/null || echo "en 피드 없음 (en 글 0개, 정상)"
```

- [ ] **Step 3: Commit**

```bash
git add scripts/rss.mjs
git commit -m "feat(blog): RSS 피드 locale 분리 (feed.xml + en/feed.xml)"
```

---

### Task 10: 첫 번역 글 + 전체 빌드 게이트 + E2E 매트릭스

**Files:**
- Create: `data/blog/en/closed-loop.mdx` (closed-loop.mdx의 영어 번역)

**Interfaces:**
- Consumes: 전체 시스템. 이 태스크가 이 계획의 인수 조건이다.

- [ ] **Step 1: 번역 글 작성**

`data/blog/closed-loop.mdx`를 읽고 충실히 영어로 번역해 `data/blog/en/closed-loop.mdx` 생성. frontmatter:

```yaml
---
title: <원문 제목의 영어 번역>
date: <원문과 동일>
tags: <원문과 동일>
summary: <summary의 영어 번역>
translationOf: closed-loop
---
```
slug는 파일명에서 `closed-loop`로 나오며 ko slug와 같지만 locale이 달라 유일성 규칙에 걸리지 않는다(의도된 케이스 검증).

- [ ] **Step 2: 검증 스크립트 통과 확인**

```bash
pnpm exec contentlayer2 build && node ./scripts/validate-i18n.mjs
```
Expected: `✓ i18n validation passed (ko 16, en 1, pairs 1)`, allBlogs 직접 사용 위반 0.

- [ ] **Step 3: 프로덕션 빌드 게이트 (ADR-0002의 정적 생성 검증)**

```bash
pnpm build 2>&1 | tail -40
```
Expected: 성공. 출력 라우트 표에서 `/blog/[...slug]`·`/en` 계열이 ● (SSG)인지 확인. ƒ(dynamic)로 떨어진 페이지가 있으면 원인(cookies()/headers() 사용 등)을 제거하고 재빌드.

- [ ] **Step 4: E2E 매트릭스 (프로덕션 서버)**

```bash
pnpm serve &  # next start
sleep 5
# 쌍이 생긴 후의 전체 매트릭스
curl -s localhost:3000/blog/closed-loop | grep -o 'hreflang="[^"]*"' | sort -u   # ko, en, x-default
curl -s localhost:3000/en/blog/closed-loop | grep -o 'hreflang="[^"]*"' | sort -u # 동일 3종 (상호성)
curl -s localhost:3000/en/blog/closed-loop | grep -o '한국어로 읽기'
curl -s localhost:3000/blog/closed-loop | grep -o 'Read in English'
curl -s localhost:3000/en/blog | grep -c 'closed-loop'                            # ≥1 (en 목록 노출)
curl -s localhost:3000/blog | grep -o 'lang="ko-KR"'
curl -sI -H 'Accept-Language: en-US' localhost:3000/ | grep -i location           # /en
curl -sI localhost:3000/ko/blog/closed-loop | grep -i location                    # /blog/closed-loop
curl -sI localhost:3000/en/tossbank | head -1                                     # 404
curl -s localhost:3000/sitemap.xml | grep -c 'en/blog/closed-loop'                # ≥1
curl -s localhost:3000/en/feed.xml | grep -c '<item>'                             # 1
```

- [ ] **Step 5: 품질 게이트**

```bash
npx tsc --noEmit && pnpm check
```

- [ ] **Step 6: Commit**

```bash
git add data/blog/en/closed-loop.mdx app/tag-data.json public/search.json public/search-en.json
git commit -m "feat(blog): 첫 영어 번역 글(closed-loop) + 이중 언어 E2E 검증"
```

---

## 계획 밖 (의도적 제외, YAGNI)

- en 태그별 RSS 피드, en 전용 About/Projects, 한국어 UI 문자열(카탈로그), 제3 언어, 홈 외 경로의 언어 감지 리다이렉트. 전부 수요가 생기면.
- `og/route.tsx`·newsletter API·robots.ts 무변경.
