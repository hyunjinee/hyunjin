import { genPageMetadata } from 'app/seo'
import Image from 'next/image'
import Link from 'next/link'
import CustomLink from '@/components/Link'
import GithubContributions from './GithubContributions'

export const metadata = genPageMetadata({ title: 'Kakao Entertainment' })


type Project = {
  title: string
  role?: string
  period: string
  scale?: string
  bullets: string[]
  href?: { label: string; url: string }
  image?: { src: string; alt: string; width: number; height: number }
}

const projects: Project[] = [
  {
    title: 'Berriz',
    role: 'Frontend Engineer',
    period: '2024.08 ~ 현재',
    bullets: [
      '멜론 계정 양방향 연동과 본인인증, 팬클럽, 커머스(샵), 딥링크(link.berriz.in)까지 서비스 도메인 대부분을 구현했습니다.',
      '통화와 국가 설정을 동기화하는 웹뷰 브릿지(setAppValues)를 설계해, 앱에서 보든 웹에서 보든 유저가 같은 화면을 보게 했습니다. 플로팅 디버그 패널 덕분에 웹뷰 문제는 앱 빌드 없이 웹에서 바로 재현합니다.',
      'AWS IVS 기반 라이브 플레이어 SDK를 만들었습니다. PlayerBase 추상 클래스 위에 IvsPlayer를 구현해서 IVS나 DRM 같은 재생 백엔드를 갈아끼울 수 있습니다.',
      'Jira에 티켓이 등록되면 코딩 에이전트가 자동으로 작업을 시작해 PR까지 만듭니다. 이 오케스트레이터를 GitHub Actions 위에 stateless로 올렸고, 결과는 평가 하네스로 숫자로 추적합니다.',
    ],
    href: { label: '주제별 상세 보기', url: '/berriz' },
  },
  {
    title: '파트너센터 (예약 · TVOD · 행사)',
    period: '2026.02 ~ 05',
    bullets: [
      '예약(부킹) 도메인을 0부터 만들었습니다. 기본정보, 노출항목, 예약설정, 이용설정으로 이어지는 4단계 등록 퍼널과 전용 CRUD API 레이어가 뼈대입니다.',
      '폼은 TanStack Form과 Zod로 검증하고, UTC 자정 기준 날짜 보정을 넣어 타임존이 달라도 예약 기간이 하루씩 밀리지 않게 했습니다.',
      'render props로 prop을 우회 전달하던 컨테이너 26개 이상을 리팩토링해 prop drilling을 걷어냈습니다.',
    ],
  },
  {
    title: "오디션 Debut's Plan",
    role: '글로벌 실시간 투표',
    period: '2025.01 ~ 04',
    bullets: [
      '해외 유저의 기기 타임존 때문에 투표 마감이 다음날 00:00으로 잘못 계산되던 버그를 dayjs timezone으로 KST에 고정해 고쳤습니다. 뉴욕, 런던, 시드니 등 18개 타임존을 도는 Vitest 테스트도 함께 남겼습니다.',
      'SSR과 미들웨어에 걸쳐 있던 인증을 정적 익스포트 구조로 다시 짜서, 서버 없이 정적 호스팅만으로 운영할 수 있게 했습니다.',
    ],
  },
  {
    title: 'berriz-wiki (LLM 지식베이스)',
    period: '2026.04 ~ 05',
    bullets: [
      '사람과 AI가 같이 쓰는 지식베이스를 혼자 설계해서 만들었습니다. raw(원본), pages(LLM 컴파일), views(대시보드) 3계층으로 나눴습니다.',
      'Confluence 첨부 이미지를 손으로 정리하던 비용은 Python 파이프라인으로 없앴습니다. 본문 트리를 순회하며 파일명을 자동으로 만들어 가져옵니다.',
      'Quartz 정적 사이트로 빌드해 GitHub Actions에서 S3와 CloudFront로 자동 배포합니다.',
    ],
  },
  {
    title: 'FE DevOps (Terraform IaC)',
    role: '인프라 도입 주도',
    period: '2024.12 ~ 25.04',
    bullets: [
      '콘솔에서 손으로 만지던 CloudFront와 Lambda, S3 설정을 Terraform 코드로 옮기자고 직접 제안하고 전환을 주도했습니다. 이제 인프라 변경이 코드 리뷰로 남고, 같은 환경을 그대로 다시 만들 수 있습니다.',
      'Express 서비스를 새로 배포하면서 Cloud Armor WAF와 헬스체크를 구성하고, GCE Ingress에서 host와 정규식 path로 라우팅을 나눴습니다.',
    ],
  },
  {
    title: 'ENTERTHON 2025',
    role: '사내 해커톤',
    period: '2025',
    scale: '최종 7팀',
    bullets: ['카카오엔터테인먼트 사내 해커톤 ENTERTHON 2025에 참여해 전체 참가 팀 중 최종 7팀에 선정되었습니다.'],
    image: {
      src: '/images/kakaoentertainment/enterthon-2025.jpg',
      alt: 'ENTERTHON 2025 포스터',
      width: 4000,
      height: 1500,
    },
  },
]

type Writing = {
  title: string
  desc: string
  date: string
  url: string
}

const writings: Writing[] = [
  { title: 'DeepLink', desc: '딥링크 시스템(link.berriz.in) 설계', date: '2025-06-09', url: '/blog/deeplink' },
  {
    title: 'LLM 키우기',
    desc: '발표 · Kakao Entertainment FE Chapter Lightning Talk',
    date: '2025-02-20',
    url: '/talks/llm-growing',
  },
]

