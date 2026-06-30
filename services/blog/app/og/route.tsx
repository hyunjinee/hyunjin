import { ImageResponse } from 'next/og'

// 동적 OG 이미지: /og?title=...&subtitle=...
// 한글 글리프는 제목 텍스트에 맞춰 Google Fonts에서 서브셋만 받아온다(폰트 미제공 시 한글이 깨짐).
async function loadGoogleFont(family: string, weight: number, text: string): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&text=${encodeURIComponent(text)}`
  const css = await (await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })).text()
  const src = css.match(/src: url\((.+?)\) format/)?.[1]
  if (!src) throw new Error(`font load failed: ${family}`)
  return await (await fetch(src)).arrayBuffer()
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const title = (searchParams.get('title') || '이현진 (Hyunjin Lee)').slice(0, 80)
  const subtitle = (searchParams.get('subtitle') || 'Software Engineer').slice(0, 40)

  const glyphs = `${title}${subtitle}hyunjin · hyunjinlee.com 이현진 (Hyunjin Lee)`
  const [bold, regular] = await Promise.all([
    loadGoogleFont('Noto Sans KR', 700, glyphs),
    loadGoogleFont('Noto Sans KR', 400, glyphs),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0a0a0a',
          padding: '72px 80px',
          fontFamily: 'Noto',
        }}
      >
        <div style={{ fontSize: 30, fontWeight: 400, color: '#9ca3af' }}>{`hyunjin · ${subtitle}`}</div>
        <div style={{ display: 'flex', fontSize: 68, fontWeight: 700, color: '#ffffff', lineHeight: 1.25 }}>
          {title}
        </div>
        <div style={{ fontSize: 26, fontWeight: 400, color: '#3b82f6' }}>hyunjinlee.com</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Noto', data: bold, weight: 700, style: 'normal' },
        { name: 'Noto', data: regular, weight: 400, style: 'normal' },
      ],
    },
  )
}
