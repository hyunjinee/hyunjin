import type { MetadataRoute } from 'next'
import siteMetadata from '@/data/siteMetadata'

// output: 'export'는 route handler가 정적임을 명시해야 빌드됨
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${siteMetadata.siteUrl}/sitemap.xml`,
    host: siteMetadata.siteUrl,
  }
}
