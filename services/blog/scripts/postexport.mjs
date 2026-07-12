import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'fs'
import { slug as slugify } from 'github-slugger'
import path from 'path'
import { allBlogs } from '../.contentlayer/generated/index.mjs'

// static export(out/)를 Cloudflare Workers Static Assets용 최종 트리로 가공한다.
// 핵심: 정적 파일은 /ko/... 경로로 구워지지만 정규 URL은 무프리픽스 → ko 트리를 루트로 병합해 실체화.
// 서버(middleware)가 하던 나머지 일은 _redirects(/ko 정규화 + legacy slug 301)로 이전.

const OUT = './out'

function fail(msg) {
  console.error(`✗ postexport: ${msg}`)
  process.exit(1)
}

// 1) 기본 404.html(무스타일 프레임워크 404)을 [locale] 레이아웃으로 프리렌더된 ko/404.html이 대체
rmSync(path.join(OUT, '404.html'), { force: true })

// 2) out/ko/** → out/** 병합. 충돌은 곧 public/ 자산과 페이지 경로가 겹친다는 뜻이므로 빌드 실패로 처리
function mergeUp(rel) {
  const srcDir = path.join(OUT, 'ko', rel)
  for (const entry of readdirSync(srcDir, { withFileTypes: true })) {
    const childRel = rel ? path.join(rel, entry.name) : entry.name
    const src = path.join(srcDir, entry.name)
    const dest = path.join(OUT, childRel)
    if (entry.isDirectory()) {
      mkdirSync(dest, { recursive: true })
      mergeUp(childRel)
    } else {
      if (existsSync(dest)) fail(`병합 충돌: ${childRel} 이 루트에 이미 존재`)
      renameSync(src, dest)
    }
  }
}
if (!existsSync(path.join(OUT, 'ko'))) fail('out/ko 가 없다 — EXPORT=1 빌드 산출물이 맞는지 확인')
mergeUp('')
rmSync(path.join(OUT, 'ko'), { recursive: true })

// 3) 루트 문서: /ko.html·/ko.txt(HTML + RSC flight)가 곧 무프리픽스 홈
for (const [from, to] of [
  ['ko.html', 'index.html'],
  ['ko.txt', 'index.txt'],
]) {
  if (!existsSync(path.join(OUT, from))) fail(`${from} 이 없다`)
  renameSync(path.join(OUT, from), path.join(OUT, to))
}

// 4) postbuild(rss)가 next build의 public→out 복사 이후에 public/에 쓰므로, 피드만 다시 복사
copyFileSync('./public/feed.xml', path.join(OUT, 'feed.xml'))
for (const f of readdirSync('./public/en').filter((f) => f.endsWith('.xml'))) {
  copyFileSync(path.join('./public/en', f), path.join(OUT, 'en', f))
}
for (const tag of readdirSync('./public/tags', { withFileTypes: true }).filter((d) => d.isDirectory())) {
  const feed = path.join('./public/tags', tag.name, 'feed.xml')
  if (existsSync(feed)) {
    mkdirSync(path.join(OUT, 'tags', tag.name), { recursive: true })
    copyFileSync(feed, path.join(OUT, 'tags', tag.name, 'feed.xml'))
  }
}

// 5) en soft-404 프루닝: [locale] gsp가 en도 생성하므로 (ko-only) 페이지들이 en으로도 구워지는데,
//    (ko-only)/layout의 notFound()가 export에선 404 UI를 200짜리 파일로 남긴다. 지우면 자산 miss →
//    not_found_handling이 진짜 HTTP 404를 준다. 판별은 Next가 남기는 .meta의 statusCode 404가 정본
//    (HTML 내용 매칭은 오탐: 200 페이지의 인라인 RSC flight에도 not-found 경계 텍스트가 프리로드됨).
const META_ROOT = '.next/server/app/en'
let pruned = 0
function pruneSoft404(rel) {
  for (const entry of readdirSync(path.join(META_ROOT, rel), { withFileTypes: true })) {
    const childRel = rel ? path.join(rel, entry.name) : entry.name
    if (entry.isDirectory()) pruneSoft404(childRel)
    else if (
      entry.name.endsWith('.meta') &&
      JSON.parse(readFileSync(path.join(META_ROOT, childRel), 'utf8')).status === 404
    ) {
      const base = path.join(OUT, 'en', childRel.replace(/\.meta$/, ''))
      rmSync(`${base}.html`, { force: true })
      rmSync(`${base}.txt`, { force: true }) // RSC flight도 함께 (클라이언트 네비 soft-404 방지)
      pruned++
    }
  }
}
pruneSoft404('')
if (!existsSync(path.join(OUT, 'en.html'))) fail('en 홈이 프루닝됨 — statusCode 판별 오류')

// 6) _redirects 생성: /ko 정규화 + legacy 한글 slug 301 (기존엔 페이지 컴포넌트가 요청 시점에 처리하던 것)
const rules = ['/ko / 301', '/ko/* /:splat 301']
const koPosts = allBlogs.filter((p) => (p.locale ?? 'ko') === 'ko' && p.draft !== true)
for (const p of koPosts) {
  const legacy = slugify(p._raw.flattenedPath.replace(/^.+?(\/)/, ''))
  if (legacy !== p.slug) rules.push(`/blog/${encodeURI(legacy)} /blog/${encodeURI(p.slug)} 301`)
}
const dynamicRules = rules.filter((r) => r.includes('*')).length
if (dynamicRules > 100 || rules.length - dynamicRules > 2000) fail('_redirects 규칙 한도 초과')
writeFileSync(path.join(OUT, '_redirects'), `${rules.join('\n')}\n`)

// 7) 게이트: 병합 결과가 서빙 가능한 트리인지 검증
if (!readFileSync(path.join(OUT, 'index.html'), 'utf8').includes('lang="ko')) fail('index.html 이 ko 홈이 아니다')
if (!readFileSync(path.join(OUT, '404.html'), 'utf8').includes('페이지를 찾을 수 없습니다'))
  fail('404.html 이 커스텀 404가 아니다')
if (!existsSync(path.join(OUT, 'en.html'))) fail('en.html 이 없다')
if (!existsSync(path.join(OUT, '_headers'))) fail('_headers 가 없다 (public/_headers 누락)')
// 공개 검색 인덱스에 draft가 새지 않았는지 (제목·요약·본문이 포함되므로)
const draftSlugs = allBlogs.filter((p) => p.draft === true).map((p) => p.slug)
for (const f of ['search.json', 'search-en.json']) {
  const docs = JSON.parse(readFileSync(path.join(OUT, f), 'utf8'))
  const leaked = docs.filter((d) => draftSlugs.includes(d.slug))
  if (leaked.length) fail(`${f} 에 draft 노출: ${leaked.map((d) => d.slug).join(', ')}`)
}

console.log(
  `✓ postexport 완료: ko 트리 루트 병합, en soft-404 ${pruned}개 프루닝, _redirects ${rules.length}개 규칙 (legacy ${rules.length - 2}개)`,
)
