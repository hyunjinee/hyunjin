import type { ReactNode } from 'react'
import { ViewTransition } from 'react'
import Image from '@/components/Image'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'

interface LayoutProps {
  content: CoreContent<Blog>
  children: ReactNode
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
}

export default function PostMinimal({ content, next, prev, children }: LayoutProps) {
  const { slug, title, images, tags } = content
  // 이미지가 없으면 동적 OG 카드로 대체(빈 배너 방지) — 첫 태그를 subtitle로 노출
  const ogSubtitle = tags?.[0] ? `&subtitle=${encodeURIComponent(tags[0])}` : ''
  const displayImage =
    images && images.length > 0
      ? images[0]
      : `${siteMetadata.siteUrl}/og?title=${encodeURIComponent(title)}${ogSubtitle}`
  // cover: 16:9로 꽉 채워 크롭(Toss형, 16:9 제작 이미지용) / contain: 잘림 없이 전체 표시(가장자리 콘텐츠 이미지용)
  const bannerFit = (content as { bannerFit?: 'cover' | 'contain' }).bannerFit ?? 'contain'

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article>
        {/* 히어로·제목·본문 전부 700px 단일 컬럼으로 통일 */}
        <div className="mx-auto max-w-[700px]">
          <div className="pb-10 space-y-1 text-center dark:border-gray-700">
            <div className="w-full">
              <div
                className={`relative aspect-video w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 ${
                  bannerFit === 'contain' ? 'bg-gray-50 dark:bg-gray-800/40' : ''
                }`}
              >
                <Image
                  src={displayImage}
                  alt={title}
                  fill
                  priority
                  className={bannerFit === 'cover' ? 'object-cover' : 'object-contain'}
                />
              </div>
            </div>
            <div className="relative pt-8">
              <PageTitle>
                <ViewTransition name={`title-${slug}`}>
                  <span>{title}</span>
                </ViewTransition>
              </PageTitle>
            </div>
          </div>
          <div className="py-4 max-w-none prose dark:prose-invert">{children}</div>
          {/* {siteMetadata.comments && (
            <div className="pt-6 pb-6 text-center text-gray-700 dark:text-gray-300" id="comment">
              <Comments slug={slug} />
            </div>
          )} */}
          <footer>
            <div className="flex flex-col text-sm font-medium sm:flex-row sm:justify-between sm:text-base">
              {prev && prev.path && (
                <div className="pt-4 xl:pt-8">
                  <Link
                    href={`/${prev.path}`}
                    className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                    aria-label={`Previous post: ${prev.title}`}
                  >
                    &larr; {prev.title}
                  </Link>
                </div>
              )}
              {next && next.path && (
                <div className="pt-4 xl:pt-8">
                  <Link
                    href={`/${next.path}`}
                    className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                    aria-label={`Next post: ${next.title}`}
                  >
                    {next.title} &rarr;
                  </Link>
                </div>
              )}
            </div>
          </footer>
        </div>
      </article>
    </SectionContainer>
  )
}
