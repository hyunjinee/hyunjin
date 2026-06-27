'use client'

import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'

type Props = {
  title: string
  basePath?: string
  count?: number
  pad?: number
  /** 'png'은 next/image 최적화, 'svg'는 벡터라 plain img */
  ext?: 'png' | 'svg'
  /** DeckViewer 등에 임베드될 때 제목·외부 마진 생략 */
  hideTitle?: boolean
  /** basePath/count 대신 슬라이드 경로를 직접 지정 (여러 덱을 한 덱으로 합칠 때) */
  slides?: string[]
}

export default function DeckCarousel({
  title,
  basePath = '',
  count = 0,
  pad = 0,
  ext = 'png',
  hideTitle = false,
  slides,
}: Props) {
  const [i, setI] = useState(0)
  const [full, setFull] = useState(false)
  const srcs =
    slides ?? Array.from({ length: count }, (_, n) => `${basePath}${pad ? String(n + 1).padStart(pad, '0') : n + 1}.${ext}`)
  const total = srcs.length

  const prev = useCallback(() => setI((p) => (p - 1 + total) % total), [total])
  const next = useCallback(() => setI((p) => (p + 1) % total), [total])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape') setFull(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next])

  // iOS Safari는 div에 Fullscreen API를 지원하지 않아 CSS 오버레이로 전체화면 처리
  useEffect(() => {
    if (!full) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [full])

  return (
    <div className={hideTitle ? '' : 'mb-8'}>
      {!hideTitle && <h3 className="mb-3 text-[14px] font-semibold text-black dark:text-gray-200">{title}</h3>}
      <div
        className={
          full
            ? 'fixed inset-0 z-[60] grid place-items-center bg-black'
            : 'relative grid overflow-hidden bg-white border border-gray-200 rounded-lg place-items-center dark:border-gray-700'
        }
      >
        <Image
          src={srcs[i]}
          alt={`${title} ${i + 1}`}
          width={4000}
          height={2250}
          quality={100}
          priority
          unoptimized
          className={full ? 'max-h-[100dvh] max-w-[100vw] w-auto h-auto object-contain' : 'w-full h-auto'}
        />
        <button
          type="button"
          onClick={prev}
          aria-label="이전 슬라이드"
          className="absolute top-1/2 left-2 -translate-y-1/2 grid place-items-center w-9 h-9 text-white rounded-full bg-black/40 hover:bg-black/60"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="다음 슬라이드"
          className="absolute top-1/2 right-2 -translate-y-1/2 grid place-items-center w-9 h-9 text-white rounded-full bg-black/40 hover:bg-black/60"
        >
          ›
        </button>
        <button
          type="button"
          onClick={() => setFull((f) => !f)}
          aria-label={full ? '전체화면 종료' : '전체화면'}
          className="absolute top-2 right-2 z-10 grid place-items-center w-9 h-9 text-white rounded-full bg-black/40 hover:bg-black/60"
        >
          {full ? '✕' : '⤢'}
        </button>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 text-xs text-white rounded-full bg-black/50">
          {i + 1} / {total}
        </div>
      </div>
      {/* 썸네일 스트립 */}
      <div className="flex gap-1.5 mt-2 overflow-x-auto pb-1">
        {srcs.map((src, n) => (
          <button
            key={src}
            type="button"
            onClick={() => setI(n)}
            aria-label={`${n + 1}번 슬라이드`}
            className={`flex-none w-16 overflow-hidden rounded border ${
              n === i ? 'border-bclguide' : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            {ext === 'svg' ? (
              // biome-ignore lint/performance/noImgElement: SVG는 next/image 최적화 대상이 아니라 원본을 직접 표시합니다.
              <img src={src} alt="" loading="lazy" className="w-full h-auto" />
            ) : (
              <Image src={src} alt="" width={160} height={90} quality={50} className="w-full h-auto" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
