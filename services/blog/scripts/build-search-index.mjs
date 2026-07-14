#!/usr/bin/env node
// contentlayer.config.ts:96-124 (toSearchText + createSearchIndex) 이식.
// Task 1의 lib(astro:content 기반)는 astro 런타임 밖에서 import할 수 없으므로,
// scripts/shared/collect-posts.mjs(공유 node 파서, Task 5에서 추출)로 data/blog를 읽는다.
import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { publicPosts } from './shared/collect-posts.mjs'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))

// contentlayer.config.ts:96-104 — MDX 원문에서 검색 매칭용 평문만 추출
function toSearchText(raw) {
  if (!raw) return ''
  return raw
    .replace(/^(import|export)\s.*$/gm, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*`_~|-]+/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

for (const locale of ['ko', 'en']) {
  const documents = publicPosts(locale).map((doc) => ({
    title: doc.title,
    // kbar 선택 시 '/'+path로 이동한다. en 문서를 무프리픽스로 두면 ko 글 경로와 충돌하므로 en 프리픽스를 강제한다.
    // 선행 슬래시 없음 — 소비 측(Search island)이 '/'+path로 합친다.
    path: locale === 'en' ? `en/blog/${doc.slug}` : `blog/${doc.slug}`,
    summary: [doc.summary, toSearchText(doc.body)].filter(Boolean).join(' '),
  }))
  const filename = locale === 'ko' ? 'search.json' : 'search-en.json'
  writeFileSync(path.join(root, 'public', filename), JSON.stringify(documents))
}

console.log('Local search index generated...')
