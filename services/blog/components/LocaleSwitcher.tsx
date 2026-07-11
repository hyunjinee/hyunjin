'use client'

import { usePathname } from 'next/navigation'
import Link from './Link'

// 글 상세는 [...slug] 페이지의 교차 locale 리다이렉트가 번역 쌍으로 보정한다
export default function LocaleSwitcher() {
  const pathname = usePathname() ?? '/'
  const isEn = pathname === '/en' || pathname.startsWith('/en/')
  const target = isEn ? pathname.replace(/^\/en/, '') || '/' : pathname === '/' ? '/en' : `/en${pathname}`
  return (
    <Link
      href={target}
      aria-label={isEn ? '한국어로 전환' : 'Switch to English'}
      className="font-medium text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400"
    >
      {isEn ? '한국어' : 'EN'}
    </Link>
  )
}
