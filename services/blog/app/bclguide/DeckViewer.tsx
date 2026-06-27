'use client'

import { useState } from 'react'
import DeckCarousel from './DeckCarousel'

type Props = {
  title: string
  basePath: string
  count: number
  pad?: number
  ext?: 'png' | 'svg'
  videoSrc?: string
}

export default function DeckViewer({ title, basePath, count, pad = 0, ext = 'png', videoSrc }: Props) {
  const [mode, setMode] = useState<'slides' | 'video'>('slides')

  const tab = (active: boolean) =>
    `px-2.5 py-1 text-xs rounded-full border transition-colors ${
      active
        ? 'bg-bclguide text-white border-bclguide'
        : 'text-gray-500 border-gray-200 hover:border-bclguide dark:text-gray-400 dark:border-gray-700'
    }`

  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <h3 className="text-[14px] font-semibold text-black dark:text-gray-200">{title}</h3>
        {videoSrc && (
          <div className="flex gap-1">
            <button type="button" onClick={() => setMode('slides')} className={tab(mode === 'slides')}>
              슬라이드
            </button>
            <button type="button" onClick={() => setMode('video')} className={tab(mode === 'video')}>
              모션 영상
            </button>
          </div>
        )}
      </div>

      {mode === 'slides' ? (
        <DeckCarousel title={title} hideTitle basePath={basePath} count={count} pad={pad} ext={ext} />
      ) : (
        <div className="overflow-hidden border border-gray-200 rounded-lg dark:border-gray-700">
          {/* biome-ignore lint/a11y/useMediaCaption: 발표자료 영상에는 대사 오디오가 없습니다. */}
          <video src={videoSrc} controls playsInline className="w-full h-auto bg-black" />
        </div>
      )}
    </div>
  )
}
