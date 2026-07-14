// app/[locale]/(ko-only)/calendar/CalendarView.tsx 이식 — 월/일 뷰 전환, 모달, 스크롤 위치 등 상태가
// 556줄 전체에 걸쳐 있는 진짜 인터랙션이라 island로 유지(client:load — 페이지의 핵심 콘텐츠라 즉시 하이드레이션).
// next/link 기반 components/Link(내부·앵커·외부 세 갈래 처리) → island 안에서는 .astro 컴포넌트를 못 쓰므로
// 동일 분기를 plain <a>로 인라인 재현(Link.astro와 동일 계약 — src/components/Link.astro 참고).
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { useEffect, useRef, useState } from 'react'
import type { CalendarEvent } from '../../../data/eventsData'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']
const HOUR_PX = 48
const DAY_MIN = 24 * 60
const TOTAL_H = 24 * HOUR_PX

type View = { year: number; month: number }
type CategoryStyle = { chip: string; dot: string }

const CATEGORY_COLORS: Record<string, CategoryStyle> = {
  talk: { chip: 'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-300', dot: 'bg-primary-500' },
  lecture: { chip: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300', dot: 'bg-amber-500' },
  workshop: { chip: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300', dot: 'bg-cyan-500' },
  podcast: {
    chip: 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/20 dark:text-fuchsia-300',
    dot: 'bg-fuchsia-500',
  },
  event: { chip: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300', dot: 'bg-indigo-500' },
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

/** 'YYYY-MM-DD' 를 delta일 만큼 이동 */
function shiftDay(key: string, delta: number): string {
  const [y, m, d] = key.split('-').map(Number)
  return toKey(new Date(y, m - 1, d + delta))
}

/** 'HH:mm' → 자정 기준 분 */
function parseMin(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

/** 시간축 라벨: 0→'오전 12시', 13→'오후 1시' */
function hourLabel(h: number): string {
  if (h === 0) return '오전 12시'
  if (h < 12) return `오전 ${h}시`
  if (h === 12) return '오후 12시'
  return `오후 ${h - 12}시`
}

/** 'YYYY-MM-DD' → '2026년 6월 24일 (수)' */
function dayTitle(key: string): string {
  const [y, m, d] = key.split('-').map(Number)
  return `${y}년 ${m}월 ${d}일 (${WEEKDAYS[new Date(y, m - 1, d).getDay()]})`
}

/** 'YYYY-MM-DD' → '2026년 6월 24일' */
function formatKorean(dateStr: string): string {
  const [y, m, d] = dateStr.split('-')
  return `${y}년 ${Number(m)}월 ${Number(d)}일`
}

/** 모달/아젠다용 날짜·시간 표기 */
function formatWhen(e: CalendarEvent): string {
  const datePart =
    e.endDate && e.endDate !== e.date ? `${formatKorean(e.date)} – ${formatKorean(e.endDate)}` : formatKorean(e.date)
  return e.start ? `${datePart} · ${e.start}${e.end ? `–${e.end}` : ''}` : datePart
}

/** 해당 날짜(key)에 걸치는 이벤트들 — ISO 문자열 비교로 [date, endDate] 포함 판정 */
function eventsOnDay(events: CalendarEvent[], dayKey: string): CalendarEvent[] {
  return events.filter((e) => e.date <= dayKey && dayKey <= (e.endDate ?? e.date))
}

/** components/Link.tsx·Link.astro와 동일 계약: 내부(/)·앵커(#)는 plain, 그 외(외부)만 target=_blank+rel */
function isExternalHref(href: string): boolean {
  return !href.startsWith('/') && !href.startsWith('#')
}

/** 월간 그리드 (날짜 의존 → 마운트 후에만 렌더) */
function MonthGrid({
  view,
  todayKey,
  events,
  onSelectDay,
  onSelect,
}: {
  view: View
  todayKey: string
  events: CalendarEvent[]
  onSelectDay: (key: string) => void
  onSelect: (e: CalendarEvent) => void
}) {
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

  return (
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
            <button
              type="button"
              onClick={() => onSelectDay(cell.key)}
              aria-label={`${cell.date.getDate()}일 일 뷰`}
              className={`mb-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-xs transition hover:ring-1 hover:ring-primary-400 ${
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
            </button>
            <div className="space-y-1">
              {dayEvents.map((e, idx) => {
                const style = colorFor(e.category)
                return (
                  <button
                    key={`${e.title}-${idx}`}
                    type="button"
                    onClick={() => onSelect(e)}
                    title={e.description || e.title}
                    className={`flex w-full cursor-pointer items-center gap-1 rounded px-1 py-0.5 text-left transition hover:brightness-95 sm:px-1.5 dark:hover:brightness-110 ${style.chip}`}
                  >
                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full sm:hidden ${style.dot}`} />
                    <span className="hidden truncate text-[11px] leading-tight sm:block">
                      {e.start ? `${e.start} ` : ''}
                      {e.title}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/** 일간 시간축 뷰 (Google 캘린더 일 뷰 스타일) */
function DayView({
  dayKey,
  todayKey,
  events,
  onSelect,
}: {
  dayKey: string
  todayKey: string
  events: CalendarEvent[]
  onSelect: (e: CalendarEvent) => void
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const dayEvents = eventsOnDay(events, dayKey)
  const allDay = dayEvents.filter((e) => !e.start)
  const timed = dayEvents
    .filter((e) => e.start)
    .sort((a, b) => parseMin(a.start as string) - parseMin(b.start as string))
  const isToday = dayKey === todayKey
  const now = new Date()
  const nowTop = ((now.getHours() * 60 + now.getMinutes()) / DAY_MIN) * TOTAL_H

  // 첫 일정(없으면 오늘은 현재 시각, 아니면 오전 8시) 근처로 스크롤 — dayKey 변경 시에만 재스크롤
  // biome-ignore lint/correctness/useExhaustiveDependencies: 원본 eslint-disable-next-line react-hooks/exhaustive-deps 의도 보존
  useEffect(() => {
    if (!scrollRef.current) return
    const targetHour = timed.length ? parseMin(timed[0].start as string) / 60 : isToday ? now.getHours() : 8
    scrollRef.current.scrollTop = Math.max(0, targetHour * HOUR_PX - 24)
    // dayKey 변경 시에만 재스크롤
  }, [dayKey])

  return (
    <div>
      {/* 종일 일정 band */}
      {allDay.length > 0 && (
        <div className="mb-2 flex flex-wrap items-center gap-1 border-b border-gray-200 pb-2 dark:border-gray-700">
          <span className="mr-1 text-xs text-gray-400">종일</span>
          {allDay.map((e, i) => {
            const style = colorFor(e.category)
            return (
              <button
                key={`${e.title}-${i}`}
                type="button"
                onClick={() => onSelect(e)}
                className={`cursor-pointer rounded px-2 py-1 text-xs ${style.chip}`}
              >
                {e.title}
              </button>
            )
          })}
        </div>
      )}

      {/* 시간축 그리드 */}
      <div
        ref={scrollRef}
        className="max-h-[560px] overflow-y-auto rounded-md border border-gray-200 dark:border-gray-700"
      >
        <div className="relative" style={{ height: TOTAL_H }}>
          {Array.from({ length: 24 }, (_, h) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: 고정 24시간 그리드 — 순서가 바뀌지 않는다.
              key={h}
              className="absolute inset-x-0 border-t border-gray-100 dark:border-gray-800"
              style={{ top: h * HOUR_PX }}
            >
              <span className="absolute -top-2 left-1 w-11 text-right text-[11px] text-gray-400">{hourLabel(h)}</span>
            </div>
          ))}

          {/* 일정 영역 (시간 라벨 거터 우측) */}
          <div className="absolute inset-y-0 left-14 right-1">
            {timed.map((e, i) => {
              const style = colorFor(e.category)
              const sMin = parseMin(e.start as string)
              const eMin = e.end ? parseMin(e.end) : sMin + 60
              const top = (sMin / DAY_MIN) * TOTAL_H
              const height = Math.max(22, ((eMin - sMin) / DAY_MIN) * TOTAL_H)
              return (
                <button
                  key={`${e.title}-${i}`}
                  type="button"
                  onClick={() => onSelect(e)}
                  style={{ top, height }}
                  className={`absolute inset-x-0 cursor-pointer overflow-hidden rounded px-2 py-1 text-left transition hover:brightness-95 dark:hover:brightness-110 ${style.chip}`}
                >
                  <div className="truncate text-xs font-medium leading-tight">{e.title}</div>
                  <div className="truncate text-[11px] leading-tight opacity-80">
                    {e.start}
                    {e.end ? `–${e.end}` : ''}
                  </div>
                </button>
              )
            })}

            {/* 현재 시각 선 */}
            {isToday && (
              <div className="absolute inset-x-0 z-10" style={{ top: nowTop }}>
                <div className="border-t-2 border-red-500">
                  <div className="absolute -left-1.5 -top-[5px] h-2 w-2 rounded-full bg-red-500" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/** Google 지도 임베드 — 로딩 중 회색 스켈레톤, 로드 완료 시 페이드인(흰 박스 깜빡임 방지) */
function MapEmbed({ query, title }: { query: string; title: string }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className="relative mt-2 h-44 w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
      {!loaded && <div className="absolute inset-0 animate-pulse bg-gray-100 dark:bg-gray-800" />}
      <iframe
        title={title}
        src={`https://www.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => setLoaded(true)}
        className={`relative h-full w-full transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  )
}

/** view 계산(마운트 후) 전까지 보여줄 그리드 스켈레톤. 빈 흰 박스/CLS 방지 */
function CalendarSkeleton() {
  return (
    <div aria-hidden className="animate-pulse">
      <div className="mb-4 h-7 w-32 rounded bg-gray-100 dark:bg-gray-800" />
      <div className="grid grid-cols-7 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="border-b border-r border-gray-200 py-2 text-center text-xs text-gray-300 dark:border-gray-700 dark:text-gray-600"
          >
            {d}
          </div>
        ))}
        {Array.from({ length: 42 }, (_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: 고정 42칸 스켈레톤 그리드 — 순서가 바뀌지 않는다.
          <div key={i} className="min-h-20 border-b border-r border-gray-200 sm:min-h-24 dark:border-gray-700" />
        ))}
      </div>
    </div>
  )
}

export default function CalendarView({ events }: { events: CalendarEvent[] }) {
  // today/현재 월·일은 클라이언트 마운트 후에만 계산 → 정적 프리렌더와 hydration 불일치 방지
  const [mode, setMode] = useState<'month' | 'day'>('month')
  const [view, setView] = useState<View | null>(null)
  const [dayKey, setDayKey] = useState('')
  const [todayKey, setTodayKey] = useState('')
  const [selected, setSelected] = useState<CalendarEvent | null>(null)

  useEffect(() => {
    const d = new Date()
    const todayK = toKey(d)
    setTodayKey(todayK)
    setDayKey(todayK)
    // 첫 화면은 오늘이 아니라 "가장 가까운 일정"의 달로 — 예정 일정 우선, 없으면 가장 최근 일정
    const upcoming = events
      .filter((e) => (e.endDate ?? e.date) >= todayK)
      .sort((a, b) => a.date.localeCompare(b.date))[0]
    const recent = [...events].sort((a, b) => b.date.localeCompare(a.date))[0]
    const focus = upcoming ?? recent
    if (focus) {
      const [fy, fm] = focus.date.split('-').map(Number)
      setView({ year: fy, month: fm - 1 })
    } else {
      setView({ year: d.getFullYear(), month: d.getMonth() })
    }
  }, [events])

  const usedCategories = [...new Set(events.map((e) => e.category).filter(Boolean) as string[])]
  const agenda = [...events].sort((a, b) => b.date.localeCompare(a.date))

  const goPrev = () =>
    mode === 'month'
      ? setView((v) =>
          v ? (v.month === 0 ? { year: v.year - 1, month: 11 } : { year: v.year, month: v.month - 1 }) : v,
        )
      : setDayKey((k) => shiftDay(k, -1))
  const goNext = () =>
    mode === 'month'
      ? setView((v) =>
          v ? (v.month === 11 ? { year: v.year + 1, month: 0 } : { year: v.year, month: v.month + 1 }) : v,
        )
      : setDayKey((k) => shiftDay(k, 1))
  const goToday = () => {
    const d = new Date()
    setView({ year: d.getFullYear(), month: d.getMonth() })
    setDayKey(toKey(d))
  }
  const openDay = (key: string) => {
    setDayKey(key)
    setMode('day')
  }

  const toggleBtn = (active: boolean) =>
    `cursor-pointer rounded px-2.5 py-1 text-xs font-medium transition ${
      active ? 'bg-primary-500 text-white' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
    }`
  const navBtn =
    'cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'

  return (
    <div>
      {view ? (
        <>
          {/* 툴바: 제목 + 월/일 토글 + 이동 */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-bold text-gray-900 sm:text-xl dark:text-gray-100">
              {mode === 'month' ? `${view.year}년 ${view.month + 1}월` : dayTitle(dayKey)}
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex rounded-md border border-gray-200 p-0.5 dark:border-gray-700">
                <button type="button" onClick={() => setMode('month')} className={toggleBtn(mode === 'month')}>
                  월
                </button>
                <button type="button" onClick={() => setMode('day')} className={toggleBtn(mode === 'day')}>
                  일
                </button>
              </div>
              <div className="flex items-center gap-1">
                <button type="button" onClick={goPrev} aria-label="이전" className={navBtn}>
                  &larr;
                </button>
                <button type="button" onClick={goToday} className={navBtn}>
                  오늘
                </button>
                <button type="button" onClick={goNext} aria-label="다음" className={navBtn}>
                  &rarr;
                </button>
              </div>
            </div>
          </div>

          {mode === 'month' ? (
            <>
              <MonthGrid view={view} todayKey={todayKey} events={events} onSelectDay={openDay} onSelect={setSelected} />
              {(() => {
                const prefix = `${view.year}-${String(view.month + 1).padStart(2, '0')}`
                const monthStart = `${prefix}-01`
                const monthEnd = `${prefix}-31`
                const hasEvents = events.some((e) => (e.endDate ?? e.date) >= monthStart && e.date <= monthEnd)
                return hasEvents ? null : (
                  <p className="mt-3 text-center text-sm text-gray-400 dark:text-gray-500">
                    이 달에는 일정이 없습니다. 아래 전체 일정을 확인해 보세요.
                  </p>
                )
              })()}
            </>
          ) : (
            <DayView dayKey={dayKey} todayKey={todayKey} events={events} onSelect={setSelected} />
          )}
        </>
      ) : (
        <CalendarSkeleton />
      )}

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

      {/* 전체 일정 (아젠다 리스트) — 날짜 비의존이라 서버에서 그대로 렌더 */}
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
                        {formatWhen(e)}
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
              className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl transition duration-200 data-[closed]:scale-95 data-[closed]:opacity-0 dark:bg-gray-900"
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
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{formatWhen(selected)}</p>
              {selected.description && (
                <p className="mt-4 text-sm leading-6 text-gray-700 dark:text-gray-300">{selected.description}</p>
              )}
              {selected.location &&
                (selected.mapEmbed ? (
                  <div className="mt-4">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selected.location)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mb-2 inline-flex items-start gap-1.5 text-sm text-gray-600 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400"
                    >
                      <span aria-hidden>📍</span>
                      <span>{selected.location}</span>
                    </a>
                    <MapEmbed query={selected.location} title={`${selected.title} 위치`} />
                  </div>
                ) : (
                  <p className="mt-4 inline-flex items-start gap-1.5 text-sm text-gray-600 dark:text-gray-300">
                    <span aria-hidden>📍</span>
                    <span>{selected.location}</span>
                  </p>
                ))}
              {selected.url && (
                <div className="mt-6">
                  <a
                    href={selected.url}
                    {...(isExternalHref(selected.url) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="inline-flex items-center text-sm font-medium text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    자세히 보기 &rarr;
                  </a>
                </div>
              )}
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </div>
  )
}
