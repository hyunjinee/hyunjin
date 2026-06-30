interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'Berriz 글로벌 팬 플랫폼',
    description: `카카오엔터테인먼트의 글로벌 팬 플랫폼. 계정·커뮤니티·샵·딥링크·라이브 플레이어 SDK·실시간 투표까지
    여러 도메인에 참여하며 100만+ 유저로 성장.`,
    imgSrc: '/images/berriz/og-wordmark.png',
    href: '/kakaoent',
  },
  {
    title: 'agent-browser',
    description: 'Vercel Labs 오픈소스 브라우저 자동화 도구에 28개 PR 기여 (Rust / TypeScript).',
    imgSrc: '/images/agent-browser-og.png',
    href: '/blog/agent-browser',
  },
  {
    title: 'LUMOS 전월세 대출 운영 시스템',
    description: `토스뱅크 Housing Loan Squad. 전월세 대출 심사·운영 서비스(LUMOS)를 주도 개발해
    CS 건수와 심사 시간을 대폭 단축.`,
    imgSrc: '/images/tossbank/lumos-contract-review.png',
    href: '/tossbank',
  },
  {
    title: '방슐랭 가이드',
    description: '1인 가구 중심 부동산 플랫폼 1500+ 유저, 98건 직거래 달성',
    imgSrc: '/images/bclguide/guide-better-life.png',
    href: '/bclguide',
  },
]

export default projectsData
