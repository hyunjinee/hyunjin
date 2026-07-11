import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import siteMetadata from '@/data/siteMetadata'
import { coreListFor, isLocale } from '../../lib/posts'
import Main from './Main'
import ResumeHome from './ResumeHome'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return {
    alternates: {
      canonical: `${siteMetadata.siteUrl}${locale === 'en' ? '/en' : '/'}`,
      languages: {
        ko: `${siteMetadata.siteUrl}/`,
        en: `${siteMetadata.siteUrl}/en`,
        'x-default': `${siteMetadata.siteUrl}/en`,
      },
    },
    ...(locale === 'en' && { title: 'Blog', description: 'Posts in English' }),
  }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  if (locale === 'ko') return <ResumeHome />
  return <Main posts={coreListFor('en')} />
}
