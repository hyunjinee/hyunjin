'use client'

import Link from 'next/link'
import { useState } from 'react'
import contributions from '@/data/githubContributions.json'

// 데이터 갱신: node scripts/github-contributions.mjs
const LEVEL_CLASSES = [
  'bg-gray-100 dark:bg-gray-800',
  'bg-primary-200 dark:bg-primary-900',
  'bg-primary-300 dark:bg-primary-700',
  'bg-primary-500 dark:bg-primary-500',
  'bg-primary-700 dark:bg-primary-300',
]

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

function formatTip(date: string, count: number) {
  const [, m, d] = date.split('-').map(Number)
  const ord = d % 10 === 1 && d !== 11 ? 'st' : d % 10 === 2 && d !== 12 ? 'nd' : d % 10 === 3 && d !== 13 ? 'rd' : 'th'
  const label = `${MONTHS[m - 1]} ${d}${ord}`
  return count === 0 ? `No contributions on ${label}.` : `${count} contribution${count === 1 ? '' : 's'} on ${label}.`
}

type Day = { date: string; count: number; level: number }
type Tip = { text: string; x: number; y: number }

function YearGrid({
  year,
  total,
  days,
  onTip,
}: {
  year: number
  total: number
  days: Day[]
  onTip: (tip: Tip | null) => void
}) {
  const padding = new Date(`${days[0].date}T00:00:00Z`).getUTCDay()

  const handleOver = (e: React.MouseEvent) => {
    const t = e.target as HTMLElement
    const { date, count } = t.dataset
    if (!date) return
    const rect = t.getBoundingClientRect()
    onTip({ text: formatTip(date, Number(count)), x: rect.left + rect.width / 2, y: rect.top - 6 })
  }

  return (
    <div>
      <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
        <span className="font-semibold text-gray-900 dark:text-gray-100">{year}</span> ·{' '}
        {total.toLocaleString()} contributions
      </p>
      <div className="overflow-x-auto" onScroll={() => onTip(null)}>
        <div
          className="grid w-max grid-flow-col grid-rows-7 gap-[3px]"
          onMouseOver={handleOver}
          onMouseOut={() => onTip(null)}
        >
          {Array.from({ length: padding }, (_, i) => (
            <span key={`pad-${i}`} className="h-[10px] w-[10px]" />
          ))}
          {days.map((d) => (
            <span
              key={d.date}
              data-date={d.date}
              data-count={d.count}
              className={`h-[10px] w-[10px] rounded-[2px] ${LEVEL_CLASSES[d.level] ?? LEVEL_CLASSES[0]}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function GithubContributions() {
  const [tip, setTip] = useState<Tip | null>(null)

  return (
    <section className="mb-12">
      <h2 className="pb-2 mb-8 text-2xl font-bold text-gray-900 border-b-2 border-gray-200 md:text-3xl dark:text-gray-100 dark:border-gray-700">
        GitHub
      </h2>
      <div className="space-y-8">
        {contributions.years.map((y) => (
          <YearGrid key={y.year} year={y.year} total={y.total} days={y.days} onTip={setTip} />
        ))}
      </div>
      <p className="mt-4 text-xs text-gray-400 dark:text-gray-600">
        <Link
          href={`https://github.com/${contributions.user}`}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-primary-500"
        >
          @{contributions.user} ↗
        </Link>{' '}
        · {contributions.updated} 기준
      </p>
      {tip && (
        <div
          className="fixed z-50 px-2 py-1 text-xs font-medium text-white whitespace-nowrap rounded-md pointer-events-none -translate-x-1/2 -translate-y-full bg-gray-900 dark:bg-gray-600"
          style={{ left: tip.x, top: tip.y }}
        >
          {tip.text}
        </div>
      )}
    </section>
  )
}
