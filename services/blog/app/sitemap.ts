import { LOCALES, localePath, originalOf, postsForLocale, postUrl, translationFor } from 'lib/posts'
import type { MetadataRoute } from 'next'
import siteMetadata from '@/data/siteMetadata'

// output: 'export'는 route handler가 정적임을 명시해야 빌드됨
export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl
  const abs = (p: string) => `${siteUrl}${p}`

  const postRoutes = LOCALES.flatMap((locale) =>
    postsForLocale(locale)
      .filter((post) => !post.draft)
      .map((post) => {
        const pairPost = locale === 'ko' ? translationFor(post) : originalOf(post)
        return {
          url: abs(postUrl(locale, post.slug as string)),
          lastModified: post.lastmod || post.date,
          ...(pairPost && {
            alternates: {
              languages: {
                ko: abs(postUrl('ko', (locale === 'ko' ? post : pairPost).slug as string)),
                en: abs(postUrl('en', (locale === 'en' ? post : pairPost).slug as string)),
              },
            },
          }),
        }
      }),
  )

  // 이중 언어 표면: 홈·블로그·태그. ko 전용 표면은 무프리픽스 단독
  const surfaceAlternates = (path: string) => ({
    languages: { ko: abs(path === '' ? '/' : `/${path}`), en: abs(localePath('en', path === '' ? '/' : `/${path}`)) },
  })
  const localizedSurfaces = ['', 'blog', 'tags'].flatMap((route) =>
    LOCALES.map((locale) => ({
      url: abs(localePath(locale, route === '' ? '/' : `/${route}`)),
      lastModified: new Date().toISOString().split('T')[0],
      alternates: surfaceAlternates(route),
    })),
  )
  const koOnlySurfaces = ['projects', 'talks', 'reports', 'calendar'].map((route) => ({
    url: abs(`/${route}`),
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...localizedSurfaces, ...koOnlySurfaces, ...postRoutes]
}
