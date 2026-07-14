// contentlayer/allBlogs를 import하지 않는 순수 locale 유틸 — 클라이언트 번들에서 글 데이터를 배제한다
export type Locale = 'ko' | 'en'
export const LOCALES: Locale[] = ['ko', 'en']
export const isLocale = (v: string): v is Locale => (LOCALES as string[]).includes(v)

export function postUrl(locale: Locale, slug: string): string {
  return locale === 'en' ? `/en/blog/${slug}` : `/blog/${slug}`
}

export function localePath(locale: Locale, path: string): string {
  if (locale === 'ko') return path
  return path === '/' ? '/en' : `/en${path}`
}

// astro.config.mjs의 build.format:'file'에서 Astro.url.pathname은 실제 서빙 경로(무확장자)가 아니라
// 빌드 산출 파일 경로(/blog.html, /index.html)를 그대로 반환한다(실측 확인) — 서빙 URL 기준으로 비교·링크
// 생성을 하려면 반드시 이 정규화를 거쳐야 한다.
function stripHtmlSuffix(pathname: string): string {
  if (pathname.endsWith('/index.html')) return pathname.slice(0, -'index.html'.length) || '/'
  if (pathname.endsWith('.html')) return pathname.slice(0, -'.html'.length)
  return pathname
}

// 프리렌더 시 pathname이 /ko/*로 들어와도 서빙 URL(무프리픽스)에 맞는 locale·path를 돌려준다
// /ko/blog→{ko,'/blog'}, /en/blog→{en,'/blog'}, /blog→{ko,'/blog'}, /en→{en,'/'}, /ko→{ko,'/'}
export function stripLocalePrefix(rawPathname: string): { locale: Locale; path: string } {
  const pathname = stripHtmlSuffix(rawPathname)
  const m = pathname.match(/^\/(ko|en)(?=\/|$)/)
  if (m) {
    return { locale: m[1] as Locale, path: pathname.slice(m[0].length) || '/' }
  }
  return { locale: 'ko', path: pathname || '/' }
}
