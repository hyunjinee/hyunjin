// app/sitemap.ts 이식. @astrojs/sitemap은 translationOf 기반 hreflang alternates를 표현할 수 없어
// 미사용 — MetadataRoute.Sitemap과 동일한 URL 집합·lastmod·hreflang을 직접 만든다.
import type { APIRoute } from 'astro'
import siteMetadata from '../../data/siteMetadata.js'
import { entrySlug, LOCALES, localePath, originalOf, postsForLocale, postUrl, translationFor } from '../lib/posts'

type UrlEntry = {
  loc: string
  lastmod: string
  alternates?: { ko: string; en: string }
}

const urlXml = (u: UrlEntry) => {
  const alt = u.alternates
    ? `\n<xhtml:link rel="alternate" hreflang="ko" href="${u.alternates.ko}" />\n<xhtml:link rel="alternate" hreflang="en" href="${u.alternates.en}" />`
    : ''
  return `<url>\n<loc>${u.loc}</loc>${alt}\n<lastmod>${u.lastmod}</lastmod>\n</url>`
}

export const GET: APIRoute = async () => {
  const siteUrl = siteMetadata.siteUrl
  const abs = (p: string) => `${siteUrl}${p}`

  // postsForLocale은 draft를 이미 제외한다 (src/lib/posts.ts) — app/sitemap.ts의 재필터는 불필요
  const postEntries: UrlEntry[] = (
    await Promise.all(
      LOCALES.map(async (locale) => {
        const posts = await postsForLocale(locale)
        return Promise.all(
          posts.map(async (post) => {
            const pairPost = locale === 'ko' ? await translationFor(post) : await originalOf(post)
            const entry: UrlEntry = {
              loc: abs(postUrl(locale, entrySlug(post))),
              lastmod: (post.data.lastmod ?? post.data.date).toISOString(),
            }
            if (pairPost) {
              const koPost = locale === 'ko' ? post : pairPost
              const enPost = locale === 'en' ? post : pairPost
              entry.alternates = {
                ko: abs(postUrl('ko', entrySlug(koPost))),
                en: abs(postUrl('en', entrySlug(enPost))),
              }
            }
            return entry
          }),
        )
      }),
    )
  ).flat()

  // 이중 언어 표면: 홈·블로그·태그. ko 전용 표면은 무프리픽스 단독
  const today = new Date().toISOString().split('T')[0]
  const surfaceAlternates = (route: string) => ({
    ko: abs(route === '' ? '/' : `/${route}`),
    en: abs(localePath('en', route === '' ? '/' : `/${route}`)),
  })
  const localizedSurfaces: UrlEntry[] = ['', 'blog', 'tags'].flatMap((route) =>
    LOCALES.map((locale) => ({
      loc: abs(localePath(locale, route === '' ? '/' : `/${route}`)),
      lastmod: today,
      alternates: surfaceAlternates(route),
    })),
  )
  const koOnlySurfaces: UrlEntry[] = ['projects', 'talks', 'reports', 'calendar'].map((route) => ({
    loc: abs(`/${route}`),
    lastmod: today,
  }))

  const urls = [...localizedSurfaces, ...koOnlySurfaces, ...postEntries]
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.map(urlXml).join('\n')}\n</urlset>\n`

  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } })
}
