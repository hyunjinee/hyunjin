import { talks } from './talksData'

export type CalendarEvent = {
  /** 일정 제목 */
  title: string
  /** 시작일 'YYYY-MM-DD' (또는 'YYYY-MM' — 자동으로 해당 월 1일로 보정됨) */
  date: string
  /** 종료일 (다일 일정일 때만, 시작일 포함 ~ 종료일 포함) */
  endDate?: string
  /** 시작 시각 'HH:mm' (있으면 시간 일정 → 일 뷰에서 시간 블록, 없으면 종일) */
  start?: string
  /** 종료 시각 'HH:mm' */
  end?: string
  /** 색상 구분용 카테고리. 'talk' | 'lecture' | 'workshop' | 'podcast' | 'event' 등 */
  category?: string
  /** 모달에 표시할 설명 */
  description?: string
  /** 장소 텍스트 — 모달에 📍로 표시 */
  location?: string
  /** true일 때만 location으로 Google 지도 임베드 (실제 주소가 있는 venue) */
  mapEmbed?: boolean
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
    title: 'Agentforce World Tour Korea 2026',
    date: '2026-06-10',
    start: '09:00',
    end: '17:00',
    category: 'event',
    description: 'Salesforce 국내 최대 컨퍼런스 (기조연설·강연·데모·핸즈온랩)',
    location: 'COEX Convention & Exhibition Center, 영동대로 513, 강남구, 서울',
    mapEmbed: true,
    url: 'https://www.salesforce.com/kr/events/world-tour/korea',
  },
  {
    title: 'Maker Collective: Seoul IRL (Figma)',
    date: '2026-07-14',
    start: '16:00',
    end: '21:00',
    category: 'event',
    description:
      'Figma의 AI·디자인 통합 비전 공유 행사. Yuhki Yamashita(CPO) 키노트, Config 2026 Recap, 네트워킹. 등록코드 IB5KWZ',
    location: 'Conrad Seoul, 국제금융로 10, 영등포구, 서울',
    mapEmbed: true,
  },
  {
    title: 'Snowflake X Bright Data | 판교 Brunch & Crunch',
    date: '2026-06-24',
    start: '10:00',
    end: '13:30',
    category: 'event',
    location: '그래비티 조선 서울 판교 오토그래프 컬렉션',
    mapEmbed: true,
    url: 'https://www.snowflake.com/events/pangyo-brunch-crunch/',
  },
]

// 발표 → 캘린더 일정 (실제 발표가 있었던 날)
const talkEvents: CalendarEvent[] = talks.map((t) => ({
  title: t.title,
  date: t.date,
  category: t.type ?? 'talk',
  description: t.description,
  location: t.event, // 주최/행사명 — 📍 텍스트로만 표시(지도 임베드는 안 함)
  url: t.href ?? t.video ?? t.slides ?? t.pdfUrl,
}))

// 리포트(Claude Code Insights)는 "집계 기간"이지 일정이 아니므로 캘린더에서 제외함.
// 구글 업무 캘린더도 사내 회의·미공개 일정·동료 개인정보가 섞여 있어 제외.
export const events: CalendarEvent[] = [...manualEvents, ...talkEvents].map(normalizeEvent)
