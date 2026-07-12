import { type CollectionEntry, getCollection } from 'astro:content'
import { slug as githubSlug } from 'github-slugger'
import { isLocale, LOCALES, type Locale, localePath, postUrl, stripLocalePrefix } from './locale'

// 기존 소비자 무파손을 위해 lib/locale 심볼을 re-export
export { type Locale, LOCALES, isLocale, postUrl, localePath, stripLocalePrefix }

export type Entry = CollectionEntry<'blog'>

// content.config.ts에서 entry.id를 '확장자 뺀 상대 경로'로 고정해뒀으므로 'en/' 접두사로 판별한다
// (contentlayer.config.ts:34-37 resolveDocLocale 대응)
export function entryLocale(entry: Entry): Locale {
  return entry.id.startsWith('en/') ? 'en' : 'ko'
}

// frontmatter slug 우선. 없으면 'en/' 접두사를 벗긴 경로를 kebab-case로
// (contentlayer.config.ts:53-58 resolveSlug 대응)
export function entrySlug(entry: Entry): string {
  if (entry.data.slug) return entry.data.slug
  const segs = entry.id.split('/')
  const rest = segs[0] === 'en' ? segs.slice(1) : segs
  return githubSlug(rest.join('/'))
}

export async function postsForLocale(locale: Locale): Promise<Entry[]> {
  const entries = await getCollection('blog', (entry) => !entry.data.draft && entryLocale(entry) === locale)
  return entries.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
}

export async function findBySlug(locale: Locale, slug: string): Promise<Entry | undefined> {
  const entries = await getCollection('blog', (entry) => entryLocale(entry) === locale)
  return entries.find((entry) => entrySlug(entry) === slug)
}

export async function originalOf(post: Entry): Promise<Entry | undefined> {
  if (!post.data.translationOf) return undefined
  return findBySlug('ko', post.data.translationOf)
}

export async function translationFor(post: Entry): Promise<Entry | undefined> {
  if (entryLocale(post) !== 'ko') return undefined
  const enEntries = await getCollection('blog', (entry) => entryLocale(entry) === 'en')
  return enEntries.find((entry) => entry.data.translationOf === entrySlug(post))
}

export async function pairOf(post: Entry): Promise<{ ko: Entry; en: Entry } | undefined> {
  if (entryLocale(post) === 'ko') {
    const en = await translationFor(post)
    return en ? { ko: post, en } : undefined
  }
  const ko = await originalOf(post)
  return ko ? { ko, en: post } : undefined
}
