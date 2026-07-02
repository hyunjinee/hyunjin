import Image from 'next/image'
import Link from 'next/link'
import CustomLink from '@/components/Link'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Berriz' })

type Section = {
  title: string
  bullets: string[]
}

const sections: Section[] = [
  {
    title: '계정 · 인증',
    bullets: [
      '멜론(Melon) 계정 양방향 연동과 본인인증 시스템을 설계·구현 — 인바운드/아웃바운드 동의 플로우, 연동 사전 체크로 중복 연동 차단',
      '세션 만료 시 재로그인 유도, 캐시 무효화 등 식별 도메인의 세션 정합성을 일관되게 처리',
      '연동 정보 화면의 타임존(KST → 기기 TZ) 정정으로 글로벌 사용자에게 정확한 연동 시각을 노출',
    ],
  },
  {
    title: '하이브리드 앱 · 웹뷰 브릿지',
    bullets: [
      '통화/국가 등 사용자 컨텍스트를 동기화하는 setAppValues 인터페이스를 설계해 앱-웹 화면 일관성을 확보',
      'openScheme 기반 앱 내 네비게이션 분기와 Pull-to-Refresh 제어를 표준 브릿지 규약으로 추상화',
      '디버그 패널 구축, 안드로이드 웹뷰 닫힘 시 모달 상태 보존 등 하이브리드 특유의 상태 손실 문제를 해결',
    ],
  },
  {
    title: '라이브 스트리밍 플레이어 (AWS IVS)',
    bullets: [
      'PlayerBase 추상 클래스 위에 IVS 재생 엔진을 구현 — IVS/DRM 백엔드를 교체 가능한 다형적 SDK 아키텍처 확립',
    ],
  },
  {
    title: '딥링크 (link.berriz.in)',
    bullets: [
      'Universal Links / App Links / Custom Scheme 기반 딥링크와 OG 태그 다국어 지원으로 글로벌 공유 경험 구성',
      'AWS Lambda 기반 OG fetch + 실패 시 기본 태그로 폴백하는 견고한 메타데이터 파이프라인 구축',
      'CloudFront Functions·호스트/path 라우팅 연계, qa/cbt/sandbox 다중 환경으로 운영 안정성 확보',
    ],
  },
  {
    title: '오디션 · 실시간 투표 (Debut’s Plan)',
    bullets: [
      "해외 로컬 타임존 때문에 마감 시각이 '다음날 00:00'로 잘못 계산되던 글로벌 크리티컬 버그를 dayjs timezone 기반 KST 고정 로직으로 재설계",
      '뉴욕·런던·시드니 등 18개 글로벌 타임존을 커버하는 Vitest 단위 테스트로 시간 경계 회귀를 구조적으로 봉인',
      'SSR/미들웨어 인증 흐름을 정적 익스포트 + 클라이언트 리다이렉트 + 404 폴백 구조로 재구성',
      '투표 결과 처리·Countdown 타이머·SVG 렌더링 최적화로 처리량(TPS) 개선',
    ],
  },
  {
    title: '커머스 · 파트너센터',
    bullets: [
      '커머스(샵) 상품 상세·주문·장바구니, VOD 연관 상품의 브라우저 웹뷰 결제 플로우 구현',
      '파트너센터 예약(부킹)·TVOD 구매혜택·행사 도메인을 0부터 구축 — 4단계 멀티스텝 등록 퍼널 + 전용 CRUD API 레이어 설계',
      'container/presentational 분리 패턴과 TanStack Form + Zod 검증 일원화, 폼 ↔ API 양방향 변환 유틸 도입',
      'zero-prop bypass render props를 26개+ 컨테이너에서 제거하는 대규모 리팩토링으로 prop drilling 해소',
    ],
  },
  {
    title: 'AI 개발 자동화',
    bullets: [
      'Jira 폴링 기반으로 AI 코딩 에이전트 작업을 자동 spawn하는 오케스트레이터 데몬을 GitHub Actions 위에 stateless하게 설계',
      '작업 결과를 정량 추적하는 평가/벤치마크 하네스를 구축해 AI 활용 개발 생산성을 데이터로 관리',
      '기획·정책·의사결정 자료를 AI 에이전트가 바로 참조하는 LLM 지식베이스(raw / pages / views 3계층)를 단독 설계·구축',
      'Confluence 첨부 이미지 자동 인입 파이프라인(Python)으로 자료 정리 비용을 제거',
    ],
  },
  {
    title: '인프라 · DevOps / DX',
    bullets: [
      'Terraform 도입의 필요성을 직접 제안하고 주도 — CloudFront · Lambda · S3 기반 AWS 인프라를 IaC로 전환해 수작업 콘솔 설정을 코드화하고 재현 가능한 프로비저닝·관리 체계를 확립',
      'FE의 develop 환경 Helm 배포 구성(Deployment/Service/Ingress)과 멀티환경 values 작성',
      '단일 GCE Ingress에서 host + path 정규식 라우팅을 구성하고, Express 서비스를 Cloud Armor WAF·헬스체크와 함께 신규 배포',
      'agent-browser + Vitest 기반 E2E 인프라와 CI 워크플로우(병렬 실행, env 주입, graceful skip)를 구축',
    ],
  },
]

