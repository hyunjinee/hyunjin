'use client'

import Image, { type ImageProps } from 'next/image'
import { useEffect, useState } from 'react'

// 클릭하면 전체화면 오버레이로 원본을 띄우는 단일 이미지 뷰어.
// DeckCarousel의 전체화면 패턴(CSS 오버레이, Escape 닫기, body 스크롤 잠금)을 단일 이미지용으로 재사용.
export default function ZoomableImage({ className, alt, ...rest }: ImageProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label={`${alt} 확대`} className="block w-full cursor-zoom-in">
        <Image alt={alt} className={className} {...rest} />
      </button>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${alt} 전체화면`}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[60] grid cursor-zoom-out place-items-center bg-black p-4"
        >
          <Image
            alt={alt}
            {...rest}
            quality={100}
            unoptimized
            className="max-h-[100dvh] max-w-[100vw] h-auto w-auto object-contain"
          />
          <button
            type="button"
            aria-label="닫기"
            className="absolute top-4 right-4 grid h-9 w-9 place-items-center rounded-full bg-black/40 text-white hover:bg-black/60"
          >
            ✕
          </button>
        </div>
      )}
    </>
  )
}
