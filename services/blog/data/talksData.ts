interface Talk {
  title: string
  description?: string
  date: string // ISO 8601 format (YYYY-MM-DD)
  event?: string
  href?: string
  slides?: string
  video?: string
  type?: 'talk' | 'workshop' | 'lecture' | 'podcast'
}

const talksData: Talk[] = [
  // 예시 데이터 - 실제 발표 내용으로 교체하세요
  {
    title: '예시 발표 제목',
    description: '발표에 대한 간단한 설명을 여기에 작성합니다.',
    date: '2024-01-15',
    event: '컨퍼런스 이름',
    href: 'https://example.com',
    slides: 'https://slides.example.com',
    video: 'https://youtube.com/watch?v=example',
    type: 'talk',
  },
  // 여기에 더 많은 발표를 추가하세요
]

export default talksData
