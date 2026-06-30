import { genPageMetadata } from 'app/seo'
import Image from 'next/image'
import Link from 'next/link'
import CustomLink from '@/components/Link'

export const metadata = genPageMetadata({ title: 'Kakao Entertainment' })


type Project = {
  title: string
  role?: string
  period: string
  scale: string
  bullets: string[]
  href?: { label: string; url: string }
  image?: { src: string; alt: string; width: number; height: number }
}

const projects: Project[] = [
  {
    title: 'Berriz',
    role: 'Frontend Engineer',
    period: '2024.08 ~ 현재',
    scale: '3,566 커밋 · 680 PR',
    bullets: [
      '계정·멜론 연동·본인인증, 팬클럽·팬카드, 커머스(샵), 딥링크, 웹뷰 브릿지, 오디션 투표, 다국어 등 여러 도메인을 구현',
      '네이티브 앱-웹 상태 동기화 웹뷰 브릿지 아키텍처(setAppValues·스킴 네비·PTR 제어·디버그 패널) 설계',
      '사내 AI 개발 자동화(Jira 폴링 → 코딩 에이전트 자동 spawn 오케스트레이터 + 평가 하네스) 구축',
    ],
    href: { label: '주제별 상세 보기', url: '/berriz' },
  },
  {
    title: 'Live Player — AWS IVS SDK',
    period: '2024.07 ~ 09',
    scale: '121 커밋 · 10 PR',
    bullets: [
      'PlayerBase 추상 클래스 위에 IVS 재생 엔진을 구현 — IVS/DRM 백엔드 교체 가능한 다형적 SDK 아키텍처 확립',
      'EventEmitter → zustand → React 단방향 상태 동기화, error taxonomy 정의',
      'player-sdk / player-ui 2패키지 pnpm 모노레포 분리, Chromecast(CAF)·AirPlay 캐스팅 연동',
    ],
  },
  {
    title: '파트너센터 — 예약 · TVOD · 행사',
    period: '2026.02 ~ 05',
    scale: '239 커밋 · 27 PR',
    bullets: [
      '예약(부킹) 도메인을 0부터 구축 — 4단계 멀티스텝 등록 퍼널 + 전용 CRUD API 레이어 설계',
      'container/presentational 분리, TanStack Form + Zod 복합 검증, 폼 ↔ API 양방향 변환 유틸 도입',
      'zero-prop bypass render props를 26개+ 컨테이너에서 제거하는 대규모 prop drilling 리팩토링',
    ],
  },
  {
    title: "오디션 — Debut's Plan",
    role: '글로벌 실시간 투표',
    period: '2025.01 ~ 04',
    scale: '164 커밋 · 28 PR',
    bullets: [
      '글로벌 타임존 마감 시각 오산 크리티컬 버그를 dayjs KST 고정 로직으로 재설계, 18개 타임존 Vitest 테스트로 회귀 봉인',
      'SSR/미들웨어 인증을 정적 익스포트 + 클라이언트 리다이렉트 + 404 폴백 구조로 재구성',
      '투표 결과 처리·Countdown·SVG 렌더링 최적화로 처리량(TPS) 개선',
    ],
  },
  {
    title: 'berriz-wiki — LLM 지식베이스',
    role: '단독 설계 · 구축',
    period: '2026.04 ~ 05',
    scale: '71 커밋',
    bullets: [
      'raw(원본) / pages(LLM 컴파일) / views(대시보드) 3계층 사람·AI 공용 지식베이스를 단독 설계·구축',
      'Confluence 첨부 이미지 자동 인입 파이프라인(Python)으로 자료 정리 비용 제거',
      'Quartz 정적 사이트 + GitHub Actions → S3·CloudFront 자동 배포',
    ],
  },
  {
    title: 'FE DevOps — Terraform IaC',
    role: '인프라 도입 주도',
    period: '2024.12 ~ 25.04',
    scale: '27 커밋',
    bullets: [
      'Terraform 도입의 필요성을 직접 제안·주도 — CloudFront·Lambda·S3 인프라를 IaC로 전환해 재현 가능한 프로비저닝 체계 확립',
      'FE develop 환경 Helm 배포(Deployment/Service/Ingress)와 멀티환경 values 작성',
      'GKE BackendConfig로 Cloud Armor WAF·헬스체크 구성, host + path 라우팅 연계',
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
  { title: 'DeepLink', desc: '딥링크 시스템(link.berriz.in) 설계', date: '2025-06-09', url: '/blog/DeepLink' },
  {
    title: 'SSR은 선택이 아니다',
    desc: 'AI 크롤러 시대의 렌더링 전략',
    date: '2026-04-20',
    url: '/blog/SSR은 선택이 아니다',
  },
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
          글로벌 팬 플랫폼 <strong>Berriz</strong>의 프론트엔드 개발자로, 라이브
          플레이어 SDK·파트너센터·오디션 실시간 투표 등 여러 도메인을 직접 만들었습니다. 여기에 LLM 지식베이스와 AI
          개발 자동화, Terraform 기반 인프라(IaC)까지 제품과 개발 생산성 양쪽을 함께 끌어올렸습니다.
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
          {projects.map((p, i) => (
            <div key={p.title} className="group">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-mono text-sm text-gray-400 dark:text-gray-600">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="text-lg font-semibold text-gray-900 md:text-xl dark:text-gray-100">{p.title}</h3>
                {p.role && <span className="text-sm text-gray-500 dark:text-gray-400">{p.role}</span>}
                <span className="ml-auto font-mono text-xs text-gray-400 dark:text-gray-600">
                  {p.period} · {p.scale}
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
    </div>
  )
}
