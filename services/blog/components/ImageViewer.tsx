'use client'

import NextImage, { type ImageProps } from 'next/image'
import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'

const basePath = process.env.BASE_PATH

// 마크다운 이미지(remarkImgToJsx가 <Image>로 변환)를 클릭하면
// yet-another-react-lightbox 뷰어로 확대(줌·팬·키보드·백드롭 닫기).
export default function ImageViewer({ className, alt = '', src, width, height, ...rest }: ImageProps) {
  const [open, setOpen] = useState(false)
  const resolvedSrc = typeof src === 'string' ? `${basePath || ''}${src}` : src
  const w = typeof width === 'number' ? width : Number(width) || undefined
  const h = typeof height === 'number' ? height : Number(height) || undefined

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${alt} 확대`}
        className="block m-0 w-full cursor-zoom-in border-0 bg-transparent p-0"
      >
        <NextImage src={resolvedSrc} alt={alt} width={width} height={height} className={className} {...rest} />
      </button>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={[{ src: typeof resolvedSrc === 'string' ? resolvedSrc : '', alt, width: w, height: h }]}
        plugins={[Zoom]}
        controller={{ closeOnBackdropClick: true }}
        zoom={{ maxZoomPixelRatio: 3, scrollToZoom: true }}
        carousel={{ finite: true }}
        render={{ buttonPrev: () => null, buttonNext: () => null }}
      />
    </>
  )
}
