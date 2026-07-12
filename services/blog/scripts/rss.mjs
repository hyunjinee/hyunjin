#!/usr/bin/env node
// pliny·contentlayer·app/tag-data.json 의존 제거 — scripts/lib/collect-posts.mjs(공유 node 파서)로 교체.
// astro build 이후 실행되는 postbuild 스크립트: dist/에 직접 쓴다. public/에 쓰면 다음 빌드에야
// 반영되는 순서 문제가 구 파이프라인의 고질이었다 (Task 5 브리프).
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { slug as githubSlug } from 'github-slugger'
import siteMetadata from '../data/siteMetadata.js'
import { publicPosts, tagCounts } from './shared/collect-posts.mjs'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const DIST = path.join(root, 'dist')

if (!existsSync(DIST)) {
  console.error('✗ rss.mjs: dist/ 가 없다 — pnpm astro:build 를 먼저 실행하라')
  process.exit(1)
}

const postUrl = (locale, slug) => (locale === 'en' ? `/en/blog/${slug}` : `/blog/${slug}`)

// pliny/utils/htmlEscaper.js와 동일 이스케이프 집합 — 의존만 제거, 동작은 그대로
function escapeXml(str) {
  const esc = { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }
  return String(str).replace(/[&<>'"]/g, (c) => esc[c])
}

function generateRssItem(post) {
  const url = `${siteMetadata.siteUrl}${postUrl(post.locale, post.slug)}`
  return `
  <item>
    <guid>${url}</guid>
    <title>${escapeXml(post.title)}</title>
    <link>${url}</link>
    ${post.summary ? `<description>${escapeXml(post.summary)}</description>` : ''}
    <pubDate>${post.date.toUTCString()}</pubDate>
    <author>${siteMetadata.email} (${siteMetadata.author})</author>
    ${post.tags.map((t) => `<category>${escapeXml(t)}</category>`).join('')}
  </item>
`
}

function generateRss(posts, page, language) {
  return `
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${escapeXml(siteMetadata.title)}</title>
      <link>${siteMetadata.siteUrl}${page.startsWith('en/') ? '/en/blog' : '/blog'}</link>
      <description>${escapeXml(siteMetadata.description)}</description>
      <language>${language}</language>
      <managingEditor>${siteMetadata.email} (${siteMetadata.author})</managingEditor>
      <webMaster>${siteMetadata.email} (${siteMetadata.author})</webMaster>
      <lastBuildDate>${posts[0].date.toUTCString()}</lastBuildDate>
      <atom:link href="${siteMetadata.siteUrl}/${page}" rel="self" type="application/rss+xml"/>
      ${posts.map(generateRssItem).join('')}
    </channel>
  </rss>
`
}

function writeFeed(posts, relPath, language) {
  if (posts.length === 0) return
  const outPath = path.join(DIST, relPath)
  mkdirSync(path.dirname(outPath), { recursive: true })
  writeFileSync(outPath, generateRss(posts, relPath, language))
}

// astro build가 public/(구 파이프라인이 남긴 stale feed.xml·tags/*)를 dist/로 그대로 복사해두므로,
// 이 스크립트가 유일한 진실이 되도록 먼저 지우고 다시 쓴다. 그래야 draft로 바뀐 글의 피드가
// (예: en 공개 글이 0편이 됐는데 public/en/feed.xml만 stale하게 남아있는 경우) dist에 새지 않는다.
rmSync(path.join(DIST, 'feed.xml'), { force: true })
rmSync(path.join(DIST, 'en', 'feed.xml'), { force: true })
rmSync(path.join(DIST, 'tags'), { recursive: true, force: true })

const ko = publicPosts('ko')
const en = publicPosts('en')

writeFeed(ko, 'feed.xml', siteMetadata.language)
writeFeed(en, 'en/feed.xml', 'en-US')

// 태그 피드는 공개 태그(tagCounts 기준)만 — draft 전용 태그의 빈 피드를 만들지 않는다
for (const tag of Object.keys(tagCounts('ko'))) {
  const filtered = ko.filter((post) => post.tags.some((t) => githubSlug(t) === tag))
  writeFeed(filtered, `tags/${tag}/feed.xml`, siteMetadata.language)
}

console.log(`RSS feed generated: ko=${ko.length} en=${en.length} tags=${Object.keys(tagCounts('ko')).length}`)
