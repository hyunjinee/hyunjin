import { genPageMetadata } from 'app/seo'
import { coreListFor, isLocale } from 'lib/posts'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import siteMetadata from '@/data/siteMetadata'
import Main from '../Main'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return {
    ...genPageMetadata({ title: 'Blog', locale: locale === 'en' ? 'en' : 'ko' }),
    alternates: {
      canonical: `${siteMetadata.siteUrl}${locale === 'en' ? '/en/blog' : '/blog'}`,
      languages: {
        ko: `${siteMetadata.siteUrl}/blog`,
        en: `${siteMetadata.siteUrl}/en/blog`,
        'x-default': `${siteMetadata.siteUrl}/en/blog`,
      },
    },
  }
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return <Main posts={coreListFor(locale)} />
}
