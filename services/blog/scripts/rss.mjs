#!/usr/bin/env node
// pliny·contentlayer·app/tag-data.json 의존 제거 — scripts/shared/collect-posts.mjs(공유 node 파서)로 교체.
// astro build 이후 실행되는 postbuild 스크립트: dist/에 직접 쓴다. public/에 쓰면 다음 빌드에야
// 반영되는 순서 문제가 구 파이프라인의 고질이었다 (Task 5 브리프).
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { slug as githubSlug } from 'github-slugger'
import siteMetadata from '../data/siteMetadata.js'
import { publicPosts, tagCounts } from './shared/collect-posts.mjs'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const DIST = path.join(root, 'dist')

if (!existsSync(DIST)) {
  console.error('✗ rss.mjs: dist/ 가 없다 — pnpm build 를 먼저 실행하라')
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
  // 공개 글 0편(현재 en)이어도 사이트가 이 URL을 rel=alternate로 광고하므로 파일 자체는 있어야 한다 —
  // item 0개 채널은 RSS 2.0 스펙상 유효하다. lastBuildDate만 글이 없을 때 빌드 시각으로 대체.
  const lastBuildDate = (posts[0]?.date ?? new Date()).toUTCString()
  return `
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${escapeXml(siteMetadata.title)}</title>
      <link>${siteMetadata.siteUrl}${page.startsWith('en/') ? '/en/blog' : '/blog'}</link>
      <description>${escapeXml(siteMetadata.description)}</description>
      <language>${language}</language>
      <managingEditor>${siteMetadata.email} (${siteMetadata.author})</managingEditor>
      <webMaster>${siteMetadata.email} (${siteMetadata.author})</webMaster>
      <lastBuildDate>${lastBuildDate}</lastBuildDate>
      <atom:link href="${siteMetadata.siteUrl}/${page}" rel="self" type="application/rss+xml"/>
      ${posts.map(generateRssItem).join('')}
    </channel>
  </rss>
`
}

// skipIfEmpty: 태그 피드 전용 — draft 전용 태그의 빈 피드를 만들지 않기 위함(tagCounts가 이미
// 공개 글 있는 태그만 넘기므로 사실상 안전망). ko/en 메인 피드는 항상 쓴다(아래 이유 참고).
function writeFeed(posts, relPath, language, { skipIfEmpty = false } = {}) {
  if (skipIfEmpty && posts.length === 0) return
  const outPath = path.join(DIST, relPath)
  mkdirSync(path.dirname(outPath), { recursive: true })
  writeFileSync(outPath, generateRss(posts, relPath, language))
}

// public/의 stale 태그 피드(draft 전환으로 현재 tagCounts엔 없는 태그)가 astro build를 통해 dist에
// 복사된 채 남지 않도록 태그별 feed.xml만 지운다. dist/tags 디렉터리 자체를 지우면 Task 4가 astro
// 빌드로 만든 tags/index.html·tags/*/index.html까지 날아가 /tags 계열이 전부 404가 된다 — 실제로
// 겪은 버그라 반드시 파일 단위로 좁혀야 한다.
const tagsDir = path.join(DIST, 'tags')
if (existsSync(tagsDir)) {
  for (const entry of readdirSync(tagsDir, { withFileTypes: true })) {
    if (entry.isDirectory()) rmSync(path.join(tagsDir, entry.name, 'feed.xml'), { force: true })
  }
}

const ko = publicPosts('ko')
const en = publicPosts('en')

// ko/en 피드는 항상 쓴다(overwrite) — dist/index.html·dist/en/index.html이 무조건 이 URL을 광고하므로
// 공개 글 0편이어도 파일이 없으면 광고된 링크가 404가 된다. writeFileSync가 매번 전체를 덮어쓰므로
// public/에서 새어들어온 stale 내용이 있어도 여기서 항상 정확한 내용으로 교체된다.
writeFeed(ko, 'feed.xml', siteMetadata.language)
writeFeed(en, 'en/feed.xml', 'en-US')

// 태그 피드는 공개 태그(tagCounts 기준)만 — draft 전용 태그의 빈 피드를 만들지 않는다
for (const tag of Object.keys(tagCounts('ko'))) {
  const filtered = ko.filter((post) => post.tags.some((t) => githubSlug(t) === tag))
  writeFeed(filtered, `tags/${tag}/feed.xml`, siteMetadata.language, { skipIfEmpty: true })
}

console.log(`RSS feed generated: ko=${ko.length} en=${en.length} tags=${Object.keys(tagCounts('ko')).length}`)
