import mermaid from 'mermaid'
import { useEffect } from 'react'
import { useThemeClass } from '../../lib/useThemeClass'

// components/Mermaid.tsx 대응 — 문서당 하나뿐인 위임 island. astro.config.mjs의
// rehypeMermaidPlaceholder가 ```mermaid 펜스마다 남겨둔 [data-mermaid-code] 빈 div를 전부 찾아 그린다.
// 테마 전환 시 재렌더: useThemeClass 구독 → effect 재실행 → data-mermaid-code(원문)로 복원 후 다시 그림.
export default function MermaidDelegate() {
  const theme = useThemeClass()

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-mermaid-code]'))
    if (nodes.length === 0) return

    for (const el of nodes) {
      el.textContent = el.dataset.mermaidCode ?? ''
      el.removeAttribute('data-processed')
    }

    // mermaid는 파싱/렌더 실패 시 non-Error를 throw/reject하기도 해 페이지 전체를 죽일 수 있다 — 방어
    try {
      mermaid.initialize({ startOnLoad: false, securityLevel: 'loose', theme: theme === 'dark' ? 'dark' : 'default' })
      void Promise.resolve(mermaid.run({ nodes })).catch(() => {})
    } catch {
      /* 다이어그램 렌더 실패는 무시 */
    }
  }, [theme])

  // client:visible의 IntersectionObserver 관찰 대상
  return <div className="sr-only" aria-hidden="true" />
}
