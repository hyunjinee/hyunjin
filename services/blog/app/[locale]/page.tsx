import ResumeHome from './ResumeHome'
import Main from './Main'
import { coreListFor, isLocale } from '../../lib/posts'
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  if (locale === 'ko') return <ResumeHome />
  return <Main posts={coreListFor('en')} />
}
