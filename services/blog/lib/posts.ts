import { allBlogs, type Blog } from 'contentlayer/generated'
import { allCoreContent, sortPosts, type CoreContent } from 'pliny/utils/contentlayer'
import { type Locale, LOCALES, isLocale, postUrl, localePath, stripLocalePrefix } from './locale'

// 기존 소비자 무파손을 위해 lib/locale 심볼을 re-export
export { type Locale, LOCALES, isLocale, postUrl, localePath, stripLocalePrefix }

export function postsForLocale(locale: Locale): Blog[] {
  return allBlogs.filter((p) => p.locale === locale)
}

export function coreListFor(locale: Locale): CoreContent<Blog>[] {
  return allCoreContent(sortPosts(postsForLocale(locale)))
}

export function originalOf(post: Blog): Blog | undefined {
  if (!post.translationOf) return undefined
  return allBlogs.find((p) => p.locale === 'ko' && p.slug === post.translationOf)
}

export function translationFor(post: Blog): Blog | undefined {
  if (post.locale !== 'ko') return undefined
  return allBlogs.find((p) => p.locale === 'en' && p.translationOf === post.slug)
}

export function pairOf(post: Blog): { ko: Blog; en: Blog } | undefined {
  if (post.locale === 'ko') {
    const en = translationFor(post)
    return en ? { ko: post, en } : undefined
  }
  const ko = originalOf(post)
  return ko ? { ko, en: post } : undefined
}

export function findBySlug(locale: Locale, slug: string): Blog | undefined {
  return allBlogs.find((p) => p.locale === locale && p.slug === slug)
}
