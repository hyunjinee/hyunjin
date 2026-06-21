import { genPageMetadata } from 'app/seo'
import Image from 'next/image'
import Link from 'next/link'
import CustomLink from '@/components/Link'
import LumosGallery from './LumosGallery'

export const metadata = genPageMetadata({ title: 'Toss Bank' })

const metrics = [
  { value: '26명', label: '심사 인원', sub: '타은행 대비 최소 인원으로 운영' },
  { value: '약 50억', label: '연간 인건비 절감 효과', sub: '효율적 심사 시스템 LUMOS' },
  { value: '50%↓', label: '권리조사 처리 시간', sub: '60분 → 30분' },
  { value: '9→4분', label: '배포 시간 단축', sub: 'yarn berry · Docker 캐싱' },
]

const bullets = [
  '갈아타기·새로받기·주기별점검·목적물 시세확인·세움터 주소 검색·지킴보증 보증료우대·허위임대인관리 등 전세대출 심사·운영에 필요한 전 영역의 기능을 주도적으로 개발했습니다.',
  'LUMOS 자체 알림 서비스를 구축해 비동기 전세대출 서류 검토 프로세스 시간을 단축 — 담당자의 권리조사 처리 시간을 60분에서 30분으로 50% 줄였고, 설문조사에서 담당자 전원이 만족했습니다.',
  '응답이 느리거나 즉각적인 피드백이 필요한 지점에 Optimistic Update를 적용해 UX를 개선하고, 블로그 글로 정리해 팀에 공유했습니다.',
  'API 응답·사용자 입력 등 외부에서 들어온 값을 런타임에 검증하기 위해 Zod를 적극 활용해 타입 안전성을 확보했습니다.',
  '페이지의 network waterfall을 발견해 쿼리를 병렬로 실행하도록 개선, LCP를 단축했습니다.',
  'yarn berry 마이그레이션과 Dockerfile 캐싱 레이어 분리로 총 배포 시간을 9분에서 4분으로 단축하고, Phantom Dependency를 제거해 패키지 설치 시간을 줄였습니다.',
  '전세대출 운영에서 발생하는 CS를 하루 평균 6~12건에서 0~3건으로 줄여 안정적인 운영에 기여했습니다.',
  '위클리에서 프로젝트의 개선점과 나아가야 할 방향을 키노트로 정리해 공유했습니다.',
]

