// app/[locale]/blog/[...slug]/page.tsx의 generateMetadata(27-96행)·Page(108-172행) 대응.
// ko/en 페이지 파일 두 곳(src/pages/blog/[...slug].astro, src/pages/en/blog/[...slug].astro)이
// 이 모듈 하나를 공유해 메타·JSON-LD·prev/next·altLocale 계산을 중복하지 않는다.
// 런타임 redirect(page.tsx:116-135, legacy slug/반대 locale 안내)는 이식하지 않는다 — _redirects 소관.
import { getCollection } from 'astro:content'
import siteMetadata from '../../data/siteMetadata.js'
import { type Entry, entrySlug, findBySlug, type Locale, pairOf, postsForLocale, postUrl } from './posts'

export interface AuthorDetail {
  name: string
  avatar?: string
  twitter?: string
}

async function authorsFor(entry: Entry): Promise<AuthorDetail[]> {
  const ids = entry.data.authors && entry.data.authors.length > 0 ? entry.data.authors : ['default']
  const authorEntries = await getCollection('authors')
  return ids.map((id) => {
    const found = authorEntries.find((a) => a.id === id)
    return found ? { name: found.data.name, avatar: found.data.avatar, twitter: found.data.twitter } : { name: id }
  })
}

// generateMetadata:56 `img.includes('http') ? img : siteUrl + img`와 동일 판정.
// Next의 Metadata API는 og:image/twitter:image를 URL로 해석해 비-ASCII를 퍼센트 인코딩한다 —
// JSON-LD의 image 필드(문자열 그대로, 인코딩 없음)와는 다르므로 여기서만 encodeURI를 적용한다.
function absoluteUrl(path: string): string {
  return encodeURI(path.includes('http') ? path : `${siteMetadata.siteUrl}${path}`)
}

export interface PostRef {
  title: string
  slug: string
}

export interface PostPageData {
  entry: Entry
  locale: Locale
  slug: string
  path: string // "blog/<slug>" — editUrl/discussUrl용 (layouts/PostLayout.tsx:13-15 대응)
  filePath: string // "blog/<id>.mdx"
  authorDetails: AuthorDetail[]
  ogImage: string
  publishedAt: string
  modifiedAt: string
  canonical: string
  hreflang?: { ko: string; en: string; xDefault: string }
  jsonLd: Record<string, unknown>
  prev?: PostRef
  next?: PostRef
  altLocale?: { href: string; label: string }
}

export async function loadPostPage(locale: Locale, slug: string): Promise<PostPageData | undefined> {
  const entry = await findBySlug(locale, slug)
  if (!entry) return undefined

  const authorDetails = await authorsFor(entry)
  const publishedAt = entry.data.date.toISOString()
  const modifiedAt = (entry.data.lastmod ?? entry.data.date).toISOString()

  const frontmatterImages = entry.data.images
    ? typeof entry.data.images === 'string'
      ? [entry.data.images]
      : entry.data.images
    : undefined

  // og:image/twitter:image: frontmatter images 우선, 없으면 빌드 타임 생성 OG 스크린샷 (generateMetadata:50-58)
  const ogImage = absoluteUrl(frontmatterImages?.[0] ?? `/og/blog/${locale}/${slug}.png`)

  const canonical = `${siteMetadata.siteUrl}${postUrl(locale, slug)}`
  const pair = await pairOf(entry)
  const hreflang = pair
    ? {
        ko: `${siteMetadata.siteUrl}${postUrl('ko', entrySlug(pair.ko))}`,
        en: `${siteMetadata.siteUrl}${postUrl('en', entrySlug(pair.en))}`,
        // 어느 locale에도 안 맞는 국제 사용자에게는 영어 (ADR-0002)
        xDefault: `${siteMetadata.siteUrl}${postUrl('en', entrySlug(pair.en))}`,
      }
    : undefined

  // JSON-LD image: contentlayer.config.ts:148-164 structuredData 대응 — og:image와 별개 기본값(socialBanner), 절대경로 변환 없음
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: entry.data.title,
    datePublished: publishedAt,
    dateModified: modifiedAt,
    description: entry.data.summary,
    image: frontmatterImages?.[0] ?? siteMetadata.socialBanner,
    url: canonical,
    inLanguage: locale === 'en' ? 'en' : 'ko',
    author: authorDetails.map((a) => ({ '@type': 'Person', name: a.name })),
  }

  const sorted = await postsForLocale(locale)
  const idx = sorted.findIndex((p) => entrySlug(p) === slug)
  const toRef = (p?: Entry): PostRef | undefined => (p ? { title: p.data.title, slug: entrySlug(p) } : undefined)
  const prev = toRef(sorted[idx + 1])
  const next = toRef(sorted[idx - 1])

  const altLocale = pair
    ? locale === 'ko'
      ? { href: postUrl('en', entrySlug(pair.en)), label: 'Read in English →' }
      : { href: postUrl('ko', entrySlug(pair.ko)), label: '한국어로 읽기 →' }
    : undefined

  return {
    entry,
    locale,
    slug,
    path: `blog/${slug}`,
    filePath: `blog/${entry.id}.mdx`,
    authorDetails,
    ogImage,
    publishedAt,
    modifiedAt,
    canonical,
    hreflang,
    jsonLd,
    prev,
    next,
    altLocale,
  }
}

export async function postPagesForLocale(locale: Locale): Promise<PostPageData[]> {
  const posts = await postsForLocale(locale)
  const pages = await Promise.all(posts.map((p) => loadPostPage(locale, entrySlug(p))))
  return pages.filter((p): p is PostPageData => p !== undefined)
}
