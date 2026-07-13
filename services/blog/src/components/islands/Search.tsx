import {
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarResults,
  KBarSearch,
  useKBar,
  useMatches,
  useRegisterActions,
} from 'kbar'
import { useEffect, useState } from 'react'
import type { Locale } from '../../lib/locale'

interface SearchDoc {
  title: string
  path: string
  summary?: string
}

// kbar는 액션 id를 내부적으로 btoa로 인코딩하는데, 한글처럼 Latin1 범위를 벗어나는 문자가 들어가면
// "characters outside of the Latin1 range" 에러로 죽는다. UTF-8 바이트를 경유해 우회한다.
// (원본 components/BtoaPolyfill.tsx의 패치 로직 — 전역 오염을 피하려고 이 island 마운트 동안만 적용)
function patchBtoa() {
  const originalBtoa = window.btoa
  const originalAtob = window.atob
  window.btoa = (str: string) => {
    try {
      const bytes = new TextEncoder().encode(str)
      const binString = Array.from(bytes, (b) => String.fromCharCode(b)).join('')
      return originalBtoa(binString)
    } catch {
      return originalBtoa(str)
    }
  }
  window.atob = (str: string) => {
    try {
      const binString = originalAtob(str)
      const bytes = Uint8Array.from(binString, (c) => c.charCodeAt(0))
      return new TextDecoder().decode(bytes)
    } catch {
      return originalAtob(str)
    }
  }
  return () => {
    window.btoa = originalBtoa
    window.atob = originalAtob
  }
}

function SearchTrigger() {
  const { query } = useKBar()
  return (
    <button type="button" aria-label="Search" onClick={() => query.toggle()}>
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-6 w-6 text-gray-900 hover:text-primary-500 dark:text-gray-100
          dark:hover:text-primary-400"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>
    </button>
  )
}

function SearchResults() {
  const { results } = useMatches()
  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === 'string' ? (
          <div className="px-4 py-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">{item}</div>
        ) : (
          <div
            className={`cursor-pointer px-4 py-3 ${
              active ? 'bg-primary-600 text-white' : 'text-gray-900 dark:text-gray-100'
            }`}
          >
            <div className="font-medium">{item.name}</div>
            {item.subtitle && <div className="truncate text-sm opacity-75">{item.subtitle}</div>}
          </div>
        )
      }
    />
  )
}

function SearchActions({ locale }: { locale: Locale }) {
  const [docs, setDocs] = useState<SearchDoc[]>([])

  useEffect(() => {
    const path = locale === 'en' ? '/search-en.json' : '/search.json'
    fetch(path)
      .then((res) => res.json())
      .then(setDocs)
      .catch(() => setDocs([]))
  }, [locale])

  useRegisterActions(
    docs.map((doc) => ({
      id: doc.path,
      name: doc.title,
      subtitle: doc.summary,
      // 선택 시 정적 페이지로 이동 — index의 path는 선행 슬래시 없이 저장돼 있다
      perform: () => {
        window.location.href = `/${doc.path}`
      },
    })),
    [docs],
  )

  return null
}

export default function Search({ locale = 'ko' }: { locale?: Locale }) {
  useEffect(() => patchBtoa(), [])

  return (
    <KBarProvider actions={[]}>
      <SearchActions locale={locale} />
      <SearchTrigger />
      <KBarPortal>
        <KBarPositioner className="z-[100] bg-black/40 p-4">
          <KBarAnimator className="w-full max-w-xl overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800">
            <KBarSearch className="w-full border-b border-gray-200 px-4 py-3 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
            <SearchResults />
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
    </KBarProvider>
  )
}
