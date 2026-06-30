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
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'loose',
      theme: resolvedTheme === 'dark' ? 'dark' : 'default',
    })
    mermaid.run({ nodes: [el] })
  }, [children, resolvedTheme])

  return (
    <div ref={ref} className="mermaid flex justify-center">
      {children}
    </div>
  )
}