const techStack = [
  'TypeScript',
  'React',
  'Next.js (App Router)',
  'TanStack Query / Form',
  'next-intl',
  'Zod',
  'TailwindCSS · Emotion',
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

export default function BerrizPage() {
  return (
    <div className="container md:mt-5">
      {/* Hero */}
      <header className="pb-8 mb-10 border-b border-gray-200 dark:border-gray-700">
        <h1 className="sr-only">Berriz</h1>
        <div className="flex gap-3 items-center mb-4">
          <Image
            src="/images/kakaoentertainment/berriz_logo.svg"
            alt="Berriz"
            width={96}
            height={32}
            className="h-[30px] w-auto"
          />
          <span className="text-sm text-gray-400 dark:text-gray-600">·</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">Kakao Entertainment · Frontend Engineer</span>
        </div>
        <p className="text-sm leading-7 text-gray-700 break-keep md:text-base dark:text-gray-300">
          글로벌 팬 플랫폼 <strong>Berriz</strong>의 프론트엔드 개발자로, 계정·인증, 딥링크, 라이브
          스트리밍, 커머스, 오디션 실시간 투표까지 폭넓게 참여했습니다. 파트너센터
          예약·TVOD 도메인을 직접 만들고, 라이브 플레이어 SDK 코어를 설계했으며, AI 코딩 에이전트 오케스트레이터와
          평가 하네스로 팀의 개발 생산성까지 끌어올렸습니다.
        </p>
        <div className="flex flex-wrap gap-3 items-center mt-5 text-sm md:gap-4">
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
            href="/kakaoent"
            className="transition-colors text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
          >
            이력 요약
          </CustomLink>
          <span className="text-gray-400 dark:text-gray-600">·</span>
          <CustomLink
            href="/blog/deeplink"
            className="transition-colors text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
          >
            딥링크 기술 글
          </CustomLink>
        </div>
      </header>

      {/* Contribution sections */}
      <section className="mb-12">
        <h2 className="pb-2 mb-8 text-2xl font-bold text-gray-900 border-b-2 border-gray-200 md:text-3xl dark:text-gray-100 dark:border-gray-700">
          기여 영역
        </h2>
        <div className="space-y-8">
          {sections.map((s, i) => (
            <div key={s.title} className="group">
              <div className="flex gap-3 items-baseline">
                <span className="text-sm font-mono text-gray-400 dark:text-gray-600">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="flex-1 text-lg font-semibold text-gray-900 md:text-xl dark:text-gray-100">{s.title}</h3>
              </div>
              <ul className="mt-3 ml-8 space-y-2">
                {s.bullets.map((b) => (
                  <li
                    key={b}
                    className="text-sm md:text-base text-gray-700 dark:text-gray-300 pl-5 relative before:content-['–'] before:absolute before:left-0 before:text-primary-500"
                  >
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
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
              className="px-3 py-1 text-sm text-gray-700 rounded-full border border-gray-200 dark:text-gray-300 dark:border-gray-700"
            >
              {t}
            </span>
          ))}
        </div>
      </section>
    </div>
  )
}
