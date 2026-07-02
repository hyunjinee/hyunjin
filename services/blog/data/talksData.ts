type Talk = {
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
    title: 'Berriz AI 아티스트 마인드맵 & 연예고사',
    description: 'AI가 아티스트의 정적·동적 정보를 지식그래프(마인드맵)로 엮고, 연예고사 게임으로 팬 온보딩을 돕는 서비스 — ENTERTHON 2025 (team 천만원, 최종 7팀)',
    date: '2025-12-05',
    event: 'Kakao Entertainment · ENTERTHON 2025',
    href: '/talks/enterthon-2025',
    type: 'talk',
  },
  {
    title: '서버 사이드 렌더링으로 유저 경험 개선하기',
    description: 'CSR의 한계와 SSR이 초기 로딩·유저 경험·SEO에 주는 이점',
    date: '2023-06-24',
    href: '/talks/ssr-user-experience',
    video: 'https://www.youtube.com/watch?v=wxxNS6hEptE',
    type: 'talk',
  },
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
    event: 'Kakao Entertainment FE Chapter Lightning Talk',
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
    title: 'Git을 활용한 협업',
    description: 'VCS 개념부터 브랜치·머지·Pull Request·커밋 컨벤션까지 5회차 Git 협업 실습',
    date: '2022-07',
    href: '/talks/git-collaboration',
    type: 'lecture',
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
