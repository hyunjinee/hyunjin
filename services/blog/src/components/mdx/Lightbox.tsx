import { useEffect, useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'

interface Slide {
  src: string
  alt: string
  width?: number
  height?: number
}

// components/ImageViewer.tsx 대응 — 원래는 이미지 하나당 React island(버튼+Lightbox)였지만,
// 본문 <img>는 정적 HTML로 두고 문서당 이 island 하나가 클릭을 위임받아 확대한다.
// ponytail: 이미지별 <button role키보드 aria-label> 래핑은 버렸다(정적 마크업 유지가 우선순위) —
// 클릭 확대 UX는 원본과 동일, 키보드 접근성은 이 단순화의 알려진 한계.
export default function LightboxDelegate() {
  const [slide, setSlide] = useState<Slide | null>(null)

  useEffect(() => {
    const container = document.querySelector('.prose')
    if (!container) return
    const onClick = (event: MouseEvent) => {
      const img = event.target instanceof Element ? event.target.closest('img') : null
      if (!img || !container.contains(img)) return
      setSlide({
        src: img.currentSrc || img.src,
        alt: img.alt,
        width: img.naturalWidth || undefined,
        height: img.naturalHeight || undefined,
      })
    }
    container.addEventListener('click', onClick)
    return () => container.removeEventListener('click', onClick)
  }, [])

  return (
    <>
      {/* client:visible의 IntersectionObserver 관찰 대상 — 렌더 결과가 없으면 관찰할 요소가 없어 hydration이 안 됨 */}
      <div className="sr-only" aria-hidden="true" />
      <Lightbox
        open={slide !== null}
        close={() => setSlide(null)}
        slides={slide ? [slide] : []}
        plugins={[Zoom]}
        controller={{ closeOnBackdropClick: true }}
        zoom={{ maxZoomPixelRatio: 3, scrollToZoom: true }}
        carousel={{ finite: true }}
        render={{ buttonPrev: () => null, buttonNext: () => null }}
      />
    </>
  )
}