const techStack: { group: string; items: string[] }[] = [
  { group: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Toss Design System', 'Zod', 'React Query', 'React Hook Form'] },
  { group: 'Backend', items: ['Kotlin', 'Spring', 'MySQL', 'MongoDB', 'Kafka'] },
]

const videos: { id: string; title: string; caption: string }[] = [
  {
    id: 'VFsVzcKrxJo',
    title: '믿을 수 있는 전세대출의 시작ㅣ토스뱅크 전월세보증금대출',
    caption: '믿을 수 있는 전세대출의 시작 · 토스뱅크 전월세보증금대출',
  },
  {
    id: 'rWN8-hHQQU4',
    title: '토스뱅크다운 문제 해결 방식 | 2024 토스뱅크 은행/금융권 공개 채용',
    caption: '토스뱅크다운 문제 해결 방식 · 2024 토스뱅크 공개 채용',
  },
]

export default function TossbankPage() {
  return (
    <div className="container md:mt-5">
      {/* Hero */}
      <header className="pb-8 mb-10 border-b border-gray-200 dark:border-gray-700">
        <h1 className="sr-only">Toss Bank</h1>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Image
            src="/images/tossbank/Toss_Symbol_Primary.png"
            alt="Toss Bank"
            width={26}
            height={26}
            className="h-[26px] w-auto"
          />
          <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">토스뱅크</span>
          <span className="text-sm text-gray-400 dark:text-gray-600">·</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">Software Engineer · 2023.09 ~ 2024.04</span>
        </div>
        <p className="text-sm leading-7 text-gray-700 break-keep md:text-base dark:text-gray-300">
          토스뱅크는 인터넷 전문 은행입니다. <strong>Housing Loan Squad</strong>(전세대출)에서 FullStack Developer로
          전세대출 심사·운영 시스템 <strong>LUMOS</strong>(Loan Universal Management Operating System)를 개발했습니다.
          전월세 대출의 특성상 심사·운영에 많은 리소스가 필요한데, 이를 최소화하는 효율적인 심사 시스템을 LUMOS에
          녹여내 타은행 대비 압도적으로 적은 인원(26명)으로 대출 심사를 진행하고 연간 인건비 약 50억 절감 효과를
          얻었습니다.
        </p>
        <div className="flex flex-wrap items-center gap-3 mt-5 text-sm md:gap-4">
          <Link
            href="https://www.tossbank.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
          >
            tossbank.com ↗
          </Link>
          <span className="text-gray-400 dark:text-gray-600">·</span>
          <CustomLink
            href="/blog/낙관적 업데이트 순서제어"
            className="transition-colors text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
          >
            Optimistic Update 글 보기
          </CustomLink>
        </div>
      </header>

      {/* Metrics */}
      <section className="mb-12">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="p-4 border border-gray-200 rounded-lg dark:border-gray-700 dark:bg-gray-800/30"
            >
              <div className="text-2xl font-bold text-primary-500 md:text-3xl">{m.value}</div>
              <div className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-200">{m.label}</div>
              <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-500">{m.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* LUMOS */}
      <section className="mb-12">
        <h2 className="pb-2 mb-8 text-2xl font-bold text-gray-900 border-b-2 border-gray-200 md:text-3xl dark:text-gray-100 dark:border-gray-700">
          LUMOS — 전세대출 심사·운영 시스템
        </h2>
        <ul className="space-y-3">
          {bullets.map((b) => (
            <li
              key={b}
              className="text-sm md:text-base text-gray-700 dark:text-gray-300 break-keep pl-5 relative before:content-['–'] before:absolute before:left-0 before:text-primary-500"
            >
              {b}
            </li>
          ))}
        </ul>
      </section>

      {/* LUMOS screens */}
      <section className="mb-12">
        <h2 className="pb-2 mb-8 text-2xl font-bold text-gray-900 border-b-2 border-gray-200 md:text-3xl dark:text-gray-100 dark:border-gray-700">
          LUMOS 화면
        </h2>
        <LumosGallery />
      </section>

      {/* LUMOS 발표 자료 */}
      <section className="mb-12">
        <h2 className="pb-2 mb-8 text-2xl font-bold text-gray-900 border-b-2 border-gray-200 md:text-3xl dark:text-gray-100 dark:border-gray-700">
          발표 자료
        </h2>
        <p className="mb-4 text-sm text-gray-600 break-keep md:text-base dark:text-gray-400">
          Tossbank FullStack Engineer Weekly · 2023.10 — 프로젝트의 개선점과 나아가야 할 방향을 정리해 발표했습니다.
        </p>
        <div className="overflow-hidden border border-gray-200 rounded-lg dark:border-gray-700">
          <iframe
            src="/talks/LUMOS.pdf"
            title="LUMOS 발표 자료"
            loading="lazy"
            className="w-full h-[420px] sm:h-[600px] bg-gray-50 dark:bg-gray-900"
          />
        </div>
        <div className="flex flex-wrap gap-4 mt-3 text-sm">
          <CustomLink
            href="/talks/lumos"
            className="transition-colors text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
          >
            전체 화면으로 보기 →
          </CustomLink>
          <a
            href="/talks/LUMOS.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
          >
            PDF 새 탭에서 열기 ↗
          </a>
        </div>
      </section>

      {/* Tech stack */}
      <section className="mb-12">
        <h2 className="pb-2 mb-8 text-2xl font-bold text-gray-900 border-b-2 border-gray-200 md:text-3xl dark:text-gray-100 dark:border-gray-700">
          기술 스택
        </h2>
        <div className="space-y-4">
          {techStack.map((t) => (
            <div key={t.group} className="flex flex-wrap items-center gap-2">
              <span className="w-20 text-sm font-medium text-gray-500 dark:text-gray-500">{t.group}</span>
              {t.items.map((item) => (
                <span
                  key={item}
                  className="px-3 py-1 text-sm text-gray-700 border border-gray-200 rounded-full dark:text-gray-300 dark:border-gray-700"
                >
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* 관련 글 · 영상 */}
      <section className="mb-12">
        <h2 className="pb-2 mb-8 text-2xl font-bold text-gray-900 border-b-2 border-gray-200 md:text-3xl dark:text-gray-100 dark:border-gray-700">
          관련 글 · 영상
        </h2>
        <ul className="mb-6 space-y-3">
          <li>
            <a
              href="https://toss.tech/article/severdeveloper_dynamic_scraping"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-wrap gap-x-3 gap-y-0.5 items-baseline group"
            >
              <span className="font-medium text-gray-900 transition-colors dark:text-gray-100 group-hover:text-primary-500 break-keep">
                다이내믹 스크래핑과 전월세대출 이동제의 실행
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">toss.tech ↗</span>
            </a>
          </li>
        </ul>
        <div className="grid gap-6 sm:grid-cols-2">
          {videos.map((v) => (
            <figure key={v.id}>
              <div className="overflow-hidden border border-gray-200 rounded-lg aspect-video dark:border-gray-700">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${v.id}`}
                  title={v.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <figcaption className="mt-2 text-sm text-gray-500 break-keep dark:text-gray-500">{v.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  )
}
