'use client'

import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
})

export default function Mermaid({ children }: { children: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      mermaid.run({ nodes: [ref.current] })
    }
  }, [children])

  return (
    <div ref={ref} className="mermaid">
      {children}
    </div>
  )
}
