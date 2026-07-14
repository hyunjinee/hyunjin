import { getCollection } from 'astro:content'
import { slug as githubSlug } from 'github-slugger'
import type { Locale } from './locale'
import { entryLocale } from './posts'

// 페이지·rss·검색이 공유할 단일 소스. contentlayer.config.ts:81-93 createTagCount 대응 (draft 제외)
export async function tagCounts(locale: Locale): Promise<Record<string, number>> {
  const entries = await getCollection('blog', (entry) => !entry.data.draft && entryLocale(entry) === locale)
  const counts: Record<string, number> = {}
  for (const entry of entries) {
    for (const tag of entry.data.tags) {
      const key = githubSlug(tag)
      counts[key] = (counts[key] ?? 0) + 1
    }
  }
  return counts
}
