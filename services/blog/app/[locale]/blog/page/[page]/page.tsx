import ListLayout from '@/layouts/ListLayoutWithTags'
import { coreListFor, isLocale, LOCALES, type Locale } from 'lib/posts'
import { notFound } from 'next/navigation'

const POSTS_PER_PAGE = 5

export const generateStaticParams = async () => {
  return LOCALES.flatMap((locale) => {
    const totalPages = Math.max(1, Math.ceil(coreListFor(locale).length / POSTS_PER_PAGE))
    return Array.from({ length: totalPages }, (_, i) => ({ locale, page: (i + 1).toString() }))
  })
}

export default async function Page({ params }: { params: Promise<{ locale: string; page: string }> }) {
  const { locale, page } = await params
  if (!isLocale(locale)) notFound()
  const posts = coreListFor(locale)
  const pageNumber = parseInt(page)
  const initialDisplayPosts = posts.slice(POSTS_PER_PAGE * (pageNumber - 1), POSTS_PER_PAGE * pageNumber)
  const pagination = { currentPage: pageNumber, totalPages: Math.ceil(posts.length / POSTS_PER_PAGE) }
  return <ListLayout posts={posts} initialDisplayPosts={initialDisplayPosts} pagination={pagination} title="All Posts" />
}
