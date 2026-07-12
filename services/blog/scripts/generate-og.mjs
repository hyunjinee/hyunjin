import { mkdirSync, writeFileSync } from 'fs'
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import { allBlogs } from '../.contentlayer/generated/index.mjs'

const OUT = './public/og'

async function loadGoogleFont(family, weight, text) {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&text=${encodeURIComponent(text)}`
  const css = await (await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })).text()
  const src = css.match(/src: url\((.+?)\) format/)?.[1]
  if (!src) throw new Error(`font load failed: ${family}`)
  return await (await fetch(src)).arrayBuffer()
}

const div = (style, children) => ({ type: 'div', props: { style, children } })

function template(title, subtitle) {
  return div(
    {
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      justifyContent: 'space-between', background: '#0a0a0a', padding: '72px 80px', fontFamily: 'Noto',
    },
    [
      div({ display: 'flex', fontSize: 30, fontWeight: 400, color: '#9ca3af' }, `hyunjin · ${subtitle}`),
      div({ display: 'flex', fontSize: 68, fontWeight: 700, color: '#ffffff', lineHeight: 1.25 }, title),
      div({ display: 'flex', fontSize: 26, fontWeight: 400, color: '#3b82f6' }, 'hyunjinlee.com'),
    ],
  )
}

async function render(title, subtitle, outPath) {
  const glyphs = `${title}${subtitle}hyunjin · hyunjinlee.com 이현진 (Hyunjin Lee)`
  const [bold, regular] = await Promise.all([
    loadGoogleFont('Noto Sans KR', 700, glyphs),
    loadGoogleFont('Noto Sans KR', 400, glyphs),
  ])
  const svg = await satori(template(title, subtitle), {
    width: 1200, height: 630,
    fonts: [
      { name: 'Noto', data: bold, weight: 700, style: 'normal' },
      { name: 'Noto', data: regular, weight: 400, style: 'normal' },
    ],
  })
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng()
  writeFileSync(outPath, png)
}

const posts = allBlogs.filter((p) => p.draft !== true)
mkdirSync(OUT, { recursive: true })
for (const post of posts) {
  const dir = `${OUT}/blog/${post.locale}`
  mkdirSync(dir, { recursive: true })
  await render(String(post.title).slice(0, 80), post.tags?.[0] ?? 'Software Engineer', `${dir}/${post.slug}.png`)
}
await render('이현진 (Hyunjin Lee)', 'Software Engineer', `${OUT}/default.png`)
console.log(`OG images generated: ${posts.length} posts + default`)
