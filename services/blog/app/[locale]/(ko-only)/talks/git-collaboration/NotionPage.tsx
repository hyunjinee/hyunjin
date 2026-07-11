'use client'

import 'react-notion-x/src/styles.css'
import 'prismjs/themes/prism-tomorrow.css'
import './notion-overrides.css'
import type { ExtendedRecordMap } from 'notion-types'
import { useTheme } from 'next-themes'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { NotionRenderer } from 'react-notion-x'

const Code = dynamic(() => import('react-notion-x/build/third-party/code').then((m) => m.Code))

export default function NotionPage({ recordMap }: { recordMap: ExtendedRecordMap }) {
  const { resolvedTheme } = useTheme()
  // next-themes는 SSR 시점에 테마를 모름 — mount 후에만 resolvedTheme 신뢰
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <NotionRenderer
      recordMap={recordMap}
      fullPage
      darkMode={mounted && resolvedTheme === 'dark'}
      disableHeader
      components={{ Code }}
      // 스냅샷 시점에 이미지 URL을 전부 로컬 경로로 재작성했으므로 그대로 사용.
      // page_icon만 isUrl 게이트 통과를 위해 절대 URL로 저장 — 여기서 상대경로로 환원
      mapImageUrl={(url) => (url ? url.replace('https://hyunjinlee.com/', '/') : url)}
    />
  )
}
