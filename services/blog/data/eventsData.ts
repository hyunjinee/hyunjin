import { talks } from './talksData'

export type CalendarEvent = {
  /** 일정 제목 */
  title: string
  /** 시작일 'YYYY-MM-DD' (또는 'YYYY-MM' — 자동으로 해당 월 1일로 보정됨) */
  date: string
  /** 종료일 (다일 일정일 때만, 시작일 포함 ~ 종료일 포함) */
  endDate?: string
  /** 색상 구분용 카테고리. 'talk' | 'lecture' | 'workshop' | 'podcast' | 'event' 등 */
  category?: string
  /** 모달에 표시할 설명 */
  description?: string
  /** 클릭 시 이동할 경로(블로그 글/외부 링크) */
  url?: string
}

/** 'YYYY-MM' 형태(일 미상) → 해당 월 1일로 보정 */
const normalizeDate = (d: string): string => (d.length === 7 ? `${d}-01` : d)

/** date/endDate를 일괄 정규화 — 모든 소스(수동·발표)와 endDate 경로에 동일 적용 */
const normalizeEvent = (e: CalendarEvent): CalendarEvent => ({
  ...e,
  date: normalizeDate(e.date),
  ...(e.endDate ? { endDate: normalizeDate(e.endDate) } : {}),
})

// 직접 관리하는 일정 — 여기에 추가/수정하세요.
const manualEvents: CalendarEvent[] = [
  {
    title: 'Snowflake X Bright Data | 판교 Brunch & Crunch',
    date: '2026-06-24',
    category: 'event',
    description: '그래비티 조선 서울 판교 오토그래프 컬렉션 · 10:00–13:30',
    url: 'https://www.snowflake.com/events/pangyo-brunch-crunch/',
  },
]

// 발표 → 캘린더 일정 (실제 발표가 있었던 날)
const talkEvents: CalendarEvent[] = talks.map((t) => ({
  title: t.title,
  date: t.date,
  category: t.type ?? 'talk',
  description: [t.event, t.description].filter(Boolean).join(' · ') || undefined,
  url: t.href ?? t.video ?? t.slides ?? t.pdfUrl,
}))

// 리포트(Claude Code Insights)는 "집계 기간"이지 일정이 아니므로 캘린더에서 제외함.
// 구글 업무 캘린더도 사내 회의·미공개 일정·동료 개인정보가 섞여 있어 제외.
export const events: CalendarEvent[] = [...manualEvents, ...talkEvents].map(normalizeEvent)
