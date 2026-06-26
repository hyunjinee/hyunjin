interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'Berriz — 글로벌 팬 플랫폼',
    description: `카카오엔터테인먼트의 글로벌 팬 플랫폼. 계정·커뮤니티·샵·딥링크·라이브 플레이어 SDK·실시간 투표까지
    제품 전반을 주도하며 100만+ 유저로 성장. 최다 기여자.`,
    imgSrc: '/images/kakaoentertainment/enterthon-2025.jpg',
    href: '/kakaoent',
  },
  {
    title: 'LUMOS — 전월세 대출 운영 시스템',
    description: `토스뱅크 Housing Loan Squad. 전월세 대출 심사·운영 서비스(LUMOS)를 주도 개발해
    CS 건수와 심사 시간을 대폭 단축.`,
    imgSrc: '/images/tossbank/lumos-architecture.png',
    href: '/tossbank',
  },
  {
    title: 'agent-browser',
    description: 'Vercel Labs 오픈소스 브라우저 자동화 도구에 28개 PR 기여 (Rust / TypeScript).',
    href: '/blog/agent-browser',
  },
  {
    title: '방슐랭 가이드',
    description: '1인 가구 중심 부동산 플랫폼. 창업 동아리로 시작해 1500+ 유저, 98건 직거래 달성.',
    href: '/bclguide',
  },
]

export default projectsData
