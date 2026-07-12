// app/[locale]/(ko-only)/bclguide/ZoomableImage.tsx 이식 — 클릭하면 전체화면 오버레이로 원본을 띄우는 상태가
// 있어 island로 유지. next/image Image → 일반 <img>. src/width/height는 bclguide.astro가 astro:assets
// getImage()로 처리한 결과(해시 경로)를 그대로 넘긴다 — Image 컴포넌트는 .astro 전용이라 React 쪽에서 못 쓴다.
// DeckCarousel의 전체화면 패턴(CSS 오버레이, Escape 닫기, body 스크롤 잠금)을 단일 이미지용으로 재사용.
// biome-ignore-all lint/performance/noImgElement: Astro 정적 사이트엔 next/image 대응물이 없다.
import { useEffect, useState } from 'react'

type Props = {
  src: string
  width: number
  height: number
  alt: string
  className?: string
}

export default function ZoomableImage({ src, width, height, alt, className }: Props) {
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
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${alt} 확대`}
        className="block w-full cursor-zoom-in"
      >
        <img src={src} width={width} height={height} alt={alt} className={className} />
      </button>
      {open && (
        // biome-ignore lint/a11y/useKeyWithClickEvents: Escape 닫기는 useEffect의 전역 keydown 리스너로 이미 처리됨
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${alt} 전체화면`}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[60] grid cursor-zoom-out place-items-center bg-black p-4"
        >
          <img
            src={src}
            width={width}
            height={height}
            alt={alt}
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
