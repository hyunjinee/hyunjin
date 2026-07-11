import { type NextRequest, NextResponse } from 'next/server'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

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

export function proxy(request: NextRequest) {
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
  matcher: ['/((?!api|og|_next|.*\\..*).*)'],
}
