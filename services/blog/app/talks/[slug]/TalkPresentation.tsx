'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'

// PDFPresentation을 dynamic import로 로드 (SSR 비활성화)
const PDFPresentation = dynamic(() => import('./PDFPresentation'), {
  ssr: false,
  loading: () => (
    <div className="flex fixed inset-0 justify-center items-center bg-gray-50 dark:bg-gray-950">
      <div className="text-center">
        <div className="inline-block w-12 h-12 rounded-full border-4 border-gray-200 animate-spin border-t-primary-500"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">프레젠테이션 로딩 중...</p>
      </div>
    </div>
  ),
})

function getYouTubeId(url?: string) {
  if (!url) return null
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/)
  return match ? match[1] : null
}

interface Talk {
  title: string
  description?: string
  date: string
  event?: string
  href?: string
  slides?: string
  video?: string
  type?: 'talk' | 'workshop' | 'lecture' | 'podcast'
  pdfUrl?: string // PDF URL 필드 추가
}

interface TalkPresentationClientProps {
  talk: Talk
  slug: string
}

export default function TalkPresentation({ talk, slug }: TalkPresentationClientProps) {
  // PDF URL이 있으면 PDF 뷰어 렌더링
  if (talk.pdfUrl) {
    return <PDFPresentation pdfUrl={talk.pdfUrl} title={talk.title} />
  }

  // YouTube 영상이 있으면 일반 페이지 흐름으로 임베드 렌더링
  const youTubeId = getYouTubeId(talk.video)
  if (youTubeId) {
    return (
      <div className="container py-8 md:py-10">
        <a
          href="/talks"
          className="inline-block mb-6 text-sm text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
        >
          ← Talks
        </a>
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl dark:text-gray-100">{talk.title}</h1>
        <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
          <span>{talk.date}</span>
          {talk.event && (
            <>
              <span>·</span>
              <span>{talk.event}</span>
            </>
          )}
        </div>
        {talk.description && <p className="mt-3 text-gray-600 dark:text-gray-400">{talk.description}</p>}
        <div className="overflow-hidden mt-6 w-full bg-black rounded-xl aspect-video">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/${youTubeId}`}
            title={talk.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    )
  }

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
