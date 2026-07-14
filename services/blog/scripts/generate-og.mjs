import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Resvg } from '@resvg/resvg-js'
import satori from 'satori'
import { publicPosts } from './shared/collect-posts.mjs'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const OUT = path.join(root, 'public/og')
const FONTS = path.join(root, 'scripts/fonts')

// fonts.googleapis.com 매 빌드 fetch 제거(CI 플레이크 원인) — Noto Sans KR 400/700을 정적 vendoring.
// satori는 woff2를 파싱 못 한다(@shuding/opentype.js 의존) — ttf만 사용.
const bold = readFileSync(path.join(FONTS, 'NotoSansKR-Bold.ttf'))
const regular = readFileSync(path.join(FONTS, 'NotoSansKR-Regular.ttf'))

const div = (style, children) => ({ type: 'div', props: { style, children } })

function template(title, subtitle) {
  return div(
    {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      background: '#0a0a0a',
      padding: '72px 80px',
      fontFamily: 'Noto',
    },
    [
      div({ display: 'flex', fontSize: 30, fontWeight: 400, color: '#9ca3af' }, `hyunjin · ${subtitle}`),
      div({ display: 'flex', fontSize: 68, fontWeight: 700, color: '#ffffff', lineHeight: 1.25 }, title),
      div({ display: 'flex', fontSize: 26, fontWeight: 400, color: '#3b82f6' }, 'hyunjinlee.com'),
    ],
  )
}

async function render(title, subtitle, outPath) {
  const svg = await satori(template(title, subtitle), {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Noto', data: bold, weight: 700, style: 'normal' },
      { name: 'Noto', data: regular, weight: 400, style: 'normal' },
    ],
  })
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng()
  writeFileSync(outPath, png)
}

const posts = [...publicPosts('ko'), ...publicPosts('en')]

// draft로 바뀐 글의 OG png가 public/og에 계속 남아있지 않도록(예: closed-loop) 매번 비우고 다시 그린다
rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })
for (const post of posts) {
  const dir = path.join(OUT, 'blog', post.locale)
  mkdirSync(dir, { recursive: true })
  await render(String(post.title).slice(0, 80), post.tags[0] ?? 'Software Engineer', path.join(dir, `${post.slug}.png`))
}
await render('이현진 (Hyunjin Lee)', 'Software Engineer', path.join(OUT, 'default.png'))
console.log(`OG images generated: ${posts.length} posts + default`)
