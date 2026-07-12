// dist/ 배포 게이트 — 구 postexport.mjs(out/) 게이트를 astro build(dist/, build.format:'file')용으로 승계.
// contentlayer 대신 scripts/shared/collect-posts.mjs로 draft·공개 글 집합을 얻는다.
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import siteMetadata from '../data/siteMetadata.js'
import { allEntries, publicPosts, tagCounts } from './shared/collect-posts.mjs'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const DIST = path.join(root, 'dist')

if (!existsSync(DIST)) {
  console.error('✗ verify-dist: dist/ 가 없다 — pnpm astro:build && node scripts/rss.mjs 를 먼저 실행하라')
  process.exit(1)
}

let failed = false
const err = (m) => {
  console.error(`✗ ${m}`)
  failed = true
}

// dist 전용 잉여로 허용하는 .html — Task 10에서 src/pages/smoke.astro를 지우면 이 배열도 비운다
const ALLOWED_EXTRA_HTML = ['smoke.html']

// 계약상 x/index.html 디렉터리 형식이 허용되는 talks 정적 덱(public/talks/*/index.html 유래, iframe 소스)
const DIRECTORY_FORMAT_ALLOWLIST = [
  'talks/asynchronous-javascript/',
  'talks/enterthon-2025/',
  'talks/graphql/',
  'talks/llm-growing/',
  'talks/MOZI/',
]

function walkHtml(dir, rel = '') {
  return readdirSync(path.join(dir, rel), { withFileTypes: true }).flatMap((entry) => {
    const childRel = rel ? path.join(rel, entry.name) : entry.name
    if (entry.isDirectory()) return walkHtml(dir, childRel)
    return entry.name.endsWith('.html') ? [childRel.split(path.sep).join('/')] : []
  })
}
const allHtml = walkHtml(DIST)

// ---- (a) URL 계약 엄격 레이아웃 ----
const contractUrls = readFileSync(path.join(root, 'docs/migration-url-contract.txt'), 'utf8')
  .split('\n')
  .map((l) => l.trim())
  .filter(Boolean)

// URL → dist 내 기대 상대경로. '/'로 끝나는 URL(디렉터리 형식)은 화이트리스트 소속일 때만 허용한다.
function expectedDistPath(url) {
  if (url === '/') return 'index.html'
  if (url.endsWith('/')) {
    const rel = url.slice(1)
    if (!DIRECTORY_FORMAT_ALLOWLIST.includes(rel))
      err(`계약 URL '${url}': 디렉터리 형식(x/index.html)은 talks 정적 덱만 허용`)
    return `${rel}index.html`
  }
  return `${url.slice(1)}.html`
}

const contractRelSet = new Set(contractUrls.map(expectedDistPath))
for (const url of contractUrls) {
  const rel = expectedDistPath(url)
  if (!existsSync(path.join(DIST, rel))) err(`계약 URL 누락: ${url} → dist/${rel} 없음`)
}

// 역방향: dist의 모든 .html이 계약(또는 허용된 잉여)에 대응하는지 — 계약 외 형식·유령 페이지 검출
for (const rel of allHtml) {
  if (contractRelSet.has(rel) || ALLOWED_EXTRA_HTML.includes(rel)) continue
  err(`계약 외 잉여 페이지: dist/${rel}`)
}

// ---- (b) draft 누출 ----
const draftEntries = allEntries().filter((e) => e.draft)
const postPath = (locale, slug) => (locale === 'en' ? `en/blog/${slug}` : `blog/${slug}`)
const postUrl = (locale, slug) => `${siteMetadata.siteUrl}/${postPath(locale, slug)}`

for (const { locale, slug } of draftEntries) {
  const rel = `${postPath(locale, slug)}.html`
  if (existsSync(path.join(DIST, rel))) err(`draft 누출: dist/${rel} 이 존재함 (slug=${slug})`)
}

for (const file of ['search.json', 'search-en.json']) {
  const docs = JSON.parse(readFileSync(path.join(DIST, file), 'utf8'))
  const leaked = docs.filter((d) => draftEntries.some((e) => postPath(e.locale, e.slug) === d.path))
  if (leaked.length) err(`${file} 에 draft 누출: ${leaked.map((d) => d.path).join(', ')}`)
}

