'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

type Props = {
  title: string
  basePath: string
  count: number
  pad?: number
  /** 'png'은 next/image 최적화, 'svg'는 벡터라 plain img */
  ext?: 'png' | 'svg'
  /** DeckViewer 등에 임베드될 때 제목·외부 마진 생략 */
  hideTitle?: boolean
}

export default function DeckCarousel({ title, basePath, count, pad = 0, ext = 'png', hideTitle = false }: Props) {
  const [i, setI] = useState(0)
  const boxRef = useRef<HTMLDivElement>(null)
  const srcOf = (n: number) => `${basePath}${pad ? String(n + 1).padStart(pad, '0') : n + 1}.${ext}`

  const prev = useCallback(() => setI((p) => (p - 1 + count) % count), [count])
  const next = useCallback(() => setI((p) => (p + 1) % count), [count])
  const toggleFull = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen()
    else boxRef.current?.requestFullscreen?.()
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next])

  return (
    <div className={hideTitle ? '' : 'mb-8'}>
      {!hideTitle && <h3 className="mb-3 text-[14px] font-semibold text-black dark:text-gray-200">{title}</h3>}
      <div
        ref={boxRef}
        className="relative grid overflow-hidden bg-white border border-gray-200 rounded-lg place-items-center dark:border-gray-700"
      >
        <Image
          src={srcOf(i)}
          alt={`${title} ${i + 1}`}
          width={4000}
          height={2250}
          quality={100}
          priority
          unoptimized
          className="w-full h-auto"
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
          onClick={toggleFull}
          aria-label="전체화면"
          className="absolute top-2 right-2 grid place-items-center w-9 h-9 text-white rounded-full bg-black/40 hover:bg-black/60"
        >
          ⤢
        </button>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 text-xs text-white rounded-full bg-black/50">
          {i + 1} / {count}
        </div>
      </div>
      {/* 썸네일 스트립 */}
      <div className="flex gap-1.5 mt-2 overflow-x-auto pb-1">
        {Array.from({ length: count }, (_, n) => (
          <button
            key={srcOf(n)}
            type="button"
            onClick={() => setI(n)}
            aria-label={`${n + 1}번 슬라이드`}
            className={`flex-none w-16 overflow-hidden rounded border ${
              n === i ? 'border-bclguide' : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            {ext === 'svg' ? (
              // biome-ignore lint/performance/noImgElement: SVG는 next/image 최적화 대상이 아니라 원본을 직접 표시합니다.
              <img src={srcOf(n)} alt="" loading="lazy" className="w-full h-auto" />
            ) : (
              <Image src={srcOf(n)} alt="" width={160} height={90} quality={50} className="w-full h-auto" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
