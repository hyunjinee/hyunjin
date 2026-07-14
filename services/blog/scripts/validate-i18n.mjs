// contentlayer2(allBlogs) 의존 제거 — scripts/shared/collect-posts.mjs(공유 node 파서)로 교체.
// 폐기 규칙(Next 전용, 이번에 제거): allBlogs 직접 import 금지 + 'use client' 파일의 lib/posts import 금지.
//   Next app/layouts/components 트리에서 서버 전용 contentlayer 데이터가 클라이언트 번들로 새지 않게
//   lib/posts.ts 경유를 강제하던 가드였다. Astro는 컴포넌트가 astro:content(src/content.config.ts)를
//   직접 import하는 구조라 이 가드가 지키던 "반드시 한 헬퍼를 거쳐라" 경계 자체가 없다 — 이식할 대상이 없어 폐기.
import { allEntries } from './shared/collect-posts.mjs'

let failed = false
const err = (m) => {
  console.error(`✗ ${m}`)
  failed = true
}

const entries = allEntries()
const koEntries = entries.filter((e) => e.locale === 'ko')
const enEntries = entries.filter((e) => e.locale === 'en')
const koBySlug = new Map(koEntries.map((e) => [e.slug, e]))

// locale 내 slug 유일성(slug 충돌 검사)
for (const [loc, list] of [
  ['ko', koEntries],
  ['en', enEntries],
]) {
  const seen = new Set()
  for (const e of list) {
    if (seen.has(e.slug)) err(`[${loc}] slug 중복: ${e.slug}`)
    seen.add(e.slug)
  }
}

// 번역 쌍 무결성 (양방향: 원문 존재 + 원문당 번역 1개)
const pairSeen = new Map()
for (const e of enEntries) {
  if (!e.translationOf) continue
  const original = koBySlug.get(e.translationOf)
  if (!original) {
    err(`${e.id}: translationOf '${e.translationOf}'에 해당하는 원문 없음`)
    continue
  }
  if (pairSeen.has(e.translationOf)) {
    err(`원문 '${e.translationOf}'에 번역이 2개: ${pairSeen.get(e.translationOf)}, ${e.slug}`)
  }
  pairSeen.set(e.translationOf, e.slug)
  if (!e.draft && original.draft) err(`${e.slug}: draft 원문의 번역이 공개 상태`)
  const oMod = original.lastmod ?? original.date
  const tMod = e.lastmod ?? e.date
  if (oMod > tMod) console.warn(`⚠ stale: 원문 '${original.slug}'(${oMod.toISOString()})이 번역 '${e.slug}'보다 최신`)
}

for (const e of koEntries) {
  if (e.translationOf) err(`${e.slug}: 한국어 원문에는 translationOf를 쓸 수 없음`)
}

if (failed) process.exit(1)
console.log(`✓ i18n validation passed (ko ${koEntries.length}, en ${enEntries.length}, pairs ${pairSeen.size})`)
