'use client'

import Image from 'next/image'
import { useEffect } from 'react'

interface PhotoViewerProps {
  src: string
  alt: string
  onClose: () => void
}

export default function PhotoViewer({ src, alt, onClose }: PhotoViewerProps) {
  useEffect(() => {
    // ESC 키로 닫기
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEsc)

    // 스크롤 막기
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-4xl h-full max-h-[90vh] p-4">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-8 right-8 z-10 text-white hover:text-gray-300 transition-colors"
          aria-label="닫기"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 이미지 */}
        <div className="relative w-full h-full" onClick={(e) => e.stopPropagation()}>
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain"
            priority
            quality={100}
            sizes="(max-width: 1024px) 100vw, 1024px"
          />
        </div>
      </div>
    </div>
  )
}
