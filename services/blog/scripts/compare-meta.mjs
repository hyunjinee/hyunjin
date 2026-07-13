#!/usr/bin/env node
// Astro(dist)와 기존 Next 정적 산출물(out)의 블로그 글 상세 메타를 필드 단위로 비교한다.
// 사용: node scripts/compare-meta.mjs <distDir> <outDir> <path> [<path> ...]
//   예: node scripts/compare-meta.mjs dist out blog/understanding-react-rendering
//
// 비교 대상: <title>, canonical, hreflang(alternate), <meta property="og:*"|"article:*">,
//           <meta name="twitter:*">, JSON-LD(application/ld+json)
// 허용 diff(비교 대상에서 의도적으로 제외): Next 전용 아티팩트 — RSC 페이로드(__next.*.txt류),
//   next/script 청크, <meta name="next-*">. 이 스크립트는 위 다섯 카테고리만 파싱하므로
//   그 외 Next 내부 산출물은 애초에 비교 범위 밖이다(허용 diff는 "범위 제외"로 처리, 별도 예외 목록 불필요).
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

function readHtml(rootDir, slugPath) {
  const candidates = [path.join(rootDir, `${slugPath}.html`), path.join(rootDir, slugPath, 'index.html')]
  const found = candidates.find(existsSync)
  if (!found) throw new Error(`HTML을 찾을 수 없음: ${candidates.join(' 또는 ')}`)
  return readFileSync(found, 'utf-8')
}

// Next(react-dom/server)는 속성값의 작은따옴표까지 개체참조로 이스케이프하지만(&#x27;), Astro는 HTML 사양대로
// 큰따옴표 속성 안의 작은따옴표는 이스케이프하지 않는다(services/blog/src/pages/debutsplan.astro의 "Debut's Plan"
// og:title에서 실측: dist는 리터럴 ', out은 &#x27;) — 렌더링 결과는 동일한 텍스트인데 직렬화 바이트만 다르다.
// 비교 전 디코드해 이 직렬화 차이를 오탐에서 제외한다.
function decodeEntities(str) {
  return str
    .replace(/&#x27;|&#39;|&apos;/gi, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
}

function attr(tag, name) {
  const m = tag.match(new RegExp(`${name}="([^"]*)"`, 'i'))
  return m ? decodeEntities(m[1]) : undefined
}

function extractFields(html) {
  const fields = { title: undefined, canonical: undefined, hreflang: {}, meta: {}, twitter: {}, jsonLd: undefined }

  // 첫 <title>만 — head의 문서 title은 항상 body보다 먼저 나오고, social-icons SVG 등이 접근성용
  // <title> 하위 요소를 body에 쓸 수 있어(/en <title> 패리티 리뷰에서 확인) /g 없는 첫 매치로 한정한다.
  const titleTag = html.match(/<title>([\s\S]*?)<\/title>/)
  if (titleTag) fields.title = decodeEntities(titleTag[1])

  const canonicalTag = html.match(/<link rel="canonical"[^>]*>/)
  if (canonicalTag) fields.canonical = attr(canonicalTag[0], 'href')

  // Next의 Metadata API는 이 태그를 hrefLang(대문자 L)으로 직렬화한다 — 'i' 없이는 out/의 홈·블로그
  // 목록 페이지(hreflang이 있는 페이지)에서 이 태그를 아예 못 찾아 항상 diff로 오탐한다.
  for (const tag of html.match(/<link rel="alternate" hreflang[^>]*>/gi) ?? []) {
    const lang = attr(tag, 'hreflang')
    fields.hreflang[lang] = attr(tag, 'href')
  }

  for (const tag of html.match(/<meta property="(?:og|article):[^"]*"[^>]*>/g) ?? []) {
    const key = attr(tag, 'property')
    const value = attr(tag, 'content')
    fields.meta[key] = fields.meta[key] ? [...[].concat(fields.meta[key]), value] : value
  }

  for (const tag of html.match(/<meta name="twitter:[^"]*"[^>]*>/g) ?? []) {
    fields.twitter[attr(tag, 'name')] = attr(tag, 'content')
  }

  const jsonLdTag = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)
  if (jsonLdTag) {
    try {
      fields.jsonLd = JSON.parse(jsonLdTag[1])
    } catch {
      fields.jsonLd = { __parseError: jsonLdTag[1].slice(0, 200) }
    }
  }

  return fields
}

// 값이 배열/스칼라 뒤섞여도 순서 무관 집합 비교 (article:author 등 다중 태그 대응)
function valuesEqual(a, b) {
  const arrA = [].concat(a ?? []).sort()
  const arrB = [].concat(b ?? []).sort()
  return JSON.stringify(arrA) === JSON.stringify(arrB)
}

function diffObjects(label, a, b, diffs) {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)])
  for (const key of keys) {
    if (!valuesEqual(a[key], b[key])) {
      diffs.push(`  ${label}.${key}: dist=${JSON.stringify(a[key])} out=${JSON.stringify(b[key])}`)
    }
  }
}

function comparePath(distDir, outDir, slugPath) {
  const distHtml = readHtml(distDir, slugPath)
  const outHtml = readHtml(outDir, slugPath)
  const dist = extractFields(distHtml)
  const out = extractFields(outHtml)

  const diffs = []
  if (dist.title !== out.title) {
    diffs.push(`  title: dist=${JSON.stringify(dist.title)} out=${JSON.stringify(out.title)}`)
  }
  if (dist.canonical !== out.canonical) {
    diffs.push(`  canonical: dist=${dist.canonical} out=${out.canonical}`)
  }
  diffObjects('hreflang', dist.hreflang, out.hreflang, diffs)
  diffObjects('meta', dist.meta, out.meta, diffs)
  diffObjects('twitter', dist.twitter, out.twitter, diffs)
  if (JSON.stringify(dist.jsonLd) !== JSON.stringify(out.jsonLd)) {
    diffs.push(`  jsonLd:\n    dist=${JSON.stringify(dist.jsonLd)}\n    out=${JSON.stringify(out.jsonLd)}`)
  }

  return diffs
}

const [distDir, outDir, ...paths] = process.argv.slice(2)
if (!distDir || !outDir || paths.length === 0) {
  console.error('사용: node scripts/compare-meta.mjs <distDir> <outDir> <path> [<path> ...]')
  process.exit(1)
}

let failed = false
for (const slugPath of paths) {
  const diffs = comparePath(distDir, outDir, slugPath)
  if (diffs.length === 0) {
    console.log(`OK  ${slugPath}: 필드 diff 0`)
  } else {
    failed = true
    console.log(`FAIL ${slugPath}:`)
    for (const line of diffs) console.log(line)
  }
}

process.exit(failed ? 1 : 0)
