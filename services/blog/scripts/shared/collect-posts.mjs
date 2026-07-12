// data/blog MDX frontmatter를 astro 런타임 밖(plain node)에서 읽는 단일 소스.
// src/lib/posts.ts(entrySlug·entryLocale)는 astro:content 의존이라 여기서 import할 수 없으므로
// gray-matter로 직접 파싱하되, slug·locale 판별 규약만은 그쪽과 반드시 동일하게 유지한다.
// build-search-index.mjs·rss.mjs·generate-og.mjs 전부 이 모듈을 통해서만 data/blog를 읽는다 —
// 세 번째(네 번째) 파서를 만들지 않기 위한 지점.
import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { slug as githubSlug } from 'github-slugger'
import matter from 'gray-matter'

const root = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))))
const blogDir = path.join(root, 'data/blog')

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const p = path.join(dir, entry.name)
    return entry.isDirectory() ? walk(p) : entry.name.endsWith('.mdx') ? [p] : []
  })
}

// entry id: data/blog 기준 상대경로, 확장자 제거 (content.config.ts stripExt와 동일 규약)
function entryId(filePath) {
  return path
    .relative(blogDir, filePath)
    .replace(/\.mdx$/, '')
    .split(path.sep)
    .join('/')
}

// frontmatter slug 우선, 없으면 'en/' 접두사를 벗긴 경로를 kebab-case로 (src/lib/posts.ts entrySlug와 동일 규약)
export function entrySlug(id, frontmatterSlug) {
  if (frontmatterSlug) return frontmatterSlug
  const segs = id.split('/')
  const rest = segs[0] === 'en' ? segs.slice(1) : segs
  return githubSlug(rest.join('/'))
}

export function entryLocale(id) {
  return id.startsWith('en/') ? 'en' : 'ko'
}

// data/blog 전체(draft 포함)를 매 호출마다 다시 읽는다 — 파일 17개 규모에서 캐싱은 불필요한 복잡도다.
export function allEntries() {
  return walk(blogDir).map((filePath) => {
    const id = entryId(filePath)
    const { data, content } = matter(readFileSync(filePath, 'utf8'))
    return {
      id,
      locale: entryLocale(id),
      slug: entrySlug(id, data.slug),
      draft: Boolean(data.draft),
      title: data.title,
      date: new Date(data.date),
      tags: data.tags ?? [],
      summary: data.summary || undefined, // contentlayer가 남기던 summary:null 버그(RSS에 리터럴 "null" 출력)를 옮기지 않음
      translationOf: data.translationOf,
      body: content, // 검색 인덱스용 원문 마크다운
    }
  })
}

// src/lib/posts.ts postsForLocale과 동일 규약(draft 제외, date desc 정렬)
export function publicPosts(locale) {
  return allEntries()
    .filter((e) => e.locale === locale && !e.draft)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
}

// src/lib/tags.ts tagCounts와 동일 규약(draft 제외, githubSlug 키)
export function tagCounts(locale) {
  const counts = {}
  for (const post of publicPosts(locale)) {
    for (const tag of post.tags) {
      const key = githubSlug(tag)
      counts[key] = (counts[key] ?? 0) + 1
    }
  }
  return counts
}
