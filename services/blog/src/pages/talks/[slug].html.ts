// app/[locale]/(ko-only)/talks/[slug]/page.tsx + TalkPresentation.tsx 이식 — pdfUrl·video가 모두 없는 talk
// (HTML 데크 iframe 갈래)만 이 파일이 다룬다. [slug].astro의 파일 상단 주석 참고: 이 talk들은
// public/talks/<slug>/(정적 데크, index.html+assets)와 같은 dist 경로에 놓여 .astro(directory 포맷)로는
// 못 만든다. 엔드포인트 파일명에 .html을 박아 talks/<slug>.html(파일)로 강제 출력 — talks/<slug>/index.html
// (데크)과 다른 물리 경로라 충돌하지 않는다. 배포(Cloudflare Workers Static Assets, wrangler.jsonc)의
// 기본 html_handling이 확장자 없는 요청에 .html을 자동으로 붙여 서빙하므로(과거 Next 정적 export가
// out/talks/<slug>.html + out/talks/<slug>/index.html로 공존시켰던 것과 동일 메커니즘, 실측 확인)
// /talks/<slug>(페이지)·/talks/<slug>/(데크) 두 URL 모두 계약대로 유지된다.
//
// Base.astro를 못 쓴다(엔드포인트에서 .astro 컴포넌트를 렌더하려면 Astro Container API가 필요한데, 이
// 프로젝트의 astro 7 + react 19 조합에서 실제로 시도해보니 렌더러 초기화가 내부적으로 깨진다 — 실측
// TypeError: Cannot read properties of undefined (reading 'check')). 이 페이지에 필요한 head는
// Base.astro가 내는 필드 중 canonical 없는 하위집합뿐이라(원본 generateMetadata도 path 없이 title·
// description만 씀) 그 부분만 직접 문자열로 낸다. Header/Footer astro-island 마크업은 손으로 재현하지
// 않는다 — 이 페이지의 실제 콘텐츠(fixed inset-0 전체화면 iframe)가 원본에서도 Header/Footer를 완전히
// 시각적으로 덮어 사용자가 볼 일이 없다(TalkPresentation.tsx 기본 분기 확인).

import siteMetadata from '../../../data/siteMetadata.js'
import { talks } from '../../../data/talksData'

export function getStaticPaths() {
  return talks
    .filter((t) => t.href?.startsWith('/talks/') && t.href !== '/talks/git-collaboration' && !t.pdfUrl && !t.video)
    .map((t) => ({ params: { slug: t.href?.replace('/talks/', '') } }))
}

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export async function GET({ params }: { params: { slug?: string } }) {
  const talk = talks.find((t) => t.href === `/talks/${params.slug}`)
  if (!talk) return new Response('Not found', { status: 404 })

  const description = talk.description || siteMetadata.description
  const ogTitle = `${talk.title} | ${siteMetadata.title}`
  const ogImage = `${siteMetadata.siteUrl}${siteMetadata.socialBanner}`
  const htmlPath = `/talks/${params.slug}/index.html`

  const html = `<!doctype html>
<html lang="ko-KR" class="scroll-smooth">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(ogTitle)}</title>
<meta name="description" content="${escapeHtml(description)}" />
<meta name="robots" content="index, follow" />
<meta name="googlebot" content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1" />
<meta property="og:title" content="${escapeHtml(ogTitle)}" />
<meta property="og:description" content="${escapeHtml(description)}" />
<meta property="og:site_name" content="${escapeHtml(siteMetadata.title)}" />
<meta property="og:image" content="${escapeHtml(ogImage)}" />
<meta property="og:locale" content="ko_KR" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escapeHtml(ogTitle)}" />
<meta name="twitter:description" content="${escapeHtml(description)}" />
<meta name="twitter:image" content="${escapeHtml(ogImage)}" />
<link rel="apple-touch-icon" sizes="76x76" href="/static/favicons/apple-touch-icon.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/static/favicons/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/static/favicons/favicon-16x16.png" />
<link rel="manifest" href="/static/favicons/site.webmanifest" />
<link rel="mask-icon" href="/static/favicons/safari-pinned-tab.svg" color="#5bbad5" />
<meta name="msapplication-TileColor" content="#000000" />
<meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
<link rel="alternate" type="application/rss+xml" href="/feed.xml" />
<script>
  (function () {
    try {
      var theme = localStorage.getItem('theme') || 'dark'
      var isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
      document.documentElement.classList.toggle('dark', isDark)
    } catch (e) {}
  })()
</script>
</head>
<body class="antialiased h-full" style="overflow: hidden">
<div class="flex fixed inset-0 flex-col bg-white dark:bg-gray-950">
  <div class="flex-shrink-0 px-4 py-3 bg-gray-100 border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
    <div class="flex justify-between items-center mx-auto max-w-7xl">
      <div class="flex-1 min-w-0">
        <h1 class="text-xl font-bold text-gray-900 truncate dark:text-gray-100">${escapeHtml(talk.title)}</h1>
        <div class="flex items-center gap-2 mt-0.5 text-sm">
          ${talk.description ? `<p class="text-gray-600 truncate dark:text-gray-400">${escapeHtml(talk.description)}</p>` : ''}
          ${
            talk.event
              ? `<span class="text-gray-400">·</span><p class="text-gray-500 truncate dark:text-gray-500">${escapeHtml(talk.event)}</p>`
              : ''
          }
        </div>
      </div>
      <a href="/talks" class="ml-4 text-sm whitespace-nowrap text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">← Talks</a>
    </div>
  </div>
  <div class="overflow-hidden flex-1">
    <iframe src="${escapeHtml(htmlPath)}" class="w-full h-full border-0" title="${escapeHtml(talk.title)}" allow="fullscreen"></iframe>
  </div>
</div>
</body>
</html>
`

  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
}
