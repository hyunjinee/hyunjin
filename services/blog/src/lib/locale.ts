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

// 프리렌더 시 pathname이 /ko/*로 들어와도 서빙 URL(무프리픽스)에 맞는 locale·path를 돌려준다
// /ko/blog→{ko,'/blog'}, /en/blog→{en,'/blog'}, /blog→{ko,'/blog'}, /en→{en,'/'}, /ko→{ko,'/'}
export function stripLocalePrefix(pathname: string): { locale: Locale; path: string } {
  const m = pathname.match(/^\/(ko|en)(?=\/|$)/)
  if (m) {
    return { locale: m[1] as Locale, path: pathname.slice(m[0].length) || '/' }
  }
  return { locale: 'ko', path: pathname || '/' }
}
