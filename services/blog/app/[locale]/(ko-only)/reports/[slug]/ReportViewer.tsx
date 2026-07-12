'use client'

import { useEffect } from 'react'

interface Report {
  title: string
  period: { from: string; to: string }
  sessions: number
  messages: number
  slug: string
}

export default function ReportViewer({ report }: { report: Report }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div className="flex fixed inset-0 flex-col bg-white dark:bg-gray-950">
      <div className="flex-shrink-0 px-4 py-3 bg-gray-100 border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
        <div className="flex justify-between items-center mx-auto max-w-7xl">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900 truncate dark:text-gray-100">
              {report.title}
            </h1>
            <div className="flex items-center gap-2 mt-0.5 text-sm">
              <p className="text-gray-600 dark:text-gray-400">
                {report.period.from} ~ {report.period.to}
              </p>
              <span className="text-gray-400">·</span>
              <p className="text-gray-500 dark:text-gray-500">
                {report.sessions} sessions · {report.messages.toLocaleString()} messages
              </p>
            </div>
          </div>
          <a
            href="/reports"
            className="ml-4 text-sm whitespace-nowrap text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
          >
            ← Reports
          </a>
        </div>
      </div>
      <div className="overflow-hidden flex-1">
        <iframe
          src={`/reports/${report.slug}.html`}
          className="w-full h-full border-0"
          title={report.title}
          allow="fullscreen"
        />
      </div>
    </div>
  )
}
