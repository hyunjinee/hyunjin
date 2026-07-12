import projectsData from '@/data/projectsData'
import Card from '@/components/Card'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Projects', path: '/projects' })

export default function Projects() {
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="pt-6 pb-8 space-y-2 md:space-y-5">
        <h1 className="text-3xl font-extrabold tracking-tight leading-9 text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:leading-14">
          Projects
        </h1>
        <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
          직접 설계하고 만든 제품과 오픈소스 기여들입니다.
        </p>
      </div>
      <div className="container py-12">
        <div className="flex flex-wrap -m-4">
          {projectsData.map((d) => (
            <Card key={d.title} title={d.title} description={d.description} imgSrc={d.imgSrc} href={d.href} />
          ))}
        </div>
      </div>
    </div>
  )
}
