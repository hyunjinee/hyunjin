interface Talk {
  title: string
  description?: string
  date: string // ISO 8601 format (YYYY-MM-DD)
  event?: string
  href?: string
  slides?: string
  video?: string
  type?: 'talk' | 'workshop' | 'lecture' | 'podcast'
  pdfUrl?: string
}

export const talks: Talk[] = [
  {
    title: 'LUMOS',
    description: '전세대출 운영플랫폼을 개발하며 프로젝트의 개선점과 나아가야 할 방향 제시',
    date: '2023-10-15',
    event: 'Tossbank FullStack Engineer Weekly',
    pdfUrl: '/talks/LUMOS.pdf',
    type: 'talk',
    href: '/talks/lumos',
  },
  {
    title: 'FE 행성에 오신 것을 환영합니다',
    description: '입사 1개월차 발표',
    date: '2023-03',
    event: 'SI Analytics',
    href: '/talks/welcome-to-the-fe-planet',
    pdfUrl: '/talks/FE 행성에 오신 것을 환영합니다.pdf',
    type: 'talk',
  },
  {
    title: 'LLM 키우기',
    description: 'LLM 활용 방안 제안',
    date: '2025-02-20',
    event: 'Kakao Entertainment FE Chapter 라이트닝 톡',
    href: '/talks/llm-growing',
    type: 'talk',
  },
  {
    title: 'MOZI',
    description: '소프트웨어 마에스트로 프로젝트 발표',
    date: '2022-11-23',
    href: '/talks/MOZI',
    type: 'talk',
  },
  {
    title: 'Asynchronous JavaScript',
    description: '비동기 JavaScript에 대한 이해',
    date: '2022-10',
    event: '엘리스',
    href: '/talks/asynchronous-javascript',
    type: 'lecture',
  },
  {
    title: 'GraphQL',
    description: 'GraphQL을 공부하며 배운 것을 공유합니다',
    date: '2022-08-31',
    event: '소프트웨어 마에스트로 컨퍼런스',
    href: '/talks/graphql',
    type: 'talk',
  },
  // {
  //   title: '예시 발표 제목',
  //   description: '발표에 대한 간단한 설명을 여기에 작성합니다.',
  //   date: '2024-01-15',
  //   event: '컨퍼런스 이름',
  //   href: 'https://example.com',
  //   slides: 'https://slides.example.com',
  //   video: 'https://youtube.com/watch?v=example',
  //   type: 'talk',
  // },
]
