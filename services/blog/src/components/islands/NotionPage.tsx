// app/[locale]/(ko-only)/talks/git-collaboration/NotionPage.tsx 이식.
// next-themes useTheme → useThemeClass(html.dark 클래스 구독, Mermaid.tsx 선례와 동일 계약).
// next/dynamic(Code) → React.lazy + Suspense. 원본은 dynamic(ssr:false) 없이 서버 렌더링됐으므로(Next
// 'use client'는 기본적으로 SSR됨) client:load로 동일하게 SSR + hydrate.
import 'react-notion-x/src/styles.css'
import 'prismjs/themes/prism-tomorrow.css'
import './notion-overrides.css'
import type { ExtendedRecordMap } from 'notion-types'
import { lazy, Suspense } from 'react'
import { NotionRenderer } from 'react-notion-x'
import { useThemeClass } from '../../lib/useThemeClass'

const Code = lazy(() => import('react-notion-x/build/third-party/code').then((m) => ({ default: m.Code })))

export default function NotionPage({ recordMap }: { recordMap: ExtendedRecordMap }) {
  const theme = useThemeClass()

  return (
    <Suspense fallback={null}>
      <NotionRenderer
        recordMap={recordMap}
        fullPage
        darkMode={theme === 'dark'}
        disableHeader
        components={{ Code }}
        mapImageUrl={(url) => (url ? url.replace('https://hyunjinlee.com/', '/') : url)}
      />
    </Suspense>
  )
}
