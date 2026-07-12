#!/usr/bin/env node
// contentlayer.config.ts:96-124 (toSearchText + createSearchIndex) 이식.
// Task 1의 lib(astro:content 기반)는 astro 런타임 밖에서 import할 수 없으므로,
// data/blog MDX 원본을 gray-matter로 직접 파싱해 인덱스를 만든다.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { slug as githubSlug } from 'github-slugger'
import matter from 'gray-matter'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const blogDir = path.join(root, 'data/blog')

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

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const p = path.join(dir, entry.name)
    return entry.isDirectory() ? walk(p) : entry.name.endsWith('.mdx') ? [p] : []
  })
}

// entry id: data/blog 기준 상대경로, 확장자 제거 (content.config.ts의 stripExt와 동일 규약)
function entryId(filePath) {
  return path
    .relative(blogDir, filePath)
    .replace(/\.mdx$/, '')
    .split(path.sep)
    .join('/')
}

// frontmatter slug 우선, 없으면 locale 세그먼트를 벗긴 경로를 kebab-case로 (lib/posts.ts entrySlug와 동일 규약)
function entrySlug(id, frontmatterSlug) {
  if (frontmatterSlug) return frontmatterSlug
  const segs = id.split('/')
  const rest = segs[0] === 'en' ? segs.slice(1) : segs
  return githubSlug(rest.join('/'))
}

const docs = walk(blogDir).map((filePath) => {
  const id = entryId(filePath)
  const { data, content } = matter(readFileSync(filePath, 'utf8'))
  const locale = id.startsWith('en/') ? 'en' : 'ko'
  const slug = entrySlug(id, data.slug)
  return {
    locale,
    draft: Boolean(data.draft),
    title: data.title,
    date: data.date,
    summary: data.summary,
    body: content,
    // kbar 선택 시 '/'+path로 이동한다. en 문서를 무프리픽스로 두면 ko 글 경로와 충돌하므로 en 프리픽스를 강제한다.
    // 선행 슬래시 없음 — 소비 측(Search island)이 '/'+path로 합친다.
    path: locale === 'en' ? `en/blog/${slug}` : `blog/${slug}`,
  }
})

for (const locale of ['ko', 'en']) {
  const documents = docs
    .filter((doc) => doc.locale === locale && !doc.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((doc) => ({
      title: doc.title,
      path: doc.path,
      summary: [doc.summary, toSearchText(doc.body)].filter(Boolean).join(' '),
    }))
  const filename = locale === 'ko' ? 'search.json' : 'search-en.json'
  writeFileSync(path.join(root, 'public', filename), JSON.stringify(documents))
}

console.log('Local search index generated...')
