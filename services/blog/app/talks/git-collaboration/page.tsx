import CustomLink from '@/components/Link'
import { genPageMetadata } from 'app/seo'
import { materials } from './materials'

export const metadata = genPageMetadata({
  title: 'Git을 활용한 협업',
  description: 'CNU SW Academy TA로 진행한 Git 협업 실습 자료 시리즈',
})

export default function GitCollaborationPage() {
  return (
    <div className="container py-8 md:py-10">
      <CustomLink
        href="/talks"
        className="inline-block mb-6 text-sm text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
      >
        ← Talks
      </CustomLink>

      {/* Hero */}
      <header className="pb-8 mb-10 border-b border-gray-200 dark:border-gray-700">
        <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl dark:text-gray-100">Git을 활용한 협업</h1>
        <p className="text-sm leading-7 text-gray-700 break-keep md:text-base dark:text-gray-300">
          충남대학교 구성원 대상 소프트웨어 교육 <strong>CNU SW Academy</strong>에서 TA로 Git·알고리즘 실습을
          진행했습니다.
          <br />
          버전 관리의 개념부터 브랜치·머지·Pull Request·커밋 컨벤션까지, 협업에 필요한 Git을 5회차 실습으로 정리한
          자료입니다.
        </p>
      </header>

      {/* Materials */}
      <section className="mb-12">
        <h2 className="pb-2 mb-8 text-2xl font-bold text-gray-900 border-b-2 border-gray-200 md:text-3xl dark:text-gray-100 dark:border-gray-700">
          실습 자료
        </h2>
        <div className="space-y-6">
          {materials.map((m, i) => (
            <div key={m.title} className="group">
              <div className="flex gap-3 items-baseline">
                <span className="text-sm font-mono text-gray-400 dark:text-gray-600">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex-1">
                  <CustomLink
                    href={`/talks/git-collaboration/${m.id}`}
                    className="text-lg font-semibold text-gray-900 transition-colors md:text-xl dark:text-gray-100 hover:text-primary-500 dark:hover:text-primary-400"
                  >
                    {m.title}
                  </CustomLink>
                  <p className="mt-1 text-sm text-gray-600 break-keep md:text-base dark:text-gray-400">
                    {m.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid gap-6 mt-10 sm:grid-cols-2">
          {[
            { id: 'VadEWpLVnGU', title: '브랜치(Branch)' },
            { id: 'elDrj5mauJU', title: '머지(Merge)' },
          ].map((v) => (
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
              <figcaption className="mt-2 text-sm text-gray-500 break-keep dark:text-gray-500">{v.title}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  )
}
