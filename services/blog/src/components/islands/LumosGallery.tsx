// app/[locale]/(ko-only)/tossbank/LumosGallery.tsx 이식 — 클릭 시 라이트박스 오픈 상태가 있어 island로 유지.
// next/image Image → 일반 <img> (width/height/sizes만 유지, quality는 next/image 전용이라 드롭).
// biome-ignore-all lint/performance/noImgElement: Astro 정적 사이트엔 next/image 대응물이 없다 — 이 마이그레이션
// 전체가 <img>로 통일하는 선택(다른 .astro 페이지들과 동일 트레이드오프), 이 파일만 React island(.tsx)라 JSX 전용 규칙에 걸림
import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import Captions from 'yet-another-react-lightbox/plugins/captions'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/captions.css'

type Img = { src: string; width: number; height: number; caption: string }

const architecture: Img = {
  src: '/images/tossbank/lumos-architecture.png',
  width: 1393,
  height: 842,
  caption:
    '시스템 아키텍처 — React 클라이언트가 API Gateway를 통해 loans-management · loans-housing · scraping-server(Spring)와 통신하고, MySQL · MongoDB로 데이터를 관리합니다.',
}

const screens: Img[] = [
  {
    src: '/images/tossbank/lumos-price-check.png',
    width: 2094,
    height: 1910,
    caption: '한도조회 · 목적물 시세 조회 — 감정평가 연동으로 담보 시세를 즉시 확인',
  },
  {
    src: '/images/tossbank/lumos-contract-review.png',
    width: 3456,
    height: 1902,
    caption: '임대차계약서 심사 — 계약 · 보증 정보 입력과 제출 서류 검토',
  },
  {
    src: '/images/tossbank/lumos-periodic-inspection.png',
    width: 3434,
    height: 1898,
    caption: '주기별 점검 · 최종확인 — 물건지 등기 · 시세 재확인 업무',
  },
  {
    src: '/images/tossbank/lumos-work-assignment.png',
    width: 3448,
    height: 1910,
    caption: '전세대출 신청 업무 분배 — 담당자별 · 그룹별 심사 할당 관리',
  },
]

const csChart: Img = {
  src: '/images/tossbank/cs-count.webp',
  width: 2048,
  height: 855,
  caption: '전세대출 LUMOS 관련 CS 추이 — 알림 서비스 구축과 운영 개선으로 하루 평균 6~12건에서 0~3건으로 감소',
}

// 라이트박스 슬라이드 순서: 아키텍처(0) → 화면 4장(1~4) → CS 차트(5)
const images: Img[] = [architecture, ...screens, csChart]
const slides = images.map((i) => ({
  src: i.src,
  width: i.width,
  height: i.height,
  alt: i.caption,
  description: i.caption,
}))

const thumbClass =
  'block w-full overflow-hidden border border-gray-200 rounded-lg cursor-zoom-in transition-colors dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-500'
const captionClass = 'mt-2 text-sm text-gray-500 break-keep dark:text-gray-500'

export default function LumosGallery() {
  const [index, setIndex] = useState(-1)

  return (
    <>
      <figure className="mb-6">
        <button type="button" onClick={() => setIndex(0)} className={thumbClass} aria-label="아키텍처 크게 보기">
          <img
            src={architecture.src}
            alt={architecture.caption}
            width={architecture.width}
            height={architecture.height}
            sizes="(max-width: 768px) 100vw, 768px"
            className="w-full h-auto bg-white"
          />
        </button>
        <figcaption className={captionClass}>{architecture.caption}</figcaption>
      </figure>

      <div className="grid gap-6 sm:grid-cols-2">
        {screens.map((s, i) => (
          <figure key={s.src}>
            <button
              type="button"
              onClick={() => setIndex(i + 1)}
              className={thumbClass}
              aria-label={`${s.caption} 크게 보기`}
            >
              <img
                src={s.src}
                alt={s.caption}
                width={s.width}
                height={s.height}
                sizes="(max-width: 768px) 100vw, 384px"
                className="w-full h-auto bg-white"
              />
            </button>
            <figcaption className={captionClass}>{s.caption}</figcaption>
          </figure>
        ))}
      </div>

      <figure className="mt-6">
        <button type="button" onClick={() => setIndex(5)} className={thumbClass} aria-label="CS 추이 차트 크게 보기">
          <img
            src={csChart.src}
            alt={csChart.caption}
            width={csChart.width}
            height={csChart.height}
            sizes="(max-width: 768px) 100vw, 768px"
            className="w-full h-auto bg-white"
          />
        </button>
        <figcaption className={captionClass}>{csChart.caption}</figcaption>
      </figure>

      <Lightbox
        open={index >= 0}
        index={index < 0 ? 0 : index}
        close={() => setIndex(-1)}
        slides={slides}
        plugins={[Zoom, Captions]}
        carousel={{ finite: true }}
        controller={{ closeOnBackdropClick: true }}
        captions={{ descriptionTextAlign: 'center', descriptionMaxLines: 4 }}
        zoom={{ maxZoomPixelRatio: 3, scrollToZoom: true }}
        styles={{ container: { backgroundColor: 'rgba(0, 0, 0, .9)' } }}
      />
    </>
  )
}
