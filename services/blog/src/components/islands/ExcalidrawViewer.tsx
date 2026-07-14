// app/[locale]/(ko-only)/debutsplan/ExcalidrawViewer.tsx 이식 — @excalidraw/excalidraw는 브라우저 API(캔버스 등)에
// 의존해 SSR이 안 되는 라이브러리라(원본도 next/dynamic({ssr:false})로 배제) client:only="react"로 마운트한다.
// next/dynamic(ssr:false, loading) → React.lazy + Suspense (next/dynamic 없이 동일한 지연 로딩 + 로딩 폴백 재현).
import '@excalidraw/excalidraw/index.css'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'

// 손글씨 폰트를 CDN(esm.sh) 대신 로컬(public/excalidraw/fonts)에서 서빙
if (typeof window !== 'undefined') {
  ;(window as Window & { EXCALIDRAW_ASSET_PATH?: string }).EXCALIDRAW_ASSET_PATH = '/excalidraw/'
}

const Excalidraw = lazy(() => import('@excalidraw/excalidraw').then((mod) => ({ default: mod.Excalidraw })))

type SceneElement = { x: number; y: number }
type SceneData = { elements: SceneElement[] }
type ExcalidrawApi = {
  scrollToContent: (elements: SceneElement[], opts: { fitToViewport: boolean; animate: boolean }) => void
}

// 초기 뷰: '오디션 시나리오' 다이어그램 클러스터 영역
const FOCUS = { minX: 6900, maxX: 11000, minY: 9600, maxY: 11500 }

export default function ExcalidrawViewer({ src }: { src: string }) {
  const [initialData, setInitialData] = useState<SceneData | null>(null)
  const [api, setApi] = useState<ExcalidrawApi | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const onChange = () => setIsFullscreen(document.fullscreenElement === containerRef.current)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen()
    else containerRef.current?.requestFullscreen()
  }

  useEffect(() => {
    fetch(src)
      .then((res) => res.json())
      .then(setInitialData)
      .catch(() => setInitialData(null))
  }, [src])

  useEffect(() => {
    if (!api || !initialData) return
    const targets = initialData.elements.filter(
      (e) => e.x >= FOCUS.minX && e.x <= FOCUS.maxX && e.y >= FOCUS.minY && e.y <= FOCUS.maxY,
    )
    if (targets.length === 0) return
    // Excalidraw 씬 초기화가 끝난 뒤에 스크롤해야 반영됨
    const timer = setTimeout(() => {
      api.scrollToContent(targets, { fitToViewport: true, animate: false })
    }, 300)
    return () => clearTimeout(timer)
  }, [api, initialData])

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-white dark:bg-gray-900 ${
        isFullscreen ? 'h-full' : 'h-[600px] rounded-lg border border-gray-200 dark:border-gray-700'
      }`}
    >
      <button
        type="button"
        onClick={toggleFullscreen}
        aria-label={isFullscreen ? '전체화면 종료' : '전체화면'}
        className="absolute top-3 right-3 z-10 px-2.5 py-1.5 text-xs rounded-md border border-gray-300 bg-white/90 text-gray-600 shadow-sm hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800/90 dark:text-gray-300 dark:hover:bg-gray-700"
      >
        {isFullscreen ? '✕ 닫기' : '⛶ 전체화면'}
      </button>
      {initialData && (
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-full text-sm text-gray-500 dark:text-gray-500">
              다이어그램 로딩 중…
            </div>
          }
        >
          <Excalidraw
            // 파일 JSON을 그대로 넘김 — ExcalidrawInitialDataState 타입은 moduleResolution 제약으로 import 불가
            initialData={initialData as never}
            viewModeEnabled
            excalidrawAPI={(a) => setApi(a as unknown as ExcalidrawApi)}
          />
        </Suspense>
      )}
    </div>
  )
}
