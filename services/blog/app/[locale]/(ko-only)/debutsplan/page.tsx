import CustomLink from '@/components/Link'
import { genPageMetadata } from 'app/seo'
import ExcalidrawViewer from './ExcalidrawViewer'

export const metadata = genPageMetadata({ title: "Debut's Plan" })

export default function DebutsPlanPage() {
  return (
    <div className="container md:mt-5">
      {/* Hero */}
      <header className="pb-8 mb-10 border-b border-gray-200 dark:border-gray-700">
        <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl dark:text-gray-100">Debut&apos;s Plan</h1>
        <div className="flex gap-3 items-center mb-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Kakao Entertainment · 오디션 실시간 투표 서비스
          </span>
        </div>
        <p className="text-sm leading-7 text-gray-700 break-keep md:text-base dark:text-gray-300">
          글로벌 오디션 <strong>Debut&apos;s Plan</strong>의 실시간 투표 서비스를 개발했습니다.
        </p>
        <div className="flex flex-wrap gap-3 items-center mt-5 text-sm md:gap-4">
          <CustomLink
            href="/kakaoent"
            className="transition-colors text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
          >
            이력 요약
          </CustomLink>
          <span className="text-gray-400 dark:text-gray-600">·</span>
          <CustomLink
            href="/berriz"
            className="transition-colors text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
          >
            Berriz 기여 상세
          </CustomLink>
        </div>
      </header>

      {/* Contribution sections */}
      <section className="mb-12">
        <h2 className="pb-2 mb-8 text-2xl font-bold text-gray-900 border-b-2 border-gray-200 md:text-3xl dark:text-gray-100 dark:border-gray-700">
          기여 영역
        </h2>
        <ul className="space-y-2">
          <li className="text-sm md:text-base text-gray-700 dark:text-gray-300 pl-5 relative before:content-['–'] before:absolute before:left-0 before:text-primary-500">
            Built and managed a globally synchronized voting system, ensuring accurate state management and real-time
            updates across time zones.
          </li>
        </ul>
        <figure className="mt-8">
          <div className="overflow-hidden border border-gray-200 rounded-lg aspect-video dark:border-gray-700">
            <iframe
              src="https://www.youtube-nocookie.com/embed/uk2l1RRztms"
              title="Debut's Plan"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </figure>
        <figure className="mt-8">
          <ExcalidrawViewer src="/images/debutsplan/audition.excalidraw" />
        </figure>
      </section>
    </div>
  )
}
