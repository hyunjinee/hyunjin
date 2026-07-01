'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import mermaid from 'mermaid'

export default function Mermaid({ children }: { children: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // 테마 변경 시 재렌더: 원본 소스 복원 + 처리 플래그 제거
    el.innerHTML = children
    el.removeAttribute('data-processed')
    // mermaid 파싱/렌더 에러가 페이지 전체를 죽이지 않도록 방어 (mermaid는 non-Error를 throw/reject함)
    try {
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'loose',
        theme: resolvedTheme === 'dark' ? 'dark' : 'default',
      })
      void Promise.resolve(mermaid.run({ nodes: [el] })).catch(() => {})
    } catch {
      /* 다이어그램 렌더 실패는 무시 */
    }
  }, [children, resolvedTheme])

  return (
    <div ref={ref} className="mermaid flex justify-center">
      {children}
    </div>
  )
}
