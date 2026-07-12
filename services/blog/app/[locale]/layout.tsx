import 'css/tailwind.css'
import 'css/pretendard-dynamic-subset.css'
import 'css/view-transition.css'
import 'pliny/search/algolia.css'
import 'remark-github-blockquote-alert/alert.css'
import 'css/code-highlight.css'

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Analytics, AnalyticsConfig } from 'pliny/analytics'
import { SearchProvider, SearchConfig } from 'pliny/search'

import Header from '@/components/Header'
import SectionContainer from '@/components/SectionContainer'
import Footer from '@/components/Footer'
import siteMetadata from '@/data/siteMetadata'
import { ThemeProviders } from '../theme-providers'
import BtoaPolyfill from '@/components/BtoaPolyfill'
import { LOCALES, isLocale, type Locale } from 'lib/posts'

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: '이현진 (Hyunjin Lee) — Software Engineer',
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  openGraph: {
    title: '이현진 (Hyunjin Lee) — Software Engineer',
    description: siteMetadata.description,
    siteName: siteMetadata.title,
    images: [`${siteMetadata.siteUrl}/og/default.png`],
    locale: 'ko_KR',
    type: 'website',
  },
  alternates: {
    types: {
      'application/rss+xml': `${siteMetadata.siteUrl}/feed.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: '이현진 (Hyunjin Lee) — Software Engineer',
    card: 'summary_large_image',
    images: [`${siteMetadata.siteUrl}/og/default.png`],
  },
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const htmlLang = locale === 'en' ? 'en-US' : siteMetadata.language
  const feedPath = locale === 'en' ? '/en/feed.xml' : '/feed.xml'
  const searchConfig = {
    ...(siteMetadata.search as SearchConfig),
    kbarConfig: {
      ...(siteMetadata.search as SearchConfig & { kbarConfig: object }).kbarConfig,
      searchDocumentsPath: locale === 'en' ? 'search-en.json' : 'search.json',
    },
  } as SearchConfig
  const basePath = process.env.BASE_PATH || ''

  return (
    <html lang={htmlLang} className="scroll-smooth" suppressHydrationWarning>
      <link rel="apple-touch-icon" sizes="76x76" href={`${basePath}/static/favicons/apple-touch-icon.png`} />
      <link rel="icon" type="image/png" sizes="32x32" href={`${basePath}/static/favicons/favicon-32x32.png`} />
      <link rel="icon" type="image/png" sizes="16x16" href={`${basePath}/static/favicons/favicon-16x16.png`} />
      <link rel="manifest" href={`${basePath}/static/favicons/site.webmanifest`} />
      <link rel="mask-icon" href={`${basePath}/static/favicons/safari-pinned-tab.svg`} color="#5bbad5" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
      <link rel="alternate" type="application/rss+xml" href={`${basePath}${feedPath}`} />
      <body className="bg-white pl-[calc(100vw-100%)] text-black antialiased dark:bg-gray-950 dark:text-white h-full">
        <BtoaPolyfill />
        <ThemeProviders>
          <Analytics analyticsConfig={siteMetadata.analytics as AnalyticsConfig} />
          <SectionContainer>
            <SearchProvider searchConfig={searchConfig}>
              <Header locale={locale as Locale} />
              <main className="flex-1">{children}</main>
            </SearchProvider>
            <Footer />
          </SectionContainer>
        </ThemeProviders>
      </body>
    </html>
  )
}
