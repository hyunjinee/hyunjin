/**
 * i18n middleware for locale routing — 이제 `next dev` 전용.
 * 프로덕션(output: 'export')에선 실행되지 않는다: 무프리픽스 ko는 postexport.mjs의 트리 병합,
 * /ko 정규화·legacy 301은 _redirects가 대신한다. Accept-Language 첫 방문 감지는 export에서 미지원(보류).
 */

import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { type NextRequest, NextResponse } from 'next/server'

const LOCALES = ['ko', 'en']
const DEFAULT_LOCALE = 'ko'
const LOCALE_COOKIE = 'NEXT_LOCALE'

function preferredLocale(request: NextRequest): string {
  const headers = { 'accept-language': request.headers.get('accept-language') ?? '' }
  const languages = new Negotiator({ headers }).languages()
  try {
    return match(languages, LOCALES, DEFAULT_LOCALE)
  } catch {
    return DEFAULT_LOCALE
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 기본 언어(ko)는 무프리픽스가 정규 URL: /ko/* 접근은 벗겨서 308
  if (pathname === '/ko' || pathname.startsWith('/ko/')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.replace(/^\/ko/, '') || '/'
    return NextResponse.redirect(url, 308)
  }

  // /en/*는 세그먼트가 그대로 처리
  if (pathname === '/en' || pathname.startsWith('/en/')) {
    return NextResponse.next()
  }

  // 첫 방문 언어 감지: 홈에서만, 쿠키가 없을 때 1회만. 글 URL은 절대 자동 이동하지 않는다.
  if (pathname === '/' && !request.cookies.has(LOCALE_COOKIE) && preferredLocale(request) === 'en') {
    const url = request.nextUrl.clone()
    url.pathname = '/en'
    const response = NextResponse.redirect(url, 307)
    response.cookies.set(LOCALE_COOKIE, 'en', { path: '/', maxAge: 60 * 60 * 24 * 365 })
    return response
  }

  // 무프리픽스 = ko를 내부 rewrite (주소창 URL 유지)
  const url = request.nextUrl.clone()
  url.pathname = `/ko${pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  // api·og·Next 내부·정적 파일(점 포함 경로: feed.xml, search.json, favicon 등)은 제외
  // ponytail: 점 포함 slug(예: node.js)는 정적 파일과 구분 불가 → rewrite를 건너뛴다. 슬러그에 점이 필요하면 matcher를 정교화할 것
  matcher: ['/((?!api|og|_next|.*\\..*).*)'],
}
