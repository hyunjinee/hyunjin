import { genPageMetadata } from 'app/seo'
import Link from 'next/link'
import { reports } from '@/data/reportsData'

export const metadata = genPageMetadata({ title: 'Reports' })

export default function ReportsPage() {
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="pt-6 pb-8 space-y-2 md:space-y-5">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:leading-14">
          Reports
        </h1>
        <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">Claude Code Insights 리포트 모음</p>
      </div>
      <div className="container py-12">
        <div className="grid gap-4 sm:grid-cols-2">
          {reports.map((report) => (
            <Link
              key={report.slug}
              href={`/reports/${report.slug}`}
              className="block p-6 transition-shadow border border-gray-200 rounded-xl hover:shadow-lg dark:border-gray-700"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{report.title}</h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {report.period.from} ~ {report.period.to}
              </p>
              <div className="flex gap-4 mt-3 text-sm text-gray-600 dark:text-gray-300">
                <span>{report.sessions} sessions</span>
                <span>{report.messages.toLocaleString()} messages</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
