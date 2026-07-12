#!/usr/bin/env node
// data/blog Content Collections이 기존 Next 빌드 산출물(out/blog/*.html)과 slug 계약을 지키는지 확인한다.
// pnpm astro:build로 만든 dist/smoke/index.html에서 postsForLocale/entrySlug 결과를 읽어 검증.
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

const smokeHtml = readFileSync(path.join(root, 'dist/smoke/index.html'), 'utf-8')
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
