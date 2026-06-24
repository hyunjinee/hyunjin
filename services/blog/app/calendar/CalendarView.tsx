'use client'

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState } from 'react'
import Link from '@/components/Link'
import type { CalendarEvent } from '@/data/eventsData'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

type CategoryStyle = { chip: string; dot: string }

const CATEGORY_COLORS: Record<string, CategoryStyle> = {
  talk: { chip: 'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-300', dot: 'bg-primary-500' },
  lecture: { chip: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300', dot: 'bg-amber-500' },
  workshop: { chip: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300', dot: 'bg-cyan-500' },
  podcast: { chip: 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/20 dark:text-fuchsia-300', dot: 'bg-fuchsia-500' },
  report: { chip: 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300', dot: 'bg-violet-500' },
  release: {
    chip: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
    dot: 'bg-emerald-500',
  },
  personal: { chip: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300', dot: 'bg-rose-500' },
}

const DEFAULT_COLOR: CategoryStyle = {
  chip: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200',
  dot: 'bg-gray-400',
}

function colorFor(category?: string): CategoryStyle {
  return (category && CATEGORY_COLORS[category]) || DEFAULT_COLOR
}

/** Date → 'YYYY-MM-DD' (로컬 기준, 타임존 시프트 방지) */
function toKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** 'YYYY-MM-DD' → '2026년 6월 24일' */
function formatKorean(dateStr: string): string {
  const [y, m, d] = dateStr.split('-')
  return `${y}년 ${Number(m)}월 ${Number(d)}일`
}

/** 단일/다일 일정 날짜 표기 */
function formatRange(e: CalendarEvent): string {
  return e.endDate && e.endDate !== e.date ? `${formatKorean(e.date)} – ${formatKorean(e.endDate)}` : formatKorean(e.date)
}

/** 해당 날짜(key)에 걸치는 이벤트들 — ISO 문자열 비교로 [date, endDate] 포함 판정 */
function eventsOnDay(events: CalendarEvent[], dayKey: string): CalendarEvent[] {
  return events.filter((e) => e.date <= dayKey && dayKey <= (e.endDate ?? e.date))
}

export default function CalendarView({ events }: { events: CalendarEvent[] }) {
  const today = new Date()
  const todayKey = toKey(today)

  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() })
  const [selected, setSelected] = useState<CalendarEvent | null>(null)

  const firstOfMonth = new Date(view.year, view.month, 1)
  const startWeekday = firstOfMonth.getDay() // 0=일
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate()
  const totalCells = Math.ceil((startWeekday + daysInMonth) / 7) * 7

  const cells = Array.from({ length: totalCells }, (_, i) => {
    const cellDate = new Date(view.year, view.month, 1 - startWeekday + i)
    return {
      date: cellDate,
      key: toKey(cellDate),
      inMonth: cellDate.getMonth() === view.month,
      weekday: cellDate.getDay(),
    }
  })

  const goPrev = () => setView((v) => (v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 }))
  const goNext = () => setView((v) => (v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 }))
  const goToday = () => setView({ year: today.getFullYear(), month: today.getMonth() })

  const usedCategories = [...new Set(events.map((e) => e.category).filter(Boolean) as string[])]
  const agenda = [...events].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div>
      {/* 상단: 월 이동 컨트롤 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {view.year}년 {view.month + 1}월
        </h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={goPrev}
            aria-label="이전 달"
            className="px-3 py-1.5 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            &larr;
          </button>
          <button
            type="button"
            onClick={goToday}
            className="px-3 py-1.5 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            오늘
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="다음 달"
            className="px-3 py-1.5 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            &rarr;
          </button>
        </div>
      </div>

      {/* 요일 헤더 + 날짜 칸 */}
      <div className="grid grid-cols-7 border-t border-l border-gray-200 dark:border-gray-700">
        {WEEKDAYS.map((w, i) => (
          <div
            key={w}
            className={`border-r border-b border-gray-200 px-1 py-1.5 text-center text-xs font-semibold dark:border-gray-700 ${
              i === 0 ? 'text-rose-500' : i === 6 ? 'text-primary-500' : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {w}
          </div>
        ))}

        {cells.map((cell) => {
          const dayEvents = eventsOnDay(events, cell.key)
          const isToday = cell.key === todayKey
          return (
            <div
              key={cell.key}
              className={`min-h-20 border-r border-b border-gray-200 p-1 align-top sm:min-h-24 sm:p-1.5 dark:border-gray-700 ${
                cell.inMonth ? 'bg-white dark:bg-gray-950' : 'bg-gray-50 dark:bg-gray-900/40'
              }`}
            >
              <div
                className={`mb-1 flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                  isToday
                    ? 'bg-primary-500 font-bold text-white'
                    : cell.inMonth
                      ? cell.weekday === 0
                        ? 'text-rose-500'
                        : 'text-gray-700 dark:text-gray-300'
                      : 'text-gray-400 dark:text-gray-600'
                }`}
              >
                {cell.date.getDate()}
              </div>
              <div className="space-y-1">
                {dayEvents.map((e, idx) => {
                  const style = colorFor(e.category)
                  return (
                    <button
                      key={`${e.title}-${idx}`}
                      type="button"
                      onClick={() => setSelected(e)}
                      title={e.description || e.title}
                      className={`flex w-full cursor-pointer items-center gap-1 rounded px-1 py-0.5 text-left transition hover:brightness-95 sm:px-1.5 dark:hover:brightness-110 ${style.chip}`}
                    >
                      {/* 모바일: 점만, sm 이상: 제목 칩 */}
                      <span className={`h-1.5 w-1.5 shrink-0 rounded-full sm:hidden ${style.dot}`} />
                      <span className="hidden truncate text-[11px] leading-tight sm:block">{e.title}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* 카테고리 범례 */}
      {usedCategories.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-xs text-gray-500 dark:text-gray-400">
          {usedCategories.map((c) => (
            <span key={c} className="inline-flex items-center gap-1.5">
              <span className={`inline-block h-2.5 w-2.5 rounded-full ${colorFor(c).dot}`} />
              {c}
            </span>
          ))}
        </div>
      )}

      {/* 전체 일정 (아젠다 리스트) */}
      {agenda.length > 0 && (
        <div className="mt-10">
          <h3 className="mb-2 text-sm font-semibold text-gray-500 dark:text-gray-400">전체 일정</h3>
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {agenda.map((e, i) => {
              const style = colorFor(e.category)
              return (
                <li key={`${e.title}-${e.date}-${i}`}>
                  <button
                    type="button"
                    onClick={() => setSelected(e)}
                    className="group flex w-full flex-col gap-0.5 py-2.5 text-left sm:flex-row sm:items-center sm:gap-3"
                  >
                    <span className="flex items-center gap-2">
                      <span className={`h-2 w-2 shrink-0 rounded-full ${style.dot}`} />
                      <time className="whitespace-nowrap text-xs tabular-nums text-gray-500 dark:text-gray-400">
                        {formatRange(e)}
                      </time>
                    </span>
                    <span className="truncate text-sm text-gray-800 group-hover:text-primary-500 dark:text-gray-200 dark:group-hover:text-primary-400">
                      {e.title}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {/* 일정 상세 모달 */}
      {selected && (
        <Dialog open onClose={() => setSelected(null)} className="relative z-50">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-200 data-[closed]:opacity-0"
          />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl transition duration-200 data-[closed]:scale-95 data-[closed]:opacity-0 dark:bg-gray-900"
            >
              <div className="flex items-start justify-between gap-4">
                <span
                  className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${colorFor(selected.category).chip}`}
                >
                  {selected.category ?? '일정'}
                </span>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  aria-label="닫기"
                  className="-mr-1 -mt-1 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
              <DialogTitle className="mt-3 text-xl font-bold text-gray-900 dark:text-gray-100">
                {selected.title}
              </DialogTitle>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{formatRange(selected)}</p>
              {selected.description && (
                <p className="mt-4 text-sm leading-6 text-gray-700 dark:text-gray-300">{selected.description}</p>
              )}
              {selected.url && (
                <div className="mt-6">
                  <Link
                    href={selected.url}
                    className="inline-flex items-center text-sm font-medium text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    자세히 보기 &rarr;
                  </Link>
                </div>
              )}
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </div>
  )
}
