import { notFound } from 'next/navigation'
import { genPageMetadata } from 'app/seo'
import { talks } from '@/data/talksData'
import TalkPresentation from './TalkPresentation'

export async function generateStaticParams() {
  // talksData에서 내부 링크만 추출
  return talks
    .filter((talk) => talk.href?.startsWith('/talks/'))
    .map((talk) => ({
      slug: talk.href?.replace('/talks/', '') || '',
    }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const talk = talks.find((t) => t.href === `/talks/${slug}`)
  if (!talk) {
    return {}
  }
  return genPageMetadata({ title: talk.title, description: talk.description })
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const talk = talks.find((t) => t.href === `/talks/${slug}`)

  if (!talk) {
    notFound()
  }

  return <TalkPresentation talk={talk} slug={slug} />
}
