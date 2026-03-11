import { genPageMetadata } from 'app/seo'
import { notFound } from 'next/navigation'
import { reports } from '@/data/reportsData'
import ReportViewer from './ReportViewer'

export async function generateStaticParams() {
  return reports.map((report) => ({ slug: report.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const report = reports.find((r) => r.slug === slug)
  if (!report) return {}
  return genPageMetadata({
    title: `${report.title} (${report.period.from} ~ ${report.period.to})`,
    description: `${report.sessions} sessions, ${report.messages} messages`,
  })
}

export default async function ReportPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const report = reports.find((r) => r.slug === slug)

  if (!report) {
    notFound()
  }

  return <ReportViewer report={report} />
}