const techStack = [
  'TypeScript',
  'React',
  'Next.js (App Router)',
  'TanStack Query / Form',
  'next-intl',
  'Zod',
  'TailwindCSS',
  'Turborepo (pnpm)',
  'zustand',
  'AWS IVS Player',
  'AWS Lambda · CloudFront',
  'Terraform',
  'GKE · Helm · ArgoCD',
  'Cloud Armor (WAF)',
  'GitHub Actions',
  'Sentry',
  'Storybook',
  'Vitest · Cypress · agent-browser',
  'LangChain',
  'Python',
]

export default function KakaoentPage() {
  return (
    <div className="container md:mt-5">
      {/* Hero */}
      <header className="pb-8 mb-10 border-b border-gray-200 dark:border-gray-700">
        <h1 className="sr-only">Kakao Entertainment</h1>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Image
            src="/images/kakaoentertainment/kakaoent.svg"
            alt="Kakao Entertainment"
            width={150}
            height={30}
            className="h-[28px] w-auto dark:invert"
          />
          <span className="text-sm text-gray-400 dark:text-gray-600">·</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">Frontend Engineer · 2024.07 ~ 현재</span>
        </div>
        <p className="text-sm leading-7 text-gray-700 break-keep md:text-base dark:text-gray-300">
          카카오엔터테인먼트에서 글로벌 팬 플랫폼 <strong>Berriz</strong>의 프론트엔드를 개발합니다. 제로 베이스였던
          서비스 초기부터 참여해 계정 연동, 라이브 플레이어, 파트너센터, 오디션 투표까지 여러 도메인을 맡았고, 서비스는
          지금 100만이 넘는 유저가 쓰고 있습니다. 제품 바깥에서는 LLM 지식베이스와 코딩
          에이전트 오케스트레이터를 만들고, 콘솔에서 수작업하던 인프라를 Terraform 코드로 옮겼습니다.
        </p>
        <div className="flex flex-wrap items-center gap-3 mt-5 text-sm md:gap-4">
          <Link
            href="https://berriz.in/ko"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
          >
            berriz.in ↗
          </Link>
          <span className="text-gray-400 dark:text-gray-600">·</span>
          <CustomLink
            href="/berriz"
            className="transition-colors text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
          >
            Berriz 주제별 상세
          </CustomLink>
        </div>
      </header>

      {/* Project timeline */}
      <section className="mb-12">
        <h2 className="pb-2 mb-8 text-2xl font-bold text-gray-900 border-b-2 border-gray-200 md:text-3xl dark:text-gray-100 dark:border-gray-700">
          프로젝트
        </h2>
        <div className="space-y-8">
          {projects.map((p) => (
            <div key={p.title} className="group">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="text-lg font-semibold text-gray-900 md:text-xl dark:text-gray-100">{p.title}</h3>
                {p.role && <span className="text-sm text-gray-500 dark:text-gray-400">{p.role}</span>}
                <span className="ml-auto font-mono text-xs text-gray-400 dark:text-gray-600">
                  {[p.period, p.scale].filter(Boolean).join(' · ')}
                </span>
              </div>
              <ul className="mt-3 ml-8 space-y-2">
                {p.bullets.map((b) => (
                  <li
                    key={b}
                    className="text-sm md:text-base text-gray-700 dark:text-gray-300 break-keep pl-5 relative before:content-['–'] before:absolute before:left-0 before:text-primary-500"
                  >
                    {b}
                  </li>
                ))}
              </ul>
              {p.href && (
                <div className="mt-3 ml-8">
                  <CustomLink
                    href={p.href.url}
                    className="text-sm transition-colors text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    {p.href.label} →
                  </CustomLink>
                </div>
              )}
              {p.image && (
                <div className="mt-4 ml-8">
                  <Image
                    src={p.image.src}
                    alt={p.image.alt}
                    width={p.image.width}
                    height={p.image.height}
                    sizes="(max-width: 768px) 100vw, 700px"
                    className="w-full h-auto border border-gray-200 rounded-lg dark:border-gray-700"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Writings & talks */}
      <section className="mb-12">
        <h2 className="pb-2 mb-8 text-2xl font-bold text-gray-900 border-b-2 border-gray-200 md:text-3xl dark:text-gray-100 dark:border-gray-700">
          관련 글 · 발표
        </h2>
        <ul className="space-y-3">
          {writings.map((w) => (
            <li key={w.title}>
              <CustomLink href={w.url} className="group flex flex-wrap gap-x-3 gap-y-0.5 items-baseline">
                <span className="font-medium text-gray-900 transition-colors dark:text-gray-100 group-hover:text-primary-500">
                  {w.title}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{w.desc}</span>
                <span className="ml-auto font-mono text-xs text-gray-400 dark:text-gray-600">{w.date}</span>
              </CustomLink>
            </li>
          ))}
        </ul>
      </section>

      {/* Tech stack */}
      <section className="mb-12">
        <h2 className="pb-2 mb-8 text-2xl font-bold text-gray-900 border-b-2 border-gray-200 md:text-3xl dark:text-gray-100 dark:border-gray-700">
          기술 스택
        </h2>
        <div className="flex flex-wrap gap-2">
          {techStack.map((t) => (
            <span
              key={t}
              className="px-3 py-1 text-sm text-gray-700 border border-gray-200 rounded-full dark:text-gray-300 dark:border-gray-700"
            >
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* GitHub contributions */}
      <GithubContributions />
    </div>
  )
}
