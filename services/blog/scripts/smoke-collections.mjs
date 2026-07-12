#!/usr/bin/env node
// data/blog Content Collections이 기존 Next 빌드 산출물(out/blog/*.html)과 slug 계약을 지키는지 확인한다.
// pnpm astro:build로 만든 dist/smoke.html(astro.config.mjs build.format:'file')에서
// postsForLocale/entrySlug 결과를 읽어 검증.
import { execSync } from 'node:child_process'
import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))

function assert(cond, msg) {
  if (!cond) {
    console.error(`FAIL: ${msg}`)
    process.exit(1)
  }
}

execSync('pnpm exec astro build', { cwd: root, stdio: 'inherit' })

const smokeHtml = readFileSync(path.join(root, 'dist/smoke.html'), 'utf-8')
const match = smokeHtml.match(/<pre id="smoke-data">([\s\S]*?)<\/pre>/)
assert(match, 'smoke-data를 찾을 수 없음 — src/pages/smoke.astro 출력 확인')
const data = JSON.parse(match[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&'))

// raw count(draft 포함)가 실제 mdx 파일 수와 일치하는지
const koFileCount = readdirSync(path.join(root, 'data/blog')).filter((f) => f.endsWith('.mdx')).length
const enFileCount = readdirSync(path.join(root, 'data/blog/en')).filter((f) => f.endsWith('.mdx')).length
assert(data.ko.raw === koFileCount, `ko raw count 불일치: ${data.ko.raw} !== ${koFileCount}`)
assert(data.en.raw === enFileCount, `en raw count 불일치: ${data.en.raw} !== ${enFileCount}`)

// draft 필터가 실제로 걸러내는지 (raw > filtered)
assert(data.ko.raw > data.ko.slugs.length, 'draft 필터가 동작하지 않음 (ko raw와 filtered 카운트가 같음)')

// draft 제외 후 entrySlug 집합이 기존 out/blog/*.html 파일명 집합과 일치하는지
const expectedSlugs = readdirSync(path.join(root, 'out/blog'))
  .filter((f) => f.endsWith('.html'))
  .map((f) => f.replace(/\.html$/, ''))
  .sort()
const actualSlugs = [...data.ko.slugs].sort()
assert(
  JSON.stringify(actualSlugs) === JSON.stringify(expectedSlugs),
  `slug 집합 불일치\n  expected: ${expectedSlugs.join(', ')}\n  actual:   ${actualSlugs.join(', ')}`,
)

// draft가 findBySlug/translationFor/originalOf 체인에서 새지 않는지 (en/closed-loop.mdx는 draft: true)
assert(data.draftFilterHolds, 'findBySlug가 draft 엔트리를 반환함 (en/closed-loop는 draft여야 함)')

// markdown 파이프라인이 실제로 살아있는지 — smoke.astro가 렌더한 공개 글 1편의 출력 HTML에서 확인
assert(/class="token/.test(smokeHtml), 'rehype-prism-plus 토큰 클래스가 없음')
assert(/<h[1-6][^>]*\bid="/.test(smokeHtml), 'rehype-slug 헤딩 id가 없음')
assert(smokeHtml.includes('content-header-link'), 'rehype-autolink-headings 앵커가 없음')

console.log(
  `OK ko: raw=${data.ko.raw} filtered=${data.ko.slugs.length}, en: raw=${data.en.raw} filtered=${data.en.slugs.length}`,
)
console.log(`slug 집합 일치 (${expectedSlugs.length}개): ${expectedSlugs.join(', ')}`)
console.log('draft 필터·렌더 마커(prism/slug/autolink) 확인 완료')

// --- Task 2: 전역 셸(Base.astro/Header/404) 검증 ---

// (a) FOUC 방지 테마 인라인 스크립트 — Base.astro를 통하는 모든 페이지에 있어야 함
assert(smokeHtml.includes("localStorage.getItem('theme')"), 'FOUC 테마 인라인 스크립트가 없음 — Base.astro 확인')

// (b) Header nav 링크
for (const href of ['/blog', '/projects', '/talks', '/reports', '/calendar']) {
  assert(smokeHtml.includes(`href="${href}"`), `Header nav 링크 누락: ${href}`)
}

// (c) 404 페이지 마크업·테마 스크립트
const notFoundHtml = readFileSync(path.join(root, 'dist/404.html'), 'utf-8')
assert(notFoundHtml.includes('페이지를 찾을 수 없습니다'), '404.astro 마크업 누락')
assert(notFoundHtml.includes("localStorage.getItem('theme')"), '404 페이지에 테마 스크립트 없음')

console.log('전역 셸(테마 스크립트·헤더 nav·404) 확인 완료')

// 검색 인덱스: draft 제외 — build-search-index.mjs는 astro 컬렉션이 아니라 data/blog MDX를 직접 파싱하므로
// 위에서 구한 draft 필터링 결과(entrySlug 집합)와 문서 수·slug가 정확히 일치해야 draft가 새지 않은 것
execSync('node scripts/build-search-index.mjs', { cwd: root, stdio: 'inherit' })
const koIndex = JSON.parse(readFileSync(path.join(root, 'public/search.json'), 'utf-8'))
const enIndex = JSON.parse(readFileSync(path.join(root, 'public/search-en.json'), 'utf-8'))
assert(
  koIndex.length === data.ko.slugs.length,
  `search.json draft 누출 의심: 문서 ${koIndex.length}개 !== 공개 slug ${data.ko.slugs.length}개`,
)
assert(
  enIndex.length === data.en.slugs.length,
  `search-en.json draft 누출 의심: 문서 ${enIndex.length}개 !== 공개 slug ${data.en.slugs.length}개`,
)
assert(
  koIndex.every((doc) => data.ko.slugs.includes(doc.path.replace(/^blog\//, ''))),
  'search.json의 path가 draft 필터링된 slug 집합과 불일치',
)

console.log(`search index: ko=${koIndex.length} en=${enIndex.length} (draft 0건 확인됨)`)
