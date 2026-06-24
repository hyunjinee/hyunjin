import { reports } from './reportsData'
import { talks } from './talksData'

export type CalendarEvent = {
  /** 일정 제목 */
  title: string
  /** 시작일 'YYYY-MM-DD' */
  date: string
  /** 종료일 'YYYY-MM-DD' (다일 일정일 때만, 시작일 포함 ~ 종료일 포함) */
  endDate?: string
  /** 색상 구분용 카테고리. 'talk' | 'lecture' | 'workshop' | 'podcast' | 'report' 등 */
  category?: string
  /** 모달에 표시할 설명 */
  description?: string
  /** 클릭 시 이동할 경로(블로그 글/외부 링크) */
  url?: string
}

/** 'YYYY-MM' 형태(일 미상) → 해당 월 1일로 보정 */
const normalizeDate = (d: string): string => (d.length === 7 ? `${d}-01` : d)

// 발표 → 캘린더 이벤트 (카테고리는 발표 유형으로 색상 구분)
const talkEvents: CalendarEvent[] = talks.map((t) => ({
  title: t.title,
  date: normalizeDate(t.date),
  category: t.type ?? 'talk',
  description: [t.event, t.description].filter(Boolean).join(' · ') || undefined,
  url: t.href,
}))

// 리포트 → 다일 일정 (집계 기간)
const reportEvents: CalendarEvent[] = reports.map((r) => ({
  title: r.title,
  date: r.period.from,
  endDate: r.period.to,
  category: 'report',
  description: `${r.sessions} sessions · ${r.messages.toLocaleString()} messages`,
  url: `/reports/${r.slug}`,
}))

// 공개된 실제 데이터만 사용 (발표 + 리포트).
// 구글 업무 캘린더는 사내 회의·미공개 일정·동료 개인정보가 섞여 있어 의도적으로 제외함.
export const events: CalendarEvent[] = [...talkEvents, ...reportEvents]
