import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { notFound } from 'next/navigation'
import CustomLink from '@/components/Link'
import { genPageMetadata } from 'app/seo'
import type { ExtendedRecordMap } from 'notion-types'
import NotionPage from '../NotionPage'
import { materials } from '../materials'

export function generateStaticParams() {
  return materials.map((m) => ({ id: m.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const material = materials.find((m) => m.id === id)
  if (!material) return {}
  return genPageMetadata({ title: material.title, description: material.description })
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const index = materials.findIndex((m) => m.id === id)
  if (index === -1) notFound()

  // Notion 스냅샷(레포 내 JSON) — 빌드·런타임 모두 네트워크 의존 없음
  const raw = await readFile(
    path.join(process.cwd(), 'app/[locale]/(ko-only)/talks/git-collaboration/records', `${materials[index].id}.json`),
    'utf8',
  )
  const recordMap = JSON.parse(raw) as ExtendedRecordMap

  const prev = materials[index - 1]
  const next = materials[index + 1]

  return (
    <div className="container py-8 md:py-10">
      <CustomLink
        href="/talks/git-collaboration"
        className="inline-block mb-6 text-sm text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
      >
        ← Git을 활용한 협업
      </CustomLink>
      <NotionPage recordMap={recordMap} />
      <nav className="flex justify-between pt-6 mt-10 text-sm border-t border-gray-200 dark:border-gray-700">
        {prev ? (
          <CustomLink
            href={`/talks/git-collaboration/${prev.id}`}
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
          >
            ← {prev.title}
          </CustomLink>
        ) : (
          <span />
        )}
        {next && (
          <CustomLink
            href={`/talks/git-collaboration/${next.id}`}
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
          >
            {next.title} →
          </CustomLink>
        )}
      </nav>
    </div>
  )
}
