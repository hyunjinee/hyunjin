import { coreListFor, isLocale } from 'lib/posts'
import { genPageMetadata } from 'app/seo'
import { notFound } from 'next/navigation'
import Main from '../Main'

export const metadata = genPageMetadata({ title: 'Blog' })

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return <Main posts={coreListFor(locale)} />
}
