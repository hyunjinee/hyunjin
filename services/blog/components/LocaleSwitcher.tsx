'use client'

import { usePathname } from 'next/navigation'
import Link from './Link'
import { stripLocalePrefix, localePath, type Locale } from 'lib/locale'

// localized 표면에서만 무프리픽스 경로를 그대로 전환한다 (그 외 ko-only 표면에서 EN은 홈으로)
const isLocalizedSurface = (path: string) =>
  path === '/' || path === '/blog' || path.startsWith('/blog/') || path === '/tags' || path.startsWith('/tags/')

// 글 상세는 [...slug] 페이지의 교차 locale 리다이렉트가 번역 쌍으로 보정한다
export default function LocaleSwitcher() {
  const pathname = usePathname() ?? '/'
  const { locale, path } = stripLocalePrefix(pathname)
  const target: Locale = locale === 'en' ? 'ko' : 'en'
  const href = target === 'ko' ? localePath('ko', path) : isLocalizedSurface(path) ? localePath('en', path) : '/en'

  return (
    <Link
      href={href}
      // 영어 브라우저 사용자의 첫 '한국어' 클릭이 proxy 언어 감지에 되튕기지 않도록 선택을 쿠키에 고정
      onClick={() => {
        document.cookie = `NEXT_LOCALE=${target}; path=/; max-age=31536000`
      }}
      aria-label={target === 'ko' ? '한국어로 전환' : 'Switch to English'}
      className="font-medium text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400"
    >
      {target === 'ko' ? '한국어' : 'EN'}
    </Link>
  )
}
