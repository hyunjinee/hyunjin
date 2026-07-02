'use client'

import '@excalidraw/excalidraw/index.css'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

// 손글씨 폰트를 CDN(esm.sh) 대신 로컬(public/excalidraw/fonts)에서 서빙
if (typeof window !== 'undefined') {
  ;(window as Window & { EXCALIDRAW_ASSET_PATH?: string }).EXCALIDRAW_ASSET_PATH = '/excalidraw/'
}

const Excalidraw = dynamic(async () => (await import('@excalidraw/excalidraw')).Excalidraw, {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-full text-sm text-gray-500 dark:text-gray-500">
      다이어그램 로딩 중…
    </div>
  ),
})

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
    <div className="overflow-hidden h-[600px] rounded-lg border border-gray-200 dark:border-gray-700">
      {initialData && (
        <Excalidraw
          initialData={initialData}
          viewModeEnabled
          excalidrawAPI={(a) => setApi(a as unknown as ExcalidrawApi)}
        />
      )}
    </div>
  )
}
