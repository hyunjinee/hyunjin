'use client'

import { useEffect } from 'react'

interface Talk {
  title: string
  description?: string
  date: string
  event?: string
  href?: string
  slides?: string
  video?: string
  type?: 'talk' | 'workshop' | 'lecture' | 'podcast'
}

interface TalkPresentationClientProps {
  talk: Talk
  slug: string
}

export default function TalkPresentation({ talk, slug }: TalkPresentationClientProps) {
  // Keynote export HTML 경로 매핑
  const htmlPath = `/talks/${slug}/index.html`

  useEffect(() => {
    // 페이지 로드 시 body overflow hidden 설정
    document.body.style.overflow = 'hidden'

    return () => {
      // 페이지 언마운트 시 복원
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div className="flex fixed inset-0 flex-col bg-white dark:bg-gray-950">
      <div className="flex-shrink-0 px-4 py-3 bg-gray-100 border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
        <div className="flex justify-between items-center mx-auto max-w-7xl">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900 truncate dark:text-gray-100">{talk.title}</h1>
            <div className="flex items-center gap-2 mt-0.5 text-sm">
              {talk.description && <p className="text-gray-600 truncate dark:text-gray-400">{talk.description}</p>}
              {talk.event && (
                <>
                  <span className="text-gray-400">·</span>
                  <p className="text-gray-500 truncate dark:text-gray-500">{talk.event}</p>
                </>
              )}
            </div>
          </div>
          <a
            href="/talks"
            className="ml-4 text-sm whitespace-nowrap text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
          >
            ← Talks
          </a>
        </div>
      </div>
      <div className="overflow-hidden flex-1">
        <iframe src={htmlPath} className="w-full h-full border-0" title={talk.title} allow="fullscreen" />
      </div>
    </div>
  )
}
