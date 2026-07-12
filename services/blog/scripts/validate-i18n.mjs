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
    // 클라이언트 번들에 allBlogs(contentlayer)가 새지 않도록: 'use client' 파일은 lib/posts 대신 lib/locale만 import
    const isClient = /^\s*['"]use client['"]/m.test(src)
    if (isClient && /from\s+['"][^'"]*lib\/posts['"]/.test(src))
      err(`${rel}: 'use client' 파일은 lib/posts import 금지 — lib/locale을 사용하세요`)
  }
}

if (failed) process.exit(1)
console.log(`✓ i18n validation passed (ko ${koPosts.length}, en ${enPosts.length}, pairs ${pairSeen.size})`)