const sitemapXml = readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8')
for (const { locale, slug } of draftEntries) {
  if (sitemapXml.includes(postUrl(locale, slug))) err(`sitemap.xml 에 draft 누출: ${postUrl(locale, slug)}`)
}

const tagFeedFiles = readdirSync(path.join(DIST, 'tags'), { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => `tags/${d.name}/feed.xml`)
for (const f of ['feed.xml', 'en/feed.xml', ...tagFeedFiles]) {
  const p = path.join(DIST, f)
  if (!existsSync(p)) continue
  const xml = readFileSync(p, 'utf8')
  for (const { locale, slug } of draftEntries) {
    if (xml.includes(postUrl(locale, slug))) err(`${f} 에 draft 누출: ${postUrl(locale, slug)}`)
  }
}

// ---- (c) grep needle 승계 (구 postbuild.mjs 게이트) ----
const needles = ['hyunjinlee.com/ko', 'href="/en/ko']
for (const rel of allHtml) {
  const html = readFileSync(path.join(DIST, rel), 'utf8')
  for (const needle of needles) {
    if (html.includes(needle)) err(`grep needle 발견: dist/${rel} 에 '${needle}'`)
  }
}

// ---- (d) 404 ----
const notFoundPath = path.join(DIST, '404.html')
if (!existsSync(notFoundPath)) err('dist/404.html 없음')
else if (!readFileSync(notFoundPath, 'utf8').includes('페이지를 찾을 수 없습니다'))
  err('404.html 이 커스텀 404가 아니다')

// ---- (e) _headers·_redirects ----
if (!existsSync(path.join(DIST, '_headers'))) err('dist/_headers 없음')
const redirectsPath = path.join(DIST, '_redirects')
if (!existsSync(redirectsPath)) {
  err('dist/_redirects 없음')
} else {
  const ruleCount = readFileSync(redirectsPath, 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#')).length
  if (ruleCount !== 7) err(`dist/_redirects 규칙 수 불일치: ${ruleCount} !== 7`)
}

// ---- (f) feed.xml·en/feed.xml·tags/*/feed.xml ----
const koPublicCount = publicPosts('ko').length
const feedItemCount = (readFileSync(path.join(DIST, 'feed.xml'), 'utf8').match(/<item>/g) ?? []).length
if (feedItemCount !== koPublicCount) err(`feed.xml item 수 불일치: ${feedItemCount} !== ${koPublicCount}`)
if (!existsSync(path.join(DIST, 'en/feed.xml'))) err('dist/en/feed.xml 없음 (0 item이어도 파일은 있어야 함)')

const publicTags = new Set(Object.keys(tagCounts('ko')))
const actualTagDirs = new Set(
  readdirSync(path.join(DIST, 'tags'), { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(path.join(DIST, 'tags', d.name, 'feed.xml')))
    .map((d) => d.name),
)
if (publicTags.size !== actualTagDirs.size || [...publicTags].some((t) => !actualTagDirs.has(t))) {
  err(`tags/*/feed.xml 집합 불일치: 기대 [${[...publicTags].join(',')}] 실제 [${[...actualTagDirs].join(',')}]`)
}

// ---- (g) sitemap.xml URL ⊆ 계약 ----
const sitemapLocs = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
const contractAbsSet = new Set(contractUrls.map((u) => `${siteMetadata.siteUrl}${u}`))
for (const loc of sitemapLocs) {
  if (!contractAbsSet.has(loc)) err(`sitemap.xml URL이 계약 밖: ${loc}`)
}

// ---- (h) en 표면 봉인 ----
const EN_SEALED = new Set(['en.html', 'en/blog.html', 'en/blog/page/1.html', 'en/tags.html'])
const enHtml = allHtml.filter((rel) => rel === 'en.html' || rel.startsWith('en/'))
if (enHtml.length !== EN_SEALED.size || enHtml.some((rel) => !EN_SEALED.has(rel))) {
  err(`en 표면 봉인 위반: 기대 [${[...EN_SEALED].join(',')}] 실제 [${enHtml.join(',')}]`)
}

if (failed) process.exit(1)
console.log(
  `✓ verify-dist 통과: 계약 URL ${contractUrls.length}개, draft ${draftEntries.length}개 누출 없음, feed ko=${koPublicCount} tags=${publicTags.size}`,
)
