import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

// entry.id를 항상 '확장자 뺀 상대 경로'로 고정한다 (frontmatter slug 유무와 무관).
// locale 판별(entry.id가 'en/'로 시작 여부)이 이 경로에 의존하므로,
// slug가 있는 글의 id가 slug로 대체되어 경로 정보가 사라지는 걸 막는다.
const stripExt = ({ entry }: { entry: string }) => entry.replace(/\.mdx$/, '')

// contentlayer.config.ts:126-166 대응
const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './data/blog', generateId: stripExt }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    lastmod: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    summary: z.string().nullable().optional(),
    images: z.union([z.string(), z.array(z.string())]).optional(),
    authors: z.array(z.string()).optional(),
    layout: z.enum(['PostLayout', 'PostSimple', 'PostBanner']).optional(),
    slug: z.string().optional(),
    translationOf: z.string().optional(), // 번역 글에만: 원문(ko)의 slug
    bannerFit: z.string().optional(),
    bibliography: z.string().optional(),
    canonicalUrl: z.string().optional(),
  }),
})

// contentlayer.config.ts:168-185 대응
const authors = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './data/authors', generateId: stripExt }),
  schema: z.object({
    name: z.string(),
    avatar: z.string().optional(),
    occupation: z.string().optional(),
    company: z.string().optional(),
    email: z.string().optional(),
    twitter: z.string().optional(),
    linkedin: z.string().optional(),
    github: z.string().optional(),
    youtube: z.string().optional(),
    layout: z.string().optional(),
  }),
})

export const collections = { blog, authors }
