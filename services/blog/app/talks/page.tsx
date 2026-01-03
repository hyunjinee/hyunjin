import { talksData } from '@/data/talksData'
import { genPageMetadata } from 'app/seo'
import Link from '@/components/Link'

export const metadata = genPageMetadata({ title: 'Talks' })

function formatDate(dateString: string) {
  const parts = dateString.split('-')
  const year = parts[0]
  const month = parts[1]
  const day = parts[2]

  if (day) {
    return `${year}년 ${parseInt(month)}월 ${parseInt(day)}일`
  } else {
    return `${year}년 ${parseInt(month)}월`
  }
}

function TalkCard({ talk }) {
  const { title, description, date, event, href, slides, video, type } = talk
  const isExternalLink = href && !href.startsWith('/')

  return (
    <div className="py-4">
      <article>
        <div className="space-y-2">
          <div>
            <h3 className="text-2xl font-bold tracking-tight leading-8">
              {href ? (
                <Link
                  href={href}
                  className="text-gray-900 dark:text-gray-100 hover:text-primary-500 dark:hover:text-primary-400"
                  {...(isExternalLink && { target: '_blank', rel: 'noopener noreferrer' })}
                >
                  {title}
                  {isExternalLink && <span className="ml-1 text-sm align-super">↗</span>}
                </Link>
              ) : (
                <span className="text-gray-900 dark:text-gray-100">{title}</span>
              )}
            </h3>
            <div className="flex flex-wrap gap-2 mt-1">
              <time className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                {formatDate(date)}
              </time>
              {event && (
                <>
                  <span className="text-gray-500 dark:text-gray-400">·</span>
                  <span className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">{event}</span>
                </>
              )}
              {type && (
                <>
                  <span className="text-gray-500 dark:text-gray-400">·</span>
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600 bg-gray-50 rounded-md ring-1 ring-inset dark:bg-gray-800 dark:text-gray-300 ring-gray-500/10 dark:ring-gray-500/20">
                    {type}
                  </span>
                </>
              )}
            </div>
          </div>
          {description && <div className="max-w-none text-gray-500 prose dark:text-gray-400">{description}</div>}
          {(slides || video) && (
            <div className="flex gap-4 text-base font-medium leading-6">
              {slides && (
                <Link
                  href={slides}
                  className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                  aria-label={`${title}의 슬라이드 보기`}
                >
                  슬라이드 &rarr;
                </Link>
              )}
              {video && (
                <Link
                  href={video}
                  className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                  aria-label={`${title}의 영상 보기`}
                >
                  영상 &rarr;
                </Link>
              )}
            </div>
          )}
        </div>
      </article>
    </div>
  )
}

export default function Talks() {
  // 날짜순으로 정렬 (최신순)
  const sortedTalks = [...talksData].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="pt-4 pb-6 space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 md:text-4xl">Talks</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">발표, 워크샵, 강의 등 다양한 활동들을 기록합니다.</p>
      </div>
      <div className="container py-12">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {sortedTalks.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">아직 등록된 발표가 없습니다.</p>
          ) : (
            sortedTalks.map((talk) => <TalkCard key={talk.title + talk.date} talk={talk} />)
          )}
        </div>
      </div>
    </div>
  )
}
